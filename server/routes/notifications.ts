import { Router } from "express";
import { Expo } from "expo-server-sdk";
import { storage } from "../storage";
import { isAuthenticated } from "../replitAuth";
import { requiresPremiumFor } from "../premiumAuth";
import { requireGroupMember } from "../groupAuth";
import { pushTokenSchema, unregisterPushSchema, reminderSchema, broadcastSchema, MAX_PUSH_TOKENS_PER_USER, parseOrFail, asyncRoute } from "./helpers";

export function createNotificationsRouter(): Router {
  const router = Router();

  // --- Push notification token registration ---
  router.post('/api/notifications/register', isAuthenticated, asyncRoute('registering push token', 'Failed to register push token', async (req, res) => {
    const userId = req.user.id;
    const data = parseOrFail(pushTokenSchema, req.body, res, "token and platform ('ios' or 'android') are required");
    if (!data) return;
    const { token, platform } = data;

    // Validate Expo push token format
    if (!Expo.isExpoPushToken(token)) {
      return res.status(400).json({ message: "Invalid push token format" });
    }

    // Enforce per-user token limit (prevents token flooding)
    const tokenCount = await storage.countUserPushTokens(userId);
    if (tokenCount >= MAX_PUSH_TOKENS_PER_USER) {
      // Check if this exact token already exists (upsert is fine)
      const existing = await storage.getUserPushTokens(userId);
      if (!existing.some(t => t.token === token)) {
        return res.status(400).json({ message: `Maximum of ${MAX_PUSH_TOKENS_PER_USER} devices reached` });
      }
    }

    await storage.upsertPushToken({ userId, token, platform });
    res.json({ ok: true });
  }));

  // --- Push notification token unregister ---
  router.delete('/api/push/unregister', isAuthenticated, asyncRoute('unregistering push token', 'Failed to unregister push token', async (req, res) => {
    const userId = req.user.id;
    const data = parseOrFail(unregisterPushSchema, req.body, res, 'token is required');
    if (!data) return;

    await storage.deletePushToken(userId, data.token);
    res.json({ ok: true });
  }));

  // --- Throne Broadcast (premium) ---
  router.post('/api/squads/:id/broadcast', isAuthenticated, requiresPremiumFor('throne_broadcast'), requireGroupMember('id'), asyncRoute('creating broadcast', 'Failed to create broadcast', async (req, res) => {
    const userId = req.user.id;
    const groupId = req.groupId;
    const data = parseOrFail(broadcastSchema, req.body, res, 'milestone is required');
    if (!data) return;

    // Look up all push tokens for group members
    const tokens = await storage.getGroupPushTokens(groupId);

    // Store the broadcast (don't actually send push yet)
    const broadcast = await storage.createBroadcast({ groupId, userId, milestone: data.milestone });

    res.json({ broadcast, tokenCount: tokens.length });
  }));

  // --- Custom Reminder (premium) ---
  router.put('/api/notifications/reminder', isAuthenticated, requiresPremiumFor('custom_reminder'), asyncRoute('setting reminder', 'Failed to set reminder', async (req, res) => {
    const userId = req.user.id;
    const data = parseOrFail(reminderSchema, req.body, res, 'hour (0-23) and minute (0-59) are required');
    if (!data) return;

    const user = await storage.updateUserReminder(userId, data.hour, data.minute);
    res.json({ reminderHour: user.reminderHour, reminderMinute: user.reminderMinute });
  }));

  return router;
}
