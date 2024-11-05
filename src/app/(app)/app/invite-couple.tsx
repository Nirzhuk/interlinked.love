"use client";

import { inviteCoupleMember } from "@/app/(app)/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { Loader2, PlusCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useActionState } from "react";

type ActionState = {
	error?: string;
	success?: string;
	inviteId?: number;
};

export function InviteCoupleMember() {
	const { data: session } = useSession();

	const role = session?.user.role;
	const isOwner = role === "owner";
	const [inviteState, inviteAction, isInvitePending] = useActionState<ActionState, FormData>(inviteCoupleMember, {
		error: "",
		success: "",
	});

	return (
		<Card className="dark:bg-zinc-900">
			<CardHeader>
				<CardTitle>Invite Couple Member</CardTitle>
			</CardHeader>
			<CardContent>
				<form action={inviteAction} className="space-y-4">
					<div>
						<Label htmlFor="email">Email</Label>
						<Input id="email" name="email" type="email" placeholder="Enter email" required disabled={!isOwner} />
					</div>
					<div>
						<Label>Role</Label>
						<RadioGroup defaultValue="member" name="role" className="flex space-x-4" disabled={!isOwner}>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="member" id="member" />
								<Label htmlFor="member">Member</Label>
							</div>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="owner" id="owner" />
								<Label htmlFor="owner">Owner</Label>
							</div>
						</RadioGroup>
					</div>
					{inviteState?.error && <p className="text-red-500">{inviteState.error}</p>}
					{inviteState?.success && <p className="text-green-500">{inviteState.success}</p>}
					<Button
						type="submit"
						className="bg-violet-500 hover:bg-violet-600 text-white"
						disabled={isInvitePending || !isOwner}
					>
						{isInvitePending ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Inviting...
							</>
						) : (
							<>
								<PlusCircle className="mr-2 h-4 w-4" />
								Invite Member
							</>
						)}
					</Button>
					<h2>Due the feature being in development, invite the user and after that give them this link</h2>
					{inviteState?.inviteId && (
						<pre>
							{process.env.NEXT_PUBLIC_BASE_URL}/auth/sign-up?inviteId=
							{inviteState?.inviteId}
						</pre>
					)}
				</form>
			</CardContent>
			{!isOwner && (
				<CardFooter>
					<p className="text-sm text-muted-foreground">You must be a couple owner to invite new members.</p>
				</CardFooter>
			)}
		</Card>
	);
}
