"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/lib/auth/client/context";
import { CircleIcon, Home, LogOut } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { signOut } from "next-auth/react"

import { useState } from "react";

const Header = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const session = useSession();
	/* const { user, setUser } = useUser();
	const router = useRouter(); */

	const user = session.data?.user;
	return (
		<header className="border-b border-gray-200">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
				<Link href="/" className="flex items-center">
					<CircleIcon className="h-6 w-6 text-violet-500" />
					<span className="ml-2 text-xl font-semibold text-gray-900">Interlinked.love</span>
				</Link>
				<div className="flex items-center space-x-4">
					<Link href="/pricing" className="text-sm font-medium text-gray-700 hover:text-gray-900">
						Pricing
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
									<Link href="/app" className="flex w-full items-center">
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
				</div>
			</div>
		</header>
	);
};

export default Header;
