"use server";

import { logActivity } from "@/app/(app)/app/actions";
import { validatedAction, validatedActionWithUser } from "@/lib/auth/middleware";
import { comparePasswords, hashPassword } from "@/lib/auth/session";
import { db } from "@/lib/db/drizzle";
import { getUserWithCouple } from "@/lib/db/queries";
import {
	ActivityType,
	type NewCouple,
	type NewCoupleMember,
	type NewUser,
	coupleMembers,
	couples,
	invitations,
	users,
} from "@/lib/db/schema";

import { and, eq, sql } from "drizzle-orm";
import { signOut } from "next-auth/react";

import { z } from "zod";

const signUpSchema = z.object({
	email: z.string().email("Please enter a valid email address"),
	password: z
		.string()
		.min(8, "Password must be at least 8 characters long")
		.max(100, "Password must not exceed 100 characters")
		.regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
			"Password must contain at least one uppercase letter, one lowercase letter, and one number and be at least 8 characters long",
		),
	inviteId: z.string().optional(),
	name: z.string().min(2, "Name must be at least 2 characters long").max(100, "Name must not exceed 100 characters"),
});

export const signUp = validatedAction(signUpSchema, async (data, formData) => {
	const { email, password, inviteId, name } = data;

	const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);

	if (existingUser.length > 0) {
		return { error: "Failed to create user. Please try again." };
	}

	const passwordHash = await hashPassword(password.trim());

	const newUser: NewUser = {
		email: email.toLowerCase().trim(),
		password: passwordHash,
		role: "owner", // Default role, will be overridden if there's an invitation
		name,
	};

	const [createdUser] = await db.insert(users).values(newUser).returning();

	if (!createdUser) {
		return { error: "Failed to create user. Please try again." };
	}

	let coupleId: number;
	let userRole: string;
	let createdCouple: typeof couples.$inferSelect | null = null;

	if (inviteId) {
		// Check if there's a valid invitation
		const [invitation] = await db
			.select()
			.from(invitations)
			.where(
				and(
					eq(invitations.id, Number.parseInt(inviteId)),
					eq(invitations.email, email.toLowerCase().trim()),
					eq(invitations.status, "pending"),
				),
			)
			.limit(1);

		if (invitation) {
			coupleId = invitation.coupleId;
			userRole = invitation.role;

			await db.update(invitations).set({ status: "accepted" }).where(eq(invitations.id, invitation.id));

			await logActivity(coupleId, createdUser.id, ActivityType.ACCEPT_INVITATION);

			[createdCouple] = await db.select().from(couples).where(eq(couples.id, coupleId)).limit(1);
		} else {
			return { error: "Invalid or expired invitation." };
		}
	} else {
		// Create a new couple if there's no invitation
		const newCouple: NewCouple = {
			name: `${name}'s Couple`,
		};

		[createdCouple] = await db.insert(couples).values(newCouple).returning();

		if (!createdCouple) {
			return { error: "Failed to create couple. Please try again." };
		}

		coupleId = createdCouple.id;
		userRole = "owner";

		await logActivity(coupleId, createdUser.id, ActivityType.CREATE_COUPLE);
	}

	const newCoupleMember: NewCoupleMember = {
		userId: createdUser.id,
		coupleId: coupleId,
		role: userRole,
	};

	await Promise.all([
		db.insert(coupleMembers).values(newCoupleMember),
		logActivity(coupleId, createdUser.id, ActivityType.SIGN_UP),
	]);

	return { success: true };
});

const updatePasswordSchema = z
	.object({
		currentPassword: z
			.string()
			.min(8, "Current password must be at least 8 characters long")
			.max(100, "Current password must not exceed 100 characters"),
		newPassword: z
			.string()
			.min(8, "New password must be at least 8 characters long")
			.max(100, "New password must not exceed 100 characters")
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
				"New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
			),
		confirmPassword: z
			.string()
			.min(8, "Confirm password must be at least 8 characters long")
			.max(100, "Confirm password must not exceed 100 characters"),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "New password and confirm password don't match",
		path: ["confirmPassword"],
	});

export const updatePassword = validatedActionWithUser(updatePasswordSchema, async (data, _, user) => {
	const { currentPassword, newPassword } = data;

	const userWithPass = await db
		.select()
		.from(users)
		.where(eq(users.id, user.id as string))
		.limit(1);

	if (!userWithPass[0]) {
		return { error: "User does not have a password." };
	}

	const isPasswordValid = await comparePasswords(currentPassword, userWithPass[0]?.password as string);

	if (!isPasswordValid) {
		return { error: "Current password is incorrect." };
	}

	if (currentPassword === newPassword) {
		return {
			error: "New password must be different from the current password.",
		};
	}

	const newPasswordHash = await hashPassword(newPassword);
	const userWithCouple = await getUserWithCouple(user.id as string);

	await Promise.all([
		db
			.update(users)
			.set({ password: newPasswordHash })
			.where(eq(users.id, user.id as string)),
		logActivity(userWithCouple?.coupleId, user.id as string, ActivityType.UPDATE_PASSWORD),
	]);

	return { success: "Password updated successfully." };
});

const deleteAccountSchema = z.object({
	password: z.string().min(8, "Password must be at least 8 characters long").max(100),
});

export const deleteAccount = validatedActionWithUser(deleteAccountSchema, async (data, _, user) => {
	if (!user) {
		return { error: "User not authenticated" };
	}
	const { password } = data;

	const userWithPass = await db
		.select()
		.from(users)
		.where(eq(users.id, user.id as string))
		.limit(1);

	if (!userWithPass[0]) {
		return { error: "User does not have a password." };
	}

	const isPasswordValid = await comparePasswords(password, userWithPass[0].password as string);

	if (!isPasswordValid) {
		return { error: "Incorrect password. Account deletion failed." };
	}

	const userWithCouple = await getUserWithCouple(user.id as string);

	await logActivity(userWithCouple?.coupleId, user.id as string, ActivityType.DELETE_ACCOUNT);

	// Soft delete
	await db
		.update(users)
		.set({
			deletedAt: sql`CURRENT_TIMESTAMP`,
			email: sql`CONCAT(email, '-', id, '-deleted')`, // Ensure email uniqueness
		})
		.where(eq(users.id, user.id as string));

	if (userWithCouple?.coupleId) {
		await db
			.delete(coupleMembers)
			.where(and(eq(coupleMembers.userId, user.id as string), eq(coupleMembers.coupleId, userWithCouple.coupleId)));
	}

	await signOut({
		redirect: true,
		callbackUrl: "/auth/sign-in",
	});
	return { success: "Account deleted successfully." };
});

const updateAccountSchema = z.object({
	name: z.string().min(1, "Name is required").max(100, "Name must not exceed 100 characters"),
	email: z.string().email("Please enter a valid email address"),
});

export const updateAccount = validatedActionWithUser(updateAccountSchema, async (data, _, user) => {
	const { name, email } = data;
	const userWithCouple = await getUserWithCouple(user.id as string);

	await Promise.all([
		db
			.update(users)
			.set({ name, email })
			.where(eq(users.id, user.id as string)),
		logActivity(userWithCouple?.coupleId, user.id as string, ActivityType.UPDATE_ACCOUNT),
	]);

	return { success: "Account updated successfully." };
});

const removeCoupleMemberSchema = z.object({
	memberId: z.string().uuid("Member ID must be a UUID"),
});

export const removeCoupleMember = validatedActionWithUser(removeCoupleMemberSchema, async (data, _, user) => {
	const { memberId } = data;
	const userWithCouple = await getUserWithCouple(user.id as string);

	if (!userWithCouple?.coupleId) {
		return { error: "User is not part of a couple" };
	}

	await db
		.delete(coupleMembers)
		.where(and(eq(coupleMembers.userId, memberId), eq(coupleMembers.coupleId, userWithCouple.coupleId)));

	await logActivity(userWithCouple.coupleId, user.id as string, ActivityType.REMOVE_COUPLE_MEMBER);

	return { success: "Couple member removed successfully" };
});
