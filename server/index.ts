import "dotenv/config";
import * as Sentry from "@sentry/node";
import express, { type Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { registerRoutes } from "./routes";
import { serveStatic, log } from "./utils";
import { startCronJobs } from "./cron";
import { runMigrations } from "./migrate";
import { errorTrackingMiddleware } from "./lib/errorTracker";
import { responseTimeMiddleware } from "./lib/perfBaseline";
import { runStartupDiagnostics } from "./lib/startupDiagnostics";
import { closeWss } from "./lib/wsMetrics";
import logger from "./lib/logger";
import crypto from "crypto";

// Initialize Sentry (skip silently if no DSN)
if (process.env.SENTRY_DSN) {
  Sentry.init({ dsn: process.env.SENTRY_DSN });
}

const app = express();

// Railway runs behind a reverse proxy — trust it for correct IP detection
app.set("trust proxy", 1);

// --- Security Headers (helmet) ---
const isDev = process.env.NODE_ENV !== "production";
const isTest = process.env.NODE_ENV === "test";
app.use(
  helmet({
    contentSecurityPolicy: isDev
      ? false // Disable CSP in dev — Vite needs inline scripts + eval
      : {
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "https://clerk.com", "https://*.clerk.accounts.dev"],
            workerSrc: ["'self'", "blob:", "https://*.clerk.accounts.dev"],
            connectSrc: ["'self'", "https://*.clerk.accounts.dev", "wss://*.clerk.accounts.dev", "https://clerk-telemetry.com"],
            imgSrc: ["'self'", "data:", "https://img.clerk.com", "https:", "https://developer.apple.com"],
            styleSrc: ["'self'", "'unsafe-inline'", "https:"],
            frameSrc: ["'self'", "https://*.clerk.accounts.dev"],
            fontSrc: ["'self'", "https:", "data:"],
          },
        },
  }),
);

// --- CORS ---
const extraOrigins = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(",").map(s => s.trim()) : [];
const ALLOWED_ORIGINS = [
  ...extraOrigins,
  "http://localhost:5000",
  "http://localhost:5001",
  "http://localhost:3000",
  "http://localhost:8081",
  "capacitor://localhost",
  "ionic://localhost",
  "https://localhost",
];
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, iOS WebView sends null)
    if (!origin) return callback(null, true);
    // Allow Expo development URLs (exp://*)
    if (origin.startsWith("exp://")) return callback(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));

// --- Rate Limiting ---
const rateLimitBase = { windowMs: 60 * 1000, standardHeaders: true, legacyHeaders: false };
const limit = (max: number, msg = "Too many requests, please try again later.") =>
  rateLimit({ max: isTest ? 10000 : max, ...rateLimitBase, message: { message: msg } });

const globalLimiter = limit(300);
app.use("/api", globalLimiter);

const authLimiter = limit(30, "Too many auth attempts, please try again later.");
app.post("/api/login", authLimiter);
app.post("/api/auth", authLimiter);
app.post("/api/webhooks", authLimiter);

const logLimiter = limit(60, "Too many log requests, please try again later.");
app.post("/api/deuces", logLimiter);
app.post("/api/deuces/bulk", logLimiter);
app.post("/api/deuces/sync", limit(30, "Too many sync requests, please try again later."));

const pushLimiter = limit(10, "Too many push token requests, please try again later.");
app.post("/api/notifications/register", pushLimiter);
app.post("/api/push/unregister", pushLimiter);

// Group creation — prevent spam squad creation (POST only, not reads)
const groupCreateLimiter = limit(10, "Too many group creation requests, please try again later.");
app.post("/api/groups", groupCreateLimiter);

// Battle — prevent match spam and rapid-fire attacks
const battleChallengeLimiter = limit(10, "Too many battle requests, please try again later.");
app.post("/api/battle/challenge", battleChallengeLimiter);
app.post("/api/battle/matchmake", battleChallengeLimiter);
const battleActionLimiter = limit(120, "Too many battle actions, please try again later.");
app.post("/api/battle/match*", battleActionLimiter);

// Reactions — prevent emoji spam
const reactionLimiter = rateLimit({
  max: isTest ? 10000 : 60,
  ...rateLimitBase,
  message: { message: "Too many reaction requests, please try again later." },
});
app.post("/api/entries", reactionLimiter);

// Subscription upgrade — prevent abuse of the dev-mode upgrade endpoint
const subscriptionLimiter = rateLimit({
  max: isTest ? 10000 : 5,
  ...rateLimitBase,
  windowMs: 60 * 60 * 1000,  // 1 hour window
  message: { message: "Too many subscription requests, please try again later." },
});
app.post("/api/subscription/upgrade", subscriptionLimiter);

// Referral apply — prevent brute-force code guessing
const referralLimiter = rateLimit({
  max: isTest ? 10000 : 10,
  ...rateLimitBase,
  windowMs: 60 * 60 * 1000,  // 1 hour window
  message: { message: "Too many referral attempts, please try again later." },
});
app.post("/api/referral/apply", referralLimiter);

// Public profile/share endpoints — prevent user enumeration
const publicProfileLimiter = rateLimit({
  max: isTest ? 10000 : 30,
  ...rateLimitBase,
  message: { message: "Too many requests, please try again later." },
});
app.get("/api/share*", publicProfileLimiter);
app.get("/api/og*", publicProfileLimiter);
app.get("/api/users*", publicProfileLimiter);
app.get("/api/groups/preview*", publicProfileLimiter);
app.get("/api/groups/invite-preview*", publicProfileLimiter);
app.get("/api/passport*", publicProfileLimiter);
app.delete("/api/passport*", publicProfileLimiter);

// --- Request ID (trace each request through logs & error responses) ---
app.use((req, res, next) => {
  const id = (req.headers['x-request-id'] as string) || crypto.randomUUID();
  req.headers['x-request-id'] = id;
  res.setHeader('X-Request-Id', id);
  next();
});

// --- Inject requestId into all 4xx/5xx JSON error responses automatically ---
// Individual route handlers don't need to thread req through every catch block.
app.use((req, res, next) => {
  const originalJson = res.json.bind(res);
  res.json = (body: unknown) => {
    if (res.statusCode >= 400 && body && typeof body === 'object' && !(body as Record<string, unknown>).requestId) {
      const rid = req.headers['x-request-id'] as string | undefined;
      if (rid) (body as Record<string, unknown>).requestId = rid;
    }
    return originalJson(body);
  };
  next();
});

// --- Body parsers ---
// 50 KB is well above the largest legit JSON payload (thoughts: 500 chars + metadata ≈ 2 KB).
// File uploads bypass this via multer (5 MB limit, applied only on profile picture routes).
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: false, limit: '50kb' }));

// --- Response time tracking (must be before routes) ---
app.use(responseTimeMiddleware);

// --- Request Logging (morgan) ---
app.use(morgan("short"));

// --- Custom API request logger (existing) ---
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, unknown> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      const rid = req.headers['x-request-id'] as string | undefined;
      const userId = (req as Request & { user?: { id?: string } }).user?.id;
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (rid) logLine += ` [${rid.slice(0, 8)}]`;
      if (userId) logLine += ` uid=${userId.slice(0, 12)}`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Validate env vars and log startup diagnostics before anything else
  runStartupDiagnostics();

  // Run DB migrations inline before starting the server
  await runMigrations();

  const server = await registerRoutes(app);

  // Sentry error handler (must be before custom error handler)
  if (process.env.SENTRY_DSN) {
    Sentry.setupExpressErrorHandler(app);
  }

  // --- Error Tracking Middleware (captures to log file + memory buffer) ---
  app.use(errorTrackingMiddleware);

  // --- Global Error Handler ---
  app.use((err: Error & { status?: number; statusCode?: number }, req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = status === 500 ? "Internal Server Error" : err.message || "Internal Server Error";
    const requestId = req.headers['x-request-id'] as string | undefined;

    if (status === 500) {
      logger.error({ err: err.stack || err, requestId }, "[UNHANDLED ERROR]");
    }

    if (!res.headersSent) {
      res.status(status).json({ message, ...(requestId && { requestId }) });
    }
  });

  // --- API 404 catch-all (must be after all API routes, before SPA fallback) ---
  app.all('/api/*', (req: Request, res: Response) => {
    const requestId = req.headers['x-request-id'] as string | undefined;
    res.status(404).json({ message: "Not found", ...(requestId && { requestId }) });
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    const { setupVite } = await import("./vite.js");
    await setupVite(app, server); // vite loaded dynamically inside setupVite — safe in prod
  } else {
    serveStatic(app);
  }

  // Start cron jobs for streak notifications
  startCronJobs();

  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen(port, "0.0.0.0", () => {
    log(`serving on port ${port}`);
  });

  // --- Graceful Shutdown ---
  // Railway (and other PaaS platforms) send SIGTERM on deploy/stop.
  // We close the HTTP server first (stops accepting new connections),
  // wait for in-flight requests to complete (up to 10s), then drain the DB pool.
  const shutdown = (signal: string) => {
    log(`[SHUTDOWN] Received ${signal} — shutting down gracefully`);

    server.close(async (err) => {
      if (err) {
        logger.error({ err }, "[SHUTDOWN] Error closing HTTP server");
        process.exit(1);
      }

      // Drain WebSocket connections before closing the DB pool
      try {
        await closeWss();
        log("[SHUTDOWN] WebSocket server closed");
      } catch (wsErr) {
        logger.error({ err: wsErr }, "[SHUTDOWN] Error closing WebSocket server");
      }

      try {
        const { pool: dbPool } = await import("./db.js");
        await dbPool.end();
        log("[SHUTDOWN] DB pool drained — exiting cleanly");
      } catch (dbErr) {
        logger.error({ err: dbErr }, "[SHUTDOWN] Error draining DB pool");
      }

      process.exit(0);
    });

    // Force-exit after 15s if graceful shutdown stalls
    setTimeout(() => {
      logger.error("[SHUTDOWN] Graceful shutdown timed out after 15s — forcing exit");
      process.exit(1);
    }, 15_000).unref();
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
})();

// --- Unhandled rejection / exception safety net ---
process.on("unhandledRejection", (reason) => {
  logger.error({ reason }, "[UNHANDLED REJECTION]");
});

process.on("uncaughtException", (err) => {
  logger.error({ err }, "[UNCAUGHT EXCEPTION]");
  process.exit(1);
});
