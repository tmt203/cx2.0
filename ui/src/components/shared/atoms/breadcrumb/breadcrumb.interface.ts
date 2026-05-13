/**
 * Breadcrumb Item Interface
 * Defines the structure of a breadcrumb item
 */
export interface BreadcrumbItem {
	/** Display label of the breadcrumb item */
	label: string;
	/** URL or href (if it's a link) */
	href?: string;
	/** Custom click handler (replaces href if present) */
	onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
	/** Allow className customization */
	className?: string;
	/** Allow custom content rendering */
	renderCustom?: React.ReactNode;
}

/**
 * Breadcrumb Component Props
 */
export interface BreadcrumbAtomProps extends React.ComponentPropsWithoutRef<"nav"> {
	/** List of breadcrumb items */
	items: BreadcrumbItem[];
	/** Separator component or element (default: ChevronRight) */
	separator?: React.ReactNode;
	/** Allow className customization for the list */
	listClassName?: string;
	/** Callback when clicking an item */
	onItemClick?: (item: BreadcrumbItem, index: number) => void;
	/** Enable loading state */
	isLoading?: boolean;
	/** Home link (optional) - added at the beginning of the list */
	homeItem?: BreadcrumbItem;
	/** Show home item or not (default: true if homeItem is provided) */
	showHome?: boolean;
	/** Max items before collapse (if not provided, no collapse) */
	maxVisibleItems?: number;
}
