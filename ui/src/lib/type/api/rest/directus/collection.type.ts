export type DirectusCollection = {
	collection: string;
	meta: {
		collection: string;
		icon: string | null;
		note: string | null;
		display_template: string | null;
		hidden: boolean;
		singleton: boolean;
		translations: Array<{
			language: string;
			translation: string;
		}>;
		archive_field: string | null;
		archive_app_filter: boolean;
		archive_value: string | null;
		unarchive_value: string | null;
		sort_field: string | null;
		accountability: string | null;
		color: string | null;
		item_duplication_fields: unknown | null;
		sort: number | null;
		group: string | null;
		collapse: "open" | "closed" | null;
		preview_url: string | null;
		versioning: boolean;
	};
	schema: {
		schema: string;
		name: string;
		comment: string | null;
	};
};
