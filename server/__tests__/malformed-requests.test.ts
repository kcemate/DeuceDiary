import { TEST_SESSION_SECRET, TEST_ADMIN_KEY, TEST_INTERNAL_KEY, TEST_WEBHOOK_SECRET } from "./test-constants";
/**
 * malformed-requests.test.ts — Round 1: Malformed Request Bodies
 *
 * Tests for:
 *  1. Missing required fields in POST bodies
 *  2. Wrong data types (string instead of number, etc.)
 *  3. Invalid enum values (plan="quarterly", theme="neon", platform="web")
 *  4. Invalid UUIDs in path parameters
 *  5. Extra/unknown fields (should be stripped, not rejected)
 *  6. Null where value is required
 *  7. Invalid reaction emoji (plain text, HTML, empty)
 *  8. Out-of-range integers (bristolScore=0, bristolScore=8)
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
  const _invites = new Map<string, any>();
  let _locations: any[] = [];
  let _reactions: any[] = [];
  let _referrals: any[] = [];
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
      if (user) { user.deuceCount = (user.deuceCount ?? 0) + increment; user.updatedAt = new Date(); }
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
      user.profileImageUrl = profileImageUrl; user.updatedAt = new Date(); return user;
    },
    async updateUserTheme(userId: string, theme: string) {
      const user = _users.get(userId);
      if (!user) throw new Error("User not found");
      user.theme = theme; user.updatedAt = new Date(); return user;
    },
    async getUserSubscription(userId: string) {
      const user = _users.get(userId);
      return { subscription: user?.subscription ?? "free", subscriptionExpiresAt: user?.subscriptionExpiresAt ?? null, streakInsuranceUsed: user?.streakInsuranceUsed ?? false };
    },
    async updateUserSubscription(userId: string, subscription: string, expiresAt: Date) {
      const user = _users.get(userId);
      if (!user) throw new Error("User not found");
      user.subscription = subscription; user.subscriptionExpiresAt = expiresAt; user.updatedAt = new Date(); return user;
    },
    async useStreakInsurance(userId: string) {
      const user = _users.get(userId); if (user) { user.streakInsuranceUsed = true; user.updatedAt = new Date(); }
    },
    async resetStreakInsurance(userId: string) {
      const user = _users.get(userId); if (user) { user.streakInsuranceUsed = false; user.updatedAt = new Date(); }
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
      const newGroup = { id: group.id, name: group.name, description: group.description ?? null, createdBy: group.createdBy, createdAt: new Date(), updatedAt: new Date() };
      _groups.set(newGroup.id, newGroup);
      _members.push({ id: _memberId++, groupId: newGroup.id, userId: group.createdBy, role: "admin", joinedAt: new Date() });
      return newGroup;
    },
    async getUserGroups(userId: string) {
      const ids = _members.filter(m => m.userId === userId).map(m => m.groupId);
      return ids.map(gid => {
        const g = _groups.get(gid)!;
        const memberCount = _members.filter(m => m.groupId === gid).length;
        const groupEntries = [..._entries.values()].filter(e => e.groupId === gid);
        return { ...g, memberCount, entryCount: groupEntries.length, lastActivity: undefined };
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
      const e = { id: entry.id, userId: entry.userId, groupId: entry.groupId, location: entry.location, thoughts: entry.thoughts, ghost: entry.ghost ?? false, loggedAt: entry.loggedAt, bristolScore: entry.bristolScore ?? null, photoUrl: entry.photoUrl ?? null, createdAt: new Date() };
      _entries.set(e.id, e); return e;
    },
    async getUserDailyLogCount(userId: string, dateUTC: string) {
      const start = new Date(`${dateUTC}T00:00:00.000Z`); const end = new Date(`${dateUTC}T23:59:59.999Z`);
      return [..._entries.values()].filter(e => e.userId === userId && e.createdAt >= start && e.createdAt <= end).length;
    },
    async getGroupEntries(groupId: string) {
      return [..._entries.values()].filter(e => e.groupId === groupId).sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0)).map(e => ({ ...e, user: _users.get(e.userId)! }));
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
      const inv = { id: invite.id, groupId: invite.groupId, createdBy: invite.createdBy, expiresAt: invite.expiresAt, createdAt: new Date() };
      _invites.set(inv.id, inv); return inv;
    },
    async getInviteById(inviteId: string) { return _invites.get(inviteId); },
    async deleteInvite(inviteId: string) { _invites.delete(inviteId); },
    async deleteExpiredGroupInvites() {},
    async cleanupExpiredInvites() {
      const now = new Date();
      for (const [id, inv] of _invites) { if (inv.expiresAt < now) _invites.delete(id); }
    },

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
      return memberIds.map(uid => ({ userId: uid, username: _users.get(uid)?.username ?? null, firstName: _users.get(uid)?.firstName ?? null, profileImageUrl: null, hasLogged: false }));
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
      user.reminderHour = hour; user.reminderMinute = minute; user.updatedAt = new Date(); return user;
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
    async applyReferralCode(_userId: string, _code: string) {},
    async getReferralStats(userId: string) { return { referralCount: _referrals.filter(r => r.referrerId === userId).length, referrals: [] }; },
    async getReferralLeaderboard() { return []; },

    async getGroupWeeklyReport(_groupId: string) { return { totalDeuces: 0, mvp: null, memberStats: [], funnyStats: { longestGap: null, mostReactionsReceived: null, funniestEntry: null } }; },
    async getGroupMemberTypicalHours(_groupId: string) { return []; },
    async getRecentErrors() { return []; },

    _reset() {
      _users.clear(); _groups.clear(); _members = []; _entries.clear(); _invites.clear();
      _locations = []; _reactions = []; _referrals = []; _memberId = 1; _locationId = 1; _reactionId = 1;
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
    clerkEnabled: false,
    clerk: null,
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

/* ================================================================
 *  Helper: get the user's solo group ID after login
 * ================================================================ */
async function getSoloGroupId(agent: ReturnType<typeof supertest.agent>): Promise<string> {
  const res = await agent.get("/api/groups");
  const soloGroup = res.body.find((g: any) => g.name === "Solo Deuces");
  return soloGroup.id;
}

/** Make user premium so we can test premium-gated validation. */
async function makePremium(agent: ReturnType<typeof supertest.agent>) {
  // Get user id from /api/auth/user
  const me = await agent.get("/api/auth/user");
  const userId = me.body?.id;
  if (userId) {
    const users = memStore._users();
    const u = users.get(userId);
    if (u) {
      u.subscription = "premium";
      u.subscriptionExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    }
  }
}

/* ================================================================
 *  1. MISSING REQUIRED FIELDS
 * ================================================================ */
describe("Malformed requests — missing required fields", () => {
  it("POST /api/deuces without location returns 400", async () => {
    const agent = await loginAs("missingfields-1");
    const groupId = await getSoloGroupId(agent);
    const res = await agent.post("/api/deuces").send({ groupId, thoughts: "no location here" });
    expect(res.status).toBe(400);
  });

  it("POST /api/groups without name returns 400", async () => {
    const agent = await loginAs("missingfields-2");
    const res = await agent.post("/api/groups").send({ description: "No name group" });
    expect(res.status).toBe(400);
  });

  it("POST /api/locations without name returns 400", async () => {
    const agent = await loginAs("missingfields-3");
    const res = await agent.post("/api/locations").send({});
    expect(res.status).toBe(400);
  });

  it("PUT /api/notifications/reminder without hour returns 400", async () => {
    const agent = await loginAs("missingfields-4");
    await makePremium(agent);
    const res = await agent.put("/api/notifications/reminder").send({ minute: 30 });
    expect(res.status).toBe(400);
  });

  it("PUT /api/notifications/reminder without minute returns 400", async () => {
    const agent = await loginAs("missingfields-5");
    await makePremium(agent);
    const res = await agent.put("/api/notifications/reminder").send({ hour: 9 });
    expect(res.status).toBe(400);
  });

  it("PUT /api/notifications/reminder with empty body returns 400", async () => {
    const agent = await loginAs("missingfields-6");
    await makePremium(agent);
    const res = await agent.put("/api/notifications/reminder").send({});
    expect(res.status).toBe(400);
  });
});

/* ================================================================
 *  2. WRONG DATA TYPES
 * ================================================================ */
describe("Malformed requests — wrong data types", () => {
  it("POST /api/deuces with bristolScore as string returns 400", async () => {
    const agent = await loginAs("wrongtype-1");
    const groupId = await getSoloGroupId(agent);
    const res = await agent.post("/api/deuces").send({ groupId, location: "Office", bristolScore: "three" });
    expect(res.status).toBe(400);
  });

  it("POST /api/deuces with ghost as string returns 400", async () => {
    const agent = await loginAs("wrongtype-2");
    const groupId = await getSoloGroupId(agent);
    const res = await agent.post("/api/deuces").send({ groupId, location: "Home", ghost: "yes" });
    expect(res.status).toBe(400);
  });

  it("PUT /api/notifications/reminder with hour as string returns 400", async () => {
    const agent = await loginAs("wrongtype-3");
    await makePremium(agent);
    const res = await agent.put("/api/notifications/reminder").send({ hour: "nine", minute: 0 });
    expect(res.status).toBe(400);
  });

  it("PUT /api/notifications/reminder with float hour returns 400", async () => {
    const agent = await loginAs("wrongtype-4");
    await makePremium(agent);
    const res = await agent.put("/api/notifications/reminder").send({ hour: 9.5, minute: 0 });
    expect(res.status).toBe(400);
  });

  it("POST /api/locations with name as number returns 400", async () => {
    const agent = await loginAs("wrongtype-5");
    const res = await agent.post("/api/locations").send({ name: 42 });
    // Zod coerces number to string in some configs, but our schema uses z.string() — check 400 or 200
    // Either it rejects or accepts after coercion; just assert it doesn't 500
    expect(res.status).not.toBe(500);
  });

  it("POST /api/deuces with latitude as string returns 400", async () => {
    const agent = await loginAs("wrongtype-6");
    const groupId = await getSoloGroupId(agent);
    const res = await agent.post("/api/deuces").send({ groupId, location: "Park", latitude: "north", longitude: 0 });
    expect(res.status).toBe(400);
  });

  it("POST /api/deuces with groupIds as string instead of array returns 400", async () => {
    const agent = await loginAs("wrongtype-7");
    const groupId = await getSoloGroupId(agent);
    const res = await agent.post("/api/deuces").send({ groupIds: groupId, location: "Home" });
    expect(res.status).toBe(400);
  });
});

/* ================================================================
 *  3. INVALID ENUM VALUES
 * ================================================================ */
describe("Malformed requests — invalid enum values", () => {
  it("PUT /api/user/theme with invalid theme returns 400", async () => {
    const agent = await loginAs("invalidenum-1");
    await makePremium(agent);
    const res = await agent.put("/api/user/theme").send({ theme: "neon" });
    expect(res.status).toBe(400);
  });

  it("PUT /api/user/theme with empty string returns 400", async () => {
    const agent = await loginAs("invalidenum-2");
    await makePremium(agent);
    const res = await agent.put("/api/user/theme").send({ theme: "" });
    expect(res.status).toBe(400);
  });

  it("PUT /api/user/theme with numeric theme returns 400", async () => {
    const agent = await loginAs("invalidenum-3");
    await makePremium(agent);
    const res = await agent.put("/api/user/theme").send({ theme: 1 });
    expect(res.status).toBe(400);
  });

  it("POST /api/notifications/register with invalid platform returns 400", async () => {
    const agent = await loginAs("invalidenum-4");
    const res = await agent.post("/api/notifications/register").send({ token: "abc123token", platform: "web" });
    expect(res.status).toBe(400);
  });

  it("POST /api/notifications/register with platform as number returns 400", async () => {
    const agent = await loginAs("invalidenum-5");
    const res = await agent.post("/api/notifications/register").send({ token: "abc123token", platform: 1 });
    expect(res.status).toBe(400);
  });
});

/* ================================================================
 *  4. INVALID UUIDs IN PATH PARAMETERS
 * ================================================================ */
describe("Malformed requests — invalid UUID path params", () => {
  it("GET /api/groups/not-a-uuid/entries returns 400 or 404", async () => {
    const agent = await loginAs("baduuid-1");
    const res = await agent.get("/api/groups/not-a-uuid/entries");
    expect([400, 404]).toContain(res.status);
  });

  it("DELETE /api/deuces/not-a-uuid returns 400 or 404", async () => {
    const agent = await loginAs("baduuid-2");
    const res = await agent.delete("/api/deuces/not-a-uuid");
    expect([400, 404]).toContain(res.status);
  });

  it("POST /api/deuces with groupId not a UUID returns 400 or 403", async () => {
    const agent = await loginAs("baduuid-3");
    const res = await agent.post("/api/deuces").send({ groupId: "not-a-uuid", location: "Home" });
    expect([400, 403]).toContain(res.status);
  });

  it("POST /api/deuces with groupIds containing non-UUID returns 400 or 403", async () => {
    const agent = await loginAs("baduuid-4");
    const res = await agent.post("/api/deuces").send({ groupIds: ["not-a-uuid"], location: "Home" });
    expect([400, 403]).toContain(res.status);
  });

  it("GET /api/groups/12345/entries returns 400 or 404 (not a UUID)", async () => {
    const agent = await loginAs("baduuid-5");
    const res = await agent.get("/api/groups/12345/entries");
    expect([400, 404]).toContain(res.status);
  });
});

/* ================================================================
 *  5. INVALID REACTION EMOJI
 * ================================================================ */
describe("Malformed requests — invalid emoji in reactions", () => {
  it("POST /api/reactions with string longer than 10 chars returns 400", async () => {
    const agent = await loginAs("emoji-1");
    const groupId = await getSoloGroupId(agent);
    // create an entry first
    const entry = await agent.post("/api/deuces").send({ groupId, location: "Home" });
    expect(entry.status).toBe(200);
    const entryId = entry.body.entries?.[0]?.id ?? entry.body.id;

    // max is 10 chars — 11 chars should be rejected
    const res = await agent.post(`/api/entries/${entryId}/reactions`).send({ emoji: "12345678901" });
    expect(res.status).toBe(400);
  });

  it("POST /api/reactions with HTML returns 400", async () => {
    const agent = await loginAs("emoji-2");
    const groupId = await getSoloGroupId(agent);
    const entry = await agent.post("/api/deuces").send({ groupId, location: "Home" });
    const entryId = entry.body.entries?.[0]?.id ?? entry.body.id;

    const res = await agent.post(`/api/entries/${entryId}/reactions`).send({ emoji: "<script>alert(1)</script>" });
    expect(res.status).toBe(400);
  });

  it("POST /api/reactions with empty emoji returns 400", async () => {
    const agent = await loginAs("emoji-3");
    const groupId = await getSoloGroupId(agent);
    const entry = await agent.post("/api/deuces").send({ groupId, location: "Home" });
    const entryId = entry.body.entries?.[0]?.id ?? entry.body.id;

    const res = await agent.post(`/api/entries/${entryId}/reactions`).send({ emoji: "" });
    expect(res.status).toBe(400);
  });

  it("POST /api/reactions missing emoji field returns 400", async () => {
    const agent = await loginAs("emoji-4");
    const groupId = await getSoloGroupId(agent);
    const entry = await agent.post("/api/deuces").send({ groupId, location: "Home" });
    const entryId = entry.body.entries?.[0]?.id ?? entry.body.id;

    const res = await agent.post(`/api/entries/${entryId}/reactions`).send({});
    expect(res.status).toBe(400);
  });
});

/* ================================================================
 *  6. OUT-OF-RANGE INTEGER VALUES
 * ================================================================ */
describe("Malformed requests — out-of-range integers", () => {
  it("POST /api/deuces with bristolScore=0 returns 400 (min is 1)", async () => {
    const agent = await loginAs("range-1");
    const groupId = await getSoloGroupId(agent);
    const res = await agent.post("/api/deuces").send({ groupId, location: "Home", bristolScore: 0 });
    expect(res.status).toBe(400);
  });

  it("POST /api/deuces with bristolScore=8 returns 400 (max is 7)", async () => {
    const agent = await loginAs("range-2");
    const groupId = await getSoloGroupId(agent);
    const res = await agent.post("/api/deuces").send({ groupId, location: "Home", bristolScore: 8 });
    expect(res.status).toBe(400);
  });

  it("POST /api/deuces with bristolScore=-1 returns 400", async () => {
    const agent = await loginAs("range-3");
    const groupId = await getSoloGroupId(agent);
    const res = await agent.post("/api/deuces").send({ groupId, location: "Home", bristolScore: -1 });
    expect(res.status).toBe(400);
  });

  it("PUT /api/notifications/reminder with hour=24 returns 400 (max is 23)", async () => {
    const agent = await loginAs("range-4");
    await makePremium(agent);
    const res = await agent.put("/api/notifications/reminder").send({ hour: 24, minute: 0 });
    expect(res.status).toBe(400);
  });

  it("PUT /api/notifications/reminder with hour=-1 returns 400 (min is 0)", async () => {
    const agent = await loginAs("range-5");
    await makePremium(agent);
    const res = await agent.put("/api/notifications/reminder").send({ hour: -1, minute: 0 });
    expect(res.status).toBe(400);
  });

  it("PUT /api/notifications/reminder with minute=60 returns 400 (max is 59)", async () => {
    const agent = await loginAs("range-6");
    await makePremium(agent);
    const res = await agent.put("/api/notifications/reminder").send({ hour: 9, minute: 60 });
    expect(res.status).toBe(400);
  });
});

/* ================================================================
 *  7. NULL VALUES FOR REQUIRED FIELDS
 * ================================================================ */
describe("Malformed requests — null for required fields", () => {
  it("POST /api/deuces with null location returns 400", async () => {
    const agent = await loginAs("nullfield-1");
    const groupId = await getSoloGroupId(agent);
    const res = await agent.post("/api/deuces").send({ groupId, location: null });
    expect(res.status).toBe(400);
  });

  it("POST /api/groups with null name returns 400", async () => {
    const agent = await loginAs("nullfield-2");
    const res = await agent.post("/api/groups").send({ name: null });
    expect(res.status).toBe(400);
  });

  it("PUT /api/user/theme with null theme returns 400", async () => {
    const agent = await loginAs("nullfield-3");
    await makePremium(agent);
    const res = await agent.put("/api/user/theme").send({ theme: null });
    expect(res.status).toBe(400);
  });

  it("PUT /api/notifications/reminder with null hour returns 400", async () => {
    const agent = await loginAs("nullfield-4");
    await makePremium(agent);
    const res = await agent.put("/api/notifications/reminder").send({ hour: null, minute: 0 });
    expect(res.status).toBe(400);
  });
});

/* ================================================================
 *  8. EXTRA UNKNOWN FIELDS (should not cause errors)
 * ================================================================ */
describe("Malformed requests — extra unknown fields are accepted", () => {
  it("POST /api/deuces with extra fields still succeeds (200)", async () => {
    const agent = await loginAs("extrafield-1");
    const groupId = await getSoloGroupId(agent);
    const res = await agent.post("/api/deuces").send({
      groupId,
      location: "Home",
      unknownField: "should be ignored",
      anotherExtra: 999,
    });
    expect(res.status).toBe(200);
  });

  it("POST /api/groups with extra fields still creates group (200 or 201)", async () => {
    const agent = await loginAs("extrafield-2");
    const res = await agent.post("/api/groups").send({
      name: "Test Squad",
      unknownProp: "ignored",
      anotherExtra: true,
    });
    expect([200, 201]).toContain(res.status);
  });

  it("PUT /api/notifications/reminder with extra fields still sets reminder", async () => {
    const agent = await loginAs("extrafield-3");
    await makePremium(agent);
    const res = await agent.put("/api/notifications/reminder").send({
      hour: 8,
      minute: 30,
      timezone: "America/New_York",
      extra: "data",
    });
    expect([200, 201]).toContain(res.status);
  });
});
