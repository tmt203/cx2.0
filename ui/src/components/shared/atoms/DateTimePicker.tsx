"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@components/ui/popover";
import clsx from "clsx";
import { format, isValid, setHours, setMinutes, setSeconds } from "date-fns";
import { vi } from "date-fns/locale";
import { XCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { ChangeEvent, FocusEvent, MouseEvent, useCallback, useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import { toast } from "react-toastify";

export interface DateTimePickerProps extends Omit<
	React.ComponentProps<typeof DayPicker>,
	"selected" | "onSelect" | "mode"
> {
	ref?: React.Ref<HTMLButtonElement>;
	time?: string | number | readonly string[];
	minTime?: string;
	maxTime?: string;
	errorMessage?: string;
	formatDateTime?: string;
	enableSeconds?: boolean;
	onSelectDateTime: (date: string) => void;
}

/**
 * Date Time Picker Component
 * @props DateTimePickerProps
 */
const DateTimePicker = ({
	ref,
	time,
	minTime = "",
	maxTime = "",
	disabled,
	errorMessage = "",
	formatDateTime,
	enableSeconds = false,
	className,
	onSelectDateTime,
}: DateTimePickerProps) => {
	// Hooks
	const t = useTranslations();

	// State
	const [date, setDate] = useState<Date | undefined>(time ? new Date(`${time}`) : new Date());
	const [timeValue, setTimeValue] = useState<string>("");
	const timeFormat = enableSeconds ? "HH:mm:ss" : "HH:mm";
	const displayFormat = enableSeconds ? "dd/MM/yyyy HH:mm:ss" : "dd/MM/yyyy HH:mm";
	const resolvedFormatDateTime =
		formatDateTime ?? (enableSeconds ? "yyyy/MM/dd HH:mm:ss" : "yyyy/MM/dd HH:mm");

	const normalizeTimeForCompare = useCallback(
		(value: string) => {
			if (!value) return value;
			if (enableSeconds) return value.length === 5 ? `${value}:00` : value;
			return value.slice(0, 5);
		},
		[enableSeconds]
	);

	const parseTimeParts = useCallback((value: string) => {
		const [hours, minutes, seconds] = value.split(":").map((str) => parseInt(str, 10));
		return {
			hours: Number.isNaN(hours) ? 0 : hours,
			minutes: Number.isNaN(minutes) ? 0 : minutes,
			seconds: Number.isNaN(seconds) ? 0 : seconds,
		};
	}, []);

	const valueLabel = useMemo(() => {
		if (!date) return t("filter_component.pick_date");
		setTimeValue(format(date, timeFormat));
		return `${format(date, displayFormat)}`;
	}, [date, displayFormat, t, timeFormat]);

	/**
	 * Handle Time Change
	 * @param event ChangeEvent<HTMLInputElement>
	 */
	const handleTimeChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			const time = event.target.value;
			if (!date || !isValid(date)) {
				setTimeValue(time);
				return toast.warning(t("date_time_picker.empty_date"));
			}

			const { hours, minutes, seconds } = parseTimeParts(time);
			const newSelectedDate = setHours(setMinutes(setSeconds(date, seconds), minutes), hours);
			if (!isValid(newSelectedDate)) return;
			setDate(newSelectedDate);
			setTimeValue(time);
			onSelectDateTime(format(newSelectedDate, resolvedFormatDateTime));
		},
		[date, onSelectDateTime, parseTimeParts, resolvedFormatDateTime, setDate, setTimeValue, t]
	);

	/**
	 * Handle select date
	 * @param date Date | undefined
	 */
	const handleDateSelect = useCallback(
		(date: Date | undefined) => {
			if (!date || !isValid(date)) {
				setDate(undefined);
				return;
			}
			if (!timeValue) {
				setDate(date);
				return;
			}
			const { hours, minutes, seconds } = parseTimeParts(timeValue);
			const newDate = new Date(
				date.getFullYear(),
				date.getMonth(),
				date.getDate(),
				hours,
				minutes,
				seconds
			);
			if (!isValid(newDate)) {
				setDate(date);
				return;
			}
			setDate(newDate);
			setTimeValue("");
			onSelectDateTime(format(newDate, resolvedFormatDateTime));
		},
		[onSelectDateTime, parseTimeParts, resolvedFormatDateTime, setDate, timeValue]
	);

	/**
	 * Handle blur input time
	 * @param event FocusEvent<HTMLInputElement>
	 */
	const handleBlur = useCallback(
		(event: FocusEvent<HTMLInputElement>) => {
			const time = normalizeTimeForCompare(event.target.value);
			const minValue = normalizeTimeForCompare(minTime ?? "");
			const maxValue = normalizeTimeForCompare(maxTime ?? "");

			if ((minValue && time < minValue) || (maxValue && time > maxValue)) {
				toast.warning(
					t("date_time_picker.warning_time", {
						min: minTime,
						max: maxTime,
					})
				);
			}
		},
		[maxTime, minTime, normalizeTimeForCompare, t]
	);

	/**
	 * Handle clear date
	 * @param event MouseEvent<SVGSVGElement>
	 */
	const handleClearDate = useCallback(
		(event: MouseEvent<SVGSVGElement>) => {
			event.stopPropagation();
			onSelectDateTime("");
			setDate(undefined);
		},
		[setDate, onSelectDateTime]
	);

	const handleSetNow = useCallback(() => {
		const now = new Date();
		if (!isValid(now)) return;
		setDate(now);
		setTimeValue(format(now, timeFormat));
		onSelectDateTime(format(now, resolvedFormatDateTime));
	}, [onSelectDateTime, resolvedFormatDateTime, timeFormat]);
	return (
		<div className={clsx("grid gap-2", className)}>
			<Popover>
				<PopoverTrigger
					className={clsx(
						"btn group min-w-[15.5rem] justify-between border-gray-200 bg-white px-2.5",
						"dark:border-surface-400/30 dark:bg-gray-800 dark:hover:border-gray-600",
						"hover:border-gray-300 hover:text-gray-800",
						{
							"text-muted-foreground": !date,
							"!border-danger-500 hover:!border-danger-300 focus:!border-danger-500 dark:!border-danger-500":
								errorMessage,
						}
					)}
				>
					<div className="flex items-center text-left font-medium text-gray-600 group-hover:text-gray-800 dark:text-gray-300 dark:group-hover:text-gray-100">
						<svg
							className="ml-1 mr-2 fill-current text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-100"
							width="16"
							height="16"
							viewBox="0 0 16 16"
						>
							<path d="M5 4a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2H5Z"></path>
							<path d="M4 0a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V4a4 4 0 0 0-4-4H4ZM2 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4Z"></path>
						</svg>
						<span>{valueLabel}</span>
					</div>
					<XCircle
						size={14}
						className={clsx(
							"text-danger-400 hover:text-danger-600 dark:text-danger-500 dark:hover:text-danger-300",
							{ invisible: !date }
						)}
						onClick={handleClearDate}
					/>
				</PopoverTrigger>

				<PopoverContent align="start" className="w-auto p-0">
					<DayPicker
						mode="single"
						selected={date}
						captionLayout="dropdown"
						hideNavigation
						disabled={disabled}
						className={clsx("p-3 text-gray-600 dark:text-gray-100")}
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
							weekday: "text-gray-400 dark:text-gray-500 font-medium rounded-md w-9 text-[0.8rem]",
							week: "flex w-full mt-2",
							day: "h-9 w-9 mx-[0.5px] text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-green-500/50 [&:has([aria-selected])]:bg-primary-500 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
							day_button:
								"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-primary-500 hover:text-white h-9 w-9 p-0 aria-selected:opacity-100",
							range_start: "rounded-l-lg",
							range_end: "day-range-end rounded-r-lg",
							selected:
								"bg-primary-500 text-white hover:bg-primary-500 hover:text-white focus:bg-primary-500 focus:text-white rounded-md",
							today: "text-primary-500",
							outside:
								"day-outside text-gray-400 dark:text-gray-500 aria-selected:bg-primary-500/50 aria-selected:text-gray-400 dark:text-gray-500",
							disabled: "text-gray-400 dark:text-gray-500 opacity-50",
							range_middle: "aria-selected:bg-primary-500/70 aria-selected:text-white",
							hidden: "invisible",
							footer: "text-xs font-semibold",
						}}
						footer={
							<div className="flex items-center justify-between gap-3">
								<div className="flex items-center gap-2">
									<label htmlFor="time-input">{t("filter_component.set_time")}:</label>
									<input
										id="time-input"
										type="time"
										step={enableSeconds ? 1 : undefined}
										autoComplete="off"
										value={timeValue}
										onChange={handleTimeChange}
										onBlur={handleBlur}
										className={clsx("form-input h-8")}
									/>
								</div>
								<button
									type="button"
									className="text-xs font-semibold text-primary-600 hover:text-primary-700"
									onClick={handleSetNow}
								>
									Now
								</button>
							</div>
						}
						onSelect={handleDateSelect}
						required
					/>
				</PopoverContent>
			</Popover>
		</div>
	);
};

export default DateTimePicker;
