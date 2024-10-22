"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";
import { ROADMAP_ITEMS } from "../roadmap";
import { STATUSES } from "../types";
import RoadmapColumn from "./roadmapColumn";
const RoadmapBoard = () => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
			{Object.values(STATUSES).map((status) => (
				<ScrollArea key={status} className="h-[calc(100vh-12rem)]">
					<RoadmapColumn key={status} status={status} items={ROADMAP_ITEMS.filter((item) => item.status === status)} />
				</ScrollArea>
			))}
		</div>
	);
};

export default RoadmapBoard;
