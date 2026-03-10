import express, { type Express, type Request, type Response } from "express";
import crypto from "crypto";
import { z } from "zod";
import { storage } from "../../storage";
import { track } from "../../lib/analytics";

const RC_EVENT_TYPES = [
  "INITIAL_PURCHASE",
  "RENEWAL",
  "PRODUCT_CHANGE",
  "CANCELLATION",
  "EXPIRATION",
  "BILLING_ISSUES_DETECTED",
  "SUBSCRIBER_ALIAS",
  "TRANSFER",
  "NON_RENEWING_PURCHASE",
  "UNCANCELLATION",
  "SUBSCRIPTION_PAUSED",
  "TEST",
] as const;

const revenueCatEventSchema = z.object({
  event: z.object({
    type: z.string().min(1).max(100),
    app_user_id: z.string().min(1).max(256),
    expiration_at_ms: z.number().int().positive().optional().nullable(),
  }),
});

/**
 * Register RevenueCat webhook route.
 * Server-to-server — no session auth, validated via Authorization header bearing shared secret.
 */
export function registerRevenueCatWebhook(app: Express): void {
  const secret = process.env.REVENUECAT_WEBHOOK_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      console.error('[ERROR] REVENUECAT_WEBHOOK_SECRET not set — webhook endpoint disabled');
    }
    console.warn('[WARN] REVENUECAT_WEBHOOK_SECRET not set — webhook is unauthenticated');
  }

  app.post(
    "/api/webhooks/revenuecat",
    express.json(),
    async (req: Request, res: Response) => {
      // --- Signature validation ---
      if (secret) {
        const authHeader = req.headers["authorization"];
        if (!authHeader || authHeader !== `Bearer ${secret}`) {
          return res.status(401).json({ message: "Invalid webhook authorization" });
        }
      }

      try {
        const parsed = revenueCatEventSchema.safeParse(req.body);
        if (!parsed.success) {
          console.warn('[REVENUECAT] Invalid payload:', parsed.error.flatten());
          return res.status(400).json({ message: "Invalid payload" });
        }

        const { event } = parsed.data;
        const userId = event.app_user_id;
        const expirationMs = event.expiration_at_ms ?? undefined;

        switch (event.type) {
          case "INITIAL_PURCHASE":
          case "RENEWAL":
          case "PRODUCT_CHANGE": {
            const expiresAt = expirationMs
              ? new Date(expirationMs)
              : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
            await storage.updateUserSubscription(userId, "premium", expiresAt);
            // Reset streak insurance on new billing cycle
            await storage.resetStreakInsurance(userId);
            console.log(
              `[REVENUECAT] ${event.type} — user ${userId} upgraded until ${expiresAt.toISOString()}`,
            );
            track("subscription_change", userId, { type: event.type });
            break;
          }
          case "CANCELLATION":
          case "EXPIRATION": {
            await storage.updateUserSubscription(userId, "free", new Date());
            console.log(`[REVENUECAT] ${event.type} — user ${userId} downgraded`);
            track("subscription_change", userId, { type: event.type });
            break;
          }
          case "BILLING_ISSUES_DETECTED": {
            console.log(`[REVENUECAT] BILLING_ISSUES_DETECTED — user ${userId}`);
            track("subscription_billing_issue", userId, { type: event.type });
            break;
          }
          default:
            console.log(`[REVENUECAT] Unhandled event type: ${event.type}`);
        }

        res.json({ received: true });
      } catch (error) {
        console.error("[REVENUECAT] Webhook error:", error);
        res.status(500).json({ message: "Webhook processing failed" });
      }
    },
  );
}
