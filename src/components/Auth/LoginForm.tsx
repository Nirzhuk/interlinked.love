"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { type LiteralUnion, getProviders, signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { use, useState } from "react";

const providerSvgs = {
	github: (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" className="h-5 w-5  fill-primary-foreground">
			<title>github</title>
			<path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
		</svg>
	),
	google: (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512" className="h-5 w-5  fill-primary-foreground">
			<title>google</title>
			<path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
		</svg>
	),
};

export function LoginForm() {
	const providers = use(getProviders());
	const searchParams = useSearchParams();

	const redirect = searchParams.get("redirect");
	const priceId = searchParams.get("priceId");
	const inviteId = searchParams.get("inviteId");
	const error = searchParams.get("error");
	const code = searchParams.get("code");

	// biome-ignore lint/suspicious/noExplicitAny: any due to next-auth/react not exporting the type
	const [submittedProvider, setSubmittedProvider] = useState<LiteralUnion<any> | null>(null);

	// biome-ignore lint/suspicious/noExplicitAny: any due to next-auth/react not exporting the type
	const handleProviderClick = (provider: any) => {
		setSubmittedProvider(provider);
		signIn(provider);
	};

	return (
		<div className="min-h-[100dvh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
			<div className="sm:mx-auto sm:w-full sm:max-w-md">
				<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
			</div>

			<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
				<form
					className="space-y-6"
					action={async (formData) => {
						await signIn("credentials", {
							email: formData.get("email")?.toString().trim().toLowerCase(),
							password: formData.get("password"),
							redirect: true,
							redirectTo: "/app/calendar",
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
								placeholder="Enter your password"
							/>
						</div>
					</div>
					{error && <div className="text-red-500 text-sm">{code}</div>}
					{/* 					{state?.error && <div className="text-red-500 text-sm">{state.error}</div>}
					 */}
					<div>
						<Button type="submit" className="w-full">
							Sign in
						</Button>
					</div>
				</form>
				<div className="mt-6 flex flex-col gap-4">
					{providers &&
						Object.values(providers).map((provider) => {
							if (provider.id.includes("credentials")) return null;
							return (
								<Button
									key={provider.id}
									onClick={() => handleProviderClick(provider.id)}
									variant={"secondary"}
									type="button"
								>
									{submittedProvider === provider.id ? (
										<Loader2 className="w-5 h-5" />
									) : (
										providerSvgs[provider.id as keyof typeof providerSvgs]
									)}
									<span className="ml-4">Continue with {provider.name}</span>
								</Button>
							);
						})}
				</div>
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
							href={`/auth/sign-up${redirect ? `?redirect=${redirect}` : ""}${priceId ? `&priceId=${priceId}` : ""}`}
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
