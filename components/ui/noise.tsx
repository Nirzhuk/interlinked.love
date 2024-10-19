import { cn } from "@/lib/utils";
import type { HTMLProps } from "react";

interface NoiseProps extends HTMLProps<SVGSVGElement> {
	invert?: boolean;
	blendMode?: "soft-light" | "overlay";
	opacity?: number;
	grainSize?: number;
	animate?: boolean;
}

export const Noise = ({
	invert = false,
	blendMode = "soft-light",
	opacity = 1,
	grainSize = 2.5,
	animate = false,
	className,
	style,
	...props
}: NoiseProps) => {
	const baseFrequency = 1 / grainSize;

	return (
		<svg
			width="100%"
			height="100%"
			xmlns="http://www.w3.org/2000/svg"
			className={cn("absolute inset-0 rounded-[inherit] pointer-events-none", className)}
			style={{
				...style,
				mixBlendMode: blendMode,
				opacity,
				filter: invert ? "invert(1)" : "none",
			}}
			{...props}
		>
			<title>Noise effect</title>
			<filter id="noise">
				<feTurbulence type="fractalNoise" baseFrequency={baseFrequency} numOctaves={3} stitchTiles="stitch" seed={0}>
					{animate && <animate attributeName="seed" from="0" to="100" dur="1.5s" repeatCount="indefinite" />}
				</feTurbulence>
				<feColorMatrix
					type="matrix"
					values="1 0 0 0 0
                    1 0 0 0 0
                    1 0 0 0 0
                    0 0 0 1 0"
				/>
				<feComponentTransfer>
					<feFuncR type="table" tableValues="0 1" />
					<feFuncG type="table" tableValues="0 1" />
					<feFuncB type="table" tableValues="0 1" />
				</feComponentTransfer>
			</filter>
			<rect width="100%" height="100%" filter="url(#noise)" />
		</svg>
	);
};
