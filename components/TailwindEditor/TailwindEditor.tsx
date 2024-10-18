"use client";

import { EditorBubble, EditorContent, type EditorInstance, EditorRoot, type JSONContent } from "novel";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { defaultValue } from "./default-value";
import { LinkSelector } from "./selectors/link-selector";
import { NodeSelector } from "./selectors/node-selector";
import { TextButtons } from "./selectors/text-buttons";

import { cn } from "@/lib/utils";
import { defaultExtensions } from "./extensions";
import { ColorSelector } from "./selectors/color-selector";

const extensions = [...defaultExtensions];

const TailwindEditor = ({
	content,
	editable = false,
	name,
}: { content: JSONContent; editable?: boolean; name?: string }) => {
	const [initialValue, setInitialValue] = useState<JSONContent | undefined>(content || defaultValue);
	const [saveStatus, setSaveStatus] = useState<"Saved" | "Unsaved">("Saved");

	const [openNode, setOpenNode] = useState(false);
	const [openColor, setOpenColor] = useState(false);

	const [openLink, setOpenLink] = useState(false);

	const debouncedUpdates = useDebouncedCallback(async (editor: EditorInstance) => {
		const json = editor.getJSON();
		setInitialValue(json);
		setSaveStatus("Saved");
	}, 500);

	return (
		<div className="relative w-full">
			{editable && (
				<div className="flex absolute right-0 -top-7 z-10 mb-5 gap-2">
					<div className="rounded-md bg-accent px-2 py-1 text-xs text-muted-foreground">{saveStatus}</div>
				</div>
			)}
			{name && <input type="hidden" name={name} value={JSON.stringify(initialValue)} />}
			<EditorContent
				initialContent={initialValue}
				extensions={extensions}
				editable={editable}
				onUpdate={({ editor }) => {
					debouncedUpdates(editor);
					setSaveStatus("Unsaved");
				}}
				className={cn(
					"relative h-auto min-h-[60px] max-h-[300px] bg-background sm:rounded-lg sm:border ring-0 focus:ring-0",
					editable ? "border-muted" : "pointer-events-none border-none",
				)}
			>
				<EditorBubble
					tippyOptions={{
						placement: "top",
					}}
					className="flex w-fit max-w-[90vw] overflow-hidden rounded border border-muted bg-background shadow-xl"
				>
					<NodeSelector open={openNode} onOpenChange={setOpenNode} />
					{/* <ColorSelector open={openColor} onOpenChange={setOpenColor} /> */}
					<LinkSelector open={openLink} onOpenChange={setOpenLink} />
					<TextButtons />
				</EditorBubble>
			</EditorContent>
		</div>
	);
};
export default TailwindEditor;
