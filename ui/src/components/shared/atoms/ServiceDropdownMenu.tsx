"use client";

import { useAppStore } from "@lib/store/appStore";
import { Popover, PopoverButton, PopoverPanel, Transition } from "@headlessui/react";
import clsx from "clsx";
import { LoaderCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Icon from "./Icon";

/**
 * ServiceDropdownMenu
 */
const ServiceDropdownMenu = () => {
	// Hooks
	const t = useTranslations();

	// Provider
	const sidebarOpen = useAppStore((state) => state.sidebar.open);
	const setSidebarOpen = useAppStore((state) => state.setSidebarOpen);

	// States
	const [mounted, setMounted] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	/**
	 * Handle toggle sidebar open
	 */
	const handleClick = useCallback(() => {
		setSidebarOpen(true);
	}, []);

	// Run when component is mounted
	useEffect(() => setMounted(true), []);

	return (
		<Popover
			className={clsx("relative", {
				"!hidden group-hover:!block": !sidebarOpen,
			})}
		>
			<PopoverButton
				className="flex items-center justify-center gap-2 whitespace-nowrap hover:text-gray-800 focus-visible:outline-0 dark:text-gray-300 dark:hover:text-gray-100"
				onClick={handleClick}
			>
				<Icon name="Menu" size={16} />
			</PopoverButton>
			<Transition
				as="div"
				className="z-40 origin-top-right overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-800"
				enter="transition ease-out duration-200 transform"
				enterFrom="opacity-0 -translate-y-2"
				enterTo="opacity-100 translate-y-0"
				leave="transition ease-out duration-200"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
			>
				{mounted &&
					createPortal(
						<PopoverPanel className="absolute left-[260px] top-0 z-40 mt-1 flex min-w-fit flex-col gap-2 overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-800">
							<div className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-surface flex max-h-60 w-[424px] flex-wrap items-start gap-y-2 overflow-auto p-4">
								{isLoading && (
									<LoaderCircle size={32} className="animate-spin stroke-primary-500" />
								)}

								<p className="text-base font-medium">{t("tenant_service.no_granted_services")}</p>
							</div>
						</PopoverPanel>,
						document.body
					)}
			</Transition>
		</Popover>
	);
};

export default ServiceDropdownMenu;
