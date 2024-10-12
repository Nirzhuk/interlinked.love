import Calendar from "@/src/components/Dashboard/Calendar";
import { CalendarProvider } from "@/src/contexts/CalendarContext";
import {
	getEventComments,
	getEvents,
	getSubscription,
} from "@/src/lib/db/queries";
import { createSearchParamsCache, parseAsIsoDateTime } from "nuqs/server";
import React from "react";

const searchParamsCache = createSearchParamsCache({
	// List your search param keys and associated parsers here:
	date: parseAsIsoDateTime.withDefault(new Date()),
});

const CalendarPage = async ({
	searchParams,
}: {
	searchParams: Record<string, string | string[] | undefined>;
}) => {
	const { date } = searchParamsCache.parse(searchParams);
	const events = await getEvents(date);

	const commentsPromise = getEventComments();
	return (
		<CalendarProvider commentsPromise={commentsPromise}>
			<Calendar events={events} />
		</CalendarProvider>
	);
};

export default CalendarPage;
