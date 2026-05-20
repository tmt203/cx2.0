import type { AuditInfo } from "@type/common.type";

export type UiPageTranslation = {
	title?: string | null;
};

export type UiPageTranslations = {
	vi?: UiPageTranslation;
	en?: UiPageTranslation;
	[locale: string]: UiPageTranslation | undefined;
};

export type UiPage = {
	key: string;
	title: string;
	translations?: UiPageTranslations | null;
	page_type: "collection" | "custom";
	route: string;
	icon?: string | null;
	component_key?: string | null;
	collection_key?: string | null;
	layout?: string | null;
	props?: Record<string, unknown> | null;
	permissions?: Record<string, unknown> | null;
	is_enabled?: boolean | null;
	is_system?: boolean | null;
} & AuditInfo;
