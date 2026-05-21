import { apiGetUIPages } from "@api/rest/directus/ui_pages.api";
import CollectionPage from "@components/shared/pages/collections/CollectionPage";
import CollectionRecordPage from "@components/shared/pages/collections/CollectionRecordPage";
import { customPageRegistry } from "@components/shared/pages/customPageRegistry";
import { notFound } from "next/navigation";

export interface PageResolverProps {
	slug?: string[];
}

/**
 * Normalize route from slug array
 * @param slug? string[]
 */
const normalizeRoute = (slug?: string[]) => {
	if (!slug?.length) return "/";
	return `/${slug.filter(Boolean).join("/")}`;
};

/**
 * Get all possible route candidates from a given route
 * @param route string
 */
const getRouteCandidates = (route: string) => {
	const segments = route.split("/").filter(Boolean);
	const candidates = [];

	if (!segments.length) return ["/"];

	for (let index = segments.length; index > 0; index -= 1) {
		candidates.push(`/${segments.slice(0, index).join("/")}`);
	}

	return candidates;
};

/**
 * Get matched page from Directus ui_pages based on route candidates
 * @param route string
 */
const getMatchedPage = async (route: string) => {
	try {
		const candidates = getRouteCandidates(route);

		for (const candidate of candidates) {
			const response = await apiGetUIPages({ ["filter[route][_eq]"]: candidate, limit: 1 });
			const page = response?.data?.[0];

			if (page) {
				return {
					page,
					matchedRoute: candidate,
				};
			}
		}

		return null;
	} catch (error) {
		console.error("Failed to fetch ui_pages in SSR", error);
		return null;
	}
};

/**
 * Get trailing segments after matched route to determine collection and record id for collection page
 * @param route string
 * @param matchedRoute string
 */
const getTrailingSegments = (route: string, matchedRoute: string) => {
	const routeSegments = route.split("/").filter(Boolean);
	const matchedSegments = matchedRoute.split("/").filter(Boolean);
	return routeSegments.slice(matchedSegments.length);
};

/**
 * Resolve app pages from Directus ui_pages.
 * @props PageResolverProps
 */
const PageResolver = async ({ slug }: PageResolverProps) => {
	const route = normalizeRoute(slug);
	const matched = await getMatchedPage(route);

	if (!matched || matched.page.is_enabled === false) notFound();

	const { page, matchedRoute } = matched;
	const trailingSegments = getTrailingSegments(route, matchedRoute);

	if (page.page_type === "collection") {
		const collectionFromPage = page.collection_key ?? "";
		const collection = collectionFromPage || trailingSegments[0] || "";
		const recordId = collectionFromPage ? trailingSegments[0] : trailingSegments[1];
		const isCreate = recordId === "new";
		const baseRoute = collectionFromPage ? matchedRoute : `${matchedRoute}/${collection}`;

		if (!collection) notFound();
		if (isCreate) {
			return <CollectionRecordPage collection={collection} mode="create" baseRoute={baseRoute} />;
		}
		if (recordId) {
			return (
				<CollectionRecordPage
					collection={collection}
					mode="edit"
					recordId={recordId}
					baseRoute={baseRoute}
				/>
			);
		}

		return <CollectionPage collection={collection} />;
	}

	if (page.page_type === "custom") {
		const componentKey = page.component_key ?? page.key;
		const Component = componentKey ? customPageRegistry[componentKey] : undefined;

		if (!Component) notFound();

		return <Component page={page} />;
	}

	notFound();
};

export default PageResolver;
