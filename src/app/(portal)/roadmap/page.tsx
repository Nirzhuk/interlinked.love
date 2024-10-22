import React from "react";
import RoadmapBoard from "./components/roadmapBoard";

const RoadmapPage = () => {
	return (
		<div className="sm:w-10/12 sm:mx-auto w-full h-full px-4 pb-0 pt-8">
			<h1 className="text-3xl font-bold mb-1">Project Roadmap</h1>
			<p className="text-xs text-gray-500 mb-6">Click on the cards to check the details</p>
			<RoadmapBoard />
		</div>
	);
};

export default RoadmapPage;
