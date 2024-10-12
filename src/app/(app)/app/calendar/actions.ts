"use server";

import { validatedActionWithUser } from "@/src/lib/auth/middleware";
import { eventColorStyle } from "@/src/lib/colors";
import { db } from "@/src/lib/db/drizzle";
import { getUserWithCouple } from "@/src/lib/db/queries";

import { events, ActivityType, type NewActivityLog, activityLogs, eventsComments, users } from "@/src/lib/db/schema";
import { eq } from "drizzle-orm";

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

const createCommentSchema = z.object({
	content: z.string().min(2, "Comment is required").max(250),
	eventId: z.string().transform((value) => Number(value)),
});

export const createComment = validatedActionWithUser(createCommentSchema, async (data, _, user) => {
	const { content } = data;
	const userWithCouple = await getUserWithCouple(user.id);
	if (!userWithCouple) {
		return { error: "User is not in a couple." };
	}

	const [createdComment] = await db
		.insert(eventsComments)
		.values({
			content,
			userId: user.id,
			eventId: data.eventId,
			coupleId: userWithCouple?.coupleId as number,
		})
		.returning();
	await logActivity(userWithCouple?.coupleId, user.id, ActivityType.CREATE_COMMENT);

	return {
		success: "Comment created successfully.",
		comment: createdComment,
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

export const createEvent = validatedActionWithUser(createEventSchema, async (data, _, user) => {
	const { title, description, initialDate, finalDate, location, color, content } = data;
	const userWithCouple = await getUserWithCouple(user.id);
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

	await logActivity(userWithCouple.coupleId, user.id, ActivityType.CREATE_EVENT);
	return {
		success: "Event created successfully.",
		event: createdEvent,
	};
});

const editEventSchema = createEventSchema.extend({
	eventId: z.string().transform((value) => Number(value)),
});

export const updateEvent = validatedActionWithUser(editEventSchema, async (data, _, user) => {
	const { title, description, initialDate, finalDate, location, color, content } = data;
	const userWithCouple = await getUserWithCouple(user.id);
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

	await logActivity(userWithCouple.coupleId, user.id, ActivityType.CREATE_EVENT);
	return {
		success: "Event updated successfully.",
		event: updatedEvent,
	};
});
