import type React from "react";
import type { RoadmapItem } from "../types";
import RoadmapCard from "./roadmapCard";

interface RoadmapColumnProps {
	status: string;
	items: RoadmapItem[];
}

const RoadmapColumn = ({ status, items }: RoadmapColumnProps) => {
	return (
		<div className="bg-gray-100 p-4 rounded-lg">
			<h2 className="text-xl font-semibold mb-4">{status}</h2>
			<div className="space-y-4">
				{items.map((item) => (
					<RoadmapCard key={item.title} item={item} />
				))}
			</div>
		</div>
	);
};

export default RoadmapColumn;
