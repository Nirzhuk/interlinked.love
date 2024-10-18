import { ScrollArea } from "@/components/ui/scroll-area";
import type { EventCommentWithUser } from "@/types/comments";
import { useSession } from "next-auth/react";
import React from "react";

interface CommentsProps {
	comments: EventCommentWithUser[];
	height?: string;
}

const Comments = ({ comments, height = "200px" }: CommentsProps) => {
	const session = useSession();
	const user = session.data?.user;

	if (!user) {
		return null;
	}

	return (
		<ScrollArea className={"w-full  p-4"} style={{ height }}>
			<ul className="space-y-4">
				{comments.map((comment) => (
					<li key={comment.id} className={`flex ${comment.userId === user.id ? "justify-end" : "justify-start"}`}>
						<div
							className={`max-w-[70%] p-3 rounded-lg ${
								comment.userId === user.id ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
							}`}
						>
							<p className="text-sm">{comment.content}</p>
							<p className="text-xs text-gray-500 mt-1">
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
