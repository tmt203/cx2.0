"use client";

import { Calendar, FilterSelect, Icon, Tooltip } from "@components/shared/atoms";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { SearchParams, SelectOption } from "@type/common.type";
import { format, formatISO } from "date-fns";
import * as LucideIcons from "lucide-react";
import { useTranslations } from "next-intl";
import { ChangeEvent, KeyboardEvent, MouseEvent, useCallback, useMemo, useState } from "react";
import { DateRange } from "react-day-picker";

export type FilterType =
	| "text"
	| "select"
	| "multiple"
	| "date"
	| "number"
	| "range-number"
	| "address";

export interface FilterItemConfig {
	errorMessage?: {
		title: string;
		message: string;
	};
	icon: keyof typeof LucideIcons;
	keyStart?: string;
	keyEnd?: string;
	name: string;
	options?: SelectOption[];
	type: FilterType;
	validPattern?: RegExp;
	isLoading?: boolean;
	disabled?: boolean;
	format?: string;
	loadMore?: boolean;
	noTranslate?: boolean;
	tooltip?: string;
	noRemove?: boolean;
	onChange?: (value: number | string) => void;
	onDebounceFilter?: (param: SearchParams) => void;
}

export interface FilterItemProps {
	keyFilter: string;
	value: FilterItemConfig;
	filters: Record<string, FilterItemConfig>;
	param: Record<string, any>;
	onFilter: () => void;
	onParamChange: (value: Record<string, any>) => void;
}

/**
 * Filter Item Component
 * @props FilterProps
 */
const FilterItem = ({
	keyFilter,
	value,
	filters,
	param,
	onFilter,
	onParamChange,
}: FilterItemProps) => {
	const t = useTranslations();

	const [open, setOpen] = useState<boolean>(false);
	const [searchValue, setSearchValue] = useState<string>("");

	// Get selected option
	const getSelectedOptions = useMemo(
		() => (item: string, key: string) => {
			return filters[key].options?.find((option) => option.value === item);
		},
		[filters]
	);

	/**
	 * Get label
	 * @param key string
	 * @param type FilterType
	 */
	const getLabel = useMemo(
		() => (key: string, type: FilterType) => {
			let value = param[key];
			const keyStart = filters[key]?.keyStart ?? "";
			const keyEnd = filters[key]?.keyEnd ?? "";
			if (type === "date") {
				const startDate = param[keyStart] && format(new Date(param[keyStart]), "dd/MM/yyyy");
				const endDate = param[keyEnd] && format(new Date(param[keyEnd]), "dd/MM/yyyy");
				value = `${startDate}-${endDate}`;
			} else if (type === "range-number") {
				value = `${param[keyStart]}-${param[keyEnd]}`;
			} else if (type === "multiple") {
				let selectedList = (value ?? []).split(",") as string[];
				selectedList = selectedList.map((item) => {
					const selectedOption = getSelectedOptions(item, key);
					if (!selectedOption) return "";
					return selectedOption.noTranslate ? selectedOption.label : t(selectedOption.label);
				});
				value = selectedList.join(", ");
			} else if (type === "select") {
				const selectedOption = filters[key].options?.find((item) => item.value === value);
				if (selectedOption) {
					value = selectedOption.noTranslate ? selectedOption.label : t(selectedOption.label);
				} else {
					value = "";
				}
			}

			return value;
		},
		[param, filters, getSelectedOptions]
	);

	/**
	 * Handle Input Filter change (Filter type `text` | `number` | `range-number`)
	 * @param key string
	 * @param event ChangeEvent
	 */
	const handleChangeFilter = useCallback(
		(key: string) => (event: ChangeEvent) => {
			const target = event.target as HTMLInputElement;
			if (!target) return;
			const value = target.value;
			const newParam = {
				...param,
				[key]: value,
			};
			onParamChange(newParam);
		},
		[param, onParamChange]
	);

	/**
	 * Handle Multi Filter change
	 * @param key string
	 * @param value string
	 * @param event ChangeEvent<HTMLInputElement>
	 */
	const handleMultiFilterChange = useCallback(
		(key: string, value: string) => (event: ChangeEvent<HTMLInputElement>) => {
			let newValue: string[] = [];
			const target = event.target;
			const listParam = param[key] ? param[key].split(",") : [];
			const addNewValue = [...listParam, value];
			const removeExistValue = listParam.filter((item: string) => item !== value);
			if (!target) return;
			newValue = target.checked ? addNewValue : removeExistValue;
			const newParam = {
				...param,
				[key]: newValue.join(","),
			};

			onParamChange(newParam);
		},
		[param, onParamChange]
	);

	/**
	 * Handle Single Filter change
	 * @param key string
	 * @param value string
	 * @param event ChangeEvent
	 */
	const handleSingleFilterChange = useCallback(
		(key: string, value: string) => (event: ChangeEvent) => {
			const target = event.target as HTMLInputElement;
			if (!target?.checked) return;
			const newParam = {
				...param,
				[key]: value,
			};

			onParamChange(newParam);
		},
		[param, onParamChange]
	);

	/**
	 * Handle Date Filter change
	 * @param key string
	 * @param date DateRange
	 */
	const handleDateFilterChange = useCallback(
		(key: string) => (data?: DateRange) => {
			if (!data) return;
			let newParam: Record<string, any>;
			if (!data.from || !data.to) {
				newParam = Object.entries(param).filter(([keyParam, _]) => keyParam !== key);
			} else {
				newParam = {
					...param,
					[`${filters[key].keyStart}`]: formatISO(data.from, { representation: "complete" }),
					[`${filters[key].keyEnd}`]: formatISO(new Date(data.to).setHours(23, 59, 59, 999), {
						representation: "complete",
					}),
				};
			}

			onParamChange(newParam);
		},
		[param, onParamChange]
	);

	/**
	 * Handle run Filter
	 * @param close void
	 */
	const handleFilterData = useCallback(() => {
		onFilter && onFilter();
		setOpen(false);
	}, [onFilter]);

	/**
	 * Handle clear data filter
	 * @param key string
	 * @param type FilterType
	 */
	const handleClearDataFilter = useCallback(
		(key: string, type: FilterType) => (event: MouseEvent) => {
			event.stopPropagation();
			let newParam = { ...param };

			if (type === "date" || type === "range-number") {
				const keyStart = filters[key]?.keyStart ?? "";
				const keyEnd = filters[key]?.keyEnd ?? "";
				newParam = {
					...newParam,
					[keyStart]: "",
					[keyEnd]: "",
				};
			} else {
				newParam = {
					...newParam,
					[key]: "",
				};
			}

			// Remove empty/null/undefined param
			newParam = Object.fromEntries(Object.entries(newParam).filter(([_key, value]) => value));
			onParamChange(newParam);
			onFilter && onFilter();
		},
		[param, onFilter, onParamChange]
	);

	/**
	 * Handle Keydown for run Filter
	 * @param close () => void
	 * @param event KeyboardEvent<HTMLInputElement>
	 */
	const handleKeydownFilter = useCallback(
		(event: KeyboardEvent<HTMLInputElement>) => {
			if (event.key === "Enter") {
				onFilter && onFilter();
				setOpen(false);
			}
		},
		[onFilter]
	);

	return (
		<>
			<Popover key={keyFilter} defaultOpen={open} open={open} onOpenChange={setOpen}>
				<PopoverTrigger
					disabled={value.disabled}
					className="btn h-8 whitespace-nowrap rounded-md border border-gray-200 bg-white px-2 py-1 text-sm shadow hover:border-gray-300 hover:text-gray-800 hover:brightness-105 focus-visible:outline-0 active:scale-x-95 active:scale-y-95 active:brightness-90 disabled:bg-surface-300 dark:border-surface-400/30 dark:bg-surface-300/5 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-gray-100"
				>
					<div className="flex items-center gap-1">
						<Icon size={14} name={value.icon} />
						{value.noTranslate ? value.name : t(value.name)}
					</div>

					<span className="text-sm italic text-primary-500">
						{param[keyFilter] ||
						param[`${filters[keyFilter]?.keyStart}`] ||
						param[`${filters[keyFilter]?.keyEnd}`] ? (
							<span className="inline-flex items-center gap-1">
								{getLabel(keyFilter, value.type) && (
									<>
										<span>: {getLabel(keyFilter, value.type)}</span>
										{!value.disabled && !value.noRemove && (
											<LucideIcons.CircleXIcon
												size={14}
												aria-label="Clear filter"
												stroke="white"
												className="fill-primary-500 dark:stroke-gray-700/60"
												onClick={handleClearDataFilter(keyFilter, value.type)}
											/>
										)}
									</>
								)}
							</span>
						) : (
							""
						)}
					</span>
				</PopoverTrigger>

				<PopoverContent className="z-[1070] mt-2 min-w-52 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-surface-400/30 dark:bg-gray-800">
					<>
						{/* Area: Filter Label */}
						<div className="px-3 pb-2 pt-1.5 text-xs font-semibold uppercase text-gray-400 dark:text-gray-500">
							{value.noTranslate ? value.name : t(value.name)}
						</div>

						{/* Search Input */}
						<FilterSelect
							open={open}
							value={value}
							param={param}
							keyFilter={keyFilter}
							searchValue={searchValue}
							onSearchValueChange={setSearchValue}
							handleSingleFilterChange={handleSingleFilterChange}
							handleMultiFilterChange={handleMultiFilterChange}
						/>

						{/* Area: Type Filter Text */}
						{value.type === "text" && (
							<div className="flex justify-center px-3 py-2">
								<input
									type="text"
									disabled={value.disabled}
									className="form-input w-full"
									defaultValue={`${param[keyFilter] ?? ""}`}
									onChange={handleChangeFilter(keyFilter)}
									onKeyDown={handleKeydownFilter}
								/>
							</div>
						)}

						{/* Area: Type Filter Number */}
						{value.type === "number" && (
							<div className="flex justify-center px-3 py-2">
								<input
									type="number"
									disabled={value.disabled}
									className="form-input w-full"
									defaultValue={Number(param[keyFilter] ?? 0)}
									onChange={handleChangeFilter(keyFilter)}
									onKeyDown={handleKeydownFilter}
								/>
							</div>
						)}

						{/* Area: Type Filter Range Number */}
						{value.type === "range-number" && (
							<div className="flex items-center justify-center gap-2 px-3 py-2">
								<input
									type="number"
									name={value.keyStart}
									disabled={value.disabled}
									className="form-input w-32"
									defaultValue={Number(param[`${value.keyStart}`] ?? 0)}
									onChange={handleChangeFilter(`${value.keyStart}`)}
								/>

								<span>-</span>

								<input
									type="number"
									name={value.keyEnd}
									disabled={value.disabled}
									className="form-input w-32"
									defaultValue={Number(param[`${value.keyEnd}`] ?? 0)}
									onChange={handleChangeFilter(`${value.keyEnd}`)}
									onKeyDown={handleKeydownFilter}
								/>
							</div>
						)}

						{value.type === "date" && value.keyStart && value.keyEnd && (
							<div className="">
								<Calendar
									mode="range"
									numberOfMonths={2}
									disabled={value.disabled}
									selected={{
										from: param[value.keyStart],
										to: param[value.keyEnd],
									}}
									footer={
										param[value.keyEnd] && param[value.keyStart]
											? `${t("filter_component.selected")}: ${format(param[value.keyStart], "dd/MM/yyyy")}-${format(param[value.keyEnd], "dd/MM/yyyy")}`
											: `${t("filter_component.pick_date")}`
									}
									onSelect={handleDateFilterChange(keyFilter)}
								/>
							</div>
						)}

						<div className="border-t border-gray-200 bg-gray-50 px-3 py-2 dark:border-surface-400/30 dark:bg-gray-700/20">
							<ul className="flex items-center justify-between">
								{!value.noRemove && (
									<li>
										<button
											className="btn-xs min-w-20 text-nowrap border border-surface-700 bg-white px-3 text-surface-900 hover:brightness-105 active:scale-x-95 active:scale-y-95 active:brightness-90 dark:border-surface-400/30 dark:bg-surface-300/5 dark:text-white"
											onClick={handleClearDataFilter(keyFilter, value.type)}
										>
											{t("form.clear")}
										</button>
									</li>
								)}
								<li>
									<button
										type="button"
										className="btn-xs min-w-20 text-nowrap bg-secondary-500 px-3 text-white hover:brightness-105 active:scale-x-95 active:scale-y-95 active:brightness-90"
										onClick={handleFilterData}
									>
										{t("form.apply")}
									</button>
								</li>
							</ul>
						</div>
					</>
				</PopoverContent>
			</Popover>

			{/* Area: Message Tooltip */}
			{value.tooltip && (
				<Tooltip size="lg" content={<span className="whitespace-normal">{value.tooltip}</span>}>
					<LucideIcons.Info size={16} className="ml-1 fill-gray-400 stroke-white" />
				</Tooltip>
			)}
		</>
	);
};

export default FilterItem;
