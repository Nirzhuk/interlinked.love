"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import type { Event } from "@/lib/db/schema";

import { useToast } from "@/hooks/use-toast";
import { Link } from "lucide-react";
import { useSession } from "next-auth/react";
import type React from "react";
import { memo } from "react";
import EventShowcase from "../../EventShowcase/event-showcase";

interface EventDetailsModalProps {
	isOpen: boolean;
	onChange: (state: boolean) => void;
	event: Partial<Event> | undefined;
}

const EventDetailsModal = memo(({ isOpen, onChange, event }: EventDetailsModalProps) => {
	const session = useSession();
	const { toast } = useToast();
	const user = session.data?.user;

	if (!user || !event) {
		return null;
	}

	const clickOnShare = () => {
		navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_BASE_URL}/app/calendar?event=${event.id}`);
		toast({
			title: "Copied to clipboard",
			description: "Event link copied to clipboard",
		});
	};

	return (
		<Dialog open={isOpen} onOpenChange={onChange}>
			<DialogContent noCloseButton={false} className=" dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
				<DialogHeader className="mt-2 flex flex-row place-items-center items-center justify-between ">
					<DialogTitle>
						<span className="font-semibold">{event.title}</span>
						<button onClick={clickOnShare} className="p-1 rounded-md" type="button">
							<Link className="size-3.5 hover:text-purple-500" />
						</button>
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

export default EventDetailsModal;
