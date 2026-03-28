import express, { type Express, type Request, type Response, type NextFunction } from "express";
import logger from "../lib/logger";
import { Webhook } from "svix";
import { v4 as uuidv4 } from "uuid";
import rateLimit from "express-rate-limit";
import { storage } from "../storage";
import { track, Events } from "../lib/analytics";

const webhookRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: process.env.NODE_ENV === "test" ? 10000 : 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many webhook requests, please try again later." },
});

/** Middleware that enforces Clerk webhook signature authentication via svix headers. */
function authenticateClerkWebhook(req: Request, res: Response, next: NextFunction): void {
  if (!process.env.CLERK_WEBHOOK_SECRET) {
    res.status(503).json({ message: "Service unavailable" });
    return;
  }
  const svixId = req.headers["svix-id"] as string;
  const svixTimestamp = req.headers["svix-timestamp"] as string;
  const svixSignature = req.headers["svix-signature"] as string;
  if (!svixId || !svixTimestamp || !svixSignature) {
    res.status(400).json({ message: "Missing svix headers" });
    return;
  }
  next();
}

async function downgradeToFree(userId: string, eventType: string, status?: string): Promise<void> {
  await storage.updateUserSubscription(userId, "free", new Date());
  const statusPart = status ? ` (status: ${status})` : "";
  logger.info(`Clerk webhook: ${eventType} — user ${userId} → free${statusPart}`);
}

/**
 * Register Clerk webhook route.
 * Must be called BEFORE session middleware (raw body required for signature verification).
 */
export function registerClerkWebhook(app: Express): void {
  app.post(
    "/api/webhooks/clerk",
    webhookRateLimit,
    authenticateClerkWebhook,
    express.raw({ type: "application/json" }),
    async (req: Request, res: Response) => {
      const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET!;

      const svixId = req.headers["svix-id"] as string;
      const svixTimestamp = req.headers["svix-timestamp"] as string;
      const svixSignature = req.headers["svix-signature"] as string;

      type ClerkEventData = {
        id?: string; user_id?: string; subscriber_id?: string;
        email_addresses?: Array<{ email_address?: string }>;
        first_name?: string | null; last_name?: string | null;
        image_url?: string | null; username?: string | null;
        status?: string; current_period_end?: number;
      };
      type ClerkEvent = { type: string; data: ClerkEventData };
      let event: ClerkEvent;
      try {
        const wh = new Webhook(WEBHOOK_SECRET);
        event = wh.verify(req.body, {
          "svix-id": svixId,
          "svix-timestamp": svixTimestamp,
          "svix-signature": svixSignature,
        });
      } catch (err) {
        logger.error({ err }, "Clerk webhook verification failed");
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
            logger.info(`Clerk webhook: synced user ${id} (${event.type})`);
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
                logger.info(`Clerk webhook: created Solo Deuces for user ${id}`);
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
              logger.info(`Clerk webhook: soft-deleted user ${id}`);
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
              logger.info(
                `Clerk webhook: ${event.type} — user ${userId} → premium until ${periodEnd.toISOString()}`,
              );
            } else {
              // Canceled / past_due / unpaid → downgrade
              await downgradeToFree(userId, event.type, status);
            }
            track("subscription_change", userId, { type: event.type, status });
            break;
          }

          case "subscription.deleted": {
            const sub = event.data;
            const userId = sub?.user_id ?? sub?.subscriber_id;
            if (!userId) break;
            await downgradeToFree(userId, event.type);
            track("subscription_change", userId, { type: event.type });
            break;
          }

          default:
            logger.info(`Clerk webhook: unhandled event type ${event.type}`);
        }
      } catch (err) {
        // Already sent 200 — log but don't fail
        logger.error({ err, eventType: event.type }, "Clerk webhook: error processing event");
      }
    },
  );
}
