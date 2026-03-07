import express, { type Express, type Request, type Response } from "express";
import crypto from "crypto";
import { storage } from "../../storage";
import { track } from "../../lib/analytics";

/**
 * Register RevenueCat webhook route.
 * Server-to-server — no session auth, validated via Authorization header bearing shared secret.
 */
export function registerRevenueCatWebhook(app: Express): void {
  app.post(
    "/api/webhooks/revenuecat",
    express.json(),
    async (req: Request, res: Response) => {
      // --- Signature validation ---
      const secret = process.env.REVENUECAT_WEBHOOK_SECRET;
      if (secret) {
        const authHeader = req.headers["authorization"];
        if (!authHeader || authHeader !== `Bearer ${secret}`) {
          return res.status(401).json({ message: "Invalid webhook authorization" });
        }
      }

      try {
        const { event } = req.body;
        if (!event?.type || !event?.app_user_id) {
          return res.status(400).json({ message: "Invalid payload" });
        }

        const userId = event.app_user_id;
        const expirationMs = event.expiration_at_ms;

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
