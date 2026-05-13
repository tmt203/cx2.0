"use client";

import clsx from "clsx";
import * as LucideIcons from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname, useSelectedLayoutSegments } from "next/navigation";
import { useCallback } from "react";
import { Icon, SidebarLink, SidebarLinkGroup } from "@components/shared/atoms";

export interface GroupMenu {
	id: string;
	label: string;
	groupId: string;
	icon: keyof typeof LucideIcons;
	noTranslate?: boolean;
	href?: string;
	subGroups?: Omit<GroupMenu, "icon" | "subGroups">[];
}

export interface SidebarMenuProps {
	expandOnly: boolean;
	groups: GroupMenu[];
	sidebarOpen?: boolean;
	groupName?: string;
	className?: string;
	onToggleSidebar: (value: boolean) => void;
}

/**
 * Sidebar Menu Props
 * @props SidebarMenuProps
 */
const SidebarMenu = ({
	groups,
	className,
	groupName,
	expandOnly,
	sidebarOpen,
	onToggleSidebar,
}: SidebarMenuProps) => {
	const segments = useSelectedLayoutSegments();
	const pathName = usePathname();
	const t = useTranslations();

	/**
	 * Check if any of the subGroups are active
	 * @param subGroups - Array of subGroups to check
	 */
	const checkExistActive = useCallback(
		(subGroups: Omit<GroupMenu, "icon" | "subGroups">[]) => {
			return subGroups.some((item) => {
				return segments.some((segment) => item.href?.split("/").includes(segment));
			});
		},
		[segments]
	);

	return (
		<div className={className}>
			<h3 className="pl-3 text-xs font-semibold uppercase text-gray-400 dark:text-gray-500">
				<span
					className={clsx(
						"group-name-icon hidden w-6 text-center lg:sidebar-expanded:hidden 2xl:hidden",
						{
							"!block": !sidebarOpen,
						}
					)}
					aria-hidden="true"
				>
					•••
				</span>
				<span
					className={clsx("group-name-header lg:sidebar-expanded:block 2xl:block", {
						"!hidden": !sidebarOpen,
					})}
				>
					{groupName && t(groupName)}
				</span>
			</h3>
			<ul className="mt-3">
				{groups.map((item, index) => {
					if (item.subGroups?.length) {
						return (
							<SidebarLinkGroup
								key={item.id}
								open={checkExistActive(item.subGroups)}
								className="relative animate-[sidebar-animation_ease-in-out]"
								style={{ animationDuration: `${0.1 * (index + 1)}s` }}
							>
								{(handleClick, open) => {
									return (
										<>
											<a
												href="#0"
												className={clsx(
													"block truncate text-gray-800 transition dark:text-gray-100",
													{
														"hover:text-gray-900 dark:hover:text-white": !segments.includes(
															item.href ?? "#"
														),
													}
												)}
												onClick={(e) => {
													e.preventDefault();
													expandOnly ? onToggleSidebar(true) : handleClick();
												}}
											>
												<div className="flex items-center justify-between">
													<div className="flex items-center">
														<Icon
															size={16}
															name={item.icon}
															strokeWidth={2.5}
															className={clsx("stroke-secondary-text-color", {
																"!stroke-primary-500": segments.includes(`${item.href ?? "#"}`),
															})}
														/>
														<span
															className={clsx(
																"menu-title ml-4 font-medium duration-200 lg:sidebar-expanded:opacity-100 2xl:opacity-100",
																{
																	"!hidden": !sidebarOpen,
																}
															)}
														>
															{item.noTranslate ? item.label : t(item.label)}
														</span>
													</div>

													{/* Icon */}
													<div className="ml-2 flex shrink-0">
														<LucideIcons.ChevronDown
															size={16}
															strokeWidth={2.5}
															className={clsx(
																"menu-chevron-down-icon stroke-gray-500/90 transition-all",
																{
																	"rotate-180": open,
																	"!hidden": !sidebarOpen,
																}
															)}
														/>
													</div>
												</div>
											</a>
											<div
												className={clsx("sub-menu-content lg:sidebar-expanded:block 2xl:block", {
													"!hidden": !sidebarOpen,
												})}
											>
												<ul className={clsx("mt-1 pl-8", { hidden: !open })}>
													{item.subGroups?.map((sub, order) => {
														return (
															<li key={sub.id} className="!mb-1 last:mb-0">
																<SidebarLink
																	href={sub.href ?? "#"}
																	className="h-6"
																	style={{ animationDuration: `${0.1 * (order + 1)}s` }}
																>
																	<span className="font-medium duration-200 lg:sidebar-expanded:opacity-100 2xl:opacity-100">
																		{sub.noTranslate ? sub.label : t(sub.label)}
																	</span>
																</SidebarLink>
															</li>
														);
													})}
												</ul>
											</div>
										</>
									);
								}}
							</SidebarLinkGroup>
						);
					}
					return (
						<li
							key={item.id}
							className={clsx(
								"relative mb-0.5 animate-[sidebar-animation_ease-in-out] rounded-lg bg-[linear-gradient(135deg,var(--tw-gradient-stops))] py-2 pl-4 pr-3 last:mb-0",
								{
									"from-primary-500/[0.12] to-primary-500/[0.04] dark:from-primary-500/[0.24]":
										pathName === item.href,
								}
							)}
							style={{ animationDuration: `${0.1 * (index + 1)}s` }}
						>
							<SidebarLink href={item.href ?? "#"}>
								<div className="flex items-center justify-between">
									<div className="flex grow items-center">
										<Icon
											size={16}
											strokeWidth={2.5}
											name={item.icon}
											className={clsx("stroke-secondary-text-color", {
												"!stroke-primary-500": pathName === item.href,
											})}
										/>
										<span className="ml-4 font-medium duration-200 lg:sidebar-expanded:opacity-100 2xl:opacity-100">
											{t(item.label)}
										</span>
									</div>
								</div>
							</SidebarLink>
						</li>
					);
				})}
			</ul>
		</div>
	);
};

export default SidebarMenu;
