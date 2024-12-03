"use client";

import type { Event } from "@/lib/db/schema";
import type { EventCommentWithUser } from "@/types/comments";
import { type ReactNode, createContext, useCallback, useContext, useEffect, useState } from "react";
import { use } from "react";

type CalendarContextType = {
	comments: EventCommentWithUser[] | null;
	events: Partial<Event>[];
	setComments: (comments: EventCommentWithUser[]) => void;
	setEvents: (events: Partial<Event>[]) => void;
	addComment: (eventId: number, comment: EventCommentWithUser) => void;
	removeComment: (commentId: number) => void;
	updateEvent: (event: Partial<Event>) => void;
	createEvent: (event: Partial<Event>) => void;
};

const CalendarContext = createContext<CalendarContextType | null>(null);

export function useCalendar(): CalendarContextType {
	const context = useContext(CalendarContext);
	if (context === null) {
		throw new Error("useCalendar must be used within a CalendarProvider");
	}
	return context;
}

export function CalendarProvider({
	children,
	commentsPromise,
	initialEvents,
}: {
	children: ReactNode;
	commentsPromise: Promise<EventCommentWithUser[] | null>;
	initialEvents: Partial<Event>[];
}) {
	const initialComments = use(commentsPromise);
	const [comments, setComments] = useState<EventCommentWithUser[] | null>(initialComments);
	const [events, setEvents] = useState<Partial<Event>[]>(initialEvents);

	useEffect(() => {
		setComments(initialComments);
	}, [initialComments]);

	const addComment = useCallback((eventId: number, comment: EventCommentWithUser) => {
		setComments((prevComments) => [...(prevComments || []), { ...comment, eventId }]);
	}, []);

	const removeComment = useCallback((commentId: number) => {
		setComments((prevComments) => prevComments?.filter((comment) => comment.id !== commentId) || null);
	}, []);

	const updateEvent = useCallback((event: Partial<Event>) => {
		setEvents((prevEvents) => prevEvents?.map((e) => (e.id === event.id ? event : e)) || null);
	}, []);

	const createEvent = useCallback((event: Partial<Event>) => {
		setEvents((prevEvents) => [...(prevEvents || []), event]);
	}, []);

	return (
		<CalendarContext.Provider
			value={{ comments, setComments, addComment, removeComment, events, setEvents, updateEvent, createEvent }}
		>
			{children}
		</CalendarContext.Provider>
	);
}
