import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { customerPortalAction } from "@/lib/payments/actions";

import { auth } from "@/auth";
import { getCoupleForUser } from "@/lib/db/queries";
import { redirect } from "next/navigation";

const BillingSettings = async () => {
	const session = await auth();

	const user = session?.user;
	const coupleData = await getCoupleForUser(user?.id as string);

	if (!coupleData) {
		console.info("Couple not found in billing page");
		redirect("/");
	}

	return (
		<section className="flex-1 p-4 lg:p-8">
			<h1 className="text-lg lg:text-2xl font-medium dark:text-white text-gray-900 mb-6">Billing Settings</h1>

			<Card className="mb-8 dark:bg-zinc-900">
				<CardHeader>
					<CardTitle>Couple Subscription</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
							<div className="mb-4 sm:mb-0">
								<p className="font-medium">Current Plan: {coupleData.planName || "Free"}</p>
								<p className="text-sm text-muted-foreground">
									{coupleData.subscriptionStatus === "active"
										? "Billed monthly"
										: coupleData.subscriptionStatus === "trialing"
											? "Trial period"
											: "No active subscription"}
								</p>
							</div>
							<form action={customerPortalAction}>
								<Button type="submit" variant="outline">
									Manage Subscription
								</Button>
							</form>
						</div>
					</div>
				</CardContent>
			</Card>
		</section>
	);
};

export default BillingSettings;
