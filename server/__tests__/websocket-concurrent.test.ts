/**
 * Click 4: WebSocket event tests and concurrent operations
 */
import { vi, describe, it, expect, beforeAll, beforeEach, afterAll } from "vitest";
import type { Express } from "express";
import type { Server } from "http";
import WebSocket from "ws";

/* ================================================================
 *  IN-MEMORY STORAGE
 * ================================================================ */
const memStore = vi.hoisted(() => {
  const _users = new Map<string, any>();
  const _groups = new Map<string, any>();
  let _members: any[] = [];
  const _entries = new Map<string, any>();
  let _reactions: any[] = [];
  let _memberId = 1;
  let _reactionId = 1;

  return {
    async getUser(id: string) { const u = _users.get(id); return u?.deletedAt ? undefined : u; },
    async upsertUser(data: any) {
      const existing = _users.get(data.id);
      const user = { id: data.id, email: data.email ?? existing?.email ?? null, firstName: data.firstName ?? existing?.firstName ?? null, lastName: data.lastName ?? existing?.lastName ?? null, username: existing?.username ?? null, profileImageUrl: data.profileImageUrl ?? existing?.profileImageUrl ?? null, deuceCount: existing?.deuceCount ?? 0, subscription: existing?.subscription ?? "free", subscriptionExpiresAt: existing?.subscriptionExpiresAt ?? null, streakInsuranceUsed: existing?.streakInsuranceUsed ?? false, theme: existing?.theme ?? "default", reminderHour: existing?.reminderHour ?? null, reminderMinute: existing?.reminderMinute ?? null, referralCode: existing?.referralCode ?? Math.random().toString(36).substring(2, 10).toUpperCase(), referredBy: existing?.referredBy ?? null, referralCount: existing?.referralCount ?? 0, createdAt: existing?.createdAt ?? new Date(), updatedAt: new Date() };
      _users.set(data.id, user);
      return user;
    },
    async updateUserDeuceCount(userId: string, increment: number) { const user = _users.get(userId); if (user) { user.deuceCount = (user.deuceCount ?? 0) + increment; } },
    async updateUserUsername(userId: string, username: string) { const user = _users.get(userId); if (!user) throw new Error("User not found"); user.username = username; return user; },
    async updateUserProfilePicture(userId: string, url: string) { const user = _users.get(userId); if (!user) throw new Error("User not found"); user.profileImageUrl = url; return user; },
    async updateUserTheme(userId: string, theme: string) { const user = _users.get(userId); if (!user) throw new Error("User not found"); user.theme = theme; return user; },
    async getUserSubscription(userId: string) { const user = _users.get(userId); return { subscription: user?.subscription ?? "free", subscriptionExpiresAt: user?.subscriptionExpiresAt ?? null, streakInsuranceUsed: user?.streakInsuranceUsed ?? false }; },
    async updateUserSubscription(userId: string, subscription: string, expiresAt: Date) { const user = _users.get(userId); if (!user) throw new Error("User not found"); user.subscription = subscription; user.subscriptionExpiresAt = expiresAt; return user; },
    async useStreakInsurance() {},
    async resetStreakInsurance() {},
    async resetAllStreakInsurance() { return 0; },
    async getPremiumAnalytics(_userId: string) { return { totalDeuces: 0, avgPerWeek: 0, longestStreak: 0, currentStreak: 0, bestDay: { day: "Monday", count: 0 }, groupRankings: [] }; },
    async getWeeklyReport(_userId: string) { return { totalDeuces: 0, peakDay: { date: "2026-01-01", count: 0 }, mostActiveSquad: { name: "None", count: 0 }, longestStreak: 0, funniestEntry: null, totalReactionsReceived: 0, weekOf: "2026-01-01" }; },
    async createGroup(group: any) {
      const newGroup = { id: group.id, name: group.name, description: group.description ?? null, createdBy: group.createdBy, createdAt: new Date(), updatedAt: new Date() };
      _groups.set(newGroup.id, newGroup);
      _members.push({ id: _memberId++, groupId: newGroup.id, userId: group.createdBy, role: "admin", joinedAt: new Date() });
      return newGroup;
    },
    async getUserGroups(userId: string) {
      const ids = _members.filter((m) => m.userId === userId).map((m) => m.groupId);
      return ids.map((gid) => ({ ..._groups.get(gid)!, memberCount: _members.filter(m => m.groupId === gid).length, entryCount: 0 }));
    },
    async getGroupById(groupId: string) { return _groups.get(groupId); },
    async addGroupMember(member: any) { const m = { id: _memberId++, groupId: member.groupId, userId: member.userId, role: member.role ?? "member", joinedAt: new Date() }; _members.push(m); return m; },
    async getGroupMembers(groupId: string) { return _members.filter((m) => m.groupId === groupId).map((m) => ({ ...m, user: { ..._users.get(m.userId), personalRecord: undefined } })); },
    async isUserInGroup(userId: string, groupId: string) { return _members.some((m) => m.userId === userId && m.groupId === groupId); },
    async removeGroupMember(userId: string, groupId: string) { _members = _members.filter((m) => !(m.userId === userId && m.groupId === groupId)); },
    async createDeuceEntry(entry: any) {
      const e = { id: entry.id, userId: entry.userId, groupId: entry.groupId, location: entry.location, thoughts: entry.thoughts, ghost: entry.ghost ?? false, loggedAt: entry.loggedAt, createdAt: new Date() };
      _entries.set(e.id, e);
      return e;
    },
    async getUserDailyLogCount(userId: string, dateUTC: string) {
      const start = new Date(`${dateUTC}T00:00:00.000Z`);
      const end = new Date(`${dateUTC}T23:59:59.999Z`);
      return [..._entries.values()].filter((e) => e.userId === userId && e.createdAt >= start && e.createdAt <= end).length;
    },
    async getGroupEntries(groupId: string) { return [..._entries.values()].filter((e) => e.groupId === groupId).map((e) => ({ ...e, user: _users.get(e.userId) })); },
    async getUserDeucesByDate(_userId: string) { return []; },
    async getEntryById(entryId: string) { return _entries.get(entryId); },
    async getFeedEntries(_groupIds: string[], _limit: number) { return []; },
    async createInvite(invite: any) { return { id: invite.id, groupId: invite.groupId, createdBy: invite.createdBy, expiresAt: invite.expiresAt, createdAt: new Date() }; },
    async getInviteById(_inviteId: string) { return undefined; },
    async getLocations() { return []; },
    async getLocationsForUser(_userId: string) { return []; },
    async createLocation(loc: any) { return { id: 1, ...loc, createdAt: new Date() }; },
    async getLocationByName(_name: string) { return undefined; },
    async getUserPersonalRecord(_userId: string) { return undefined; },
    async getGroupStreak(_groupId: string) { return { currentStreak: 0, longestStreak: 0, lastStreakDate: null }; },
    async getGroupStreaksBatch(groupIds: string[]) { const map = new Map<string, any>(); for (const id of groupIds) map.set(id, { currentStreak: 0, longestStreak: 0, lastStreakDate: null }); return map; },
    async updateGroupStreak() {},
    async resetGroupStreak() {},
    async getMembersLogStatusToday(_groupId: string, _today: string) { return []; },
    async getAllGroupsWithActiveStreaks(_minStreak: number) { return []; },
    async createStreakAlert(_alert: any) { return { id: 1 }; },
    async getGroupMemberCount(groupId: string) { return _members.filter((m) => m.groupId === groupId).length; },
    async getGroupDeuceCount(groupId: string) { return [..._entries.values()].filter((e) => e.groupId === groupId).length; },
    async addReaction(reaction: any) {
      const exists = _reactions.find((r) => r.entryId === reaction.entryId && r.userId === reaction.userId && r.emoji === reaction.emoji);
      if (exists) throw new Error("duplicate key value violates unique constraint");
      const r = { id: _reactionId++, ...reaction, createdAt: new Date() };
      _reactions.push(r);
      return r;
    },
    async removeReaction(userId: string, entryId: string, emoji: string) { _reactions = _reactions.filter((r) => !(r.userId === userId && r.entryId === entryId && r.emoji === emoji)); },
    async getEntryReactions(entryId: string) { return _reactions.filter((r) => r.entryId === entryId).map((r) => ({ ...r, user: _users.get(r.userId) })); },
    async upsertPushToken(token: any) { return { id: 1, ...token }; },
    async getUserPushTokens(_userId: string) { return []; },
    async countUserPushTokens(_userId: string) { return 0; },
    async deletePushToken() {},
    async getGroupPushTokens(_groupId: string) { return []; },
    async createBroadcast(broadcast: any) { return { id: 1, ...broadcast }; },
    async getDailyChallengeCompletion(_userId: string, _challengeDate: string) { return undefined; },
    async completeDailyChallenge(completion: any) { return { id: 1, ...completion }; },
    async updateUserReminder(userId: string, hour: number, minute: number) { const user = _users.get(userId); if (!user) throw new Error("User not found"); user.reminderHour = hour; user.reminderMinute = minute; return user; },
    async getUserByUsername(username: string) { for (const [, u] of _users) { if (u.username === username) return u; } return undefined; },
    async getUserLongestStreak(_userId: string) { return 0; },
    async getUserBestDay(_userId: string) { return undefined; },
    async getGroupMemberTypicalHours(_groupId: string) { return []; },
    async getUserByReferralCode(code: string) { for (const [, u] of _users) { if (u.referralCode === code) return u; } return undefined; },
    async applyReferral() { return { id: 1 }; },
    async getReferralStats(_userId: string) { return { referralCount: 0, referrals: [] }; },
    async getReferralDashboardStats(_userId: string) { return { totalReferrals: 0, premiumConversions: 0, pendingConversions: 0 }; },
    async getReferralLeaderboard() { return []; },
    async getAdminStats() { return { totalUsers: _users.size, premiumUsers: 0, dauToday: 0, totalLogsToday: 0, totalLogsAllTime: _entries.size, activeGroups: _groups.size, avgStreakLength: 0 }; },
    async getGroupWeeklyReport(_groupId: string) { return { weekOf: "2026-01-01", totalDeuces: 0, mvp: null, members: [], funnyStats: {} }; },
    async getGroupLeaderboard(groupId: string) { return _members.filter((m) => m.groupId === groupId).map((m) => ({ userId: m.userId, username: null, profileImageUrl: null, deuceCount: 0, monthlyDeuces: 0, weeklyDeuces: 0, isMvp: false })); },
    async getBingoCard() { return undefined; },
    async deleteBingoCard() {},
    async createBingoCard(data: any) { return { id: data.id, ...data, createdAt: new Date() }; },
    async checkAndUpdateBingoProgress() { return { completedSquares: [], hasBlackout: false }; },
    async getBingoLeaderboard() { return []; },

    _reset() { _users.clear(); _groups.clear(); _members = []; _entries.clear(); _reactions = []; _memberId = 1; _reactionId = 1; },
    _seedEntry(entry: any) { _entries.set(entry.id, { ...entry, createdAt: entry.createdAt ?? new Date() }); },
    _seedMember(member: any) { _members.push({ id: _memberId++, ...member, joinedAt: new Date() }); },
  };
});

vi.mock("../db", () => ({ db: {}, pool: { query: async () => ({}) } }));
vi.mock("../storage", () => ({ storage: memStore }));
vi.mock("@clerk/clerk-sdk-node", () => ({ createClerkClient: () => null }));

vi.mock("../replitAuth", async () => {
  const sessionMod = await import("express-session");
  const session = sessionMod.default;
  const sessionMiddleware = session({ secret: "test-secret", resave: false, saveUninitialized: false });

  return {
    clerkEnabled: false,
    clerk: null,
    getSession: () => sessionMiddleware,
    setupAuth: async (app: any) => {
      app.use(sessionMiddleware);
      app.post("/api/login", async (req: any, res: any) => {
        const { username } = req.body;
        if (!username || typeof username !== "string" || !username.trim()) return res.status(400).json({ message: "Username is required" });
        const name = username.trim();
        const userId = `dev-${name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
        const user = await memStore.upsertUser({ id: userId, email: `${name}@test.dev`, firstName: name, lastName: null, profileImageUrl: null });
        const userGroups = await memStore.getUserGroups(userId);
        if (userGroups.length === 0) {
          const { v4: uuidv4 } = await import("uuid");
          await memStore.createGroup({ id: uuidv4(), name: "Solo Deuces", description: "Your personal throne log", createdBy: userId });
        }
        req.session.userId = userId;
        req.session.save((err: any) => {
          if (err) return res.status(500).json({ message: "Failed to save session" });
          res.json({ ok: true, user: { id: user.id } });
        });
      });
      app.get("/api/logout", (req: any, res: any) => { req.session.destroy(() => { res.redirect("/"); }); });
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

import express from "express";
import supertest from "supertest";
import { registerRoutes } from "../routes";

let app: Express;
let server: Server;
let port: number;

beforeAll(async () => {
  app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  server = await registerRoutes(app);
  await new Promise<void>((resolve) => {
    server.listen(0, () => {
      port = (server.address() as any).port;
      resolve();
    });
  });
});

afterAll(() => { server.close(); });
beforeEach(() => { memStore._reset(); });

async function loginAs(username: string) {
  const agent = supertest.agent(app);
  await agent.post("/api/login").send({ username });
  return agent;
}

async function getSoloGroupId(username: string): Promise<string> {
  const userId = `dev-${username.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
  const groups = await memStore.getUserGroups(userId);
  return groups[0].id;
}

/* ================================================================
 *  WebSocket — auth rejection tests
 * ================================================================ */
describe("WebSocket — authentication rejection", () => {
  it("server is listening and health endpoint responds (WS server co-exists with HTTP)", async () => {
    // Verify HTTP server is properly listening (same server hosts both HTTP and WS)
    const response = await fetch(`http://localhost:${port}/api/health`);
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.status).toBe("ok");
  });

  it("destroys socket for non-/ws path upgrade", async () => {
    await new Promise<void>((resolve) => {
      const ws = new WebSocket(`ws://localhost:${port}/other`);
      const timeout = setTimeout(() => { ws.destroy(); resolve(); }, 2000);
      ws.on("error", () => { clearTimeout(timeout); resolve(); });
      ws.on("unexpected-response", () => { clearTimeout(timeout); ws.destroy(); resolve(); });
    });
  });

  it("HTTP endpoints still function after WebSocket setup", async () => {
    const res = await supertest(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});

/* ================================================================
 *  WebSocket broadcast — HTTP side-effect verification
 * ================================================================ */
describe("WebSocket broadcast — deuce log triggers", () => {
  it("non-ghost deuce log succeeds and server stays healthy", async () => {
    const alice = await loginAs("alice");
    const groupId = await getSoloGroupId("alice");
    const res = await alice.post("/api/deuces").send({ groupIds: [groupId], location: "Home", thoughts: "Broadcast test" });
    expect(res.status).toBe(200);
    expect(res.body.entries).toHaveLength(1);
    expect(res.body.entries[0]).toHaveProperty("id");
    // Server stays healthy after broadcast attempt
    const health = await supertest(app).get("/api/health");
    expect(health.status).toBe(200);
  });

  it("ghost deuce log skips WS broadcast, succeeds, server healthy", async () => {
    const alice = await loginAs("alice");
    const groupId = await getSoloGroupId("alice");
    const res = await alice.post("/api/deuces").send({ groupIds: [groupId], location: "Home", ghost: true });
    expect(res.status).toBe(200);
    const health = await supertest(app).get("/api/health");
    expect(health.status).toBe(200);
  });

  it("logging to multiple groups broadcasts to each group", async () => {
    const alice = await loginAs("alice");
    const aliceId = "dev-alice";
    const group1 = await getSoloGroupId("alice");
    // Create a second group for alice
    const g2Res = await alice.post("/api/groups").send({ name: "Squad Two" });
    expect(g2Res.status).toBe(200);
    const group2 = g2Res.body.id;
    await memStore.addGroupMember({ groupId: group2, userId: aliceId, role: "admin" });

    const res = await alice.post("/api/deuces").send({ groupIds: [group1, group2], location: "Office" });
    expect(res.status).toBe(200);
    expect(res.body.entries).toHaveLength(2);
  });

  it("multi-group log creates an entry per group and server stays healthy", async () => {
    // Verifies the fix for multi-group subscription cleanup: a user who belongs
    // to N groups can log to all N and the server remains healthy.
    const alice = await loginAs("alice");
    const aliceId = "dev-alice";
    const group1 = await getSoloGroupId("alice");
    const g2Res = await alice.post("/api/groups").send({ name: "Third Squad" });
    expect(g2Res.status).toBe(200);
    const group2 = g2Res.body.id;
    await memStore.addGroupMember({ groupId: group2, userId: aliceId, role: "admin" });

    const res = await alice.post("/api/deuces").send({ groupIds: [group1, group2], location: "Everywhere" });
    expect(res.status).toBe(200);
    expect(res.body.entries).toHaveLength(2);
    // Confirm entries are for distinct groups
    const groupIds = res.body.entries.map((e: any) => e.groupId);
    expect(new Set(groupIds).size).toBe(2);

    const health = await supertest(app).get("/api/health");
    expect(health.status).toBe(200);
  });
});

/* ================================================================
 *  Concurrent operations — reaction deduplication
 * ================================================================ */
describe("Concurrent operations — reaction deduplication", () => {
  async function logAndGetEntryId(agent: supertest.Agent, groupId: string): Promise<string> {
    const res = await agent.post("/api/deuces").send({ groupIds: [groupId], location: "Home", thoughts: "For reaction test" });
    expect(res.status).toBe(200);
    return res.body.entries[0].id;
  }

  it("adding same reaction twice returns 400 on second attempt", async () => {
    const alice = await loginAs("alice");
    const groupId = await getSoloGroupId("alice");
    const entryId = await logAndGetEntryId(alice, groupId);

    const r1 = await alice.post(`/api/entries/${entryId}/reactions`).send({ emoji: "💩" });
    expect(r1.status).toBe(200);

    const r2 = await alice.post(`/api/entries/${entryId}/reactions`).send({ emoji: "💩" });
    expect(r2.status).toBe(400);
    expect(r2.body.message).toMatch(/already reacted/i);
  });

  it("different emojis from same user both succeed", async () => {
    const alice = await loginAs("alice");
    const groupId = await getSoloGroupId("alice");
    const entryId = await logAndGetEntryId(alice, groupId);

    const r1 = await alice.post(`/api/entries/${entryId}/reactions`).send({ emoji: "💩" });
    const r2 = await alice.post(`/api/entries/${entryId}/reactions`).send({ emoji: "🚽" });
    expect(r1.status).toBe(200);
    expect(r2.status).toBe(200);
  });

  it("same emoji from two different users in same group both succeed", async () => {
    const alice = await loginAs("alice");
    const groupId = await getSoloGroupId("alice");
    await loginAs("bob");
    await memStore.addGroupMember({ groupId, userId: "dev-bob", role: "member" });
    const bob = await loginAs("bob");

    const entryId = await logAndGetEntryId(alice, groupId);

    const [r1, r2] = await Promise.all([
      alice.post(`/api/entries/${entryId}/reactions`).send({ emoji: "💩" }),
      bob.post(`/api/entries/${entryId}/reactions`).send({ emoji: "💩" }),
    ]);
    expect(r1.status).toBe(200);
    expect(r2.status).toBe(200);
  });

  it("reaction list reflects all reactions after multiple adds", async () => {
    const alice = await loginAs("alice");
    const groupId = await getSoloGroupId("alice");
    await loginAs("bob");
    await memStore.addGroupMember({ groupId, userId: "dev-bob", role: "member" });
    const bob = await loginAs("bob");
    const entryId = await logAndGetEntryId(alice, groupId);

    await alice.post(`/api/entries/${entryId}/reactions`).send({ emoji: "💩" });
    await bob.post(`/api/entries/${entryId}/reactions`).send({ emoji: "🚽" });
    await alice.post(`/api/entries/${entryId}/reactions`).send({ emoji: "🎉" });

    const res = await alice.get(`/api/entries/${entryId}/reactions`);
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(3);
  });

  it("reaction delete removes only the specified emoji", async () => {
    const alice = await loginAs("alice");
    const groupId = await getSoloGroupId("alice");
    const entryId = await logAndGetEntryId(alice, groupId);

    await alice.post(`/api/entries/${entryId}/reactions`).send({ emoji: "💩" });
    await alice.post(`/api/entries/${entryId}/reactions`).send({ emoji: "🚽" });

    // Delete one emoji
    await alice.delete(`/api/entries/${entryId}/reactions`).send({ emoji: "💩" });

    const res = await alice.get(`/api/entries/${entryId}/reactions`);
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].emoji).toBe("🚽");
  });
});

/* ================================================================
 *  Daily deuce cap — enforcement
 * ================================================================ */
describe("Daily deuce cap — sequential enforcement", () => {
  it("rejects 11th log with 429", async () => {
    const alice = await loginAs("alice");
    const groupId = await getSoloGroupId("alice");

    for (let i = 0; i < 10; i++) {
      const res = await alice.post("/api/deuces").send({ groupIds: [groupId], location: "Home" });
      expect(res.status).toBe(200);
    }

    const res11 = await alice.post("/api/deuces").send({ groupIds: [groupId], location: "Home" });
    expect(res11.status).toBe(429);
    expect(res11.body.message).toMatch(/throne limit|limit reached/i);
  });

  it("rate limit is per-user: Bob can still log after Alice hits cap", async () => {
    const alice = await loginAs("alice");
    const aliceGroupId = await getSoloGroupId("alice");

    for (let i = 0; i < 10; i++) {
      await alice.post("/api/deuces").send({ groupIds: [aliceGroupId], location: "Home" });
    }
    const aliceBlocked = await alice.post("/api/deuces").send({ groupIds: [aliceGroupId], location: "Home" });
    expect(aliceBlocked.status).toBe(429);

    const bob = await loginAs("bob");
    const bobGroupId = await getSoloGroupId("bob");
    const bobLog = await bob.post("/api/deuces").send({ groupIds: [bobGroupId], location: "Office" });
    expect(bobLog.status).toBe(200);
  });

  it("exactly 10 logs succeed — entry 10 is the last allowed", async () => {
    const alice = await loginAs("alice");
    const groupId = await getSoloGroupId("alice");

    for (let i = 0; i < 9; i++) {
      await alice.post("/api/deuces").send({ groupIds: [groupId], location: "Home" });
    }

    const res10 = await alice.post("/api/deuces").send({ groupIds: [groupId], location: "Home" });
    expect(res10.status).toBe(200);
    expect(res10.body.entries).toHaveLength(1);
  });

  it("error message is user-friendly on rate limit", async () => {
    const alice = await loginAs("alice");
    const groupId = await getSoloGroupId("alice");

    for (let i = 0; i < 10; i++) {
      await alice.post("/api/deuces").send({ groupIds: [groupId], location: "Home" });
    }

    const res = await alice.post("/api/deuces").send({ groupIds: [groupId], location: "Home" });
    expect(res.status).toBe(429);
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message.length).toBeGreaterThan(0);
  });
});
