import { DirectusResponse } from "@type/api.type";
import { DirectusItemQueryParams, DirectusItemsResponse } from "@type/api/rest/directus/items.type";
import { apiDelete, apiGet, apiPatch, apiPost } from "@utils/apiConfig";

const TOKEN = process.env.NEXT_PUBLIC_DIRECTUS_TOKEN || "";
const PATH = "/items";

/**
 * Api list all items in a collection
 * @param collection string
 * @param params DirectusItemQueryParams
 * @returns DirectusResponse<DirectusItemsResponse<T>>
 */
export const apiGetItems = async <T = Record<string, unknown>>(
	collection: string,
	params?: DirectusItemQueryParams
) => {
	return await apiGet<DirectusResponse<DirectusItemsResponse<T>[]>>({
		url: `${PATH}/${collection}`,
		token: TOKEN,
		params,
	});
};

/**
 * Api get single item
 * @param collection string
 * @param id string | number
 * @param params DirectusItemQueryParams
 * @returns DirectusResponse<T>
 */
export const apiGetItemById = async <T = Record<string, unknown>>(
	collection: string,
	id: string | number,
	params?: DirectusItemQueryParams
) => {
	return await apiGet<DirectusResponse<T>>({
		url: `${PATH}/${collection}/${id}`,
		token: TOKEN,
		params,
	});
};

/**
 * Api create item
 * @param collection string
 * @param payload Partial<T>
 * @returns DirectusResponse<T>
 */
export const apiCreateItem = async <T = Record<string, unknown>>(
	collection: string,
	payload: Partial<T>
) => {
	return await apiPost<DirectusResponse<T>>({
		url: `${PATH}/${collection}`,
		token: TOKEN,
		body: JSON.stringify(payload),
	});
};

/**
 * Api update item
 * @param collection string
 * @param id string | number
 * @param payload Partial<T>
 * @returns DirectusResponse<T>
 */
export const apiUpdateItem = async <T = Record<string, unknown>>(
	collection: string,
	id: string | number,
	payload: Partial<T>
) => {
	return await apiPatch<DirectusResponse<T>>({
		url: `${PATH}/${collection}/${id}`,
		token: TOKEN,
		body: JSON.stringify(payload),
	});
};

/**
 * Api delete item
 * @param collection string
 * @param id string | number
 * @returns DirectusResponse<null>
 */
export const apiDeleteItem = async (collection: string, id: string | number) => {
	return await apiDelete<DirectusResponse<null>>({
		url: `${PATH}/${collection}/${id}`,
		token: TOKEN,
	});
};
