import { ApiMethod, Request } from "@type/api.type";
import queryString from "query-string";

const API_HOST = process.env.NEXT_PUBLIC_API_HOST ?? "";

/**
 * Handle get request's headers
 * @param token string
 */
const getAuthHeaders = (token: string) => {
	if (!token) throw new Error("No access token found");

	return {
		"Content-Type": "application/json",
		Authorization: `Bearer ${token}`,
	};
};

/**
 * Api request
 * @param request Request
 */
const apiRequest = async <T>(method: ApiMethod, request: Request) => {
	const { url, body, params, token } = request;
	const headers = getAuthHeaders(token);

	const queryParam =
		params && JSON.stringify(params) !== "{}" ? "?" + queryString.stringify(params ?? {}) : "";

	const finalUrl = `${API_HOST}${url}${queryParam}`;
	const options: RequestInit = {
		method,
		headers,
		body,
	};

	const response = await fetch(finalUrl, options);
	if (response.status === 204) return undefined as T;
	const responseText = await response.text();
	if (!responseText) return undefined as T;
	return JSON.parse(responseText) as T;
};

/**
 * Api get data
 * @param token string
 * @param url string
 * @param params Record<string, unknown>
 * @returns Generic Type <T>
 */
export const apiGet = <T>(request: Request) => {
	return apiRequest<T>("GET", { ...request });
};

/**
 * Api Get File
 * @param request Request
 * @returns Response
 */
export const apiGetFile = async (request: Request) => {
	const { url, body, params, token } = request;

	const headers = getAuthHeaders(token);
	const queryParam =
		JSON.stringify(params) !== "{}" ? "?" + queryString.stringify(params ?? {}) : "";

	const finalUrl = `${API_HOST}${url}${queryParam}`;
	const options: RequestInit = {
		method: "GET",
		headers,
		body,
	};

	const response = await fetch(finalUrl, options);
	return response;
};

/**
 * Api post data
 * @param token string
 * @param url string
 * @param body Record<string, unknown>
 * @param params Record<string, unknown>
 * @returns Generic Type <T>
 */
export async function apiPost<T>(request: Request) {
	return apiRequest<T>("POST", request);
}

/**
 * Api post file
 * @param request Request
 * @returns Generic Type <T>
 */
export async function apiPostFile<T>(request: Request) {
	const { url, body, params, token } = request;
	const headers = {
		Authorization: `Bearer ${token}`,
	};
	const queryParam =
		params && JSON.stringify(params) !== "{}" ? "?" + queryString.stringify(params ?? {}) : "";

	const finalUrl = `${API_HOST}${url}${queryParam}`;
	const options: RequestInit = {
		method: "POST",
		headers,
		body,
	};

	const response = await fetch(finalUrl, options);
	return response.json() as T;
}

/**
 * Api update data
 * @param token string
 * @param url string
 * @param body Record<string, unknown>
 * @param params Record<string, unknown>
 * @returns Generic Type <T>
 */
export async function apiPut<T>(request: Request) {
	return apiRequest<T>("PUT", request);
}

/**
 * Api delete data
 * @param token string
 * @param url string
 * @param params Record<string, unknown>
 * @returns Generic Type <T>
 */
export async function apiDelete<T>(request: Request) {
	return apiRequest<T>("DELETE", request);
}

/**
 * Api delete data
 * @param token string
 * @param url string
 * @param params Record<string, unknown>
 * @returns Generic Type <T>
 */
export async function apiPatch<T>(request: Request) {
	return apiRequest<T>("PATCH", request);
}
