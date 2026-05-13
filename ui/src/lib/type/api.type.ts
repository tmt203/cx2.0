export type Request = {
	token: string;
	url: string;
	body?: BodyInit;
	params?: Record<string, unknown>;
};

export type ApiMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export type ApiResponse<T> = {
	code: string;
	message: string;
	total?: number;
	data: T;
};
