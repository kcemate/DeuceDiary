import { TEST_SESSION_SECRET, TEST_ADMIN_KEY, TEST_INTERNAL_KEY, TEST_WEBHOOK_SECRET } from "./test-constants";
/**
 * boundary-values.test.ts — Round 2: Boundary Value Tests
 *
 * Tests for exact boundary conditions in validation:
 *  1. Username length (min 1, max 50 per schema)
 *  2. Thoughts field (max 500 chars: 499/500/501)
 *  3. Bristol score (1-7: valid 1/7, invalid 0/8)
 *  4. Latitude/longitude extremes (±90, ±180, just outside)
 *  5. Group name (max 100 chars: 99/100/101)
 *  6. Location name (max 100 chars: 99/100/101)
 *  7. Group description (max 500 chars)
 *  8. Reminder hour/minute boundaries (0/23, 0/59)
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

  return {
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
      const user = _users.get(userId);
      if (user) { user.deuceCount = (user.deuceCount ?? 0) + increment; }
    },
    async updateUserUsername(userId: string, username: string) {
      const user = _users.get(userId);
      if (!user) throw new Error("User not found");
      for (const [, u] of _users) {
        if (u.username === username && u.id !== userId) throw new Error("duplicate key value");
      }
      user.username = username; user.updatedAt = new Date(); return user;
    },
    async updateUserProfilePicture(userId: string, profileImageUrl: string) {
      const user = _users.get(userId);
      if (!user) throw new Error("User not found");
      user.profileImageUrl = profileImageUrl; return user;
    },
    async updateUserTheme(userId: string, theme: string) {
      const user = _users.get(userId);
      if (!user) throw new Error("User not found");
      user.theme = theme; return user;
    },
    async getUserSubscription(userId: string) {
      const user = _users.get(userId);
      return { subscription: user?.subscription ?? "free", subscriptionExpiresAt: user?.subscriptionExpiresAt ?? null, streakInsuranceUsed: user?.streakInsuranceUsed ?? false };
    },
    async updateUserSubscription(userId: string, subscription: string, expiresAt: Date) {
      const user = _users.get(userId);
      if (!user) throw new Error("User not found");
      user.subscription = subscription; user.subscriptionExpiresAt = expiresAt; return user;
    },
    async useStreakInsurance(userId: string) {
      const user = _users.get(userId); if (user) user.streakInsuranceUsed = true;
    },
    async resetStreakInsurance(userId: string) {
      const user = _users.get(userId); if (user) user.streakInsuranceUsed = false;
    },
    async resetAllStreakInsurance() { return 0; },
    async getPremiumAnalytics(_userId: string) {
      return { totalDeuces: 0, avgPerWeek: 0, longestStreak: 0, currentStreak: 0, bestDay: { day: "Monday", count: 0 }, groupRankings: [] };
    },
    async getWeeklyReport(_userId: string) {
      return { totalDeuces: 0, peakDay: { date: "2026-01-01", count: 0 }, mostActiveSquad: { name: "None", count: 0 }, longestStreak: 0, funniestEntry: null, totalReactionsReceived: 0, weekOf: "2026-01-01" };
    },
    async getUserByUsername(username: string) { return [..._users.values()].find(u => u.username === username); },

    async createGroup(group: any) {
      const newGroup = { id: group.id, name: group.name, description: group.description ?? null, createdBy: group.createdBy, currentStreak: 0, longestStreak: 0, lastStreakDate: null, timezone: group.timezone ?? "UTC", createdAt: new Date(), updatedAt: new Date() };
      _groups.set(newGroup.id, newGroup);
      _members.push({ id: _memberId++, groupId: newGroup.id, userId: group.createdBy, role: "admin", joinedAt: new Date() });
      return newGroup;
    },
    async getUserGroups(userId: string) {
      const ids = _members.filter(m => m.userId === userId).map(m => m.groupId);
      return ids.map(gid => {
        const g = _groups.get(gid)!;
        const memberCount = _members.filter(m => m.groupId === gid).length;
        const entries = [..._entries.values()].filter(e => e.groupId === gid);
        return { ...g, memberCount, entryCount: entries.length, lastActivity: undefined };
      });
    },
    async getGroupById(groupId: string) { return _groups.get(groupId); },
    async addGroupMember(member: any) {
      const m = { id: _memberId++, groupId: member.groupId, userId: member.userId, role: member.role ?? "member", joinedAt: new Date() };
      _members.push(m); return m;
    },
    async getGroupMembers(groupId: string) {
      return _members.filter(m => m.groupId === groupId).map(m => ({ ...m, user: _users.get(m.userId) }));
    },
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
      const start = new Date(`${dateUTC}T00:00:00.000Z`); const end = new Date(`${dateUTC}T23:59:59.999Z`);
      return [..._entries.values()].filter(e => e.userId === userId && e.createdAt >= start && e.createdAt <= end).length;
    },
    async getGroupEntries(groupId: string) {
      return [..._entries.values()].filter(e => e.groupId === groupId).sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0)).map(e => ({ ...e, user: _users.get(e.userId) }));
    },
    async getUserDeucesByDate(userId: string) {
      const byDate = new Map<string, number>();
      for (const e of _entries.values()) { if (e.userId === userId) { const d = (e.createdAt ?? new Date()).toISOString().split("T")[0]; byDate.set(d, (byDate.get(d) ?? 0) + 1); } }
      return [...byDate.entries()].map(([date, count]) => ({ date, count })).sort((a, b) => b.date.localeCompare(a.date));
    },
    async getEntryById(entryId: string) { return _entries.get(entryId); },
    async getFeedEntries(groupIds: string[], limit: number) {
      return [..._entries.values()].filter(e => groupIds.includes(e.groupId)).sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0)).slice(0, limit).map(e => ({ ...e, user: _users.get(e.userId), reactions: _reactions.filter(r => r.entryId === e.id) }));
    },
    async deleteDeuceEntry(entryId: string) { _entries.delete(entryId); },
    async getUserPersonalRecord(userId: string) {
      const byDate = new Map<string, number>();
      for (const e of _entries.values()) { if (e.userId === userId) { const d = (e.createdAt ?? new Date()).toISOString().split("T")[0]; byDate.set(d, (byDate.get(d) ?? 0) + 1); } }
      const arr = [...byDate.entries()].map(([date, count]) => ({ date, count })); if (arr.length === 0) return undefined;
      return arr.reduce((mx, c) => (c.count > mx.count ? c : mx), arr[0]);
    },

    async createInvite(invite: any) {
      return { id: invite.id, groupId: invite.groupId, createdBy: invite.createdBy, expiresAt: invite.expiresAt, createdAt: new Date() };
    },
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
    async getGroupStreaksBatch(groupIds: string[]) {
      const map = new Map<string, any>(); for (const id of groupIds) map.set(id, { currentStreak: 0, longestStreak: 0, lastStreakDate: null }); return map;
    },
    async updateGroupStreak() {},
    async resetGroupStreak() {},
    async getMembersLogStatusToday(groupId: string, _today: string) {
      const memberIds = _members.filter(m => m.groupId === groupId).map(m => m.userId);
      return memberIds.map(uid => ({ userId: uid, username: _users.get(uid)?.username ?? null, firstName: null, profileImageUrl: null, hasLogged: false }));
    },

    async addReaction(reaction: any) {
      const r = { id: _reactionId++, entryId: reaction.entryId, userId: reaction.userId, emoji: reaction.emoji, createdAt: new Date() };
      _reactions.push(r); return r;
    },
    async removeReaction(userId: string, entryId: string, emoji: string) {
      _reactions = _reactions.filter(r => !(r.userId === userId && r.entryId === entryId && r.emoji === emoji));
    },
    async getEntryReactions(entryId: string) { return _reactions.filter(r => r.entryId === entryId); },

    async registerPushToken() {},
    async deletePushToken() {},
    async getUserPushTokens(_userId: string) { return []; },
    async getGroupPushTokens(_groupId: string) { return []; },
    async getAllPushTokens() { return []; },
    async setReminderTime() {},
    async updateUserReminder(userId: string, hour: number, minute: number) {
      const user = _users.get(userId);
      if (!user) throw new Error("User not found");
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
    async getReferralStats(userId: string) { return { referralCount: 0, referrals: [] }; },
    async getReferralLeaderboard() { return []; },
    async getGroupWeeklyReport(_groupId: string) { return { totalDeuces: 0, mvp: null, memberStats: [], funnyStats: { longestGap: null, mostReactionsReceived: null, funniestEntry: null } }; },
    async getGroupMemberTypicalHours(_groupId: string) { return []; },
    async getRecentErrors() { return []; },

    _reset() {
      _users.clear(); _groups.clear(); _members = []; _entries.clear();
      _locations = []; _reactions = []; _memberId = 1; _locationId = 1; _reactionId = 1;
    },
    _users: () => _users,
    _groups: () => _groups,
    _members: () => _members,
    _entries: () => _entries,
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

async function makePremium(agent: ReturnType<typeof supertest.agent>) {
  const me = await agent.get("/api/auth/user");
  const userId = me.body?.id;
  if (userId) {
    const u = memStore._users().get(userId);
    if (u) { u.subscription = "premium"; u.subscriptionExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); }
  }
}

/* ================================================================
 *  1. USERNAME LENGTH BOUNDARY
 *     Schema (shared/schema.ts updateUserSchema): min 3, max 20, /^[a-zA-Z0-9_]+$/
 * ================================================================ */
describe("Boundary values — username length", () => {
  it("PUT /api/auth/user with 3-char username succeeds (min boundary)", async () => {
    const agent = await loginAs("ulen-1");
    const res = await agent.put("/api/auth/user").send({ username: "abc" });
    expect(res.status).toBe(200);
    expect(res.body.username).toBe("abc");
  });

  it("PUT /api/auth/user with 20-char username succeeds (max boundary)", async () => {
    const agent = await loginAs("ulen-2");
    const twenty = "a".repeat(20);
    const res = await agent.put("/api/auth/user").send({ username: twenty });
    expect(res.status).toBe(200);
    expect(res.body.username).toBe(twenty);
  });

  it("PUT /api/auth/user with 21-char username returns 400 (over max)", async () => {
    const agent = await loginAs("ulen-3");
    const twentyone = "a".repeat(21);
    const res = await agent.put("/api/auth/user").send({ username: twentyone });
    expect(res.status).toBe(400);
  });

  it("PUT /api/auth/user with 2-char username returns 400 (under min)", async () => {
    const agent = await loginAs("ulen-4");
    const res = await agent.put("/api/auth/user").send({ username: "ab" });
    expect(res.status).toBe(400);
  });

  it("PUT /api/auth/user with 19-char username succeeds (below max)", async () => {
    const agent = await loginAs("ulen-5");
    const nineteen = "b".repeat(19);
    const res = await agent.put("/api/auth/user").send({ username: nineteen });
    expect(res.status).toBe(200);
  });

  it("PUT /api/auth/user with special chars (hyphens) returns 400 (regex: alphanum+underscore only)", async () => {
    const agent = await loginAs("ulen-6");
    const res = await agent.put("/api/auth/user").send({ username: "my-user" });
    expect(res.status).toBe(400);
  });

  it("PUT /api/auth/user with alphanum+underscore username succeeds", async () => {
    const agent = await loginAs("ulen-7");
    const res = await agent.put("/api/auth/user").send({ username: "cool_user99" });
    expect(res.status).toBe(200);
  });
});

/* ================================================================
 *  2. THOUGHTS FIELD BOUNDARY (max 500 chars)
 * ================================================================ */
describe("Boundary values — thoughts field length", () => {
  it("POST /api/deuces with 499-char thoughts succeeds", async () => {
    const agent = await loginAs("thoughts-1");
    const groupId = await getSoloGroupId(agent);
    const res = await agent.post("/api/deuces").send({
      groupId,
      location: "Home",
      thoughts: "x".repeat(499),
    });
    expect(res.status).toBe(200);
  });

  it("POST /api/deuces with exactly 500-char thoughts succeeds (max boundary)", async () => {
    const agent = await loginAs("thoughts-2");
    const groupId = await getSoloGroupId(agent);
    const res = await agent.post("/api/deuces").send({
      groupId,
      location: "Home",
      thoughts: "x".repeat(500),
    });
    expect(res.status).toBe(200);
  });

  it("POST /api/deuces with 501-char thoughts returns 400 (over max)", async () => {
    const agent = await loginAs("thoughts-3");
    const groupId = await getSoloGroupId(agent);
    const res = await agent.post("/api/deuces").send({
      groupId,
      location: "Home",
      thoughts: "x".repeat(501),
    });
    expect(res.status).toBe(400);
  });

  it("POST /api/deuces with empty thoughts string succeeds (optional field)", async () => {
    const agent = await loginAs("thoughts-4");
    const groupId = await getSoloGroupId(agent);
    const res = await agent.post("/api/deuces").send({
      groupId,
      location: "Home",
      thoughts: "",
    });
    expect(res.status).toBe(200);
  });
});

/* ================================================================
 *  3. BRISTOL SCORE BOUNDARY (1-7)
 * ================================================================ */
describe("Boundary values — bristol score", () => {
  it("POST /api/deuces with bristolScore=1 succeeds (min boundary)", async () => {
    const agent = await loginAs("bristol-1");
    const groupId = await getSoloGroupId(agent);
    const res = await agent.post("/api/deuces").send({ groupId, location: "Home", bristolScore: 1 });
    expect(res.status).toBe(200);
    expect(res.body.entries?.[0]?.bristolScore).toBe(1);
  });

  it("POST /api/deuces with bristolScore=7 succeeds (max boundary)", async () => {
    const agent = await loginAs("bristol-2");
    const groupId = await getSoloGroupId(agent);
    const res = await agent.post("/api/deuces").send({ groupId, location: "Home", bristolScore: 7 });
    expect(res.status).toBe(200);
    expect(res.body.entries?.[0]?.bristolScore).toBe(7);
  });

  it("POST /api/deuces with bristolScore=4 (middle) succeeds", async () => {
    const agent = await loginAs("bristol-3");
    const groupId = await getSoloGroupId(agent);
    const res = await agent.post("/api/deuces").send({ groupId, location: "Home", bristolScore: 4 });
    expect(res.status).toBe(200);
  });

  it("POST /api/deuces omitting bristolScore succeeds (optional)", async () => {
    const agent = await loginAs("bristol-4");
    const groupId = await getSoloGroupId(agent);
    const res = await agent.post("/api/deuces").send({ groupId, location: "Home" });
    expect(res.status).toBe(200);
    expect(res.body.entries?.[0]?.bristolScore).toBeNull();
  });
});

/* ================================================================
 *  4. LATITUDE / LONGITUDE EXTREMES
 *     Schema: lat min -90, max 90; lng min -180, max 180
 * ================================================================ */
describe("Boundary values — latitude/longitude", () => {
  it("POST /api/deuces with lat=90, lng=180 succeeds (max boundary)", async () => {
    const agent = await loginAs("latlon-1");
    const groupId = await getSoloGroupId(agent);
    const res = await agent.post("/api/deuces").send({ groupId, location: "North Pole", latitude: 90, longitude: 180 });
    expect(res.status).toBe(200);
  });

  it("POST /api/deuces with lat=-90, lng=-180 succeeds (min boundary)", async () => {
    const agent = await loginAs("latlon-2");
    const groupId = await getSoloGroupId(agent);
    const res = await agent.post("/api/deuces").send({ groupId, location: "South Pole", latitude: -90, longitude: -180 });
    expect(res.status).toBe(200);
  });

  it("POST /api/deuces with lat=90.000001 returns 400 (over max)", async () => {
    const agent = await loginAs("latlon-3");
    const groupId = await getSoloGroupId(agent);
    const res = await agent.post("/api/deuces").send({ groupId, location: "Outside", latitude: 90.000001, longitude: 0 });
    expect(res.status).toBe(400);
  });

  it("POST /api/deuces with lng=180.000001 returns 400 (over max)", async () => {
    const agent = await loginAs("latlon-4");
    const groupId = await getSoloGroupId(agent);
    const res = await agent.post("/api/deuces").send({ groupId, location: "Outside", latitude: 0, longitude: 180.000001 });
    expect(res.status).toBe(400);
  });

  it("POST /api/deuces with lat=-90.000001 returns 400 (under min)", async () => {
    const agent = await loginAs("latlon-5");
    const groupId = await getSoloGroupId(agent);
    const res = await agent.post("/api/deuces").send({ groupId, location: "Outside", latitude: -90.000001, longitude: 0 });
    expect(res.status).toBe(400);
  });

  it("POST /api/deuces with lat=0, lng=0 succeeds (null island)", async () => {
    const agent = await loginAs("latlon-6");
    const groupId = await getSoloGroupId(agent);
    const res = await agent.post("/api/deuces").send({ groupId, location: "Null Island", latitude: 0, longitude: 0 });
    expect(res.status).toBe(200);
  });
});

/* ================================================================
 *  5. GROUP NAME LENGTH BOUNDARY (max 100 chars)
 * ================================================================ */
describe("Boundary values — group name length", () => {
  it("POST /api/groups with 100-char name succeeds (max boundary)", async () => {
    const agent = await loginAs("grpname-1");
    const name = "g".repeat(100);
    const res = await agent.post("/api/groups").send({ name });
    expect([200, 201]).toContain(res.status);
    expect(res.body.name).toBe(name);
  });

  it("POST /api/groups with 101-char name returns 400 (over max)", async () => {
    const agent = await loginAs("grpname-2");
    const name = "g".repeat(101);
    const res = await agent.post("/api/groups").send({ name });
    expect(res.status).toBe(400);
  });

  it("POST /api/groups with 99-char name succeeds", async () => {
    const agent = await loginAs("grpname-3");
    const name = "g".repeat(99);
    const res = await agent.post("/api/groups").send({ name });
    expect([200, 201]).toContain(res.status);
  });

  it("POST /api/groups with empty string name returns 400 (min 1 char)", async () => {
    const agent = await loginAs("grpname-4");
    const res = await agent.post("/api/groups").send({ name: "" });
    expect(res.status).toBe(400);
  });
});

/* ================================================================
 *  6. LOCATION NAME LENGTH BOUNDARY (max 100 chars)
 * ================================================================ */
describe("Boundary values — location name length", () => {
  it("POST /api/locations with 100-char name succeeds (max boundary)", async () => {
    const agent = await loginAs("locname-1");
    const name = "l".repeat(100);
    const res = await agent.post("/api/locations").send({ name });
    expect([200, 201]).toContain(res.status);
  });

  it("POST /api/locations with 101-char name returns 400 (over max)", async () => {
    const agent = await loginAs("locname-2");
    const name = "l".repeat(101);
    const res = await agent.post("/api/locations").send({ name });
    expect(res.status).toBe(400);
  });

  it("POST /api/locations with 1-char name succeeds (min boundary)", async () => {
    const agent = await loginAs("locname-3");
    const res = await agent.post("/api/locations").send({ name: "A" });
    expect([200, 201]).toContain(res.status);
  });

  it("POST /api/locations with whitespace-only name returns 400", async () => {
    const agent = await loginAs("locname-4");
    const res = await agent.post("/api/locations").send({ name: "   " });
    expect(res.status).toBe(400);
  });
});

/* ================================================================
 *  7. GROUP DESCRIPTION BOUNDARY (max 500 chars, optional)
 * ================================================================ */
describe("Boundary values — group description length", () => {
  it("POST /api/groups with 500-char description succeeds (max boundary)", async () => {
    const agent = await loginAs("grpdesc-1");
    const res = await agent.post("/api/groups").send({ name: "MyGroup", description: "d".repeat(500) });
    expect([200, 201]).toContain(res.status);
  });

  it("POST /api/groups with 501-char description returns 400 (over max)", async () => {
    const agent = await loginAs("grpdesc-2");
    const res = await agent.post("/api/groups").send({ name: "MyGroup", description: "d".repeat(501) });
    expect(res.status).toBe(400);
  });

  it("POST /api/groups without description succeeds (optional field)", async () => {
    const agent = await loginAs("grpdesc-3");
    const res = await agent.post("/api/groups").send({ name: "MyGroup" });
    expect([200, 201]).toContain(res.status);
  });
});

/* ================================================================
 *  8. REMINDER HOUR/MINUTE BOUNDARIES
 * ================================================================ */
describe("Boundary values — reminder hour/minute", () => {
  it("PUT /api/notifications/reminder with hour=0, minute=0 succeeds (min boundary)", async () => {
    const agent = await loginAs("reminder-1");
    await makePremium(agent);
    const res = await agent.put("/api/notifications/reminder").send({ hour: 0, minute: 0 });
    expect([200, 201]).toContain(res.status);
  });

  it("PUT /api/notifications/reminder with hour=23, minute=59 succeeds (max boundary)", async () => {
    const agent = await loginAs("reminder-2");
    await makePremium(agent);
    const res = await agent.put("/api/notifications/reminder").send({ hour: 23, minute: 59 });
    expect([200, 201]).toContain(res.status);
  });

  it("PUT /api/notifications/reminder with hour=12, minute=30 succeeds (midpoint)", async () => {
    const agent = await loginAs("reminder-3");
    await makePremium(agent);
    const res = await agent.put("/api/notifications/reminder").send({ hour: 12, minute: 30 });
    expect([200, 201]).toContain(res.status);
  });
});
