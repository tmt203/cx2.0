import { DirectusResponse } from "@type/api.type";
import { DirectusTranslation } from "@type/api/rest/directus/translations.type";
import { apiGet } from "@utils/apiConfig";

const TOKEN = process.env.NEXT_PUBLIC_DIRECTUS_TOKEN || "";
const PATH = "/translations";

/**
 * Api get translations
 * @returns DirectusResponse<DirectusTranslation[]>
 */
export const apiGetTranslations = async () => {
	return await apiGet<DirectusResponse<DirectusTranslation[]>>({
		url: PATH,
		token: TOKEN,
	});
};
