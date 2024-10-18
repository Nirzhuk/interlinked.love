"use client";

import { Button } from "@/components/ui/button";
import { createEvent, updateEvent } from "../../../../app/(app)/app/calendar/actions";

import TailwindEditor from "@/components/TailwindEditor";
import { DatePicker } from "@/components/ui/date-picker";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Event } from "@/lib/db/schema";
import { Loader2 } from "lucide-react";
import type { JSONContent } from "novel";
import { useQueryState } from "nuqs";
import React from "react";
import { useActionState } from "react";
import { ColorPicker } from "../../Modals/CreateEventModal/components/ColorPicker";
import { FormField } from "../../Modals/CreateEventModal/components/FormField";

interface EditEventFormProps {
	event: Partial<Event> | null;
	mode: "create" | "edit";
}

type ActionState = {
	error?: string;
	success?: string;
};

const EventForm = ({ mode, event }: EditEventFormProps) => {
	const [currentDateParam, setCurrentDateParam] = useQueryState("date", {
		defaultValue: new Date().toISOString().split("T")[0],
		parse: (value) => value,
		serialize: (value) => value,
	});
	const [state, formAction, isPending] = useActionState<ActionState, FormData>(
		mode === "create" ? createEvent : updateEvent,
		{ error: "", success: "" },
	);

	return (
		<form action={formAction}>
			<div className="grid gap-4 py-4">
				<div className="flex gap-2">
					<input type="hidden" name="eventId" value={event?.id} />
					<FormField label="Title" required>
						<Input name="title" required defaultValue={event?.title || ""} />
					</FormField>

					<FormField label="Description" mainClassName="flex-1">
						<Input id="description" name="description" defaultValue={event?.description || ""} />
					</FormField>
					<FormField label="Location">
						<Input id="location" name="location" defaultValue={event?.location || ""} />
					</FormField>
				</div>

				<div className="flex gap-2">
					<FormField label="Start Date" required>
						<DatePicker
							id="initialDate"
							name="initialDate"
							defaultValue={event?.initialDate}
							fromYear={currentDateParam ? new Date(currentDateParam).getFullYear() : new Date().getFullYear()}
							fromMonth={currentDateParam ? new Date(currentDateParam) : new Date()}
						/>
					</FormField>

					<FormField label="End Date" required>
						<DatePicker
							id="finalDate"
							name="finalDate"
							defaultValue={event?.finalDate}
							fromYear={currentDateParam ? new Date(currentDateParam).getFullYear() : new Date().getFullYear()}
							fromMonth={currentDateParam ? new Date(currentDateParam) : new Date()}
						/>
					</FormField>
				</div>
				<FormField label="Color" required>
					<ColorPicker id="color" name="color" defaultValue={event?.color} />
				</FormField>

				<FormField
					label={
						<span>
							Notes - <span className="text-xs text-muted-foreground">Rich text editor, select text to format.</span>
						</span>
					}
				>
					<TailwindEditor name="content" content={event?.content as JSONContent} editable={true} />
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
