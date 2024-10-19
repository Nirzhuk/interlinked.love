import { LoginForm } from "@/components/Auth/LoginForm";
import { Suspense } from "react";

export default function SignInPage() {
	return (
		<Suspense>
			<LoginForm />
		</Suspense>
	);
}
