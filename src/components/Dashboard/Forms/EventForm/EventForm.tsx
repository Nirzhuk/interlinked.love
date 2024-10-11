"use client";

import { createEvent, updateEvent } from "@/src/app/(dashboard)/dashboard/calendar/actions";
import { Button } from "@/src/components/ui/button";

import TailwindEditor from "@/src/components/TailwindEditor/TailwindEdit";
import { DatePicker } from "@/src/components/ui/date-picker";
import { DialogFooter } from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import type { Event } from "@/src/lib/db/schema";
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
				<input type="hidden" name="eventId" value={event?.id} />
				<FormField label="Title">
					<Input name="title" required defaultValue={event?.title || ""} />
				</FormField>

				<FormField label="Description">
					<Textarea id="description" name="description" defaultValue={event?.description || ""} />
				</FormField>

				<FormField label="Start Date">
					<DatePicker
						id="initialDate"
						name="initialDate"
						defaultValue={event?.initialDate}
						fromYear={currentDateParam ? new Date(currentDateParam).getFullYear() : new Date().getFullYear()}
						fromMonth={currentDateParam ? new Date(currentDateParam) : new Date()}
					/>
				</FormField>

				<FormField label="End Date">
					<DatePicker
						id="finalDate"
						name="finalDate"
						defaultValue={event?.finalDate}
						fromYear={currentDateParam ? new Date(currentDateParam).getFullYear() : new Date().getFullYear()}
						fromMonth={currentDateParam ? new Date(currentDateParam) : new Date()}
					/>
				</FormField>

				<FormField label="Color">
					<ColorPicker id="color" name="color" defaultValue={event?.color} />
				</FormField>

				<FormField label="Location">
					<Input id="location" name="location" defaultValue={event?.location || ""} />
				</FormField>

				<FormField label="Notes">
					<TailwindEditor content={event?.content as JSONContent} editable={true} />
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
