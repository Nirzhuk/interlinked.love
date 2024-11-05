import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { eventColorStyle } from "@/lib/colors";
import { formatDateTime } from "@/lib/dateUtils";
import type { Event } from "@/lib/db/schema";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";

import React from "react";

interface DailyEventsModalCardProps {
	event: Partial<Event>;
	onClickEditButton: (event: Partial<Event>) => void;
	onClick: (event: Partial<Event>) => void;
}

const DailyEventsModalCard = ({ event, onClickEditButton, onClick }: DailyEventsModalCardProps) => {
	const { theme } = useTheme();
	const isDark = theme === "dark";
	return (
		<Card
			key={event.id}
			className="overflow-hidden relative cursor-pointer border"
			onClick={(e) => {
				e.preventDefault();
				e.stopPropagation();
				onClick(event);
			}}
		>
			<div className="absolute p-px z-10 w-full h-full border-2 border-white dark:border-gray-950 pointer-events-none rounded-xl" />
			<div className="absolute top-0 right-0 z-0">
				<div
					className="size-20 blur-2xl"
					style={{
						backgroundColor: isDark
							? eventColorStyle[event.color as keyof typeof eventColorStyle].darkBackgroundColor
							: eventColorStyle[event.color as keyof typeof eventColorStyle].backgroundColor,
					}}
				/>
			</div>
			<CardHeader className="p-4 relative z-10">
				<div className="flex justify-between items-start">
					<CardTitle className="text-sm font-medium leading-none truncate pr-6">{event.title}</CardTitle>
					<button
						type="button"
						className="text-gray-500 hover:text-gray-700 transition-colors"
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							onClickEditButton(event);
						}}
					>
						<Pencil1Icon className="h-4 w-4" />
					</button>
				</div>
			</CardHeader>
			<CardContent className="p-4 pt-0 relative z-10 flex flex-col justify-between">
				{/* <p className="text-xs text-muted-foreground mb-2 line-clamp-2 h-[20px]">{event.description}</p> */}
				<p className="text-xs text-muted-foreground">
					<span className="font-semibold">{formatDateTime(event.initialDate?.toISOString() || "")}</span> -{" "}
					<span className="font-semibold">{formatDateTime(event.finalDate?.toISOString() || "")}</span>
				</p>
			</CardContent>
		</Card>
	);
};

export default DailyEventsModalCard;
