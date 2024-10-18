import { getCoupleForUser, getUpcomingEvents } from "@/lib/db/queries";
import { redirect } from "next/navigation";
import { Settings } from "./settings";

import { auth } from "@/auth";

export default async function SettingsPage() {
	const session = await auth()

	const user = session?.user;


	if (!user) {
		redirect("/auth/login");
	}

	
	const coupleData = await getCoupleForUser(user.id as string);
	
	const upcomingEvents = await getUpcomingEvents();

	if (!coupleData) {
		throw new Error("Couple not found");
	}

	return <Settings coupleData={coupleData} upcomingEvents={upcomingEvents} />;
}
