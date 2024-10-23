"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function DatePicker({
	id,
	name,
	defaultValue = undefined,
	fromYear,
	fromMonth,
}: {
	id: string;
	name: string;
	defaultValue: Date | undefined;
	fromYear: number;
	fromMonth: Date;
}) {
	const [date, setDate] = useState<Date | undefined>(defaultValue);

	return (
		<>
			<input type="hidden" name={name} value={date?.toISOString()} />

			<Popover>
				<PopoverTrigger asChild>
					<Button
						variant={"outline"}
						className={cn(" sm:w-[280px] justify-start text-left font-normal", !date && "text-muted-foreground")}
					>
						<CalendarIcon className="mr-2 h-4 w-4" />
						{date ? format(date, "PPP") : <span>Pick a date</span>}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0">
					<Calendar
						id={id}
						mode="single"
						selected={date}
						onSelect={setDate}
						fromYear={fromYear}
						fromMonth={fromMonth}
					/>
				</PopoverContent>
			</Popover>
		</>
	);
}
