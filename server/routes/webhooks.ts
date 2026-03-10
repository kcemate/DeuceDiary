import express, { type Express, type Request, type Response } from "express";
import { Webhook } from "svix";
import { v4 as uuidv4 } from "uuid";
import { storage } from "../storage";
import { track, Events } from "../lib/analytics";

/**
 * Register Clerk webhook route.
 * Must be called BEFORE session middleware (raw body required for signature verification).
 */
export function registerClerkWebhook(app: Express): void {
  app.post(
    "/api/webhooks/clerk",
    express.raw({ type: "application/json" }),
    async (req: Request, res: Response) => {
      const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
      if (!WEBHOOK_SECRET) {
        console.error("CLERK_WEBHOOK_SECRET not set — rejecting webhook");
        return res.status(503).json({ message: "Service unavailable" });
      }

      const svixId = req.headers["svix-id"] as string;
      const svixTimestamp = req.headers["svix-timestamp"] as string;
      const svixSignature = req.headers["svix-signature"] as string;

      if (!svixId || !svixTimestamp || !svixSignature) {
        return res.status(400).json({ message: "Missing svix headers" });
      }

      let event: any;
      try {
        const wh = new Webhook(WEBHOOK_SECRET);
        event = wh.verify(req.body, {
          "svix-id": svixId,
          "svix-timestamp": svixTimestamp,
          "svix-signature": svixSignature,
        });
      } catch (err) {
        console.error("Clerk webhook verification failed:", err);
        return res.status(400).json({ message: "Invalid webhook signature" });
      }

      // Respond 200 immediately, then process
      res.json({ received: true });

      try {
        switch (event.type) {
          case "user.created":
          case "user.updated": {
            const { id, email_addresses, first_name, last_name, image_url, username } = event.data;
            await storage.upsertUser({
              id,
              email: email_addresses?.[0]?.email_address ?? null,
              firstName: first_name ?? null,
              lastName: last_name ?? null,
              username: username ?? undefined,
              profileImageUrl: image_url ?? null,
            });
            console.log(`Clerk webhook: synced user ${id} (${event.type})`);
            if (event.type === "user.created") {
              // Auto-create "Solo Deuces" default group for new users
              const userGroups = await storage.getUserGroups(id);
              if (userGroups.length === 0) {
                await storage.createGroup({
                  id: uuidv4(),
                  name: "Solo Deuces",
                  description: "Your personal throne log",
                  createdBy: id,
                });
                console.log(`Clerk webhook: created Solo Deuces for user ${id}`);
              }
              track("user_registered", id);
              Events.userSignup(id);
            }
            break;
          }

          case "user.deleted": {
            const { id } = event.data;
            if (id) {
              await storage.softDeleteUser(id);
              console.log(`Clerk webhook: soft-deleted user ${id}`);
              track("user_deleted", id);
            }
            break;
          }

          case "session.created": {
            const userId = event.data?.user_id;
            if (userId) {
              track("session_created", userId, {
                sessionId: event.data?.id,
              });
            }
            break;
          }

          // --- Clerk Billing subscription events ---
          case "subscription.created":
          case "subscription.updated": {
            const sub = event.data;
            const userId = sub?.user_id ?? sub?.subscriber_id;
            if (!userId) break;
            const status = sub?.status; // "active" | "canceled" | "past_due" etc.
            if (status === "active") {
              // Use period end as expiry; default to 1 year if missing
              const periodEnd = sub?.current_period_end
                ? new Date(sub.current_period_end * 1000)
                : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
              await storage.updateUserSubscription(userId, "premium", periodEnd);
              await storage.resetStreakInsurance(userId);
              console.log(`Clerk webhook: ${event.type} — user ${userId} → premium until ${periodEnd.toISOString()}`);
              track("subscription_change", userId, { type: event.type, status });
            } else {
              // Canceled / past_due / unpaid → downgrade
              await storage.updateUserSubscription(userId, "free", new Date());
              console.log(`Clerk webhook: ${event.type} — user ${userId} → free (status: ${status})`);
              track("subscription_change", userId, { type: event.type, status });
            }
            break;
          }

          case "subscription.deleted": {
            const sub = event.data;
            const userId = sub?.user_id ?? sub?.subscriber_id;
            if (!userId) break;
            await storage.updateUserSubscription(userId, "free", new Date());
            console.log(`Clerk webhook: subscription.deleted — user ${userId} → free`);
            track("subscription_change", userId, { type: event.type });
            break;
          }

          default:
            console.log(`Clerk webhook: unhandled event type ${event.type}`);
        }
      } catch (err) {
        // Already sent 200 — log but don't fail
        console.error(`Clerk webhook: error processing ${event.type}:`, err);
      }
    },
  );
}
