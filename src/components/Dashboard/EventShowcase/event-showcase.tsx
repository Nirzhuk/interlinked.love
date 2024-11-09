"use client";

import Comments from "@/components/Dashboard/Comments";
import NewCommentForm from "@/components/Dashboard/Forms/NewCommentForm";
import Editor from "@/components/Editor";

import { useCalendar } from "@/contexts/CalendarContext/CalendarContext";
import type { Event } from "@/lib/db/schema";

import type { EventCommentWithUser } from "@/types/comments";
import { UnfoldHorizontalIcon } from "lucide-react";
import type { JSONContent } from "novel";

import { useMemo } from "react";
import React from "react";

interface EventShowcaseProps {
	event: Partial<Event>;
}

const EventShowcase = ({ event }: EventShowcaseProps) => {
	const { comments } = useCalendar();

	const commentsEvent = useMemo(
		() => (comments?.filter((comment) => comment.eventId === event.id) as EventCommentWithUser[]) ?? [],
		[comments, event.id],
	);

	return (
		<>
			<div className="flex flex-col gap-2">
				<h3 className="font-semibold mb-2">Details</h3>
				<div className="flex flex-row place-items-center items-center justify-between">
					<div>
						<p className=" text-xs text-muted-foreground mb-1">Initial Date: </p>
						<p className="font-semibold">{event.initialDate?.toLocaleDateString()}</p>
					</div>

					<div>
						<p className=" text-xs text-muted-foreground mb-1">Final Date: </p>
						<p className="font-semibold">{event.finalDate?.toLocaleDateString()}</p>
					</div>
				</div>

				<div>
					<p className="text-xs text-muted-foreground mb-1">Description: </p>
					<p className="">{event.description}</p>
				</div>
				<div>
					<p className="text-xs text-muted-foreground mb-2">Content: </p>
					<div className="prose">
						<Editor content={event.content as JSONContent} />
					</div>
				</div>
				<hr className="my-2" />
			</div>
			<div className="flex mt-8">
				<h3 className="text-lg font-semibold mb-2">Comments:</h3>
				{commentsEvent.length > 0 ? <Comments comments={commentsEvent} /> : <p>No comments yet</p>}
				{event.id && <NewCommentForm eventId={event.id} />}
			</div>
		</>
	);
};

export default EventShowcase;
