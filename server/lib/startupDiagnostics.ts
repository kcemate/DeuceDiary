import { log } from "../utils";

interface EnvSpec {
  name: string;
  required: boolean;
  /** Short description shown in the startup log. */
  description: string;
}

const ENV_SPECS: EnvSpec[] = [
  { name: "DATABASE_URL",           required: true,  description: "PostgreSQL connection string" },
  { name: "SESSION_SECRET",         required: false, description: "Express session signing secret (insecure default used if absent)" },
  { name: "CLERK_SECRET_KEY",       required: false, description: "Clerk backend secret (production auth)" },
  { name: "CLERK_PUBLISHABLE_KEY",  required: false, description: "Clerk publishable key" },
  { name: "ADMIN_KEY",              required: false, description: "Admin API key (/api/admin/*)" },
  { name: "INTERNAL_API_KEY",       required: false, description: "Internal cron/ops key (/api/internal/*)" },
  { name: "SENTRY_DSN",             required: false, description: "Sentry error reporting DSN" },
  { name: "REVENUECAT_WEBHOOK_SECRET", required: false, description: "RevenueCat webhook signature" },
  { name: "PORT",                   required: false, description: "HTTP listen port (default 5000)" },
  { name: "NODE_ENV",               required: false, description: "Runtime environment" },
];

/**
 * Validates environment variables and logs a startup diagnostic summary.
 * Throws if any required variable is missing so the process fails fast.
 */
export function runStartupDiagnostics(): void {
  log("[STARTUP] Running startup diagnostics…", "startup");

  const missing: string[] = [];
  const rows: string[] = [];

  for (const spec of ENV_SPECS) {
    const value = process.env[spec.name];
    const present = value !== undefined && value !== "";
    const status = present ? "✓" : spec.required ? "✗ MISSING" : "– (optional)";
    rows.push(`  ${status.padEnd(14)} ${spec.name.padEnd(32)} ${spec.description}`);
    if (!present && spec.required) {
      missing.push(spec.name);
    }
  }

  log(`[STARTUP] Environment variables:\n${rows.join("\n")}`, "startup");
  log(`[STARTUP] NODE_ENV=${process.env.NODE_ENV ?? "undefined"}  PID=${process.pid}`, "startup");

  if (missing.length > 0) {
    const err = `[STARTUP] Missing required env vars: ${missing.join(", ")}`;
    console.error(err);
    throw new Error(err);
  }

  log("[STARTUP] Diagnostics complete — all required env vars present.", "startup");
}
