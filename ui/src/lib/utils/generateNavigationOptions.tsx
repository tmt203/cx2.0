import { Option, SymbolType } from "@type/component/pagination.type";

/**
 * Generate limited options
 * @param pageSize number
 * @param totalCurrentItems number
 * @param currentPage number
 * @returns Option[]
 */
const generateLimitedOptions = ({
	totalPages,
	currentPage,
	limit = 1,
}: {
	totalPages: number;
	currentPage: number;
	limit?: number;
}): Option[] => {
	const boundarySize = limit * 2 + 2;
	const firstBoundary = 1 + boundarySize;
	const lastBoundary = totalPages - boundarySize;
	const totalShownPages = firstBoundary + 2;

	if (currentPage <= firstBoundary - limit) {
		return Array(totalShownPages)
			.fill(null)
			.map((_, index) => {
				if (index === totalShownPages - 1) {
					return {
						type: "number",
						value: totalPages,
						symbol: SymbolType.NUMBER,
					};
				} else if (index === totalShownPages - 2) {
					return {
						type: "symbol",
						symbol: SymbolType.ELLIPSIS,
						value: firstBoundary + 1,
					};
				}
				return {
					type: "number",
					value: index + 1,
					symbol: SymbolType.NUMBER,
				};
			});
	} else if (currentPage >= lastBoundary + limit) {
		return Array(totalShownPages)
			.fill(null)
			.map((_, index) => {
				if (index === 0) {
					return {
						type: "number",
						value: 1,
						symbol: SymbolType.NUMBER,
					};
				} else if (index === 1) {
					return {
						type: "symbol",
						symbol: SymbolType.ELLIPSIS,
						value: lastBoundary - 1,
					};
				}
				return {
					type: "number",
					value: lastBoundary + index - 2,
					symbol: SymbolType.NUMBER,
				};
			});
	} else if (currentPage >= firstBoundary - limit && currentPage <= lastBoundary + limit) {
		return Array(totalShownPages)
			.fill(null)
			.map((_, index) => {
				if (index === 0) {
					return {
						type: "number",
						value: 1,
						symbol: SymbolType.NUMBER,
					};
				} else if (index === 1) {
					return {
						type: "symbol",
						symbol: SymbolType.ELLIPSIS,
						value: currentPage - limit + (index - 2),
					};
				} else if (index === totalShownPages - 1) {
					return {
						type: "number",
						value: totalPages,
						symbol: SymbolType.NUMBER,
					};
				} else if (index === totalShownPages - 2) {
					return {
						type: "symbol",
						symbol: SymbolType.ELLIPSIS,
						value: currentPage + limit + 1,
					};
				}
				return {
					type: "number",
					value: currentPage - limit + (index - 2),
					symbol: SymbolType.NUMBER,
				};
			});
	}
	return [];
};

/**
 * Add step for pagination
 * @param options Option[]
 * @param currentPage number
 * @returns Option[]
 */
const addStepOptions = ({
	options,
	currentPage,
	totalPages,
}: {
	options: Option[];
	currentPage: number;
	totalPages: number;
}): Option[] => {
	return [
		{
			type: "symbol",
			symbol: SymbolType.PREVIOUS_PAGE,
			value: currentPage <= 1 ? 1 : currentPage - 1,
		},
		...(options || []),
		{
			type: "symbol",
			symbol: SymbolType.NEXT_PAGE,
			value: currentPage >= totalPages ? totalPages : currentPage + 1,
		},
	];
};

/**
 * Get limit threshold
 * @param limit number
 * @returns number
 */
const getLimitThreshold = (limit: number) => {
	const maximumUnlimitedPages = 3;
	const numberOfBoundaryPages = 2;
	return limit * 2 + maximumUnlimitedPages + numberOfBoundaryPages;
};

/**
 * Generate unlimited options
 * @param totalPages number
 * @returns Option[]
 */
const generateUnlimitedOptions = (totalPages: number): Option[] => {
	return new Array(totalPages).fill(null).map((_, index) => ({
		type: "number",
		value: index + 1,
		symbol: SymbolType.NUMBER,
	}));
};

/**
 * Generate navigation options
 * @param totalCurrentItems number
 * @param pageSize number
 * @param currentPage number
 * @returns Option[]
 */
export const generateNavigationOptions = ({
	totalItems = 0,
	pageSize = 50,
	currentPage = 1,
	limit = 1,
}: {
	totalItems: number;
	pageSize: number;
	currentPage: number;
	limit?: number;
}) => {
	const totalPages = Math.ceil(totalItems / pageSize);
	const limited = limit && totalPages > getLimitThreshold(limit);

	const options = limited
		? generateLimitedOptions({ totalPages, currentPage })
		: generateUnlimitedOptions(totalPages);
	return addStepOptions({ options, currentPage, totalPages });
};
