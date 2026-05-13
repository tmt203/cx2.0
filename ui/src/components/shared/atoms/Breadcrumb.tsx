"use client";

import clsx from "clsx";
import { useTranslations } from "next-intl";
import Icon from "./Icon";

type BreadcrumbSeparate = "ChevronRight" | "Slash" | "Dot";

export interface BreadcrumbItem {
	key: string;
	label: string;
	url?: string;
	noTranslate?: boolean;
}
export interface BreadcrumbProps {
	breadcrumbs: BreadcrumbItem[];
	separate: BreadcrumbSeparate;
}

/**
 * Breadcrumb component
 * @props BreadcrumbProps
 */
const Breadcrumb = ({ breadcrumbs, separate }: BreadcrumbProps) => {
	// Hooks
	const t = useTranslations();

	return (
		<ul className="inline-flex flex-wrap text-2xl font-semibold gap-1">
			{breadcrumbs.map((item, index) => {
				return (
					<li key={`${item.key}-${index}`} className="flex items-center gap-1">
						<a
							className={clsx({
								"hover:text-primary-700": item.url,
							})}
							href={item.url}
						>
							{item.noTranslate ? item.label : t(item.label)}
						</a>

						{/* Area: Separate icon */}
						{index < breadcrumbs.length - 1 && (
							<Icon name={separate} size={12} className="text-gray-500" />
						)}
					</li>
				);
			})}
		</ul>
	);
};

export default Breadcrumb;
