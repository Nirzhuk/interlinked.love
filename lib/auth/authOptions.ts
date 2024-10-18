import { db } from "@/lib/db/drizzle";
import { users } from "@/lib/db/schema";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import type { NextAuthConfig } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthConfig = {
	adapter: DrizzleAdapter(db),
	session: {
		strategy: "jwt",
	},
	secret: process.env.NEXTAUTH_SECRET,
	pages: {
		signIn: "/",
	},
	providers: [
		GithubProvider({
			clientId: process.env.GITHUB_ID as string,
			clientSecret: process.env.GITHUB_SECRET as string,
		}),
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		}),
	],
	callbacks: {
		async session({ token, session }) {
			if (token && session.user) {
				session.user.id = token.id as string;
				session.user.name = token.name as string;
				session.user.email = token.email as string;
			}

			return session;
		},
		async jwt({ token, user }) {
			const [dbUser] = await db
				.select()
				.from(users)
				.where(eq(users.email, token.email || ""))
				.limit(1);

			if (!dbUser) {
				if (user) {
					token.id = user?.id;
				}
				return token;
			}

			return {
				id: dbUser.id,
				name: dbUser.name,
				email: dbUser.email,
			};
		},
	},
};
