import "./globals.css";
import PlausibleProvider from "next-plausible";
import { Manrope, Pacifico } from "next/font/google";

const manrope = Manrope({ subsets: ["latin"] });

const pacifico = Pacifico({
	subsets: ["latin"],
	variable: "--font-pacifico",
	weight: ["400"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html
			lang="en"
			className={`bg-white dark:bg-gray-950 text-black dark:text-white ${pacifico.variable} ${manrope.className} `}
		>
			<head>
				<PlausibleProvider domain="interlinked.love" customDomain="https://plausible.nirzhuk.dev" />
				<meta name="application-name" content="Interlinked" />
				<meta name="apple-mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-status-bar-style" content="default" />
				<meta name="apple-mobile-web-app-title" content="Interlinked" />
				<meta name="description" content="Organize with your people" />
				<meta name="format-detection" content="telephone=no" />
				<meta name="mobile-web-app-capable" content="yes" />
				<meta name="msapplication-config" content="/icons/browserconfig.xml" />
				<meta name="msapplication-TileColor" content="#2B5797" />
				<meta name="msapplication-tap-highlight" content="no" />
				<meta name="theme-color" content="#ffffff" />

				<link rel="apple-touch-icon" href="/images/icon-512x512.png" />

				<link rel="icon" type="image/png" sizes="32x32" href="/images/favicon.png" />
				<link rel="icon" type="image/png" sizes="16x16" href="/images/favicon.png" />
				<link rel="manifest" href="/manifest.json" />

				<link rel="shortcut icon" href="/favicon.ico" />

				<meta name="twitter:card" content="summary" />
				<meta name="twitter:url" content="https://interlinked.love" />
				<meta name="twitter:title" content="Interlinked" />
				<meta name="twitter:description" content="Organize with your people" />
				<meta name="twitter:image" content="https://interlinked.love/icons/android-chrome-192x192.png" />
				<meta name="twitter:creator" content="@nirzhuk" />
				<meta property="og:type" content="website" />
				<meta property="og:title" content="Interlinked" />
				<meta property="og:description" content="Organize with your people" />
				<meta property="og:site_name" content="Interlinked" />
				<meta property="og:url" content="https://interlinked.love" />
				<meta property="og:image" content="https://interlinked.love/icons/apple-touch-icon.png" />
				<meta
					name="viewport"
					content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
				/>
				<script
					// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
					dangerouslySetInnerHTML={{
						__html: `{
						'@context': 'https://schema.org',
						'@type': 'WebSite',
						name: 'Interlinked',
						alternateName: ['Interlinked'],
						url: 'https://interlinked.love/',
						}`,
					}}
					type="application/ld+json"
				/>
			</head>
			{children}
		</html>
	);
}
