"use client";

import DefaultPageLayout from "@components/shared/templates/DefaultPageLayout";
import type { UiPage } from "@type/api/rest/directus/ui_pages.type";

export interface DashboardPageProps {
	page?: UiPage;
}

const DashboardPage = ({ page }: DashboardPageProps) => {
	return (
		<DefaultPageLayout
			breadcrumbs={[
				{
					key: page?.key ?? "dashboard",
					label: page?.title ?? "Dashboard",
					noTranslate: true,
				},
			]}
		>
			<div>Dashboard</div>
		</DefaultPageLayout>
	);
};

export default DashboardPage;
