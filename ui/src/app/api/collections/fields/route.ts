import { NextResponse } from "next/server";

import { directusRequest, type DirectusResponse, unwrapDirectusData } from "@api/directus";

type DirectusField = {
	field?: string;
	meta?: {
		hidden?: boolean;
		special?: string[] | null;
		display_name?: string | null;
		translations?: Array<{
			language?: string | null;
			translation?: string | null;
		}> | null;
	};
};

type CreateFieldRequest = {
	field?: string;
	type?: string;
	displayName?: string;
	required?: boolean;
	defaultValue?: unknown;
};

const relationSpecials = new Set(["m2o", "o2m", "m2m", "files", "file", "translations"]);

const buildSelection = (field: string, special?: string[] | null) => {
	if (!special?.length) {
		return field;
	}

	return special.some((item) => relationSpecials.has(item)) ? `${field} { id }` : field;
};

const getCollection = (request: Request): string | null => {
	const { searchParams } = new URL(request.url);
	return searchParams.get("collection");
};

const getLocale = (request: Request): string | null => {
	const { searchParams } = new URL(request.url);
	return searchParams.get("locale");
};

const normalizeDefaultValue = (type: string, value: unknown): unknown => {
	if (value === "" || value === undefined || value === null) {
		return undefined;
	}

	if (type === "boolean") {
		if (typeof value === "boolean") {
			return value;
		}

		if (typeof value === "string") {
			const normalized = value.trim().toLowerCase();
			if (normalized === "true") return true;
			if (normalized === "false") return false;
		}
	}

	if (type === "integer") {
		const parsed = Number(value);
		return Number.isNaN(parsed) ? value : Math.trunc(parsed);
	}

	if (type === "float") {
		const parsed = Number(value);
		return Number.isNaN(parsed) ? value : parsed;
	}

	if (type === "json") {
		if (typeof value === "string") {
			try {
				return JSON.parse(value);
			} catch {
				return value;
			}
		}
	}

	return value;
};

export async function GET(request: Request) {
	const collection = getCollection(request);
	const locale = getLocale(request);

	if (!collection) {
		return NextResponse.json({ message: "Missing collection query param" }, { status: 400 });
	}

	try {
		const response = await directusRequest<DirectusResponse<DirectusField[]> | DirectusField[]>(
			`/fields/${collection}`
		);
		const items = unwrapDirectusData(response);
		const fields = items
			.filter((item) => item?.meta?.hidden !== true)
			.map((item) =>
				item.field ? buildSelection(item.field, item.meta?.special ?? undefined) : undefined
			)
			.filter((field): field is string => Boolean(field));

		const labels = items.reduce<Record<string, string>>((acc, item) => {
			if (!item.field) {
				return acc;
			}

			const translation = item.meta?.translations?.find((entry) => {
				if (!locale || !entry?.language) {
					return false;
				}
				return entry.language.toLowerCase().includes(locale.toLowerCase());
			});

			const label =
				translation?.translation?.trim() || item.meta?.display_name?.trim() || item.field;

			acc[item.field] = label;
			return acc;
		}, {});

		return NextResponse.json({ collection, fields, labels });
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		return NextResponse.json({ collection, message }, { status: 500 });
	}
}

export async function POST(request: Request) {
	const collection = getCollection(request);

	if (!collection) {
		return NextResponse.json({ message: "Missing collection query param" }, { status: 400 });
	}

	try {
		const body = (await request.json()) as CreateFieldRequest;
		const field = body.field?.trim();
		const type = body.type?.trim();

		if (!field || !type) {
			return NextResponse.json({ message: "Field name and type are required" }, { status: 400 });
		}

		const defaultValue = normalizeDefaultValue(type, body.defaultValue);
		const meta = {
			display_name: body.displayName?.trim() || undefined,
			required: body.required ?? undefined,
		};
		const schema = {
			is_nullable: body.required === undefined ? undefined : !body.required,
			default_value: defaultValue,
		};
		const payload = {
			field,
			type,
			meta: Object.values(meta).some((value) => value !== undefined) ? meta : undefined,
			schema: Object.values(schema).some((value) => value !== undefined) ? schema : undefined,
		};

		const response = await directusRequest<DirectusResponse<DirectusField> | DirectusField>(
			`/fields/${collection}`,
			{
				method: "POST",
				body: JSON.stringify(payload),
			}
		);

		const item = unwrapDirectusData(response);
		return NextResponse.json({ collection, field: item });
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		return NextResponse.json({ collection, message }, { status: 500 });
	}
}
