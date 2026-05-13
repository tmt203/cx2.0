"use client";

import { useEffect } from "react";
import type { DirectusCollection } from "@type/api/graphql/collections.type";
import { useAppStore } from "@lib/store/appStore";
import { Sidebar } from "../organisms";
import type { SidebarMenu } from "../organisms/Sidebar";

interface AppLayoutTemplateClientProps {
	children: React.ReactNode;
	menu: SidebarMenu[];
	collections: DirectusCollection[];
}

const AppLayoutTemplateClient = ({ children, menu, collections }: AppLayoutTemplateClientProps) => {
	const setCollections = useAppStore((state) => state.setCollections);

	useEffect(() => {
		if (collections?.length) {
			setCollections(collections);
		}
	}, [collections, setCollections]);

	return (
		<div className="flex h-[100vh] overflow-hidden">
			<Sidebar menu={menu} />

			<div className="relative flex h-full w-full flex-col overflow-hidden">{children}</div>
		</div>
	);
};

export default AppLayoutTemplateClient;
