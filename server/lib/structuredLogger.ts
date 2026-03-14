import { type Request, type Response, type NextFunction } from "express";

/**
 * Structured JSON request log entry — machine-parseable for log aggregators.
 * Each API request emits one line to stdout on response finish.
 */
export interface RequestLogEntry {
  ts: string;           // ISO timestamp
  method: string;
  path: string;
  status: number;
  durationMs: number;
  requestId: string | null;
  userId: string | null;
  ip: string | null;
  userAgent: string | null;
  contentLength: number | null;
}

function getIp(req: Request): string | null {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    const raw = Array.isArray(forwarded) ? forwarded[0] : forwarded;
    return raw.split(",")[0].trim();
  }
  return req.socket?.remoteAddress ?? null;
}

/**
 * Express middleware that emits one structured JSON log line per API request.
 * Only fires for /api paths to avoid noise from static assets.
 */
export function structuredRequestLogger(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!req.path.startsWith("/api")) {
    return next();
  }

  const start = process.hrtime.bigint();

  res.on("finish", () => {
    const durationMs = Math.round(Number(process.hrtime.bigint() - start) / 1e6);
    const clHeader = res.getHeader("content-length");
    const contentLength =
      typeof clHeader === "string" ? parseInt(clHeader, 10) || null
      : typeof clHeader === "number" ? clHeader
      : null;

    const entry: RequestLogEntry = {
      ts: new Date().toISOString(),
      method: req.method,
      path: req.originalUrl || req.path,
      status: res.statusCode,
      durationMs,
      requestId: (req.headers["x-request-id"] as string | undefined) ?? null,
      userId: (req as any).user?.id ?? null,
      ip: getIp(req),
      userAgent: req.headers["user-agent"] ?? null,
      contentLength,
    };

    process.stdout.write(JSON.stringify(entry) + "\n");
  });

  next();
}
