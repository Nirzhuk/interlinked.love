"use client";

import {
	EditorBubble,
	EditorCommand,
	EditorCommandEmpty,
	EditorCommandItem,
	EditorCommandList,
	EditorContent,
	type EditorInstance,
	EditorRoot,
	type JSONContent,
} from "novel";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { defaultValue } from "./default-value";
import { LinkSelector } from "./selectors/link-selector";
import { NodeSelector } from "./selectors/node-selector";
import { TextButtons } from "./selectors/text-buttons";
import { slashCommand, suggestionItems } from "./slash-command";

import { cn } from "@/lib/utils";
import { defaultExtensions } from "./extensions";
import { ColorSelector } from "./selectors/color-selector";

const extensions = [...defaultExtensions];

const Editor = ({ content, editable = false, name }: { content: JSONContent; editable?: boolean; name?: string }) => {
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
			<EditorRoot>
				<EditorContent
					initialContent={initialValue}
					extensions={extensions}
					editable={editable}
					onUpdate={({ editor }) => {
						debouncedUpdates(editor);
						setSaveStatus("Unsaved");
					}}
					className={cn(
						"relative h-auto min-h-[60px] max-h-[300px] bg-background  sm:rounded-lg sm:border ring-0 focus:ring-0",
						editable ? "border-muted dark:bg-zinc-950" : "border-none dark:bg-zinc-900",
					)}
				>
					{/*  Need to fix this
					<EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
						<EditorCommandEmpty className="px-2 text-muted-foreground">No results</EditorCommandEmpty>
						<EditorCommandList>
							{suggestionItems.map((item) => (
								<EditorCommandItem
									value={item.title}
									onCommand={(val) => item.command?.(val)}
									className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent"
									key={item.title}
								>
									<div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
										{item.icon}
									</div>
									<div>
										<p className="font-medium">{item.title}</p>
										<p className="text-xs text-muted-foreground">{item.description}</p>
									</div>
								</EditorCommandItem>
							))}
						</EditorCommandList>
					</EditorCommand> */}

					<EditorBubble
						tippyOptions={{
							placement: "top",
						}}
						className="flex w-fit max-w-[90vw] overflow-hidden rounded-xl border bg-background dark:bg-zinc-800 dark:border-zinc-700 shadow-xl"
					>
						<NodeSelector open={openNode} onOpenChange={setOpenNode} />
						<ColorSelector open={openColor} onOpenChange={setOpenColor} />
						<LinkSelector open={openLink} onOpenChange={setOpenLink} />
						<TextButtons />
					</EditorBubble>
				</EditorContent>
			</EditorRoot>
		</div>
	);
};
export default Editor;
