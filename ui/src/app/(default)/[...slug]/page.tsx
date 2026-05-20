import PageResolver from "@components/shared/pages/PageResolver";

export const dynamic = "force-dynamic";

interface DynamicPageProps {
	params: Promise<{ slug: string[] }>;
}

/**
 * Dynamic Page
 * @props DynamicPageProps
 */
const DynamicPage = async ({ params }: DynamicPageProps) => {
	const { slug } = await params;
	return <PageResolver slug={slug} />;
};

export default DynamicPage;
