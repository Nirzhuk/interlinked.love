import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "Interlinked.love - Organize with your people",
		short_name: "Interlinked",
		description: "Calendar app for your people",
		start_url: "/",
		display: "standalone",
		background_color: "#ffffff",
		theme_color: "#000000",
		orientation: "portrait",
		scope: "/",
		icons: [
			{
				src: "/icon-256x256.png",
				sizes: "256x256",
				type: "image/png",
			},
			{
				src: "/icon-512x512.png",
				sizes: "512x512",
				type: "image/png",
			},
		],
	};
}
