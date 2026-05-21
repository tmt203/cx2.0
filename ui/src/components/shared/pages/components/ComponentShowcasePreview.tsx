"use client";

import { useState } from "react";
import DatePicker from "@components/shared/atoms/DatePicker";
import DateTimePicker from "@components/shared/atoms/DateTimePicker";

export interface ComponentShowcasePreviewProps {
	componentKey: string;
}

const ComponentShowcasePreview = ({ componentKey }: ComponentShowcasePreviewProps) => {
	if (componentKey !== "date-time-picker" && componentKey !== "date-picker") return null;

	if (componentKey === "date-picker") {
		const [basicValue, setBasicValue] = useState<string>("");
		const [formattedValue, setFormattedValue] = useState<string>("");
		const [errorValue, setErrorValue] = useState<string>("");

		return (
			<div className="space-y-4">
				<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
					<div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-surface-400/30 dark:bg-gray-900/20">
						<div className="text-xs font-semibold uppercase tracking-wide text-gray-400">Basic</div>
						<div className="mt-3">
							<DatePicker onSelectDate={setBasicValue} />
						</div>
						{basicValue ? (
							<p className="mt-3 text-xs text-gray-500">Selected: {basicValue}</p>
						) : null}
					</div>

					<div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-surface-400/30 dark:bg-gray-900/20">
						<div className="text-xs font-semibold uppercase tracking-wide text-gray-400">
							Custom format
						</div>
						<div className="mt-3">
							<DatePicker formatDate="dd/MM/yyyy" onSelectDate={setFormattedValue} />
						</div>
						{formattedValue ? (
							<p className="mt-3 text-xs text-gray-500">Selected: {formattedValue}</p>
						) : null}
					</div>

					<div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-surface-400/30 dark:bg-gray-900/20">
						<div className="text-xs font-semibold uppercase tracking-wide text-gray-400">
							With error
						</div>
						<div className="mt-3">
							<DatePicker errorMessage="This field is required" onSelectDate={setErrorValue} />
						</div>
						{errorValue ? (
							<p className="mt-3 text-xs text-gray-500">Selected: {errorValue}</p>
						) : null}
					</div>
				</div>
			</div>
		);
	}

	const [basicValue, setBasicValue] = useState<string>("");
	const [limitedValue, setLimitedValue] = useState<string>("");
	const [secondsValue, setSecondsValue] = useState<string>("");
	const [errorValue, setErrorValue] = useState<string>("");

	return (
		<div className="space-y-4">
			<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
				<div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-surface-400/30 dark:bg-gray-900/20">
					<div className="text-xs font-semibold uppercase tracking-wide text-gray-400">Basic</div>
					<div className="mt-3">
						<DateTimePicker onSelectDateTime={setBasicValue} />
					</div>
					{basicValue ? <p className="mt-3 text-xs text-gray-500">Selected: {basicValue}</p> : null}
				</div>

				<div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-surface-400/30 dark:bg-gray-900/20">
					<div className="text-xs font-semibold uppercase tracking-wide text-gray-400">
						With limits
					</div>
					<div className="mt-3">
						<DateTimePicker minTime="08:30" maxTime="18:00" onSelectDateTime={setLimitedValue} />
					</div>
					{limitedValue ? (
						<p className="mt-3 text-xs text-gray-500">Selected: {limitedValue}</p>
					) : null}
				</div>

				<div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-surface-400/30 dark:bg-gray-900/20">
					<div className="text-xs font-semibold uppercase tracking-wide text-gray-400">
						With seconds
					</div>
					<div className="mt-3">
						<DateTimePicker
							enableSeconds
							minTime="08:30:00"
							maxTime="18:00:30"
							onSelectDateTime={setSecondsValue}
						/>
					</div>
					{secondsValue ? (
						<p className="mt-3 text-xs text-gray-500">Selected: {secondsValue}</p>
					) : null}
				</div>

				<div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-surface-400/30 dark:bg-gray-900/20">
					<div className="text-xs font-semibold uppercase tracking-wide text-gray-400">
						With error
					</div>
					<div className="mt-3">
						<DateTimePicker
							errorMessage="This field is required"
							onSelectDateTime={setErrorValue}
						/>
					</div>
					{errorValue ? <p className="mt-3 text-xs text-gray-500">Selected: {errorValue}</p> : null}
				</div>
			</div>
		</div>
	);
};

export default ComponentShowcasePreview;
