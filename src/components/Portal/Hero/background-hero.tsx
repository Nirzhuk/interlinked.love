import { Noise } from "@/components/ui/noise";

import React from "react";

//
const BackgroundHero = () => {
	return (
		<div className="absolute right-0 left-0 top-0 bottom-0 w-full h-full">
			{/* Video from spline */}
			<video className="w-full h-full object-contain blur-[6px]" autoPlay playsInline muted loop src="/luv.webm" />
			<Noise blendMode="overlay" grainSize={2.5} opacity={0.66} animate invert />
		</div>
	);
};

export default BackgroundHero;
