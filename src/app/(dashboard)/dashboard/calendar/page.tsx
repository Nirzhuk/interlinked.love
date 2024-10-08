import Calendar from "@/src/components/Dashboard/Calendar";
import { CalendarProvider } from "@/src/contexts/CalendarContext";
import {
	getEventComments,
	getEvents,
	getSubscription,
} from "@/src/lib/db/queries";
import React from "react";

const CalendarPage = async () => {
	const events = await getEvents();
	const subscription = await getSubscription();

	const commentsPromise = getEventComments();
	return (
		<CalendarProvider commentsPromise={commentsPromise}>
			<Calendar events={events} />
		</CalendarProvider>
	);
};

export default CalendarPage;
