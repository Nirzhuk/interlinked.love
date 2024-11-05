import { handleSubscriptionChange, stripe } from "@/lib/payments/stripe";
import { type NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
	const payload = await request.text();
	const signature = request.headers.get("stripe-signature") as string;

	let event: Stripe.Event;

	if (!webhookSecret) {
		console.error("STRIPE_WEBHOOK_SECRET is not set.");
		return NextResponse.json({ error: "STRIPE_WEBHOOK_SECRET is not set." }, { status: 500 });
	}

	try {
		event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
	} catch (err) {
		console.error("Webhook signature verification failed.", err);
		return NextResponse.json({ error: "Webhook signature verification failed." }, { status: 400 });
	}

	switch (event.type) {
		case "customer.subscription.updated":
		case "customer.subscription.deleted":
			// biome-ignore lint/correctness/noSwitchDeclarations: <explanation>
			const subscription = event.data.object as Stripe.Subscription;
			await handleSubscriptionChange(subscription);
			break;
		default:
			console.warn(`Unhandled event type ${event.type}`);
	}

	return NextResponse.json({ received: true });
}
