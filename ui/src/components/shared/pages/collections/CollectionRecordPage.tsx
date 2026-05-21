"use client";

import { useAppStore } from "@/src/lib/store/appStore";
import { apiCreateItem, apiGetItemById, apiUpdateItem } from "@api/rest/directus/items.api";
import DatePicker from "@components/shared/atoms/DatePicker";
import DateTimePicker from "@components/shared/atoms/DateTimePicker";
import { Button, InputForm, SelectForm } from "@components/shared/molecules";
import DefaultPageLayout from "@components/shared/templates/DefaultPageLayout";
import { SelectOption } from "@type/common.type";
import { DirectusField } from "@type/api/rest/directus/field.type";
import {
	getFieldMeta,
	getInitialValue,
	isGeneratedField,
	normalizePayloadValue,
} from "@utils/dynamicForm";
import { useFormik } from "formik";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { boolean, number, object, string } from "yup";

export interface CollectionRecordPageProps {
	collection: string;
	mode?: "create" | "edit";
	recordId?: string | number;
	baseRoute?: string;
}

/**
 * Collection Record Page
 * @props CollectionRecordPageProps
 */
const CollectionRecordPage = ({
	collection,
	mode = "create",
	recordId,
	baseRoute,
}: CollectionRecordPageProps) => {
	const fields = useAppStore((state) => state.fields);
	const collections = useAppStore((state) => state.collections);
	const collectionFields = useMemo(
		() => fields.filter((field) => field.collection === collection),
		[collection, fields]
	);
	const currentCollection = useMemo(
		() => collections.find((col) => col.collection === collection),
		[collection, collections]
	);

	// Hooks
	const t = useTranslations();
	const locale = useLocale();
	const router = useRouter();
	const pathname = usePathname();
	const translations = useAppStore((state) => state.translations);

	const isEditMode = mode === "edit";
	const resolvedBaseRoute = useMemo(() => {
		if (baseRoute) return baseRoute;
		if (isEditMode) {
			const segments = pathname.split("/").filter(Boolean);
			return `/${segments.slice(0, -1).join("/")}`;
		}
		return pathname.replace(/\/new$/, "");
	}, [baseRoute, isEditMode, pathname]);

	const collectionLabel = useMemo(() => {
		const normalizedLocale = locale.toLowerCase();
		const translationsMeta = currentCollection?.meta?.translations;
		const matched = (translationsMeta instanceof Array ? translationsMeta : []).find((entry) =>
			entry.language.toLowerCase().includes(normalizedLocale)
		);
		return (
			matched?.translation ||
			(currentCollection?.meta as Record<string, unknown>)?.collection ||
			collection
		);
	}, [collection, currentCollection, locale]);

	const visibleFields = useMemo(() => {
		return [...collectionFields]
			.filter((field) => !isGeneratedField(field))
			.sort((a, b) => {
				const aMeta = getFieldMeta(a);
				const bMeta = getFieldMeta(b);
				return Number(aMeta.order ?? aMeta.sort ?? 0) - Number(bMeta.order ?? bMeta.sort ?? 0);
			});
	}, [collectionFields]);

	const fieldLabels = useMemo(() => {
		const normalizedLocale = locale.toLowerCase();
		return visibleFields.reduce<Record<string, string>>((result, field) => {
			const meta = getFieldMeta(field);
			const translation = (meta.translations ?? []).find((entry) =>
				entry.language.toLowerCase().includes(normalizedLocale)
			)?.translation;
			result[field.field] = translation || field.field;
			return result;
		}, {});
	}, [locale, visibleFields]);

	const translationMap = useMemo(() => {
		const normalizedLocale = locale.toLowerCase();
		return translations.reduce<Record<string, string>>((result, item) => {
			const language = item.language.toLowerCase();
			if (!language.startsWith(normalizedLocale)) return result;
			result[item.key] = item.value;
			return result;
		}, {});
	}, [locale, translations]);

	const defaultInitialValues = useMemo(() => {
		return visibleFields.reduce<Record<string, unknown>>((result, field) => {
			result[field.field] = getInitialValue(field);
			return result;
		}, {});
	}, [visibleFields]);
	const [initialValues, setInitialValues] = useState<Record<string, unknown>>(defaultInitialValues);

	const validationSchema = useMemo(() => {
		const shape = visibleFields.reduce<Record<string, any>>((result, field) => {
			const meta = getFieldMeta(field);
			let validator: any;

			if (["integer", "bigInteger", "float", "decimal"].includes(field.type)) {
				validator = number().typeError("error_message.invalid_number");
			} else if (field.type === "boolean") {
				validator = boolean();
			} else {
				validator = string();
			}

			result[field.field] = meta.required
				? validator.required("error_message.required")
				: validator;
			return result;
		}, {});

		return object(shape);
	}, [visibleFields]);

	useEffect(() => {
		setInitialValues(defaultInitialValues);
	}, [defaultInitialValues]);

	useEffect(() => {
		if (!isEditMode || recordId === undefined || recordId === null) return;
		let isActive = true;

		const formatFieldValue = (field: DirectusField, value: unknown) => {
			if (value === null || value === undefined) return getInitialValue(field);
			if (field.type === "date" && typeof value === "string") {
				return value.split("T")[0] ?? value;
			}
			if (field.type === "time" && typeof value === "string") {
				return value.includes("T") ? (value.split("T")[1]?.replace("Z", "") ?? value) : value;
			}
			if (["dateTime", "datetime", "timestamp"].includes(field.type) && typeof value === "string") {
				return value.replace("Z", "").slice(0, 16);
			}
			if (field.type === "json" && typeof value === "object") {
				try {
					return JSON.stringify(value, null, 2);
				} catch {
					return `${value}`;
				}
			}
			return value;
		};

		const loadRecord = async () => {
			try {
				const response = await apiGetItemById<Record<string, unknown>>(collection, recordId);
				const item = response.data ?? {};
				const nextValues = visibleFields.reduce<Record<string, unknown>>((result, field) => {
					const rawValue = item[field.field];
					result[field.field] = formatFieldValue(field, rawValue);
					return result;
				}, {});
				if (isActive) setInitialValues(nextValues);
			} catch (error) {
				console.log(error);
			}
		};

		loadRecord();

		return () => {
			isActive = false;
		};
	}, [collection, isEditMode, recordId, visibleFields]);

	const formik = useFormik({
		initialValues,
		validationSchema,
		enableReinitialize: true,
		onSubmit: async (values) => {
			const payload = Object.entries(values).reduce<Record<string, unknown>>(
				(result, [key, value]) => {
					if (value === "") return result;
					const field = visibleFields.find((item) => item.field === key);
					result[key] = normalizePayloadValue(field, value);
					return result;
				},
				{}
			);

			try {
				if (isEditMode && recordId !== undefined && recordId !== null) {
					await apiUpdateItem(collection, recordId, payload);
					toast.success(
						t("api.update.success", {
							data: t("common_data.record").toLowerCase(),
						})
					);
				} else {
					await apiCreateItem(collection, payload);
					toast.success(
						t("api.create.success", {
							data: t("common_data.record").toLowerCase(),
						})
					);
				}
				router.push(resolvedBaseRoute);
			} catch (error) {
				const errorKey = isEditMode ? "api.update.failed" : "api.create.failed";
				toast.error(
					t(errorKey, {
						data: t("common_data.record").toLowerCase(),
					})
				);
				console.log(error);
			}
		},
	});

	const getSelectOptions = (field: DirectusField): SelectOption[] => {
		const choices = getFieldMeta(field).options?.choices ?? [];
		const resolveChoiceLabel = (choice: { text?: unknown; label?: unknown; value?: unknown }) => {
			const rawLabel = String(choice.text ?? choice.label ?? choice.value ?? "");
			if (rawLabel.startsWith("$t:")) {
				const key = rawLabel.slice(3);
				return translationMap[key] ?? key;
			}
			return rawLabel;
		};
		return choices.map((choice) => ({
			label: resolveChoiceLabel(choice),
			value: String(choice.value),
			noTranslate: true,
		}));
	};

	const handleCheckboxChange = (field: string) => (event: ChangeEvent<HTMLInputElement>) => {
		formik.setFieldValue(field, event.target.checked);
	};

	const renderField = (field: DirectusField) => {
		const meta = getFieldMeta(field);
		const fieldName = field.field;
		const label = fieldLabels[fieldName];
		const value = formik.values[fieldName] as string | number | undefined;
		const touched = formik.touched[fieldName];
		const error = formik.errors[fieldName];
		const errorMessage = touched && typeof error === "string" ? error : "";
		const errorMessageValues = { data: label };
		const resolvedErrorMessage = errorMessage ? t(errorMessage, errorMessageValues) : "";
		const commonProps = {
			id: fieldName,
			name: fieldName,
			label,
			required: Boolean(meta.required),
			noTranslateLabel: true,
			value,
			onChange: formik.handleChange,
			onBlur: formik.handleBlur,
			state: errorMessage ? ("error" as const) : ("default" as const),
			errorMessage,
			errorMessageValues,
		};

		if ((meta.options?.choices ?? []).length > 0) {
			return (
				<SelectForm
					key={fieldName}
					{...commonProps}
					options={getSelectOptions(field)}
					placeholder={t("select.placeholder", { data: label.toLowerCase() })}
				/>
			);
		}

		if (field.type === "boolean") {
			return (
				<label key={fieldName} className="flex items-center gap-2 pl-4">
					<input
						id={fieldName}
						name={fieldName}
						type="checkbox"
						className="form-checkbox checked:!bg-primary-500"
						checked={Boolean(formik.values[fieldName])}
						onChange={handleCheckboxChange(fieldName)}
					/>
					<span className="text-base font-semibold">
						{label}
						{meta.required ? <span className="ml-1 text-danger-500">*</span> : null}
					</span>
				</label>
			);
		}

		if (["text", "json", "csv"].includes(field.type)) {
			return (
				<div key={fieldName} className="flex w-full flex-col gap-1">
					<label className="flex pl-4 text-base font-semibold" htmlFor={fieldName}>
						{label}
						{meta.required ? <span className="ml-1 text-danger-500">*</span> : null}
					</label>
					<textarea
						id={fieldName}
						name={fieldName}
						className="form-textarea ml-4 min-h-24 w-[calc(100%-1rem)]"
						value={String(formik.values[fieldName] ?? "")}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
					/>
					{errorMessage ? (
						<p className="pl-4 text-xs italic text-danger-500">{resolvedErrorMessage}</p>
					) : null}
				</div>
			);
		}

		if (field.type === "date") {
			return (
				<div key={fieldName} className="flex w-full flex-col gap-1">
					<label className="flex text-base font-semibold" htmlFor={fieldName}>
						{label}
						{meta.required ? <span className="ml-1 text-danger-500">*</span> : null}
					</label>
					<div className="pl-4">
						<DatePicker
							date={value || undefined}
							disabled={meta.readonly}
							errorMessage={errorMessage}
							formatDate="yyyy-MM-dd"
							onSelectDate={(nextValue) => {
								formik.setFieldValue(fieldName, nextValue);
								formik.setFieldTouched(fieldName, true, false);
							}}
						/>
					</div>
					{errorMessage ? (
						<p className="pl-4 text-xs italic text-danger-500">{resolvedErrorMessage}</p>
					) : null}
				</div>
			);
		}

		if (["dateTime", "datetime", "timestamp"].includes(field.type)) {
			return (
				<div key={fieldName} className="flex w-full flex-col gap-1">
					<label className="flex text-base font-semibold" htmlFor={fieldName}>
						{label}
						{meta.required ? <span className="ml-1 text-danger-500">*</span> : null}
					</label>
					<div className="pl-4">
						<DateTimePicker
							time={value || undefined}
							disabled={meta.readonly}
							errorMessage={errorMessage}
							formatDateTime="yyyy-MM-dd'T'HH:mm"
							onSelectDateTime={(nextValue) => {
								formik.setFieldValue(fieldName, nextValue);
								formik.setFieldTouched(fieldName, true, false);
							}}
						/>
					</div>
					{errorMessage ? (
						<p className="pl-4 text-xs italic text-danger-500">{resolvedErrorMessage}</p>
					) : null}
				</div>
			);
		}

		const inputType =
			field.type === "time"
				? "time"
				: ["integer", "bigInteger", "float", "decimal"].includes(field.type)
					? "number"
					: "text";

		return (
			<InputForm
				key={fieldName}
				{...commonProps}
				type={inputType}
				placeholder={t("input.placeholder", { data: label.toLowerCase() })}
			/>
		);
	};

	return (
		<DefaultPageLayout
			breadcrumbs={[
				{ key: "data_models", label: "Data Models", noTranslate: true },
				{ key: collection, label: `${collectionLabel}`, noTranslate: true },
				{
					key: mode,
					label: t(`action.${isEditMode ? "edit_record" : "add_record"}`),
					noTranslate: true,
				},
			]}
		>
			<form noValidate className="flex flex-col gap-4" onSubmit={formik.handleSubmit}>
				{visibleFields.map(renderField)}
			</form>
			<div className="flex-end mt-4 flex justify-end gap-2">
				<Button variant="surface" onClick={() => router.push(resolvedBaseRoute)}>
					{t("form.cancel")}
				</Button>
				<Button
					variant="primary"
					onClick={() => formik.handleSubmit()}
					state={formik.isSubmitting ? "loading" : "default"}
				>
					{t("form.save")}
				</Button>
			</div>
		</DefaultPageLayout>
	);
};

export default CollectionRecordPage;
