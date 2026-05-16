"use client";

import { apiGetUIPages } from "@api/rest/directus/ui_pages.api";
import { DirectusUiPage } from "@type/api/rest/directus/ui_pages.type";
import * as LucideIcons from "lucide-react";
import { useLocale } from "next-intl";
import { useCallback, useLayoutEffect, useState } from "react";
import { Sidebar } from "../organisms";
import { SidebarMenu } from "../organisms/Sidebar";
import type { GroupMenu } from "../molecules/SidebarMenu";
import { apiGetFields } from "@api/rest/directus/fields.api";
import { useAppStore } from "@/src/lib/store/appStore";
import { apiGetCollections } from "@api/rest/directus/collections";

export interface AppLayoutTemplateProps {
	children: React.ReactNode;
}

/**
 * App Layout Template Component
 * @Props AppLayoutTemplateProps
 */
const AppLayoutTemplate = ({ children }: AppLayoutTemplateProps) => {
	const appStore = useAppStore();

	// Hooks
	const locale = useLocale();

	// States
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [pages, setPages] = useState<DirectusUiPage[]>([]);
	const [menu, setMenu] = useState<SidebarMenu[]>([
		{
			groupName: "",
			groups: [],
		},
	]);

	/**
	 * Mapping to sidebar menu
	 * @param data DirectusUiPage[]
	 */
	const mappingToSidebarMenu = useCallback(
		(data: DirectusUiPage[]) => {
			if (!data || data.length === 0) {
				setMenu([]);
				return;
			}

			const getParentId = (parent: DirectusUiPage["parent_id"]): string | null => {
				if (!parent) return null;
				if (typeof parent === "string") return parent;
				return parent.id;
			};

			const sortedData = data
				.filter((item) => item.show_in_sidebar && item.is_enabled)
				.sort((a, b) => a.order - b.order);

			const childrenByParentId = sortedData.reduce<Record<string, DirectusUiPage[]>>(
				(acc, item) => {
					const parentId = getParentId(item.parent_id);
					if (!parentId) return acc;

					if (!acc[parentId]) {
						acc[parentId] = [];
					}
					acc[parentId].push(item);
					return acc;
				},
				{}
			);

			const topLevelItems = sortedData.filter((item) => !getParentId(item.parent_id));

			const resolveIcon = (icon?: string | null): keyof typeof LucideIcons => {
				if (icon && icon in LucideIcons) {
					return icon as keyof typeof LucideIcons;
				}
				return "Circle";
			};

			const resolveLabel = (item: DirectusUiPage): string => {
				return item.translations?.[locale] || item.title;
			};

			const groupMenu: GroupMenu[] = topLevelItems.map((item) => {
				const label = resolveLabel(item);
				const children = childrenByParentId[item.id] ?? [];
				const baseMenu: GroupMenu = {
					id: item.id,
					label,
					groupId: item.key,
					icon: resolveIcon(item.icon),
					href: item.route,
					noTranslate: true,
				};

				if (!children.length) {
					return baseMenu;
				}

				return {
					...baseMenu,
					subGroups: children.map((child) => ({
						id: child.id,
						label: resolveLabel(child),
						groupId: child.key,
						href: child.route,
						noTranslate: true,
					})),
				};
			});

			setMenu([
				{
					groupName: "",
					groups: groupMenu,
				},
			]);
		},
		[locale]
	);

	/**
	 * Handle get UI pages
	 */
	const handleGetUiPages = useCallback(async () => {
		try {
			setIsLoading(true);
			const response = await apiGetUIPages();
			if (!response || response.data.length === 0) return;
			setPages(response.data);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	}, []);

	/**
	 * Handle get all fields
	 */
	const handleGetAllFields = useCallback(async () => {
		try {
			const response = await apiGetFields();
			if (!response || response.data.length === 0) return;
			appStore.setFields(response.data);
		} catch (error) {
			console.log(error);
		}
	}, []);

	/**
	 * Handle get collections
	 */
	const handleGetCollections = useCallback(async () => {
		try {
			const response = await apiGetCollections();
			if (!response || response.data.length === 0) return;
			appStore.setCollections(response.data);
		} catch (error) {
			console.log(error);
		}
	}, []);

	/**
	 * Retrieve data to app store
	 */
	const retrieveDataAppStore = useCallback(() => {
		void Promise.all([handleGetAllFields(), handleGetCollections()]);
	}, [handleGetAllFields, handleGetCollections]);

	// Get UI pages when first load
	useLayoutEffect(() => {
		handleGetUiPages();
	}, [handleGetUiPages]);

	// Load shared data into the app store when first load
	useLayoutEffect(() => {
		retrieveDataAppStore();
	}, [retrieveDataAppStore]);

	// Mapping to sidebar menu when pages or locale changes
	useLayoutEffect(() => {
		if (!pages.length) return;
		mappingToSidebarMenu(pages);
	}, [pages, locale]);

	return (
		<div className="flex h-[100vh] overflow-hidden">
			<Sidebar menu={menu} />

			<div className="relative flex h-full w-full flex-col overflow-hidden">{children}</div>
		</div>
	);
};

export default AppLayoutTemplate;
