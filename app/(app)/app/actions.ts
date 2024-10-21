"use server"; // don't forget to add this!

import { auth } from "@/auth";
import { validatedActionWithUser } from "@/lib/auth/middleware";
import { db } from "@/lib/db/drizzle";
import { getUserWithCouple } from "@/lib/db/queries";
import {
	ActivityType,
	type NewActivityLog,
	activityLogs,
	coupleMembers,
	couples,
	invitations,
	users,
} from "@/lib/db/schema";
import { actionClient } from "@/lib/safe-action";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

const schema = z.object({
	type: z.enum(["couple", "family", "friends", "other"]),
});

export async function logActivity(
	coupleId: number | null | undefined,
	userId: string,
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

export const changeCoupleType = actionClient.schema(schema).action(async ({ parsedInput: { type } }) => {
	const session = await auth();
	const user = session?.user;
	if (!user) {
		return { error: "User is not authenticated." };
	}
	const userWithCouple = await getUserWithCouple(user.id as string);
	if (!userWithCouple) {
		return { error: "User is not in a couple." };
	}
	if (userWithCouple.coupleType === type) {
		return { error: "Couple type is already set to this type." };
	}
	if (userWithCouple.user.role !== "owner") {
		return { error: "Only the owner can change the couple type." };
	}

	await db
		.update(couples)
		.set({ type })
		.where(eq(couples.id, userWithCouple.coupleId as number));

	return {
		success: "Successfully changed couple type.",
	};
});

const inviteCoupleMemberSchema = z.object({
	email: z.string().email("Please enter a valid email address for the invitation"),
	role: z.enum(["member", "owner"], {
		errorMap: () => ({ message: "Invalid role. Must be either 'member' or 'owner'" }),
	}),
});

export const inviteCoupleMember = validatedActionWithUser(inviteCoupleMemberSchema, async (data, _, user) => {
	const { email, role } = data;
	const userWithCouple = await getUserWithCouple(user.id as string);

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
			invitedBy: user.id as string,
			status: "pending",
		})
		.returning();

	await logActivity(userWithCouple.coupleId, user.id as string, ActivityType.INVITE_COUPLE_MEMBER);

	// TODO: Send invitation email and include ?inviteId={id} to sign-up URL
	// await sendInvitationEmail(email, userWithCouple.couple.name, role)

	return { inviteId: invitation.id, success: "Invitation sent successfully" };
});
