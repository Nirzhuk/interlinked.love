"use client";

import { createComment } from "@/src/app/(app)/app/calendar/actions";
import { Button } from "@/src/components/ui/button";
import { Textarea } from "@/src/components/ui/textarea";
import { Loader2 } from "lucide-react";
import React from "react";
import { useActionState } from "react";

interface NewCommentFormProps {
	eventId: number;
}

type ActionState = {
	error?: string;
	success?: string;
};

const NewCommentForm = ({ eventId }: NewCommentFormProps) => {
	const [state, formAction, isPending] = useActionState<ActionState, FormData>(createComment, {
		error: "",
		success: "",
	});

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
