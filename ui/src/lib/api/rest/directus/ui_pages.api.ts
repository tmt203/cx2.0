import type { DirectusResponse } from "@type/api.type";
import type { UiPage } from "@type/api/rest/directus/ui_pages.type";
import { apiGet } from "@utils/apiConfig";

const TOKEN = process.env.NEXT_PUBLIC_DIRECTUS_TOKEN || "";
const PATH = "/items/ui_pages";

/**
 * Api get UI pages
 * @param params Record<string, unknown>
 * @returns DirectusResponse<Record<string, unknown>[]>
 */
export const apiGetUIPages = async (params: Record<string, unknown>) => {
	return await apiGet<DirectusResponse<UiPage[]>>({
		url: PATH,
		token: TOKEN,
		params,
	});
};
