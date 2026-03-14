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
import crypto from "crypto";

// Initialize Sentry (skip silently if no DSN)
if (process.env.SENTRY_DSN) {
  Sentry.init({ dsn: process.env.SENTRY_DSN });
}

const app = express();

// --- Security Headers (helmet) ---
const isDev = process.env.NODE_ENV !== "production";
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
const ALLOWED_ORIGINS = [
  "https://deuce-diary-web-production.up.railway.app",
  "http://localhost:5000",
  "http://localhost:5001",
  "http://localhost:3000",
  "http://localhost:8081",
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
const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: process.env.NODE_ENV === "test" ? 10000 : 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later." },
});
app.use("/api", globalLimiter);

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: process.env.NODE_ENV === "test" ? 10000 : 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many auth attempts, please try again later." },
});
app.use("/api/login", authLimiter);
app.use("/api/auth", authLimiter);
app.use("/api/webhooks", authLimiter);

const logLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: process.env.NODE_ENV === "test" ? 10000 : 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many log requests, please try again later." },
});
app.use("/api/deuces", logLimiter);

const pushLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: process.env.NODE_ENV === "test" ? 10000 : 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many push token requests, please try again later." },
});
app.use("/api/notifications/register", pushLimiter);
app.use("/api/push/unregister", pushLimiter);

// Group creation — prevent spam squad creation
const groupCreateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: process.env.NODE_ENV === "test" ? 10000 : 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many group creation requests, please try again later." },
});
app.use("/api/groups", groupCreateLimiter);

// Reactions — prevent emoji spam
const reactionLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: process.env.NODE_ENV === "test" ? 10000 : 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many reaction requests, please try again later." },
});
app.use("/api/entries", reactionLimiter);

// Referral apply — prevent brute-force code guessing
const referralLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,  // 1 hour window
  max: process.env.NODE_ENV === "test" ? 10000 : 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many referral attempts, please try again later." },
});
app.use("/api/referral/apply", referralLimiter);

// Public profile/share endpoints — prevent user enumeration
const publicProfileLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: process.env.NODE_ENV === "test" ? 10000 : 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later." },
});
app.use("/api/share", publicProfileLimiter);
app.use("/api/og", publicProfileLimiter);
app.use("/api/users", publicProfileLimiter);
app.use("/api/groups/preview", publicProfileLimiter);
app.use("/api/groups/invite-preview", publicProfileLimiter);

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
  res.json = (body: any) => {
    if (res.statusCode >= 400 && body && typeof body === 'object' && !body.requestId) {
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
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      const rid = req.headers['x-request-id'] as string | undefined;
      const userId = (req as any).user?.id as string | undefined;
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
  app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = status === 500 ? "Internal Server Error" : err.message || "Internal Server Error";
    const requestId = req.headers['x-request-id'] as string | undefined;

    if (status === 500) {
      console.error("[UNHANDLED ERROR]", requestId ? `[${requestId}]` : '', err.stack || err);
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
        console.error("[SHUTDOWN] Error closing HTTP server:", err);
        process.exit(1);
      }

      // Drain WebSocket connections before closing the DB pool
      try {
        await closeWss();
        log("[SHUTDOWN] WebSocket server closed");
      } catch (wsErr) {
        console.error("[SHUTDOWN] Error closing WebSocket server:", wsErr);
      }

      try {
        const { pool: dbPool } = await import("./db.js");
        await dbPool.end();
        log("[SHUTDOWN] DB pool drained — exiting cleanly");
      } catch (dbErr) {
        console.error("[SHUTDOWN] Error draining DB pool:", dbErr);
      }

      process.exit(0);
    });

    // Force-exit after 15s if graceful shutdown stalls
    setTimeout(() => {
      console.error("[SHUTDOWN] Graceful shutdown timed out after 15s — forcing exit");
      process.exit(1);
    }, 15_000).unref();
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
})();

// --- Unhandled rejection / exception safety net ---
process.on("unhandledRejection", (reason) => {
  console.error("[UNHANDLED REJECTION]", reason);
});

process.on("uncaughtException", (err) => {
  console.error("[UNCAUGHT EXCEPTION]", err);
  process.exit(1);
});
