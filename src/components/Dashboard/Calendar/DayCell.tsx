"use client";
import type { Event } from "@/lib/db/schema";

import DailyEventsModal from "@/components/Dashboard/Modals/DailyEventsModal";
import { eventColorStyle } from "@/lib/colors";
import { cn } from "@/lib/utils";

import EventDetailsModal from "@/components/Dashboard/Modals/EventDetailsModal";
import React, { memo, useState, useCallback, useMemo } from "react";

interface DayCellProps {
	day: number;
	events: Partial<Event>[];
	currentDate: Date;
	eventLayers: Partial<Event>[][];
	hasComments: boolean;
}

const MAX_VISIBLE_EVENTS = 3;
const EVENT_HEIGHT = 1.4;
const DAY_CELL_PADDING_TOP = 1.35;
const EVENT_VERTICAL_GAP = 0.2;

const DayCell: React.FC<DayCellProps> = memo(({ day, events, currentDate, eventLayers, hasComments }) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);

	const [modalPosition, setModalPosition] = useState<{
		top: number;
		left: number;
		width: number;
		height: number;
	} | null>(null);
	const [selectedEvent, setSelectedEvent] = useState<Partial<Event> | null>(null);

	const currentDay = useMemo(
		() => new Date(currentDate.getFullYear(), currentDate.getMonth(), day),
		[currentDate, day],
	);

	const handleDayClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		const rect = e.currentTarget.getBoundingClientRect();
		setModalPosition({
			top: rect.top,
			left: rect.left,
			width: rect.width,
			height: rect.height,
		});
		setIsModalOpen(true);
	}, []);

	const renderEvent = useCallback(
		(event: Partial<Event>, index: number) => {
			if (!event.initialDate || !event.finalDate) return null;
			const eventStartDate = new Date(event.initialDate);
			const eventEndDate = new Date(event.finalDate);

			const isFirstDay =
				currentDay.getTime() ===
				new Date(eventStartDate.getFullYear(), eventStartDate.getMonth(), eventStartDate.getDate()).getTime();
			const isLastDay =
				currentDay.getTime() ===
				new Date(eventEndDate.getFullYear(), eventEndDate.getMonth(), eventEndDate.getDate()).getTime();

			const layerIndex = eventLayers.findIndex((layer) => layer.includes(event));

			const style = eventColorStyle[event.color as keyof typeof eventColorStyle];

			const eventClass = cn(
				"hidden sm:block absolute left-0 right-0 text-xs p-1 overflow-hidden",
				"border-t border-b",
				isFirstDay && "rounded-l-md  border-l ",
				isLastDay && "rounded-r-md mr-2 border-r",
				"transition-colors duration-200 text-center ease-in-out cursor-pointer font-semibold ",
			);

			const isHighPositionedEvent = layerIndex >= 3 && events.length <= 2;
			if (layerIndex >= MAX_VISIBLE_EVENTS && !isHighPositionedEvent) return null;

			const eventStyle: React.CSSProperties = {
				top: isHighPositionedEvent
					? `${DAY_CELL_PADDING_TOP + index * (EVENT_HEIGHT + EVENT_VERTICAL_GAP)}rem`
					: `${DAY_CELL_PADDING_TOP + layerIndex * (EVENT_HEIGHT + EVENT_VERTICAL_GAP)}rem`,
				height: `${EVENT_HEIGHT}rem`,
				borderColor: style.borderColor,
				backgroundColor: style.backgroundColor,
			};

			const handleEventClick = (e: React.MouseEvent) => {
				e.stopPropagation();
				setSelectedEvent(event);
				setIsCommentsModalOpen(true);
			};

			const handleEventKeyDown = (e: React.KeyboardEvent) => {
				if (e.key === "Enter" || e.key === " ") {
					e.stopPropagation();
					setSelectedEvent(event);
					setIsCommentsModalOpen(true);
				}
			};

			return (
				<React.Fragment key={event.id}>
					<div
						className={cn(
							"absolute inset-x-0 bottom-0.5 flex justify-center items-center",
							"h-4 sm:hidden", // Adjust height as needed
						)}
					>
						<div
							className="rounded-full size-3"
							style={{
								backgroundColor: style.backgroundColor,
								border: `1px solid ${style.borderColor}50`,
							}}
						/>
					</div>
					<div
						className={eventClass}
						style={eventStyle}
						onClick={handleEventClick}
						onKeyDown={handleEventKeyDown}
						tabIndex={0}
						role="button"
						onMouseEnter={(e) => {
							e.currentTarget.style.backgroundColor = style.hoverBackgroundColor;
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.backgroundColor = style.backgroundColor;
						}}
					>
						<span className="line-clamp-1">{event.title}</span>
					</div>
				</React.Fragment>
			);
		},
		[currentDay, eventLayers, events.length], // Add events.length to the dependency array
	);

	const renderedEvents = useMemo(() => events.map((event, index) => renderEvent(event, index)), [events, renderEvent]);

	const handleDayCellKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLDivElement>) => {
			if (e.key === "Enter" || e.key === " ") {
				handleDayClick(e as unknown as React.MouseEvent<HTMLDivElement>);
			}
		},
		[handleDayClick],
	);

	return (
		<>
			<div
				className={cn(
					"p-2 rounded-md text-center bg-gray-100 hover:bg-gray-150/80 cursor-pointer border border-transparent hover:border-gray-300 flex flex-col overflow-hidden h-10 sm:h-28 relative transition-all duration-200 ease-in-out",
				)}
				onClick={handleDayClick}
				onKeyDown={handleDayCellKeyDown}
				tabIndex={0}
				role="button"
			>
				<span className="font-semibold absolute top-0 left-0 right-0">{day}</span>
				<div className="hidden sm:block font-semibold absolute bottom-0 left-0 right-0 text-xs text-muted-foreground">
					{events.length} events
				</div>
				<div className="absolute top-1 right-1 flex items-center space-x-1">
					{hasComments && <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />}
				</div>
				{renderedEvents}
				{/* 					 					{(events.length > MAX_VISIBLE_EVENTS ) && (
						<div className="absolute bottom-0 left-0 right-0 text-xs text-center bg-gray-200 hover:bg-gray-300 transition-colors duration-200 ease-in-out">
							More events
						</div>
					)} */}
			</div>
			<DailyEventsModal
				events={events}
				currentDay={currentDay}
				isModalOpen={isModalOpen}
				setIsModalOpen={setIsModalOpen}
				modalPosition={modalPosition}
			/>
			<EventDetailsModal
				isOpen={isCommentsModalOpen}
				onChange={(state) => setIsCommentsModalOpen(state)}
				event={selectedEvent || {}}
			/>
		</>
	);
});

DayCell.displayName = "DayCell";

export default DayCell;
