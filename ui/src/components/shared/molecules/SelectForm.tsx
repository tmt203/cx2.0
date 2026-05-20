"use client";

import { Display, Placement, SelectOption, Size } from "@/src/lib/type/common.type";
import clsx from "clsx";
import * as LucideIcons from "lucide-react";
import { Asterisk, Info } from "lucide-react";
import { DetailedHTMLProps, SelectHTMLAttributes, useCallback, useMemo } from "react";
import Select, { GroupBase, MultiValueGenericProps } from "react-select";
import { useTranslations } from "use-intl";
import Icon from "../atoms/Icon";
import Tooltip from "../atoms/Tooltip";

export interface SelectFormProps extends Omit<
	DetailedHTMLProps<SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>,
	"size"
> {
	size?: Size;
	label?: string;
	options: SelectOption[];
	feedback?: string;
	state?: "default" | "error" | "success" | "warning";
	placement?: Display;
	errorMessage?: string;
	errorMessageValues?: Record<string, string | number>;
	noTranslateErrorMessage?: boolean;
	placeholder?: string;
	noTranslateLabel?: boolean;
	icon?: keyof typeof LucideIcons;
	iconDirection?: Omit<Placement, "center">;
}

/**
 * MultiValueLabel
 * @props MultiValueGenericProps<SelectOption, true, GroupBase<SelectOption>> & { options: SelectOption[] }
 */
const MultiValueLabel = ({
	data,
	options,
}: MultiValueGenericProps<SelectOption, true, GroupBase<SelectOption>> & {
	options: SelectOption[];
}) => {
	// Hooks
	const t = useTranslations();

	const value = useMemo(
		() => options.find((option: SelectOption) => option.value === data.value),
		[options, data.value]
	);
	return <div>{value?.noTranslate ? value.label : t(value?.label)}</div>;
};

/**
 * Select Form component
 * @props SelectFormProps
 */
const SelectForm = ({
	icon,
	value,
	disabled,
	className,
	placeholder,
	label = "",
	size = "md",
	options = [],
	feedback = "",
	required = false,
	state = "default",
	placement = "col",
	errorMessage = "",
	errorMessageValues,
	noTranslateErrorMessage = false,
	noTranslateLabel = false,
	iconDirection = "start",
	...props
}: SelectFormProps) => {
	// Hooks
	const t = useTranslations();

	const resolvedErrorMessage = errorMessage
		? noTranslateErrorMessage
			? errorMessage
			: t(errorMessage, errorMessageValues)
		: "";

	const LucideIcon = useMemo(() => {
		if (!icon) return null;
		return LucideIcons[icon];
	}, [icon]);

	/**
	 * Process multi-select values to format required by react-select
	 * @param currentValue string | number | readonly string[] | undefined
	 * @param availableOptions SelectOption[]
	 */
	const processMultiSelectValues = useMemo(() => {
		return (
			currentValue: string | number | readonly string[] | undefined,
			availableOptions: SelectOption[]
		) => {
			if (!Array.isArray(currentValue)) return null;

			return availableOptions
				.filter((option) => currentValue.includes(option.value))
				.map((option) => ({
					value: option.value,
					label: option.noTranslate ? option.label : t(option.label),
				}));
		};
	}, [t]);

	/**
	 * Maps options array to format required by react-select
	 * @param optionsArray SelectOption[]
	 */
	const mapSelectOptions = useMemo(() => {
		return (optionsArray: SelectOption[]) => {
			return optionsArray.map((option) => ({
				value: option.value,
				label: option.noTranslate ? option.label : t(option.label),
			}));
		};
	}, [t]);

	/**
	 * Handle multi select change
	 * @param selectedOptions The selected options from react-select
	 */
	const handleMultiSelectChange = (
		selectedOptions: readonly { value: string; label: string }[]
	) => {
		const selectedValues = selectedOptions.map((option) => option.value);

		if (props.onChange) {
			const simulatedEvent = {
				target: {
					name: props.name,
					value: selectedValues,
				},
			} as unknown as React.ChangeEvent<HTMLSelectElement>;

			props.onChange(simulatedEvent);
		}
	};

	/**
	 * Handle multi value label
	 * @param props MultiValueGenericProps<SelectOption, true, GroupBase<SelectOption>>
	 */
	const handleMultiValueLabel = useCallback(
		(props: MultiValueGenericProps<SelectOption, true, GroupBase<SelectOption>>) => (
			<MultiValueLabel {...props} options={options} />
		),
		[options]
	);

	return (
		<div className={clsx("flex w-full flex-col gap-1", className)}>
			<div className={clsx("flex w-full items-center justify-center gap-2")}>
				<div
					className={clsx("flex w-full gap-2", {
						"flex-col": placement === "col",
						"flex-row items-center": placement === "row",
					})}
				>
					{/* Label */}
					{label && (
						<div className="flex gap-2">
							<label className="flex whitespace-nowrap text-base font-semibold">
								{noTranslateLabel ? label : t(label)}{" "}
								{required && <Asterisk size={12} className="text-danger-500" />}
							</label>
							{feedback && (
								<Tooltip content={feedback} size="full">
									<Info size={16} className="text-info-500" />
								</Tooltip>
							)}
						</div>
					)}

					<div className="relative w-full pl-4">
						{/* Icon start placement */}
						{icon && iconDirection === "start" && (
							<div className="pointer-events-none absolute inset-0 right-auto ml-2 flex items-center">
								{LucideIcon ? <Icon name={icon} size={20} /> : null}
							</div>
						)}

						{/* Select Element */}
						{props.multiple ? (
							<Select
								isMulti
								options={mapSelectOptions(options)}
								value={processMultiSelectValues(value, options)}
								placeholder={placeholder}
								components={{
									MultiValueLabel: handleMultiValueLabel,
								}}
								classNames={{
									control: () =>
										clsx(
											"w-full h-fit p-0 bg-white !border-gray-200 dark:bg-gray-900/30 dark:!disabled:bg-gray-700/30 dark:!disabled:border-gray-700 dark:!disabled:hover:border-gray-700 hover:!border-gray-300 focus:!border-gray-300 dark:!border-surface-400/30 dark:!hover:border-gray-600 dark:!focus:border-gray-600 !shadow-sm !rounded-lg",
											"[&>div]:-mt-[1px] [&_#react-select-3-placeholder]:!not-italic",
											{
												"text-gray-300 italic": !value?.toString(),
												"border-danger-500 focus:!border-danger-500 hover:!border-danger-300 dark:border-danger-500":
													errorMessage || state === "error",
												"border-success-500 focus:!border-success-500 hover:!border-success-300 dark:border-success-500":
													state === "success",
												"border-warning-500 focus:!border-warning-500 hover:!border-warning-300 dark:border-warning-500":
													state === "warning",
												"dark:disabled:placeholder:text-gray-600 disabled:border-gray-200 dark:disabled:border-gray-700 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-600 disabled:cursor-not-allowed shadow-none":
													disabled,
												"pl-9": icon && iconDirection === "start",
												"pr-9": icon && iconDirection === "end",
												"!min-h-6 text-sm": size === "2xs",
												"!min-h-7 text-base": size === "xs",
												"!min-h-8 text-base": size === "sm",
												"!min-h-9 text-base": size === "md",
												"!min-h-10 text-base": size === "lg",
												"!min-h-11 text-lg": size === "xl",
												"!min-h-12 text-xl": size === "2xl",
											}
										),
									input: () =>
										"[&_input]:![box-shadow:none] [&>input]:!outline-none [&>input::placeholder]:!text-gray-300 [&>input]:focus:!outline-none [&>input]:focus:!ring-0 [&>input]:focus:!border-transparent !text-gray-800 dark:!text-gray-100",
								}}
								onChange={handleMultiSelectChange}
							/>
						) : (
							<select
								{...props}
								value={value}
								disabled={disabled}
								className={clsx("form-select w-full py-0.5", {
									"italic text-gray-300": !value?.toString(),
									"border-danger-500 hover:!border-danger-300 focus:!border-danger-500 dark:border-danger-500":
										errorMessage || state === "error",
									"border-success-500 hover:!border-success-300 focus:!border-success-500 dark:border-success-500":
										state === "success",
									"border-warning-500 hover:!border-warning-300 focus:!border-warning-500 dark:border-warning-500":
										state === "warning",
									"shadow-none disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400 dark:disabled:border-gray-700 dark:disabled:bg-gray-800 dark:disabled:text-gray-600 dark:disabled:placeholder:text-gray-600":
										disabled,
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
							>
								{placeholder && (
									<option key="empty-option" value="" className="italic text-gray-300">
										{placeholder}
									</option>
								)}
								{options.map((option) => (
									<option key={option.value} value={option.value} className="text-surface-900">
										{option.noTranslate ? option.label : t(option.label)}
									</option>
								))}
							</select>
						)}

						{/* Icon end placement */}
						{icon && iconDirection === "end" && (
							<div className="pointer-events-none absolute inset-0 left-auto mr-3 flex items-center">
								{LucideIcon ? <Icon name={icon} size={20} /> : null}
							</div>
						)}
					</div>
				</div>
			</div>
			{resolvedErrorMessage ? (
				<p className="pl-4 text-sm italic text-danger-500">{resolvedErrorMessage}</p>
			) : null}
		</div>
	);
};

export default SelectForm;
