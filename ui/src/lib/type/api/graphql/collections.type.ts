export interface DirectusCollection {
	collection: string;
	meta?: {
		hidden?: boolean | null;
		translations?: Array<{
			language: string;
			translation: string;
		}> | null;
	} | null;
}
