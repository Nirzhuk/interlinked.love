import AvatarCircles from "@/components/ui/avatar-circles";
import React from "react";
import BGhero from "./BGhero";

import WordRotate from "@/components/ui/word-rotate";

const avatarUrls = [
	"https://avatars.githubusercontent.com/u/16860528",
	"https://avatars.githubusercontent.com/u/20110627",
	"https://avatars.githubusercontent.com/u/106103625",
	"https://avatars.githubusercontent.com/u/59228569",
];
const Hero = () => {
	return (
		<section className="py-20 relative">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 relative">
				<div className="flex">
					<div className="text-center md:max-w-2xl md:mx-auto flex flex-col justify-center items-center">
						<h1 className="text-3xl font-bold text-gray-900 tracking-tight sm:text-5xl md:text-6xl ">
							Organize your <WordRotate className="inline" words={["Trips", "Events", "Life"]} />
							<span className="block text-violet-500">with the people you love</span>
						</h1>
						<p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
							Interlinked is a platform that helps you organize your life with the people you love.
						</p>
					</div>
				</div>
			</div>
			<BGhero />
		</section>
	);
};

export default Hero;
