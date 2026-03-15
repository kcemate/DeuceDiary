import express, { type Express, type Request, type Response } from "express";
import crypto from "crypto";
import { storage } from "../../storage";
import { track } from "../../lib/analytics";

/**
 * RevenueCat webhook event types.
 * https://www.revenuecat.com/docs/webhooks
 */
const SUBSCRIPTION_ACTIVE_EVENTS = new Set([
  "INITIAL_PURCHASE",
  "RENEWAL",
  "PRODUCT_CHANGE",
  "UNCANCELLATION",
  "BILLING_ISSUE_RESOLVED",
  "SUBSCRIBER_ALIAS",
  "NON_SUBSCRIPTION_PURCHASE",
  "TRANSFER",
]);

const SUBSCRIPTION_EXPIRED_EVENTS = new Set([
  "CANCELLATION",
  "EXPIRATION",
  "BILLING_ISSUE",
  "SUBSCRIPTION_PAUSED",
]);

/**
 * Validate RevenueCat Authorization header.
 * RevenueCat sends: Authorization: <webhook-secret>
 * (just the raw secret, no "Bearer " prefix)
 */
function validateRevenueCatAuth(req: Request, secret: string): boolean {
  const auth = req.headers["authorization"];
  if (!auth) return false;
  // Support both raw secret and "Bearer <secret>"
  const provided = auth.startsWith("Bearer ") ? auth.slice(7) : auth;
  return crypto.timingSafeEqual(
    Buffer.from(provided, "utf8"),
    Buffer.from(secret, "utf8"),
  );
}

/**
 * Register RevenueCat webhook route.
 * Must be called BEFORE session middleware (raw body required for signature verification).
 */
export function registerRevenueCatWebhook(app: Express): void {
  app.post(
    "/api/webhooks/revenuecat",
    express.raw({ type: "application/json" }),
    async (req: Request, res: Response) => {
      const WEBHOOK_SECRET = process.env.REVENUECAT_WEBHOOK_SECRET;
      if (!WEBHOOK_SECRET) {
        console.error("REVENUECAT_WEBHOOK_SECRET not set — rejecting webhook");
        return res.status(503).json({ message: "Service unavailable" });
      }

      // Validate authorization
      if (!validateRevenueCatAuth(req, WEBHOOK_SECRET)) {
        console.warn("RevenueCat webhook: invalid authorization header");
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Parse body (raw buffer → JSON)
      type RevenueCatPayload = { event?: { type?: string; app_user_id?: string; expiration_at_ms?: number | null } };
      let payload: RevenueCatPayload;
      try {
        const body = req.body instanceof Buffer ? req.body.toString("utf8") : JSON.stringify(req.body);
        payload = JSON.parse(body);
      } catch (err) {
        console.error("RevenueCat webhook: failed to parse body:", err);
        return res.status(400).json({ message: "Invalid JSON body" });
      }

      const event = payload?.event;
      if (!event) {
        return res.status(400).json({ message: "Missing event object" });
      }

      const eventType: string = event.type ?? "";
      const appUserId: string = event.app_user_id ?? "";
      const expirationAtMs: number | null = event.expiration_at_ms ?? null;

      if (!appUserId) {
        console.warn(`RevenueCat webhook: missing app_user_id for event ${eventType}`);
        return res.status(400).json({ message: "Missing app_user_id" });
      }

      // Respond 200 immediately, then process asynchronously
      res.json({ received: true });

      try {
        // Map app_user_id → userId (RevenueCat app_user_id is our userId / Clerk user ID)
        const userId = appUserId;

        if (SUBSCRIPTION_ACTIVE_EVENTS.has(eventType)) {
          // Determine expiration date
          const expiresAt = expirationAtMs
            ? new Date(expirationAtMs)
            : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // default 1 year

          await storage.updateUserSubscription(userId, "premium", expiresAt);

          // Reset streak insurance on renewal/new purchase so user gets a fresh protect
          if (eventType === "RENEWAL" || eventType === "INITIAL_PURCHASE") {
            await storage.resetStreakInsurance(userId);
          }

          console.log(
            `RevenueCat webhook: ${eventType} — user ${userId} → premium until ${expiresAt.toISOString()}`,
          );
          track("subscription_change", userId, {
            type: eventType,
            status: "active",
            source: "revenuecat",
          });
        } else if (SUBSCRIPTION_EXPIRED_EVENTS.has(eventType)) {
          await storage.updateUserSubscription(userId, "free", new Date());
          console.log(
            `RevenueCat webhook: ${eventType} — user ${userId} → free`,
          );
          track("subscription_change", userId, {
            type: eventType,
            status: "expired",
            source: "revenuecat",
          });
        } else {
          console.log(`RevenueCat webhook: unhandled event type ${eventType} for user ${userId}`);
        }
      } catch (err) {
        // Already sent 200 — log but don't fail
        console.error(`RevenueCat webhook: error processing ${eventType}:`, err);
      }
    },
  );
}
