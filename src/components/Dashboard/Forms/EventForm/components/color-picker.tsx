import { RadioGroup } from "@/components/ui/radio-group";
import { useState } from "react";
import { ColorOption } from "./color-option";

const colorOptions = [
	{ value: "pink", label: "Pink", cssClass: "bg-pink-300" },
	{ value: "rose", label: "Rose", cssClass: "bg-rose-300" },
	{ value: "fuchsia", label: "Fuchsia", cssClass: "bg-fuchsia-300" },
	{ value: "violet", label: "Violet", cssClass: "bg-violet-300" },
	{ value: "purple", label: "Purple", cssClass: "bg-purple-300" },
	{ value: "indigo", label: "Indigo", cssClass: "bg-indigo-300" },
	{ value: "blue", label: "Blue", cssClass: "bg-blue-300" },
	{ value: "sky", label: "Sky", cssClass: "bg-sky-300" },
	{ value: "cyan", label: "Cyan", cssClass: "bg-cyan-300" },
	{ value: "teal", label: "Teal", cssClass: "bg-teal-300" },
	{ value: "emerald", label: "Emerald", cssClass: "bg-emerald-300" },
	{ value: "green", label: "Green", cssClass: "bg-green-300" },
	{ value: "lime", label: "Lime", cssClass: "bg-lime-300" },
	{ value: "yellow", label: "Yellow", cssClass: "bg-yellow-300" },
	{ value: "amber", label: "Amber", cssClass: "bg-amber-300" },
	{ value: "orange", label: "Orange", cssClass: "bg-orange-300" },
	{ value: "red", label: "Red", cssClass: "bg-red-300" },
	{ value: "stone", label: "Stone", cssClass: "bg-stone-300" },
];

interface ColorPickerProps {
	name: string;
	id: string;
	defaultValue?: string;
}

export function ColorPicker({ name, defaultValue = "pink" }: ColorPickerProps) {
	const [value, setValue] = useState<string>(defaultValue);
	return (
		<>
			<input type="hidden" name={name} value={value} />
			<RadioGroup onValueChange={setValue} defaultValue={value} className="grid grid-cols-9 gap-2">
				{colorOptions.map((color) => (
					<ColorOption key={color.value} value={color.value} label={color.label} cssClass={color.cssClass} />
				))}
			</RadioGroup>
		</>
	);
}
