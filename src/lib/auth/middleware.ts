import { auth } from "@/auth";
import { getCoupleForUser } from "@/lib/db/queries";
import type { CoupleDataWithMembers } from "@/lib/db/schema";
import type { User } from "next-auth";
import { redirect } from "next/navigation";
import type { z } from "zod";

//TODO Remove any types for Generics

export type ActionState = {
	error?: string;
	success?: string;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	[key: string]: any; // This allows for additional properties
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type ValidatedActionFunction<S extends z.ZodType<any, any>, T> = (data: z.infer<S>, formData: FormData) => Promise<T>;

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function validatedAction<S extends z.ZodType<any, any>, T>(schema: S, action: ValidatedActionFunction<S, T>) {
	return async (prevState: ActionState, formData: FormData): Promise<T> => {
		const result = schema.safeParse(Object.fromEntries(formData));

		if (!result.success) {
			console.error(result.error.errors[0].message);
			return { error: result.error.errors[0].message } as T;
		}

		return action(result.data, formData);
	};
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type ValidatedActionWithUserFunction<S extends z.ZodType<any, any>, T> = (
	data: z.infer<S>,
	formData: FormData,
	user: User,
) => Promise<T>;

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function validatedActionWithUser<S extends z.ZodType<any, any>, T>(
	schema: S,
	action: ValidatedActionWithUserFunction<S, T>,
) {
	return async (prevState: ActionState, formData: FormData): Promise<T> => {
		const session = await auth();
		const user = session?.user;
		if (!user) {
			throw new Error("User is not authenticated");
		}

		const result = schema.safeParse(Object.fromEntries(formData));
		if (!result.success) {
			console.error(result.error);
			return { error: result.error.errors[0].message } as T;
		}

		return action(result.data, formData, user);
	};
}

type ActionWithCoupleFunction<T> = (formData: FormData, couple: CoupleDataWithMembers) => Promise<T>;

export function withCouple<T>(action: ActionWithCoupleFunction<T>) {
	return async (formData: FormData): Promise<T> => {
		const session = await auth();
		const user = session?.user;
		if (!user) {
			redirect("/auth/sign-in");
		}

		const couple = await getCoupleForUser(user.id as string);
		if (!couple) {
			throw new Error("Couple not found");
		}

		return action(formData, couple);
	};
}
