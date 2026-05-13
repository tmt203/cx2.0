import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

export type ApolloClientOptions = {
	system?: boolean;
};

const directusBaseUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://localhost:8055";

const buildGraphqlUrl = (system?: boolean) =>
	`${directusBaseUrl}${system ? "/graphql/system" : "/graphql"}`;

const createApolloClient = (options?: ApolloClientOptions) => {
	const httpLink = new HttpLink({ uri: buildGraphqlUrl(options?.system) });
	const authLink = setContext((_, { headers }) => {
		const token = process.env.DIRECTUS_STATIC_TOKEN;

		return {
			headers: {
				...headers,
				...(token ? { Authorization: `Bearer ${token}` } : {}),
			},
		};
	});

	return new ApolloClient({
		link: authLink.concat(httpLink),
		cache: new InMemoryCache(),
		ssrMode: typeof window === "undefined",
	});
};

const browserClients = new Map<string, ApolloClient>();

export const getApolloClient = (options?: ApolloClientOptions) => {
	if (typeof window === "undefined") {
		return createApolloClient(options);
	}

	const key = options?.system ? "system" : "default";
	const existing = browserClients.get(key);

	if (existing) {
		return existing;
	}

	const client = createApolloClient(options);
	browserClients.set(key, client);
	return client;
};
