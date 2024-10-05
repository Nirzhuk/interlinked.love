import "../globals.css";
import Header from "@/src/components/Portal/Header";
import { UserProvider } from "@/src/lib/auth";
import { getUser } from "@/src/lib/db/queries";
import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";

export const metadata: Metadata = {
	title: "Interlinked - Login",
	description: "Interlinked - Login",
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

	const userPromise = getUser();

	return (
		<html
			lang="en"
			className={`bg-white dark:bg-gray-950 text-black dark:text-white ${manrope.className}`}
		>
			<body className="min-h-[100dvh] bg-gray-50">
				<UserProvider userPromise={userPromise}>
					<section className="flex flex-col min-h-screen">
						<Header />
						{children}
					</section>
				</UserProvider>
			</body>
		</html>
	);
}

