import { Router } from "express";
import { Expo } from "expo-server-sdk";
import { storage } from "../storage";
import { isAuthenticated } from "../replitAuth";
import { requiresPremiumFor } from "../premiumAuth";
import { requireGroupMember } from "../groupAuth";
import { pushTokenSchema, unregisterPushSchema, reminderSchema, broadcastSchema, MAX_PUSH_TOKENS_PER_USER } from "./helpers";

export function createNotificationsRouter(): Router {
  const router = Router();

  // --- Push notification token registration ---
  router.post('/api/notifications/register', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const parsed = pushTokenSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "token and platform ('ios' or 'android') are required" });
      }
      const { token, platform } = parsed.data;

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
    } catch (error) {
      console.error('Error registering push token:', error);
      res.status(500).json({ message: 'Failed to register push token' });
    }
  });

  // --- Push notification token unregister ---
  router.delete('/api/push/unregister', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const parsed = unregisterPushSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: 'token is required' });
      }
      const { token } = parsed.data;

      await storage.deletePushToken(userId, token);
      res.json({ ok: true });
    } catch (error) {
      console.error('Error unregistering push token:', error);
      res.status(500).json({ message: 'Failed to unregister push token' });
    }
  });

  // --- Throne Broadcast (premium) ---
  router.post('/api/squads/:id/broadcast', isAuthenticated, requiresPremiumFor('throne_broadcast'), requireGroupMember('id'), async (req: any, res) => {
    try {
      const userId = req.user.id;
      const groupId = req.groupId;
      const parsed = broadcastSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: 'milestone is required' });
      }
      const { milestone } = parsed.data;

      // Look up all push tokens for group members
      const tokens = await storage.getGroupPushTokens(groupId);

      // Store the broadcast (don't actually send push yet)
      const broadcast = await storage.createBroadcast({ groupId, userId, milestone });

      res.json({ broadcast, tokenCount: tokens.length });
    } catch (error) {
      console.error('Error creating broadcast:', error);
      res.status(500).json({ message: 'Failed to create broadcast' });
    }
  });

  // --- Custom Reminder (premium) ---
  router.put('/api/notifications/reminder', isAuthenticated, requiresPremiumFor('custom_reminder'), async (req: any, res) => {
    try {
      const userId = req.user.id;
      const parsed = reminderSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: 'hour (0-23) and minute (0-59) are required' });
      }
      const { hour, minute } = parsed.data;

      const user = await storage.updateUserReminder(userId, hour, minute);
      res.json({ reminderHour: user.reminderHour, reminderMinute: user.reminderMinute });
    } catch (error) {
      console.error('Error setting reminder:', error);
      res.status(500).json({ message: 'Failed to set reminder' });
    }
  });

  return router;
}
