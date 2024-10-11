"use client";

import { EditorBubble, EditorContent, EditorRoot, type JSONContent } from "novel";
import { useState } from "react";
import { defaultValue } from "./default-value";
import { LinkSelector } from "./selectors/link-selector";
import { NodeSelector } from "./selectors/node-selector";
import { TextButtons } from "./selectors/text-buttonts";

import { cn } from "@/src/lib/utils";
import { defaultExtensions } from "./extensions";

const extensions = [...defaultExtensions];

const TailwindEditor = ({ content, editable = false }: { content: JSONContent; editable?: boolean }) => {
	const [initialValue, setInitialValue] = useState<JSONContent | undefined>(content || defaultValue);
	const [openNode, setOpenNode] = useState(false);
	const [openLink, setOpenLink] = useState(false);

	return (
		<EditorContent
			initialContent={initialValue}
			extensions={extensions}
			editable={editable}
			onUpdate={({ editor }) => {
				setInitialValue(editor.getJSON());
			}}
			className={cn(
				"relative h-auto max-h-[300px] w-full bg-background sm:rounded-lg sm:border ring-0 focus:ring-0",
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
				<LinkSelector open={openLink} onOpenChange={setOpenLink} />
				<TextButtons />
			</EditorBubble>
		</EditorContent>
	);
};
export default TailwindEditor;
