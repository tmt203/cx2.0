"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface SidebarLinkProps {
	href: string;
	className?: string;
	style?: React.CSSProperties;
	children: React.ReactNode;
}

/**
 * Sidebar Link Component
 * @props SidebarLinkProps
 */
const SidebarLink = ({ children, href, className, style }: SidebarLinkProps) => {
	const pathname = usePathname();

	return (
		<Link
			href={href}
			style={style}
			className={clsx(
				className,
				"relative block animate-[sidebar-animation_ease-in-out] truncate text-gray-800 transition dark:text-gray-100",
				{
					"group-[.is-link-group]:text-primary-500": pathname === href,
					"hover:text-gray-900 group-[.is-link-group]:text-gray-500/90 group-[.is-link-group]:hover:text-gray-700 dark:hover:text-white dark:group-[.is-link-group]:text-gray-400 dark:group-[.is-link-group]:hover:text-gray-200":
						pathname !== href,
				}
			)}
		>
			{/* Area: Content */}
			{children}
		</Link>
	);
};

export default SidebarLink;
