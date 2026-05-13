import { graphqlQuery } from "@lib/api/graphql";
import type { DirectusCollection } from "@type/api/graphql/collections.type";
import { getLocale } from "next-intl/server";
import type { GroupMenu } from "../molecules/SidebarMenu";
import type { SidebarMenu } from "../organisms/Sidebar";
import AppLayoutTemplateClient from "./AppLayoutTemplateClient";

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

	try {
		const data = await graphqlQuery<{ collections: DirectusCollection[] }>(
			COLLECTIONS_QUERY,
			undefined,
			{ system: true }
		);
		collections = data.collections || [];
		collectionSubGroups = mapCollectionSubGroups(collections, locale);
	} catch (error) {
		console.error("Error fetching collections:", error);
	}

	const menu: SidebarMenu[] = [
		{
			groupName: "sidebar.dashboard",
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
					id: "statistics",
					groupId: "statistics",
					label: "sidebar.statistics",
					href: "/report",
				},
			],
		},
		{
			groupName: "sidebar.operation",
			groups: [
				{
					icon: "BookMinus",
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
		<AppLayoutTemplateClient menu={menu} collections={collections}>
			{children}
		</AppLayoutTemplateClient>
	);
};

export default AppLayoutTemplate;
