import DashboardPage from "./dashboard/DashboardPage";
import type React from "react";
import type { UiPage } from "@type/api/rest/directus/ui_pages.type";

export type CustomPageComponent = React.ComponentType<{ page: UiPage }>;

export const customPageRegistry: Record<string, CustomPageComponent> = {
	dashboard: DashboardPage,
};
