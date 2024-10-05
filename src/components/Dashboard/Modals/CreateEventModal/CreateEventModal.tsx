"use client";
import { createEvent } from "@/src/app/(dashboard)/dashboard/calendar/actions";
import { Button } from "@/src/components/ui/button";
import { DatePicker } from "@/src/components/ui/date-picker";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useActionState } from "react";

import { ColorPicker } from "./components/ColorPicker";
import { FormField } from "./components/FormField";

interface CreateEventModalProps {
	isOpen: boolean;
	onChange: (state: boolean) => void;
}

type ActionState = {
	error?: string;
	success?: string;
};

const CreateEventModal = ({ isOpen, onChange }: CreateEventModalProps) => {
	const [state, formAction, isPending] = useActionState<ActionState, FormData>(
		createEvent,
		{ error: "", success: "" },
	);

	
	return (
		<Dialog open={isOpen} onOpenChange={onChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Create New Event</DialogTitle>
				</DialogHeader>
				<form action={formAction}>
					<div className="grid gap-4 py-4">
						<FormField label="Title">
							<Input name="title" required />
						</FormField>

						<FormField label="Description">
							<Textarea id="description" name="description" />
						</FormField>

						<FormField label="Start Date">
							<DatePicker id="initialDate" name="initialDate" />
						</FormField>

						<FormField label="End Date">
							<DatePicker id="finalDate" name="finalDate" />
						</FormField>

						<FormField label="Color">
							<ColorPicker id="color" name="color" />
						</FormField>

						<FormField label="Location">
							<Input id="location" name="location" />
						</FormField>
					</div>
					<DialogFooter>
						<Button type="submit" disabled={isPending}>
							{isPending ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Creating...
								</>
							) : (
								"Create Event"
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export default CreateEventModal;
