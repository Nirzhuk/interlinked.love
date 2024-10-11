"use client";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/src/components/ui/dialog";
import { useCalendar } from "@/src/contexts/CalendarContext/CalendarContext";
import { useUser } from "@/src/lib/auth";
import type { Event } from "@/src/lib/db/schema";
import type { EventCommentWithUser } from "@/src/types/comments";
import type React from "react";
import { memo, useMemo } from "react";
import EventShowcase from "../../Events/EventShowcase/EventShowcase";

interface EventCommentsModalProps {
	isOpen: boolean;
	onClose: () => void;
	event: Partial<Event>;
}

const EventCommentsModal: React.FC<EventCommentsModalProps> = memo(
	({ isOpen, onClose, event }) => {
		const { user } = useUser();
		if (!user || !event.id) {
			return null;
		}
		return (
			<Dialog open={isOpen} onOpenChange={onClose}>
				<DialogContent>
					<DialogHeader className="mt-2 flex flex-row place-items-center items-center justify-between">
						<DialogTitle>
							<span className="font-semibold">{event.title}</span>
						</DialogTitle>
						<div>
							<span className="text-muted-foreground text-xs">Location: </span>
							<span className="text-sm font-semibold">{event.location}</span>
						</div>
					</DialogHeader>
					<EventShowcase event={event} />
				</DialogContent>
			</Dialog>
		);
	},
);

export default EventCommentsModal;
