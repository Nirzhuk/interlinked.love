import { getCoupleForUser, getUpcomingEvents } from "@/lib/db/queries";
import { redirect } from "next/navigation";
import { Settings } from "./settings";

import { auth } from "@/auth";
import { getInvitations } from "./actions";

export default async function SettingsPage() {
	const session = await auth();

	const user = session?.user;

	if (!user) {
		redirect("/auth/login");
	}

	const coupleData = await getCoupleForUser(user.id as string);

	const upcomingEvents = await getUpcomingEvents();

	const invitations = await getInvitations(coupleData?.id);

	if (!coupleData) {
		console.info("Couple not found in app page");
		redirect("/");
	}

	return <Settings coupleData={coupleData} upcomingEvents={upcomingEvents} invitations={invitations} />;
}
