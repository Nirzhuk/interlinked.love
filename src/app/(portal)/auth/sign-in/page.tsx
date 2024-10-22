import { auth } from "@/auth";
import { LoginForm } from "@/components/Auth/LoginForm";

import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export default async function SignInPage() {
	const session = await auth();
	if (session) {
		return redirect("/app");
	}

	return <LoginForm />;
}
