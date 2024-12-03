import EventForm from "@/components/Dashboard/Forms/EventForm";
import { CalendarProvider } from "@/contexts/CalendarContext";
import React from "react";

const CreateEventPage = () => {
	return (
		<CalendarProvider commentsPromise={Promise.resolve([])} initialEvents={[]}>
			<EventForm mode="create" />
		</CalendarProvider>
	);
};

export default CreateEventPage;
