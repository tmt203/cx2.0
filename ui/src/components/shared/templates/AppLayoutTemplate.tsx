import { graphqlQuery } from "@lib/api/graphql";
import type { DirectusCollection } from "@type/api/graphql/collections.type";
import { getLocale } from "next-intl/server";
import type { GroupMenu } from "../molecules/SidebarMenu";
import type { SidebarMenu } from "../organisms/Sidebar";
import AppLayoutTemplateClient from "./AppLayoutTemplateClient";
import { apiGetCollections } from "@api/rest/directus/collections";
import { DirectusField } from "@type/api/rest/directus/field.type";
import { apiGetFields } from "@api/rest/directus/fields";

interface AppLayoutTemplateProps {
	children: React.ReactNode;
}

const COLLECTIONS_QUERY = `
	query {
		collections {
			collection
			meta {
				hidden
				translations
			}
		}
	}
`;

const getCollectionLabel = (collection: DirectusCollection, locale: string) => {
	const translations = collection.meta?.translations;

	if (Array.isArray(translations)) {
		const match = translations.find((item) =>
			item?.language?.toLowerCase().includes(locale.toLowerCase())
		);
		return match?.translation || collection.collection;
	}

	return collection.collection;
};

const mapCollectionSubGroups = (
	collections: DirectusCollection[],
	locale: string
): Omit<GroupMenu, "icon" | "subGroups">[] =>
	// Filter out hidden collections and "directus_" prefixed collections
	collections
		.filter(
			(collection) => !collection.meta?.hidden && !collection.collection.startsWith("directus_")
		)
		.map((collection) => ({
			id: collection.collection,
			groupId: collection.collection,
			label: getCollectionLabel(collection, locale),
			href: `/collections/${collection.collection}`,
			noTranslate: true,
		}));

const AppLayoutTemplate = async ({ children }: AppLayoutTemplateProps) => {
	const locale = await getLocale();

	let collectionSubGroups: Omit<GroupMenu, "icon" | "subGroups">[] = [];
	let collections: DirectusCollection[] = [];
	let fields: DirectusField[] = [];

	try {
		const response = await apiGetCollections();
		collections = response.data || [];

		// Mapping for sidebar menu
		collectionSubGroups = mapCollectionSubGroups(collections, locale);
	} catch (error) {
		console.error("Error fetching collections:", error);
	}

	try {
		const response = await apiGetFields();
		fields = response.data || [];
	} catch (error) {
		console.error("Error fetching fields:", error);
	}

	const menu: SidebarMenu[] = [
		{
			groups: [
				{
					icon: "CircleGauge",
					id: "dashboard",
					groupId: "dashboard",
					label: "sidebar.dashboard",
					href: "/dashboard",
				},
				{
					icon: "ChartNoAxesColumn",
					id: "workspace",
					groupId: "workspace",
					label: "sidebar.workspace",
					href: "/workspace",
				},
				{
					icon: "AlignStartVertical",
					id: "campaigns",
					groupId: "campaigns",
					label: "sidebar.campaigns",
					href: "/campaigns",
				},
				{
					icon: "ChartArea",
					id: "analytics",
					groupId: "analytics",
					label: "sidebar.analytics",
					href: "/analytics",
				},
				{
					icon: "Workflow",
					id: "automation",
					groupId: "automation",
					label: "sidebar.automation",
					href: "/automation",
				},
				{
					icon: "Settings",
					id: "settings",
					groupId: "settings",
					label: "sidebar.settings",
					href: "/settings",
				},
				{
					icon: "Library",
					id: "collections",
					groupId: "collections",
					label: "sidebar.collections",
					href: "/collections",
					subGroups: collectionSubGroups,
				},
			],
		},
	];

	return (
		<AppLayoutTemplateClient menu={menu} collections={collections} fields={fields}>
			{children}
		</AppLayoutTemplateClient>
	);
};

export default AppLayoutTemplate;
