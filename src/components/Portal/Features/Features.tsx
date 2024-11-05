import { BellIcon, CalendarIcon, FileTextIcon, GlobeIcon, InputIcon } from "@radix-ui/react-icons";

import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";

const features = [
	{
		Icon: FileTextIcon,
		name: "Save your files",
		description: "We automatically save your files as you type.",
		href: "/",
		cta: "Learn more",
		background: <img className="absolute -right-20 -top-20 opacity-60" alt="Save your files" />,
		className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
	},
	{
		Icon: InputIcon,
		name: "Full text search",
		description: "Search through all your files in one place.",
		href: "/",
		cta: "Learn more",
		background: <img className="absolute -right-20 -top-20 opacity-60" alt="Full text search" />,
		className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
	},
	{
		Icon: GlobeIcon,
		name: "Multilingual",
		description: "Supports 100+ languages and counting.",
		href: "/",
		cta: "Learn more",
		background: <img className="absolute -right-20 -top-20 opacity-60" alt="Multilingual" />,
		className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
	},
	{
		Icon: CalendarIcon,
		name: "Calendar",
		description: "Use the calendar to filter your files by date.",
		href: "/",
		cta: "Learn more",
		background: <img className="absolute -right-20 -top-20 opacity-60" alt="Calendar" />,
		className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
	},
	{
		Icon: BellIcon,
		name: "Notifications",
		description: "Get notified when someone shares a file or mentions you in a comment.",
		href: "/",
		cta: "Learn more",
		background: <img className="absolute -right-20 -top-20 opacity-60" alt="Notifications" />,
		className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
	},
];

function Features() {
	return (
		<section className="py-16 bg-white w-full">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10">
				<h2 className="text-3xl text-violet-500 sm:text-4xl font-pacifico font-thin">Organize your life with people you love</h2>
				<BentoGrid className="lg:grid-rows-3">
					{features.map((feature) => (
						<BentoCard key={feature.name} {...feature} />
					))}
				</BentoGrid>
			</div>
		</section>
	);
}
export default Features;
