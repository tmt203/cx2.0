import { notFound } from "next/navigation";
import ComponentPageLayout from "@components/shared/templates/ComponentPageLayout";
import type { BreadcrumbItem } from "@components/shared/atoms/Breadcrumb";
import { componentGroups, getComponentByKey, getSidebarGroups } from "./componentCatalog";
import ComponentShowcasePreview from "./ComponentShowcasePreview";

export interface ComponentShowcaseDetailProps {
	componentKey: string;
}

const ComponentShowcaseDetail = ({ componentKey }: ComponentShowcaseDetailProps) => {
	const component = getComponentByKey(componentKey);

	if (!component) {
		notFound();
	}

	const group = componentGroups.find((item) => item.key === component.group);
	const breadcrumbs: BreadcrumbItem[] = [
		{ key: "components", label: "Components", url: "/components", noTranslate: true },
		{ key: component.key, label: component.name, noTranslate: true },
	];

	return (
		<ComponentPageLayout breadcrumbs={breadcrumbs} sidebarGroups={getSidebarGroups()}>
			<div className="space-y-6">
				<div>
					<div className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">
						{group?.label ?? "Component"}
					</div>
					<h2 className="mt-3 text-2xl font-semibold text-gray-800 dark:text-gray-100">
						{component.name}
					</h2>
					<p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{component.description}</p>
				</div>

				{component.key === "date-time-picker" || component.key === "date-picker" ? (
					<section className="space-y-3">
						<h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">Preview</h3>
						<ComponentShowcasePreview componentKey={component.key} />
					</section>
				) : null}

				<section className="space-y-3">
					<h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">Usage</h3>
					<pre className="overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-800 dark:border-surface-400/30 dark:bg-gray-900/30 dark:text-gray-100">
						<code>{component.usage}</code>
					</pre>
				</section>

				{component.examples?.length ? (
					<section className="space-y-3">
						<h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">Examples</h3>
						<div className="space-y-4">
							{component.examples.map((example, index) => (
								<pre
									key={`${component.key}-example-${index}`}
									className="overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-800 dark:border-surface-400/30 dark:bg-gray-900/30 dark:text-gray-100"
								>
									<code>{example}</code>
								</pre>
							))}
						</div>
					</section>
				) : null}

				<section className="space-y-3">
					<h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">Notes</h3>
					<p className="text-sm text-gray-600 dark:text-gray-300">
						Add your implementation notes, variants, and do/don&apos;t guidelines here.
					</p>
				</section>
			</div>
		</ComponentPageLayout>
	);
};

export default ComponentShowcaseDetail;
