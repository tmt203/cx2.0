"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Breadcrumb } from "@components/shared/atoms";
import type { BreadcrumbItem } from "@components/shared/atoms/Breadcrumb";

export type ComponentSidebarItem = {
	key: string;
	label: string;
	href: string;
};

export type ComponentSidebarGroup = {
	key: string;
	label: string;
	items: ComponentSidebarItem[];
};

export interface ComponentPageLayoutProps {
	children?: React.ReactNode;
	breadcrumbs: BreadcrumbItem[];
	sidebarGroups: ComponentSidebarGroup[];
}

/**
 * Component Page Layout
 * @props ComponentPageLayoutProps
 */
const ComponentPageLayout = ({
	children,
	breadcrumbs,
	sidebarGroups,
}: ComponentPageLayoutProps) => {
	const pathname = usePathname();

	return (
		<div className="relative h-full w-full overflow-hidden bg-white px-2 py-4 dark:bg-gray-800 dark:text-gray-100 lg:px-4">
			{/* Area: Page header */}
			<div className="mb-2 sm:flex sm:items-center sm:justify-between">
				{/* Area: Title */}
				<h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 md:text-3xl">
					<Breadcrumb breadcrumbs={breadcrumbs} separate="ChevronRight" />
				</h1>
			</div>

			{/* Area: Title Divide */}
			<hr className="border-t dark:border-surface-400/30" />

			{/* Area: Content Body */}
			<div className="mt-4 grid h-[calc(100%-65px)] grid-cols-1 gap-4 overflow-hidden lg:grid-cols-[260px_1fr]">
				<aside className="scrollbar-thin h-full overflow-auto rounded-lg border border-gray-200 bg-gray-50/70 px-3 py-4 dark:border-surface-400/30 dark:bg-gray-900/30">
					<div className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
						Components
					</div>
					<div className="space-y-4">
						{sidebarGroups.map((group) => (
							<div key={group.key}>
								<div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
									{group.label}
								</div>
								<ul className="space-y-1">
									{group.items.map((item) => {
										const isActive =
											pathname === item.href || pathname?.startsWith(`${item.href}/`);
										return (
											<li key={item.key}>
												<Link
													href={item.href}
													className={clsx(
														"block rounded-md px-2.5 py-1.5 text-sm transition-colors",
														"text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700/40",
														isActive &&
															"bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-300"
													)}
												>
													{item.label}
												</Link>
											</li>
										);
									})}
								</ul>
							</div>
						))}
					</div>
				</aside>

				<main className="scrollbar-thin h-full overflow-auto rounded-lg border border-gray-200 bg-white px-4 py-5 dark:border-surface-400/30 dark:bg-gray-900/20">
					{children}
				</main>
			</div>
		</div>
	);
};

export default ComponentPageLayout;
