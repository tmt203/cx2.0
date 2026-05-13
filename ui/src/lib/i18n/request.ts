import { getRequestConfig } from "next-intl/server";
import { getUserLocale } from "@lib/services/locale";

export default getRequestConfig(async () => {
	const locale = await getUserLocale();

	const common = await import(`./locales/${locale}/common.json`);
	const component = await import(`./locales/${locale}/component.json`);
	const tenantService = await import(`./locales/${locale}/tenant-service.json`);

	return {
		locale,
		messages: {
			...common,
			...component,
			...tenantService,
		},
	};
});
