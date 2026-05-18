import { AUDIT_FIELDS } from "@constants/dynamicForm";
import type { DirectusField } from "@type/api/rest/directus/field.type";
import type { FieldMeta } from "@type/form.type";

export const getFieldMeta = (field: DirectusField) => (field.meta ?? {}) as FieldMeta;

export const isGeneratedField = (field: DirectusField) => {
	const meta = getFieldMeta(field);
	const schema = field.schema ?? {};
	return (
		AUDIT_FIELDS.includes(field.field) ||
		field.type === "alias" ||
		meta.hidden ||
		meta.readonly ||
		schema.is_primary_key === true ||
		schema.has_auto_increment === true
	);
};

export const getInitialValue = (field: DirectusField) => {
	const schema = field.schema ?? {};
	if (schema.default_value !== undefined && schema.default_value !== null)
		return schema.default_value;
	if (field.type === "boolean") return false;
	if (field.type === "json") return "";
	return "";
};

export const normalizePayloadValue = (field: DirectusField | undefined, value: unknown) => {
	if (!field) return value;
	if (["integer", "bigInteger", "float", "decimal"].includes(field.type) && value !== "") {
		return Number(value);
	}
	if (field.type === "boolean") {
		if (value === "true") return true;
		if (value === "false") return false;
	}
	if (field.type === "json" && typeof value === "string") {
		try {
			return JSON.parse(value);
		} catch {
			return value;
		}
	}
	return value;
};
