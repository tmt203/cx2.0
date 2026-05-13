"use client";

import clsx from "clsx";
import * as React from "react";
import { DayPicker } from "react-day-picker";
import { vi } from "react-day-picker/locale";
import "react-day-picker/style.css";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

/**
 * Calendar Component
 * @props CalendarProps
 */
const Calendar = ({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) => {
	return (
		<DayPicker
			captionLayout="dropdown"
			hideNavigation
			className={clsx("p-3 text-gray-600 dark:text-gray-100", className)}
			locale={vi}
			classNames={{
				months: "flex flex-col gap-3 sm:flex-row space-y-4 sm:space-y-0",
				month_caption: "flex justify-start pt-1 pb-3 relative items-center",
				caption_label: "text-base font-medium",
				nav: "absolute flex items-center justify-between gap-1 inset-x-3 top-3",
				button_previous:
					"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none size-7 bg-transparent p-0 opacity-50 hover:opacity-100 z-50",
				button_next:
					"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none size-7 bg-transparent p-0 opacity-50 hover:opacity-100 z-50",
				month_grid: "w-full border-collapse space-y-1",
				weekdays: "flex",
				weekday: "text-gray-400 dark:text-gray-500 font-medium rounded-md w-8 text-[0.8rem]",
				week: "flex w-full mt-2",
				day: "h-8 w-8 mx-[0.5px] text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-green-500/50 [&:has([aria-selected])]:bg-primary-500 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
				day_button:
					"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-primary-500 hover:text-white h-8 w-8 p-0 aria-selected:opacity-100",
				range_start: "rounded-l-lg",
				range_end: "day-range-end rounded-r-lg",
				selected:
					"bg-primary-500 text-white hover:bg-primary-500 hover:text-white focus:bg-primary-500 focus:text-white",
				today: "text-primary-500",
				outside:
					"day-outside text-gray-400 dark:text-gray-500 aria-selected:bg-primary-500/50 aria-selected:text-gray-400 dark:text-gray-500",
				disabled: "text-gray-400 dark:text-gray-500 opacity-50",
				range_middle: "aria-selected:bg-primary-500/70 aria-selected:text-white",
				hidden: "invisible",
				footer: "text-xs font-semibold italic",
				...classNames,
			}}
			{...props}
		/>
	);
};
Calendar.displayName = "Calendar";

export default Calendar;
