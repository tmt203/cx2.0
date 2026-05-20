import type { DirectusResponse } from "@type/api.type";
import type { UiSidebarItem } from "@type/api/rest/directus/ui_sidebar_items.type";
import { apiGet } from "@utils/apiConfig";

const TOKEN = process.env.NEXT_PUBLIC_DIRECTUS_TOKEN || "";
const PATH = "/items/ui_sidebar_items";

/**
 * Api get UI pages
 * @param params Record<string, unknown>
 * @returns DirectusResponse<UiSidebarItem[]>
 */
export const apiGetUiSidebarItems = async (params: Record<string, unknown>) => {
	return await apiGet<DirectusResponse<UiSidebarItem[]>>({
		url: PATH,
		token: TOKEN,
		params,
	});
};
