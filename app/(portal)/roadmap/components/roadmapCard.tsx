"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type React from "react";
import { useState } from "react";
import type { RoadmapItem } from "../types";

interface RoadmapCardProps {
	item: RoadmapItem;
}

const backgroundColors = {
	TODO: "bg-gray-50",
	WORKING: "bg-green-50",
	DONE: "bg-gray-200",
};

const RoadmapCard: React.FC<RoadmapCardProps> = ({ item }) => {
	const [isExpanded, setIsExpanded] = useState(false);

	return (
		<motion.div
			layout
			// @ts-expect-error onClick is valid
			onClick={() => setIsExpanded(!isExpanded)}
			className={cn(" p-4 rounded-lg shadow-md cursor-pointer", backgroundColors[item.status])}
		>
			<motion.div layout="position">
				<h3 className="text-base font-semibold">{item.title}</h3>
				<Badge className="mt-2">{item.type}</Badge>
			</motion.div>
			<motion.div
				initial={{ opacity: 0, height: 0 }}
				animate={{ opacity: isExpanded ? 1 : 0, height: isExpanded ? "auto" : 0 }}
				transition={{ duration: 0.2 }}
			>
				<p className="mt-2 text-gray-600">{item.description}</p>
			</motion.div>
		</motion.div>
	);
};

export default RoadmapCard;
