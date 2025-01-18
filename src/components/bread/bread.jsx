"use client";
import { usePathname } from "next/navigation"; // Import usePathname from next/navigation
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
	BreadcrumbPage,
} from "@/components/ui/breadcrumb";

export function BreadcrumbComponent() {
	const pathname = usePathname(); // Get the current pathname
	const pathSegments = pathname.split("/").filter(Boolean); // Split the path into segments
	const currentSegment = pathSegments[pathSegments.length - 1] || "Home"; // Get the last segment or default to "Home"

	return (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink href="/">Home</BreadcrumbLink>
				</BreadcrumbItem>
				{currentSegment !== "Home" && (
					<>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>{currentSegment}</BreadcrumbPage>
						</BreadcrumbItem>
					</>
				)}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
