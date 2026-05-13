"use client";

import clsx from "clsx";
import { useTranslations } from "next-intl";
import { MouseEvent, ReactNode } from "react";

export type ActionButton = "confirm" | "cancel";

export interface ModalActionProps {
	children?: ReactNode;
	actionButtons?: ActionButton[];
	confirmLabel?: string;
	cancelLabel?: string;
	cancelClassName?: string;
	confirmClassName?: string;
	onCancel?: (event: MouseEvent<HTMLButtonElement>) => void;
	onConfirm?: () => void;
}

/**
 * Modal Action Component
 * @props ModalActionProps
 */
const ModalAction = ({
	children,
	cancelLabel,
	confirmLabel,
	cancelClassName,
	confirmClassName,
	actionButtons = ["confirm", "cancel"],
	onConfirm = () => { },
	onCancel = () => { },
}: ModalActionProps) => {
	const t = useTranslations();
	return (
		<>
			{/* Area: Modal Action */}
			<div className="px-5 py-4 border-t border-gray-200 dark:border-surface-400/30">
				<div className="flex flex-wrap justify-end space-x-2">
					{/* Area: Cancel Button */}
					{actionButtons.includes("cancel") && (
						<button
							type="button"
							className={clsx(
								cancelClassName,
								"btn-sm h-8 min-w-20 py-0 px-3 hover:brightness-105 active:scale-x-95 active:scale-y-95 active:brightness-90 text-nowrap border-gray-200 dark:border-surface-400/30 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-300"
							)}
							onClick={onCancel}
						>
							{cancelLabel ?? t("form.cancel")}
						</button>
					)}

					{/* Area: Children content */}
					{children}

					{/* Area: Confirm Button */}
					{actionButtons.includes("confirm") && (
						<button
							type="button"
							className={clsx(
								confirmClassName,
								"btn-sm h-8 min-w-20 py-0 px-3 hover:brightness-105 active:scale-x-95 active:scale-y-95 active:brightness-90 text-nowrap bg-secondary-500 text-white"
							)}
							onClick={onConfirm}
						>
							{confirmLabel ?? t("form.confirm")}
						</button>
					)}
				</div>
			</div>
		</>
	);
};

export default ModalAction;
