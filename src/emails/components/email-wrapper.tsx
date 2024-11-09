import { Body, Font, Head, Html, Preview, Tailwind } from "@react-email/components";
import type React from "react";
const EmailWrapper = ({ children }: { children: React.ReactNode }) => {
	return (
		<Tailwind>
			<Html>
				<Head>
					<Font
						fontFamily="Roboto"
						fallbackFontFamily="Verdana"
						webFont={{
							url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
							format: "woff2",
						}}
						fontWeight={400}
						fontStyle="normal"
					/>
				</Head>
				<Preview>Log in with this magic link</Preview>
				<Body className="bg-white">{children}</Body>
			</Html>
		</Tailwind>
	);
};

export default EmailWrapper;
