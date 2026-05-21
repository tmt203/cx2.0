"use client";

import { Icon, Tooltip } from "@components/shared/atoms";
import { Display, Placement, Size } from "@lib/type/common.type";
import clsx from "clsx";
import * as LucideIcons from "lucide-react";
import { Asterisk, Eye, EyeOff, Info } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { FocusEventHandler, useCallback, useMemo, useState } from "react";

export type InputType =
	| "text"
	| "password"
	| "email"
	| "number"
	| "tel"
	| "url"
	| "date"
	| "time"
	| "datetime-local";
type InputState = "default" | "error" | "success" | "warning";

export interface InputFormProps extends Omit<
	React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
	"size" | "type"
> {
	size?: Size;
	label?: string;
	type?: InputType;
	feedback?: string;
	state?: InputState;
	placement?: Display;
	errorMessage?: string;
	errorMessageValues?: Record<string, string | number>;
	noTranslateErrorMessage?: boolean;
	noTranslateLabel?: boolean;
	variant?: "default" | "v2";
	icon?: keyof typeof LucideIcons;
	iconDirection?: Omit<Placement, "center">;
}

/**
 * Input Form component
 * @props InputFormProps
 */
const InputForm = ({
	icon,
	value,
	disabled,
	readOnly,
	className,
	label = "",
	size = "md",
	type = "text",
	feedback = "",
	required = false,
	state = "default",
	placement = "col",
	errorMessage = "",
	errorMessageValues,
	noTranslateErrorMessage = false,
	variant = "default",
	iconDirection = "start",
	noTranslateLabel = false,
	onChange,
	...props
}: InputFormProps) => {
	// Hooks
	const t = useTranslations();

	// States
	const [isFocused, setIsFocused] = useState<boolean>(false);
	const [showPassword, setShowPassword] = useState<boolean>(false);

	const showFloatingLabel = useMemo(() => {
		return isFocused || !!value;
	}, [isFocused, value]);

	const actualType = useMemo(() => {
		if (type === "password") {
			return showPassword ? "text" : "password";
		}
		return type;
	}, [type, showPassword]);

	const phoneNumberPattern = useMemo(() => {
		if (["tel", "number"].includes(type)) {
			return "^\\d+$";
		}
		return undefined;
	}, [type]);

	const LucideIcon = useMemo(() => {
		if (!icon) return null;
		return LucideIcons[icon];
	}, [icon]);

	/**
	 * Handle focus input v2
	 * @param focus boolean
	 */
	const handleFocusInputV2 = useCallback((focus: boolean): FocusEventHandler<HTMLInputElement> => {
		return (_event) => {
			setIsFocused(focus);
		};
	}, []);

	const resolvedErrorMessage = errorMessage
		? noTranslateErrorMessage
			? errorMessage
			: t(errorMessage, errorMessageValues)
		: "";

	// Input Form V2
	if (variant === "v2") {
		return (
			<div className={className}>
				<div className="relative w-full">
					{/* Area: Label floating */}
					{label && (
						<label
							htmlFor={props.id}
							className={clsx("absolute flex transition-all duration-200 ease-in-out", {
								"left-1 top-[-8px] z-10 rounded-full bg-white px-1 !text-xs dark:bg-gray-800":
									showFloatingLabel,
								"left-3 top-1/2 -translate-y-1/2 text-gray-500": !showFloatingLabel,
								"!text-primary-500": isFocused && state === "default",
								"!text-danger-500": state === "error",
								"text-xs": size === "2xs",
								"text-sm": ["xs", "sm", "md", "lg"].includes(size),
								"text-md": size === "xl",
								"text-lg": size === "2xl",
							})}
						>
							{noTranslateLabel ? label : t(label)}
							{required && <Asterisk size={10} className="ml-1 inline text-danger-500" />}
						</label>
					)}

					{/* Area: Input box */}
					<input
						{...props}
						id={props.id}
						placeholder=""
						type={actualType}
						value={value ?? ""}
						autoComplete="off"
						readOnly={readOnly}
						pattern={phoneNumberPattern}
						disabled={disabled}
						onFocus={handleFocusInputV2(true)}
						onBlur={handleFocusInputV2(false)}
						onChange={onChange}
						className={clsx("form-input w-full", "border", {
							"!focus:border-danger-500 !border-danger-500 !text-danger-700":
								state === "error" || errorMessage,
							"border-success-500 text-success-700 focus:border-success-500": state === "success",
							"border-warning-500 text-warning-700 focus:border-warning-500": state === "warning",
							"border-primary-500": isFocused && !errorMessage && state === "default",
							"border-gray-300 focus:border-primary-500": state === "default",
							"shadow-none disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400 dark:disabled:border-gray-700 dark:disabled:bg-gray-800 dark:disabled:text-gray-600 dark:disabled:placeholder:text-gray-600":
								disabled,
							"bg-disabled-color/10 dark:!bg-disabled-color/10": readOnly,
							"pl-9": icon && iconDirection === "start",
							"pr-9": icon && iconDirection === "end",
							"h-6 text-xs": size === "2xs",
							"h-7 text-sm": size === "xs",
							"h-8 text-sm": size === "sm",
							"h-9 text-sm": size === "md",
							"h-10 text-sm": size === "lg",
							"text-md h-11": size === "xl",
							"h-12 text-lg": size === "2xl",
						})}
					/>

					{type === "password" && (
						<button
							type="button"
							tabIndex={-1}
							onClick={() => setShowPassword((prev) => !prev)}
							className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
						>
							{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
						</button>
					)}
				</div>

				{/* Error message */}
				{resolvedErrorMessage ? (
					<p className="mt-1 text-xs italic text-danger-500">{resolvedErrorMessage}</p>
				) : null}
			</div>
		);
	}

	// Input Form Default
	return (
		<div className={clsx("flex w-full flex-col gap-1", className)}>
			<div className={clsx("flex w-full items-center justify-center gap-2", {})}>
				<div
					className={clsx("flex w-full gap-2", {
						"flex-col": placement === "col",
						"flex-row items-center": placement === "row",
					})}
				>
					{/* Area: Label */}
					{label && (
						<div className="flex justify-between gap-2">
							<label className="flex whitespace-nowrap text-base font-semibold" htmlFor={props.id}>
								{noTranslateLabel ? label : t(label)}{" "}
								{required && <Asterisk size={12} className="text-danger-500" />}
							</label>

							{/* Feedback */}
							{feedback && (
								<Tooltip content={t(feedback)} size="lg">
									<Info size={18} strokeWidth={2.5} className="fill-surface-600 text-white" />
								</Tooltip>
							)}
						</div>
					)}

					<div className="relative pl-4">
						{/* Icon start placement */}
						{icon && iconDirection === "start" && (
							<div className="pointer-events-none absolute inset-0 right-auto ml-2 flex items-center">
								{LucideIcon ? <Icon name={icon} size={20} /> : null}
							</div>
						)}

						{/* Area: Input  */}
						<input
							{...props}
							type={actualType}
							value={value ?? ""}
							autoComplete="off"
							readOnly={readOnly}
							pattern={phoneNumberPattern}
							disabled={disabled}
							className={clsx("form-input w-full", {
								"border-danger-500 hover:!border-danger-300 focus:!border-danger-500 dark:border-danger-500":
									errorMessage || state === "error",
								"border-success-500 hover:!border-success-300 focus:!border-success-500 dark:border-success-500":
									state === "success",
								"border-warning-500 hover:!border-warning-300 focus:!border-warning-500 dark:border-warning-500":
									state === "warning",
								"shadow-none disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400 dark:disabled:border-gray-700 dark:disabled:bg-gray-800 dark:disabled:text-gray-600 dark:disabled:placeholder:text-gray-600":
									disabled,
								"bg-disabled-color/10 dark:!bg-disabled-color/10": readOnly,
								"pl-9": icon && iconDirection === "start",
								"pr-9": icon && iconDirection === "end",
								"h-6 text-sm": size === "2xs",
								"h-7 text-base": size === "xs",
								"h-8 text-base": size === "sm",
								"h-9 text-base": size === "md",
								"h-10 text-base": size === "lg",
								"h-11 text-lg": size === "xl",
								"h-12 text-xl": size === "2xl",
							})}
							onChange={onChange}
						/>

						{/* Icon end placement */}
						{icon && iconDirection === "end" && type !== "password" && (
							<div className="pointer-events-none absolute inset-0 left-auto mr-3 flex items-center">
								{LucideIcon ? <Icon name={icon} size={20} /> : null}
							</div>
						)}

						{type === "password" && (
							<button
								type="button"
								tabIndex={-1}
								onClick={() => setShowPassword((prev) => !prev)}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
							>
								{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
							</button>
						)}
					</div>
				</div>
			</div>
			{resolvedErrorMessage ? (
				<p className="pl-4 text-xs italic text-danger-500">{resolvedErrorMessage}</p>
			) : null}
		</div>
	);
};

export default InputForm;
