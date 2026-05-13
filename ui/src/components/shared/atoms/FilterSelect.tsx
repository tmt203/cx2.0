import { SearchParams } from "@type/common.type";
import { Loader } from "lucide-react";
import { useTranslations } from "next-intl";
import { ChangeEvent, ChangeEventHandler, useCallback, useEffect, useMemo, useState } from "react";
import { FilterItemConfig } from "../molecules/FilterItem";

export interface FilterSelectProps {
	param: Record<string, any>;
	value: FilterItemConfig;
	searchValue?: string;
	keyFilter: string;
	open?: boolean;
	onSearchValueChange?: (value: string) => void;
	handleSingleFilterChange: (key: string, value: string) => ChangeEventHandler<HTMLInputElement>;
	handleMultiFilterChange: (key: string, value: string) => ChangeEventHandler<HTMLInputElement>;
}

/**
 * Search Input Component
 * @param open boolean
 * @param value FilterItemConfig
 */
const FilterSelect = ({
	value,
	param,
	searchValue,
	open = false,
	keyFilter = "",
	handleSingleFilterChange,
	handleMultiFilterChange,
	onSearchValueChange,
}: FilterSelectProps) => {
	// Hooks
	const t = useTranslations();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [searchParams, setSearchParams] = useState<SearchParams>({
		searchOffset: 0,
		limit: 0,
		key: "",
	});

	const checkedOptions = useMemo(() => {
		return new Set(param[keyFilter]?.split(",") ?? []);
	}, [param, keyFilter]);

	/**
	 * Handle debounce filter
	 * @param event ChangeEvent<HTMLInputElement>
	 */
	const handleDebounceFilter = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			const target = event.target;
			const { value: dataSearch } = target;
			onSearchValueChange && onSearchValueChange(dataSearch);
			const newParams: SearchParams = {
				...searchParams,
				key: dataSearch,
				searchOffset: 0,
			};

			setSearchParams(newParams);
			value.onDebounceFilter && value.onDebounceFilter(newParams);
		},
		[value.onDebounceFilter, onSearchValueChange]
	);

	/**
	 * Handle load more
	 */
	const handleLoadMore = useCallback(() => {
		const newParams: SearchParams = {
			...searchParams,
			searchOffset: searchParams.searchOffset + 10,
		};
		setSearchParams(newParams);
		value.onDebounceFilter && value.onDebounceFilter(newParams);
	}, [value.onDebounceFilter, searchParams]);

	// Update loading state
	useEffect(() => {
		if (!value.options) return;
		if (searchParams.searchOffset >= value.options?.length) {
			setIsLoading(true);
		} else {
			setIsLoading(false);
		}
	}, [value.options, searchParams.searchOffset]);

	// Update loading state when open
	useEffect(() => {
		if (open && value.onDebounceFilter) {
			if (!value.options) return;
			if (searchParams.searchOffset >= value.options?.length) {
				setIsLoading(true);
			} else {
				setIsLoading(false);
			}
		}
	}, [open]);

	return (
		<>
			{/* Area: Search Input */}
			{value.onDebounceFilter && (
				<div className="relative px-3 pb-2">
					{/* Area: Input  */}
					<input
						id={keyFilter}
						name={keyFilter}
						key={keyFilter}
						type="text"
						value={searchValue}
						autoComplete="off"
						placeholder={`${t("filter_component.search")}...`}
						className="form-input h-8 w-full pr-9 text-base"
						onChange={handleDebounceFilter}
					/>

					{/* Icon end placement */}
					<div className="pointer-events-none absolute inset-0 left-auto ml-3 flex items-center">
						{value.isLoading ? (
							<div className="mr-2">
								<Loader className="shrink-0 animate-spin" size={20} />
							</div>
						) : null}
					</div>
				</div>
			)}

			{/* Area: Filter select */}
			{value.type === "select" && value.options && (
				<ul className="scrollbar-thin max-h-60 overflow-auto">
					{value.options.length ? (
						value.options.map((option, optionIndex) => (
							<li key={`${option.value}-${optionIndex}`} className="px-3 py-1">
								<label className="flex items-center">
									<input
										type="radio"
										className="form-radio"
										name={keyFilter}
										checked={param[keyFilter] === option.value}
										onChange={handleSingleFilterChange(keyFilter, option.value)}
									/>
									<span className="ml-2 text-nowrap text-sm font-medium">
										{option.noTranslate ? option.label : t(option.label)}
									</span>
								</label>
							</li>
						))
					) : (
						<li className="mt-2 text-center text-sm">{t("filter_component.no_data")}</li>
					)}
				</ul>
			)}

			{/* Area: Filter Multi */}
			{value.type === "multiple" && value.options && (
				<ul className="scrollbar-thin max-h-60 overflow-auto">
					{value.options.length ? (
						value.options.map((option, optionIndex) => (
							<li key={`${option.value}-${optionIndex}`} className="px-3 py-1">
								<label className="flex items-center">
									<input
										type="checkbox"
										className="form-checkbox"
										checked={checkedOptions.has(option.value)}
										onChange={handleMultiFilterChange(keyFilter, option.value)}
									/>
									<span className="ml-2 text-nowrap text-sm font-medium">
										{option.noTranslate ? option.label : t(option.label)}
									</span>
								</label>
							</li>
						))
					) : (
						<li className="mt-2 text-center text-sm">{t("filter_component.no_data")}</li>
					)}
				</ul>
			)}

			{/* Area: Load More Button */}
			{value.onDebounceFilter && (
				<div className="flex items-center justify-center">
					{value.loadMore &&
						(isLoading ? (
							<Loader className="shrink-0 animate-spin" size={20} />
						) : (
							<button
								onClick={handleLoadMore}
								className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500"
							>
								{t("filter_component.load_more")}
							</button>
						))}
				</div>
			)}
		</>
	);
};

export default FilterSelect;
