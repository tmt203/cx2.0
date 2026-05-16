import { DirectusResponse } from "@type/api.type";
import {
	DirectusField,
	DirectusFieldPayload,
	DirectusFieldQueryParams,
} from "@type/api/rest/directus/field.type";
import { apiDelete, apiGet, apiPatch, apiPost } from "@utils/apiConfig";

const TOKEN = process.env.NEXT_PUBLIC_DIRECTUS_TOKEN || "";
const PATH = "/fields";

/**
 * Api get all fields
 * @returns DirectusResponse<DirectusField[]>
 */
export const apiGetFields = async (params?: DirectusFieldQueryParams) => {
	return await apiGet<DirectusResponse<DirectusField[]>>({
		url: PATH,
		token: TOKEN,
		params,
	});
};

/**
 * Api get fields by collection
 * @param collection string
 * @returns DirectusResponse<DirectusField[]>
 */
export const apiGetFieldsByCollection = async (
	collection: string,
	params?: DirectusFieldQueryParams
) => {
	return await apiGet<DirectusResponse<DirectusField[]>>({
		url: `${PATH}/${collection}`,
		token: TOKEN,
		params,
	});
};

/**
 * Api get field by collection and field name
 * @param collection string
 * @param field string
 * @returns DirectusResponse<DirectusField>
 */
export const apiGetFieldByCollection = async (
	collection: string,
	field: string,
	params?: DirectusFieldQueryParams
) => {
	return await apiGet<DirectusResponse<DirectusField>>({
		url: `${PATH}/${collection}/${field}`,
		token: TOKEN,
		params,
	});
};

/**
 * Api create field for collection
 * @param collection string
 * @param payload DirectusFieldPayload
 * @returns DirectusResponse<DirectusField>
 */
export const apiCreateField = async (collection: string, payload: DirectusFieldPayload) => {
	return await apiPost<DirectusResponse<DirectusField>>({
		url: `${PATH}/${collection}`,
		token: TOKEN,
		body: JSON.stringify(payload),
	});
};

/**
 * Api update field for collection
 * @param collection string
 * @param field string
 * @param payload DirectusFieldPayload
 * @returns DirectusResponse<DirectusField>
 */
export const apiUpdateField = async (
	collection: string,
	field: string,
	payload: Partial<DirectusFieldPayload>
) => {
	return await apiPatch<DirectusResponse<DirectusField>>({
		url: `${PATH}/${collection}/${field}`,
		token: TOKEN,
		body: JSON.stringify(payload),
	});
};

/**
 * Api delete field for collection
 * @param collection string
 * @param field string
 * @returns DirectusResponse<null>
 */
export const apiDeleteField = async (collection: string, field: string) => {
	return await apiDelete<DirectusResponse<null>>({
		url: `${PATH}/${collection}/${field}`,
		token: TOKEN,
	});
};
