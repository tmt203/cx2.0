export type Direction = "ltr" | "rtl";
export type Placement = "start" | "end" | "center";
export type Display = "row" | "col";
export type Position = "top" | "bottom" | "left" | "right";
export type Status = "warning" | "info" | "success" | "error";
export type Size = "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";

export type Variant =
	| "primary"
	| "secondary"
	| "success"
	| "danger"
	| "warning"
	| "info"
	| "surface"
	| "light"
	| "dark"
	| "transparent";

export type AuditInfo = {
	id: string;
	created_at: Date | string;
	created_by: string;
	updated_at: Date | string;
	updated_by: string;
};

export type SelectOption = {
	label: string;
	value: string;
	disabled?: boolean;
	notAllowed?: boolean;
	noTranslate?: boolean;
};

export type Param = {
	limit?: number;
	offset?: number;
	meta?: string;
};

export type SearchParams = {
	searchOffset: number;
	limit: number;
	key: string;
};
