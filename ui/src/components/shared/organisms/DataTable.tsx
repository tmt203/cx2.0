"use client";

import type { ActionColumnOption } from "@components/shared/atoms/TableBody";
import type { TableColumn } from "@type/component/table.type";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { ChangeEvent, useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { TableBody, TableHeader } from "../atoms";

export interface TableRow<T = any> {
	id: T extends Record<string, any> ? T[keyof T] : any;
	[key: string]: T extends Record<string, any> ? T[keyof T] : any;
}

export interface TableProps<T extends TableRow> {
	id: string;
	data: T[];
	pageSize?: number;
	className?: string;
	showIndex?: boolean;
	totalItem?: number;
	showAction?: boolean;
	currentPage?: number;
	selectedAll?: boolean;
	showCheckbox?: boolean;
	dragDropAble?: boolean;
	selectedList?: TableRow[];
	columns: TableColumn<T>[];
	notSelectedList?: TableRow[];
	showActionColumn?: boolean;
	actionColumnOptions?: ActionColumnOption<T>[];
	isLoading?: boolean;
	onSelectAll?: (value: boolean) => void;
	onSelectRow?: (data: TableRow[]) => void;
	onDeselectRow?: (data: TableRow[]) => void;
	onSort?: (columnKey: string, direction: "asc" | "desc") => void;
	onPinColumn?: (columnKey: string) => void;
	onHideColumn?: (columnKey: string) => void;
	onSetSizeColumn?: () => void;
	onLineBreak?: () => void;
}

const DataTable = <T extends TableRow>({
	id,
	data,
	columns,
	className,
	pageSize = 50,
	totalItem = 0,
	currentPage = 1,
	showIndex = true,
	showAction = false,
	selectedList = [],
	selectedAll = false,
	showCheckbox = true,
	dragDropAble = false,
	notSelectedList = [],
	showActionColumn = false,
	actionColumnOptions = [{ label: "form.no_data" }],
	isLoading = false,
	onSelectRow,
	onDeselectRow,
	onSelectAll,
	onSort,
	onPinColumn,
	onHideColumn,
	onSetSizeColumn = () => {},
	onLineBreak = () => {},
}: TableProps<T>) => {
	// Hooks
	const t = useTranslations();

	// State
	const [isSelectedAll, setIsSelectedAll] = useState<boolean>(selectedAll);
	const visibleColumns = useMemo(() => columns.filter((column) => !column.isHidden), [columns]);

	/**
	 * Handle row selected all
	 */
	const handleSelectedAll = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			const target = event.target;
			if (!target) return;
			onSelectAll && onSelectAll(target.checked);
			setIsSelectedAll(target.checked);
			onDeselectRow && onDeselectRow([]);
		},
		[onSelectAll, onDeselectRow]
	);

	/**
	 * Handle selected row
	 * @param row T (Generate type)
	 */
	const handleSelectedRow = useCallback(
		(row: T) => {
			let newSelectedIdList = [];
			let newNotSelectedIdList = [];

			if (isSelectedAll) {
				const isExistNotSelectedList = notSelectedList.some((item) => item.id === row.id);
				if (isExistNotSelectedList) {
					newNotSelectedIdList = notSelectedList.filter((item) => item.id !== row.id);
				} else {
					newNotSelectedIdList = [...notSelectedList, row];
				}
				onDeselectRow && onDeselectRow(newNotSelectedIdList);
			} else {
				const isSelected = selectedList.some((item) => item.id === row.id);
				if (isSelected) {
					newSelectedIdList = selectedList.filter((item) => item.id !== row.id);
				} else {
					newSelectedIdList = [...selectedList, row];
				}
				onSelectRow && onSelectRow(newSelectedIdList);
			}
		},
		[isSelectedAll, selectedList, notSelectedList, onSelectRow]
	);

	/**
	 * Handle resize table
	 */
	const handleResizeTable = useCallback(() => {
		const table = document.querySelector(`div#table-${id}`) as HTMLElement;
		if (!table) return;

		const tableRect = table.getBoundingClientRect();
		const availableHeight = window.innerHeight - tableRect.top - 20;

		// Ensure maxHeight is not negative
		const tableMaxHeight = availableHeight > 0 ? `${availableHeight}px` : "auto";

		// Apply maxHeight
		table.style.maxHeight = tableMaxHeight;
	}, [id]);

	// Set selected all
	useEffect(() => {
		const checkbox = document?.getElementById(`table-${id}-header-checkbox`) as HTMLInputElement;
		if (!checkbox) return;
		if ((isSelectedAll && notSelectedList.length) || (!selectedAll && selectedList.length)) {
			checkbox.checked = false;
			checkbox.indeterminate = true;
		} else if (!isSelectedAll && totalItem && selectedList.length === totalItem) {
			checkbox.checked = true;
		} else {
			checkbox.checked = isSelectedAll;
			checkbox.indeterminate = false;
		}
	}, [isSelectedAll, notSelectedList, selectedList, totalItem]);

	// Resize table when window resize
	useLayoutEffect(() => {
		handleResizeTable();
	}, []);

	// Register event resize window
	useEffect(() => {
		window.addEventListener("resize", handleResizeTable);

		// Remove event resize window
		return () => {
			window.removeEventListener("resize", handleResizeTable);
		};
	}, [handleResizeTable]);

	return (
		<div
			id={`table-${id}`}
			className={clsx(
				"scrollbar-thin scrollbar-track-transparent scrollbar-thumb-surface relative overflow-auto",
				className
			)}
		>
			<table className="w-full table-auto dark:text-gray-300">
				{/* Table header */}
				<TableHeader
					id={id}
					columns={columns}
					showIndex={showIndex}
					showAction={showAction}
					selectedAll={selectedAll}
					dragDropAble={dragDropAble}
					showCheckbox={showCheckbox}
					showActionColumn={showActionColumn}
					onLineBreak={onLineBreak}
					handleSortColumn={onSort}
					handlePinColumn={onPinColumn}
					handleHideColumn={onHideColumn}
					onSetSizeColumn={onSetSizeColumn}
					onSelectAll={handleSelectedAll}
				/>

				{/* Table body */}
				<TableBody
					id={`table-body-${id}`}
					data={data}
					columns={visibleColumns}
					pageSize={pageSize}
					currentPage={currentPage}
					showIndex={showIndex}
					isLoading={isLoading}
					showAction={showAction}
					dragDropAble={dragDropAble}
					showCheckbox={showCheckbox}
					selectedAll={isSelectedAll}
					selectedList={selectedList}
					notSelectedList={notSelectedList}
					showActionColumn={showActionColumn}
					actionColumnOptions={actionColumnOptions}
					onSelectRow={handleSelectedRow}
				/>
			</table>

			{/* Area: Empty State */}
			{!isLoading && !data?.length && (
				<div className="flex w-full justify-center border-b border-gray-100 p-2 text-sm dark:border-surface-400/30">
					{t("table.no_data")}
				</div>
			)}
		</div>
	);
};

export default DataTable;
