interface ColorStyle {
	backgroundColor: string;
	borderColor: string;
	hoverBackgroundColor: string;
	darkBackgroundColor: string;
	darkBorderColor: string;
	darkHoverBackgroundColor: string;
}

export const eventColorStyle: Record<string, ColorStyle> = {
	pink: {
		backgroundColor: "#FBD5E0", // bg-pink-200
		borderColor: "#F687B2", // border-pink-400
		hoverBackgroundColor: "#F9A8D4", // bg-pink-300
		darkBackgroundColor: "#831843", // dark:bg-pink-900
		darkBorderColor: "#BE185D", // dark:border-pink-700
		darkHoverBackgroundColor: "#9D174D", // dark:bg-pink-800
	},
	rose: {
		backgroundColor: "#FCE7F3", // bg-rose-200
		borderColor: "#FB7185", // border-rose-400
		hoverBackgroundColor: "#FDA4AF", // bg-rose-300
		darkBackgroundColor: "#881337",
		darkBorderColor: "#BE123C",
		darkHoverBackgroundColor: "#9F1239",
	},
	fuchsia: {
		backgroundColor: "#FAE8FF", // bg-fuchsia-200
		borderColor: "#E879F9", // border-fuchsia-400
		hoverBackgroundColor: "#F5D0FE", // bg-fuchsia-300
		darkBackgroundColor: "#701A75",
		darkBorderColor: "#A21CAF",
		darkHoverBackgroundColor: "#86198F",
	},
	violet: {
		backgroundColor: "#EDE9FE", // bg-violet-200
		borderColor: "#A78BFA", // border-violet-400
		hoverBackgroundColor: "#DDD6FE", // bg-violet-300
		darkBackgroundColor: "#4C1D95",
		darkBorderColor: "#6D28D9",
		darkHoverBackgroundColor: "#5B21B6",
	},
	purple: {
		backgroundColor: "#F3E8FF", // bg-purple-200
		borderColor: "#C084FC", // border-purple-400
		hoverBackgroundColor: "#E9D5FF", // bg-purple-300
		darkBackgroundColor: "#581C87",
		darkBorderColor: "#7E22CE",
		darkHoverBackgroundColor: "#6B21A8",
	},
	indigo: {
		backgroundColor: "#E0E7FF", // bg-indigo-200
		borderColor: "#818CF8", // border-indigo-400
		hoverBackgroundColor: "#C7D2FE", // bg-indigo-300
		darkBackgroundColor: "#312E81",
		darkBorderColor: "#4338CA",
		darkHoverBackgroundColor: "#3730A3",
	},
	blue: {
		backgroundColor: "#BFDBFE", // bg-blue-200
		borderColor: "#60A5FA", // border-blue-400
		hoverBackgroundColor: "#93C5FD", // bg-blue-300
		darkBackgroundColor: "#1E3A8A",
		darkBorderColor: "#1D4ED8",
		darkHoverBackgroundColor: "#1E40AF",
	},
	sky: {
		backgroundColor: "#BAE6FD", // bg-sky-200
		borderColor: "#38BDF8", // border-sky-400
		hoverBackgroundColor: "#7DD3FC", // bg-sky-300
		darkBackgroundColor: "#0C4A6E",
		darkBorderColor: "#0369A1",
		darkHoverBackgroundColor: "#075985",
	},
	cyan: {
		backgroundColor: "#A5F3FC", // bg-cyan-200
		borderColor: "#22D3EE", // border-cyan-400
		hoverBackgroundColor: "#67E8F9", // bg-cyan-300
		darkBackgroundColor: "#164E63",
		darkBorderColor: "#0E7490",
		darkHoverBackgroundColor: "#155E75",
	},
	teal: {
		backgroundColor: "#99F6E4", // bg-teal-200
		borderColor: "#2DD4BF", // border-teal-400
		hoverBackgroundColor: "#5EEAD4", // bg-teal-300
		darkBackgroundColor: "#134E4A",
		darkBorderColor: "#0F766E",
		darkHoverBackgroundColor: "#115E59",
	},
	emerald: {
		backgroundColor: "#A7F3D0", // bg-emerald-200
		borderColor: "#34D399", // border-emerald-400
		hoverBackgroundColor: "#6EE7B7", // bg-emerald-300
		darkBackgroundColor: "#064E3B",
		darkBorderColor: "#047857",
		darkHoverBackgroundColor: "#065F46",
	},
	green: {
		backgroundColor: "#BBF7D0", // bg-green-200
		borderColor: "#4ADE80", // border-green-400
		hoverBackgroundColor: "#86EFAC", // bg-green-300
		darkBackgroundColor: "#14532D",
		darkBorderColor: "#15803D",
		darkHoverBackgroundColor: "#166534",
	},
	lime: {
		backgroundColor: "#D9F99D", // bg-lime-200
		borderColor: "#A3E635", // border-lime-400
		hoverBackgroundColor: "#BEF264", // bg-lime-300
		darkBackgroundColor: "#365314",
		darkBorderColor: "#4D7C0F",
		darkHoverBackgroundColor: "#3F6212",
	},
	yellow: {
		backgroundColor: "#FEF08A", // bg-yellow-200
		borderColor: "#FACC15", // border-yellow-400
		hoverBackgroundColor: "#FDE047", // bg-yellow-300
		darkBackgroundColor: "#713F12",
		darkBorderColor: "#A16207",
		darkHoverBackgroundColor: "#854D0E",
	},
	amber: {
		backgroundColor: "#FDE68A", // bg-amber-200
		borderColor: "#FBBF24", // border-amber-400
		hoverBackgroundColor: "#FCD34D", // bg-amber-300
		darkBackgroundColor: "#78350F",
		darkBorderColor: "#B45309",
		darkHoverBackgroundColor: "#92400E",
	},
	orange: {
		backgroundColor: "#FED7AA", // bg-orange-200
		borderColor: "#FB923C", // border-orange-400
		hoverBackgroundColor: "#FDBA74", // bg-orange-300
		darkBackgroundColor: "#7C2D12",
		darkBorderColor: "#C2410C",
		darkHoverBackgroundColor: "#9A3412",
	},
	red: {
		backgroundColor: "#FECACA", // bg-red-200
		borderColor: "#F87171", // border-red-400
		hoverBackgroundColor: "#FCA5A5", // bg-red-300
		darkBackgroundColor: "#7F1D1D",
		darkBorderColor: "#B91C1C",
		darkHoverBackgroundColor: "#991B1B",
	},
	stone: {
		backgroundColor: "#E7E5E4", // bg-stone-200
		borderColor: "#A8A29E", // border-stone-400
		hoverBackgroundColor: "#D6D3D1", // bg-stone-300
		darkBackgroundColor: "#292524",
		darkBorderColor: "#57534E",
		darkHoverBackgroundColor: "#44403C",
	},
};
