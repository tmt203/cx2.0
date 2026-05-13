import { NextResponse } from "next/server";

import { directusRequest, unwrapDirectusData, type DirectusResponse } from "@api/directus";

interface DemoItem {
	id: string | number;
	title?: string;
	description?: string;
	status?: string;
	created_at?: string;
	[key: string]: unknown;
}

const defaultCollection = process.env.NEXT_PUBLIC_DIRECTUS_DEMO_COLLECTION || "demo_posts";

const getCollection = (request: Request): string => {
	const { searchParams } = new URL(request.url);
	return searchParams.get("collection") || defaultCollection;
};

const getItemId = (request: Request): string | null => {
	const { searchParams } = new URL(request.url);
	return searchParams.get("id");
};

export async function GET(request: Request) {
	const collection = getCollection(request);

	try {
		const response = await directusRequest<DemoItem[] | DirectusResponse<DemoItem[]>>(
			`/items/${collection}?sort=-id&limit=20&fields=*`
		);
		const items = unwrapDirectusData(response);
		return NextResponse.json({ collection, items });
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		return NextResponse.json({ collection, message }, { status: 500 });
	}
}

export async function POST(request: Request) {
	const collection = getCollection(request);

	try {
		const body = (await request.json()) as Partial<DemoItem>;
		const payload = {
			title: body.title || `Demo item ${new Date().toISOString()}`,
			description: body.description || "Created from Next.js UI demo",
			status: body.status || "published",
		};

		const response = await directusRequest<DemoItem | DirectusResponse<DemoItem>>(
			`/items/${collection}`,
			{
				method: "POST",
				body: JSON.stringify(payload),
			}
		);
		const item = unwrapDirectusData(response);
		return NextResponse.json({ collection, item });
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		return NextResponse.json({ collection, message }, { status: 500 });
	}
}

export async function PATCH(request: Request) {
	const collection = getCollection(request);
	const id = getItemId(request);

	if (!id) {
		return NextResponse.json({ message: "Missing id query param" }, { status: 400 });
	}

	try {
		const body = (await request.json()) as Partial<DemoItem>;
		const payload = {
			title: body.title,
			description: body.description,
			status: body.status,
		};

		const response = await directusRequest<DemoItem | DirectusResponse<DemoItem>>(
			`/items/${collection}/${id}`,
			{
				method: "PATCH",
				body: JSON.stringify(payload),
			}
		);
		const item = unwrapDirectusData(response);
		return NextResponse.json({ collection, item });
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		return NextResponse.json({ collection, message }, { status: 500 });
	}
}

export async function DELETE(request: Request) {
	const collection = getCollection(request);
	const id = getItemId(request);

	if (!id) {
		return NextResponse.json({ message: "Missing id query param" }, { status: 400 });
	}

	try {
		await directusRequest<unknown>(`/items/${collection}/${id}`, {
			method: "DELETE",
		});

		return NextResponse.json({ collection, id, deleted: true });
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		return NextResponse.json({ collection, message }, { status: 500 });
	}
}
