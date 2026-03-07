import { Router } from "express";
import { storage } from "../storage";
import { insertGroupSchema } from "@shared/schema";
import { isAuthenticated } from "../replitAuth";
import { requireGroupMember } from "../groupAuth";
import { requiresPremiumFor } from "../premiumAuth";
import { track } from "../lib/analytics";
import { v4 as uuidv4 } from "uuid";
import {
  createGroupSchema,
  isPremiumUser,
  getTodayUTC,
  getYesterdayUTC,
  checkAndNotifyStreakRisk,
} from "./helpers";

export function createGroupsRouter(): Router {
  const router = Router();

  // Group preview for invite landing page (public, no auth)
  router.get('/api/groups/preview/:inviteCode', async (req, res) => {
    try {
      const { inviteCode } = req.params;
      const invite = await storage.getInviteById(inviteCode);
      if (!invite || invite.expiresAt < new Date()) {
        return res.status(404).json({ message: "Invite not found or expired" });
      }
      const group = await storage.getGroupById(invite.groupId);
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }
      const memberCount = await storage.getGroupMemberCount(invite.groupId);
      const deuceCount = await storage.getGroupDeuceCount(invite.groupId);
      res.json({ name: group.name, memberCount, deuceCount });
    } catch (error) {
      console.error("Error fetching group preview:", error);
      res.status(500).json({ message: "Failed to fetch group preview" });
    }
  });

  // Group routes (free — squad limit for free users)
  router.post('/api/groups', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;

      // Free users limited to 3 squads
      if (!isPremiumUser(req.user)) {
        const userGroups = await storage.getUserGroups(userId);
        if (userGroups.length >= 3) {
          return res.status(403).json({ message: 'Upgrade to Premium for unlimited squads', upgrade: true, feature: 'unlimited_squads' });
        }
      }

      const parsed = createGroupSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid group data: name is required (max 100 chars)" });
      }
      const groupData = insertGroupSchema.parse({
        ...parsed.data,
        createdBy: userId,
      });

      const group = await storage.createGroup({
        ...groupData,
        id: uuidv4(),
      });

      track("group_created", userId);

      res.json(group);
    } catch (error) {
      console.error("Error creating group:", error);
      res.status(500).json({ message: "Failed to create group" });
    }
  });

  router.get('/api/groups', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      console.log("Fetching groups for user:", userId);
      const groups = await storage.getUserGroups(userId);
      console.log("User groups result:", groups);
      res.json(groups);
    } catch (error) {
      console.error("Error fetching groups:", error);
      res.status(500).json({ message: "Failed to fetch groups" });
    }
  });

  router.get('/api/groups/:groupId', isAuthenticated, requireGroupMember(), async (req: any, res) => {
    try {
      const groupId = req.groupId;

      const group = await storage.getGroupById(groupId);
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }

      const members = await storage.getGroupMembers(groupId);
      const entries = await storage.getGroupEntries(groupId);

      console.log("Group details - members:", members.length, "entries:", entries.length);
      console.log("Members data:", members);

      res.json({ group, members, entries });
    } catch (error) {
      console.error("Error fetching group details:", error);
      res.status(500).json({ message: "Failed to fetch group details" });
    }
  });

  // Invite routes (free)
  router.post('/api/groups/:groupId/invite', isAuthenticated, requireGroupMember(), async (req: any, res) => {
    try {
      const userId = req.user.id;
      const groupId = req.groupId;

      const inviteId = uuidv4();
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

      await storage.createInvite({
        id: inviteId,
        groupId,
        createdBy: userId,
        expiresAt,
      });

      track("invite_sent", userId);

      const inviteLink = `${req.protocol}://${req.get('host')}/join/${inviteId}`;
      res.json({ inviteLink, id: inviteId });
    } catch (error) {
      console.error("Error creating invite:", error);
      res.status(500).json({ message: "Failed to create invite" });
    }
  });

  router.post('/api/join/:inviteId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { inviteId } = req.params;

      console.log("User attempting to join group:", userId, "invite:", inviteId);

      const invite = await storage.getInviteById(inviteId);
      if (!invite || invite.expiresAt < new Date()) {
        return res.status(400).json({ message: "Invalid or expired invite" });
      }

      const isAlreadyMember = await storage.isUserInGroup(userId, invite.groupId);
      if (isAlreadyMember) {
        console.log("User is already a member of group:", invite.groupId);
        const group = await storage.getGroupById(invite.groupId);
        return res.json({ group, message: "Already a member of this group" });
      }

      // Free users limited to 3 squads
      if (!isPremiumUser(req.user)) {
        const userGroups = await storage.getUserGroups(userId);
        if (userGroups.length >= 3) {
          return res.status(403).json({ message: 'Upgrade to Premium for unlimited squads', upgrade: true, feature: 'unlimited_squads' });
        }
      }

      console.log("Adding user to group:", userId, "group:", invite.groupId);
      // User already exists (isAuthenticated ensures this), just add to group

      await storage.addGroupMember({
        groupId: invite.groupId,
        userId,
        role: "member",
      });

      await storage.deleteInvite(inviteId);

      track("group_joined", userId);

      const group = await storage.getGroupById(invite.groupId);
      console.log("User successfully joined group:", group);
      res.json({ group });
    } catch (error) {
      console.error("Error joining group:", error);
      res.status(500).json({ message: "Failed to join group" });
    }
  });

  // Referral landing: /join?ref=CODE -> store code in session, redirect to /
  router.get('/join', (req: any, res) => {
    const ref = req.query.ref;
    if (ref && req.session) {
      req.session.referralCode = ref;
    }
    res.redirect('/');
  });

  // Legacy /join/:inviteId redirect -> new client-side /invite/:code page
  router.get('/join/:inviteId', async (req: any, res) => {
    res.redirect(`/invite/${req.params.inviteId}`);
  });

  // Streak routes (free — part of groups)
  router.get('/api/groups/:groupId/streak', isAuthenticated, requireGroupMember(), async (req: any, res) => {
    try {
      const groupId = req.groupId;

      const today = getTodayUTC();
      const yesterday = getYesterdayUTC();
      const streak = await storage.getGroupStreak(groupId);
      const logsToday = await storage.getMembersLogStatusToday(groupId, today);

      // If streak is stale (lastStreakDate is not today and not yesterday), reset it for the response
      let currentStreak = streak.currentStreak;
      if (streak.lastStreakDate && streak.lastStreakDate !== today && streak.lastStreakDate !== yesterday) {
        currentStreak = 0;
      }

      res.json({
        currentStreak,
        longestStreak: streak.longestStreak,
        memberCount: logsToday.length,
        logsToday: logsToday.map(m => ({
          userId: m.userId,
          username: m.username || m.firstName || 'Unknown',
          hasLogged: m.hasLogged,
          profileImageUrl: m.profileImageUrl,
        })),
      });
    } catch (error) {
      console.error("Error fetching streak:", error);
      res.status(500).json({ message: "Failed to fetch streak" });
    }
  });

  router.post('/api/groups/:groupId/streak/check', isAuthenticated, requireGroupMember(), async (req: any, res) => {
    try {
      const groupId = req.groupId;

      const result = await checkAndNotifyStreakRisk(groupId);
      res.json(result);
    } catch (error) {
      console.error("Error checking streak risk:", error);
      res.status(500).json({ message: "Failed to check streak risk" });
    }
  });

  // Group Leaderboard — member rankings by deuce count (free)
  router.get('/api/groups/:groupId/leaderboard', isAuthenticated, requireGroupMember(), async (req: any, res) => {
    try {
      const groupId = req.groupId;

      const members = await storage.getGroupMembers(groupId);
      const ranked = members
        .map(m => ({
          userId: m.userId,
          username: m.user?.username ?? null,
          profileImageUrl: m.user?.profileImageUrl ?? null,
          deuceCount: m.user?.deuceCount ?? 0,
        }))
        .sort((a, b) => b.deuceCount - a.deuceCount);

      res.json(ranked);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });

  // Weekly Throne Report — group-level shareable summary card
  router.get('/api/groups/:groupId/weekly-report', isAuthenticated, requireGroupMember(), async (req: any, res) => {
    try {
      const groupId = req.groupId;
      const report = await storage.getGroupWeeklyReport(groupId);
      res.json(report);
    } catch (error: any) {
      if (error.message === "Group not found") {
        return res.status(404).json({ message: "Group not found" });
      }
      console.error("Error fetching group weekly report:", error);
      res.status(500).json({ message: "Failed to fetch group weekly report" });
    }
  });

  // Squad Spy Mode — typical log hour per member (premium)
  router.get('/api/groups/:groupId/spy', isAuthenticated, requireGroupMember(), requiresPremiumFor('squad_spy'), async (req: any, res) => {
    try {
      const groupId = req.groupId;

      const typicalHours = await storage.getGroupMemberTypicalHours(groupId);
      res.json(typicalHours);
    } catch (error) {
      console.error("Error fetching spy data:", error);
      res.status(500).json({ message: "Failed to fetch spy data" });
    }
  });

  return router;
}
