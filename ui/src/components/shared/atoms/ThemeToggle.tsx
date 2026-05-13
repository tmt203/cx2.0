"use client";

import clsx from "clsx";
import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";

export interface ThemeToggleProps {
	label?: string;
	sidebarOpen: boolean;
}

/**
 * ThemeToggle component
 * @param label string
 * @param sidebarOpen boolean
 * @returns
 */
const ThemeToggle = ({ label = "sidebar.appearance", sidebarOpen }: ThemeToggleProps) => {
	const t = useTranslations();
	const { theme, setTheme } = useTheme();

	return (
		<div className="relative mb-0.5 animate-[sidebar-animation_ease-in-out] rounded-lg bg-[linear-gradient(135deg,var(--tw-gradient-stops))] py-2 pl-4 pr-3 duration-300 last:mb-0">
			<input
				type="checkbox"
				name="light-switch"
				id="light-switch"
				className="light-switch sr-only"
				checked={theme === "light"}
				onChange={() => {
					if (theme === "dark") {
						return setTheme("light");
					}
					return setTheme("dark");
				}}
			/>
			<label className="flex cursor-pointer items-center" htmlFor="light-switch">
				<div>
					<Sun
						size={16}
						strokeWidth={3}
						className="block text-gray-500/80 dark:hidden dark:text-gray-400/80"
					/>
					<Moon
						size={16}
						strokeWidth={3}
						className="hidden text-gray-500/80 dark:block dark:text-gray-400/80"
					/>
					<span className="sr-only">Switch to light / dark version</span>
				</div>

				<span
					className={clsx(
						"ml-4 text-nowrap font-medium duration-200 lg:sidebar-expanded:opacity-100 2xl:opacity-100",
						{
							"!hidden group-hover:!block": !sidebarOpen,
						}
					)}
				>
					{t(label)}
				</span>
			</label>
		</div>
	);
};

export default ThemeToggle;
