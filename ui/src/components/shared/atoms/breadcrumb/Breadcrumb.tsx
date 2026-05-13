"use client";

import React, { useMemo } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronRight } from "lucide-react";

import { cn } from "@utils/cn";
import {
	Breadcrumb as BreadcrumbRoot,
	BreadcrumbList,
	BreadcrumbItem as BreadcrumbItemComponent,
	BreadcrumbLink,
	BreadcrumbPage,
	BreadcrumbSeparator,
	BreadcrumbEllipsis,
} from "@components/ui/breadcrumb";
import type { BreadcrumbItem, BreadcrumbAtomProps } from "./breadcrumb.interface";
import { BREADCRUMB_DEFAULTS, BREADCRUMB_STYLES } from "./breadcrumb.constant";

type CollapsedBreadcrumbItem = {
	type: "collapsed";
	label: string;
	hiddenItems: BreadcrumbItem[];
};

type DisplayBreadcrumbItem = BreadcrumbItem | CollapsedBreadcrumbItem;

const isCollapsedItem = (item: DisplayBreadcrumbItem): item is CollapsedBreadcrumbItem => {
	return (item as CollapsedBreadcrumbItem).type === "collapsed";
};

/**
 * Breadcrumb Component (Atom)
 *
 * Flexible & scalable breadcrumb component based on shadcn breadcrumb.
 * Supports:
 * - Custom items with link or click handler
 * - Custom separator
 * - Optional home item
 * - Collapse long items if needed
 * - Loading state
 * - Full TypeScript support
 *
 * @example
 * ```tsx
 * <Breadcrumb
 *   items={[
 *     { label: "Products", href: "/products" },
 *     { label: "Electronics", href: "/products/electronics" },
 *     { label: "Laptop" }
 *   ]}
 * />
 * ```
 */
const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbAtomProps>(
	(
		{
			items = [],
			separator = <ChevronRight />,
			listClassName,
			onItemClick,
			isLoading = false,
			homeItem,
			showHome = !!homeItem,
			maxVisibleItems,
			className,
			...props
		},
		ref
	) => {
		// Merge home item into items list if needed
		const breadcrumbItems = useMemo(() => {
			if (showHome && homeItem) {
				return [homeItem, ...items];
			}
			return items;
		}, [items, homeItem, showHome]);

		// Handle collapse of long breadcrumbs if maxVisibleItems is set
		const displayItems = useMemo<DisplayBreadcrumbItem[]>(() => {
			const maxItems = maxVisibleItems ?? BREADCRUMB_DEFAULTS.MAX_VISIBLE_ITEMS;

			if (breadcrumbItems.length <= maxItems || maxItems < 3) {
				return breadcrumbItems;
			}

			// Keep first + ellipsis + last N items and move the middle into a dropdown.
			const firstItems = breadcrumbItems.slice(0, 1);
			const lastItemsToShow = Math.max(1, maxItems - 2);
			const hiddenItems = breadcrumbItems.slice(1, breadcrumbItems.length - lastItemsToShow);
			const lastItems = breadcrumbItems.slice(-lastItemsToShow);

			if (hiddenItems.length === 0) {
				return breadcrumbItems;
			}

			return [...firstItems, { type: "collapsed", label: "...", hiddenItems }, ...lastItems];
		}, [breadcrumbItems, maxVisibleItems]);

		const handleItemAction = (item: BreadcrumbItem, e: React.MouseEvent<HTMLAnchorElement>) => {
			if (item.onClick) {
				item.onClick(e);
			}

			if (onItemClick) {
				onItemClick(item, breadcrumbItems.indexOf(item));
			}
		};

		// Render item content (link or page)
		const renderItemContent = (item: BreadcrumbItem, isLast: boolean) => {
			if (isLast) {
				return (
					<BreadcrumbPage className={cn(BREADCRUMB_STYLES.page, item.className)}>
						{item.label}
					</BreadcrumbPage>
				);
			}

			return (
				<BreadcrumbLink
					asChild
					className={cn(BREADCRUMB_STYLES.link, item.className)}
					onClick={(e) => handleItemAction(item, e)}
				>
					{item.href ? (
						<a href={item.href}>{item.label}</a>
					) : (
						<button
							type="button"
							className="cursor-pointer"
							onClick={(e) => {
								handleItemAction(item, e as unknown as React.MouseEvent<HTMLAnchorElement>);
							}}
						>
							{item.label}
						</button>
					)}
				</BreadcrumbLink>
			);
		};

		// Show loading skeleton
		if (isLoading) {
			return (
				<BreadcrumbRoot ref={ref} className={className} {...props}>
					<BreadcrumbList className={listClassName}>
						{Array.from({ length: 3 }).map((_, i) => (
							<React.Fragment key={i}>
								<BreadcrumbItemComponent>
									<div className={BREADCRUMB_STYLES.skeleton} />
								</BreadcrumbItemComponent>
								{i < 2 && <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>}
							</React.Fragment>
						))}
					</BreadcrumbList>
				</BreadcrumbRoot>
			);
		}

		// Handle empty state
		if (displayItems.length === 0) {
			return null;
		}

		return (
			<BreadcrumbRoot ref={ref} className={className} {...props}>
				<BreadcrumbList className={cn(BREADCRUMB_STYLES.container, listClassName)}>
					{displayItems.map((item, index) => {
						const isLast = index === displayItems.length - 1;
						const isEllipsis = isCollapsedItem(item);

						return (
							<React.Fragment key={`${item.label}-${index}`}>
								<BreadcrumbItemComponent className={BREADCRUMB_STYLES.item}>
									{isEllipsis ? (
										<Menu as="div" className="relative inline-block">
											<MenuButton className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent focus:outline-none">
												<BreadcrumbEllipsis />
												<span className="sr-only">Toggle breadcrumb menu</span>
											</MenuButton>
											<MenuItems className="absolute left-0 z-50 mt-2 min-w-40 rounded-md border bg-white p-1 shadow-md focus:outline-none">
												{item.hiddenItems.map((hiddenItem, hiddenIndex) => (
													<MenuItem key={`${hiddenItem.label}-${hiddenIndex}`}>
														{({ focus }) =>
															hiddenItem.href ? (
																<a
																	href={hiddenItem.href}
																	className={cn(
																		"block rounded-sm px-2 py-1.5 text-sm text-foreground",
																		focus && "bg-accent"
																	)}
																	onClick={(e) => handleItemAction(hiddenItem, e)}
																>
																	{hiddenItem.label}
																</a>
															) : (
																<button
																	type="button"
																	className={cn(
																		"block w-full rounded-sm px-2 py-1.5 text-left text-sm text-foreground",
																		focus && "bg-accent"
																	)}
																	onClick={(e) =>
																		handleItemAction(
																			hiddenItem,
																			e as unknown as React.MouseEvent<HTMLAnchorElement>
																		)
																	}
																>
																	{hiddenItem.label}
																</button>
															)
														}
													</MenuItem>
												))}
											</MenuItems>
										</Menu>
									) : (
										renderItemContent(item, isLast)
									)}
								</BreadcrumbItemComponent>

								{/* Render separator if not the last item */}
								{!isLast && (
									<BreadcrumbSeparator className={BREADCRUMB_STYLES.separator}>
										{separator}
									</BreadcrumbSeparator>
								)}
							</React.Fragment>
						);
					})}
				</BreadcrumbList>
			</BreadcrumbRoot>
		);
	}
);

Breadcrumb.displayName = "Breadcrumb";

export default Breadcrumb;
export { type BreadcrumbItem, type BreadcrumbAtomProps };
