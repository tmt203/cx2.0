"use client";

import clsx from "clsx";
import { FilterItem } from "@components/shared/molecules";
import type { FilterItemConfig } from "@components/shared/molecules/FilterItem";

export interface FilterProps {
	className?: string;
	param: Record<string, any>;
	filters: Record<string, FilterItemConfig>;
	onFilter: () => void;
	onParamChange: (value: Record<string, any>) => void;
}

/**
 * Filter Component
 * @props FilterProps
 */
const Filter = ({ className, filters, param, onFilter, onParamChange }: FilterProps) => {
	return (
		<div className={clsx(className, "flex flex-wrap gap-2.5", {})}>
			{Object.entries(filters).map(([key, value], index) => (
				<div id={key} key={`${key}-${index}`} className="relative w-fit">
					<FilterItem
						key={key}
						value={value}
						param={param}
						keyFilter={key}
						filters={filters}
						onFilter={onFilter}
						onParamChange={onParamChange}
					/>
				</div>
			))}
		</div>
	);
};

export default Filter;
