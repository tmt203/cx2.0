"use client";

import { Breadcrumb } from "@components/shared/atoms";
import type { BreadcrumbItem } from "@components/shared/atoms";
import { ChevronRight, Slash } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

/**
 * Breadcrumb Component Showcase
 *
 * This page demonstrates all the features and use cases of the Breadcrumb component
 */
export default function BreadcrumbShowcase() {
	const router = useRouter();
	const pathname = usePathname();

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-12 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-5xl">
				{/* Header */}
				<div className="mb-12">
					<h1 className="mb-2 text-4xl font-bold text-slate-900">Breadcrumb Component</h1>
					<p className="text-lg text-slate-600">
						Flexible navigation component to help users understand their location within your app
					</p>
				</div>

				{/* Example 1: Basic Usage */}
				<Section title="Example 1: Basic Usage" description="Simple breadcrumb with links">
					<Breadcrumb
						items={[
							{ label: "Home", href: "/" },
							{ label: "Products", href: "/products" },
							{ label: "Electronics", href: "/products/electronics" },
							{ label: "Laptop" },
						]}
					/>
				</Section>

				{/* Example 2: With Home Item */}
				<Section
					title="Example 2: With Home Icon"
					description="Explicit home item at the beginning"
				>
					<Breadcrumb
						items={[
							{ label: "Dashboard", href: "/dashboard" },
							{ label: "Settings", href: "/dashboard/settings" },
							{ label: "Account" },
						]}
						homeItem={{ label: "Home", href: "/" }}
						showHome={true}
					/>
				</Section>

				{/* Example 3: Custom Separator */}
				<Section
					title="Example 3: Custom Separator"
					description="Using different separator icon (Slash instead of ChevronRight)"
				>
					<Breadcrumb
						items={[
							{ label: "Blog", href: "/blog" },
							{ label: "Technology", href: "/blog/technology" },
							{ label: "React", href: "/blog/technology/react" },
							{ label: "Hooks" },
						]}
						separator={<Slash className="h-3 w-3" />}
					/>
				</Section>

				{/* Example 4: Click Handlers */}
				<Section
					title="Example 4: With Click Handlers"
					description="Navigation using click handlers instead of href"
				>
					<BreadcrumbWithHandlers router={router} />
				</Section>

				{/* Example 5: Long Breadcrumbs with Collapse */}
				<Section
					title="Example 5: Auto-Collapse Long Breadcrumbs"
					description="Automatically collapse breadcrumbs when exceeding maxVisibleItems"
				>
					<Breadcrumb
						items={[
							{ label: "Level 1", href: "/" },
							{ label: "Level 2", href: "/level2" },
							{ label: "Level 3", href: "/level3" },
							{ label: "Level 4", href: "/level4" },
							{ label: "Level 5", href: "/level5" },
							{ label: "Level 6", href: "/level6" },
							{ label: "Current Page" },
						]}
						maxVisibleItems={4}
						homeItem={{ label: "Home", href: "/" }}
						showHome={true}
					/>
				</Section>

				{/* Example 6: Loading State */}
				<Section title="Example 6: Loading State" description="Skeleton loading animation">
					<Breadcrumb items={[]} isLoading={true} />
				</Section>

				{/* Example 7: Custom Styling */}
				<Section
					title="Example 7: Custom Styling"
					description="Customized colors, spacing, and item styling"
				>
					<Breadcrumb
						items={[
							{ label: "Dashboard", href: "#" },
							{
								label: "Reports",
								href: "#",
								className: "font-semibold text-blue-600",
							},
							{
								label: "Analytics",
								className: "font-semibold text-blue-700",
							},
						]}
						className="rounded-lg border border-blue-200 bg-blue-50 p-4"
						listClassName="gap-3"
						separator={
							<span className="text-blue-300">
								<ChevronRight className="h-4 w-4" />
							</span>
						}
					/>
				</Section>

				{/* Example 8: Dynamic Path-based Breadcrumbs */}
				<Section
					title="Example 8: Dynamic Path-based Breadcrumbs"
					description="Auto-generated breadcrumbs from current URL path"
				>
					<DynamicBreadcrumb pathname={pathname} router={router} />
				</Section>

				

				{/* Props Reference */}
				<Section title="Props Reference" description="Key properties of the Breadcrumb component">
					<div className="overflow-x-auto">
						<table className="w-full text-sm">
							<thead>
								<tr className="border-b border-slate-200 bg-slate-50">
									<th className="px-4 py-3 text-left font-semibold text-slate-700">Prop</th>
									<th className="px-4 py-3 text-left font-semibold text-slate-700">Type</th>
									<th className="px-4 py-3 text-left font-semibold text-slate-700">Purpose</th>
								</tr>
							</thead>
							<tbody>
								<tr className="border-b border-slate-200 hover:bg-slate-50">
									<td className="px-4 py-3 font-mono text-slate-600">items</td>
									<td className="px-4 py-3 text-slate-600">BreadcrumbItem[]</td>
									<td className="px-4 py-3 text-slate-600">List of breadcrumb items to display</td>
								</tr>
								<tr className="border-b border-slate-200 hover:bg-slate-50">
									<td className="px-4 py-3 font-mono text-slate-600">separator</td>
									<td className="px-4 py-3 text-slate-600">ReactNode</td>
									<td className="px-4 py-3 text-slate-600">
										Custom separator (default: ChevronRight)
									</td>
								</tr>
								<tr className="border-b border-slate-200 hover:bg-slate-50">
									<td className="px-4 py-3 font-mono text-slate-600">maxVisibleItems</td>
									<td className="px-4 py-3 text-slate-600">number</td>
									<td className="px-4 py-3 text-slate-600">Auto-collapse if exceeds this count</td>
								</tr>
								<tr className="border-b border-slate-200 hover:bg-slate-50">
									<td className="px-4 py-3 font-mono text-slate-600">isLoading</td>
									<td className="px-4 py-3 text-slate-600">boolean</td>
									<td className="px-4 py-3 text-slate-600">Show loading skeleton</td>
								</tr>
								<tr className="border-b border-slate-200 hover:bg-slate-50">
									<td className="px-4 py-3 font-mono text-slate-600">homeItem</td>
									<td className="px-4 py-3 text-slate-600">BreadcrumbItem</td>
									<td className="px-4 py-3 text-slate-600">Optional home link at start</td>
								</tr>
								<tr className="hover:bg-slate-50">
									<td className="px-4 py-3 font-mono text-slate-600">onItemClick</td>
									<td className="px-4 py-3 text-slate-600">function</td>
									<td className="px-4 py-3 text-slate-600">Callback when item is clicked</td>
								</tr>
							</tbody>
						</table>
					</div>
				</Section>
			</div>
		</div>
	);
}

/**
 * Reusable Section Component
 */
interface SectionProps {
	title: string;
	description: string;
	children: React.ReactNode;
}

function Section({ title, description, children }: SectionProps) {
	return (
		<div className="mb-8 rounded-lg border border-slate-200 bg-white shadow-sm">
			<div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
				<h2 className="mb-1 text-xl font-bold text-slate-900">{title}</h2>
				<p className="text-sm text-slate-600">{description}</p>
			</div>
			<div className="px-6 py-6">{children}</div>
		</div>
	);
}

/**
 * Example with Click Handlers
 */
interface BreadcrumbWithHandlersProps {
	router: ReturnType<typeof useRouter>;
}

function BreadcrumbWithHandlers({ router }: BreadcrumbWithHandlersProps) {
	const handleItemClick = (item: BreadcrumbItem, index: number) => {
		console.log(`Breadcrumb clicked: "${item.label}" at index ${index}`);

		// Navigate based on label
		switch (item.label) {
			case "Dashboard":
				router.push("/");
				break;
			case "Users":
				router.push("/users");
				break;
			case "Profile":
				router.push("/users/profile");
				break;
			default:
				break;
		}
	};

	const items: BreadcrumbItem[] = [
		{ label: "Dashboard" },
		{ label: "Users" },
		{ label: "Profile" },
		{ label: "Settings" },
	];

	return (
		<Breadcrumb
			items={items}
			onItemClick={handleItemClick}
			homeItem={{ label: "Home", href: "/" }}
			showHome={true}
		/>
	);
}

/**
 * Dynamic Path-based Breadcrumb
 */
interface DynamicBreadcrumbProps {
	pathname: string;
	router: ReturnType<typeof useRouter>;
}

function DynamicBreadcrumb({ pathname, router }: DynamicBreadcrumbProps) {
	// Parse pathname into breadcrumb items
	const getBreadcrumbItems = (): BreadcrumbItem[] => {
		const segments = pathname.split("/").filter(Boolean);

		// Remove 'components' segment as it's the showcase root
		const filteredSegments = segments.filter((seg) => seg !== "components");

		return filteredSegments.map((segment, index) => {
			const label = segment
				.split("-")
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(" ");

			const isLast = index === filteredSegments.length - 1;

			return {
				label,
				href: isLast ? undefined : "/" + filteredSegments.slice(0, index + 1).join("/"),
			};
		});
	};

	const items = getBreadcrumbItems();

	const handleItemClick = (item: BreadcrumbItem, index: number) => {
		if (item.href) {
			router.push(item.href);
		}
	};

	return (
		<div className="space-y-2">
			<p className="mb-3 text-sm text-slate-600">
				<span className="rounded bg-slate-100 px-2 py-1 font-mono">Current path: {pathname}</span>
			</p>
			<Breadcrumb
				items={items}
				homeItem={{ label: "Home", href: "/" }}
				showHome={true}
				onItemClick={handleItemClick}
			/>
		</div>
	);
}
