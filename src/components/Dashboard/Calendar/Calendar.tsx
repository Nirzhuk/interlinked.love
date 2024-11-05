"use client";

import CreateEventModal from "@/components/Dashboard/Modals/CreateEventModal";

import { useCalendar } from "@/contexts/CalendarContext";
import { daysInMonth, firstDayOfMonth, parseUrlDate, sortEventsByStartDate } from "@/lib/dateUtils";
import type { Event } from "@/lib/db/schema";
import { motion } from "framer-motion";

import { useSession } from "next-auth/react";
import { parseAsInteger, useQueryState } from "nuqs";
import React, { useMemo, useState, useCallback } from "react";
import EventDetailsModal from "../Modals/EventDetailsModal";
import CalendarControllers from "./components/calendar-controllers";
import DayCell from "./components/day-cell";

const Calendar = () => {
	const { comments, events } = useCalendar();
	const { data: session } = useSession();
	const user = session?.user;

	const [currentDateParam, setCurrentDateParam] = useQueryState("date", {
		defaultValue: new Date().toISOString().split("T")[0],
		parse: (value) => value,
		serialize: (value) => value,
		shallow: false,
	});

	const [selectedEventId, setSelectedEventId] = useQueryState("event", parseAsInteger.withDefault(0));
	const selectedEventFromQueryState = selectedEventId
		? events.find((event) => event.id === selectedEventId)
		: undefined;

	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

	const currentDate = useMemo(() => parseUrlDate(currentDateParam), [currentDateParam]);

	const sortedEvents = useMemo(() => sortEventsByStartDate(events), [events]);

	const eventLayers = useMemo(() => {
		const layers: Partial<Event>[][] = [];
		for (const event of sortedEvents) {
			if (!event.initialDate || !event.finalDate) continue;
			const eventStart = new Date(event.initialDate);
			let placed = false;
			for (const layer of layers) {
				const lastEvent = layer[layer.length - 1];
				if (lastEvent?.finalDate && eventStart >= new Date(lastEvent.finalDate)) {
					layer.push(event);
					placed = true;
					break;
				}
			}
			if (!placed) {
				layers.push([event]);
			}
		}
		return layers;
	}, [sortedEvents]);

	const renderCalendar = useCallback(() => {
		const totalDays = daysInMonth(currentDate);
		const startDay = firstDayOfMonth(currentDate);
		const days = [];

		for (let i = 0; i < startDay; i++) {
			days.push(<div key={`empty-${i}`} className="p-4" />);
		}

		for (let i = 1; i <= totalDays; i++) {
			const currentDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
			const dayEvents = sortedEvents.filter((event) => {
				if (!event.initialDate || !event.finalDate) return false;
				const eventStartDate = new Date(event.initialDate);
				const eventEndDate = new Date(event.finalDate);
				return (
					currentDay >= new Date(eventStartDate.getFullYear(), eventStartDate.getMonth(), eventStartDate.getDate()) &&
					currentDay <= new Date(eventEndDate.getFullYear(), eventEndDate.getMonth(), eventEndDate.getDate())
				);
			});

			const hasComments = comments?.some((comment) => comment.userId !== user?.id) ?? false;

			days.push(
				<motion.div key={i} layoutId={`day-${i}`}>
					<DayCell
						day={i}
						events={dayEvents}
						currentDate={currentDate}
						eventLayers={eventLayers}
						hasComments={hasComments}
					/>
				</motion.div>,
			);
		}

		return days;
	}, [currentDate, sortedEvents, eventLayers, user, comments]);

	const nextMonth = useCallback(() => {
		const nextDate = new Date(currentDate);
		nextDate.setMonth(nextDate.getMonth() + 1);
		setCurrentDateParam(nextDate.toISOString().split("T")[0]);
	}, [currentDate, setCurrentDateParam]);

	const prevMonth = useCallback(() => {
		const prevDate = new Date(currentDate);
		prevDate.setMonth(prevDate.getMonth() - 1);
		setCurrentDateParam(prevDate.toISOString().split("T")[0]);
	}, [currentDate, setCurrentDateParam]);

	return (
		<div className="flex flex-col mb-10 max-w-6xl justify-center items-center">
			<CalendarControllers
				currentDate={currentDate}
				prevMonth={prevMonth}
				nextMonth={nextMonth}
				setIsCreateModalOpen={setIsCreateModalOpen}
			/>
			<div className="grid grid-cols-7 gap-1">
				{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
					<div key={day} className="font-bold text-center p-2">
						{day}
					</div>
				))}
				{renderCalendar()}
			</div>
			<CreateEventModal isOpen={isCreateModalOpen} onChange={(state) => setIsCreateModalOpen(state)} />
			<EventDetailsModal
				isOpen={!!selectedEventId}
				onChange={() => setSelectedEventId(null)}
				event={selectedEventFromQueryState}
			/>
		</div>
	);
};

export default React.memo(Calendar);
