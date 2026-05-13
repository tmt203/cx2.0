"use client";

import { Size, Variant } from "@type/common.type";
import clsx from "clsx";
import { Loader, LucideIcon } from "lucide-react";
import { ButtonHTMLAttributes, DetailedHTMLProps, MouseEvent, useMemo } from "react";

type ButtonStates = "loading" | "disabled" | "default";
type ButtonRounded = Omit<Size, "2xs" | "xs">;

export interface ButtonProps
	extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
	icon?: LucideIcon;
	size?: Size;
	variant?: Variant;
	outline?: boolean;
	className?: string;
	state?: ButtonStates;
	rounded?: ButtonRounded;
	children?: React.ReactNode;
	type?: "button" | "submit" | "reset";
	onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

/**
 * Button config classnames
 * @param size Size
 * @param outline boolean
 * @param variant Variant
 * @param className string
 * @param state ButtonStates
 * @param rounded ButtonRounded
 * @returns string
 */
const getButtonClassNames = (
	className: string,
	state: ButtonStates,
	outline: boolean,
	variant: Variant,
	rounded: ButtonRounded,
	size: Size,
	disabled?: boolean
) => {
	return clsx(
		className,
		"min-w-20 btn py-0 px-3 hover:brightness-105 active:scale-x-95 active:scale-y-95 active:brightness-90 text-nowrap",
		getStateClassNames(state, outline, disabled),
		getVariantClassNames(variant, outline),
		getRoundedClassNames(rounded),
		getSizeClassNames(size)
	);
};

/**
 * Button config state
 * @param state ButtonStates
 */
const getStateClassNames = (state: ButtonStates, outline: boolean, disabled?: boolean) => {
	return {
		"!bg-disabled-color dark:!bg-disabled-color/70 pointer-events-none": disabled && !outline,
		"!bg-white dark:!bg-white/20 !text-disabled-color border !border-disabled-color pointer-events-none":
			disabled && outline,
		"pointer-events-none": state === "loading",
	};
};

/**
 * Button config variant
 * @param variant Variant
 */
const getVariantClassNames = (variant: Variant, outline: boolean) => {
	return {
		"bg-primary-500 text-white": variant === "primary" && !outline,
		"bg-secondary-500 text-white": variant === "secondary" && !outline,
		"bg-success-500 text-white": variant === "success" && !outline,
		"bg-info-500 text-white": variant === "info" && !outline,
		"bg-warning-500 text-white": variant === "warning" && !outline,
		"bg-danger-500 text-white": variant === "danger" && !outline,
		"bg-surface-500 text-white": variant === "surface" && !outline,
		"bg-white dark:bg-surface-300/5 border border-primary-500 dark:border-primary-700/60 text-primary-500":
			outline && variant === "primary",
		"bg-white dark:bg-surface-300/5 border border-secondary-500 dark:border-secondary-700/60 text-secondary-500":
			outline && variant === "secondary",
		"bg-white dark:bg-surface-300/5 border border-success-500 dark:border-success-700/60 text-success-500":
			outline && variant === "success",
		"bg-white dark:bg-surface-300/5 border border-info-500 dark:border-info-700/60 text-info-500":
			outline && variant === "info",
		"bg-white dark:bg-surface-300/5 border border-warning-500 dark:border-warning-700/60 text-warning-500":
			outline && variant === "warning",
		"bg-white dark:bg-surface-300/5 border border-danger-500 dark:border-danger-700/60 text-danger-500":
			outline && variant === "danger",
		"bg-white dark:bg-surface-300/5 border border-surface-700 dark:border-surface-400/30 text-surface-800 dark:text-white":
			outline && variant === "surface",
	};
};

/**
 * Button config rounded
 * @param rounded ButtonRounded
 */
const getRoundedClassNames = (rounded: ButtonRounded) => {
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
 * Button config size
 * @param size Size
 */
const getSizeClassNames = (size: Size) => {
	return {
		"h-6 text-sm": size === "2xs",
		"h-7 text-base": size === "xs",
		"h-8 text-base": size === "sm",
		"h-9 text-base": size === "md",
		"h-10 text-lg": size === "lg",
		"h-11 text-lg": size === "xl",
		"h-12 text-2xl": size === "2xl",
	};
};

/**
 * Button component
 * @param props ButtonProps
 * @returns JSX.Element
 */
const Button = ({
	icon: IconComponent,
	children,
	size = "sm",
	className = "",
	state = "default",
	outline = false,
	variant = "secondary",
	type = "button",
	rounded = "md",
	disabled,
	onClick = () => {},
}: ButtonProps) => {
	const iconSize = useMemo(() => {
		switch (size) {
			case "2xs":
				return 14;
			case "xs":
				return 16;
			case "sm":
				return 18;
			case "md":
				return 20;
			case "lg":
				return 22;
			case "xl":
				return 24;
			case "2xl":
				return 26;
			default:
				return 20;
		}
	}, [size]);

	return (
		<button
			type={type}
			disabled={disabled}
			className={getButtonClassNames(className, state, outline, variant, rounded, size, disabled)}
			onClick={onClick}
		>
			{state === "loading" ? (
				<div className="mr-2">
					<Loader className="animate-spin shrink-0" size={iconSize} />
				</div>
			) : null}
			{IconComponent && <IconComponent size={iconSize} />}
			{children}
		</button>
	);
};

export default Button;
