"use client";

import { useAppStore } from "@/src/lib/store/appStore";
import { Popover, PopoverButton, PopoverPanel, Transition } from "@headlessui/react";
import { SelectOption } from "@type/common.type";
import clsx from "clsx";
import { Check, ChevronDown, LoaderCircle, Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

export interface ListItemProps {
	domain: string;
	selected: boolean;
	onClick: () => void;
}

export interface TenantDropdownMenuProps {
	isLoading: boolean;
	buttonLabel?: string;
	superAdmin: boolean;
	options: SelectOption[];
	selectedOption: SelectOption;
	onAdd?: () => void;
	onSearch: (value: string) => void;
	onSetSelectedOption: (option: SelectOption) => void;
}

/**
 * List Item Component
 * @props ListItemProps
 */
const ListItem = ({ domain, selected, onClick }: ListItemProps) => {
	return (
		<button
			className="flex items-center justify-between transition-opacity hover:opacity-80"
			onClick={onClick}
		>
			<span className={clsx("text-base font-normal", selected && "text-primary-500")}>
				{domain}
			</span>
			{selected && <Check size={16} className="stroke-primary-500" strokeWidth={2.5} />}
		</button>
	);
};

/**
 * Tenant Dropdown Menu Component
 * @props TenantDropdownMenuProps
 */
const TenantDropdownMenu = ({
	isLoading,
	buttonLabel,
	superAdmin,
	selectedOption,
	options,
	onAdd,
	onSearch,
	onSetSelectedOption,
}: TenantDropdownMenuProps) => {
	// Hooks
	const t = useTranslations();

	// Provider
	const sidebarOpen = useAppStore((state) => state.sidebar.open);
	const setSidebarOpen = useAppStore((state) => state.setSidebarOpen);

	// States
	const [domain, setDomain] = useState<string>("");
	const [mounted, setMounted] = useState<boolean>(false);

	/**
	 * Handle change
	 * @param event ChangeEvent<HTMLInputElement>
	 */
	const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		setDomain(event.target.value);
	}, []);

	/**
	 * Handle click
	 */
	const handleClick = useCallback(() => {
		setSidebarOpen(true);
		setDomain("");
	}, []);

	// Run when component is mounted
	useEffect(() => setMounted(true), []);

	// Search domain when search value changes
	useEffect(() => {
		onSearch(domain);
	}, [domain]);

	return (
		<Popover className="relative">
			<PopoverButton
				className="flex w-32 items-center justify-between gap-2 outline-0 hover:opacity-80"
				onClick={handleClick}
			>
				<span className="w-32 truncate text-nowrap text-start text-xs font-normal italic">
					{selectedOption?.label}
				</span>
				{superAdmin && <ChevronDown size={16} className="stroke-secondary-text-color" />}
			</PopoverButton>
			{superAdmin && (
				<Transition
					as="div"
					className={`z-40 min-w-[14rem] origin-top-right overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-800`}
					enter="transition ease-out duration-200 transform"
					enterFrom="opacity-0 -translate-y-2"
					enterTo="opacity-100 translate-y-0"
					leave="transition ease-out duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					{mounted &&
						createPortal(
							<PopoverPanel
								className={`absolute left-[404px] top-0 z-40 mt-1 flex min-w-[14rem] -translate-x-1/2 flex-col gap-2 overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-800`}
							>
								<div className="flex h-[470px] w-72 flex-col bg-white px-1 py-2 shadow-lg dark:bg-gray-800">
									<div className="flex-1">
										{/* Area: Header */}
										<div className="flex items-center justify-between border-b border-gray-200 px-4 pb-2 dark:border-surface-400/30">
											{/* Area: Count */}
											<span className="text-base font-bold">
												Tenant <span className="font-normal">({options?.length})</span>
											</span>

											{/* Area: Close Button */}
											<PopoverButton className="text-secondary-text-color hover:text-primary-text-color">
												<X size={16} className="stroke-secondary-text-color" strokeWidth={2.5} />
											</PopoverButton>
										</div>

										{/* Area: Search Input */}
										<div className="my-2 flex h-8 items-center gap-2 rounded-lg border border-gray-200 p-2 text-sm dark:border-surface-400/30">
											<Search size={16} className="stroke-secondary-text-color" strokeWidth={2.5} />
											<input
												type="text"
												value={domain}
												placeholder={t("input.search_keyword_placeholder")}
												className="flex w-full border-none bg-transparent p-0 text-base outline-none placeholder:text-base focus:border-transparent focus:ring-0"
												onChange={handleChange}
											/>
										</div>

										{/* Area: List */}
										<div className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-surface flex max-h-[374px] flex-col gap-2 overflow-y-auto border-t border-gray-200 p-2 dark:border-surface-400/30">
											{isLoading && (
												<LoaderCircle size={32} className="animate-spin stroke-primary-500" />
											)}

											{options?.length > 0 ? (
												options.map((option) => (
													<ListItem
														key={option.value}
														domain={option.label}
														selected={option.value === selectedOption.value}
														onClick={() => {}}
													/>
												))
											) : (
												<span>{t("form.no_data")}</span>
											)}
										</div>
									</div>
								</div>
							</PopoverPanel>,
							document.body
						)}
				</Transition>
			)}
		</Popover>
	);
};

export default TenantDropdownMenu;
