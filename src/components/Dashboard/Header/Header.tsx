"use client";

import { ModeToggle } from "@/components/mode-toggle";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { type RouteConfig, routes } from "@/config/routes";
import { usePathname } from "next/navigation";
import React, { Suspense } from "react";
import HeaderSkeleton from "./Header.skeleton";

interface BreadcrumbSegment {
	label: string;
	href: string;
	isLast: boolean;
}

const generateBreadcrumbs = (pathname: string): BreadcrumbSegment[] => {
	const segments = pathname.split("/").filter(Boolean);
	const breadcrumbs: BreadcrumbSegment[] = [];
	let currentPath = "";
	let currentConfig: Record<string, RouteConfig> = routes;

	for (let i = 0; i < segments.length; i++) {
		const segment = segments[i];
		if (segment === "app") {
			currentPath = "/app";
			breadcrumbs.push({
				label: routes.app.label,
				href: currentPath,
				isLast: segments.length === 1,
			});
			currentConfig = routes.app.children || {};
			continue;
		}

		currentPath = `${currentPath}/${segment}`;
		const isLast = i === segments.length - 1;

		if (currentConfig[segment]) {
			breadcrumbs.push({
				label: currentConfig[segment].label,
				href: currentPath,
				isLast,
			});
			currentConfig = currentConfig[segment].children || {};
		}
	}

	return breadcrumbs;
};

const Header = () => {
	const pathname = usePathname();
	const breadcrumbs = generateBreadcrumbs(pathname);

	return (
		<Suspense fallback={<HeaderSkeleton />}>
			<header className="flex h-16 shrink-0 items-center justify-between gap-2">
				<div className="flex items-center gap-2 px-4">
					<SidebarTrigger className="-ml-1" />
					<Separator orientation="vertical" className="mr-2 h-4" />
					<Breadcrumb>
						<BreadcrumbList>
							{breadcrumbs.map((breadcrumb) => (
								<React.Fragment key={breadcrumb.href}>
									<BreadcrumbItem>
										{breadcrumb.isLast ? (
											<BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
										) : (
											<BreadcrumbLink href={breadcrumb.href}>{breadcrumb.label}</BreadcrumbLink>
										)}
									</BreadcrumbItem>
									{!breadcrumb.isLast && <BreadcrumbSeparator className="hidden md:block" />}
								</React.Fragment>
							))}
						</BreadcrumbList>
					</Breadcrumb>
				</div>
				<ModeToggle />
			</header>
		</Suspense>
	);
};

export default Header;
