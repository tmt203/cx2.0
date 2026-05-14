"use client";

import { useAppStore } from "@lib/store/appStore";
import type { DirectusCollection } from "@type/api/graphql/collections.type";
import type { DirectusField } from "@type/api/rest/directus/field.type";
import { useEffect } from "react";
import { Sidebar } from "../organisms";
import type { SidebarMenu } from "../organisms/Sidebar";

interface AppLayoutTemplateClientProps {
	children: React.ReactNode;
	menu: SidebarMenu[];
	collections: DirectusCollection[];
	fields: DirectusField[];
}

const AppLayoutTemplateClient = ({
	children,
	menu,
	collections,
	fields,
}: AppLayoutTemplateClientProps) => {
	const setCollections = useAppStore((state) => state.setCollections);
	const setFields = useAppStore((state) => state.setFields);

	useEffect(() => {
		if (collections?.length) {
			setCollections(collections);
		}
	}, [collections, setCollections]);

	useEffect(() => {
		if (fields?.length) {
			setFields(fields);
		}
	}, [fields, setFields]);

	return (
		<div className="flex h-[100vh] overflow-hidden">
			<Sidebar menu={menu} />

			<div className="relative flex h-full w-full flex-col overflow-hidden">{children}</div>
		</div>
	);
};

export default AppLayoutTemplateClient;
