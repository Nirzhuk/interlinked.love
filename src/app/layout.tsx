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
			className={`bg-white dark:bg-gray-950 text-black dark:text-white ${manrope.className} ${pacifico.variable}`}
		>
			<body>{children}</body>
		</html>
	);
}
