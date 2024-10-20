"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import type { Event } from "@/lib/db/schema";

import { useSession } from "next-auth/react";
import type React from "react";
import { memo } from "react";
import EventShowcase from "../../EventShowcase/EventShowcase";

interface EventCommentsModalProps {
	isOpen: boolean;
	onChange: (state: boolean) => void;
	event: Partial<Event> | undefined;
}

const EventCommentsModal: React.FC<EventCommentsModalProps> = memo(({ isOpen, onChange, event }) => {
	const session = useSession();
	const user = session.data?.user;

	if (!user || !event) {
		return null;
	}

	return (
		<Dialog open={isOpen} onOpenChange={onChange}>
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
