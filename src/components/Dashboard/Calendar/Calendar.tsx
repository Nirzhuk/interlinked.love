"use client";
import CreateEventModal from "@/src/components/Dashboard/Modals/CreateEventModal";
import { Button } from "@/src/components/ui/button";
import { useCalendar } from "@/src/contexts/CalendarContext";
import {
	daysInMonth,
	firstDayOfMonth,
	sortEventsByStartDate,
} from "@/src/lib/dateUtils";
import type { Event } from "@/src/lib/db/schema";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import React, { useMemo, useState, useCallback, useEffect } from "react";
import DayCell from "./DayCell";

interface CalendarProps {
	events: Partial<Event>[];
}

const Calendar: React.FC<CalendarProps> = ({ events }) => {
	const [currentDate, setCurrentDate] = useState(() => new Date());
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

	const { comments } = useCalendar();

	const sortedEvents = useMemo(() => sortEventsByStartDate(events), [events]);

	const eventLayers = useMemo(() => {
		const layers: Partial<Event>[][] = [];
		for (const event of sortedEvents) {
			if (!event.initialDate || !event.finalDate) continue;
			const eventStart = new Date(event.initialDate);
			let placed = false;
			for (const layer of layers) {
				const lastEvent = layer[layer.length - 1];
				if (
					lastEvent?.finalDate &&
					eventStart >= new Date(lastEvent.finalDate)
				) {
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
			const currentDay = new Date(
				currentDate.getFullYear(),
				currentDate.getMonth(),
				i,
			);
			const dayEvents = sortedEvents.filter((event) => {
				if (!event.initialDate || !event.finalDate) return false;
				const eventStartDate = new Date(event.initialDate);
				const eventEndDate = new Date(event.finalDate);
				return (
					currentDay >=
						new Date(
							eventStartDate.getFullYear(),
							eventStartDate.getMonth(),
							eventStartDate.getDate(),
						) &&
					currentDay <=
						new Date(
							eventEndDate.getFullYear(),
							eventEndDate.getMonth(),
							eventEndDate.getDate(),
						)
				);
			});

			const hasComments = comments
				? comments.some(
						(comment) =>
							comment.eventId === dayEvents.find((event) => event.id)?.id,
					)
				: false;

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
	}, [currentDate, sortedEvents, eventLayers, comments]);

	const nextMonth = useCallback(() => {
		setCurrentDate(
			(prevDate) =>
				new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1),
		);
	}, []);

	const prevMonth = useCallback(() => {
		setCurrentDate(
			(prevDate) =>
				new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1),
		);
	}, []);

	const handleCreateEvent = useCallback((newEvent: Partial<Event>) => {
		setIsCreateModalOpen(false);
	}, []);

	return (
		<div className="max-w-4xl flex flex-col mx-auto mb-10">
			<div className="flex justify-end">
				<Button onClick={() => setIsCreateModalOpen(true)} variant="outline">
					<Plus className="mr-2 h-4 w-4" /> New Event
				</Button>
			</div>
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-bold mr-4">
					<span>{currentDate.toLocaleString("en-US", { month: "long" })}</span>
					<span className="text-purple-500 ml-2">
						{currentDate.getFullYear()}
					</span>
				</h2>
				<div className="flex">
					<Button
						onClick={prevMonth}
						variant="ghost"
						size="icon"
						className="mr-2"
					>
						<ChevronLeft className="h-4 w-4" />
					</Button>
					<Button onClick={nextMonth} variant="ghost" size="icon">
						<ChevronRight className="h-4 w-4" />
					</Button>
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
			<CreateEventModal
				isOpen={isCreateModalOpen}
				onChange={(state) => setIsCreateModalOpen(state)}
			/>
		</div>
	);
};

export default React.memo(Calendar);
