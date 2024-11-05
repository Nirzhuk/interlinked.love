import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Self Hosted Pricing",
};

export default function Page() {
	return <div className="text-center text-2xl w-full h-full">No Pricing in Self Hosted Mode</div>;
}
