import Link from "next/link";
import ComponentPageLayout from "@components/shared/templates/ComponentPageLayout";
import type { BreadcrumbItem } from "@components/shared/atoms/Breadcrumb";
import { componentGroups, getComponentsByGroup, getSidebarGroups } from "./componentCatalog";

const breadcrumbs: BreadcrumbItem[] = [
	{ key: "components", label: "Components", url: "/components", noTranslate: true },
];

const ComponentShowcaseIndex = () => {
	const sidebarGroups = getSidebarGroups();

	return (
		<ComponentPageLayout breadcrumbs={breadcrumbs} sidebarGroups={sidebarGroups}>
			<div className="space-y-8">
				<div>
					<p className="text-sm text-gray-600 dark:text-gray-300">
						Explore reusable UI building blocks. Pick a component from the left or browse by group.
					</p>
				</div>

				{componentGroups.map((group) => {
					const items = getComponentsByGroup(group.key);
					if (!items.length) return null;

					return (
						<section key={group.key} className="space-y-3">
							<div className="flex items-center justify-between">
								<h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
									{group.label}
								</h2>
								<span className="text-xs uppercase tracking-wide text-gray-400">
									{items.length} items
								</span>
							</div>

							<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
								{items.map((item) => (
									<Link
										key={item.key}
										href={`/components/${item.key}`}
										className="group rounded-lg border border-gray-200 bg-white p-4 transition hover:border-primary-200 hover:shadow-sm dark:border-surface-400/30 dark:bg-gray-900/20"
									>
										<h3 className="text-base font-semibold text-gray-800 group-hover:text-primary-700 dark:text-gray-100 dark:group-hover:text-primary-300">
											{item.name}
										</h3>
										<p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
											{item.description}
										</p>
										<span className="mt-3 inline-flex text-xs font-medium uppercase tracking-wide text-gray-400">
											{group.label}
										</span>
									</Link>
								))}
							</div>
						</section>
					);
				})}
			</div>
		</ComponentPageLayout>
	);
};

export default ComponentShowcaseIndex;
