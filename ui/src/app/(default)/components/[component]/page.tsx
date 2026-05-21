import ComponentShowcaseDetail from "@components/shared/pages/components/ComponentShowcaseDetail";

interface ComponentDetailPageProps {
	params: Promise<{ component: string }>;
}

const ComponentDetailPage = async ({ params }: ComponentDetailPageProps) => {
	const { component } = await params;
	return <ComponentShowcaseDetail componentKey={component} />;
};

export default ComponentDetailPage;
