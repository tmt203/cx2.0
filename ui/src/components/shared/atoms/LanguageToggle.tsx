"use client";

import { EN, VI } from "@/public/svg";
import { setUserLocale } from "@/src/lib/services/locale";
import { useLocale } from "next-intl";
import Image from "next/image";
import { ReactNode, useCallback, useTransition } from "react";

export interface LanguageToggleProps {
	children?: ReactNode;
}

/**
 * Language Toggle Component
 * @props LanguageToggleProps
 */
const LanguageToggle = ({ children }: LanguageToggleProps) => {
	// Hooks
	const locale = useLocale();
	const [isPending, startTransition] = useTransition();

	/**
	 * Handle language change
	 */
	const handleLanguageChange = useCallback(() => {
		const newLocale = locale === "vi" ? "en" : "vi";
		startTransition(() => {
			setUserLocale(newLocale);
		});
	}, [locale, setUserLocale, startTransition]);

	return (
		<button
			className="mb-0.5 flex items-center justify-between py-2 pl-4 pr-3 last:mb-0"
			disabled={isPending}
			onClick={handleLanguageChange}
		>
			<div className="flex grow items-center">
				{locale === "vi" ? (
					<div className="flex h-4 w-4 items-center justify-center">
						<Image alt="vi icon" src={VI} priority />
					</div>
				) : (
					<div className="flex h-4 w-4 items-center justify-center">
						<Image alt="vi icon" src={EN} priority />
					</div>
				)}

				{children}
			</div>
		</button>
	);
};

export default LanguageToggle;
