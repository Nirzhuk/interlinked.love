export interface RouteConfig {
	label: string;
	children?: Record<string, RouteConfig>;
}

export const routes: Record<string, RouteConfig> = {
	app: {
		label: "App",
		children: {
			calendar: {
				label: "Calendar",
			},
			events: {
				label: "Events List",
			},
			"invite-couple": {
				label: "Invite Couple",
			},
			settings: {
				label: "Settings",
				children: {
					general: {
						label: "Profile Settings",
					},
					activity: {
						label: "Activity Log",
					},
					billing: {
						label: "Billing",
					},
				},
			},
		},
	},
};

export const getRouteLabel = (segment: string): string => {
	const findLabel = (obj: Record<string, RouteConfig>, path: string): string => {
		const parts = path.split("/").filter(Boolean);
		let current = obj;
		let label = "";

		for (const part of parts) {
			if (current[part]) {
				label = current[part].label;
				current = current[part].children || {};
			}
		}

		return label || formatSegmentLabel(path);
	};

	return findLabel(routes, segment);
};

const formatSegmentLabel = (segment: string): string => {
	return segment
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
};
