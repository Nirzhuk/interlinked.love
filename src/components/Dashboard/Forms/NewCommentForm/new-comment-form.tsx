"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCalendar } from "@/contexts/CalendarContext";
import { useToast } from "@/hooks/use-toast";
import type { EventCommentWithUser } from "@/types/comments";
import { Loader2 } from "lucide-react";
import React, { useEffect } from "react";
import { useActionState } from "react";
import { createComment } from "../../../../app/(app)/app/calendar/actions";

interface NewCommentFormProps {
	eventId: number;
}

type ActionState = {
	error?: string;
	success?: string;
	comment?: EventCommentWithUser;
};

const NewCommentForm = ({ eventId }: NewCommentFormProps) => {
	const { addComment } = useCalendar();
	const { toast } = useToast();
	const [state, formAction, isPending] = useActionState<ActionState, FormData>(createComment, {
		error: "",
		success: "",
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (state.success) {
			addComment(eventId, state.comment as EventCommentWithUser);
			toast({
				title: "Comment created",
				description: "Comment created successfully",
			});
		}
	}, [state]);

	return (
		<form action={formAction} className="flex flex-col gap-1">
			<input type="hidden" name="eventId" value={eventId} />
			<Textarea placeholder="Add a comment" name="content" required />
			<Button disabled={isPending} type="submit" className="w-[125px]" size="sm">
				{isPending ? (
					<>
						<Loader2 className="animate-spin mr-2 h-4 w-4" />
						Loading...
					</>
				) : (
					"Add Comment"
				)}
			</Button>
		</form>
	);
};

export default NewCommentForm;
