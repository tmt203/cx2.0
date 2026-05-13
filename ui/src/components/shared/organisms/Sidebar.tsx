"use client";

import { useAppStore } from "@/src/lib/store/appStore";
import {
	Icon,
	LanguageToggle,
	ProfileDropdownMenu,
	ServiceDropdownMenu,
	TenantDropdownMenu,
	TenantLogo,
	ThemeToggle,
} from "@components/shared/atoms";
import { SidebarMenu } from "@components/shared/molecules";
import type { SidebarMenuProps } from "@components/shared/molecules/SidebarMenu";
import { Transition } from "@headlessui/react";
import { getBreakpoint } from "@utils/getBreakPoint";
import clsx from "clsx";
import * as LucideIcons from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export interface SidebarMenu extends Omit<
	SidebarMenuProps,
	"expandOnly" | "onToggleSidebar" | "sidebarOpen"
> {}

export interface SidebarProps {
	variant?: "default" | "v2";
	menu: SidebarMenu[];
}

export interface Action {
	icon: keyof typeof LucideIcons;
	label: string;
	action?: () => void;
}

/**
 * Sidebar Component
 * @props SidebarComponent
 */
const Sidebar = ({ variant = "v2", menu }: SidebarProps) => {
	// Hooks
	const t = useTranslations();

	// Provider
	const sidebarOpen = useAppStore((state) => state.sidebar.open);
	const setSidebarOpen = useAppStore((state) => state.setSidebarOpen);

	// States
	const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(false);
	const [breakpoint, setBreakpoint] = useState<string | undefined>(getBreakpoint());

	// Ref
	const sidebar = useRef<HTMLDivElement>(null);
	const expandOnly = useMemo(
		() => !sidebarExpanded && (breakpoint === "lg" || breakpoint === "xl"),
		[sidebarExpanded, breakpoint]
	);

	/**
	 * Handle breakpoint
	 */
	const handleBreakpoint = useCallback(() => {
		setBreakpoint(getBreakpoint());
	}, []);

	/**
	 * Handle toggle sidebar
	 */
	const handleToggleSidebar = useCallback(() => {
		setSidebarOpen((prev) => !prev);
	}, []);

	/**
	 * Handle show sidebar
	 */
	const handleShowSidebar = useCallback(() => {
		setSidebarExpanded(true);
	}, []);

	// Close if the esc key is pressed
	useEffect(() => {
		const handleToggleKeydown = ({ key, ctrlKey }: { key: string; ctrlKey: boolean }) => {
			if (key === "m" && ctrlKey) {
				setSidebarOpen(!sidebarOpen);
			}
		};
		document.addEventListener("keydown", handleToggleKeydown);
		return () => document.removeEventListener("keydown", handleToggleKeydown);
	});

	// Handle breakpoint
	useEffect(() => {
		window.addEventListener("resize", handleBreakpoint);
		return () => {
			window.removeEventListener("resize", handleBreakpoint);
		};
	}, [breakpoint]);

	return (
		<>
			{/* Area: Sidebar */}
			<div className={clsx("group relative min-w-fit", { "sidebar-expanded": sidebarExpanded })}>
				{/* Sidebar backdrop (mobile only) */}
				<Transition
					as="div"
					className="fixed inset-0 z-40 bg-gray-900 bg-opacity-30 lg:z-auto lg:hidden"
					show={sidebarOpen}
					enter="transition-opacity ease-out duration-200"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="transition-opacity ease-out duration-100"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
					aria-hidden="true"
				/>
				{/* Sidebar */}
				<Transition
					show={sidebarOpen}
					unmount={false}
					as="div"
					id="sidebar"
					ref={sidebar}
					className={clsx(
						"no-scrollbar absolute left-0 top-0 z-40 flex h-[100dvh] w-64 shrink-0 flex-col overflow-visible bg-white p-4 transition-all duration-200 ease-in-out dark:bg-gray-800 lg:static lg:left-auto lg:top-auto lg:!flex lg:translate-x-0",
						{
							"border-r border-gray-200 dark:border-surface-400/30": variant === "v2",
							"rounded-r-2xl shadow-sm": variant === "default",
							"!w-20 hover:!w-64": !sidebarOpen,
						}
					)}
					enterFrom="-translate-x-full"
					enterTo="translate-x-0"
					leaveFrom="translate-x-0"
					leaveTo="-translate-x-full"
				>
					{/* Sidebar header */}
					<div
						className={clsx("mb-3 flex items-center", {
							"justify-between pr-3 sm:px-2": sidebarOpen,
							"justify-center px-0 group-hover:justify-between group-hover:sm:!px-2": !sidebarOpen,
						})}
					>
						<div className="flex items-center gap-2">
							{/* Area: Tenant Logo */}
							<TenantLogo />

							{/* Tenant */}
							<div
								className={clsx("transition-all", {
									"block w-10": sidebarOpen,
									"hidden group-hover:block": !sidebarOpen,
								})}
							>
								<h1 className="text-nowrap font-medium">CX2.0 SERVICE</h1>

								{/* Area: Tenant SelectBox */}
								<TenantDropdownMenu
									options={[]}
									isLoading={false}
									selectedOption={{ label: "", value: "" }}
									buttonLabel={t("tenant_service.add_tenant")}
									superAdmin={false}
									onSearch={() => {}}
									onSetSelectedOption={() => {}}
								/>
							</div>
						</div>

						{/* Area: Service Dropdown Menu */}
						<ServiceDropdownMenu />
					</div>

					{/* Profile */}
					<div
						className={clsx("mb-3 flex items-center", {
							"justify-between pr-3 sm:px-2": sidebarOpen,
							"justify-center px-0 group-hover:justify-between group-hover:sm:!px-2": !sidebarOpen,
						})}
					>
						<ProfileDropdownMenu name={""} sidebarOpen={sidebarOpen} actions={[]} />

						{/* Notification */}
						<div
							className={clsx("relative", {
								"!hidden group-hover:!block": !sidebarOpen,
							})}
						>
							<Icon name="Bell" size={16} />

							<span className="absolute -right-2 -top-[6px] flex size-[10px] items-center justify-center rounded-full bg-red-500 text-[6px] text-surface-50">
								12
							</span>
						</div>
					</div>

					{/* Pages group */}
					<div className="space-y-3">
						{menu.map((item, index) => (
							<SidebarMenu
								key={`${item.groupName}-${index}`}
								{...item}
								className="[&_.group-name-header]:group-hover:!block [&_.group-name-icon]:group-hover:!hidden [&_.menu-chevron-down-icon]:group-hover:!block [&_.menu-title]:group-hover:!block [&_.sub-menu-content]:group-hover:!block"
								sidebarOpen={sidebarOpen}
								expandOnly={expandOnly}
								onToggleSidebar={handleShowSidebar}
							/>
						))}
					</div>

					{/* Actions group */}
					<div className="flex h-full flex-col items-start justify-end">
						<ul className="w-full">
							<ThemeToggle sidebarOpen={sidebarOpen} />
							<LanguageToggle>
								<span
									className={clsx(
										"ml-4 text-nowrap font-medium duration-200 lg:sidebar-expanded:opacity-100 2xl:opacity-100",
										{
											"!hidden group-hover:!block": !sidebarOpen,
										}
									)}
								>
									{t("sidebar.language")}
								</span>
							</LanguageToggle>

							<li className="relative mb-0.5 animate-[sidebar-animation_ease-in-out] cursor-pointer rounded-lg bg-[linear-gradient(135deg,var(--tw-gradient-stops))] py-2 pl-4 pr-3 duration-300 last:mb-0">
								<button className="flex items-center justify-between" onClick={handleToggleSidebar}>
									<div className="flex grow items-center">
										<Icon
											size={16}
											strokeWidth={3}
											name={sidebarOpen ? "ArrowLeftFromLine" : "ArrowRightFromLine"}
											className="stroke-secondary-text-color"
										/>
										<span
											className={clsx(
												"ml-4 text-nowrap font-medium duration-200 lg:sidebar-expanded:opacity-100 2xl:opacity-100",
												{
													"!hidden group-hover:!block": !sidebarOpen,
												}
											)}
										>
											{t(sidebarOpen ? "sidebar.collapse" : "sidebar.expand")}
										</span>
									</div>
								</button>
							</li>
						</ul>
					</div>
				</Transition>
			</div>
		</>
	);
};
export default Sidebar;
