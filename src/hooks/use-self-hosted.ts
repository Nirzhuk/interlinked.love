export function useIsSelfHosted() {
	return process.env.NEXT_PUBLIC_SELF_HOSTED === "true";
}
