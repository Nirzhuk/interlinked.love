"use client";

import { removeCoupleMember } from "@/src/app/(login)/actions";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/src/components/ui/card";
import Marquee from "@/src/components/ui/marquee";
import type { CoupleDataWithMembers, Event, User } from "@/src/lib/db/schema";
import { customerPortalAction } from "@/src/lib/payments/actions";
import { cn } from "@/src/lib/utils";
import { useActionState } from "react";
import { InviteCoupleMember } from "./invite-couple";

type ActionState = {
	error?: string;
	success?: string;
};

export function Settings({
	coupleData,
	upcomingEvents,
}: { coupleData: CoupleDataWithMembers; upcomingEvents: Partial<Event>[] }) {
	const [removeState, removeAction, isRemovePending] = useActionState<
		ActionState,
		FormData
	>(removeCoupleMember, { error: "", success: "" });

	const getUserDisplayName = (user: Pick<User, "id" | "name" | "email">) => {
		return user.name || user.email || "Unknown User";
	};

	return (
		<section className="flex-1 p-4 lg:p-8 w-full">
			<h2 className="text-lg lg:text-2xl font-medium mb-6">Upcoming Events</h2>
			<Marquee
				className="mb-6 py-2 bg-violet-100 rounded-lg"
				repeat={1}
				pauseOnHover={true}
			>
				{upcomingEvents.map((e, index) => (
					<div
						key={`${e.id}-${index}`}
						className={cn(
							"mx-4 cursor-pointer flex flex-col space-x-2 px-4",
							index !== upcomingEvents.length - 1 &&
								"border-r border-violet-200",
						)}
					>
						<div className="text-sm font-medium">{e.location}</div>
						<div className="text-xs text-muted-foreground">
							{e.initialDate
								? new Date(e.initialDate).toLocaleDateString()
								: "No date set"}
						</div>
					</div>
				))}
			</Marquee>

			<h1 className="text-lg lg:text-2xl font-medium mb-6">Couple Settings</h1>

			<Card className="mb-8">
				<CardHeader>
					<CardTitle>Couple Subscription</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
							<div className="mb-4 sm:mb-0">
								<p className="font-medium">
									Current Plan: {coupleData.planName || "Free"}
								</p>
								<p className="text-sm text-muted-foreground">
									{coupleData.subscriptionStatus === "active"
										? "Billed monthly"
										: coupleData.subscriptionStatus === "trialing"
											? "Trial period"
											: "No active subscription"}
								</p>
							</div>
							<form action={customerPortalAction}>
								<Button type="submit" variant="outline">
									Manage Subscription
								</Button>
							</form>
						</div>
					</div>
				</CardContent>
			</Card>
			<Card className="mb-8">
				<CardHeader>
					<CardTitle>Couple Members</CardTitle>
				</CardHeader>
				<CardContent>
					<ul className="space-y-4">
						{coupleData.coupleMembers.map((member, index) => (
							<li key={member.id} className="flex items-center justify-between">
								<div className="flex items-center space-x-4">
									<Avatar>
										<AvatarImage
											src={"/placeholder.svg?height=32&width=32"}
											alt={getUserDisplayName(member.user)}
										/>
										<AvatarFallback>
											{getUserDisplayName(member.user)
												.split(" ")
												.map((n) => n[0])
												.join("")}
										</AvatarFallback>
									</Avatar>
									<div>
										<p className="font-medium">
											{getUserDisplayName(member.user)}
										</p>
										<p className="text-sm text-muted-foreground capitalize">
											{member.role}
										</p>
									</div>
								</div>
								{index > 1 ? (
									<form action={removeAction}>
										<input type="hidden" name="memberId" value={member.id} />
										<Button
											type="submit"
											variant="outline"
											size="sm"
											disabled={isRemovePending}
										>
											{isRemovePending ? "Removing..." : "Remove"}
										</Button>
									</form>
								) : null}
							</li>
						))}
					</ul>
					{removeState?.error && (
						<p className="text-red-500 mt-4">{removeState.error}</p>
					)}
				</CardContent>
			</Card>
			<InviteCoupleMember />
		</section>
	);
}
