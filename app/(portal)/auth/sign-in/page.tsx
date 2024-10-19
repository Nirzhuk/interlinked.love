import { auth } from "@/auth";
import { LoginForm } from "@/components/Auth/LoginForm";

import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function SignInPage() {
	const session = await auth();
	if (session) {
		return redirect("/app");
	}

	return (
		<Suspense>
			<LoginForm />
		</Suspense>
	);
}
