"use client";

import type { EventCommentWithUser } from "@/types/comments";
import { type ReactNode, createContext, useContext, useEffect, useState } from "react";
import { use } from "react";

type CalendarContextType = {
	comments: EventCommentWithUser[] | null;
	setComments: (comments: EventCommentWithUser[]) => void;
	addComment: (eventId: number, comment: EventCommentWithUser) => void;
	removeComment: (commentId: number) => void;
};

const CalendarContext = createContext<CalendarContextType | null>(null);

export function useCalendar(): CalendarContextType {
	const context = useContext(CalendarContext);
	if (context === null) {
		throw new Error("useUser must be used within a UserProvider");
	}
	return context;
}

export function CalendarProvider({
	children,
	commentsPromise,
}: {
	children: ReactNode;
	commentsPromise: Promise<EventCommentWithUser[] | null>;
}) {
	const initialComments = use(commentsPromise);
	const [comments, setComments] = useState<EventCommentWithUser[] | null>(initialComments);

	useEffect(() => {
		setComments(initialComments);
	}, [initialComments]);

	const addComment = (eventId: number, comment: EventCommentWithUser) => {
		setComments((prevComments) => [...(prevComments || []), { ...comment, eventId }]);
	};

	const removeComment = (commentId: number) => {
		setComments((prevComments) => prevComments?.filter((comment) => comment.id !== commentId) || null);
	};

	return (
		<CalendarContext.Provider value={{ comments, setComments, addComment, removeComment }}>
			{children}
		</CalendarContext.Provider>
	);
}
