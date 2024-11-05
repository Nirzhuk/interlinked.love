import "../prosemirror.css";
import { Toaster } from "@/components/ui/toaster";

import { NuqsAdapter } from "nuqs/adapters/next/app";

import { AppSidebar } from "@/components/app-sidebar";

import Header from "@/components/Dashboard/Header";

import PwaPrompt from "@/components/pwa/pwa-prompt";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { Metadata, Viewport } from "next";
import { SessionProvider } from "next-auth/react";
import { cookies } from "next/headers";

export const metadata: Metadata = {
	title: "Dashboard - Interlinked",
	description: "Dashboard - Interlinked",
};

export const viewport: Viewport = {
	maximumScale: 1,
};

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const cookieStore = await cookies();
	const pwaPromptClosed = cookieStore.get("pwa-prompt-closed");
	return (
		<body className="bg-gray-50">
			<ThemeProvider attribute="class" defaultTheme="light" storageKey="interlinked-theme">
				<PwaPrompt closed={pwaPromptClosed?.value === "true"} />
				<SessionProvider>
					<NuqsAdapter>
						<SidebarProvider>
							<AppSidebar />
							<SidebarInset>
								<Header />
								<main className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</main>

								<Toaster />
							</SidebarInset>
						</SidebarProvider>
					</NuqsAdapter>
				</SessionProvider>
			</ThemeProvider>
		</body>
	);
}
