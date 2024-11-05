export interface RoadmapItem {
	title: string;
	description: string;
	status: "TODO" | "WORKING" | "DONE";
	type: "FEATURE" | "DESIGN" | "DOCUMENTATION";
	paidFeature?: boolean;
}

export const STATUSES = {
	TODO: "TODO",
	WORKING: "WORKING",
	DONE: "DONE",
} as const;
