"use client";

import Comments from "@/src/components/Dashboard/Comments";
import NewCommentForm from "@/src/components/Dashboard/Forms/NewCommentForm";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/src/components/ui/dialog";
import { useCalendar } from "@/src/contexts/CalendarContext/CalendarContext";
import { useUser } from "@/src/lib/auth";
import type { Event } from "@/src/lib/db/schema";
import type { EventCommentWithUser } from "@/src/types/comments";
import type React from "react";
import { memo, useMemo } from "react";

interface EventCommentsModalProps {
	isOpen: boolean;
	onClose: () => void;
	event: Partial<Event>;
}

const EventCommentsModal: React.FC<EventCommentsModalProps> = memo(
	({ isOpen, onClose, event }) => {
		const { comments } = useCalendar();
		const { user } = useUser();

		const commentsEvent = useMemo(
			() =>
				(comments?.filter(
					(comment) => comment.eventId === event.id,
				) as EventCommentWithUser[]) ?? [],
			[comments, event.id],
		);

		if (!user || !event.id) {
			return null;
		}

		return (
			<Dialog open={isOpen} onOpenChange={onClose}>
				<DialogContent>
					<DialogHeader className="mt-2 flex flex-row place-items-center items-center justify-between">
						<DialogTitle>
							<span className="font-semibold">{event.title}</span>
						</DialogTitle>
						<div>
							<span className="text-muted-foreground text-xs">Location: </span>
							<span className="text-sm font-semibold">{event.location}</span>
						</div>
					</DialogHeader>
					<div>
						<h3 className="font-semibold mb-2">Details:</h3>
						<div className="flex flex-row place-items-center items-center justify-between">
							<div>
								<p className=" text-xs text-muted-foreground">Initial Date: </p>
								<p className="font-semibold">
									{event.initialDate?.toLocaleDateString()}
								</p>
							</div>
							<div>
								<p className=" text-xs text-muted-foreground">Final Date: </p>
								<p className="font-semibold">
									{event.finalDate?.toLocaleDateString()}
								</p>
							</div>
						</div>

						<div>
							<p className="text-xs text-muted-foreground">Description: </p>
							<p className="">{event.description}</p>
						</div>
					</div>
					<hr className="my-2" />
					<div>
						<h3 className="text-lg font-semibold mb-2">Comments:</h3>
						{commentsEvent.length > 0 ? (
							<Comments comments={commentsEvent} />
						) : (
							<p>No comments yet</p>
						)}
					</div>
					<NewCommentForm eventId={event.id} />
				</DialogContent>
			</Dialog>
		);
	},
);

export default EventCommentsModal;
