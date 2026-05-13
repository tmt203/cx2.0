export type CollectionFieldResponse = {
	fields: string[];
	labels: Record<string, string>;
};

export async function fetchCollectionFieldNames(
	collection: string,
	locale?: string
): Promise<CollectionFieldResponse> {
	const params = new URLSearchParams({ collection });
	if (locale) {
		params.set("locale", locale);
	}

	const response = await fetch(`/api/collections/fields?${params.toString()}`, {
		cache: "no-store",
	});

	if (!response.ok) {
		const message = await response.text();
		throw new Error(`Failed to load fields: ${message}`);
	}

	const payload = (await response.json()) as Partial<CollectionFieldResponse>;
	return {
		fields: Array.isArray(payload.fields) ? payload.fields.filter(Boolean) : [],
		labels: payload.labels && typeof payload.labels === "object" ? payload.labels : {},
	};
}
