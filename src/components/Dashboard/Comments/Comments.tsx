import { removeCommentAction } from "@/app/(app)/app/calendar/actions";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCalendar } from "@/contexts/CalendarContext";
import { useToast } from "@/hooks/use-toast";
import type { EventCommentWithUser } from "@/types/comments";
import { XIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import React from "react";

interface CommentsProps {
	comments: EventCommentWithUser[];
	height?: string;
}

const Comments = ({ comments, height = "200px" }: CommentsProps) => {
	const session = useSession();
	const { toast } = useToast();

	const { removeComment } = useCalendar();
	const user = session.data?.user;

	if (!user) {
		return null;
	}

	const handleDeleteComment = async (commentId: number) => {
		const result = await removeCommentAction({ commentId });

		if (result?.data?.success) {
			removeComment(commentId);
			toast({
				title: "Comment deleted",
				description: "Comment deleted successfully",
			});
			return;
		}
	};

	return (
		<ScrollArea className={"w-full p-4"} style={{ height }}>
			<ul className="space-y-4">
				{comments.map((comment) => (
					<li key={comment.id} className={`flex ${comment.userId === user.id ? "justify-end" : "justify-start"}`}>
						<div
							className={`max-w-[70%] relative p-3 rounded-lg ${
								comment.userId === user.id
									? "bg-blue-500 dark:bg-blue-600 text-white shadow-sm"
									: "bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 shadow-sm"
							}`}
						>
							{comment.userId === user.id && (
								<button
									type="button"
									className="absolute top-2 right-2 -0 w-2 h-2 rounded-full cursor-pointer text-white/80 hover:text-white"
									onClick={() => handleDeleteComment(comment.id)}
								>
									<XIcon className="w-2 h-2" />
								</button>
							)}
							<p className="text-sm text-wrap max-w-[200px] overflow-clip break-words">{comment.content}</p>
							<p
								className={`text-xs mt-1 ${
									comment.userId === user.id ? "text-blue-50/80" : "text-gray-500 dark:text-gray-400"
								}`}
							>
								{comment.userId === user.id ? "You" : comment.userName} • {new Date(comment.createdAt).toLocaleString()}
							</p>
						</div>
					</li>
				))}
			</ul>
		</ScrollArea>
	);
};

export default Comments;
