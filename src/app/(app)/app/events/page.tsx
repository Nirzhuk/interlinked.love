import EventsListCard from "@/components/Dashboard/EventsLIst/EventsListCard/events-list-card";
import { getAllEvents } from "@/lib/db/queries";
import type { Event } from "@/lib/db/schema";
import { format } from "date-fns";

export const metadata = {
	title: "Events List - Interlinked",
};

interface GroupedEvents {
	[key: string]: Partial<Event>[];
}

const EventsPage = async () => {
	const events = await getAllEvents();

	// Group events by month
	const groupedEvents = events.reduce((acc: GroupedEvents, event) => {
		const monthYear = format(event.initialDate, "yyyy/MM");

		if (!acc[monthYear]) {
			acc[monthYear] = [];
		}
		acc[monthYear].push(event);
		return acc;
	}, {});

	const formatDateString = (date: string) => (
		<div>
			{new Date(date).toLocaleString("en-US", { month: "long" })}{" "}
			<span className="text-purple-500">{new Date(date).getFullYear()}</span>
		</div>
	);
	return (
		<div className="space-y-8">
			{Object.entries(groupedEvents)
				.sort(([monthA], [monthB]) => {
					return new Date(monthA).getTime() - new Date(monthB).getTime();
				})
				.map(([month, monthEvents]) => (
					<div key={month}>
						<h2 className="text-2xl font-semibold mb-4">{formatDateString(month)}</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{monthEvents.map((event: Partial<Event>) => (
								<EventsListCard key={event.id} event={event} />
							))}
						</div>
					</div>
				))}
		</div>
	);
};

export default EventsPage;
