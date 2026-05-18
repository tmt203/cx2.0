"use client";

import { apiCreateItem, apiGetItemById, apiUpdateItem } from "@api/rest/directus/items";
import { InputForm, Modal, SelectForm } from "@components/shared/molecules";
import { SelectOption } from "@type/common.type";
import { DirectusField } from "@type/api/rest/directus/field.type";
import { useFormik } from "formik";
import { useLocale, useTranslations } from "next-intl";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { boolean, number, object, string } from "yup";
import {
	getFieldMeta,
	getInitialValue,
	isGeneratedField,
	normalizePayloadValue,
} from "@utils/dynamicForm";

export interface AddRecordModalProps {
	collection: string;
	fields: DirectusField[];
	mode?: "create" | "edit";
	recordId?: string | number;
	isOpen: boolean;
	setIsOpen: (open: boolean) => void;
	onCreated?: () => Promise<void> | void;
	onUpdated?: () => Promise<void> | void;
}

/**
 * Add record modal
 * @props AddRecordModalProps
 */
const AddRecordModal = ({
	collection,
	fields,
	mode = "create",
	recordId,
	isOpen,
	setIsOpen,
	onCreated,
	onUpdated,
}: AddRecordModalProps) => {
	// Hooks
	const t = useTranslations();
	const locale = useLocale();

	const visibleFields = useMemo(() => {
		return [...fields]
			.filter((field) => !isGeneratedField(field))
			.sort((a, b) => {
				const aMeta = getFieldMeta(a);
				const bMeta = getFieldMeta(b);
				return Number(aMeta.order ?? aMeta.sort ?? 0) - Number(bMeta.order ?? bMeta.sort ?? 0);
			});
	}, [fields]);

	console.log("visibleFields", visibleFields);

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

	const isEditMode = mode === "edit";
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
		if (!isOpen || !isEditMode || recordId === undefined || recordId === null) return;
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
	}, [collection, isEditMode, isOpen, recordId, visibleFields]);

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

			if (isEditMode && recordId !== undefined && recordId !== null) {
				await apiUpdateItem(collection, recordId, payload);
				await onUpdated?.();
			} else {
				await apiCreateItem(collection, payload);
				await onCreated?.();
			}
			setIsOpen(false);
		},
	});

	/**
	 * Get select options from field meta
	 * @param field DirectusField
	 */
	const getSelectOptions = (field: DirectusField): SelectOption[] => {
		const choices = getFieldMeta(field).options?.choices ?? [];
		return choices.map((choice) => ({
			label: String(choice.text ?? choice.label ?? choice.value),
			value: String(choice.value),
			noTranslate: true,
		}));
	};

	/**
	 * Handle checkbox change
	 * @param field string
	 */
	const handleCheckboxChange = (field: string) => (event: ChangeEvent<HTMLInputElement>) => {
		formik.setFieldValue(field, event.target.checked);
	};

	/**
	 * Render field based on its type and meta
	 * @param field DirectusField
	 */
	const renderField = (field: DirectusField) => {
		const meta = getFieldMeta(field);
		const fieldName = field.field;
		const label = fieldLabels[fieldName];
		const value = formik.values[fieldName] as string | number | undefined;
		const touched = formik.touched[fieldName];
		const error = formik.errors[fieldName];
		const errorMessage = touched && typeof error === "string" ? error : "";
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
		};

		if ((meta.options?.choices ?? []).length > 0) {
			return (
				<SelectForm
					key={fieldName}
					{...commonProps}
					options={getSelectOptions(field)}
					placeholder=""
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
						<p className="pl-4 text-xs italic text-danger-500">{t(errorMessage)}</p>
					) : null}
				</div>
			);
		}

		const inputType =
			field.type === "date"
				? "date"
				: field.type === "time"
					? "time"
					: ["dateTime", "datetime", "timestamp"].includes(field.type)
						? "datetime-local"
						: ["integer", "bigInteger", "float", "decimal"].includes(field.type)
							? "number"
							: "text";

		return <InputForm key={fieldName} {...commonProps} type={inputType} />;
	};

	return (
		<Modal
			size="lg"
			isOpen={isOpen}
			confirmLabel={t("form.save")}
			confirmClassName="bg-secondary-500"
			title={t(`action.${isEditMode ? "edit_record" : "add_record"}`)}
			setIsOpen={setIsOpen}
			onConfirm={() => formik.handleSubmit()}
			onCancel={() => formik.resetForm()}
		>
			<form noValidate className="flex flex-col gap-4" onSubmit={formik.handleSubmit}>
				{visibleFields.map(renderField)}
			</form>
		</Modal>
	);
};

export default AddRecordModal;
