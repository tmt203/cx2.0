const directusBaseUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://localhost:8055";

const buildHeaders = (init?: RequestInit): HeadersInit => {
	const token = process.env.DIRECTUS_TOKEN;
	const baseHeaders: HeadersInit = {
		"Content-Type": "application/json",
		...(token ? { Authorization: `Bearer ${token}` } : {}),
	};

	if (!init?.headers) {
		return baseHeaders;
	}

	return {
		...baseHeaders,
		...init.headers,
	};
};

export async function directusRequest<T>(endpoint: string, init?: RequestInit): Promise<T> {
	const response = await fetch(`${directusBaseUrl}${endpoint}`, {
		...init,
		headers: buildHeaders(init),
		next: { revalidate: 10 },
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Directus request failed (${response.status}): ${errorText}`);
	}

	return response.json() as Promise<T>;
}

export interface DirectusResponse<T> {
	data: T;
}

export const unwrapDirectusData = <T>(payload: T | DirectusResponse<T>): T => {
	if (typeof payload === "object" && payload !== null && "data" in payload) {
		return (payload as DirectusResponse<T>).data;
	}

	return payload;
};

export interface DirectusHealth {
	status: string;
}

export async function getDirectusHealth(): Promise<DirectusHealth> {
	const response = await directusRequest<DirectusHealth | DirectusResponse<DirectusHealth>>(
		"/server/health"
	);
	return unwrapDirectusData(response);
}
