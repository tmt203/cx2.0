import type { AuditInfo } from "@type/common.type";
import * as LucideIcons from "lucide-react";

export type DirectusUiPage = {
	status: string;
	sort: number;
	date_created?: string | null;
	date_updated?: string | null;
	user_created?: string | null;
	user_updated?: string | null;
	key: string;
	route: string;
	title: string;
	translations: Record<string, string> | null;
	description: string | null;
	icon: keyof typeof LucideIcons | null;
	page_type: string | null;
	layout: string | null;
	parent_id: DirectusUiPage | string | null;
	collection: string | null;
	default_field_key: string | null;
	props: Record<string, unknown> | null;
	visibility: Record<string, unknown> | null;
	permissions: Record<string, unknown> | null;
	show_in_sidebar: boolean;
	is_enabled: boolean;
	is_system: boolean;
	order: number;
} & AuditInfo;
