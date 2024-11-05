import Features from "@/components/Portal/Features";
import Hero from "@/components/Portal/Hero/Hero";

import { Button } from "@/components/ui/button";

import { ArrowRight, CreditCard, Database } from "lucide-react";

export default function HomePage() {
	return (
		<main>
			<Hero />

			<Features />

			{/* <section className="py-16 bg-gray-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
						<div>
							<h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Ready to launch your SaaS?</h2>
							<p className="mt-3 max-w-3xl text-lg text-gray-500">
								Our template provides everything you need to get your SaaS up and running quickly. Don't waste time on
								boilerplate - focus on what makes your product unique.
							</p>
						</div>
						<div className="mt-8 lg:mt-0 flex justify-center lg:justify-end">
							<a href="https://github.com/leerob/next-saas-starter" target="_blank" rel="noreferrer">
								<Button className="bg-white hover:bg-gray-100 text-black border border-gray-200 rounded-full text-xl px-12 py-6 inline-flex items-center justify-center">
									View the code
									<ArrowRight className="ml-3 h-6 w-6" />
								</Button>
							</a>
						</div>
					</div>
				</div>
			</section> */}
		</main>
	);
}
