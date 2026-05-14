export type DirectusField = {
	collection: string;
	field: string;
	type: string;
	meta?: Record<string, unknown> | null;
	schema?: Record<string, unknown> | null;
};

export type DirectusFieldPayload = {
	field: string;
	type: string;
	meta?: Record<string, unknown> | null;
	schema?: Record<string, unknown> | null;
};

export type DirectusFieldQueryParams = {
	fields?: string | string[];
	filter?: Record<string, unknown>;
	sort?: string | string[];
	limit?: number;
	offset?: number;
	page?: number;
	search?: string;
	meta?: string | string[];
};
