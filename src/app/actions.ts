"use server";
import { cookies } from "next/headers";
const PWA_PROMPT_COOKIE = "pwa-prompt-closed";
const COOKIE_EXPIRY_DAYS = 30;

export const dismissPwaPromptCookieAction = async () => {
	(await cookies()).set(PWA_PROMPT_COOKIE, "true", { expires: COOKIE_EXPIRY_DAYS });
};
