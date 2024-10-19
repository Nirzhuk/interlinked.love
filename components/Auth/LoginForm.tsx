"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CircleIcon, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function LoginForm() {
	const searchParams = useSearchParams();

	const redirect = searchParams.get("redirect");
	const priceId = searchParams.get("priceId");
	const inviteId = searchParams.get("inviteId");

	return (
		<div className="min-h-[100dvh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
			<div className="sm:mx-auto sm:w-full sm:max-w-md">
				<div className="flex justify-center">
					<CircleIcon className="h-12 w-12 text-violet-500" />
				</div>
				<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account </h2>
			</div>

			<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
				<form
					className="space-y-6"
					action={async (formData) => {
						await signIn("credentials", {
							email: formData.get("email"),
							password: formData.get("password"),

							redirect: true,
							redirectTo: "/app",
						});
					}}
				>
					<input type="hidden" name="redirect" value={redirect || ""} />
					<input type="hidden" name="priceId" value={priceId || ""} />
					<input type="hidden" name="inviteId" value={inviteId || ""} />

					<div>
						<Label htmlFor="email" className="block text-sm font-medium text-gray-700">
							Email
						</Label>
						<div className="mt-1">
							<Input
								id="email"
								name="email"
								type="email"
								autoComplete="email"
								required
								maxLength={50}
								className="appearance-none rounded-full relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
								placeholder="Enter your email"
							/>
						</div>
					</div>

					<div>
						<Label htmlFor="password" className="block text-sm font-medium text-gray-700">
							Password
						</Label>
						<div className="mt-1">
							<Input
								id="password"
								name="password"
								type="password"
								autoComplete="current-password"
								required
								minLength={8}
								maxLength={100}
								className="appearance-none rounded-full relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
								placeholder="Enter your password"
							/>
						</div>
					</div>

					{/* 					{state?.error && <div className="text-red-500 text-sm">{state.error}</div>}
					 */}
					<div>
						<Button
							type="submit"
							className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
						>
							Sign in
						</Button>
					</div>
				</form>

				<div className="mt-6">
					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-gray-300" />
						</div>
						<div className="relative flex justify-center text-sm">
							<span className="px-2 bg-gray-50 text-gray-500">New to our platform?</span>
						</div>
					</div>

					<div className="mt-6">
						<Link
							href={` /sign-up${redirect ? `?redirect=${redirect}` : ""}${priceId ? `&priceId=${priceId}` : ""}`}
							className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-full shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
						>
							Create an account
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
