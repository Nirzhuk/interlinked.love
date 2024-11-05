"use client";

import type { User } from "next-auth";
import { useSession } from "next-auth/react";
import { type ReactNode, createContext, useContext, useEffect, useState } from "react";
import { use } from "react";

type UserContextType = {
	user: User | undefined;
	setUser: (user: User | undefined) => void;
};

const UserContext = createContext<UserContextType | null>(null);

export function useUser(): UserContextType {
	const context = useContext(UserContext);
	if (context === null) {
		throw new Error("useUser must be used within a UserProvider");
	}
	return context;
}

export function UserProvider({
	children,
	userPromise,
}: {
	children: ReactNode;
	userPromise: Promise<User | undefined>;
}) {
	const { data } = useSession({
		required: true,
	});
	const [user, setUser] = useState<User | undefined>(data?.user);

	useEffect(() => {
		setUser(data?.user);
	}, [data]);

	return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
}
