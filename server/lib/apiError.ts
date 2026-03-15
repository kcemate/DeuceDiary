import { type Response } from "express";

/**
 * Standardized API error response shape.
 */
export interface ApiError {
  error: string;
  code: string;
  status: number;
}

/**
 * Send a standardized error response.
 * All API errors must go through this function to ensure consistent shape.
 */
export function apiError(
  res: Response,
  status: number,
  code: string,
  error: string
): void {
  res.status(status).json({ error, message: error, code, status } satisfies ApiError & { message: string });
}

// Common error factories
export const Errors = {
  unauthorized: (res: Response, msg = "Unauthorized") =>
    apiError(res, 401, "UNAUTHORIZED", msg),
  forbidden: (res: Response, msg = "Forbidden") =>
    apiError(res, 403, "FORBIDDEN", msg),
  notFound: (res: Response, resource = "Resource") =>
    apiError(res, 404, "NOT_FOUND", `${resource} not found`),
  badRequest: (res: Response, msg: string, code = "BAD_REQUEST") =>
    apiError(res, 400, code, msg),
  conflict: (res: Response, msg: string, code = "CONFLICT") =>
    apiError(res, 409, code, msg),
  tooManyRequests: (res: Response, msg: string) =>
    apiError(res, 429, "RATE_LIMIT_EXCEEDED", msg),
  internal: (res: Response, msg = "Internal server error") =>
    apiError(res, 500, "INTERNAL_ERROR", msg),
  upgradRequired: (res: Response, feature: string) =>
    res.status(403).json({ feature, message: "Premium required", upgrade: true }),
};
