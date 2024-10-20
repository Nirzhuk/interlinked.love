"use server";

import { withCouple } from "@/lib/auth/middleware";
import { redirect } from "next/navigation";
import { createCheckoutSession, createCustomerPortalSession } from "./stripe";

export const checkoutAction = withCouple(async (formData, couple) => {
	const priceId = formData.get("priceId") as string;
	await createCheckoutSession({ couple: couple, priceId });
});

export const customerPortalAction = withCouple(async (_, couple) => {
	const portalSession = await createCustomerPortalSession(couple);

	redirect(portalSession.url);
});
