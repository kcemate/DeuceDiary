import { Expo, type ExpoPushMessage, type ExpoPushTicket } from "expo-server-sdk";
import { storage } from "./storage";
import logger from "./lib/logger";

const expo = new Expo();

/**
 * Send a push notification to all registered devices for a given user.
 * Gracefully handles invalid/expired tokens by removing them from the DB.
 */
export async function sendPushNotification(
  userId: string,
  title: string,
  body: string,
  data?: Record<string, unknown>,
): Promise<{ sent: number; failed: number }> {
  const tokens = await storage.getUserPushTokens(userId);

  if (tokens.length === 0) {
    return { sent: 0, failed: 0 };
  }

  // Build messages, filtering to valid Expo push tokens and deduplicating by token value
  const messages: ExpoPushMessage[] = [];
  const invalidTokenValues: string[] = [];
  const seenTokenValues = new Set<string>();

  for (const t of tokens) {
    // Deduplicate: skip if we've already queued this token value
    if (seenTokenValues.has(t.token)) continue;
    seenTokenValues.add(t.token);

    if (!Expo.isExpoPushToken(t.token)) {
      logger.warn({ userId, token: t.token }, "[PUSH] Invalid Expo push token");
      invalidTokenValues.push(t.token);
      continue;
    }

    messages.push({
      to: t.token,
      sound: "default",
      title,
      body,
      data: data ?? {},
    });
  }

  // Clean up tokens that aren't valid Expo format (in parallel)
  if (invalidTokenValues.length > 0) {
    await Promise.all(invalidTokenValues.map(token => storage.deletePushToken(userId, token)));
  }

  if (messages.length === 0) {
    return { sent: 0, failed: invalidTokenValues.length };
  }

  // Chunk and send via Expo
  const chunks = expo.chunkPushNotifications(messages);
  let sent = 0;
  let failed = invalidTokenValues.length;

  for (const chunk of chunks) {
    try {
      const tickets: ExpoPushTicket[] = await expo.sendPushNotificationsAsync(chunk);

      for (let i = 0; i < tickets.length; i++) {
        const ticket = tickets[i];
        if (ticket.status === "ok") {
          sent++;
        } else {
          failed++;
          // If the token is invalid/unregistered, remove it
          if (
            ticket.details?.error === "DeviceNotRegistered" ||
            ticket.details?.error === "InvalidCredentials"
          ) {
            const badToken = (chunk[i] as ExpoPushMessage).to as string;
            logger.info({ userId, token: badToken }, "[PUSH] Removing unregistered token");
            await storage.deletePushToken(userId, badToken);
          } else {
            logger.error({ userId, message: ticket.message }, "[PUSH] Error sending to user");
          }
        }
      }
    } catch (err) {
      logger.error({ err, userId }, "[PUSH] Chunk send failed for user");
      failed += chunk.length;
    }
  }

  return { sent, failed };
}

/**
 * Send a push notification to all members of a group.
 */
export async function sendGroupPushNotification(
  groupId: string,
  title: string,
  body: string,
  data?: Record<string, unknown>,
): Promise<{ sent: number; failed: number }> {
  const tokens = await storage.getGroupPushTokens(groupId);

  if (tokens.length === 0) {
    return { sent: 0, failed: 0 };
  }

  // Deduplicate by userId to prevent sending to the same user twice
  const userIds = Array.from(new Set(tokens.map((t) => t.userId)));
  let totalSent = 0;
  let totalFailed = 0;

  for (const userId of userIds) {
    const result = await sendPushNotification(userId, title, body, data);
    totalSent += result.sent;
    totalFailed += result.failed;
  }

  return { sent: totalSent, failed: totalFailed };
}
