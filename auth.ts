import { db } from "@/lib/db/drizzle";
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";

import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";

export const { handlers, auth, signIn, signOut } = NextAuth({
	adapter: DrizzleAdapter(db),
  pages: {
		signIn: "/auth/sign-in",
	},
	secret: process.env.AUTH_SECRET,
	session: { strategy: "jwt" },
	  debug: process.env.NODE_ENV !== "production" ? true : false,
	
	providers: [
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
					return null;
				}

				const user = await db.query.users.findFirst({
					where: (users, { eq }) => eq(users.email, String(credentials.email)),
				});
				
				if (!user || !(await bcrypt.compare(String(credentials.password), user.password || ""))) {
					return null;
				}
				
				return user
				
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
          id: params.token.id as string,
          randomKey: params.token.randomKey,
        },
      };
    },
	},
});

declare module "next-auth" {
	interface Session {
		accessToken?: string;
		role?: string;
	}
}
