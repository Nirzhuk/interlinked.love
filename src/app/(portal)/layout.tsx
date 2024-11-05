import PortalNavigation from "@/components/Portal/PortalNavigation";
import type { Metadata, Viewport } from "next";
import { SessionProvider } from "next-auth/react";
export const metadata: Metadata = {
	title: "Interlinked - Home",
	description: "Interlinked - Home",
};

export const viewport: Viewport = {
	maximumScale: 1,
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<body className="min-h-[100dvh] bg-gray-50">
			<SessionProvider>
				<section className="flex flex-col min-h-screen">
					<PortalNavigation />
					<main>{children}</main>
				</section>
			</SessionProvider>
		</body>
	);
}
