import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface ColorOptionProps {
	value: string;
	label: string;
	cssClass: string;
}

export function ColorOption({ value, label, cssClass }: ColorOptionProps) {
	return (
		<div className="flex items-center">
			<RadioGroupItem value={value} id={value} className="peer sr-only" />
			<Label
				htmlFor={value}
				className={cn(
					"size-6 rounded cursor-pointer relative",
					cssClass,
					"ring-offset-2 ring-offset-background transition-all",
					"hover:ring-2 hover:ring-slate-400",
					"peer-focus-visible:ring-2 peer-focus-visible:ring-slate-400",
					"peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-slate-600",
				)}
			>
				<span className="sr-only">{label}</span>
				<Check className="absolute inset-0 m-auto h-4 w-4 text-white opacity-0 transition-opacity peer-data-[state=checked]:opacity-100 drop-shadow-[0_0px_1px_rgba(0,0,0,0.5)]" />
			</Label>
		</div>
	);
}
