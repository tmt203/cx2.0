import CollectionPage from "@components/shared/pages/collections/CollectionPage";

export const metadata = {
	title: "CX2.0 - Collections",
	description: "Collections page of CX2.0",
};

interface Props {
	params: Promise<{ slug: string[] }>;
}

/**
 * Collections
 * @path /collections
 */
const Collections = async ({ params }: Props) => {
	const { slug } = await params;
	const collection = slug[0];
	const recordId = slug[1];

	return <CollectionPage collection={collection} recordId={recordId} />;
};

export default Collections;
