"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useIsSelfHosted } from "@/hooks/use-self-hosted";

import { Home, LayoutDashboard, LogOut, MenuIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

import { useState } from "react";

const PortalNavigation = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const session = useSession();
	const isSelfHosted = useIsSelfHosted();

	const user = session.data?.user;
	return (
		<header className="border-b border-gray-200">
			<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
				<Link href="/" className="flex items-center">
					<Image src="/icon-256x256.png" alt="Interlinked" width={24} height={24} />
					<span className="ml-2 text-xl font-semibold text-gray-900">Interlinked.love</span>
				</Link>
				<nav className="hidden md:flex items-center space-x-4">
					{!isSelfHosted && (
						<Link href="/pricing" className="text-sm font-medium text-gray-700 hover:text-gray-900">
							Pricing
						</Link>
					)}
					<Link href="/roadmap" className="text-sm font-medium text-gray-700 hover:text-gray-900">
						Roadmap
					</Link>
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
									<Link href="/app/calendar" className="flex w-full items-center">
										<Home className="mr-2 h-4 w-4" />
										<span>Dashboard</span>
									</Link>
								</DropdownMenuItem>

								<button type="submit" className="flex w-full" onClick={() => signOut()}>
									<DropdownMenuItem className="w-full flex-1 cursor-pointer">
										<LogOut className="mr-2 h-4 w-4" />
										<span>Sign out</span>
									</DropdownMenuItem>
								</button>
							</DropdownMenuContent>
						</DropdownMenu>
					) : (
						<Button asChild className="bg-black hover:bg-gray-800 text-white text-sm px-4 py-2 rounded-full">
							<Link href="/auth/sign-up">Sign Up</Link>
						</Button>
					)}
				</nav>
				<nav className="md:hidden flex items-center space-x-4">
					<Sheet>
						<SheetTrigger asChild>
							<Button variant="outline" size="icon">
								<MenuIcon className="w-4 h-4" />
							</Button>
						</SheetTrigger>
						<SheetContent>
							<SheetHeader>
								<SheetTitle>Interlinked</SheetTitle>
							</SheetHeader>
							<div className="flex flex-col gap-4 items-end">
								<Link href="/pricing">Pricing</Link>
								<Link href="/roadmap">Roadmap</Link>

								{user && (
									<>
										<Link href="/app/calendar" className="flex items-center gap-2">
											<LayoutDashboard className="mr-2 h-4 w-4" />
											App Calendar
										</Link>
										<div className="flex items-center gap-2" onKeyDown={() => signOut()}>
											<LogOut className="mr-2 h-4 w-4" />
											<span>Sign out</span>
										</div>
									</>
								)}
							</div>
						</SheetContent>
					</Sheet>
				</nav>
			</div>
		</header>
	);
};

export default PortalNavigation;
