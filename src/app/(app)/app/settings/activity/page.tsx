import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getActivityLogs } from "@/lib/db/queries";
import { ActivityType } from "@/lib/db/schema";
import {
	AlertCircle,
	CalendarPlus,
	CheckCircle,
	Lock,
	LogOut,
	type LucideIcon,
	Mail,
	MessageSquarePlus,
	Settings,
	Trash,
	UserCog,
	UserMinus,
	UserPlus,
} from "lucide-react";

const iconMap: Record<ActivityType, LucideIcon> = {
	[ActivityType.SIGN_UP]: UserPlus,
	[ActivityType.SIGN_IN]: UserCog,
	[ActivityType.SIGN_OUT]: LogOut,
	[ActivityType.UPDATE_PASSWORD]: Lock,
	[ActivityType.DELETE_ACCOUNT]: UserMinus,
	[ActivityType.UPDATE_ACCOUNT]: Settings,
	[ActivityType.CREATE_COUPLE]: UserPlus,
	[ActivityType.REMOVE_COUPLE_MEMBER]: UserMinus,
	[ActivityType.INVITE_COUPLE_MEMBER]: Mail,
	[ActivityType.ACCEPT_INVITATION]: CheckCircle,
	[ActivityType.CREATE_COMMENT]: MessageSquarePlus,
	[ActivityType.DELETE_COMMENT]: Trash,
	[ActivityType.DELETE_EVENT]: Trash,
	[ActivityType.UPDATE_EVENT]: Settings,
	[ActivityType.CREATE_EVENT]: CalendarPlus,
};

function getRelativeTime(date: Date) {
	const now = new Date();
	const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

	if (diffInSeconds < 60) return "just now";
	if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
	if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
	if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
	return date.toLocaleDateString();
}

function formatAction(action: ActivityType): string {
	switch (action) {
		case ActivityType.SIGN_UP:
			return "You signed up";
		case ActivityType.SIGN_IN:
			return "You signed in";
		case ActivityType.SIGN_OUT:
			return "You signed out";
		case ActivityType.UPDATE_PASSWORD:
			return "You changed your password";
		case ActivityType.DELETE_ACCOUNT:
			return "You deleted your account";
		case ActivityType.UPDATE_ACCOUNT:
			return "You updated your account";
		case ActivityType.CREATE_COUPLE:
			return "You created a new couple";
		case ActivityType.REMOVE_COUPLE_MEMBER:
			return "You removed a couple member";
		case ActivityType.INVITE_COUPLE_MEMBER:
			return "You invited a couple member";
		case ActivityType.ACCEPT_INVITATION:
			return "You accepted an invitation";
		case ActivityType.CREATE_COMMENT:
			return "You created a comment";
		case ActivityType.DELETE_COMMENT:
			return "You deleted a comment";
		case ActivityType.CREATE_EVENT:
			return "You created an event";
		case ActivityType.DELETE_EVENT:
			return "You deleted an event";
		case ActivityType.UPDATE_EVENT:
			return "You updated an event";
		default:
			return "Unknown action occurred";
	}
}

export const metadata = {
	title: "Activity Log - Interlinked",
};

export default async function ActivityPage() {
	const logs = await getActivityLogs();

	return (
		<section className="flex-1 p-4 lg:p-8">
			<h1 className="text-lg lg:text-2xl font-medium dark:text-white text-gray-900 mb-6">Activity Log</h1>
			<Card className="dark:bg-zinc-900">
				<CardHeader>
					<CardTitle>Recent Activity</CardTitle>
				</CardHeader>
				<CardContent>
					{logs.length > 0 ? (
						<ul className="space-y-4">
							{logs.map((log) => {
								const Icon = iconMap[log.action as ActivityType] || Settings;
								const formattedAction = formatAction(log.action as ActivityType);

								return (
									<li key={log.id} className="flex items-center space-x-4">
										<div className="bg-violet-100 rounded-full p-2">
											<Icon className="w-5 h-5 text-violet-600" />
										</div>
										<div className="flex-1">
											<p className="text-sm font-medium dark:text-white text-gray-900">
												{formattedAction}
												{log.ipAddress && ` from IP ${log.ipAddress}`}
											</p>
											<p className="text-xs text-gray-500">{getRelativeTime(new Date(log.timestamp))}</p>
										</div>
									</li>
								);
							})}
						</ul>
					) : (
						<div className="flex flex-col items-center justify-center text-center py-12">
							<AlertCircle className="h-12 w-12 text-violet-500 mb-4" />
							<h3 className="text-lg font-semibold text-gray-900 mb-2">No activity yet</h3>
							<p className="text-sm text-gray-500 max-w-sm">
								When you perform actions like signing in or updating your account, they'll appear here.
							</p>
						</div>
					)}
				</CardContent>
			</Card>
		</section>
	);
}
