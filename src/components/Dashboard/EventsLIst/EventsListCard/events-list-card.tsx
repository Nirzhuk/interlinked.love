"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { eventColorStyle } from "@/lib/colors";
import { formatDateTime } from "@/lib/dateUtils";
import type { Event } from "@/lib/db/schema";
import { useTheme } from "next-themes";

import React from "react";

interface EventsListCardProps {
	event: Partial<Event>;
}

const EventsListCard = ({ event }: EventsListCardProps) => {
	const { theme } = useTheme();
	const isDark = theme === "dark";
	const onClick = (event: Partial<Event>) => console.log("clicked", event);
	return (
		<Card
			key={event.id}
			className="overflow-hidden relative cursor-pointer border min-h-40"
			onClick={(e) => {
				e.preventDefault();
				e.stopPropagation();
				onClick(event);
			}}
		>
			<div className="absolute p-px z-10  w-full h-full border-2 border-white dark:border-gray-950 pointer-events-none rounded-xl" />
			<div className="absolute -top-10 right-2 z-0">
				<div
					className="size-40 blur-xl"
					style={{
						backgroundColor: isDark
							? eventColorStyle[event.color as keyof typeof eventColorStyle].darkBackgroundColor
							: eventColorStyle[event.color as keyof typeof eventColorStyle].backgroundColor,
					}}
				/>
			</div>
			<CardHeader className="p-4 relative z-10">
				<CardTitle className="text-sm font-medium leading-none truncate pr-6">{event.title}</CardTitle>
			</CardHeader>
			<CardContent className="p-4 pt-0 relative z-10 flex flex-col justify-between">
				<p className="text-xs text-muted-foreground">
					Location: <span className="font-semibold">{event.location}</span>
				</p>
				<p className="text-xs text-muted-foreground">
					<span className="font-semibold">{formatDateTime(event.initialDate?.toISOString() || "")}</span> -{" "}
					<span className="font-semibold">{formatDateTime(event.finalDate?.toISOString() || "")}</span>
				</p>
			</CardContent>
		</Card>
	);
};

export default EventsListCard;
