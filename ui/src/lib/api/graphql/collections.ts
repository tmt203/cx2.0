import { graphqlQuery } from "@lib/api/graphql/client";
import type { DirectusCollection } from "@type/api/graphql/collections.type";

const COLLECTIONS_QUERY = `
	query {
		collections {
			collection
			meta {
				hidden
				translations
			}
		}
	}
`;

export const fetchCollections = async () => {
	const data = await graphqlQuery<{
		collections: DirectusCollection[];
	}>(COLLECTIONS_QUERY, undefined, { system: true });

	return data.collections;
};
