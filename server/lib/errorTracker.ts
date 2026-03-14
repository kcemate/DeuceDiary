import { type Request, type Response, type NextFunction } from "express";
import fs from "fs";
import path from "path";

/** Captured error entry stored in memory and written to disk. */
export interface ErrorEntry {
  timestamp: string;
  method: string;
  path: string;
  statusCode: number;
  message: string;
  stack: string | null;
  userId: string | null;
  userAgent: string | null;
  requestId: string | null;
}

// --- In-memory ring buffer ---
const MAX_MEMORY_ENTRIES = 200;
const errorBuffer: ErrorEntry[] = [];

// --- Log file rotation ---
const LOG_DIR = path.resolve(process.cwd(), "server", "logs");
const MAX_LOG_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB per file
const MAX_LOG_FILES = 5;

function ensureLogDir(): void {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
}

function currentLogPath(): string {
  return path.join(LOG_DIR, "errors.log");
}

/** Rotate log files: errors.log → errors.1.log → errors.2.log → ... */
function rotateIfNeeded(): void {
  const logPath = currentLogPath();
  if (!fs.existsSync(logPath)) return;

  const stat = fs.statSync(logPath);
  if (stat.size < MAX_LOG_SIZE_BYTES) return;

  // Shift older files
  for (let i = MAX_LOG_FILES - 1; i >= 1; i--) {
    const older = path.join(LOG_DIR, `errors.${i}.log`);
    const newer = i === 1 ? logPath : path.join(LOG_DIR, `errors.${i - 1}.log`);
    if (fs.existsSync(newer)) {
      if (i === MAX_LOG_FILES - 1 && fs.existsSync(older)) {
        fs.unlinkSync(older);
      }
      fs.renameSync(newer, older);
    }
  }
}

function appendToLog(entry: ErrorEntry): void {
  try {
    ensureLogDir();
    rotateIfNeeded();
    const line = JSON.stringify(entry) + "\n";
    fs.appendFileSync(currentLogPath(), line, "utf-8");
  } catch (err) {
    console.error("[ERROR TRACKER] Failed to write log file:", err);
  }
}

/** Record an error in both memory buffer and disk log. */
export function recordError(entry: ErrorEntry): void {
  errorBuffer.push(entry);
  if (errorBuffer.length > MAX_MEMORY_ENTRIES) {
    errorBuffer.shift();
  }
  appendToLog(entry);
}

/** Get the most recent errors from the in-memory buffer. */
export function getRecentErrors(limit = 50): ErrorEntry[] {
  const n = Math.min(limit, errorBuffer.length);
  return errorBuffer.slice(-n).reverse();
}

/**
 * Express error-handling middleware.
 * Must be registered with 4 parameters so Express treats it as an error handler.
 */
export function errorTrackingMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const status = err.status || err.statusCode || 500;

  const entry: ErrorEntry = {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.originalUrl || req.path,
    statusCode: status,
    message: err.message || "Unknown error",
    stack: status >= 500 ? (err.stack ?? null) : null,
    userId: (req as any).user?.id ?? null,
    userAgent: (req.headers["user-agent"] as string | undefined) ?? null,
    requestId: (req.headers["x-request-id"] as string | undefined) ?? null,
  };

  recordError(entry);

  // Pass to the next error handler (existing global handler)
  next(err);
}
