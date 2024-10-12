"use server";

import { validatedAction, validatedActionWithUser } from "@/src/lib/auth/middleware";
import { comparePasswords, hashPassword, setSession } from "@/src/lib/auth/session";
import { db } from "@/src/lib/db/drizzle";
import { getUser, getUserWithCouple } from "@/src/lib/db/queries";
import {
	ActivityType,
	type NewActivityLog,
	type NewCouple,
	type NewCoupleMember,
	type NewUser,
	type User,
	activityLogs,
	coupleMembers,
	couples,
	invitations,
	users,
} from "@/src/lib/db/schema";
import { createCheckoutSession } from "@/src/lib/payments/stripe";
import { and, eq, sql } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

async function logActivity(
	coupleId: number | null | undefined,
	userId: number,
	type: ActivityType,
	ipAddress?: string,
) {
	if (coupleId === null || coupleId === undefined) {
		return;
	}
	const newActivity: NewActivityLog = {
		coupleId,
		userId,
		action: type,
		ipAddress: ipAddress || "",
	};
	await db.insert(activityLogs).values(newActivity);
}

const signInSchema = z.object({
	email: z
		.string()
		.email("Please enter a valid email address")
		.min(3, "Email must be at least 3 characters long")
		.max(255, "Email must not exceed 255 characters"),
	password: z
		.string()
		.min(8, "Password must be at least 8 characters long")
		.max(100, "Password must not exceed 100 characters"),
});

export const signIn = validatedAction(signInSchema, async (data, formData) => {
	const { email, password } = data;

	const userWithCouple = await db
		.select({
			user: users,
			couple: couples,
		})
		.from(users)
		.leftJoin(coupleMembers, eq(users.id, coupleMembers.userId))
		.leftJoin(couples, eq(coupleMembers.coupleId, couples.id))
		.where(eq(users.email, email))
		.limit(1);

	if (!userWithCouple) {
		return { error: "Invalid email or password. Please try again." };
	}

	const { user: foundUser, couple: foundCouple } = userWithCouple[0];

	const isPasswordValid = await comparePasswords(password, foundUser.passwordHash);

	if (!isPasswordValid) {
		return { error: "Invalid email or password. Please try again." };
	}

	await Promise.all([setSession(foundUser), logActivity(foundCouple?.id, foundUser.id, ActivityType.SIGN_IN)]);

	const redirectTo = formData.get("redirect") as string | null;
	if (redirectTo === "checkout") {
		const priceId = formData.get("priceId") as string;
		return createCheckoutSession({ couple: foundCouple, priceId });
	}

	return { success: "/app" };
});

const signUpSchema = z.object({
	email: z.string().email("Please enter a valid email address"),
	password: z
		.string()
		.min(8, "Password must be at least 8 characters long")
		.max(100, "Password must not exceed 100 characters")
		.regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
			"Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
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

	const passwordHash = await hashPassword(password);

	const newUser: NewUser = {
		email: email.toLowerCase().trim(),
		passwordHash,
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

	await setSession(createdUser);
	const redirectTo = formData.get("redirect") as string | null;
	if (redirectTo === "checkout") {
		const priceId = formData.get("priceId") as string;
		return createCheckoutSession({ couple: createdCouple, priceId });
	}

	return { success: "/app" };
});

export async function signOut() {
	const user = (await getUser()) as User;
	const userWithCouple = await getUserWithCouple(user.id);
	await logActivity(userWithCouple?.coupleId, user.id, ActivityType.SIGN_OUT);
	cookies().delete("session");
}

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
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
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

	const isPasswordValid = await comparePasswords(currentPassword, user.passwordHash);

	if (!isPasswordValid) {
		return { error: "Current password is incorrect." };
	}

	if (currentPassword === newPassword) {
		return {
			error: "New password must be different from the current password.",
		};
	}

	const newPasswordHash = await hashPassword(newPassword);
	const userWithCouple = await getUserWithCouple(user.id);

	await Promise.all([
		db.update(users).set({ passwordHash: newPasswordHash }).where(eq(users.id, user.id)),
		logActivity(userWithCouple?.coupleId, user.id, ActivityType.UPDATE_PASSWORD),
	]);

	return { success: "Password updated successfully." };
});

const deleteAccountSchema = z.object({
	password: z.string().min(8, "Password must be at least 8 characters long").max(100),
});

export const deleteAccount = validatedActionWithUser(deleteAccountSchema, async (data, _, user) => {
	const { password } = data;

	const isPasswordValid = await comparePasswords(password, user.passwordHash);
	if (!isPasswordValid) {
		return { error: "Incorrect password. Account deletion failed." };
	}

	const userWithCouple = await getUserWithCouple(user.id);

	await logActivity(userWithCouple?.coupleId, user.id, ActivityType.DELETE_ACCOUNT);

	// Soft delete
	await db
		.update(users)
		.set({
			deletedAt: sql`CURRENT_TIMESTAMP`,
			email: sql`CONCAT(email, '-', id, '-deleted')`, // Ensure email uniqueness
		})
		.where(eq(users.id, user.id));

	if (userWithCouple?.coupleId) {
		await db
			.delete(coupleMembers)
			.where(and(eq(coupleMembers.userId, user.id), eq(coupleMembers.coupleId, userWithCouple.coupleId)));
	}

	cookies().delete("session");
	redirect("/sign-in");
});

const updateAccountSchema = z.object({
	name: z.string().min(1, "Name is required").max(100, "Name must not exceed 100 characters"),
	email: z.string().email("Please enter a valid email address"),
});

export const updateAccount = validatedActionWithUser(updateAccountSchema, async (data, _, user) => {
	const { name, email } = data;
	const userWithCouple = await getUserWithCouple(user.id);

	await Promise.all([
		db.update(users).set({ name, email }).where(eq(users.id, user.id)),
		logActivity(userWithCouple?.coupleId, user.id, ActivityType.UPDATE_ACCOUNT),
	]);

	return { success: "Account updated successfully." };
});

const removeCoupleMemberSchema = z.object({
	memberId: z.number().int("Member ID must be an integer"),
});

export const removeCoupleMember = validatedActionWithUser(removeCoupleMemberSchema, async (data, _, user) => {
	const { memberId } = data;
	const userWithCouple = await getUserWithCouple(user.id);

	if (!userWithCouple?.coupleId) {
		return { error: "User is not part of a couple" };
	}

	await db
		.delete(coupleMembers)
		.where(and(eq(coupleMembers.id, memberId), eq(coupleMembers.coupleId, userWithCouple.coupleId)));

	await logActivity(userWithCouple.coupleId, user.id, ActivityType.REMOVE_COUPLE_MEMBER);

	return { success: "Couple member removed successfully" };
});

const inviteCoupleMemberSchema = z.object({
	email: z.string().email("Please enter a valid email address for the invitation"),
	role: z.enum(["member", "owner"], {
		errorMap: () => ({ message: "Invalid role. Must be either 'member' or 'owner'" }),
	}),
});

export const inviteCoupleMember = validatedActionWithUser(inviteCoupleMemberSchema, async (data, _, user) => {
	const { email, role } = data;
	const userWithCouple = await getUserWithCouple(user.id);

	if (!userWithCouple?.coupleId) {
		return { error: "User is not part of a couple" };
	}

	const existingMember = await db
		.select()
		.from(users)
		.leftJoin(coupleMembers, eq(users.id, coupleMembers.userId))
		.where(and(eq(users.email, email), eq(coupleMembers.coupleId, userWithCouple.coupleId)))
		.limit(1);

	if (existingMember.length > 0) {
		return { error: "User is already a member of this couple" };
	}

	// Check if there's an existing invitation
	const existingInvitation = await db
		.select()
		.from(invitations)
		.where(
			and(
				eq(invitations.email, email),
				eq(invitations.coupleId, userWithCouple.coupleId),
				eq(invitations.status, "pending"),
			),
		)
		.limit(1);

	if (existingInvitation.length > 0) {
		return { error: "An invitation has already been sent to this email" };
	}

	// Create a new invitation
	const [invitation] = await db
		.insert(invitations)
		.values({
			coupleId: userWithCouple.coupleId,
			email,
			role,
			invitedBy: user.id,
			status: "pending",
		})
		.returning();

	await logActivity(userWithCouple.coupleId, user.id, ActivityType.INVITE_COUPLE_MEMBER);

	// TODO: Send invitation email and include ?inviteId={id} to sign-up URL
	// await sendInvitationEmail(email, userWithCouple.couple.name, role)

	return { inviteId: invitation.id, success: "Invitation sent successfully" };
});
