export type DirectusItemQueryParams = {
	fields?: string | string[];
	filter?: Record<string, unknown>;
	sort?: string | string[];
	limit?: number;
	offset?: number;
	page?: number;
	search?: string;
	meta?: string | string[];
	deep?: Record<string, unknown>;
	alias?: Record<string, string>;
	[key: string]: unknown;
};

export type DirectusItemsResponse<T> = {
	data: T[];
	meta?: {
		filter_count?: number;
		total_count?: number;
	};
};
