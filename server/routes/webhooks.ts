import express, { type Express, type Request, type Response } from "express";
import { Webhook } from "svix";
import { storage } from "../storage";
import { track } from "../lib/analytics";

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
        return res.status(500).json({ message: "Webhook secret not configured" });
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
              track("user_registered", id);
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
