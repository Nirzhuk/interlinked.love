"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import type { Event } from "@/lib/db/schema";

import type React from "react";
import { memo } from "react";
import EventShowcase from "../../EventShowcase/EventShowcase";
import { useSession } from "next-auth/react";

interface EventCommentsModalProps {
	isOpen: boolean;
	onClose: () => void;
	event: Partial<Event>;
}

const EventCommentsModal: React.FC<EventCommentsModalProps> = memo(({ isOpen, onClose, event }) => {
	const session = useSession();
	const user = session.data?.user;
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
});

export default EventCommentsModal;
