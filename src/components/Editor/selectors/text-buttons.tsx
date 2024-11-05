import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BoldIcon, CodeIcon, ItalicIcon, StrikethroughIcon, UnderlineIcon } from "lucide-react";
import { EditorBubbleItem, useEditor } from "novel";
import type { SelectorItem } from "./node-selector";

export const TextButtons = () => {
	const { editor } = useEditor();
	if (!editor) return null;
	const items: SelectorItem[] = [
		{
			name: "bold",
			isActive: (editor) => Boolean(editor?.isActive("bold")),
			command: (editor) => editor?.chain().focus().toggleBold().run(),
			icon: BoldIcon,
		},
		{
			name: "italic",
			isActive: (editor) => Boolean(editor?.isActive("italic")),
			command: (editor) => editor?.chain().focus().toggleItalic().run(),
			icon: ItalicIcon,
		},
		{
			name: "underline",
			isActive: (editor) => Boolean(editor?.isActive("underline")),
			command: (editor) => editor?.chain().focus().toggleUnderline().run(),
			icon: UnderlineIcon,
		},
		{
			name: "strike",
			isActive: (editor) => Boolean(editor?.isActive("strike")),
			command: (editor) => editor?.chain().focus().toggleStrike().run(),
			icon: StrikethroughIcon,
		},
		{
			name: "code",
			isActive: (editor) => Boolean(editor?.isActive("code")),
			command: (editor) => editor?.chain().focus().toggleCode().run(),
			icon: CodeIcon,
		},
	];
	return (
		<div className="flex">
			{items.map((item, index) => (
				<EditorBubbleItem
					key={`${item.name}-${index}`}
					onSelect={(editor) => {
						item.command(editor);
					}}
				>
					<Button
						size="icon"
						className="rounded-none hover:bg-accent dark:hover:bg-zinc-700"
						variant="ghost"
						type="button"
					>
						<item.icon
							className={cn("h-4 w-4", {
								"text-blue-500 dark:text-blue-400": item.isActive(editor),
							})}
						/>
					</Button>
				</EditorBubbleItem>
			))}
		</div>
	);
};
