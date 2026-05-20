"use client";

import type { DirectusCollection } from "@type/api/graphql/collections.type";
import type { DirectusField } from "@type/api/rest/directus/field.type";
import type { DirectusTranslation } from "@type/api/rest/directus/translations.type";
import { create } from "zustand";

export type SidebarMetadata = {
	open: boolean;
	expanded: boolean;
};

export type CollectionSchema = {
	fields: unknown[];
	relations: unknown[];
};

export type TableState = {
	filter?: Record<string, unknown>;
	sort?: Array<{ id: string; desc?: boolean }>;
	pagination?: { pageIndex: number; pageSize: number };
};

export type UiPreferences = {
	locale?: string;
	theme?: "light" | "dark" | "system";
	columnVisibility: Record<string, Record<string, boolean>>;
};

export type AppStoreState = {
	sidebar: SidebarMetadata;
	setSidebarOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
	setSidebarExpanded: (expanded: boolean) => void;

	fields: DirectusField[];
	setFields: (fields: DirectusField[]) => void;
	clearFields: () => void;

	collections: DirectusCollection[];
	setCollections: (collections: DirectusCollection[]) => void;
	clearCollections: () => void;

	translations: DirectusTranslation[];
	setTranslations: (translations: DirectusTranslation[]) => void;
	clearTranslations: () => void;
};

const initialState = {
	sidebar: { open: false, expanded: false },
	fields: [],
	collections: [],
	translations: [],
} satisfies Pick<AppStoreState, "sidebar" | "collections" | "fields" | "translations">;

export const useAppStore = create<AppStoreState>()((set) => ({
	...initialState,
	setSidebarOpen: (open) =>
		set((state) => ({
			sidebar: {
				...state.sidebar,
				open: typeof open === "function" ? open(state.sidebar.open) : open,
			},
		})),
	setSidebarExpanded: (expanded) => set((state) => ({ sidebar: { ...state.sidebar, expanded } })),

	setFields: (fields) => set(() => ({ fields })),
	clearFields: () => set(() => ({ fields: [] })),

	setCollections: (collections) => set(() => ({ collections })),
	clearCollections: () => set(() => ({ collections: [] })),

	setTranslations: (translations) => set(() => ({ translations })),
	clearTranslations: () => set(() => ({ translations: [] })),
}));
