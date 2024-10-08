"use client";

import type { EventCommentWithUser } from "@/src/types/comments";
import {
	type ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from "react";
import { use } from "react";

type CalendarContextType = {
	comments: EventCommentWithUser[] | null;
	setComments: (comments: EventCommentWithUser[]) => void;
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
	const [comments, setComments] = useState<EventCommentWithUser[] | null>(
		initialComments,
	);

	useEffect(() => {
		setComments(initialComments);
	}, [initialComments]);

	return (
		<CalendarContext.Provider value={{ comments, setComments }}>
			{children}
		</CalendarContext.Provider>
	);
}
