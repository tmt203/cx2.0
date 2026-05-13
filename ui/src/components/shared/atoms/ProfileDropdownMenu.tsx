"use client";

import { AvatarUser } from "@/public/images";
import { Popover, PopoverButton, PopoverPanel, Transition } from "@headlessui/react";
import clsx from "clsx";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Action } from "../organisms/Sidebar";
import Icon from "./Icon";

export interface ProfileDropdownMenuProps {
	image?: string | StaticImport;
	name?: string;
	sidebarOpen: boolean;
	actions: Action[];
}

/**
 * Profile dropdown menu component
 * @param image string | StaticImport
 * @param name string
 * @param sidebarOpen boolean
 * @param actions Action[]
 */
const ProfileDropdownMenu = ({
	image = AvatarUser,
	name = "",
	sidebarOpen,
	actions,
}: ProfileDropdownMenuProps) => {
	// States
	const [mounted, setMounted] = useState<boolean>(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<Popover className="relative">
			<PopoverButton className="flex items-center justify-center gap-2 whitespace-nowrap hover:text-gray-800 focus-visible:outline-0 dark:text-gray-300 dark:hover:text-gray-100">
				{/* User image */}
				<Image alt="Avatar User" src={image} width={32} />

				{/* User name */}
				<span
					className={clsx("text-nowrap text-left font-medium duration-200", {
						"block max-w-32 overflow-hidden text-ellipsis": sidebarOpen,
						"hidden w-0 group-hover:!block group-hover:!w-20": !sidebarOpen,
					})}
				>
					{name}
				</span>
			</PopoverButton>
			<Transition
				as="div"
				enter="transition ease-out duration-200 transform"
				enterFrom="opacity-0 -translate-y-2"
				enterTo="opacity-100 translate-y-0"
				leave="transition ease-out duration-200"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
			>
				{mounted &&
					createPortal(
						<PopoverPanel className="absolute left-44 top-24 z-40 mt-1 flex min-w-[14rem] -translate-x-1/2 flex-col gap-2 overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-800">
							{actions.map(({ label, icon, action }, index) => {
								return (
									<button
										key={`${label}-${index}`}
										className="flex h-10 cursor-pointer items-center gap-2 px-2"
										onClick={action}
									>
										<Icon name={icon} size={16} />
										<span className="text-sm font-medium">{label}</span>
									</button>
								);
							})}
						</PopoverPanel>,
						document.body
					)}
			</Transition>
		</Popover>
	);
};

export default ProfileDropdownMenu;
