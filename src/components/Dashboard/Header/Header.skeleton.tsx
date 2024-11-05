import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export const HeaderSkeleton = () => {
	return (
		<header className="flex h-16 shrink-0 items-center gap-2">
			<div className="flex items-center gap-2 px-4">
				<Skeleton className="h-8 w-8 rounded-md" />
				<Separator orientation="vertical" className="mr-2 h-4" />
				<div className="flex items-center gap-2">
					<Skeleton className="hidden h-4 w-40 md:block" />
					<Skeleton className="h-4 w-24" />
				</div>
			</div>
		</header>
	);
};

export default HeaderSkeleton;
