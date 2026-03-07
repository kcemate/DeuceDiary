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
  res: any,
  status: number,
  code: string,
  error: string
): void {
  res.status(status).json({ error, code, status } satisfies ApiError);
}

// Common error factories
export const Errors = {
  unauthorized: (res: any, msg = "Unauthorized") =>
    apiError(res, 401, "UNAUTHORIZED", msg),
  forbidden: (res: any, msg = "Forbidden") =>
    apiError(res, 403, "FORBIDDEN", msg),
  notFound: (res: any, resource = "Resource") =>
    apiError(res, 404, "NOT_FOUND", `${resource} not found`),
  badRequest: (res: any, msg: string, code = "BAD_REQUEST") =>
    apiError(res, 400, code, msg),
  conflict: (res: any, msg: string, code = "CONFLICT") =>
    apiError(res, 409, code, msg),
  tooManyRequests: (res: any, msg: string) =>
    apiError(res, 429, "RATE_LIMIT_EXCEEDED", msg),
  internal: (res: any, msg = "Internal server error") =>
    apiError(res, 500, "INTERNAL_ERROR", msg),
  upgradRequired: (res: any, feature: string) =>
    apiError(res, 403, "UPGRADE_REQUIRED", `Upgrade to Premium for ${feature}`),
};
