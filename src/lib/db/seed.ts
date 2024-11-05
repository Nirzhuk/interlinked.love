import { hashPassword } from "@/lib/auth/session";
import { stripe } from "../payments/stripe";
import { db } from "./drizzle";
import { events, coupleMembers, couples, eventsComments, users } from "./schema";

async function createStripeProducts() {
	console.info("Creating Stripe products and prices...");

	if (process.env.SELF_HOSTED === "true") {
		console.info("Self-hosted mode, skipping Stripe products and prices creation.");
		return;
	}

	const baseProduct = await stripe.products.create({
		name: "Couple",
		description: "Couple subscription plan",
	});

	await stripe.prices.create({
		product: baseProduct.id,
		unit_amount: 499, // $4.99 in cents
		currency: "usd",
		recurring: {
			interval: "month",
			trial_period_days: 7,
		},
	});

	console.info("Stripe products and prices created successfully.");
}

async function seed() {
	const email = "test@test.com";
	const password = "admin123";
	const passwordHash = await hashPassword(password);

	const [user] = await db
		.insert(users)
		.values([
			{
				email: email,
				password: passwordHash,
				role: "owner",
				name: "Test User",
			},
		])
		.returning();
	console.info("Initial user created.");
	const [user2] = await db
		.insert(users)
		.values([
			{
				email: "test2@test.com",
				password: passwordHash,
				role: "owner",
				name: "Test User 2",
			},
		])
		.returning();

	console.info("Second user created.");

	const [couple] = await db
		.insert(couples)
		.values({
			name: "Test Couple",
		})
		.returning();

	console.info("Couple created.");

	await db.insert(coupleMembers).values({
		coupleId: couple.id,
		userId: user.id,
		role: "owner",
	});
	await db.insert(coupleMembers).values({
		coupleId: couple.id,
		userId: user2.id,
		role: "owner",
	});
	console.info("Couple members created.");

	const eventData = [
		{
			initialDate: new Date(),
			daysOffset: 5,
			location: "Test Location 1",
			description: "Test Description 1",
		},
		{
			initialDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
			daysOffset: 3,
			location: "Test Location 2",
			description: "Test Description 2",
		},
		{
			initialDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
			daysOffset: 7,
			location: "Test Location 3",
			description: "Test Description 3",
		},
	];
	console.info("Event data created.");
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const eventIds: any[] = [];

	for (const event of eventData) {
		const finalDate = new Date(event.initialDate);
		finalDate.setDate(finalDate.getDate() + event.daysOffset);

		const [eventt] = await db
			.insert(events)
			.values({
				coupleId: couple.id,
				initialDate: event.initialDate,
				finalDate: finalDate,
				location: event.location,
				description: event.description,
			})
			.returning();

		eventIds.push(eventt.id);
	}
	console.info("Event ids created.");

	await db.insert(eventsComments).values({
		content: "This is a test comment",
		eventId: eventIds[0],
		userId: user.id,
		coupleId: couple.id,
	});

	console.info("Multiple events created for the test couple.");

	await createStripeProducts();
}

seed()
	.catch((error) => {
		console.error("Seed process failed:", error);
		process.exit(1);
	})
	.finally(() => {
		console.info("Seed process finished. Exiting...");
		process.exit(0);
	});
