"use client";

import { Skeleton, Tooltip } from "@components/shared/atoms";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ColumnType, TableColumn } from "@type/component/table.type";
import { parseToFormat } from "@utils/time";
import clsx from "clsx";
import { Menu as MenuLu } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { Fragment, MouseEvent, useCallback, useMemo, useState } from "react";
import { TableRow } from "../organisms/DataTable";
import Icon from "./Icon";

export interface ActionColumnOption<T> {
	label: string;
	noTranslate?: boolean;
	className?: string;
	icon?: React.ReactNode;
	onClick?: (row: T) => void | Promise<void>;
}

export interface TableBodyProps<T> {
	id: string;
	data: T[];
	columns: TableColumn<T>[];
	showIndex?: boolean;
	showAction?: boolean;
	showCheckbox?: boolean;
	dragDropAble?: boolean;
	selectedAll?: boolean;
	selectedList?: TableRow[];
	notSelectedList?: TableRow[];
	showActionColumn?: boolean;
	isLoading?: boolean;
	pageSize: number;
	currentPage: number;
	actionColumnOptions?: ActionColumnOption<T>[];
	onSelectRow: (row: T) => void;
}

/**
 * Data Cel Component
 */
const DataCell = ({
	keyCell,
	value,
	isLoading,
	textEllipsis,
}: {
	value: any;
	keyCell: string;
	isLoading: boolean;
	textEllipsis?: boolean;
}) => {
	const [isEllipsis, setIsEllipsis] = useState<boolean | undefined>(textEllipsis);

	/**
	 * Handle Display Text
	 */
	const handleDisplayText = useCallback((event: MouseEvent<SVGSVGElement>) => {
		event.stopPropagation();
		setIsEllipsis((prev) => !prev);
	}, []);

	return (
		<>
			<div className="flex items-center">
				{isLoading ? (
					<Skeleton className="!h-[18px]" />
				) : (
					<div
						id={keyCell}
						className={clsx("font-medium text-gray-800 dark:text-gray-100", {
							"max-w-80 overflow-hidden text-ellipsis text-nowrap": isEllipsis,
						})}
					>
						{value}
					</div>
				)}
			</div>
			{textEllipsis && (
				<Icon
					name={isEllipsis ? "Eye" : "EyeOff"}
					size={16}
					className="ml-2 cursor-pointer hover:stroke-primary-500"
					onClick={handleDisplayText}
				/>
			)}
		</>
	);
};

/**
 * Table Body Component
 * @props TableBodyProps<T>
 */
const TableBody = <T extends TableRow>({
	id,
	data,
	columns,
	pageSize,
	currentPage,
	selectedList,
	notSelectedList,
	showIndex = true,
	isLoading = true,
	showAction = true,
	dragDropAble = true,
	showCheckbox = true,
	selectedAll = false,
	showActionColumn = true,
	actionColumnOptions = [],
	onSelectRow,
}: TableBodyProps<T>) => {
	const t = useTranslations();

	const [dataTable, setDataTable] = useState<T[]>(
		Array.from({ length: pageSize }).map((item, index) => {
			return {
				id: `table-skeletons-${item}-${index}`,
			} as T;
		})
	);

	const renderCellValue = useMemo(
		() => (col: TableColumn<T>, row: T) => {
			const value = row[col.key];

			switch (col.dataType) {
				case ColumnType.TEXT:
					return value ?? "-";
				case ColumnType.NUMBER:
					return value ?? 0;
				case ColumnType.BOOLEAN:
					if (value === true) return "True";
					if (value === false) return "False";
					return "-";
				case ColumnType.DATE:
					return parseToFormat(value, "dd/MM/yyyy");
				case ColumnType.DATETIME:
					return parseToFormat(value, "dd/MM/yyyy HH:mm:ss");
				case ColumnType.TIME:
					return parseToFormat(value, "HH:mm:ss");
				case ColumnType.CURRENCY:
					return `${value}`.toLocaleString();
				case ColumnType.ACTION:
					return col.component?.length
						? col.component.map((action, index) => {
								const actionProps =
									typeof action.props === "function" ? action.props(row) : action.props;
								return React.createElement(action.component, {
									...(typeof actionProps === "object" ? actionProps : {}),
									key: `table-${id}-${action.component}-col-${col.key}-action-${index}`,
								});
							})
						: null;
				default:
					return null;
			}
		},
		[data, columns]
	);

	const checkSelected = useMemo(
		() => (row: T) => {
			return (
				(selectedAll && !notSelectedList?.some((item) => item.id === row.id)) ||
				(!selectedAll && selectedList?.some((item) => item.id === row.id))
			);
		},
		[selectedAll, notSelectedList, selectedList]
	);

	useMemo(() => {
		const newData = isLoading ? dataTable : data;
		setDataTable(newData);
	}, [data, dataTable, isLoading]);

	/**
	 * Handle row selected
	 */
	const handleSelectedRow = useCallback(
		(data: T) => () => {
			onSelectRow && onSelectRow(data);
		},
		[onSelectRow]
	);

	/**
	 * Handle action click
	 * @param row T
	 * @param onClick (row: T) => void
	 */
	const handleActionClick = useCallback(
		(row: T, onClick?: (row: T) => void) => () => {
			onClick && onClick(row);
		},
		[]
	);

	return (
		<tbody className="divide-y divide-surface-300 text-sm dark:divide-surface-400/30 dark:text-gray-400">
			{dataTable.map((row, rowIndex) => (
				<tr
					key={`table-${id}row-${rowIndex}`}
					className={clsx(
						"even:bg-gray-50/50 hover:!bg-primary-100/50 dark:even:bg-surface-50/5 [&>td>*>*]:dark:text-surface-400",
						{
							"!bg-primary-100 hover:brightness-105 dark:!bg-primary-100/50 dark:hover:brightness-110":
								!!checkSelected(row),
						}
					)}
				>
					{/* Area: Drag Drop Row Cell */}
					{dragDropAble && (
						<td className="w-px whitespace-nowrap px-2 py-2 first:pl-5 last:pr-5">
							<span className="sr-only">Drag Drop</span>
							<MenuLu size={16} className="cursor-move" />
						</td>
					)}

					{/* Area: Checkbox Cell */}
					{showCheckbox && (
						<td className="w-12 whitespace-nowrap px-2 py-2">
							{isLoading ? (
								<Skeleton className="flex !h-[18px] !w-[18px] items-center justify-center" />
							) : (
								<div className="flex items-center">
									<label className="inline-flex">
										<span className="sr-only">Select all</span>
										<input
											className="form-checkbox cursor-pointer checked:!bg-primary-500"
											type="checkbox"
											checked={!!checkSelected(row)}
											onChange={handleSelectedRow(row)}
										/>
									</label>
								</div>
							)}
						</td>
					)}

					{/* Area: Index Row Cell */}
					{showIndex && (
						<td align="center" className="w-12 whitespace-nowrap px-2 py-2">
							{isLoading ? (
								<Skeleton className="flex !h-[18px] !w-[18px] items-center justify-center" />
							) : (
								<div className="flex items-center justify-center">
									{(currentPage - 1) * pageSize + rowIndex + 1}
								</div>
							)}
						</td>
					)}
					{/*Area: Display Data Row Cell*/}
					{columns.map((col, colIndex) => (
						<Fragment key={`table-${id}-row-${colIndex}-col-${col.key}`}>
							<td
								className={clsx("whitespace-nowrap px-2 py-2 first:pl-5 last:pr-5", col.cellClass)}
							>
								{col.textEllipsis ? (
									<Tooltip
										content={col.dataFormat ? col.dataFormat(row) : renderCellValue(col, row)}
									>
										<DataCell
											textEllipsis
											keyCell={col.key}
											isLoading={isLoading}
											value={col.dataFormat ? col.dataFormat(row) : renderCellValue(col, row)}
										/>
									</Tooltip>
								) : (
									<DataCell
										keyCell={col.key}
										isLoading={isLoading}
										value={col.dataFormat ? col.dataFormat(row) : renderCellValue(col, row)}
									/>
								)}
							</td>
						</Fragment>
					))}

					{showActionColumn && (
						<td className="w-12 whitespace-nowrap px-2 py-2">
							<div className="flex items-center justify-center text-left font-semibold">
								<Menu>
									<MenuButton>
										<span className="sr-only">Menu</span>
										<MenuLu size={16} className="cursor-pointer" />
									</MenuButton>
									<MenuItems
										anchor="bottom end"
										className="absolute right-4 z-40 w-52 origin-top-right rounded-lg border bg-white p-1 text-sm shadow-lg transition duration-100 ease-out focus:outline-none dark:border-surface-400/30 dark:bg-gray-800 dark:text-surface-300"
									>
										{actionColumnOptions.map((option, index) => (
											<MenuItem key={`action-option-${index + 1}`}>
												<button
													className={clsx(
														"group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700",
														option.className,
														{
															"cursor-default": !option.onClick,
														}
													)}
													onClick={handleActionClick(row, option.onClick)}
												>
													{option.icon && <span className="mr-2">{option.icon}</span>}
													{option.noTranslate ? option.label : t(option.label)}
												</button>
											</MenuItem>
										))}
									</MenuItems>
								</Menu>
							</div>
						</td>
					)}
				</tr>
			))}
		</tbody>
	);
};

export default TableBody;
