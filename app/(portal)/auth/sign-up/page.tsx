import { SignupForm } from "@/components/Auth/SignupForm";
import { Suspense } from "react";

export default function SignUpPage() {
	return (
		<Suspense>
			<SignupForm />
		</Suspense>
	);
}
