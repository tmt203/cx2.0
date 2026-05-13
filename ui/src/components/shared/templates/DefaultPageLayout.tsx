"use client";

import { Breadcrumb } from "@components/shared/atoms";
import type { BreadcrumbItem } from "@components/shared/atoms/Breadcrumb";

export interface DefaultPageLayoutProps {
	children?: React.ReactNode;
	leftTileChildren?: React.ReactNode;
	breadcrumbs: BreadcrumbItem[];
}

/**
 * Default Page Layout
 * @props DefaultPageLayoutProps
 */
const DefaultPageLayout = ({ children, leftTileChildren, breadcrumbs }: DefaultPageLayoutProps) => {
	return (
		<div className="relative h-full w-full overflow-hidden bg-white px-2 py-4 dark:bg-gray-800 dark:text-gray-100 lg:px-4">
			{/* Area: Page header */}
			<div className="mb-2 sm:flex sm:items-center sm:justify-between">
				{/* Area: Title */}
				<h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 md:text-3xl">
					<Breadcrumb breadcrumbs={breadcrumbs} separate="ChevronRight" />
				</h1>

				{/* Area: Left Title Children */}
				<div className="grid grid-flow-col justify-start gap-2 sm:auto-cols-max sm:justify-end">
					{leftTileChildren}
				</div>
			</div>

			{/* Area: Title Divide */}
			<hr className="border-t dark:border-surface-400/30" />

			{/* Area: Content Body */}
			<div className="scrollbar-thin mt-4 h-[calc(100%-65px)] overflow-auto px-2">{children}</div>
		</div>
	);
};

export default DefaultPageLayout;
