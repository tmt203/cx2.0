import { DirectusResponse } from "@type/api.type";
import { DirectusCollection } from "@type/api/rest/directus/collection.type";
import { apiGet } from "@utils/apiConfig";

const TOKEN = process.env.NEXT_PUBLIC_DIRECTUS_TOKEN || "";
const PATH = "/collections";

/**
 * Api get collections
 * @returns DirectusResponse<DirectusCollection[]>
 */
export const apiGetCollections = async () => {
	return await apiGet<DirectusResponse<DirectusCollection[]>>({
		url: PATH,
		token: TOKEN,
	});
};
