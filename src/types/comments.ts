import type { EventComment } from "@/src/lib/db/schema";

export interface EventCommentWithUser {
	id: number;
	content: string;
	createdAt: Date;
	userId: number;
	userName: string | null;
	eventId: number;
}
