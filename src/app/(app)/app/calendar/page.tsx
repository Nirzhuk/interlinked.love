import Calendar from "@/components/Dashboard/Calendar";
import { CalendarProvider } from "@/contexts/CalendarContext";
import { getEventComments, getEvents, getSubscription } from "@/lib/db/queries";
import { createSearchParamsCache, parseAsIsoDateTime } from "nuqs/server";
import React from "react";

const searchParamsCache = createSearchParamsCache({
	// List your search param keys and associated parsers here:
	date: parseAsIsoDateTime.withDefault(new Date()),
});

export const metadata = {
	title: "Calendar - Interlinked",
};

const CalendarPage = async (props: {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
}) => {
	const searchParams = await props.searchParams;
	const { date } = searchParamsCache.parse(searchParams);
	const events = await getEvents(date);

	const commentsPromise = getEventComments();
	return (
		<CalendarProvider commentsPromise={commentsPromise} initialEvents={events}>
			<Calendar />
		</CalendarProvider>
	);
};

export default CalendarPage;
