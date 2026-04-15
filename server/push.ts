import webpush from "web-push";
import { db } from "./db";
import { pushSubscriptions } from "../shared/schema";
import { eq, and } from "drizzle-orm";
import logger from "./lib/logger";

// VAPID keys — set via env vars VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY
// Generate with: npx web-push generate-vapid-keys
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || "";
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || "";
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || "mailto:support@deucediary.com";

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
  logger.info("Web Push configured with VAPID keys");
} else {
  logger.warn("VAPID keys not set — push notifications disabled");
}

export function getVapidPublicKey(): string {
  return VAPID_PUBLIC_KEY;
}

export function isPushConfigured(): boolean {
  return !!(VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY);
}

interface PushSubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export async function savePushSubscription(
  userId: string,
  subscription: PushSubscriptionData,
  userAgent?: string
): Promise<void> {
  const data = {
    userId,
    endpoint: subscription.endpoint,
    p256dh: subscription.keys.p256dh,
    auth: subscription.keys.auth,
    userAgent: userAgent || null,
  };

  await db
    .insert(pushSubscriptions)
    .values(data)
    .onConflictDoUpdate({
      target: [pushSubscriptions.endpoint],
      set: {
        p256dh: data.p256dh,
        auth: data.auth,
        userAgent: data.userAgent,
      },
    });
  logger.info({ userId, endpoint: subscription.endpoint.substring(0, 50) }, "Push subscription saved");
}

export async function removePushSubscription(
  userId: string,
  endpoint: string
): Promise<void> {
  await db
    .delete(pushSubscriptions)
    .where(and(eq(pushSubscriptions.userId, userId), eq(pushSubscriptions.endpoint, endpoint)));
  logger.info({ userId }, "Push subscription removed");
}

export async function sendPushToUser(
  userId: string,
  payload: { title: string; body: string; icon?: string; url?: string; tag?: string }
): Promise<number> {
  if (!isPushConfigured()) return 0;

  const subs = await db
    .select()
    .from(pushSubscriptions)
    .where(eq(pushSubscriptions.userId, userId));

  if (subs.length === 0) return 0;

  const message = JSON.stringify(payload);
  let sent = 0;
  const staleEndpoints: string[] = [];

  for (const sub of subs) {
    const pushSub: webpush.PushSubscription = {
      endpoint: sub.endpoint,
      keys: { p256dh: sub.p256dh, auth: sub.auth },
    };

    try {
      await webpush.sendNotification(pushSub, message);
      sent++;
    } catch (err: any) {
      // 410 = subscription expired, 404 = not found — clean up stale subscriptions
      if (err.statusCode === 410 || err.statusCode === 404) {
        staleEndpoints.push(sub.endpoint);
      } else {
        logger.warn({ err: err.message, endpoint: sub.endpoint.substring(0, 50) }, "Push send failed");
      }
    }
  }

  // Clean up stale subscriptions
  if (staleEndpoints.length > 0) {
    for (const endpoint of staleEndpoints) {
      await db.delete(pushSubscriptions).where(eq(pushSubscriptions.endpoint, endpoint));
    }
    logger.info({ count: staleEndpoints.length }, "Cleaned up stale push subscriptions");
  }

  return sent;
}

export async function sendPushToGroup(
  userIds: string[],
  payload: { title: string; body: string; icon?: string; url?: string; tag?: string }
): Promise<void> {
  if (!isPushConfigured()) return;

  // Send to all group members except the one who triggered the event
  const promises = userIds.map((uid) => sendPushToUser(uid, payload));
  await Promise.allSettled(promises);
}