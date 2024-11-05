export default function Layout({
	pricing,
	selfHosted,
}: {
	pricing: React.ReactNode;

	selfHosted: React.ReactNode;
}) {
	const isSelfHosted = process.env.NEXT_PUBLIC_SELF_HOSTED === "true";
	return <>{isSelfHosted ? selfHosted : pricing}</>;
}
