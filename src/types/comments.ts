import type { EventComment } from "@/lib/db/schema";

export interface EventCommentWithUser {
	id: number;
	content: string;
	createdAt: Date;
	userId: string;
	userName: string | null;
	eventId: number;
}
