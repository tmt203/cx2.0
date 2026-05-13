"use client";

import { Size } from "@/src/lib/type/common.type";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import React from "react";

type ChipType = "default" | "soft" | "outline";

export type ChipVariant =
	| "primary"
	| "secondary"
	| "success"
	| "info"
	| "warning"
	| "danger"
	| "surface";

export interface ChipProps {
	children?: React.ReactNode;
	variant?: ChipVariant;
	type?: ChipType;
	size?: Size;
	className?: string;
	rounded?: Size;
	label?: string;
}

/**
 * Get variant classes
 * @param variant ChipVariant
 * @param type ChipType
 */
const getVariantClasses = (variant: ChipVariant, type: ChipType) => {
	return (
		{
			soft: {
				primary: "bg-primary-100 dark:bg-primary-700/50 text-primary-700 dark:text-primary-300",
				secondary:
					"bg-secondary-100 dark:bg-secondary-700/50 text-secondary-700 dark:text-secondary-300",
				info: "bg-info-100 dark:bg-info-700/50 text-info-700 dark:text-info-300",
				success: "bg-success-100 dark:bg-success-700/50 text-success-700 dark:text-success-300",
				warning: "bg-warning-100 dark:bg-warning-700/50 text-warning-700 dark:text-warning-300",
				danger: "bg-danger-100 dark:bg-danger-700/50 text-danger-700 dark:text-danger-300",
				surface: "bg-surface-300 dark:bg-surface-700/50 text-surface-700 dark:text-surface-300",
			},
			outline: {
				primary: "bg-white dark:bg-surface-300/5 border border-primary-500 text-primary-500",
				secondary: "bg-white dark:bg-surface-300/5 border border-secondary-500 text-secondary-500",
				info: "bg-white dark:bg-surface-300/5 border border-info-500 text-info-500",
				success: "bg-white dark:bg-surface-300/5 border border-success-500 text-success-500",
				warning: "bg-white dark:bg-surface-300/5 border border-warning-500 text-warning-500",
				danger: "bg-white dark:bg-surface-300/5 border border-danger-500 text-danger-500",
				surface: "bg-white dark:bg-surface-300/5 border border-surface-500 text-surface-500",
			},
			default: {
				primary: "bg-primary-500 text-white",
				secondary: "bg-secondary-500 text-white",
				info: "bg-info-500 text-white",
				success: "bg-success-500 text-white",
				warning: "bg-warning-500 text-white",
				danger: "bg-danger-500 text-white",
				surface: "bg-surface-500 text-white",
			},
		}[type]?.[variant] || ""
	);
};

/**
 * Get size classes
 * @param size Size
 */
const getSizeClasses = (size: Size) => {
	return (
		{
			"2xs": "h-[16px] text-sm",
			xs: "h-[18px] text-sm",
			sm: "h-5",
			md: "h-6",
			lg: "h-7 text-base",
			xl: "h-8 text-lg",
			"2xl": "h-9 text-xl",
			full: "h-full w-full",
		}[size] || ""
	);
};

/**
 * Get rounded classes
 * @param size Size
 */
const getRoundedClasses = (rounded: Size) => {
	return {
		"rounded-sm": rounded === "sm",
		"rounded-md": rounded === "md",
		"rounded-lg": rounded === "lg",
		"rounded-xl": rounded === "xl",
		"rounded-2xl": rounded === "2xl",
		"rounded-full": rounded === "full",
	};
};

/**
 * Generate chip classes
 * @param variant ChipVariant
 * @param type ChipType
 * @param size Size
 * @param className string
 */
const generateChipClasses = (
	variant: ChipVariant,
	type: ChipType,
	size: Size,
	rounded: Size,
	className?: string
) => {
	return clsx(
		className,
		"text-sm px-2.5 py-1 rounded-full shadow-none flex items-center font-semibold",
		getVariantClasses(variant, type),
		getSizeClasses(size),
		getRoundedClasses(rounded)
	);
};

/**
 * Chip Component
 * @prop ChipProps
 */
const Chip = ({
	label,
	children,
	className,
	size = "md",
	type = "soft",
	variant = "primary",
	rounded = "full",
}: ChipProps) => {
	const t = useTranslations();
	return (
		<div className={generateChipClasses(variant, type, size, rounded, className)}>
			{/* Area: Children */}
			{children}
			{label && t(label)}
		</div>
	);
};

export default Chip;
