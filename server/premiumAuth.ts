import type { RequestHandler, Request } from "express";

type PremiumReq = Request & {
  clerkAuth?: Record<string, unknown>;
  user?: { subscription?: string | null; subscriptionExpiresAt?: Date | string | null };
};

/**
 * Check if a Clerk JWT payload indicates an active premium plan.
 * Clerk Billing embeds plan info in the session token claims.
 * Falls back gracefully if claims are absent (dev mode / pre-Billing).
 */
function hasClerkPlan(clerkAuth: Record<string, unknown> | null | undefined): boolean {
  if (!clerkAuth) return false;
  // Clerk Billing: user-level subscription stored as `plan` top-level claim
  if (clerkAuth.plan === "premium") return true;
  // Clerk Billing: org/feature permissions stored in `o.per` as comma-separated string
  if (typeof clerkAuth.o?.per === "string" && clerkAuth.o.per.split(",").includes("premium")) return true;
  // Clerk Billing: feature flags array
  if (Array.isArray(clerkAuth.fea) && clerkAuth.fea.includes("premium")) return true;
  return false;
}

/**
 * Check if a DB user has an active premium subscription (fallback).
 */
type DbPremiumUser = { subscription?: string | null; subscriptionExpiresAt?: Date | string | null } | null | undefined;
function hasDbPremium(user: DbPremiumUser): boolean {
  return (
    user?.subscription === "premium" &&
    user.subscriptionExpiresAt &&
    new Date(user.subscriptionExpiresAt) > new Date()
  );
}

/**
 * Middleware that gates routes behind Porcelain Premium.
 * Checks Clerk Billing JWT claims first, falls back to DB subscription field.
 */
export const requiresPremium: RequestHandler = (req, res, next) => {
  const r = req as PremiumReq;
  if (hasClerkPlan(r.clerkAuth) || hasDbPremium(r.user)) {
    return next();
  }
  return res.status(403).json({ feature: "general", message: "Premium required", upgrade: true });
};

/**
 * Factory: returns requiresPremium middleware that includes the feature name
 * in the 403 response so clients can show targeted upgrade prompts.
 */
export function requiresPremiumFor(feature: string): RequestHandler {
  return (req, res, next) => {
    const r = req as PremiumReq;
    if (hasClerkPlan(r.clerkAuth) || hasDbPremium(r.user)) {
      return next();
    }
    return res.status(403).json({ feature, message: "Premium required", upgrade: true });
  };
}
