// Dependencies: pnpm install lucide-react react-aria-components

"use client";

import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";
import { DateInput, DateSegment, Label, TimeField, type TimeValue } from "react-aria-components";

interface TimePickerProps {
	name: string;
	value?: TimeValue | null | undefined;
	defaultValue?: TimeValue | null | undefined;
	onChange?: (value: TimeValue | null | undefined) => void;
	label: string;
	disabled?: boolean;
}

export default function TimePicker({ name, defaultValue, value, onChange, label, disabled }: TimePickerProps) {
	return (
		<TimeField
			name={name}
			value={value}
			defaultValue={defaultValue}
			onChange={onChange}
			className="space-y-2"
			isDisabled={disabled}
		>
			<Label className="text-sm font-medium text-foreground">{label}</Label>
			<div className="relative">
				<div
					className={cn(
						"pointer-events-none absolute inset-y-0 start-0 z-10 flex items-center justify-center ps-3 text-muted-foreground/80",
						disabled && "text-foreground/10",
					)}
				>
					<Clock size={16} strokeWidth={2} aria-hidden="true" />
				</div>
				<DateInput className="relative inline-flex h-9 w-full items-center overflow-hidden whitespace-nowrap rounded-lg border border-input bg-background px-3 py-2 ps-9 text-sm shadow-sm shadow-black/5 ring-offset-background transition-shadow data-[focus-within]:border-ring data-[disabled]:opacity-50 data-[focus-within]:outline-none data-[focus-within]:ring-2 data-[focus-within]:ring-ring/30 data-[focus-within]:ring-offset-2">
					{(segment) => (
						<DateSegment
							segment={segment}
							className="inline rounded p-0.5 text-foreground caret-transparent outline outline-0 data-[disabled]:cursor-not-allowed data-[focused]:bg-accent data-[invalid]:data-[focused]:bg-destructive data-[type=literal]:px-0 data-[focused]:data-[placeholder]:text-foreground data-[focused]:text-foreground data-[invalid]:data-[focused]:data-[placeholder]:text-destructive-foreground data-[invalid]:data-[focused]:text-destructive-foreground data-[invalid]:data-[placeholder]:text-destructive data-[invalid]:text-destructive data-[placeholder]:text-muted-foreground/70 data-[type=literal]:text-muted-foreground/70 data-[disabled]:opacity-50"
						/>
					)}
				</DateInput>
			</div>
		</TimeField>
	);
}
