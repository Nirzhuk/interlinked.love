import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface FormFieldProps {
	label: string | ReactNode;
	htmlFor?: string;
	error?: string;
	children: ReactNode;
	required?: boolean;
	mainClassName?: string;
}

export function FormField({ label, htmlFor, error, children, required, mainClassName }: FormFieldProps) {
	return (
		<div className={cn("flex flex-col gap-2", mainClassName)}>
			<Label htmlFor={htmlFor}>
				{label}
				{required && <span className="ml-1 text-red-500">*</span>}
			</Label>
			<div>
				{children}
				{error && <p className="text-red-500 text-sm mt-1">{error}</p>}
			</div>
		</div>
	);
}
