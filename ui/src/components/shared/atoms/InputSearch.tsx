"use client";

import { Size, Variant } from "@type/common.type";
import clsx from "clsx";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { ChangeEvent, KeyboardEvent, useCallback, useMemo } from "react";

type InputSearchSize = Omit<Size, "2xs" | "xs">;
type InputSearchRounded = Omit<Size, "2xs" | "xs">;

export interface InputSearchProps
	extends Omit<
		React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
		"size" | "type" | "readonly" | "disabled" | "onChange"
	> {
	size?: InputSearchSize;
	rounded?: InputSearchRounded;
	borderColor?: Variant;
	onSearch?: () => void;
	onChange?: (value: string) => void;
}

/**
 * InputSearch class names
 * @param size Size
 * @param rounded InputSearchRounded
 * @param borderColor Variant
 * @returns string
 */
const getInputSearchClassNames = (
	size: InputSearchSize,
	rounded: InputSearchRounded,
	borderColor: Variant,
	value?: string | number | readonly string[]
) => {
	return clsx(
		"flex items-center justify-center border p-1 bg-light-500 group",
		"dark:!border-surface-400/30 dark:!bg-surface-300/5",
		"hover:justify-between hover:!w-56 transition-all duration-200 ease-in-out",
		{
			"!w-56": typeof value === "string" || Array.isArray(value) ? value.length > 0 : false,
			// Rounded
			"rounded-sm": rounded === "sm",
			"rounded-md": rounded === "md",
			"rounded-lg": rounded === "lg",
			"rounded-xl": rounded === "xl",
			"rounded-2xl": rounded === "2xl",
			"rounded-full": rounded === "full",

			// Border
			"border-primary-500": borderColor === "primary",
			"border-secondary-500": borderColor === "secondary",
			"border-success-500": borderColor === "success",
			"border-info-500": borderColor === "info",
			"border-warning-500": borderColor === "warning",
			"border-danger-500": borderColor === "danger",
			"border-surface-500": borderColor === "surface",

			// Size
			"h-7 w-7 text-base": size === "sm",
			"h-8 w-8 text-base": size === "md",
			"h-9 w-9 text-lg": size === "lg",
			"h-10 w-10 text-lg": size === "xl",
			"h-11 w-11 text-2xl": size === "2xl",
		}
	);
};

/**
 * Input class name
 * @param size InputSearchSize
 * @param value string | number | readonly string[] | undefined
 * @returns string
 */
const getInputClassNames = (size: InputSearchSize, value?: string | number | readonly string[]) => {
	return clsx(
		"w-0 border-none outline-none focus:ring-0 focus:border-transparent p-0 pr-0 bg-transparent",
		"transition-all duration-500 ease-in-out transform scale-0 opacity-0",
		"group-hover:scale-100 group-hover:w-full group-hover:opacity-100 group-hover:pr-2 group-hover:flex",
		{
			"pr-2 w-full opacity-100 scale-100 flex":
				typeof value === "string" || Array.isArray(value) ? value.length > 0 : false,
			// Size
			"text-sm": size === "sm",
			"text-base": size === "md",
			"text-lg": size === "lg" || size === "xl",
			"text-2xl": size === "2xl",
		}
	);
};

/**
 * InputSearch component
 * @props InputSearchProps
 */
const InputSearch = ({
	value,
	size = "md",
	rounded = "md",
	borderColor = "surface",
	className,
	onSearch,
	onChange,
	...props
}: InputSearchProps) => {
	const t = useTranslations();
	const iconSize = useMemo(() => {
		switch (size) {
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

	/**
	 * Handle search keydown Enter
	 * @param event KeyboardEvent<HTMLInputElement>
	 */
	const handleSearch = useCallback(
		(event: KeyboardEvent<HTMLInputElement>) => {
			if (event.key === "Enter" || event.code === "Enter") {
				event.preventDefault();
				onSearch && onSearch();
			}
		},
		[onSearch]
	);

	/**
	 * Handle Input Search change
	 * @param event ChangeEvent<HTMLInputElement>
	 */
	const handleInputSearchChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			const target = event.target;
			onChange && onChange(target.value);
		},
		[onChange]
	);

	return (
		<div className={clsx(getInputSearchClassNames(size, rounded, borderColor, value), className)}>
			<input
				{...props}
				value={value}
				type="text"
				placeholder={t(props.placeholder ?? "input.placeholder", {
					data: t("keyword").toLowerCase(),
				})}
				className={getInputClassNames(size, value)}
				onKeyDown={handleSearch}
				onChange={handleInputSearchChange}
			/>
			<Search size={iconSize} className="cursor-pointer" onClick={onSearch} />
		</div>
	);
};

export default InputSearch;
