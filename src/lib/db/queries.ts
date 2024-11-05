import { auth } from "@/auth";
import { and, asc, desc, eq, gte, lte } from "drizzle-orm";
import { db } from "./drizzle";
import { events, activityLogs, coupleMembers, couples, eventsComments, users } from "./schema";

const getDateRange = (date: Date): { startOfRange: Date; endOfRange: Date } => {
	const currentYear = date.getFullYear();
	const currentMonth = date.getMonth();

	const isJanuary = currentMonth === 0;
	const isDecember = currentMonth === 11;

	const startYear = isJanuary ? currentYear - 1 : currentYear;
	const endYear = isDecember ? currentYear + 1 : currentYear;

	return {
		startOfRange: new Date(startYear, 0, 1),
		endOfRange: new Date(endYear, 11, 0, 23, 59, 59, 999),
	};
};

export async function getCoupleByStripeCustomerId(customerId: string) {
	const result = await db.select().from(couples).where(eq(couples.stripeCustomerId, customerId)).limit(1);

	return result.length > 0 ? result[0] : null;
}

export async function updateCoupleSubscription(
	coupleId: number,
	subscriptionData: {
		stripeSubscriptionId: string | null;
		stripeProductId: string | null;
		planName: string | null;
		subscriptionStatus: string;
	},
) {
	await db
		.update(couples)
		.set({
			...subscriptionData,
			updatedAt: new Date(),
		})
		.where(eq(couples.id, coupleId));
}

export async function getUserWithCouple(userId: string) {
	const result = await db
		.select({
			user: users,
			coupleId: coupleMembers.coupleId,
			coupleName: couples.name,
			coupleType: couples.type,
		})
		.from(users)
		.leftJoin(coupleMembers, eq(users.id, coupleMembers.userId))
		.leftJoin(couples, eq(coupleMembers.coupleId, couples.id))
		.where(eq(users.id, userId))
		.limit(1);

	return result[0];
}

export async function getActivityLogs() {
	const session = await auth();
	const user = session?.user;
	if (!session || !user) {
		throw new Error("User not authenticated");
	}

	return await db
		.select({
			id: activityLogs.id,
			action: activityLogs.action,
			timestamp: activityLogs.timestamp,
			ipAddress: activityLogs.ipAddress,
			userName: users.name,
		})
		.from(activityLogs)
		.leftJoin(users, eq(activityLogs.userId, users.id))
		.where(eq(activityLogs.userId, user.id as string))
		.orderBy(desc(activityLogs.timestamp))
		.limit(10);
}

export async function getEvents(date: Date) {
	const session = await auth();
	const user = session?.user;
	if (!session || !user) {
		throw new Error("User not authenticated");
	}

	const { startOfRange, endOfRange } = getDateRange(date);

	return await db
		.select({
			id: events.id,
			initialDate: events.initialDate,
			finalDate: events.finalDate,
			location: events.location,
			description: events.description,
			coupleId: events.coupleId,
			color: events.color,
			title: events.title,
			content: events.content,
		})
		.from(events)
		.leftJoin(couples, eq(events.coupleId, couples.id))
		.leftJoin(coupleMembers, eq(couples.id, coupleMembers.coupleId))
		.where(
			and(
				eq(coupleMembers.userId, user?.id as string),
				gte(events.initialDate, startOfRange),
				lte(events.initialDate, endOfRange),
			),
		)
		.orderBy(asc(events.initialDate));
}
export async function getAllEvents() {
	const session = await auth();
	const user = session?.user;
	if (!session || !user) {
		throw new Error("User not authenticated");
	}

	return await db
		.select({
			id: events.id,
			initialDate: events.initialDate,
			finalDate: events.finalDate,
			location: events.location,
			description: events.description,
			coupleId: events.coupleId,
			color: events.color,
			title: events.title,
			content: events.content,
		})
		.from(events)
		.leftJoin(couples, eq(events.coupleId, couples.id))
		.leftJoin(coupleMembers, eq(couples.id, coupleMembers.coupleId))
		.where(and(eq(coupleMembers.userId, user?.id as string)))
		.orderBy(asc(events.initialDate));
}

export async function getUpcomingEvents() {
	const session = await auth();
	if (!session) {
		throw new Error("User not authenticated");
	}

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	return await db
		.select({
			id: events.id,
			initialDate: events.initialDate,
			finalDate: events.finalDate,
			location: events.location,
			description: events.description,
			coupleId: events.coupleId,
		})
		.from(events)
		.leftJoin(couples, eq(events.coupleId, couples.id))
		.where(gte(events.initialDate, today))
		.orderBy(asc(events.initialDate))
		.limit(5);
}

export async function getEventComments() {
	return await db
		.select({
			id: eventsComments.id,
			content: eventsComments.content,
			createdAt: eventsComments.createdAt,
			userId: eventsComments.userId,
			userName: users.name,
			eventId: eventsComments.eventId,
		})
		.from(eventsComments)
		.leftJoin(users, eq(eventsComments.userId, users.id))
		.orderBy(desc(eventsComments.createdAt));
}

export async function getSubscription() {
	const session = await auth();
	const user = session?.user;

	if (!user) {
		throw new Error("User not authenticated");
	}

	return await db
		.select({
			stripeSubscriptionId: couples.stripeSubscriptionId,
			stripeProductId: couples.stripeProductId,
			planName: couples.planName,
			subscriptionStatus: couples.subscriptionStatus,
			name: couples.name,
		})
		.from(couples)
		.leftJoin(coupleMembers, eq(couples.id, coupleMembers.coupleId))
		.where(eq(coupleMembers.userId, user.id as string))
		.limit(1);
}

export async function getCoupleForUser(userId: string) {
	const result = await db.query.users.findFirst({
		where: eq(users.id, userId),
		with: {
			coupleMembers: {
				with: {
					couple: {
						with: {
							coupleMembers: {
								with: {
									user: {
										columns: {
											id: true,
											name: true,
											email: true,
										},
									},
								},
							},
						},
					},
				},
			},
		},
	});

	return result?.coupleMembers[0]?.couple || null;
}
