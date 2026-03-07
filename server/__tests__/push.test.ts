import { vi, describe, it, expect, beforeAll, beforeEach, afterAll } from "vitest";
import type { Express } from "express";
import type { Server } from "http";

/* ================================================================
 *  IN-MEMORY STORAGE  (hoisted above all vi.mock calls)
 * ================================================================ */
const memStore = vi.hoisted(() => {
  const _users = new Map<string, any>();
  const _groups = new Map<string, any>();
  let _members: any[] = [];
  const _entries = new Map<string, any>();
  const _invites = new Map<string, any>();
  let _locations: any[] = [];
  let _reactions: any[] = [];
  let _broadcasts: any[] = [];
  let _challengeCompletions: any[] = [];
  let _referrals: any[] = [];
  let _pushTokens: any[] = [];
  let _streakAlerts: any[] = [];
  let _memberId = 1;
  let _locationId = 1;
  let _reactionId = 1;
  let _broadcastId = 1;
  let _challengeId = 1;
  let _referralId = 1;
  let _pushTokenId = 1;
  let _streakAlertId = 1;

  return {
    /* ---- User ops ---- */
    async getUser(id: string) {
      return _users.get(id);
    },
    async upsertUser(data: any) {
      const existing = _users.get(data.id);
      const user = {
        id: data.id,
        email: data.email ?? existing?.email ?? null,
        firstName: data.firstName ?? existing?.firstName ?? null,
        lastName: data.lastName ?? existing?.lastName ?? null,
        username: existing?.username ?? null,
        profileImageUrl: data.profileImageUrl ?? existing?.profileImageUrl ?? null,
        deuceCount: existing?.deuceCount ?? 0,
        subscription: existing?.subscription ?? "free",
        subscriptionExpiresAt: existing?.subscriptionExpiresAt ?? null,
        streakInsuranceUsed: existing?.streakInsuranceUsed ?? false,
        theme: existing?.theme ?? "default",
        reminderHour: existing?.reminderHour ?? null,
        reminderMinute: existing?.reminderMinute ?? null,
        referralCode: existing?.referralCode ?? Math.random().toString(36).substring(2, 10).toUpperCase(),
        referredBy: existing?.referredBy ?? null,
        referralCount: existing?.referralCount ?? 0,
        createdAt: existing?.createdAt ?? new Date(),
        updatedAt: new Date(),
      };
      _users.set(data.id, user);
      return user;
    },
    async updateUserDeuceCount(userId: string, increment: number) {
      const user = _users.get(userId);
      if (user) { user.deuceCount = (user.deuceCount ?? 0) + increment; user.updatedAt = new Date(); }
    },
    async updateUserUsername(userId: string, username: string) {
      const user = _users.get(userId);
      if (!user) throw new Error("User not found");
      for (const [, u] of _users) {
        if (u.username === username && u.id !== userId) throw new Error("duplicate key value");
      }
      user.username = username;
      user.updatedAt = new Date();
      return user;
    },
    async updateUserProfilePicture(userId: string, profileImageUrl: string) {
      const user = _users.get(userId);
      if (!user) throw new Error("User not found");
      user.profileImageUrl = profileImageUrl;
      user.updatedAt = new Date();
      return user;
    },
    async updateUserTheme(userId: string, theme: string) {
      const user = _users.get(userId);
      if (!user) throw new Error("User not found");
      user.theme = theme;
      user.updatedAt = new Date();
      return user;
    },
    async getUserSubscription(userId: string) {
      const user = _users.get(userId);
      return {
        subscription: user?.subscription ?? "free",
        subscriptionExpiresAt: user?.subscriptionExpiresAt ?? null,
        streakInsuranceUsed: user?.streakInsuranceUsed ?? false,
      };
    },
    async updateUserSubscription(userId: string, subscription: string, expiresAt: Date) {
      const user = _users.get(userId);
      if (!user) throw new Error("User not found");
      user.subscription = subscription;
      user.subscriptionExpiresAt = expiresAt;
      user.updatedAt = new Date();
      return user;
    },
    async useStreakInsurance(userId: string) {
      const user = _users.get(userId);
      if (user) { user.streakInsuranceUsed = true; user.updatedAt = new Date(); }
    },
    async resetStreakInsurance(userId: string) {
      const user = _users.get(userId);
      if (user) { user.streakInsuranceUsed = false; user.updatedAt = new Date(); }
    },
    async resetAllStreakInsurance() { return 0; },
    async getPremiumAnalytics(_userId: string) {
      return { totalDeuces: 0, avgPerWeek: 0, longestStreak: 0, currentStreak: 0, bestDay: { day: "Monday", count: 0 }, groupRankings: [] };
    },
    async getWeeklyReport(_userId: string) {
      return { totalDeuces: 0, peakDay: { date: "2026-01-01", count: 0 }, mostActiveSquad: { name: "None", count: 0 }, longestStreak: 0, funniestEntry: null, totalReactionsReceived: 0, weekOf: "2026-01-01" };
    },

    /* ---- Group ops ---- */
    async createGroup(group: any) {
      const newGroup = {
        id: group.id,
        name: group.name,
        description: group.description ?? null,
        createdBy: group.createdBy,
        currentStreak: 0,
        longestStreak: 0,
        lastStreakDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      _groups.set(newGroup.id, newGroup);
      _members.push({ id: _memberId++, groupId: newGroup.id, userId: group.createdBy, role: "admin", joinedAt: new Date() });
      return newGroup;
    },
    async getUserGroups(userId: string) {
      const ids = _members.filter((m) => m.userId === userId).map((m) => m.groupId);
      return ids.map((gid) => {
        const g = _groups.get(gid)!;
        const memberCount = _members.filter((m) => m.groupId === gid).length;
        const groupEntries = [..._entries.values()].filter((e) => e.groupId === gid);
        return { ...g, memberCount, entryCount: groupEntries.length };
      });
    },
    async getGroupById(groupId: string) { return _groups.get(groupId); },
    async addGroupMember(member: any) {
      const m = { id: _memberId++, groupId: member.groupId, userId: member.userId, role: member.role ?? "member", joinedAt: new Date() };
      _members.push(m);
      return m;
    },
    async getGroupMembers(groupId: string) {
      return _members.filter((m) => m.groupId === groupId)
        .map((m) => ({ ...m, user: { ..._users.get(m.userId)!, personalRecord: undefined } }));
    },
    async isUserInGroup(userId: string, groupId: string) {
      return _members.some((m) => m.userId === userId && m.groupId === groupId);
    },
    async removeGroupMember(userId: string, groupId: string) {
      _members = _members.filter((m) => !(m.userId === userId && m.groupId === groupId));
    },

    /* ---- Deuce entry ops ---- */
    async createDeuceEntry(entry: any) {
      const e = { id: entry.id, userId: entry.userId, groupId: entry.groupId, location: entry.location, thoughts: entry.thoughts, ghost: entry.ghost ?? false, loggedAt: entry.loggedAt, createdAt: new Date() };
      _entries.set(e.id, e);
      return e;
    },
    async getGroupEntries(groupId: string) {
      return [..._entries.values()].filter((e) => e.groupId === groupId).map((e) => ({ ...e, user: _users.get(e.userId)! }));
    },
    async getUserDeucesByDate(_userId: string) { return []; },
    async getEntryById(entryId: string) { return _entries.get(entryId); },
    async getFeedEntries(groupIds: string[], limit: number) {
      return [..._entries.values()].filter((e) => groupIds.includes(e.groupId)).slice(0, limit)
        .map((e) => ({ ...e, user: _users.get(e.userId), reactions: [] }));
    },

    /* ---- Invite ops ---- */
    async createInvite(invite: any) { const inv = { ...invite, createdAt: new Date() }; _invites.set(inv.id, inv); return inv; },
    async getInviteById(inviteId: string) { return _invites.get(inviteId); },
    async deleteInvite(inviteId: string) { _invites.delete(inviteId); },
    async cleanupExpiredInvites() {},

    /* ---- Location ops ---- */
    async getLocations() { return _locations; },
    async createLocation(loc: any) { const l = { id: _locationId++, ...loc, createdAt: new Date() }; _locations.push(l); return l; },
    async getLocationByName(name: string) { return _locations.find((l) => l.name === name); },

    /* ---- Personal records ---- */
    async getUserPersonalRecord(_userId: string) { return undefined; },

    /* ---- Streak ops ---- */
    async getGroupStreak(_groupId: string) { return { currentStreak: 0, longestStreak: 0, lastStreakDate: null as string | null }; },
    async updateGroupStreak() {},
    async getMembersLogStatusToday(groupId: string, _today: string) {
      const memberIds = _members.filter((m) => m.groupId === groupId).map((m) => m.userId);
      return memberIds.map((uid) => ({
        userId: uid,
        username: _users.get(uid)?.username ?? null,
        firstName: _users.get(uid)?.firstName ?? null,
        profileImageUrl: null,
        hasLogged: [..._entries.values()].some((e) => e.groupId === groupId && e.userId === uid),
      }));
    },

    /* ---- Streak alert ops ---- */
    async getAllGroupsWithActiveStreaks(_minStreak: number) { return []; },
    async createStreakAlert(alert: any) {
      const a = { id: _streakAlertId++, ...alert, triggeredAt: new Date() };
      _streakAlerts.push(a);
      return a;
    },

    /* ---- Group preview ops ---- */
    async getGroupMemberCount(groupId: string) { return _members.filter((m) => m.groupId === groupId).length; },
    async getGroupDeuceCount(groupId: string) { return [..._entries.values()].filter((e) => e.groupId === groupId).length; },

    /* ---- Reaction ops ---- */
    async addReaction(reaction: any) {
      const exists = _reactions.find((r) => r.entryId === reaction.entryId && r.userId === reaction.userId && r.emoji === reaction.emoji);
      if (exists) throw new Error("duplicate key value violates unique constraint");
      const r = { id: _reactionId++, ...reaction, createdAt: new Date() };
      _reactions.push(r);
      return r;
    },
    async removeReaction(userId: string, entryId: string, emoji: string) {
      _reactions = _reactions.filter((r) => !(r.userId === userId && r.entryId === entryId && r.emoji === emoji));
    },
    async getEntryReactions(entryId: string) {
      return _reactions.filter((r) => r.entryId === entryId).map((r) => ({ ...r, user: _users.get(r.userId)! }));
    },

    /* ---- Push token ops ---- */
    async upsertPushToken(token: any) {
      const existing = _pushTokens.find((t) => t.userId === token.userId && t.token === token.token);
      if (existing) return existing;
      const t = { id: _pushTokenId++, ...token, createdAt: new Date() };
      _pushTokens.push(t);
      return t;
    },
    async getUserPushTokens(userId: string) {
      return _pushTokens.filter((t) => t.userId === userId);
    },
    async deletePushToken(userId: string, token: string) {
      _pushTokens = _pushTokens.filter((t) => !(t.userId === userId && t.token === token));
    },
    async getGroupPushTokens(groupId: string) {
      const memberIds = _members.filter((m) => m.groupId === groupId).map((m) => m.userId);
      return _pushTokens.filter((t) => memberIds.includes(t.userId));
    },

    /* ---- Broadcast ops ---- */
    async createBroadcast(broadcast: any) { const b = { id: _broadcastId++, ...broadcast, createdAt: new Date() }; _broadcasts.push(b); return b; },

    /* ---- Daily challenge ops ---- */
    async getDailyChallengeCompletion(userId: string, challengeDate: string) {
      return _challengeCompletions.find((c) => c.userId === userId && c.challengeDate === challengeDate);
    },
    async completeDailyChallenge(completion: any) { const c = { id: _challengeId++, ...completion, createdAt: new Date() }; _challengeCompletions.push(c); return c; },

    /* ---- Reminder ops ---- */
    async updateUserReminder(userId: string, hour: number, minute: number) {
      const user = _users.get(userId);
      if (!user) throw new Error("User not found");
      user.reminderHour = hour; user.reminderMinute = minute; user.updatedAt = new Date();
      return user;
    },

    /* ---- Legacy wall ops ---- */
    async getUserByUsername(username: string) { for (const [, u] of _users) { if (u.username === username) return u; } return undefined; },
    async getUserLongestStreak() { return 0; },
    async getUserBestDay() { return undefined; },
    async getGroupMemberTypicalHours() { return []; },

    /* ---- Referral ops ---- */
    async getUserByReferralCode(code: string) { for (const [, u] of _users) { if (u.referralCode === code) return u; } return undefined; },
    async applyReferral(refereeId: string, referrerId: string) {
      const referral = { id: _referralId++, referrerId, refereeId, discountApplied: false, createdAt: new Date() };
      _referrals.push(referral);
      return referral;
    },
    async getReferralStats(userId: string) {
      return { referralCount: _users.get(userId)?.referralCount ?? 0, referrals: [] };
    },

    /* ---- Referral dashboard ---- */
    async getReferralDashboardStats(_userId: string) {
      return { totalReferrals: 0, premiumConversions: 0, pendingConversions: 0 };
    },
    async getReferralLeaderboard() {
      return [];
    },

    /* ---- Admin stats ---- */
    async getAdminStats() {
      return { totalUsers: _users.size, premiumUsers: 0, dauToday: 0, totalLogsToday: 0, totalLogsAllTime: 0, activeGroups: 0, avgStreakLength: 0 };
    },

    /* ---- test helpers ---- */
    _reset() {
      _users.clear(); _groups.clear(); _members = []; _entries.clear(); _invites.clear();
      _locations = []; _reactions = []; _broadcasts = []; _challengeCompletions = [];
      _referrals = []; _pushTokens = []; _streakAlerts = [];
      _memberId = 1; _locationId = 1; _reactionId = 1; _broadcastId = 1;
      _challengeId = 1; _referralId = 1; _pushTokenId = 1; _streakAlertId = 1;
    },
    _getPushTokens() { return _pushTokens; },
    _getStreakAlerts() { return _streakAlerts; },
  };
});

/* ================================================================
 *  MODULE MOCKS
 * ================================================================ */
vi.mock("../db", () => ({ db: {}, pool: {} }));
vi.mock("../storage", () => ({ storage: memStore }));
vi.mock("@clerk/clerk-sdk-node", () => ({ createClerkClient: () => null }));

// Mock expo-server-sdk
const mockSendPushNotificationsAsync = vi.fn().mockResolvedValue([]);
vi.mock("expo-server-sdk", () => {
  class MockExpo {
    chunkPushNotifications(messages: any[]) { return [messages]; }
    sendPushNotificationsAsync(chunk: any[]) { return mockSendPushNotificationsAsync(chunk); }
    static isExpoPushToken(token: string) { return typeof token === "string" && token.startsWith("ExponentPushToken["); }
  }
  return { Expo: MockExpo };
});

vi.mock("../replitAuth", async () => {
  const sessionMod = await import("express-session");
  const session = sessionMod.default;

  return {
    clerkEnabled: false,
    clerk: null,
    getSession: () => session({ secret: "test-secret", resave: false, saveUninitialized: false }),
    setupAuth: async (app: any) => {
      app.use(session({ secret: "test-secret", resave: false, saveUninitialized: false }));
      app.post("/api/login", async (req: any, res: any) => {
        const { username } = req.body;
        if (!username || typeof username !== "string" || !username.trim()) {
          return res.status(400).json({ message: "Username is required" });
        }
        const name = username.trim();
        const userId = `dev-${name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
        const user = await memStore.upsertUser({
          id: userId, email: `${name.toLowerCase()}@localhost.dev`,
          firstName: name, lastName: null, profileImageUrl: null,
        });
        const userGroups = await memStore.getUserGroups(userId);
        if (userGroups.length === 0) {
          const { v4: uuidv4 } = await import("uuid");
          await memStore.createGroup({ id: uuidv4(), name: "Solo Deuces", description: "Your personal throne log", createdBy: userId });
        }
        req.session.userId = userId;
        req.session.save((err: any) => {
          if (err) return res.status(500).json({ message: "Failed to save session" });
          res.json({ ok: true, user: { id: user.id, username: user.username } });
        });
      });
      app.post("/api/auth/logout", (req: any, res: any) => { req.session.destroy(() => { res.json({ ok: true }); }); });
    },
    isAuthenticated: async (req: any, res: any, next: any) => {
      const userId = req.session?.userId;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });
      const user = await memStore.getUser(userId);
      if (!user) return res.status(401).json({ message: "Unauthorized" });
      req.user = user;
      next();
    },
  };
});

/* ================================================================
 *  IMPORTS  (resolved AFTER mocks are in place)
 * ================================================================ */
import express from "express";
import supertest from "supertest";
import { registerRoutes } from "../routes";
import { sendPushNotification } from "../notifications";

/* ================================================================
 *  TEST SETUP
 * ================================================================ */
let app: Express;
let server: Server;

beforeAll(async () => {
  app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  server = await registerRoutes(app);
});

afterAll(() => { server.close(); });

beforeEach(() => {
  memStore._reset();
  mockSendPushNotificationsAsync.mockReset();
  mockSendPushNotificationsAsync.mockResolvedValue([]);
});

async function loginAs(username: string) {
  const agent = supertest.agent(app);
  await agent.post("/api/login").send({ username });
  return agent;
}

/* ================================================================
 *  PUSH TOKEN REGISTRATION TESTS
 * ================================================================ */
describe("POST /api/notifications/register", () => {
  it("registers a push token for an authenticated user", async () => {
    const agent = await loginAs("alice");
    const res = await agent
      .post("/api/notifications/register")
      .send({ token: "ExponentPushToken[abc123]", platform: "ios" });

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);

    const tokens = await memStore.getUserPushTokens("dev-alice");
    expect(tokens).toHaveLength(1);
    expect(tokens[0].token).toBe("ExponentPushToken[abc123]");
    expect(tokens[0].platform).toBe("ios");
  });

  it("rejects invalid platform", async () => {
    const agent = await loginAs("alice");
    const res = await agent
      .post("/api/notifications/register")
      .send({ token: "ExponentPushToken[abc]", platform: "windows" });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/platform/);
  });

  it("rejects missing token", async () => {
    const agent = await loginAs("alice");
    const res = await agent
      .post("/api/notifications/register")
      .send({ platform: "ios" });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/token/);
  });

  it("requires authentication", async () => {
    const res = await supertest(app)
      .post("/api/notifications/register")
      .send({ token: "ExponentPushToken[abc]", platform: "ios" });

    expect(res.status).toBe(401);
  });

  it("deduplicates identical tokens for the same user", async () => {
    const agent = await loginAs("alice");
    await agent.post("/api/notifications/register").send({ token: "ExponentPushToken[abc123]", platform: "ios" });
    await agent.post("/api/notifications/register").send({ token: "ExponentPushToken[abc123]", platform: "ios" });

    const tokens = await memStore.getUserPushTokens("dev-alice");
    expect(tokens).toHaveLength(1);
  });

  it("allows multiple different tokens for same user", async () => {
    const agent = await loginAs("alice");
    await agent.post("/api/notifications/register").send({ token: "ExponentPushToken[device1]", platform: "ios" });
    await agent.post("/api/notifications/register").send({ token: "ExponentPushToken[device2]", platform: "android" });

    const tokens = await memStore.getUserPushTokens("dev-alice");
    expect(tokens).toHaveLength(2);
  });
});

/* ================================================================
 *  PUSH TOKEN UNREGISTER TESTS
 * ================================================================ */
describe("DELETE /api/push/unregister", () => {
  it("removes a push token for the authenticated user", async () => {
    const agent = await loginAs("alice");
    await agent.post("/api/notifications/register").send({ token: "ExponentPushToken[abc123]", platform: "ios" });

    const res = await agent
      .delete("/api/push/unregister")
      .send({ token: "ExponentPushToken[abc123]" });

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);

    const tokens = await memStore.getUserPushTokens("dev-alice");
    expect(tokens).toHaveLength(0);
  });

  it("rejects missing token", async () => {
    const agent = await loginAs("alice");
    const res = await agent.delete("/api/push/unregister").send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/token/);
  });

  it("requires authentication", async () => {
    const res = await supertest(app)
      .delete("/api/push/unregister")
      .send({ token: "ExponentPushToken[abc]" });

    expect(res.status).toBe(401);
  });

  it("succeeds silently if token does not exist", async () => {
    const agent = await loginAs("alice");
    const res = await agent
      .delete("/api/push/unregister")
      .send({ token: "ExponentPushToken[nonexistent]" });

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });
});

/* ================================================================
 *  sendPushNotification UNIT TESTS
 * ================================================================ */
describe("sendPushNotification", () => {
  it("returns { sent: 0, failed: 0 } when user has no tokens", async () => {
    await memStore.upsertUser({ id: "user-1", email: null, firstName: "Test", lastName: null, profileImageUrl: null });

    const result = await sendPushNotification("user-1", "Hello", "World");
    expect(result).toEqual({ sent: 0, failed: 0 });
    expect(mockSendPushNotificationsAsync).not.toHaveBeenCalled();
  });

  it("sends notification to valid Expo token", async () => {
    await memStore.upsertUser({ id: "user-1", email: null, firstName: "Test", lastName: null, profileImageUrl: null });
    await memStore.upsertPushToken({ userId: "user-1", token: "ExponentPushToken[valid]", platform: "ios" });

    mockSendPushNotificationsAsync.mockResolvedValueOnce([{ status: "ok", id: "receipt-1" }]);

    const result = await sendPushNotification("user-1", "Hello", "World");
    expect(result).toEqual({ sent: 1, failed: 0 });
    expect(mockSendPushNotificationsAsync).toHaveBeenCalledTimes(1);
  });

  it("removes invalid (non-Expo format) tokens", async () => {
    await memStore.upsertUser({ id: "user-1", email: null, firstName: "Test", lastName: null, profileImageUrl: null });
    await memStore.upsertPushToken({ userId: "user-1", token: "not-a-valid-token", platform: "ios" });

    const result = await sendPushNotification("user-1", "Hello", "World");
    expect(result.failed).toBe(1);

    const tokens = await memStore.getUserPushTokens("user-1");
    expect(tokens).toHaveLength(0);
  });

  it("removes DeviceNotRegistered tokens from DB", async () => {
    await memStore.upsertUser({ id: "user-1", email: null, firstName: "Test", lastName: null, profileImageUrl: null });
    await memStore.upsertPushToken({ userId: "user-1", token: "ExponentPushToken[expired]", platform: "ios" });

    mockSendPushNotificationsAsync.mockResolvedValueOnce([
      { status: "error", message: "Device not registered", details: { error: "DeviceNotRegistered" } },
    ]);

    const result = await sendPushNotification("user-1", "Hello", "World");
    expect(result.sent).toBe(0);
    expect(result.failed).toBe(1);

    const tokens = await memStore.getUserPushTokens("user-1");
    expect(tokens).toHaveLength(0);
  });

  it("sends to multiple tokens for same user", async () => {
    await memStore.upsertUser({ id: "user-1", email: null, firstName: "Test", lastName: null, profileImageUrl: null });
    await memStore.upsertPushToken({ userId: "user-1", token: "ExponentPushToken[device1]", platform: "ios" });
    await memStore.upsertPushToken({ userId: "user-1", token: "ExponentPushToken[device2]", platform: "android" });

    mockSendPushNotificationsAsync.mockResolvedValueOnce([
      { status: "ok", id: "receipt-1" },
      { status: "ok", id: "receipt-2" },
    ]);

    const result = await sendPushNotification("user-1", "Hello", "World");
    expect(result.sent).toBe(2);
    expect(result.failed).toBe(0);
  });

  it("passes data payload through", async () => {
    await memStore.upsertUser({ id: "user-1", email: null, firstName: "Test", lastName: null, profileImageUrl: null });
    await memStore.upsertPushToken({ userId: "user-1", token: "ExponentPushToken[abc]", platform: "ios" });

    mockSendPushNotificationsAsync.mockResolvedValueOnce([{ status: "ok", id: "receipt-1" }]);

    await sendPushNotification("user-1", "Title", "Body", { type: "streak_alert", groupId: "g1" });

    const sentMessages = mockSendPushNotificationsAsync.mock.calls[0][0];
    expect(sentMessages[0].data).toEqual({ type: "streak_alert", groupId: "g1" });
  });
});

/* ================================================================
 *  STREAK NOTIFICATION + PUSH INTEGRATION
 * ================================================================ */
describe("Streak notification sends push", () => {
  it("checkAllGroupStreaksAndNotify sends push for at-risk groups", async () => {
    // Set up a group with a 5-day streak where one member hasn't logged
    await memStore.upsertUser({ id: "user-alice", email: null, firstName: "Alice", lastName: null, profileImageUrl: null });
    await memStore.upsertUser({ id: "user-bob", email: null, firstName: "Bob", lastName: null, profileImageUrl: null });

    const { v4: uuidv4 } = await import("uuid");
    const groupId = uuidv4();

    // Create group manually (bypass the createGroup auto-member)
    const group = await memStore.createGroup({ id: groupId, name: "Test Squad", createdBy: "user-alice" });
    await memStore.addGroupMember({ groupId, userId: "user-bob", role: "member" });

    // Give it a streak
    (group as any).currentStreak = 5;
    (group as any).longestStreak = 5;

    // Override getAllGroupsWithActiveStreaks to return our group
    const origGetAll = memStore.getAllGroupsWithActiveStreaks;
    memStore.getAllGroupsWithActiveStreaks = async (_minStreak: number) => [group];

    // Register push tokens
    await memStore.upsertPushToken({ userId: "user-alice", token: "ExponentPushToken[alice]", platform: "ios" });
    await memStore.upsertPushToken({ userId: "user-bob", token: "ExponentPushToken[bob]", platform: "android" });

    // Mock that no one has logged today (so streak is at risk)
    const origGetStatus = memStore.getMembersLogStatusToday;
    memStore.getMembersLogStatusToday = async (_groupId: string, _today: string) => [
      { userId: "user-alice", username: "alice", firstName: "Alice", profileImageUrl: null, hasLogged: true },
      { userId: "user-bob", username: null, firstName: "Bob", profileImageUrl: null, hasLogged: false },
    ];

    mockSendPushNotificationsAsync.mockResolvedValue([{ status: "ok", id: "receipt-1" }]);

    // Run the streak check
    const { checkAllGroupStreaksAndNotify } = await import("../streakNotifications");
    const summary = await checkAllGroupStreaksAndNotify();

    expect(summary.atRiskCount).toBe(1);
    expect(summary.notificationsSent).toBe(1);

    // Verify push was sent
    expect(mockSendPushNotificationsAsync).toHaveBeenCalled();

    // Verify streak alert was stored with notified: true
    const alerts = memStore._getStreakAlerts();
    expect(alerts).toHaveLength(1);
    expect(alerts[0].notified).toBe(true);

    // Restore
    memStore.getAllGroupsWithActiveStreaks = origGetAll;
    memStore.getMembersLogStatusToday = origGetStatus;
  });
});
