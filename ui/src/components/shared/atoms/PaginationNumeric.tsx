"use client";

import { SymbolType } from "@type/component/pagination.type";
import { generateNavigationOptions } from "@utils/generateNavigationOptions";
import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useMemo } from "react";

export interface PaginationNumericProps {
	totalItems?: number;
	pageSize?: number;
	currentPage?: number;
	setPage?: (page: number) => void;
}

/**
 * Pagination Numeric Component
 * @props PaginationNumericProps
 */
const PaginationNumeric = ({
	totalItems = 0,
	pageSize = 50,
	currentPage = 1,
	setPage,
}: PaginationNumericProps) => {
	const totalPages = useMemo(() => Math.ceil(totalItems / pageSize), [totalItems, pageSize]);
	const options = useMemo(() => {
		const list = generateNavigationOptions({
			pageSize,
			currentPage,
			totalItems,
		});
		return list;
	}, [pageSize, currentPage, totalItems]);

	/**
	 * Handle set page
	 * @param page number
	 */
	const handleSetPage = useCallback(
		(page: number) => () => {
			setPage && setPage(page);
		},
		[setPage]
	);

	return (
		<>
			{/* Area: Pagination */}
			<nav className="flex" role="navigation" aria-label="Navigation">
				{/* Area: Previous Button */}
				<div className="mr-2">
					<button
						type="button"
						className={clsx(
							"inline-flex items-center justify-center rounded-lg bg-white px-2.5 py-2 leading-5",
							"border border-gray-200 dark:border-surface-400/30 dark:bg-surface-300/5",
							{
								"text-gray-300 dark:text-gray-600": currentPage === 1,
								"text-primary-500 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-900":
									currentPage > 1,
							}
						)}
						onClick={handleSetPage(currentPage - 1)}
						disabled={currentPage === 1}
						aria-label="Previous"
					>
						<span className="sr-only">Previous</span>
						<wbr />
						<ChevronLeft size={16} strokeWidth={currentPage > 1 ? 2.5 : 2} />
					</button>
				</div>

				{/* Area: Pagination Number */}
				<ul className="inline-flex -space-x-px rounded-lg text-sm font-medium shadow-sm">
					{options.map((item, index) => {
						return (
							<li key={`${item.value}-${item.type}-${item.symbol}`}>
								{![SymbolType.NEXT_PAGE, SymbolType.PREVIOUS_PAGE].includes(item.symbol) &&
									(item.symbol === SymbolType.NUMBER ? (
										<button
											type="button"
											className={clsx(
												"inline-flex cursor-pointer items-center justify-center bg-white px-3.5 py-2 leading-5 hover:bg-gray-50",
												"border border-gray-200 dark:border-surface-400/30 dark:bg-surface-300/5 dark:hover:bg-gray-900",
												{
													"rounded-l-lg": index === 1,
													"rounded-r-lg": index === options.length - 2,
													"font-semibold text-primary-500":
														item.type === "number" && item.value === currentPage,
												}
											)}
											onClick={handleSetPage(item.value)}
										>
											{item.value}
										</button>
									) : (
										<button
											type="button"
											className="inline-flex cursor-pointer items-center justify-center border border-gray-200 bg-white px-3.5 py-2 leading-5 hover:bg-gray-50 dark:border-surface-400/30 dark:bg-surface-300/5 dark:hover:bg-gray-900"
											onClick={handleSetPage(item.value)}
										>
											...
										</button>
									))}
							</li>
						);
					})}
				</ul>

				{/* Area: Next Button */}
				<div className="ml-2">
					<button
						type="button"
						className={clsx(
							"inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-2.5 py-2 leading-5 dark:border-surface-400/30 dark:bg-surface-300/5",
							{
								"text-gray-300 dark:text-gray-600": currentPage >= totalPages,
								"text-primary-500 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-900":
									currentPage < totalPages,
							}
						)}
						disabled={currentPage >= totalPages}
						aria-label="Next"
						onClick={handleSetPage(currentPage + 1)}
					>
						<span className="sr-only">Next</span>
						<wbr />
						<ChevronRight size={16} strokeWidth={currentPage < totalPages ? 2.5 : 2} />
					</button>
				</div>
			</nav>
		</>
	);
};

export default PaginationNumeric;
