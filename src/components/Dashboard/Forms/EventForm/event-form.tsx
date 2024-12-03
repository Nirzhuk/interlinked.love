"use client";

import { createEventAction, updateEventAction } from "@/app/(app)/app/calendar/actions";
import { Button } from "@/components/ui/button";

import Editor from "@/components/Editor";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

import { Input } from "@/components/ui/input";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import TimePicker from "@/components/ui/time-picker";
import { useCalendar } from "@/contexts/CalendarContext";
import { useToast } from "@/hooks/use-toast";
import type { Event } from "@/lib/db/schema";

import { Loader2 } from "lucide-react";
import type { JSONContent } from "novel";

import React, { useEffect, useState } from "react";
import { useActionState } from "react";

import { Time } from "@internationalized/date";

import { concateDateAndTime } from "@/lib/dateUtils";
import { ColorPicker } from "./components/color-picker";
import { FormField } from "./components/form-field";
import { useEventForm } from "./store";

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

	const {
		date,
		setDate,
		initialDayIsAllDay,
		setInitialDayIsAllDay,
		finalDayIsAllDay,
		setFinalDayIsAllDay,
		initializeWithEvent,
	} = useEventForm();

	const [eventState, setEventState] = useState<Partial<Event> | undefined>(event);

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

	useEffect(() => {
		initializeWithEvent(event);
	}, [event, initializeWithEvent]);

	return (
		<form action={formAction}>
			<div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-4 overflow-x-scroll">
				<div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-4">
					<Card>
						<CardHeader>
							<CardTitle>Event Details</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid gap-6">
								<FormField htmlFor="title" label="Title" required>
									<Input id="title" name="title" required defaultValue={eventState?.title || ""} />
								</FormField>

								<div className="grid grid-cols-2 gap-3">
									<FormField label="Location">
										<Input id="location" name="location" defaultValue={eventState?.location || ""} />
									</FormField>

									<div className="grid gap-3">
										<FormField
											label={
												<>
													Project<span className="text-[9px] text-muted-foreground">(WIP Feature, check roadmap)</span>
												</>
											}
										>
											<Select disabled>
												<SelectTrigger>
													<SelectValue placeholder="Select a project" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="1">Dont look at me</SelectItem>
													<SelectItem value="2">I'm wip</SelectItem>
												</SelectContent>
											</Select>
										</FormField>
									</div>
								</div>
								<div className="grid gap-3">
									<FormField label="Description" mainClassName="flex-1">
										<Textarea
											id="description"
											name="description"
											defaultValue={eventState?.description || ""}
											className="min-h-24 max-h-36"
										/>
									</FormField>
								</div>
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle>Notes</CardTitle>
						</CardHeader>
						<CardContent>
							<FormField
								label={
									<span>
										Notes -{" "}
										<span className="text-xs text-muted-foreground">Rich text editor, select text to format.</span>
									</span>
								}
							>
								<Editor name="content" content={eventState?.content as JSONContent} editable={true} />
							</FormField>
						</CardContent>
					</Card>
					{/* <Card>
						<CardHeader>
							<CardTitle>Comments</CardTitle>
						</CardHeader> 
						<CardContent>
							<Comments comments={[]} />
										<NewCommentForm eventId={0} /> 
						</CardContent>
						 <CardFooter className="justify-center border-t p-4">
										<Button size="sm" variant="ghost" className="gap-1">
											<PlusCircle className="h-3.5 w-3.5" />
											Add Variant
										</Button>
									</CardFooter> 
					</Card> */}
				</div>
				<div className="grid auto-rows-max items-start gap-4 lg:gap-4">
					<input type="hidden" name="initialDate" value={concateDateAndTime(date?.from || new Date(), "00:00")} />
					<input type="hidden" name="finalDate" value={concateDateAndTime(date?.to || new Date(), "00:00")} />
					<Card>
						<CardHeader>
							<CardTitle>Event Color</CardTitle>
						</CardHeader>
						<CardContent>
							<FormField label="Color" required>
								<ColorPicker id="color" name="color" defaultValue={eventState?.color} />
							</FormField>
						</CardContent>
					</Card>
					<Card className="overflow-hidden">
						<CardHeader>
							<CardTitle>Event Time</CardTitle>
						</CardHeader>
						<CardContent className="flex justify-center w-full ">
							<div className="flex flex-col gap-4">
								<div>
									<Calendar mode="range" selected={date} onSelect={setDate} />
								</div>
								<div className="flex flex-col gap-4">
									<FormField label="Initial day">
										<div className="flex gap-4">
											<TimePicker
												name="initialDayInitialTime"
												label="Start Time"
												defaultValue={
													eventState?.initialDate
														? new Time(
																eventState?.initialDate?.getHours() || undefined,
																eventState?.initialDate?.getMinutes() || undefined,
															)
														: undefined
												}
												disabled={initialDayIsAllDay || !date?.from}
											/>
											<TimePicker
												name="initialDayFinalTime"
												label="End Time"
												disabled={initialDayIsAllDay || !date?.from}
											/>
										</div>
										<div className="flex items-center space-x-2 mt-2">
											<Checkbox
												id="is-all-day"
												name="initialDayIsAllDay"
												checked={initialDayIsAllDay}
												onCheckedChange={(checked) => setInitialDayIsAllDay(checked as boolean)}
											/>
											<label
												htmlFor="is-all-day"
												className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
											>
												Event is all day
											</label>
										</div>
									</FormField>

									<FormField label="Final day">
										<div className="flex gap-4">
											<TimePicker
												name="finalDayInitialTime"
												label="Start Time"
												disabled={finalDayIsAllDay || !date?.to}
											/>
											<TimePicker name="finalDayFinalTime" label="End Time" disabled={finalDayIsAllDay || !date?.to} />
										</div>
										<div className="flex items-center space-x-2 gap mt-2">
											<Checkbox
												id="is-all-day"
												name="initialDayIsAllDay"
												checked={finalDayIsAllDay}
												onCheckedChange={(checked) => setFinalDayIsAllDay(checked as boolean)}
											/>
											<label
												htmlFor="is-all-day"
												className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
											>
												Event is all day
											</label>
										</div>
									</FormField>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
			<div className="flex justify-end mt-10 mb-2">
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
			</div>
		</form>
	);
};

export default EventForm;
