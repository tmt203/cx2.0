"use client";

import type { DirectusCollection } from "@type/api/graphql/collections.type";
import type { DirectusField } from "@type/api/rest/directus/field.type";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

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

	collectionSchemas: Record<string, CollectionSchema>;
	setCollectionSchema: (collection: string, schema: CollectionSchema) => void;
	setCollectionSchemas: (schemas: Record<string, CollectionSchema>) => void;
	clearCollectionSchema: (collection?: string) => void;

	tableStateByKey: Record<string, TableState>;
	setTableState: (key: string, next: TableState | ((prev: TableState) => TableState)) => void;
	clearTableState: (key?: string) => void;

	uiPreferences: UiPreferences;
	setLocale: (locale: string) => void;
	setTheme: (theme: UiPreferences["theme"]) => void;
	setColumnVisibility: (key: string, visibility: Record<string, boolean>) => void;
	clearColumnVisibility: (key?: string) => void;
};

const initialState = {
	sidebar: { open: false, expanded: false },
	fields: [],
	collections: [],
	collectionSchemas: {},
	tableStateByKey: {},
	uiPreferences: { locale: undefined, theme: "system", columnVisibility: {} },
} satisfies Pick<
	AppStoreState,
	"sidebar" | "collectionSchemas" | "collections" | "fields" | "tableStateByKey" | "uiPreferences"
>;

export const useAppStore = create<AppStoreState>()(
	persist(
		(set) => ({
			...initialState,
			setSidebarOpen: (open) =>
				set((state) => ({
					sidebar: {
						...state.sidebar,
						open: typeof open === "function" ? open(state.sidebar.open) : open,
					},
				})),
			setSidebarExpanded: (expanded) =>
				set((state) => ({ sidebar: { ...state.sidebar, expanded } })),

			setFields: (fields) => set(() => ({ fields })),
			clearFields: () => set(() => ({ fields: [] })),

			setCollections: (collections) => set(() => ({ collections })),
			clearCollections: () => set(() => ({ collections: [] })),

			setCollectionSchema: (collection, schema) =>
				set((state) => ({
					collectionSchemas: { ...state.collectionSchemas, [collection]: schema },
				})),
			setCollectionSchemas: (schemas) => set(() => ({ collectionSchemas: schemas })),
			clearCollectionSchema: (collection) =>
				set((state) => {
					if (!collection) {
						return { collectionSchemas: {} };
					}
					const { [collection]: _removed, ...rest } = state.collectionSchemas;
					return { collectionSchemas: rest };
				}),

			setTableState: (key, next) =>
				set((state) => ({
					tableStateByKey: {
						...state.tableStateByKey,
						[key]: typeof next === "function" ? next(state.tableStateByKey[key] || {}) : next,
					},
				})),
			clearTableState: (key) =>
				set((state) => {
					if (!key) {
						return { tableStateByKey: {} };
					}
					const { [key]: _removed, ...rest } = state.tableStateByKey;
					return { tableStateByKey: rest };
				}),

			setLocale: (locale) =>
				set((state) => ({
					uiPreferences: { ...state.uiPreferences, locale },
				})),
			setTheme: (theme) =>
				set((state) => ({
					uiPreferences: { ...state.uiPreferences, theme },
				})),
			setColumnVisibility: (key, visibility) =>
				set((state) => ({
					uiPreferences: {
						...state.uiPreferences,
						columnVisibility: {
							...state.uiPreferences.columnVisibility,
							[key]: visibility,
						},
					},
				})),
			clearColumnVisibility: (key) =>
				set((state) => {
					if (!key) {
						return {
							uiPreferences: { ...state.uiPreferences, columnVisibility: {} },
						};
					}
					const { [key]: _removed, ...rest } = state.uiPreferences.columnVisibility;
					return {
						uiPreferences: { ...state.uiPreferences, columnVisibility: rest },
					};
				}),
		}),
		{
			name: "cx-app-store",
			version: 1,
			storage: createJSONStorage(() => localStorage),
			partialize: (state) => ({
				sidebar: state.sidebar,
				collectionSchemas: state.collectionSchemas,
				collections: state.collections,
				fields: state.fields,
				tableStateByKey: state.tableStateByKey,
				uiPreferences: state.uiPreferences,
			}),
		}
	)
);
