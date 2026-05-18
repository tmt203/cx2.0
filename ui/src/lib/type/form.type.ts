export type FieldMeta = {
	hidden?: boolean;
	readonly?: boolean;
	required?: boolean;
	interface?: string;
	options?: {
		choices?: Array<{
			text?: string;
			label?: string;
			value: string | number | boolean;
		}>;
	};
	translations?: Array<{
		language: string;
		translation: string;
	}>;
	order?: number;
	sort?: number;
	width?: string;
	note?: string;
};