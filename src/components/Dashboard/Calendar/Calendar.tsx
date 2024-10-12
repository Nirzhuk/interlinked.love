"use client";

import CreateEventModal from "@/src/components/Dashboard/Modals/CreateEventModal";
import { Button } from "@/src/components/ui/button";
import { useCalendar } from "@/src/contexts/CalendarContext";
import { useUser } from "@/src/lib/auth";
import { daysInMonth, firstDayOfMonth, parseUrlDate, sortEventsByStartDate } from "@/src/lib/dateUtils";
import type { Event } from "@/src/lib/db/schema";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useQueryState } from "nuqs";
import React, { useMemo, useState, useCallback } from "react";
import DayCell from "./DayCell";

interface CalendarProps {
	events: Partial<Event>[];
}

const Calendar = ({ events }: CalendarProps) => {
	const { comments } = useCalendar();
	const { user } = useUser();

	const [currentDateParam, setCurrentDateParam] = useQueryState("date", {
		defaultValue: new Date().toISOString().split("T")[0],
		parse: (value) => value,
		serialize: (value) => value,
		shallow: false,
	});
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
		<div className="max-w-4xl flex flex-col sm:mx-auto mb-10">
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-bold mr-4 relative h-10 overflow-hidden">
					<AnimatePresence mode="popLayout" initial={false}>
						<motion.p
							key={`${currentDate.getMonth()}-${currentDate.getFullYear()}`}
							initial={{ opacity: 0, y: -50 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 50 }}
							transition={{ duration: 0.2, ease: "easeOut" }}
						>
							<span>{currentDate.toLocaleString("en-US", { month: "long" })}</span>
							<span className="text-purple-500 ml-2">{currentDate.getFullYear()}</span>
						</motion.p>
					</AnimatePresence>
				</h2>
				<div className="flex items-center justify-between sm:flex-row flex-col-reverse">
					<div className="flex">
						<Button onClick={prevMonth} variant="ghost" size="icon" className="mr-2">
							<ChevronLeft className="h-4 w-4" />
						</Button>
						<Button onClick={nextMonth} variant="ghost" size="icon">
							<ChevronRight className="h-4 w-4" />
						</Button>
					</div>
					<div className="flex justify-end">
						<Button onClick={() => setIsCreateModalOpen(true)} variant="outline">
							<Plus className="mr-2 h-4 w-4" /> New Event
						</Button>
					</div>
				</div>
			</div>
			<div className="grid grid-cols-7 gap-1">
				{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
					<div key={day} className="font-bold text-center p-2">
						{day}
					</div>
				))}
				{renderCalendar()}
			</div>
			<CreateEventModal isOpen={isCreateModalOpen} onChange={(state) => setIsCreateModalOpen(state)} />
		</div>
	);
};

export default React.memo(Calendar);
