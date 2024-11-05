"use client";
import { dismissPwaPromptCookieAction } from "@/app/actions";

import { PlusIcon, X, XIcon } from "lucide-react";

import { useEffect, useState } from "react";

const PwaPrompt = ({ closed }: { closed: boolean }) => {
	const [isIOS, setIsIOS] = useState(false);
	const [isStandalone, setIsStandalone] = useState(false);
	const [isPromptDismissed, setIsPromptDismissed] = useState(closed);

	useEffect(() => {
		// Check if device is iOS mobile
		const isIOSMobile =
			/iPhone|iPod/.test(navigator.userAgent) &&
			// biome-ignore lint/suspicious/noExplicitAny: required for MSStream check
			!(window as any).MSStream;

		setIsIOS(isIOSMobile);
		setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);
	}, []);

	const handleDismiss = () => {
		setIsPromptDismissed(true);
		dismissPwaPromptCookieAction();
	};

	// Don't render if: not iOS mobile, already installed, or dismissed
	if (!isIOS || isStandalone || isPromptDismissed) {
		return null;
	}

	return (
		<div className="fixed bottom-4  z-50 w-full p-4 bg-card rounded-lg border shadow-lg">
			<div className="flex items-center justify-between">
				<p className="text-sm text-muted-foreground">To install this app on your device:</p>
				<XIcon className="w-4 h-4 inline" onClick={handleDismiss} />
			</div>
			<div className="mt-2 text-sm space-y-1 text-muted-foreground">
				<p className="flex items-center gap-1">
					1. Tap the share button
					<span role="img" aria-label="share icon" className="inline-block">
						⎋
					</span>
				</p>
				<p className="flex items-center gap-1">
					2. Select "Add to Home Screen"
					<PlusIcon className="w-4 h-4 inline" />
				</p>
			</div>
		</div>
	);
};

export default PwaPrompt;
