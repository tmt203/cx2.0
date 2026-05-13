"use client";

import { ModalAction } from "@components/shared/atoms";
import type { ActionButton } from "@components/shared/atoms/ModalAction";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { Size } from "@type/common.type";
import clsx from "clsx";
import { ChangeEventHandler, MouseEvent, ReactNode, useCallback } from "react";

export interface ModalProps {
	title: string;
	isOpen: boolean;
	children: ReactNode;
	cancelLabel?: string;
	confirmLabel?: string;
	actionChildren?: ReactNode;
	actionButtons?: ActionButton[];
	size?: Omit<Size, "2xs" | "xs">;
	confirmClassName?: string;
	cancelClassName?: string;
	showFooter?: boolean;
	onCancel?: (event?: ChangeEventHandler<HTMLButtonElement>) => void;
	onConfirm?: () => void;
	setIsOpen: (value: boolean) => void;
}

const Modal = ({
	size,
	title,
	isOpen,
	children,
	cancelLabel,
	confirmLabel,
	actionButtons,
	actionChildren,
	cancelClassName,
	confirmClassName,
	showFooter = true,
	onCancel,
	setIsOpen,
	onConfirm,
}: ModalProps) => {
	/**
	 * Handle outside modal click
	 */
	const handleOutsideClick = useCallback(() => {
		setIsOpen(false);
	}, [setIsOpen]);

	/**
	 * Handle close modal
	 * @param event MouseEvent
	 */
	const handleCloseModal = useCallback(
		(event: MouseEvent<HTMLButtonElement>) => {
			event.stopPropagation();
			onCancel && onCancel();
			setIsOpen(false);
		},
		[setIsOpen, onCancel]
	);
	return (
		<Transition appear show={isOpen}>
			<Dialog as="div" onClose={handleOutsideClick}>
				<TransitionChild
					as="div"
					className="fixed inset-0 z-50 bg-gray-900 bg-opacity-30 transition-opacity"
					enter="transition ease-out duration-200"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="transition ease-out duration-100"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
					aria-hidden="true"
				/>
				<TransitionChild
					as="div"
					className="fixed inset-0 z-50 my-4 flex items-center justify-center overflow-hidden px-4 sm:px-6"
					enter="transition ease-in-out duration-200"
					enterFrom="opacity-0 translate-y-4"
					enterTo="opacity-100 translate-y-0"
					leave="transition ease-in-out duration-200"
					leaveFrom="opacity-100 translate-y-0"
					leaveTo="opacity-0 translate-y-4"
				>
					<DialogPanel
						className={clsx(
							"flex h-fit w-full flex-col rounded-lg bg-white shadow-lg dark:bg-gray-800",
							{
								"max-w-screen-md": size === "md",
								"max-w-screen-lg": size === "lg",
								"max-w-screen-xl": size === "xl",
								"max-w-screen-2xl": size === "2xl",
							}
						)}
					>
						{/* Area: Header Modal */}
						<div className="h-12 flex-none border-b border-gray-200 px-5 py-3 dark:border-surface-400/30">
							<div className="flex items-center justify-between">
								<DialogTitle className="font-semibold text-gray-800 dark:text-gray-100">
									{title}
								</DialogTitle>
								<button
									className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
									onClick={handleCloseModal}
								>
									<div className="sr-only">Close</div>
									<svg className="fill-current" width="16" height="16" viewBox="0 0 16 16">
										<path d="M7.95 6.536l4.242-4.243a1 1 0 111.415 1.414L9.364 7.95l4.243 4.242a1 1 0 11-1.415 1.415L7.95 9.364l-4.243 4.243a1 1 0 01-1.414-1.415L6.536 7.95 2.293 3.707a1 1 0 011.414-1.414L7.95 6.536z" />
									</svg>
								</button>
							</div>
						</div>

						{/* Area: Modal body */}
						<div className="scrollbar-thin mx-1 my-3 flex max-h-[calc(100vh-177px)] overflow-y-auto overflow-x-hidden">
							<div className="w-full px-4">{children}</div>
						</div>

						{/* Area: Modal Action */}
						{showFooter && (
							<div className="h-[65px] flex-none">
								<ModalAction
									cancelLabel={cancelLabel}
									confirmLabel={confirmLabel}
									actionButtons={actionButtons}
									cancelClassName={cancelClassName}
									confirmClassName={confirmClassName}
									onCancel={handleCloseModal}
									onConfirm={onConfirm}
								>
									{actionChildren}
								</ModalAction>
							</div>
						)}
					</DialogPanel>
				</TransitionChild>
			</Dialog>
		</Transition>
	);
};

export default Modal;
