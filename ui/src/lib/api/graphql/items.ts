import { graphqlQuery } from "@lib/api/graphql/client";

export type CollectionItemsQueryParams = {
	collection: string;
	fields?: string[];
	limit?: number;
	offset?: number;
	sort?: string[];
	filter?: Record<string, unknown>;
	fetchPolicy?: "cache-first" | "network-only" | "no-cache";
};

export type CollectionItemsResult<T> = {
	items: T[];
	total: number;
};

const buildCollectionItemsQuery = (collection: string, fields: string[]) => {
	const selection = fields.length ? fields.join("\n") : "id";
	return `
		query ($limit: Int, $offset: Int, $sort: [String], $filter: ${collection}_filter) {
			items: ${collection}(limit: $limit, offset: $offset, sort: $sort, filter: $filter) {
				${selection}
			}
			items_aggregated: ${collection}_aggregated(filter: $filter) {
				count {
					id
				}
			}
		}
	`;
};

export async function fetchCollectionItems<T extends Record<string, unknown>>(
	params: CollectionItemsQueryParams
): Promise<CollectionItemsResult<T>> {
	const fields = params.fields && params.fields.length ? params.fields : ["id"];
	const query = buildCollectionItemsQuery(params.collection, fields);

	const data = await graphqlQuery<{
		items: T[];
		items_aggregated?: { count?: { id?: number } };
	}>(
		query,
		{
			limit: params.limit,
			offset: params.offset,
			sort: params.sort,
			filter: params.filter,
		},
		{ fetchPolicy: params.fetchPolicy }
	);

	const aggregated = Array.isArray(data.items_aggregated)
		? data.items_aggregated[0]
		: data.items_aggregated;

	return {
		items: data.items || [],
		total: aggregated?.count?.id ?? 0,
	};
}
