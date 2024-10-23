import { db } from "@/lib/db/drizzle";
import { users } from "@/lib/db/schema";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

import { ZodError } from "zod";
import { object, string } from "zod";

const createUserSchema = object({
	name: string({ required_error: "Name is required" }).min(1, "Name is required"),
	email: string({ required_error: "Email is required" }).min(1, "Email is required").email("Invalid email"),
	photo: string().optional(),
	password: string({ required_error: "Password is required" })
		.min(1, "Password is required")
		.min(8, "Password must be more than 8 characters")
		.max(32, "Password must be less than 32 characters"),
	passwordConfirm: string({
		required_error: "Please confirm your password",
	}).min(1, "Please confirm your password"),
}).refine((data) => data.password === data.passwordConfirm, {
	path: ["passwordConfirm"],
	message: "Passwords do not match",
});

type NewUser = typeof users.$inferInsert;

const insertUser = async (user: NewUser) => {
	const result = await db.insert(users).values(user).returning();
	return result[0];
};

interface AuthError extends Error {
	code: string;
}

export async function POST(req: Request) {
	try {
		const { name, email, password } = createUserSchema.parse(await req.json());

		const hashed_password = await hash(password, 12);

		const user = await insertUser({
			name,
			email: email.toLowerCase(),
			password: hashed_password,
		});

		return NextResponse.json({
			user: {
				name: user.name,
				email: user.email,
			},
		});
	} catch (error) {
		console.info(error);
		if (error instanceof ZodError) {
			return NextResponse.json(
				{
					status: "error",
					message: "Validation failed",
					errors: error.errors,
				},
				{ status: 400 },
			);
		}

		if ((error as AuthError).code === "23505") {
			return NextResponse.json(
				{
					status: "fail",
					message: "user with that email already exists",
				},
				{ status: 409 },
			);
		}

		return NextResponse.json(
			{
				status: "error",
				message: (error as AuthError).message || "Internal Server Error",
			},
			{ status: 500 },
		);
	}
}
