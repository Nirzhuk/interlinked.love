"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ChevronDown, HeartIcon, Home, LogOut, Menu } from "lucide-react";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const routes = [
	{
		title: "Dashboard",
		url: "/app",
	},
	{
		title: "Calendar",
		url: "/app/calendar",
	},

	{
		title: "Settings",
		url: "/app/settings",
		items: [
			{
				title: "General",
				url: "/app/general",
			},
			{
				title: "Activity",
				url: "/app/activity",
			},
		],
	},
];

const Header = () => {
	const pathname = usePathname();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const session = useSession();

	const user = session.data?.user;

	const isActiveRoute = (route: string) => {
		return pathname === route;
	};

	async function handleSignOut() {
		signOut({ redirectTo: "/" });
	}

	return (
		<header className="border-b border-gray-200">
			<div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
				<Link href="/app" className="flex items-center">
					<HeartIcon className="h-6 w-6 text-violet-500" />
					<span className="ml-2 text-xl font-semibold text-gray-900">Interlinked.love</span>
				</Link>

				{/* Desktop Navigation */}
				<nav className="hidden md:flex items-center space-x-4">
					{routes.map((route) =>
						route.items ? (
							<DropdownMenu key={route.url}>
								<DropdownMenuTrigger className="flex items-center text-sm font-medium text-gray-700 hover:text-violet-900">
									{route.title}
									<ChevronDown className="ml-1 h-4 w-4" />
								</DropdownMenuTrigger>
								<DropdownMenuContent>
									{route.items.map((item) => (
										<DropdownMenuItem key={item.url} asChild>
											<Link
												href={item.url}
												className={cn(
													"w-full cursor-pointer",
													isActiveRoute(item.url) ? "text-violet-900 font-bold" : "text-gray-700 hover:text-violet-900",
												)}
											>
												{item.title}
											</Link>
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						) : (
							<Link
								key={route.url}
								href={route.url}
								className={cn(
									" font-medium",
									isActiveRoute(route.url) ? "text-violet-900 font-bold" : "text-gray-700 hover:text-violet-900",
									route.url === "/app/calendar" && "font-bold uppercase",
								)}
							>
								{route.title}
							</Link>
						),
					)}
				</nav>

				{/* Mobile Menu Button */}
				<button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} type="button">
					<Menu className="h-6 w-6 text-gray-700" />
				</button>

				{/* User Menu (Desktop) */}
				<div className="hidden md:flex items-center space-x-4">
					{user ? (
						<DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
							<DropdownMenuTrigger asChild>
								<Avatar className="cursor-pointer size-9">
									<AvatarImage alt={user.name || ""} />
									<AvatarFallback>
										{user.email
											?.split(" ")
											.map((n) => n[0])
											.join("")
											.toUpperCase()}
									</AvatarFallback>
								</Avatar>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="flex flex-col gap-1">
								<DropdownMenuItem className="cursor-pointer">
									<Link href="/app" className="flex w-full items-center">
										<Home className="mr-2 h-4 w-4" />
										<span>Dashboard</span>
									</Link>
								</DropdownMenuItem>
								<form action={handleSignOut} className="w-full">
									<button type="submit" className="flex w-full">
										<DropdownMenuItem className="w-full flex-1 cursor-pointer">
											<LogOut className="mr-2 h-4 w-4" />
											<span>Sign out</span>
										</DropdownMenuItem>
									</button>
								</form>
							</DropdownMenuContent>
						</DropdownMenu>
					) : (
						<Button asChild className="bg-black hover:bg-gray-800 text-white text-sm px-4 py-2 rounded-full">
							<Link href="/sign-up">Sign Up</Link>
						</Button>
					)}
				</div>
			</div>

			{/* Mobile Navigation */}
			{isMobileMenuOpen && (
				<div className="md:hidden">
					<nav className="flex flex-col px-4 py-2 space-y-2">
						{routes.map((route) =>
							route.items ? (
								<div key={route.url} className="space-y-2">
									<div className="font-medium text-gray-700">{route.title}</div>
									{route.items.map((item) => (
										<Link
											key={item.url}
											href={item.url}
											className={cn(
												"block pl-4 text-sm",
												isActiveRoute(item.url) ? "text-violet-900 font-bold" : "text-gray-700 hover:text-violet-900",
											)}
											onClick={() => setIsMobileMenuOpen(false)}
										>
											{item.title}
										</Link>
									))}
								</div>
							) : (
								<Link
									key={route.url}
									href={route.url}
									className={cn(
										"text-sm font-medium",
										isActiveRoute(route.url) ? "text-violet-900 font-bold" : "text-gray-700 hover:text-violet-900",
									)}
									onClick={() => setIsMobileMenuOpen(false)}
								>
									{route.title}
								</Link>
							),
						)}
					</nav>
					{user ? (
						<div className="px-4 py-2">
							<Link
								href="/app"
								className="flex items-center text-gray-700 hover:text-violet-900"
								onClick={() => setIsMobileMenuOpen(false)}
							>
								<Home className="mr-2 h-4 w-4" />
								<span>Dashboard</span>
							</Link>

							<button
								type="submit"
								className="flex items-center text-gray-700 hover:text-violet-900 "
								onClick={() => signOut({ redirectTo: "/" })}
							>
								<LogOut className="mr-2 h-4 w-4" />
								<span>Sign out</span>
							</button>
						</div>
					) : (
						<div className="px-4 py-2">
							<Button
								asChild
								className="w-full bg-black hover:bg-gray-800 text-white text-sm px-4 py-2 rounded-full"
								onClick={() => setIsMobileMenuOpen(false)}
							>
								<Link href="/sign-up">Sign Up</Link>
							</Button>
						</div>
					)}
				</div>
			)}
		</header>
	);
};

export default Header;
