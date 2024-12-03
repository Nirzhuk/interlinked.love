import { type RoadmapItem, STATUSES } from "./types";

const TODO_ITEMS: RoadmapItem[] = [
	{
		title: "Try Zustand",
		description: "Try Zustand to see if it's better than React Context for this project",
		status: "TODO",
		type: "FEATURE",
		paidFeature: false,
	},
	{
		title: "Confirmation Emails in Register",
		description: "Use Resend to send confirmation emails in the register flow",
		status: "TODO",
		type: "FEATURE",
		paidFeature: false,
	},
	{
		title: "Add forgot password & reset password flow",
		description: "Add forgot password so users can reset their password.",
		status: "TODO",
		type: "FEATURE",
		paidFeature: false,
	},
	{
		title: "Reminder Emails & Notifications",
		description: "Send reminder emails and notifications to users when they have an event coming up.",
		status: "TODO",
		type: "FEATURE",
		paidFeature: true,
	},
	{
		title: "Add Property 'Project' to the Event",
		description:
			"Add Property 'Project' to the Events so we can filter them in the calendar and list by project (example: Japan Trip 2025).",
		status: "TODO",
		type: "FEATURE",
		paidFeature: false,
	},
	{
		title: "Redesign Detail Event Modal",
		description: "Redesign the Shwocase Modal to be more user friendly and intuitive.",
		status: "TODO",
		type: "DESIGN",
		paidFeature: false,
	},
	{
		title: "Redesign Form Event Modal",
		description: "Redesign the Form Event Modal to be more user friendly and intuitive.",
		status: "TODO",
		type: "DESIGN",
		paidFeature: false,
	},
	{
		title: "Redesign Main Dashboard",
		description: "Redesign the Main Dashboard to be more user friendly and intuitive.",
		status: "TODO",
		type: "DESIGN",
		paidFeature: false,
	},
	{
		title: "Redesign Settings Page",
		description: "Redesign the Main Dashboard to be more user friendly and intuitive.",
		status: "TODO",
		type: "DESIGN",
		paidFeature: false,
	},
	{
		title: "Voting/Karma System",
		description: "Add a voting system to the app so users can vote on the events and decide if they like it or not.",
		status: "TODO",
		type: "FEATURE",
		paidFeature: true,
	},
	{
		title: "Ping to the Event",
		description: "Ping system so other users can create a alert for an event to other users to check it out.",
		status: "TODO",
		type: "FEATURE",
		paidFeature: true,
	},
	{
		title: "Add image to the Event",
		description: "Add image to the Event so we can show it in the calendar and list them properly.",
		status: "TODO",
		type: "FEATURE",
		paidFeature: false,
	},
	{
		title: "3D Map of the location",
		description: "Add a 3D map of the location so we can show it in the calendar and list them properly.",
		status: "TODO",
		type: "FEATURE",
		paidFeature: true,
	},
];
const WORKING_ITEMS: RoadmapItem[] = [
	{
		title: "Clean code",
		description: "Clean code in the project",
		status: "WORKING",
		type: "FEATURE",
		paidFeature: false,
	},
	{
		title: "Open source",
		description: "Open source the project",
		status: "WORKING",
		type: "FEATURE",
		paidFeature: false,
	},
	{
		title: "Self Hosted Non Paid Features",
		description:
			"When you self host, you should be able to use all the features without paying for them & Stripe will be disabled.",
		status: "WORKING",
		type: "FEATURE",
		paidFeature: false,
	},
];
const DONE_ITEMS: RoadmapItem[] = [
	{
		title: "PWA",
		description: "Add PWA to the project",
		status: "DONE",
		type: "FEATURE",
		paidFeature: false,
	},
	{
		title: "Send email when invite user to group/couple",
		description: "Send email when invite user to group/couple",
		status: "DONE",
		type: "FEATURE",
		paidFeature: false,
	},
	{
		title: "Change to Auth.js",
		description: "Move from our own Auth to Auth.js to have a better user experience and 0Auth Integrations",
		status: "DONE",
		type: "FEATURE",
	},
];

export const ROADMAP_ITEMS = [...TODO_ITEMS, ...WORKING_ITEMS, ...DONE_ITEMS];
