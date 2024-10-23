import "../globals.css";
import "../prosemirror.css";
import Header from "@/components/Dashboard/Header";
import { Toaster } from "@/components/ui/toaster";

import { NuqsAdapter } from "nuqs/adapters/next/app";

import type { Metadata, Viewport } from "next";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
	title: "Dashboard - Interlinked",
	description: "Dashboard - Interlinked",
};

export const viewport: Viewport = {
	maximumScale: 1,
};

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<body className="bg-gray-50">
			<SessionProvider>
				<NuqsAdapter>
					<div className="flex flex-col min-h-screen">
						<Header />
						<main className="sm:w-10/12 sm:mx-auto w-full h-full px-4 pb-0 pt-8">{children}</main>
					</div>
					<Toaster />
				</NuqsAdapter>
			</SessionProvider>
		</body>
	);
}
