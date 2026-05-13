/**
 * Breadcrumb Constants
 */

export const BREADCRUMB_DEFAULTS = {
	/** Max items to display before collapse (to prevent breadcrumb from being too long) */
	MAX_VISIBLE_ITEMS: 5,
	/** Default home label */
	HOME_LABEL: "Home",
	/** Aria label for breadcrumb navigation */
	ARIA_LABEL: "breadcrumb",
} as const;

/**
 * Breadcrumb CSS Classes
 * Using Tailwind utilities for easy maintenance
 */
export const BREADCRUMB_STYLES = {
	container:
		"flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5",
	item: "inline-flex items-center gap-1.5",
	link: "transition-colors hover:text-foreground",
	page: "font-normal text-foreground",
	separator: "[&>svg]:w-3.5 [&>svg]:h-3.5",
	skeleton: "h-4 w-20 bg-muted-foreground/20 rounded animate-pulse",
} as const;
