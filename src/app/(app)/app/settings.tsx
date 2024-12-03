"use client";

import { removeCoupleMember } from "@/app/(portal)/auth/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Marquee from "@/components/ui/marquee";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import type { CoupleDataWithMembers, Event, Invitation, User } from "@/lib/db/schema";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useActionState } from "react";
import { InviteCoupleMember } from "./invite-couple";

type ActionState = {
	error?: string;
	success?: string;
};

export function Settings({
	coupleData,
	upcomingEvents,
	invitations,
}: { coupleData: CoupleDataWithMembers; upcomingEvents: Partial<Event>[]; invitations: Invitation[] }) {
	const session = useSession();
	const user = session.data?.user;

	const [removeState, removeAction, isRemovePending] = useActionState<ActionState, FormData>(removeCoupleMember, {
		error: "",
		success: "",
	});

	const getUserDisplayName = (user: Pick<User, "id" | "name" | "email">) => {
		return user.name || user.email || "Unknown User";
	};

	return (
		<section className="flex-1 p-4 lg:p-8 w-full">
			<h2 className="text-lg lg:text-2xl font-medium mb-6">Upcoming Events</h2>
			<Marquee className="mb-6 py-2 bg-violet-100 rounded-lg" repeat={1} pauseOnHover={true}>
				{upcomingEvents.map((e, index) => (
					<Link
						key={`${e.id}-${index}`}
						href={`/app/calendar?event=${e.id}`}
						className={cn(
							"mx-4 cursor-pointer flex flex-col space-x-2 px-4",
							index !== upcomingEvents.length - 1 && "border-r border-violet-200",
						)}
					>
						<div className="text-sm font-medium">{e.title}</div>
						<div className="text-xs text-muted-foreground">
							{e.initialDate ? new Date(e.initialDate).toLocaleDateString() : "No date set"}
						</div>
					</Link>
				))}
			</Marquee>

			<h1 className="text-lg lg:text-2xl font-medium mb-6">Couple Settings</h1>

			<Card className="mb-8 dark:bg-zinc-900">
				<CardHeader>
					<CardTitle>Couple Members</CardTitle>
				</CardHeader>
				<CardContent>
					<ul className="space-y-4">
						{coupleData.coupleMembers.map((member, index) => (
							<li key={member.id} className="flex items-center justify-between">
								<div className="flex items-center space-x-4">
									<Avatar>
										<AvatarImage src={"/placeholder.svg?height=32&width=32"} alt={getUserDisplayName(member.user)} />
										<AvatarFallback>
											{getUserDisplayName(member.user)
												.split(" ")
												.map((n) => n[0])
												.join("")}
										</AvatarFallback>
									</Avatar>
									<div>
										<p className="font-medium">{getUserDisplayName(member.user)}</p>
										<p className="text-sm text-muted-foreground capitalize">{member.role}</p>
									</div>
								</div>
								{index >= 1 ? (
									<form action={removeAction}>
										<input type="hidden" name="memberId" value={member.id} />
										<Button type="submit" variant="outline" size="sm" disabled={isRemovePending}>
											{isRemovePending ? "Removing..." : "Remove"}
										</Button>
									</form>
								) : null}
							</li>
						))}
					</ul>
					{removeState?.error && <p className="text-red-500 mt-4">{removeState.error}</p>}
					<Separator className="my-4" />
					<div>
						<Select>
							<SelectTrigger>
								<SelectValue placeholder="Type of couple" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="couple">Couple</SelectItem>
								<SelectItem value="friends">Friends</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>
			<InviteCoupleMember />
			{user?.role === "owner" && (
				<Card className="mt-8 dark:bg-zinc-900">
					<CardHeader>
						<CardTitle>Invitations</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className="space-y-4">
							{invitations.map((invitation, index) => (
								<li key={invitation.id} className="flex items-center justify-between">
									<div className="flex items-center space-x-4">
										<p className="font-medium">{invitation.email}</p>
										<p className="text-sm text-muted-foreground capitalize">{invitation.role}</p>
										<Badge variant="secondary">{invitation.status}</Badge>
									</div>
								</li>
							))}
						</ul>
					</CardContent>
				</Card>
			)}
		</section>
	);
}
