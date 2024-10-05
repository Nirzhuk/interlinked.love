"use server";

import { redirect } from "next/navigation";
import { createCheckoutSession, createCustomerPortalSession } from "./stripe";
import { withCouple } from "@/src/lib/auth/middleware";

export const checkoutAction = withCouple(async (formData, couple) => {
	const priceId = formData.get("priceId") as string;
	await createCheckoutSession({ couple: couple, priceId });
});

export const customerPortalAction = withCouple(async (_, couple) => {
	const portalSession = await createCustomerPortalSession(couple);
	redirect(portalSession.url);
});
