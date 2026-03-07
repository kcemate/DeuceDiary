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
import { errorTrackingMiddleware } from "./lib/errorTracker";
import { responseTimeMiddleware } from "./lib/perfBaseline";

// Initialize Sentry (skip silently if no DSN)
if (process.env.SENTRY_DSN) {
  Sentry.init({ dsn: process.env.SENTRY_DSN });
}

const app = express();

// --- Security Headers (helmet) ---
app.use(helmet());

// --- CORS ---
const ALLOWED_ORIGINS = [
  "https://deuce-diary-web-production.up.railway.app",
  "http://localhost:5000",
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
  max: process.env.NODE_ENV === "test" ? 10000 : 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many auth attempts, please try again later." },
});
app.use("/api/login", authLimiter);
app.use("/api/auth", authLimiter);
app.use("/api/webhooks", authLimiter);

const logLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: process.env.NODE_ENV === "test" ? 10000 : 30,
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

// --- Body parsers ---
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

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
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
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
  const server = await registerRoutes(app);

  // Sentry error handler (must be before custom error handler)
  if (process.env.SENTRY_DSN) {
    Sentry.setupExpressErrorHandler(app);
  }

  // --- Error Tracking Middleware (captures to log file + memory buffer) ---
  app.use(errorTrackingMiddleware);

  // --- Global Error Handler ---
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = status === 500 ? "Internal Server Error" : err.message || "Internal Server Error";

    if (status === 500) {
      console.error("[UNHANDLED ERROR]", err.stack || err);
    }

    if (!res.headersSent) {
      res.status(status).json({ message });
    }
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
