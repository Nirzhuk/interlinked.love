import { relations } from "drizzle-orm";
import {
	boolean,
	integer,
	json,
	pgEnum,
	pgTable,
	primaryKey,
	serial,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";
import type { AdapterAccount } from "next-auth/adapters";

export const coupleEnum = pgEnum("couple_type", ["couple", "group"]);
export const invitationStatusEnum = pgEnum("invitation_status", ["pending", "accepted", "declined", "cancelled"]);

export const users = pgTable("users", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: varchar("name", { length: 100 }).notNull(),
	password: text("password"),
	email: varchar("email", { length: 255 }).notNull().unique(),
	emailVerified: timestamp("emailVerified", { mode: "date" }),
	image: text("image"),
	role: varchar("role", { length: 20 }).notNull().default("member"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
	deletedAt: timestamp("deleted_at"),
});

export const accounts = pgTable(
	"account",
	{
		userId: text("userId")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		type: text("type").$type<AdapterAccount>().notNull(),
		provider: text("provider").notNull(),
		providerAccountId: text("providerAccountId").notNull(),
		refresh_token: text("refresh_token"),
		access_token: text("access_token"),
		expires_at: integer("expires_at"),
		token_type: text("token_type"),
		scope: text("scope"),
		id_token: text("id_token"),
		session_state: text("session_state"),
	},
	(account) => ({
		compoundKey: primaryKey({
			columns: [account.provider, account.providerAccountId],
		}),
	}),
);

export const sessions = pgTable("session", {
	sessionToken: text("sessionToken").primaryKey(),
	userId: text("userId")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
	"verificationToken",
	{
		identifier: text("identifier").notNull(),
		token: text("token").notNull(),
		expires: timestamp("expires", { mode: "date" }).notNull(),
	},
	(verificationToken) => ({
		compositePk: primaryKey({
			columns: [verificationToken.identifier, verificationToken.token],
		}),
	}),
);

export const authenticators = pgTable(
	"authenticator",
	{
		credentialID: text("credentialID").notNull().unique(),
		userId: text("userId")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		providerAccountId: text("providerAccountId").notNull(),
		credentialPublicKey: text("credentialPublicKey").notNull(),
		counter: integer("counter").notNull(),
		credentialDeviceType: text("credentialDeviceType").notNull(),
		credentialBackedUp: boolean("credentialBackedUp").notNull(),
		transports: text("transports"),
	},
	(authenticator) => ({
		compositePK: primaryKey({
			columns: [authenticator.userId, authenticator.credentialID],
		}),
	}),
);

export const couples = pgTable("couples", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 100 }).notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
	stripeCustomerId: text("stripe_customer_id").unique(),
	stripeSubscriptionId: text("stripe_subscription_id").unique(),
	stripeProductId: text("stripe_product_id"),
	planName: varchar("plan_name", { length: 50 }),
	subscriptionStatus: varchar("subscription_status", { length: 20 }),
	type: coupleEnum("type").notNull().default("couple"),
});

export const coupleMembers = pgTable("couple_members", {
	id: serial("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => users.id),
	coupleId: integer("couple_id")
		.notNull()
		.references(() => couples.id),
	role: varchar("role", { length: 50 }).notNull(),
	joinedAt: timestamp("joined_at").notNull().defaultNow(),
});

export const events = pgTable("events", {
	id: serial("id").primaryKey(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
	initialDate: timestamp("initial_date").notNull(),
	finalDate: timestamp("final_date").notNull(),
	location: text("location"),
	description: text("description"),
	content: json("content").notNull().default({
		type: "doc",
		content: [],
	}),
	title: text("title").notNull().default("Event"),
	color: text("color").notNull().default("violet"),
	coupleId: integer("couple_id")
		.notNull()
		.references(() => couples.id),
});

export const eventsComments = pgTable("events_comments", {
	id: serial("id").primaryKey(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
	content: text("content").notNull().default(""),
	eventId: integer("event_id")
		.notNull()
		.references(() => events.id),
	userId: text("user_id")
		.notNull()
		.references(() => users.id),
	coupleId: integer("couple_id")
		.notNull()
		.references(() => couples.id),
});

export const activityLogs = pgTable("activity_logs", {
	id: serial("id").primaryKey(),
	coupleId: integer("couple_id")
		.notNull()
		.references(() => couples.id),
	userId: text("user_id").references(() => users.id),
	action: text("action").notNull(),
	timestamp: timestamp("timestamp").notNull().defaultNow(),
	ipAddress: varchar("ip_address", { length: 45 }),
});

export const invitations = pgTable("invitations", {
	id: serial("id").primaryKey(),
	coupleId: integer("couple_id")
		.notNull()
		.references(() => couples.id),
	email: varchar("email", { length: 255 }).notNull(),
	role: varchar("role", { length: 50 }).notNull(),
	invitedBy: text("invited_by")
		.notNull()
		.references(() => users.id),
	invitedAt: timestamp("invited_at").notNull().defaultNow(),
	status: invitationStatusEnum("status").notNull().default("pending"),
});

export const couplesRelations = relations(couples, ({ many }) => ({
	coupleMembers: many(coupleMembers),
	activityLogs: many(activityLogs),
	invitations: many(invitations),
}));

export const usersRelations = relations(users, ({ many }) => ({
	coupleMembers: many(coupleMembers),
	invitationsSent: many(invitations),
	accounts: many(accounts),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
	user: one(users, {
		fields: [accounts.userId],
		references: [users.id],
	}),
}));
export const invitationsRelations = relations(invitations, ({ one }) => ({
	couple: one(couples, {
		fields: [invitations.coupleId],
		references: [couples.id],
	}),
	invitedBy: one(users, {
		fields: [invitations.invitedBy],
		references: [users.id],
	}),
}));

export const coupleMembersRelations = relations(coupleMembers, ({ one }) => ({
	user: one(users, {
		fields: [coupleMembers.userId],
		references: [users.id],
	}),
	couple: one(couples, {
		fields: [coupleMembers.coupleId],
		references: [couples.id],
	}),
}));

export const eventsRelations = relations(events, ({ one, many }) => ({
	couple: one(couples, {
		fields: [events.coupleId],
		references: [couples.id],
	}),
	comments: many(eventsComments),
}));

export const eventsCommentsRelations = relations(eventsComments, ({ one }) => ({
	event: one(events, {
		fields: [eventsComments.eventId],
		references: [events.id],
	}),
	user: one(users, {
		fields: [eventsComments.userId],
		references: [users.id],
	}),
	couple: one(couples, {
		fields: [eventsComments.coupleId],
		references: [couples.id],
	}),
}));

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
	couple: one(couples, {
		fields: [activityLogs.coupleId],
		references: [couples.id],
	}),
	user: one(users, {
		fields: [activityLogs.userId],
		references: [users.id],
	}),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Couple = typeof couples.$inferSelect;
export type NewCouple = typeof couples.$inferInsert;
export type CoupleMember = typeof coupleMembers.$inferSelect;
export type NewCoupleMember = typeof coupleMembers.$inferInsert;
export type ActivityLog = typeof activityLogs.$inferSelect;
export type NewActivityLog = typeof activityLogs.$inferInsert;
export type Invitation = typeof invitations.$inferSelect;
export type NewInvitation = typeof invitations.$inferInsert;
export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
export type EventComment = typeof eventsComments.$inferSelect;
export type NewEventComment = typeof eventsComments.$inferInsert;
export type CoupleType = (typeof coupleEnum.enumValues)[number];
export type InvitationStatus = (typeof invitationStatusEnum.enumValues)[number];

export type CoupleDataWithMembers = Couple & {
	coupleMembers: (CoupleMember & {
		user: Pick<User, "id" | "name" | "email">;
	})[];
};

export enum ActivityType {
	SIGN_UP = "SIGN_UP",
	SIGN_IN = "SIGN_IN",
	SIGN_OUT = "SIGN_OUT",
	UPDATE_PASSWORD = "UPDATE_PASSWORD",
	DELETE_ACCOUNT = "DELETE_ACCOUNT",
	UPDATE_ACCOUNT = "UPDATE_ACCOUNT",
	CREATE_COUPLE = "CREATE_COUPLE",
	REMOVE_COUPLE_MEMBER = "REMOVE_COUPLE_MEMBER",
	INVITE_COUPLE_MEMBER = "INVITE_COUPLE_MEMBER",
	ACCEPT_INVITATION = "ACCEPT_INVITATION",
	CREATE_COMMENT = "CREATE_COMMENT",
	DELETE_COMMENT = "DELETE_COMMENT",
	DELETE_EVENT = "DELETE_EVENT",
	UPDATE_EVENT = "UPDATE_EVENT",
	CREATE_EVENT = "CREATE_EVENT",
}
