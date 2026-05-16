import type { AuditInfo } from "@type/common.type";
import * as LucideIcons from "lucide-react";

export const UI_PAGE_TYPES = [
	"dashboard",
	"workspace",
	"collection_shell",
	"settings",
	"custom",
] as const;

export const UI_PAGE_LAYOUTS = ["default", "dashboard", "list", "settings", "blank"] as const;

export type UiPageType = (typeof UI_PAGE_TYPES)[number];
export type UiPageLayout = (typeof UI_PAGE_LAYOUTS)[number];
export type UiPageTranslations = Record<string, string>;
export type UiPageJsonConfig = Record<string, unknown>;

export type DirectusUiPage = {
	date_created?: string | null;
	date_updated?: string | null;
	user_created?: string | null;
	user_updated?: string | null;
	key: string;
	route: string;
	title: string;
	translations: UiPageTranslations | null;
	description: string | null;
	icon: keyof typeof LucideIcons | null;
	page_type: UiPageType;
	layout: UiPageLayout;
	parent_id?: DirectusUiPage | string | null;
	collection: string | null;
	default_view_key: string | null;
	props: UiPageJsonConfig | null;
	visibility: UiPageJsonConfig | null;
	permissions: UiPageJsonConfig | null;
	show_in_sidebar: boolean;
	is_enabled: boolean;
	is_system: boolean;
	order: number;
} & AuditInfo;
