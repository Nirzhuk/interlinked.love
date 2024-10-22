import type { Event } from "./db/schema";

export const daysInMonth = (date: Date): number => {
	return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

export const firstDayOfMonth = (date: Date): number => {
	return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
};

export const sortEventsByStartDate = (events: Partial<Event>[]): Partial<Event>[] => {
	return [...events].sort((a, b) => {
		const startA = new Date(a.initialDate || "").getTime();
		const startB = new Date(b.initialDate || "").getTime();
		return startA - startB;
	});
};

export const formatDateTime = (date: string) => {
	const dateObj = new Date(date);
	return dateObj.toLocaleString("en-US", {
		weekday: "short",
		month: "short",
		day: "numeric",
		year: "numeric",
	});
};

export const parseUrlDate = (dateString: string | null): Date => {
	if (!dateString) return new Date();
	const parsedDate = new Date(dateString);
	return Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
};
