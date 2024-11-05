"use client";

import {
	CalendarHeartIcon,
	CalendarIcon,
	Frame,
	GithubIcon,
	HeartIcon,
	HomeIcon,
	Map as MapIcon,
	PieChart,
	Send,
	Settings2,
} from "lucide-react";
import type * as React from "react";

import { NavMain } from "@/components/nav-main";

import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
	navMain: [
		{
			title: "Home",
			url: "/app",
			icon: HomeIcon,
		},
		{
			title: "Calendar",
			url: "/app/calendar",
			icon: CalendarIcon,
		},
		{
			title: "Events",
			url: "/app/events",
			icon: CalendarHeartIcon,
		},
		{
			title: "Settings",
			url: "#",
			icon: Settings2,
			items: [
				{
					title: "General",
					url: "/app/settings/general",
				},
				{
					title: "Activity",
					url: "/app/settings/activity",
				},
				{
					title: "Billing",
					url: "/app/settings/billing",
				},
			],
		},
	],
	navSecondary: [
		{
			title: "Github",
			url: "https://github.com/Nirzhuk/interlinked.love",
			icon: GithubIcon,
		},
		{
			title: "Roadmap",
			url: "/roadmap",
			icon: Send,
		},
	],
	projects: [
		{
			name: "Design Engineering",
			url: "#",
			icon: Frame,
		},
		{
			name: "Sales & Marketing",
			url: "#",
			icon: PieChart,
		},
		{
			name: "Travel",
			url: "#",
			icon: MapIcon,
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar variant="inset" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<a href="/app">
								<div className="flex aspect-square size-8 items-center justify-center rounded-lg  text-sidebar-primary-foreground">
									<HeartIcon className="size-4 text-primary" />
								</div>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">Interlinked.love</span>
									<span className="truncate text-xs">Group Friend</span>
								</div>
							</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />

				<NavSecondary items={data.navSecondary} className="mt-auto" />
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
		</Sidebar>
	);
}
