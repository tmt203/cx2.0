import type { AuditInfo } from "@type/common.type";
import type { UiPage } from "./ui_pages.type";

export type UiSidebarItemTranslation = {
	title: string;
};

export type UiSidebarItemTranslations = {
	vi?: UiSidebarItemTranslation;
	en?: UiSidebarItemTranslation;
	[locale: string]: UiSidebarItemTranslation | undefined;
};

export type UiSidebarItem = {
	key: string;
	title: string;
	translations: UiSidebarItemTranslations;
	icon: string | null;
	type: "group" | "collapse" | "item";
	route: string | null;
	page_id: string | UiPage | null;
	parent_id: string | null;
	sort_order: number;
	is_enabled: boolean;
	is_visible: boolean;
	permissions: Record<string, unknown> | null;
	props: Record<string, unknown> | null;
} & AuditInfo;
