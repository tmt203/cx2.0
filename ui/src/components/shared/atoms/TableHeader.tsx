"use client";

import {
	Menu,
	MenuButton,
	MenuItem,
	MenuItems,
	Popover,
	PopoverButton,
	PopoverPanel,
} from "@headlessui/react";
import { TableColumn } from "@type/component/table.type";
import clsx from "clsx";
import {
	Check,
	ChevronRight,
	Eye,
	EyeOff,
	GripVertical,
	Menu as MenuIcon,
	Pin,
	SlidersHorizontal,
	SortAscIcon,
	SortDescIcon,
	WrapText,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { ChangeEventHandler } from "react";

export interface TableHeaderProps<T> {
	id: string;
	showIndex?: boolean;
	showAction?: boolean;
	selectedAll?: boolean;
	showCheckbox?: boolean;
	dragDropAble?: boolean;
	columns: TableColumn<T>[];
	showActionColumn?: boolean;
	onSelectAll: ChangeEventHandler<HTMLInputElement>;
	handleSortColumn?: (columnKey: string, direction: "asc" | "desc") => any;
	handlePinColumn?: (columnKey: string) => any;
	handleHideColumn?: (columnKey: string) => any;
	onSetSizeColumn?: () => void;
	onLineBreak?: () => void;
}

/**
 * Table Header Component
 */
const TableHeader = <T,>({
	id,
	columns,
	showIndex = true,
	showAction = false,
	selectedAll = false,
	showCheckbox = true,
	dragDropAble = false,
	showActionColumn = false,
	onSelectAll,
	onLineBreak,
	handlePinColumn,
	onSetSizeColumn,
	handleSortColumn,
	handleHideColumn,
}: TableHeaderProps<T>) => {
	const t = useTranslations();

	return (
		<thead className="sticky top-0 z-40 border-b border-gray-100 text-xs font-semibold uppercase text-gray-600 dark:border-surface-400/30 dark:text-gray-400 [&_th]:bg-gray-50 [&_th]:dark:bg-gray-700">
			<tr className="[&>th:hover]:brightness-95">
				{/* Area: Drag Drop Header Cell  */}
				{dragDropAble && (
					<th className="w-px whitespace-nowrap px-2 py-3 first:pl-5 last:pr-5">
						<span className="sr-only">Drag Drop</span>
					</th>
				)}

				{/* Area: Checkbox Header Cell */}
				{showCheckbox && (
					<th className="w-px whitespace-nowrap px-2 py-3">
						<div className="flex items-center">
							<label className="inline-flex">
								<span className="sr-only">Select all</span>
								<input
									id={`table-${id}-header-checkbox`}
									className="form-checkbox checked:!bg-primary-500"
									type="checkbox"
									checked={selectedAll}
									onChange={onSelectAll}
								/>
							</label>
						</div>
					</th>
				)}

				{/* Area: Index Header Cell */}
				{showIndex && (
					<th className="whitespace-nowrap px-2 py-3 first:pl-5 last:pr-5">
						<div className="text-left font-semibold">{t("table.no")}</div>
					</th>
				)}

				{/* Area: Header Cell */}
				{columns.map((column) =>
					!column.isHidden ? (
						<th
							key={column.label}
							className={clsx(
								"group whitespace-nowrap px-2 py-3 first:pl-5 last:pr-5",
								column.headerClass
							)}
						>
							<div className="flex items-center justify-between">
								<div className="text-left font-semibold">
									{column.noTranslation ? column.label : t(column.label)}
								</div>
								{showAction && (
									<div className="opacity-0 group-hover:opacity-100">
										<Menu>
											<MenuButton className="hover:text-gray-800 hover:brightness-105 focus-visible:outline-0 active:scale-x-95 active:scale-y-95 active:brightness-90 dark:text-gray-300 dark:hover:text-gray-100">
												<MenuIcon size={16} className="cursor-pointer" />
											</MenuButton>
											<MenuItems
												transition
												anchor="bottom end"
												className="absolute left-0 right-auto top-full z-50 mt-1 min-w-[14rem] origin-top-right overflow-hidden rounded-lg border border-gray-200 bg-white pt-1.5 text-gray-700 shadow-lg dark:border-surface-400/30 dark:bg-gray-800 dark:text-gray-300"
											>
												<div className="px-3 py-1.5 font-semibold text-gray-400">
													{t("table.action_header")}
												</div>
												{handleSortColumn && (
													<MenuItem key="sort-asc">
														<button
															className="group flex w-full items-center gap-2 rounded-md px-3 py-1.5 data-[focus]:bg-white/10"
															onClick={() => handleSortColumn(column.label, "asc")}
														>
															<SortAscIcon className="size-4 fill-white/30" />
															{t("table.sort_asc")}
														</button>
													</MenuItem>
												)}
												{handleSortColumn && (
													<MenuItem key="sort-desc">
														<button
															className="group flex w-full items-center gap-2 rounded-md px-3 py-1.5 data-[focus]:bg-white/10"
															onClick={() => handleSortColumn(column.label, "desc")}
														>
															<SortDescIcon className="size-4 fill-white/30" />
															{t("table.sort_desc")}
														</button>
													</MenuItem>
												)}
												<div className="my-1 h-px bg-white/5" />
												{handlePinColumn && (
													<MenuItem key="pin">
														<button
															className="group flex w-full items-center gap-2 rounded-md px-3 py-1.5 data-[focus]:bg-white/10"
															onClick={() => handlePinColumn(column.label)}
														>
															<Pin className="size-4 fill-white/30" />
															{t("table.pin_column")}
														</button>
													</MenuItem>
												)}
												{handleHideColumn && (
													<MenuItem key="hide">
														<button
															className="group flex w-full items-center gap-2 rounded-md px-3 py-1.5 data-[focus]:bg-white/10"
															onClick={() => handleHideColumn(column.key ?? column.label)}
														>
															<EyeOff className="size-4 fill-white/30" />
															{t("table.hide_column")}
														</button>
													</MenuItem>
												)}
											</MenuItems>
										</Menu>
									</div>
								)}
							</div>
						</th>
					) : null
				)}

				{/* Area: Action column Header Cell */}
				{showActionColumn && (
					<th className="whitespace-nowrap px-2 py-3">
						<div className="flex items-center justify-center text-left font-semibold">
							<Popover className="relative">
								{({ close }) => (
									<>
										<PopoverButton className="hover:border-gray-300 hover:text-gray-800 hover:brightness-105 focus-visible:outline-0 active:scale-x-95 active:scale-y-95 active:brightness-90">
											<SlidersHorizontal size={16} className="cursor-pointer" />
										</PopoverButton>
										<PopoverPanel
											transition
											anchor="bottom end"
											portal={false}
											className="absolute left-0 right-auto top-full z-50 mt-1 min-w-[14rem] origin-top-right overflow-hidden rounded-lg border border-gray-200 bg-white pt-1.5 text-gray-700 shadow-lg dark:border-surface-400/30 dark:bg-gray-800 dark:text-gray-300"
										>
											<div className="px-3 py-1.5 font-semibold text-gray-400">
												{t("table.action_config")}
											</div>

											<Popover className="relative">
												<PopoverButton
													className="w-full hover:border-gray-300 hover:text-gray-800 hover:brightness-105 focus-visible:outline-0 active:scale-x-95 active:scale-y-95 active:brightness-90 disabled:bg-surface-300 dark:border-surface-400/30 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-gray-400"
													onClick={(event) => event.stopPropagation()}
													onMouseDown={(event) => event.stopPropagation()}
												>
													<div className="flex w-full items-center justify-between pe-1 ps-3">
														<div className="flex gap-2">
															<Eye size={16} className="mx-0 my-auto cursor-pointer" />
															{t("table.show_hide_column")}
														</div>
														<div>
															<ChevronRight size={16} className="cursor-pointer" />
														</div>
													</div>
												</PopoverButton>
												<PopoverPanel
													transition
													anchor="left start"
													portal={false}
													className="absolute left-0 right-auto top-full z-50 mt-1 min-w-[14rem] origin-top-right overflow-hidden rounded-lg border border-gray-200 bg-white pt-1.5 text-gray-700 shadow-lg dark:border-surface-400/30 dark:bg-gray-800 dark:text-gray-300"
												>
													<div className="px-3 py-1.5 font-semibold text-gray-400">
														{t("table.show_hide_column")}
													</div>

													{columns.map((column) => (
														<button
															key={column.label}
															className="group flex w-full items-center gap-2 rounded-md px-3 py-1.5 data-[focus]:bg-white/10"
															onClick={() => handleHideColumn?.(column.key ?? column.label)}
														>
															<div className="flex w-full justify-between">
																<div>{column.noTranslation ? column.label : t(column.label)}</div>
																<div className="flex size-4 items-center justify-center">
																	{!column.isHidden && <Check size={16} />}
																</div>
															</div>
														</button>
													))}
												</PopoverPanel>
											</Popover>
											<button
												className="group flex w-full items-center gap-2 rounded-md px-3 py-1.5 data-[focus]:bg-white/10"
												onClick={() => {
													onSetSizeColumn?.();
													close();
												}}
											>
												<GripVertical className="size-4 fill-white/30" />
												{t("table.set_size_column")}
											</button>
											<button
												className="group flex w-full items-center gap-2 rounded-md px-3 py-1.5 data-[focus]:bg-white/10"
												onClick={() => {
													onLineBreak?.();
													close();
												}}
											>
												<WrapText className="size-4 fill-white/30" />
												{t("table.line_break")}
											</button>
										</PopoverPanel>
									</>
								)}
							</Popover>
						</div>
					</th>
				)}
			</tr>
		</thead>
	);
};

export default TableHeader;
