import { ERROR_CODES } from "./error-codes";

export class HttpError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: (typeof ERROR_CODES)[keyof typeof ERROR_CODES],
    message: string,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "HttpError";
  }
}
