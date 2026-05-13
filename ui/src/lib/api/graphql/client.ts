import { type FetchPolicy, gql } from "@apollo/client";
import { getApolloClient } from "@lib/api/graphql/apollo";

export type GraphqlRequestOptions = {
	system?: boolean;
	fetchPolicy?: FetchPolicy;
};

export async function graphqlQuery<T>(
	query: string,
	variables?: Record<string, unknown>,
	options?: GraphqlRequestOptions
): Promise<T> {
	const client = getApolloClient({ system: options?.system });

	try {
		const result = await client.query<T>({
			query: gql(query),
			variables,
			fetchPolicy: options?.fetchPolicy,
		});

		if (!result.data) {
			throw new Error("Directus GraphQL error: Missing data");
		}

		return result.data;
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(`Directus GraphQL error: ${error.message}`);
		}

		throw error;
	}
}

export const directusGraphqlRequest = graphqlQuery;
