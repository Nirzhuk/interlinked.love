"use client";

import Comments from "@/components/Dashboard/Comments";
import NewCommentForm from "@/components/Dashboard/Forms/NewCommentForm";
import Editor from "@/components/Editor";

import { useCalendar } from "@/contexts/CalendarContext/CalendarContext";
import type { Event } from "@/lib/db/schema";

import type { EventCommentWithUser } from "@/types/comments";
import type { JSONContent } from "novel";

import { useMemo } from "react";
import React from "react";

const EventShowcase = ({ event }: { event: Partial<Event> }) => {
	const { comments } = useCalendar();

	const commentsEvent = useMemo(
		() => (comments?.filter((comment) => comment.eventId === event.id) as EventCommentWithUser[]) ?? [],
		[comments, event.id],
	);

	return (
		<>
			<div>
				<h3 className="font-semibold mb-2">Details</h3>
				<div className="flex flex-row place-items-center items-center justify-between">
					<div>
						<p className=" text-xs text-muted-foreground">Initial Date: </p>
						<p className="font-semibold">{event.initialDate?.toLocaleDateString()}</p>
					</div>
					<div>
						<p className=" text-xs text-muted-foreground">Final Date: </p>
						<p className="font-semibold">{event.finalDate?.toLocaleDateString()}</p>
					</div>
				</div>

				<div>
					<p className="text-xs text-muted-foreground">Description: </p>
					<p className="">{event.description}</p>
				</div>
				<div>
					<p className="text-xs text-muted-foreground">Content: </p>
					<div className="prose">
						<Editor content={event.content as JSONContent} />
					</div>
				</div>
			</div>
			<hr className="my-2" />
			<div>
				<h3 className="text-lg font-semibold mb-2">Comments:</h3>
				{commentsEvent.length > 0 ? <Comments comments={commentsEvent} /> : <p>No comments yet</p>}
			</div>
			{event.id && <NewCommentForm eventId={event.id} />}
		</>
	);
};

export default EventShowcase;
