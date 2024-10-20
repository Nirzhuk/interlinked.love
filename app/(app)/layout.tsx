import "../globals.css";
import "../prosemirror.css";
import Header from "@/components/Dashboard/Header";
import { UserProvider } from "@/lib/auth/client/context";
import type { Metadata, Viewport } from "next";
import { SessionProvider } from "next-auth/react";
import { Manrope } from "next/font/google";

export const metadata: Metadata = {
	title: "Interlinked - Dashboard",
	description: "Interlinked - Dashboard",
};

export const viewport: Viewport = {
	maximumScale: 1,
};

const manrope = Manrope({ subsets: ["latin"] });

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className={`${manrope.className}`}>
			<body className="bg-gray-50">
				<SessionProvider>
					<div className="flex flex-col min-h-screen">
						<Header />
						<main className="sm:w-10/12 sm:mx-auto w-full h-full px-4 pb-0 pt-8">{children}</main>
					</div>
				</SessionProvider>
			</body>
		</html>
	);
}
