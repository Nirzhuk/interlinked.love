import "../globals.css";
import Header from "@/components/Portal/Header";
import type { Metadata, Viewport } from "next";
import { SessionProvider } from "next-auth/react";
import { Manrope } from "next/font/google";
export const metadata: Metadata = {
	title: "Interlinked - Home",
	description: "Interlinked - Home",
};

export const viewport: Viewport = {
	maximumScale: 1,
};

const manrope = Manrope({ subsets: ["latin"] });

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {

	return (
		<html lang="en" className={`bg-white dark:bg-gray-950 text-black dark:text-white ${manrope.className}`}>
			<body className="min-h-[100dvh] bg-gray-50">
				<SessionProvider>
					<section className="flex flex-col min-h-screen">
						<Header />
						{children}
					</section>
				</SessionProvider>
			</body>
		</html>
	);
}
