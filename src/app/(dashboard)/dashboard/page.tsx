import { getCoupleForUser, getUpcomingEvents, getUser } from "@/src/lib/db/queries";
import { redirect } from "next/navigation";
import { Settings } from "./settings";

export default async function SettingsPage() {
	const user = await getUser();

	if (!user) {
		redirect("/login");
	}

	const coupleData = await getCoupleForUser(user.id);
	const upcomingEvents = await getUpcomingEvents();

	if (!coupleData) {
		throw new Error("Couple not found");
	}
	
	return <Settings coupleData={coupleData} upcomingEvents={upcomingEvents} />;
}
