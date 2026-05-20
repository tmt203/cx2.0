"use client";

import { apiGetUiSidebarItems } from "@api/rest/directus/ui_sidebar_items.api";
import * as LucideIcons from "lucide-react";
import { useLocale } from "next-intl";
import { useCallback, useLayoutEffect, useState } from "react";
import { Sidebar } from "../organisms";
import { SidebarMenu } from "../organisms/Sidebar";
import type { GroupMenu } from "../molecules/SidebarMenu";
import { apiGetFields } from "@api/rest/directus/fields.api";
import { useAppStore } from "@/src/lib/store/appStore";
import { apiGetCollections } from "@api/rest/directus/collections.api";
import { apiGetTranslations } from "@api/rest/directus/translations.api";
import type { UiSidebarItem } from "@type/api/rest/directus/ui_sidebar_items.type";

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
	const [sidebarItems, setSidebarItems] = useState<UiSidebarItem[]>([]);
	const [menu, setMenu] = useState<SidebarMenu[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	/**
	 * Mapping to sidebar menu
	 * @param data Record<string, unknown>[]
	 */
	const mappingToSidebarMenu = useCallback(
		(data: UiSidebarItem[]) => {
			if (!data || data.length === 0) {
				setMenu([]);
				return;
			}

			const isVisible = (item: UiSidebarItem) =>
				(item.is_enabled ?? true) && (item.is_visible ?? true);
			const getLabel = (item: UiSidebarItem) => item.translations?.[locale]?.title ?? item.title;
			const resolveIcon = (icon?: string | null): keyof typeof LucideIcons | undefined => {
				if (!icon) return undefined;
				return icon in LucideIcons ? (icon as keyof typeof LucideIcons) : undefined;
			};
			const resolveRoute = (item: UiSidebarItem) => {
				if (item.page_id && typeof item.page_id === "object") {
					return item.page_id.route ?? undefined;
				}
				return undefined;
			};
			const sortByOrder = (a: UiSidebarItem, b: UiSidebarItem) =>
				(a.sort_order ?? 0) - (b.sort_order ?? 0);

			const visibleItems = data.filter(isVisible).sort(sortByOrder);
			const byParent = new Map<string | null, UiSidebarItem[]>();
			visibleItems.forEach((item) => {
				const parentId = item.parent_id ?? null;
				const list = byParent.get(parentId) ?? [];
				list.push(item);
				byParent.set(parentId, list);
			});

			const rootItems = (byParent.get(null) ?? []).sort(sortByOrder);
			const groupItems = rootItems.filter((item) => item.type === "group");
			const groupItemsWithChildren = groupItems.filter(
				(item) => (byParent.get(item.id) ?? []).length > 0
			);
			const groupItemsWithoutChildren = groupItems.filter(
				(item) => (byParent.get(item.id) ?? []).length === 0
			);
			const ungroupedRoot = rootItems
				.filter((item) => item.type !== "group")
				.concat(groupItemsWithoutChildren);

			const menus: SidebarMenu[] = groupItemsWithChildren.reduce<SidebarMenu[]>((acc, group) => {
				const children = (byParent.get(group.id) ?? []).sort(sortByOrder);
				const groups: GroupMenu[] = children.map((child) => {
					if (child.type === "collapse") {
						const subGroups = (byParent.get(child.id) ?? []).sort(sortByOrder).map((sub) => ({
							id: sub.id,
							label: getLabel(sub),
							groupId: child.id,
							href: resolveRoute(sub),
							noTranslate: true,
						}));
						return {
							id: child.id,
							label: getLabel(child),
							groupId: group.id,
							icon: resolveIcon(child.icon),
							href: resolveRoute(child),
							noTranslate: true,
							subGroups,
						};
					}

					return {
						id: child.id,
						label: getLabel(child),
						groupId: group.id,
						icon: resolveIcon(child.icon),
						href: resolveRoute(child),
						noTranslate: true,
					};
				});

				if (!groups.length) return acc;
				acc.push({
					groupName: getLabel(group),
					groupNameNoTranslate: true,
					groups,
				});
				return acc;
			}, []);

			if (ungroupedRoot.length) {
				const groups: GroupMenu[] = ungroupedRoot.map((item) => {
					if (item.type === "collapse") {
						const subGroups = (byParent.get(item.id) ?? []).sort(sortByOrder).map((sub) => ({
							id: sub.id,
							label: getLabel(sub),
							groupId: item.id,
							href: resolveRoute(sub),
							noTranslate: true,
						}));
						return {
							id: item.id,
							label: getLabel(item),
							groupId: item.id,
							icon: resolveIcon(item.icon),
							href: resolveRoute(item),
							noTranslate: true,
							subGroups,
						};
					}

					return {
						id: item.id,
						label: getLabel(item),
						groupId: item.id,
						icon: resolveIcon(item.icon),
						href: resolveRoute(item),
						noTranslate: true,
					};
				});

				menus.push({
					groupName: "",
					groupNameNoTranslate: true,
					groups,
				});
			}

			setMenu(menus);
		},
		[locale]
	);

	/**
	 * Handle get UI sidebar items
	 */
	const handleGetUiSidebarItems = useCallback(async () => {
		setIsLoading(true);
		try {
			const pageFields = "*,page_id.key,page_id.route";
			const response = await apiGetUiSidebarItems({ fields: pageFields });
			if (!response || response.data.length === 0) return;
			setSidebarItems(response.data);
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
	 * Handle get translations
	 */
	const handleGetTranslations = useCallback(async () => {
		try {
			const response = await apiGetTranslations();
			if (!response || response.data.length === 0) return;
			appStore.setTranslations(response.data);
		} catch (error) {
			console.log(error);
		}
	}, []);

	/**
	 * Retrieve data to app store
	 */
	const retrieveDataAppStore = useCallback(() => {
		void Promise.all([handleGetAllFields(), handleGetCollections(), handleGetTranslations()]);
	}, [handleGetAllFields, handleGetCollections, handleGetTranslations]);

	// Load shared data into the app store when first load
	useLayoutEffect(() => {
		retrieveDataAppStore();
	}, [retrieveDataAppStore]);

	// Get UI sidebar items when first load
	useLayoutEffect(() => {
		handleGetUiSidebarItems();
	}, [handleGetUiSidebarItems]);

	// Mapping to sidebar menu when items or locale changes
	useLayoutEffect(() => {
		if (!sidebarItems.length) return;
		mappingToSidebarMenu(sidebarItems);
	}, [sidebarItems, locale]);

	return (
		<div className="flex h-[100vh] overflow-hidden">
			<Sidebar menu={menu} />

			<div className="relative flex h-full w-full flex-col overflow-hidden">{children}</div>
		</div>
	);
};

export default AppLayoutTemplate;
