"use server";

import { validatedActionWithUser } from "@/lib/auth/middleware";
import { eventColorStyle } from "@/lib/colors";
import { db } from "@/lib/db/drizzle";
import { getUserWithCouple } from "@/lib/db/queries";

import { events, ActivityType, type NewActivityLog, activityLogs, eventsComments, users } from "@/lib/db/schema";
import type { EventCommentWithUser } from "@/types/comments";
import { and, eq } from "drizzle-orm";

import { auth } from "@/auth";
import { actionClient } from "@/lib/safe-action";
import { z } from "zod";
import { logActivity } from "../actions";

const createCommentSchema = z.object({
	content: z.string().min(2, "Comment is required").max(250),
	eventId: z.string().transform((value) => Number(value)),
});

export const createComment = validatedActionWithUser(createCommentSchema, async (data, _, user) => {
	const { content } = data;
	const userWithCouple = await getUserWithCouple(user.id as string);

	if (!userWithCouple) {
		return { error: "User is not in a couple." };
	}

	const [createdComment] = await db
		.insert(eventsComments)
		.values({
			content,
			userId: user.id as string,
			eventId: data.eventId,
			coupleId: userWithCouple?.coupleId as number,
		})
		.returning();
	await logActivity(userWithCouple?.coupleId, user.id as string, ActivityType.CREATE_COMMENT);

	return {
		success: "Comment created successfully.",
		comment: createdComment as unknown as EventCommentWithUser,
	};
});

const removeCommentSchema = z.object({
	commentId: z.number(),
});

export const removeCommentAction = actionClient
	.schema(removeCommentSchema)
	.action(async ({ parsedInput: { commentId } }) => {
		const session = await auth();
		const user = session?.user;
		if (!user) {
			return { error: "User is not authenticated." };
		}
		const userWithCouple = await getUserWithCouple(user.id as string);

		if (!userWithCouple) {
			return { error: "User is not in a couple." };
		}

		// Check if the comment belongs to the user
		const comment = await db.query.eventsComments.findFirst({
			where: and(eq(eventsComments.id, commentId), eq(eventsComments.userId, user.id)),
		});

		if (!comment) {
			return { error: "Comment not found or you don't have permission to delete it." };
		}

		// Delete the comment
		await db.delete(eventsComments).where(eq(eventsComments.id, commentId));
		await logActivity(userWithCouple?.coupleId, user.id as string, ActivityType.DELETE_COMMENT);

		return {
			success: "Comment deleted successfully.",
		};
	});

const createEventSchema = z.object({
	title: z.string().min(2, "Title is required").max(250),
	description: z.string().min(5, "Description is required").max(250).optional().or(z.literal("")),
	initialDate: z.string(),
	finalDate: z.string(),
	location: z.string().min(2, "Location is required").max(250).optional().or(z.literal("")),
	color: z.enum(Object.keys(eventColorStyle) as [string, ...string[]]),
	content: z.string(),
});

export const createEventAction = validatedActionWithUser(createEventSchema, async (data, _, user) => {
	const { title, description, initialDate, finalDate, location, color, content } = data;
	const userWithCouple = await getUserWithCouple(user.id as string);
	if (!userWithCouple) {
		return { error: "User is not in a couple." };
	}
	const [createdEvent] = await db
		.insert(events)
		.values({
			title,
			description,
			initialDate: new Date(initialDate),
			finalDate: new Date(finalDate),
			location,
			color,
			coupleId: userWithCouple.coupleId as number,
			content: JSON.parse(content),
		})
		.returning();

	await logActivity(userWithCouple.coupleId, user.id as string, ActivityType.CREATE_EVENT);
	return {
		success: "Event created successfully.",
		event: createdEvent,
	};
});

const editEventSchema = createEventSchema.extend({
	eventId: z.string().transform((value) => Number(value)),
});

export const updateEventAction = validatedActionWithUser(editEventSchema, async (data, _, user) => {
	const { title, description, initialDate, finalDate, location, color, content } = data;
	const userWithCouple = await getUserWithCouple(user.id as string);
	if (!userWithCouple) {
		return { error: "User is not in a couple." };
	}
	const [updatedEvent] = await db
		.update(events)
		.set({
			title,
			description,
			initialDate: new Date(initialDate),
			finalDate: new Date(finalDate),
			location,
			color,
			coupleId: userWithCouple.coupleId as number,
			content: JSON.parse(content),
		})
		.where(eq(events.id, data.eventId))
		.returning();

	await logActivity(userWithCouple.coupleId, user.id as string, ActivityType.CREATE_EVENT);
	return {
		success: "Event updated successfully.",
		event: updatedEvent,
	};
});
