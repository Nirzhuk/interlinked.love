import React from "react";
import { getUpcomingEvents } from "@/src/lib/db/queries";
import { format } from "date-fns";

const UpcomingEvents = async () => {
	const events = await getUpcomingEvents();

	return (
		<div className="bg-white shadow rounded-lg p-4">
			<h2 className="text-lg font-semibold mb-4">Upcoming Events</h2>
			<ul className="space-y-3">
				{events.map((event) => (
					<li key={event.id} className="flex items-center space-x-3">
						<div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
							<span className="text-purple-600 font-semibold">
								{format(new Date(event.initialDate), "d")}
							</span>
						</div>
						<div className="flex-grow">
							<p className="text-sm font-medium text-gray-900">
								{event.description}
							</p>
							<p className="text-xs text-gray-500">
								{format(new Date(event.initialDate), "MMM d, yyyy")}
							</p>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};

export default UpcomingEvents;
