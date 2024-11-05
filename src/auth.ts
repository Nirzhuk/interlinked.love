import { db } from "@/lib/db/drizzle";
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";

import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth, { AuthError, CredentialsSignin, type DefaultSession } from "next-auth";
import Discord from "next-auth/providers/discord";
import Google from "next-auth/providers/google";

export class CustomAuthError extends AuthError {
	constructor(msg: string) {
		super();
		this.message = msg;
		this.stack = undefined;
	}
}
class InvalidLoginError extends CredentialsSignin {
	code = "User not found or password incorrect";
}

export const { handlers, auth, signIn, signOut } = NextAuth({
	// @ts-expect-error Some random error due using rcs, we will fix it later
	adapter: DrizzleAdapter(db),
	session: { strategy: "jwt" },
	pages: {
		signIn: "/auth/sign-in",
	},
	secret: process.env.AUTH_SECRET,
	debug: process.env.NODE_ENV !== "production",
	providers: [
		Discord,
		Google,
		CredentialsProvider({
			name: "Sign in",
			id: "credentials",
			credentials: {
				email: {
					label: "Email",
					type: "email",
					placeholder: "example@example.com",
				},
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials.password) {
					throw new CustomAuthError("Email or password not found");
				}

				const user = await db.query.users.findFirst({
					where: (users, { eq }) => eq(users.email, String(credentials.email)),
				});
				if (!user || !(await bcrypt.compare(String(credentials.password), user.password || ""))) {
					throw new InvalidLoginError();
				}

				return user;
			},
		}),
	],
	callbacks: {
		authorized({ request, auth }) {
			const { pathname } = request.nextUrl;
			if (pathname === "/middleware-example") return !!auth;
			return true;
		},
		jwt: ({ token, user }) => {
			if (user) {
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				const u = user as unknown as any;
				return {
					...token,
					id: u.id,
					role: u.role,
					randomKey: u.randomKey,
				};
			}
			return token;
		},
		session(params) {
			return {
				...params.session,
				user: {
					...params.session.user,
					role: params.token.role as string,
					id: params.token.id as string,
					randomKey: params.token.randomKey,
				},
			};
		},
	},
});
declare module "next-auth" {
	// eslint-disable-next-line no-unused-vars
	interface Session extends DefaultSession {
		user: {
			id: string;
			role: string;
			// ...other properties
			// role: UserRole;
		} & DefaultSession["user"];
	}

	// eslint-disable-next-line no-unused-vars
	interface User {
		role: string;
	}
}
