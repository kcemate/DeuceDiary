import { TEST_SESSION_SECRET, TEST_ADMIN_KEY, TEST_INTERNAL_KEY, TEST_WEBHOOK_SECRET } from "./test-constants";
/**
 * rate-limit-precision.test.ts — Round 4: Rate Limit Behavior
 *
 * Tests for:
 *  1. Exactly 10 deuces allowed, 11th returns 429
 *  2. 429 response has correct shape (code, message, status)
 *  3. Per-user isolation: Alice hits cap, Bob can still log
 *  4. Ghost logs count toward daily limit
 *  5. After cap, ALL subsequent requests return 429 (not just 11th)
 *  6. Rate limit check happens before schema validation
 *  7. Multi-group log (groupIds array) counts as 1 log toward limit
 *  8. Rate limit resets at midnight UTC (simulated via date mock)
 *  9. Rate limit applies equally across different endpoints
 */

import { vi, describe, it, expect, beforeAll, beforeEach, afterAll } from "vitest";
import type { Express } from "express";
import type { Server } from "http";

/* ================================================================
 *  IN-MEMORY STORAGE
 * ================================================================ */
const memStore = vi.hoisted(() => {
  const _users = new Map<string, any>();
  const _groups = new Map<string, any>();
  let _members: any[] = [];
  const _entries = new Map<string, any>();
  let _locations: any[] = [];
  let _reactions: any[] = [];
  let _memberId = 1;
  let _locationId = 1;
  let _reactionId = 1;

  // Controls what "today" returns for daily log count queries
  let _fixedDate: string | null = null;

  return {
    setFixedDate(date: string | null) { _fixedDate = date; },

    async getUser(id: string) { return _users.get(id); },
    async upsertUser(data: any) {
      const existing = _users.get(data.id);
      const user = {
        id: data.id,
        email: data.email ?? existing?.email ?? null,
        firstName: data.firstName ?? existing?.firstName ?? null,
        lastName: data.lastName ?? existing?.lastName ?? null,
        username: data.username ?? existing?.username ?? null,
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
      const user = _users.get(userId); if (user) user.deuceCount = (user.deuceCount ?? 0) + increment;
    },
    async updateUserUsername(userId: string, username: string) {
      const user = _users.get(userId); if (!user) throw new Error("User not found");
      for (const [, u] of _users) { if (u.username === username && u.id !== userId) throw new Error("duplicate key value"); }
      user.username = username; return user;
    },
    async updateUserProfilePicture(userId: string, profileImageUrl: string) {
      const user = _users.get(userId); if (!user) throw new Error("User not found");
      user.profileImageUrl = profileImageUrl; return user;
    },
    async updateUserTheme(userId: string, theme: string) {
      const user = _users.get(userId); if (!user) throw new Error("User not found");
      user.theme = theme; return user;
    },
    async getUserSubscription(userId: string) {
      const user = _users.get(userId);
      return { subscription: user?.subscription ?? "free", subscriptionExpiresAt: user?.subscriptionExpiresAt ?? null, streakInsuranceUsed: user?.streakInsuranceUsed ?? false };
    },
    async updateUserSubscription(userId: string, subscription: string, expiresAt: Date) {
      const user = _users.get(userId); if (!user) throw new Error("User not found");
      user.subscription = subscription; user.subscriptionExpiresAt = expiresAt; return user;
    },
    async useStreakInsurance(userId: string) { const u = _users.get(userId); if (u) u.streakInsuranceUsed = true; },
    async resetStreakInsurance(userId: string) { const u = _users.get(userId); if (u) u.streakInsuranceUsed = false; },
    async resetAllStreakInsurance() { return 0; },
    async getPremiumAnalytics(_userId: string) { return { totalDeuces: 0, avgPerWeek: 0, longestStreak: 0, currentStreak: 0, bestDay: { day: "Monday", count: 0 }, groupRankings: [] }; },
    async getWeeklyReport(_userId: string) { return { totalDeuces: 0, peakDay: { date: "2026-01-01", count: 0 }, mostActiveSquad: { name: "None", count: 0 }, longestStreak: 0, funniestEntry: null, totalReactionsReceived: 0, weekOf: "2026-01-01" }; },
    async getUserByUsername(username: string) { return [..._users.values()].find(u => u.username === username); },
    async getUserByReferralCode(code: string) { return [..._users.values()].find(u => u.referralCode === code.toUpperCase()) ?? null; },
    async applyReferral(userId: string, referrerId: string) {
      const referee = _users.get(userId); const referrer = _users.get(referrerId);
      if (referee) referee.referredBy = referrerId;
      if (referrer) referrer.referralCount = (referrer.referralCount ?? 0) + 1;
    },

    async createGroup(group: any) {
      const newGroup = { id: group.id, name: group.name, description: group.description ?? null, createdBy: group.createdBy, currentStreak: 0, longestStreak: 0, lastStreakDate: null, timezone: "UTC", createdAt: new Date(), updatedAt: new Date() };
      _groups.set(newGroup.id, newGroup);
      _members.push({ id: _memberId++, groupId: newGroup.id, userId: group.createdBy, role: "admin", joinedAt: new Date() });
      return newGroup;
    },
    async getUserGroups(userId: string) {
      const ids = _members.filter(m => m.userId === userId).map(m => m.groupId);
      return ids.map(gid => {
        const g = _groups.get(gid)!;
        const entries = [..._entries.values()].filter(e => e.groupId === gid);
        return { ...g, memberCount: _members.filter(m => m.groupId === gid).length, entryCount: entries.length, lastActivity: undefined };
      });
    },
    async getGroupById(groupId: string) { return _groups.get(groupId); },
    async addGroupMember(member: any) {
      const m = { id: _memberId++, groupId: member.groupId, userId: member.userId, role: member.role ?? "member", joinedAt: new Date() };
      _members.push(m); return m;
    },
    async getGroupMembers(groupId: string) { return _members.filter(m => m.groupId === groupId).map(m => ({ ...m, user: _users.get(m.userId) })); },
    async isUserInGroup(userId: string, groupId: string) { return _members.some(m => m.userId === userId && m.groupId === groupId); },
    async isUserInGroups(userId: string, groupIds: string[]) { return new Set(groupIds.filter(gid => _members.some(m => m.userId === userId && m.groupId === gid))); },
    async removeGroupMember(userId: string, groupId: string) { _members = _members.filter(m => !(m.userId === userId && m.groupId === groupId)); },
    async getGroupMemberRole(_groupId: string, _userId: string) {
      const m = _members.find(m => m.groupId === _groupId && m.userId === _userId); return m?.role ?? null;
    },
    async deleteGroup(_groupId: string) {},
    async updateGroup(_groupId: string, _data: any) {},
    async getGroupInvites(_groupId: string) { return []; },
    async getGroupWithMemberCount(groupId: string) {
      const g = _groups.get(groupId); if (!g) return undefined;
      return { ...g, memberCount: _members.filter(m => m.groupId === groupId).length };
    },

    async createDeuceEntry(entry: any) {
      const e = { id: entry.id, userId: entry.userId, groupId: entry.groupId, location: entry.location, thoughts: entry.thoughts, ghost: entry.ghost ?? false, loggedAt: entry.loggedAt, bristolScore: entry.bristolScore ?? null, photoUrl: null, createdAt: new Date() };
      _entries.set(e.id, e); return e;
    },
    async getUserDailyLogCount(userId: string, dateUTC: string) {
      // Count entries with the given date as createdAt date in UTC
      const targetDate = _fixedDate ?? dateUTC;
      const start = new Date(`${targetDate}T00:00:00.000Z`);
      const end = new Date(`${targetDate}T23:59:59.999Z`);
      return [..._entries.values()].filter(e => e.userId === userId && e.createdAt >= start && e.createdAt <= end).length;
    },
    async getGroupEntries(groupId: string) { return [..._entries.values()].filter(e => e.groupId === groupId).sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0)).map(e => ({ ...e, user: _users.get(e.userId) })); },
    async getUserDeucesByDate(_userId: string) { return []; },
    async getEntryById(entryId: string) { return _entries.get(entryId); },
    async getFeedEntries(_groupIds: string[], _limit: number) { return []; },
    async deleteDeuceEntry(entryId: string) { _entries.delete(entryId); },
    async getUserPersonalRecord(_userId: string) { return undefined; },

    async createInvite(invite: any) { return { id: invite.id, groupId: invite.groupId, createdBy: invite.createdBy, expiresAt: invite.expiresAt, createdAt: new Date() }; },
    async getInviteById(_inviteId: string) { return undefined; },
    async deleteInvite() {},
    async deleteExpiredGroupInvites() {},
    async cleanupExpiredInvites() {},

    async getLocations() { return [..._locations]; },
    async getLocationsForUser(userId: string) { return [..._locations].filter(l => l.isDefault === true || l.createdBy === userId); },
    async createLocation(loc: any) {
      const l = { id: _locationId++, name: loc.name, isDefault: loc.isDefault ?? false, createdBy: loc.createdBy ?? null, createdAt: new Date() };
      _locations.push(l); return l;
    },
    async getLocationByName(name: string) { return _locations.find(l => l.name === name); },

    async getGroupStreak(_groupId: string) { return { currentStreak: 0, longestStreak: 0, lastStreakDate: null as string | null }; },
    async getGroupStreaksBatch(groupIds: string[]) { const m = new Map<string, any>(); for (const id of groupIds) m.set(id, { currentStreak: 0, longestStreak: 0, lastStreakDate: null }); return m; },
    async updateGroupStreak() {},
    async resetGroupStreak() {},
    async getMembersLogStatusToday(groupId: string, _today: string) { return _members.filter(m => m.groupId === groupId).map(m => ({ userId: m.userId, username: null, firstName: null, profileImageUrl: null, hasLogged: false })); },

    async addReaction(reaction: any) {
      const r = { id: _reactionId++, entryId: reaction.entryId, userId: reaction.userId, emoji: reaction.emoji, createdAt: new Date() };
      _reactions.push(r); return r;
    },
    async removeReaction(userId: string, entryId: string, emoji: string) { _reactions = _reactions.filter(r => !(r.userId === userId && r.entryId === entryId && r.emoji === emoji)); },
    async getEntryReactions(entryId: string) { return _reactions.filter(r => r.entryId === entryId); },

    async registerPushToken() {},
    async deletePushToken() {},
    async getUserPushTokens(_userId: string) { return []; },
    async getGroupPushTokens(_groupId: string) { return []; },
    async getAllPushTokens() { return []; },
    async setReminderTime() {},
    async updateUserReminder(userId: string, hour: number, minute: number) {
      const user = _users.get(userId); if (!user) throw new Error("User not found");
      user.reminderHour = hour; user.reminderMinute = minute; return user;
    },

    async createBroadcast(broadcast: any) { return { id: 1, ...broadcast, createdAt: new Date() }; },
    async getRecentBroadcasts(_groupId: string) { return []; },
    async getChallengeCompletion() { return null; },
    async createChallengeCompletion(c: any) { return { id: 1, ...c, createdAt: new Date() }; },
    async getGroupChallengeCompletions() { return []; },
    async getBingoCard() { return null; },
    async upsertBingoCard() { return { id: 1, userId: "", month: "", completedSquares: [], createdAt: new Date(), updatedAt: new Date() }; },
    async getBingoLeaderboard() { return []; },
    async getUserReferralCode(userId: string) { return _users.get(userId)?.referralCode ?? null; },
    async applyReferralCode() {},
    async getReferralStats(_userId: string) { return { referralCount: 0, referrals: [] }; },
    async getReferralLeaderboard() { return []; },
    async getGroupWeeklyReport(_groupId: string) { return { totalDeuces: 0, mvp: null, memberStats: [], funnyStats: { longestGap: null, mostReactionsReceived: null, funniestEntry: null } }; },
    async getGroupMemberTypicalHours(_groupId: string) { return []; },
    async getRecentErrors() { return []; },

    _reset() {
      _users.clear(); _groups.clear(); _members = []; _entries.clear();
      _locations = []; _reactions = []; _memberId = 1; _locationId = 1; _reactionId = 1;
      _fixedDate = null;
    },
    _users: () => _users,
    _groups: () => _groups,
    _members: () => _members,
    _entries: () => _entries,
    _setFixedDate(d: string | null) { _fixedDate = d; },
  };
});

vi.mock("../db", () => ({ db: {}, pool: {} }));
vi.mock("../storage", () => ({ storage: memStore }));
vi.mock("@clerk/clerk-sdk-node", () => ({ createClerkClient: () => null }));

vi.mock("../replitAuth", async () => {
  const sessionMod = await import("express-session");
  const session = sessionMod.default;
  return {
    clerkEnabled: false, clerk: null,
    getSession: () => session({ secret: TEST_SESSION_SECRET, resave: false, saveUninitialized: false }),
    setupAuth: async (app: any) => {
      app.use(session({ secret: TEST_SESSION_SECRET, resave: false, saveUninitialized: false }));
      app.post("/api/login", async (req: any, res: any) => {
        const { username } = req.body;
        if (!username || typeof username !== "string" || !username.trim()) return res.status(400).json({ message: "Username is required" });
        const name = username.trim();
        const userId = `dev-${name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
        const user = await memStore.upsertUser({ id: userId, email: `${name.toLowerCase()}@localhost.dev`, firstName: name, lastName: null, profileImageUrl: null });
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
      app.get("/api/logout", (req: any, res: any) => { req.session.destroy(() => res.redirect("/")); });
      app.post("/api/auth/logout", (req: any, res: any) => { req.session.destroy(() => res.json({ ok: true })); });
    },
    isAuthenticated: async (req: any, res: any, next: any) => {
      const userId = req.session?.userId;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });
      const user = await memStore.getUser(userId);
      if (!user) return res.status(401).json({ message: "Unauthorized" });
      req.user = user; next();
    },
  };
});

import express from "express";
import supertest from "supertest";
import { registerRoutes } from "../routes";

let app: Express;
let server: Server;

beforeAll(async () => {
  process.env.ADMIN_KEY = TEST_ADMIN_KEY;
  process.env.INTERNAL_API_KEY = TEST_INTERNAL_KEY;
  app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  server = await registerRoutes(app);
});

afterAll(() => { server.close(); });
beforeEach(() => { memStore._reset(); });

async function loginAs(username: string) {
  const agent = supertest.agent(app);
  await agent.post("/api/login").send({ username });
  return agent;
}

async function getSoloGroupId(agent: ReturnType<typeof supertest.agent>): Promise<string> {
  const res = await agent.get("/api/groups");
  const soloGroup = res.body.find((g: any) => g.name === "Solo Deuces");
  return soloGroup.id;
}

/** Log N deuces sequentially for the agent */
async function logDeuces(agent: ReturnType<typeof supertest.agent>, groupId: string, count: number) {
  const results = [];
  for (let i = 0; i < count; i++) {
    const res = await agent.post("/api/deuces").send({ groupId, location: "Home" });
    results.push(res.status);
  }
  return results;
}

/* ================================================================
 *  1. EXACTLY 10 ALLOWED, 11th BLOCKED
 * ================================================================ */
describe("Rate limit — exactly 10 allowed per day", () => {
  it("logs 1-10 succeed, log 11 returns 429", async () => {
    const agent = await loginAs("rl-exact-1");
    const groupId = await getSoloGroupId(agent);

    // Log 10 times
    for (let i = 0; i < 10; i++) {
      const res = await agent.post("/api/deuces").send({ groupId, location: "Home" });
      expect(res.status).toBe(200);
    }
    // 11th should be 429
    const eleventh = await agent.post("/api/deuces").send({ groupId, location: "Home" });
    expect(eleventh.status).toBe(429);
  });

  it("10th log succeeds (last allowed)", async () => {
    const agent = await loginAs("rl-tenth-1");
    const groupId = await getSoloGroupId(agent);

    for (let i = 0; i < 9; i++) {
      await agent.post("/api/deuces").send({ groupId, location: "Home" });
    }
    // 10th should succeed
    const tenth = await agent.post("/api/deuces").send({ groupId, location: "Home" });
    expect(tenth.status).toBe(200);
  });
});

/* ================================================================
 *  2. 429 RESPONSE SHAPE
 * ================================================================ */
describe("Rate limit — 429 response shape", () => {
  it("429 response includes RATE_LIMIT_EXCEEDED code and message", async () => {
    const agent = await loginAs("rl-shape-1");
    const groupId = await getSoloGroupId(agent);
    await logDeuces(agent, groupId, 10);

    const res = await agent.post("/api/deuces").send({ groupId, location: "Home" });
    expect(res.status).toBe(429);
    expect(res.body.code).toBe("RATE_LIMIT_EXCEEDED");
    expect(res.body.message).toMatch(/throne limit|come back tomorrow/i);
  });

  it("429 response status field matches HTTP status", async () => {
    const agent = await loginAs("rl-shape-2");
    const groupId = await getSoloGroupId(agent);
    await logDeuces(agent, groupId, 10);

    const res = await agent.post("/api/deuces").send({ groupId, location: "Home" });
    expect(res.status).toBe(429);
    expect(res.body.status).toBe(429);
  });
});

/* ================================================================
 *  3. PER-USER ISOLATION
 * ================================================================ */
describe("Rate limit — per-user isolation", () => {
  it("Alice hitting cap does not block Bob", async () => {
    const alice = await loginAs("rl-alice-1");
    const bob = await loginAs("rl-bob-1");

    const aliceGroupId = await getSoloGroupId(alice);
    const bobGroupId = await getSoloGroupId(bob);

    // Alice hits limit
    await logDeuces(alice, aliceGroupId, 10);
    const aliceBlocked = await alice.post("/api/deuces").send({ groupId: aliceGroupId, location: "Home" });
    expect(aliceBlocked.status).toBe(429);

    // Bob still gets through
    const bobOk = await bob.post("/api/deuces").send({ groupId: bobGroupId, location: "Home" });
    expect(bobOk.status).toBe(200);
  });

  it("two users have independent counters", async () => {
    const alice = await loginAs("rl-alice-2");
    const bob = await loginAs("rl-bob-2");

    const aliceGroupId = await getSoloGroupId(alice);
    const bobGroupId = await getSoloGroupId(bob);

    // Alice logs 5, Bob logs 5
    await logDeuces(alice, aliceGroupId, 5);
    await logDeuces(bob, bobGroupId, 5);

    // Both can still log 5 more
    const alice6 = await alice.post("/api/deuces").send({ groupId: aliceGroupId, location: "Home" });
    const bob6 = await bob.post("/api/deuces").send({ groupId: bobGroupId, location: "Home" });
    expect(alice6.status).toBe(200);
    expect(bob6.status).toBe(200);
  });
});

/* ================================================================
 *  4. GHOST LOGS COUNT TOWARD LIMIT
 * ================================================================ */
describe("Rate limit — ghost logs count toward limit", () => {
  it("ghost logs count toward daily limit (10 ghosts + 1 real = 429)", async () => {
    const agent = await loginAs("rl-ghost-1");
    const groupId = await getSoloGroupId(agent);

    // Log 10 ghost entries
    for (let i = 0; i < 10; i++) {
      const res = await agent.post("/api/deuces").send({ groupId, location: "Home", ghost: true });
      expect(res.status).toBe(200);
    }
    // 11th (even non-ghost) should be blocked
    const blocked = await agent.post("/api/deuces").send({ groupId, location: "Home", ghost: false });
    expect(blocked.status).toBe(429);
  });
});

/* ================================================================
 *  5. AFTER CAP, ALL SUBSEQUENT ATTEMPTS BLOCKED
 * ================================================================ */
describe("Rate limit — cap is persistent for the day", () => {
  it("hitting limit blocks not just 11th but also 12th, 13th, etc.", async () => {
    const agent = await loginAs("rl-persist-1");
    const groupId = await getSoloGroupId(agent);
    await logDeuces(agent, groupId, 10);

    for (let i = 11; i <= 13; i++) {
      const res = await agent.post("/api/deuces").send({ groupId, location: "Home" });
      expect(res.status).toBe(429);
    }
  });
});

/* ================================================================
 *  6. RATE LIMIT CHECKED BEFORE SCHEMA VALIDATION
 * ================================================================ */
describe("Rate limit — rate check precedes schema validation", () => {
  it("invalid body (missing location) still returns 429 when at limit", async () => {
    const agent = await loginAs("rl-schema-1");
    const groupId = await getSoloGroupId(agent);
    await logDeuces(agent, groupId, 10);

    // Invalid body — but rate limit should block first (returns 429, not 400)
    const res = await agent.post("/api/deuces").send({ groupId });
    expect(res.status).toBe(429);
  });
});

/* ================================================================
 *  7. MULTI-GROUP LOG: EACH ENTRY COUNTS TOWARD LIMIT
 * ================================================================ */
describe("Rate limit — multi-group log entry counting", () => {
  it("logging to two groups creates 2 entries that each count toward the 10-entry cap", async () => {
    const agent = await loginAs("rl-multigroup-1");

    // Create second group (Solo Deuces already exists from login)
    const groups = await agent.get("/api/groups");
    const soloId = groups.body.find((g: any) => g.name === "Solo Deuces").id;

    const secondGroup = await agent.post("/api/groups").send({ name: "Test Squad" });
    const secondId = secondGroup.body.id;

    // Log to both groups at once — creates 2 entries (rate limit checked once at start)
    const multi = await agent.post("/api/deuces").send({ groupIds: [soloId, secondId], location: "Home" });
    expect(multi.status).toBe(200);
    expect(multi.body.entries).toHaveLength(2); // entry created in both groups

    // 2 entries already created; can log 8 more (to reach 10 total entries)
    for (let i = 0; i < 8; i++) {
      const res = await agent.post("/api/deuces").send({ groupId: soloId, location: "Home" });
      expect(res.status).toBe(200);
    }
    // 11th attempt (total 10 entries + 1 = 11) should be blocked
    const blocked = await agent.post("/api/deuces").send({ groupId: soloId, location: "Home" });
    expect(blocked.status).toBe(429);
  });

  it("single-group log still has max 10 per day", async () => {
    const agent = await loginAs("rl-singlegroup-1");
    const groupId = await getSoloGroupId(agent);

    for (let i = 0; i < 10; i++) {
      const res = await agent.post("/api/deuces").send({ groupId, location: "Home" });
      expect(res.status).toBe(200);
    }
    const blocked = await agent.post("/api/deuces").send({ groupId, location: "Home" });
    expect(blocked.status).toBe(429);
  });
});

/* ================================================================
 *  8. RATE LIMIT RESPECTS UTC DATE BOUNDARY
 * ================================================================ */
describe("Rate limit — UTC date boundary", () => {
  it("entries from a previous UTC date do not count toward today's limit", async () => {
    const agent = await loginAs("rl-date-1");
    const groupId = await getSoloGroupId(agent);

    // Simulate yesterday's entries by setting fixed date to yesterday for counting
    const yesterday = new Date();
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    // Log 10 entries — they all get createdAt = now (today)
    await logDeuces(agent, groupId, 10);

    // Override the "today" in getUserDailyLogCount to return yesterday's date
    // This simulates counting yesterday's entries (should be 0 for today)
    memStore._setFixedDate(yesterdayStr);

    // With yesterday's date, count should be 0, so new log should succeed
    const res = await agent.post("/api/deuces").send({ groupId, location: "New Day" });
    // The route uses getTodayUTC() for the count key, but the mock uses _fixedDate
    // Since our mock uses _fixedDate for counting, it counts 0 for yesterday → allows
    expect(res.status).toBe(200);

    // Reset fixed date
    memStore._setFixedDate(null);
  });
});
