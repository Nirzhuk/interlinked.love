import type { Event } from "@/lib/db/schema";
import type { TimeValue } from "react-aria-components";
import type { DateRange } from "react-day-picker";
import { create } from "zustand";

interface EventFormState {
	initialDayIsAllDay: boolean;
	setInitialDayIsAllDay: (initialDayIsAllDay: boolean) => void;
	finalDayIsAllDay: boolean;
	setFinalDayIsAllDay: (finalDayIsAllDay: boolean) => void;
	date: DateRange | undefined;
	setDate: (date: DateRange | undefined) => void;
	initializeWithEvent: (event?: Partial<Event>) => void;
}

export const useEventForm = create<EventFormState>((set) => ({
	initialDayIsAllDay: false,
	setInitialDayIsAllDay: (initialDayIsAllDay) => set({ initialDayIsAllDay }),
	finalDayIsAllDay: false,
	setFinalDayIsAllDay: (finalDayIsAllDay) => set({ finalDayIsAllDay }),
	date: undefined,
	setDate: (date) => set({ date }),

	initializeWithEvent: (event) => {
		if (!event) return;

		set({
			date:
				event.initialDate && event.finalDate
					? {
							from: new Date(event.initialDate),
							to: new Date(event.finalDate),
						}
					: undefined,
			initialDayIsAllDay: event.initialDayIsAllDay ?? false,
			finalDayIsAllDay: event.finalDayIsAllDay ?? false,
		});
	},
}));
