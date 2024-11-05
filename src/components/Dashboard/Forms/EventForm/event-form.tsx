"use client";

import { createEventAction, updateEventAction } from "@/app/(app)/app/calendar/actions";
import { Button } from "@/components/ui/button";

import Editor from "@/components/Editor";
import { DatePicker } from "@/components/ui/date-picker";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useCalendar } from "@/contexts/CalendarContext";
import { useToast } from "@/hooks/use-toast";
import type { Event } from "@/lib/db/schema";
import { Loader2 } from "lucide-react";
import type { JSONContent } from "novel";
import { useQueryState } from "nuqs";
import React, { useEffect, useState } from "react";
import { useActionState } from "react";
import { ColorPicker } from "./components/color-picker";
import { FormField } from "./components/form-field";

interface EditEventFormProps {
	event?: Partial<Event>;
	mode: "create" | "edit";
	modalOnChange?: (state: boolean) => void;
}

type ActionState = {
	error?: string;
	success?: string;
	event?: Partial<Event>;
};

const EventForm = ({ mode, event, modalOnChange }: EditEventFormProps) => {
	const { toast } = useToast();
	const { updateEvent, createEvent } = useCalendar();

	const [eventState, setEventState] = useState<Partial<Event> | undefined>(event);

	const [currentDateParam, setCurrentDateParam] = useQueryState("date", {
		defaultValue: new Date().toISOString().split("T")[0],
		parse: (value) => value,
		serialize: (value) => value,
	});

	const [state, formAction, isPending] = useActionState<ActionState, FormData>(
		mode === "create" ? createEventAction : updateEventAction,
		{ error: "", success: "" },
	);

	useEffect(() => {
		if (state.success) {
			if (mode === "create") {
				toast({
					title: "Event created",
					description: "Event created successfully",
				});
				createEvent(state.event as Partial<Event>);
			} else {
				toast({
					title: "Event updated",
					description: "Event updated successfully",
				});
				updateEvent(state.event as Partial<Event>);
				setEventState(state.event as Partial<Event>);
			}
		}
	}, [state, toast, mode, updateEvent, createEvent]);

	return (
		<form action={formAction}>
			<div className="grid gap-4 py-4 max-w-[90vw]">
				<div className="flex gap-2 max-w-[90vw]">
					<input type="hidden" name="eventId" value={eventState?.id} />
					<FormField label="Title" required>
						<Input name="title" required defaultValue={eventState?.title || ""} />
					</FormField>

					<FormField label="Description" mainClassName="flex-1">
						<Input id="description" name="description" defaultValue={eventState?.description || ""} />
					</FormField>
					<FormField label="Location">
						<Input id="location" name="location" defaultValue={eventState?.location || ""} />
					</FormField>
				</div>

				<div className="flex gap-2 max-w-[90vw]">
					<FormField label="Start Date" required>
						<DatePicker
							id="initialDate"
							name="initialDate"
							defaultValue={eventState?.initialDate}
							fromYear={currentDateParam ? new Date(currentDateParam).getFullYear() : new Date().getFullYear()}
							fromMonth={currentDateParam ? new Date(currentDateParam) : new Date()}
						/>
					</FormField>

					<FormField label="End Date" required>
						<DatePicker
							id="finalDate"
							name="finalDate"
							defaultValue={eventState?.finalDate}
							fromYear={currentDateParam ? new Date(currentDateParam).getFullYear() : new Date().getFullYear()}
							fromMonth={currentDateParam ? new Date(currentDateParam) : new Date()}
						/>
					</FormField>
				</div>
				<FormField label="Color" required>
					<ColorPicker id="color" name="color" defaultValue={eventState?.color} />
				</FormField>

				<FormField
					label={
						<span>
							Notes - <span className="text-xs text-muted-foreground">Rich text editor, select text to format.</span>
						</span>
					}
				>
					<Editor name="content" content={eventState?.content as JSONContent} editable={true} />
				</FormField>
			</div>
			<DialogFooter>
				<Button type="submit" disabled={isPending}>
					{isPending ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Creating...
						</>
					) : mode === "create" ? (
						"Create Event"
					) : (
						"Update Event"
					)}
				</Button>
			</DialogFooter>
		</form>
	);
};

export default EventForm;
