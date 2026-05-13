"use client";

import { Content, Portal, Root, Trigger } from "@radix-ui/react-popover";
import clsx from "clsx";
import { MouseEvent, useCallback, useState } from "react";

export interface TooltipProps {
	children: React.ReactNode;
	className?: string;
	content?: string | React.ReactNode;
	bg?: "dark" | "light" | null;
	size?: "sm" | "md" | "lg" | "full" | "none";
}

/**
 * Tooltip component
 * @param props TooltipProps
 * @returns JSX.Element
 */
const Tooltip = ({
	children,
	className = "",
	bg = "light",
	size = "none",
	content,
}: TooltipProps) => {
	const [open, setOpen] = useState<boolean>(false);

	/**
	 * Initialize size classes
	 * @param size TooltipProps["size"]
	 */
	const sizeClasses = useCallback((size: TooltipProps["size"]) => {
		switch (size) {
			case "lg":
				return "max-w-[40rem] px-3 py-2 !text-wrap";
			case "md":
				return "max-w-[20rem] px-3 py-2 !text-wrap";
			case "sm":
				return "max-w-[11rem] px-3 py-2 !text-wrap";
			case "full":
				return "min-w-full px-3 py-2 whitespace-nowrap";
			default:
				return "px-3 py-2";
		}
	}, []);

	/**
	 * Initialize color classes
	 * @param bg TooltipProps["bg"]
	 */
	const colorClasses = useCallback((bg: TooltipProps["bg"]) => {
		switch (bg) {
			case "light":
				return "bg-white dark:bg-gray-800 dark:text-white border-gray-400/30";
			case "dark":
				return "bg-gray-800 text-gray-100 border-surface-400/30";
			default:
				return "bg-white dark:bg-gray-800 dark:text-gray-100 border-gray-200 dark:border-surface-400/30";
		}
	}, []);

	/**
	 * Open tooltip
	 */
	const toggleTooltip = useCallback(() => {
		setOpen(true);
	}, []);

	/**
	 * Close tooltip
	 */
	const closeTooltip = useCallback(() => {
		setOpen(false);
	}, []);

	/**
	 * Prevent click
	 * @param event React.MouseEvent
	 */
	const preventClick = useCallback((event: MouseEvent) => {
		event.preventDefault();
		event.stopPropagation();
	}, []);

	return (
		<Root open={open} onOpenChange={setOpen}>
			<Trigger
				asChild
				onMouseEnter={toggleTooltip}
				onMouseLeave={closeTooltip}
				onFocus={toggleTooltip}
				onBlur={closeTooltip}
				onClick={preventClick}
			>
				<div className="relative inline-flex items-center justify-center">{children}</div>
			</Trigger>

			<Portal>
				<Content
					side="top"
					sideOffset={6}
					align="center"
					alignOffset={0}
					className={clsx(
						"z-50 rounded border border-gray-200 shadow-md",
						colorClasses(bg),
						sizeClasses(size),
						className
					)}
				>
					{content}
				</Content>
			</Portal>
		</Root>
	);
};

export default Tooltip;
