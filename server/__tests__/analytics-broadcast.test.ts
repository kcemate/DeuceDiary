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
  let _broadcasts: any[] = [];
  let _pushTokens: any[] = [];
  let _locations: any[] = [];
  let _reactions: any[] = [];
  const _streaks = new Map<string, { currentStreak: number; longestStreak: number; lastStreakDate: string | null }>();
  let _memberId = 1;
  let _broadcastId = 1;

  return {
    async getUser(id: string) {
      const u = _users.get(id);
      return u?.deletedAt ? undefined : u;
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
        referralCode: existing?.referralCode ?? `REF${data.id.slice(-4).toUpperCase()}`,
        referralCount: existing?.referralCount ?? 0,
        reminderHour: existing?.reminderHour ?? null,
        reminderMinute: existing?.reminderMinute ?? null,
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
    async updateUserSubscription(userId: string, subscription: string, expiresAt: Date) {
      const user = _users.get(userId);
      if (!user) throw new Error("User not found");
      user.subscription = subscription;
      user.subscriptionExpiresAt = expiresAt;
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
    async updateUserTheme(userId: string, theme: string) {
      const user = _users.get(userId);
      if (!user) throw new Error("User not found");
      user.theme = theme;
      return user;
    },
    async updateUserUsername(userId: string, username: string) {
      const user = _users.get(userId);
      if (!user) throw new Error("User not found");
      user.username = username;
      return user;
    },
    async updateUserProfilePicture(userId: string, url: string) {
      const user = _users.get(userId);
      if (!user) throw new Error("User not found");
      user.profileImageUrl = url;
      return user;
    },
    async updateUserReminder(userId: string, hour: number, minute: number) {
      const user = _users.get(userId);
      if (!user) throw new Error("User not found");
      user.reminderHour = hour;
      user.reminderMinute = minute;
      return user;
    },
    async useStreakInsurance(userId: string) {
      const user = _users.get(userId);
      if (user) user.streakInsuranceUsed = true;
    },
    async resetAllStreakInsurance() { return 0; },

    /* ---- Premium analytics ---- */
    async getPremiumAnalytics(userId: string) {
      const userEntries = [..._entries.values()].filter((e) => e.userId === userId);
      const groupIds = _members.filter((m) => m.userId === userId).map((m) => m.groupId);
      let longestStreak = 0;
      let currentStreak = 0;
      for (const gid of groupIds) {
        const s = _streaks.get(gid);
        if (s) {
          longestStreak = Math.max(longestStreak, s.longestStreak);
          currentStreak = Math.max(currentStreak, s.currentStreak);
        }
      }
      return {
        totalDeuces: userEntries.length,
        avgPerWeek: userEntries.length,
        longestStreak,
        currentStreak,
        bestDay: { day: "Monday", count: userEntries.length },
        groupRankings: groupIds.map((gid) => {
          const g = _groups.get(gid);
          return { groupId: gid, groupName: g?.name ?? "Unknown", rank: 1, total: 1 };
        }),
      };
    },
    async getUserDeucesByDate(userId: string) {
      const byDate = new Map<string, number>();
      for (const e of _entries.values()) {
        if (e.userId === userId) {
          const d = (e.createdAt ?? new Date()).toISOString().split("T")[0];
          byDate.set(d, (byDate.get(d) ?? 0) + 1);
        }
      }
      return [...byDate.entries()]
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => b.date.localeCompare(a.date));
    },
    async getWeeklyReport(_userId: string) {
      return {
        totalDeuces: 7,
        peakDay: { date: "2026-03-09", count: 3 },
        mostActiveSquad: { name: "The Regulars", count: 5 },
        longestStreak: 4,
        funniestEntry: null,
        totalReactionsReceived: 12,
        weekOf: "2026-03-09",
      };
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
        return { ...g, memberCount: _members.filter((m) => m.groupId === gid).length, entryCount: 0 };
      });
    },
    async getGroupById(groupId: string) { return _groups.get(groupId); },
    async addGroupMember(member: any) {
      const m = { id: _memberId++, groupId: member.groupId, userId: member.userId, role: member.role ?? "member", joinedAt: new Date() };
      _members.push(m);
      return m;
    },
    async getGroupMembers(groupId: string) {
      return _members
        .filter((m) => m.groupId === groupId)
        .map((m) => ({ ...m, user: _users.get(m.userId)! }));
    },
    async getGroupMemberRole(userId: string, groupId: string) {
      const m = _members.find((m) => m.userId === userId && m.groupId === groupId);
      return m?.role ?? null;
    },
    async isUserInGroup(userId: string, groupId: string) {
      return _members.some((m) => m.userId === userId && m.groupId === groupId);
    },
    async isUserInGroups(userId: string, groupIds: string[]) {
      return new Set(groupIds.filter((gid) => _members.some((m) => m.userId === userId && m.groupId === gid)));
    },
    async removeGroupMember(userId: string, groupId: string) {
      _members = _members.filter((m) => !(m.userId === userId && m.groupId === groupId));
    },
    async getGroupMemberCount(groupId: string) {
      return _members.filter((m) => m.groupId === groupId).length;
    },
    async getGroupDeuceCount(groupId: string) {
      return [..._entries.values()].filter((e) => e.groupId === groupId).length;
    },
    async getGroupStreak(groupId: string) {
      return _streaks.get(groupId) ?? { currentStreak: 0, longestStreak: 0, lastStreakDate: null as string | null };
    },
    async getGroupStreaksBatch(groupIds: string[]) {
      const map = new Map<string, any>();
      for (const id of groupIds) map.set(id, await this.getGroupStreak(id));
      return map;
    },
    async updateGroupStreak(groupId: string, currentStreak: number, longestStreak: number, lastStreakDate: string) {
      _streaks.set(groupId, { currentStreak, longestStreak, lastStreakDate });
    },
    async getGroupLeaderboard(groupId: string) {
      return _members
        .filter((m) => m.groupId === groupId)
        .map((m) => {
          const u = _users.get(m.userId);
          return { userId: m.userId, username: u?.username, firstName: u?.firstName, deuceCount: u?.deuceCount ?? 0, monthlyDeuces: 0, weeklyDeuces: 0, isMvp: false };
        })
        .sort((a, b) => b.deuceCount - a.deuceCount);
    },
    async getGroupEntries(groupId: string, _limit?: number, _offset?: number) {
      return [..._entries.values()]
        .filter((e) => e.groupId === groupId)
        .map((e) => ({ ...e, user: _users.get(e.userId)! }));
    },
    async getMembersLogStatusToday(groupId: string, _today: string) {
      return _members.filter((m) => m.groupId === groupId).map((m) => ({
        userId: m.userId, username: _users.get(m.userId)?.username ?? null,
        firstName: _users.get(m.userId)?.firstName ?? null,
        profileImageUrl: null, hasLogged: false,
      }));
    },
    async getGroupTypicalHours(groupId: string) { return null; },
    async getGroupWeeklyReport(groupId: string) {
      return { weekOf: "2026-03-09", totalDeuces: 10, mvp: null, members: [], funnyStats: {} };
    },

    /* ---- Entry ops ---- */
    async createDeuceEntry(entry: any) {
      const e = { id: entry.id, userId: entry.userId, groupId: entry.groupId, location: entry.location, thoughts: entry.thoughts, loggedAt: entry.loggedAt, createdAt: entry.createdAt ?? new Date() };
      _entries.set(e.id, e);
      return e;
    },
    async getUserDailyLogCount(userId: string, _dateUTC: string) {
      return [..._entries.values()].filter((e) => e.userId === userId).length;
    },
    async getEntryById(entryId: string) { return _entries.get(entryId); },
    async getFeedEntries(groupIds: string[], limit: number) {
      return [..._entries.values()]
        .filter((e) => groupIds.includes(e.groupId))
        .slice(0, limit)
        .map((e) => ({ ...e, user: _users.get(e.userId), reactions: [] }));
    },
    async getUserPersonalRecord(_userId: string) { return undefined; },

    /* ---- Invite ops ---- */
    async createInvite(invite: any) {
      const inv = { id: invite.id, groupId: invite.groupId, createdBy: invite.createdBy, expiresAt: invite.expiresAt, createdAt: new Date() };
      _invites.set(inv.id, inv);
      return inv;
    },
    async getInviteById(inviteId: string) { return _invites.get(inviteId); },
    async deleteInvite(inviteId: string) { _invites.delete(inviteId); },
    async cleanupExpiredInvites() {},
    async deleteExpiredGroupInvites() {},

    /* ---- Reaction ops ---- */
    async addReaction(reaction: any) {
      const exists = _reactions.find((r) => r.entryId === reaction.entryId && r.userId === reaction.userId && r.emoji === reaction.emoji);
      if (exists) throw new Error("duplicate key value violates unique constraint");
      const r = { id: Date.now(), entryId: reaction.entryId, userId: reaction.userId, emoji: reaction.emoji, createdAt: new Date() };
      _reactions.push(r);
      return r;
    },
    async removeReaction(userId: string, entryId: string, emoji: string) {
      _reactions = _reactions.filter((r) => !(r.userId === userId && r.entryId === entryId && r.emoji === emoji));
    },
    async getEntryReactions(entryId: string) {
      return _reactions.filter((r) => r.entryId === entryId).map((r) => ({ ...r, user: _users.get(r.userId)! }));
    },

    /* ---- Location ops ---- */
    async getLocations() { return _locations; },
    async createLocation(loc: any) {
      const l = { id: Date.now(), name: loc.name, isDefault: loc.isDefault ?? false, createdBy: loc.createdBy ?? null, createdAt: new Date() };
      _locations.push(l);
      return l;
    },
    async getLocationByName(name: string) { return _locations.find((l) => l.name === name); },

    /* ---- Push token ops ---- */
    async countUserPushTokens(userId: string) {
      return _pushTokens.filter((t) => t.userId === userId).length;
    },
    async getUserPushTokens(userId: string) {
      return _pushTokens.filter((t) => t.userId === userId);
    },
    async upsertPushToken(data: any) {
      const existing = _pushTokens.findIndex((t) => t.userId === data.userId && t.token === data.token);
      if (existing >= 0) {
        _pushTokens[existing] = { ..._pushTokens[existing], platform: data.platform };
      } else {
        _pushTokens.push({ id: Date.now(), userId: data.userId, token: data.token, platform: data.platform, createdAt: new Date() });
      }
    },
    async deletePushToken(userId: string, token: string) {
      _pushTokens = _pushTokens.filter((t) => !(t.userId === userId && t.token === token));
    },
    async getGroupPushTokens(groupId: string) {
      const memberIds = _members.filter((m) => m.groupId === groupId).map((m) => m.userId);
      return _pushTokens.filter((t) => memberIds.includes(t.userId));
    },

    /* ---- Broadcast ops ---- */
    async createBroadcast(data: any) {
      const b = { id: _broadcastId++, groupId: data.groupId, userId: data.userId, milestone: data.milestone, createdAt: new Date() };
      _broadcasts.push(b);
      return b;
    },

    /* ---- Stubs ---- */
    async getAllGroupsWithActiveStreaks(_minStreak: number) { return []; },
    async createStreakAlert(_alert: any) { return _alert; },
    async getReferralDashboardStats(_userId: string) { return { totalReferrals: 0, premiumConversions: 0, pendingConversions: 0 }; },
    async getReferralLeaderboard() { return []; },

    /* ---- Bingo stubs ---- */
    async getBingoCard(_userId: string, _month: string) { return null; },
    async createBingoCard(data: any) { return data; },
    async deleteBingoCard(_cardId: string) {},
    async checkAndUpdateBingoProgress(_cardId: string, _userId: string, _squares: any[], _completed: any[]) { return { newlyCompleted: [] }; },
    async getBingoLeaderboard(_groupId: string, _month: string) { return []; },

    /* ---- King stubs ---- */
    async getCurrentKing(_groupId: string) { return null; },
    async getActiveChallengeForGroup(_groupId: string) { return null; },
    async createDeuceKing(_data: any) { return _data; },
    async getExistingChallengeForKing(_kingId: string) { return null; },
    async createChallenge(_data: any) { return _data; },
    async getUserChallengeCompletion(_userId: string, _challengeId: string) { return null; },
    async createChallengeCompletion(_data: any) { return _data; },

    /* ---- test helpers ---- */
    _reset() {
      _users.clear();
      _groups.clear();
      _members = [];
      _entries.clear();
      _invites.clear();
      _broadcasts = [];
      _pushTokens = [];
      _locations = [];
      _reactions = [];
      _streaks.clear();
      _memberId = 1;
      _broadcastId = 1;
    },
    _getUser(id: string) { return _users.get(id); },
    _getGroup(id: string) { return _groups.get(id); },
    _getBroadcasts() { return [..._broadcasts]; },
    _setPushTokens(tokens: any[]) { _pushTokens = [...tokens]; },
  };
});

/* ================================================================
 *  MODULE MOCKS
 * ================================================================ */
vi.mock("../db", () => ({ db: {}, pool: {} }));
vi.mock("../storage", () => ({ storage: memStore }));
vi.mock("@clerk/clerk-sdk-node", () => ({ createClerkClient: () => null }));
vi.mock("svix", () => ({
  Webhook: class {
    verify(body: any) {
      if (Buffer.isBuffer(body)) return JSON.parse(body.toString());
      if (typeof body === "string") return JSON.parse(body);
      return body;
    }
  },
}));

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
          id: userId, email: `${name}@test.dev`, firstName: name, lastName: null, profileImageUrl: null,
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
      app.get("/api/logout", (req: any, res: any) => { req.session.destroy(() => res.redirect("/")); });
      app.post("/api/auth/logout", (req: any, res: any) => { req.session.destroy(() => res.json({ ok: true })); });
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
 *  IMPORTS
 * ================================================================ */
import express from "express";
import supertest from "supertest";
import { registerRoutes } from "../routes";
import { v4 as uuidv4 } from "uuid";

/* ================================================================
 *  TEST SETUP
 * ================================================================ */
let app: Express;
let server: Server;

beforeAll(async () => {
  process.env.CLERK_WEBHOOK_SECRET = "test-webhook-secret";
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

async function loginAsPremium(username: string) {
  const agent = await loginAs(username);
  const userId = `dev-${username.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  await memStore.updateUserSubscription(userId, "premium", expiresAt);
  return agent;
}

/* ================================================================
 *  TESTS: GET /api/analytics/me
 * ================================================================ */
describe("GET /api/analytics/me", () => {
  it("returns analytics for a premium user with no entries", async () => {
    const agent = await loginAsPremium("analytic-alice");
    const res = await agent.get("/api/analytics/me");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("totalDeuces", 0);
    expect(res.body).toHaveProperty("longestStreak", 0);
    expect(res.body).toHaveProperty("currentStreak", 0);
    expect(res.body).toHaveProperty("bestDay");
    expect(res.body).toHaveProperty("groupRankings");
    expect(Array.isArray(res.body.groupRankings)).toBe(true);
  });

  it("reflects deuces logged in the group", async () => {
    const agent = await loginAsPremium("analytic-bob");
    const userId = "dev-analytic-bob";
    const groups = await memStore.getUserGroups(userId);
    const groupId = groups[0].id;

    await memStore.createDeuceEntry({ id: uuidv4(), userId, groupId, location: "Office", thoughts: null, loggedAt: new Date() });
    await memStore.createDeuceEntry({ id: uuidv4(), userId, groupId, location: "Home", thoughts: null, loggedAt: new Date() });

    const res = await agent.get("/api/analytics/me");
    expect(res.status).toBe(200);
    expect(res.body.totalDeuces).toBe(2);
    expect(res.body.groupRankings).toHaveLength(1);
    expect(res.body.groupRankings[0]).toHaveProperty("groupName");
  });

  it("returns 403 for a free user", async () => {
    const agent = await loginAs("analytic-free");
    const res = await agent.get("/api/analytics/me");
    expect(res.status).toBe(403);
  });

  it("returns 401 without authentication", async () => {
    const res = await supertest(app).get("/api/analytics/me");
    expect(res.status).toBe(401);
  });
});

/* ================================================================
 *  TESTS: GET /api/analytics/most-deuces
 * ================================================================ */
describe("GET /api/analytics/most-deuces", () => {
  it("returns { date: '', count: 0 } when user has no entries", async () => {
    const agent = await loginAsPremium("most-deuces-clean");
    const res = await agent.get("/api/analytics/most-deuces");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("count", 0);
    expect(res.body).toHaveProperty("date", "");
  });

  it("returns the peak day when user has logged deuces", async () => {
    const agent = await loginAsPremium("most-deuces-user");
    const userId = "dev-most-deuces-user";
    const groups = await memStore.getUserGroups(userId);
    const groupId = groups[0].id;

    // day1: 1 entry, day2: 3 entries (peak)
    const day1 = new Date("2026-03-10T12:00:00.000Z");
    const day2 = new Date("2026-03-11T12:00:00.000Z");

    await memStore.createDeuceEntry({ id: uuidv4(), userId, groupId, location: "A", thoughts: null, loggedAt: day1, createdAt: day1 });
    await memStore.createDeuceEntry({ id: uuidv4(), userId, groupId, location: "B", thoughts: null, loggedAt: day2, createdAt: day2 });
    await memStore.createDeuceEntry({ id: uuidv4(), userId, groupId, location: "C", thoughts: null, loggedAt: day2, createdAt: day2 });
    await memStore.createDeuceEntry({ id: uuidv4(), userId, groupId, location: "D", thoughts: null, loggedAt: day2, createdAt: day2 });

    const res = await agent.get("/api/analytics/most-deuces");
    expect(res.status).toBe(200);
    expect(res.body.count).toBe(3);
    expect(res.body.date).toBe("2026-03-11");
  });

  it("returns 403 for a free user", async () => {
    const agent = await loginAs("most-deuces-free");
    const res = await agent.get("/api/analytics/most-deuces");
    expect(res.status).toBe(403);
  });

  it("returns 401 without authentication", async () => {
    const res = await supertest(app).get("/api/analytics/most-deuces");
    expect(res.status).toBe(401);
  });
});

/* ================================================================
 *  TESTS: GET /api/users/:userId/weekly-report
 * ================================================================ */
describe("GET /api/users/:userId/weekly-report", () => {
  it("returns weekly report when accessed with userId=me alias", async () => {
    const agent = await loginAsPremium("weekly-report-user");
    const userId = "dev-weekly-report-user";
    const res = await agent.get("/api/users/me/weekly-report");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("totalDeuces");
    expect(res.body).toHaveProperty("weekOf");
    expect(res.body).toHaveProperty("longestStreak");
  });

  it("returns weekly report when accessed with explicit own userId", async () => {
    const agent = await loginAsPremium("weekly-explicit-user");
    const userId = "dev-weekly-explicit-user";
    const res = await agent.get(`/api/users/${userId}/weekly-report`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("totalDeuces");
  });

  it("returns 403 when trying to access another user's weekly report (IDOR)", async () => {
    const agent = await loginAsPremium("weekly-idor-user");
    const res = await agent.get("/api/users/dev-some-other-user/weekly-report");
    expect(res.status).toBe(403);
    expect(res.body.message).toMatch(/cannot access/i);
  });

  it("returns 403 for a free user", async () => {
    const agent = await loginAs("weekly-free-user");
    const userId = "dev-weekly-free-user";
    const res = await agent.get(`/api/users/${userId}/weekly-report`);
    expect(res.status).toBe(403);
  });

  it("returns 401 without authentication", async () => {
    const res = await supertest(app).get("/api/users/some-user/weekly-report");
    expect(res.status).toBe(401);
  });
});

/* ================================================================
 *  TESTS: POST /api/squads/:id/broadcast (Throne Broadcast)
 * ================================================================ */
describe("POST /api/squads/:id/broadcast", () => {
  async function setupSquadWithPremiumAdmin() {
    const agent = await loginAsPremium("broadcast-admin");
    const userId = "dev-broadcast-admin";
    const groups = await memStore.getUserGroups(userId);
    const groupId = groups[0].id;
    return { agent, userId, groupId };
  }

  it("creates a broadcast for a premium admin member", async () => {
    const { agent, groupId } = await setupSquadWithPremiumAdmin();
    const res = await agent.post(`/api/squads/${groupId}/broadcast`).send({ milestone: "100 deuces!" });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("broadcast");
    expect(res.body.broadcast).toHaveProperty("milestone", "100 deuces!");
    expect(res.body).toHaveProperty("tokenCount");
  });

  it("returns tokenCount = 0 when no members have push tokens", async () => {
    const { agent, groupId } = await setupSquadWithPremiumAdmin();
    const res = await agent.post(`/api/squads/${groupId}/broadcast`).send({ milestone: "Squad milestone" });
    expect(res.status).toBe(200);
    expect(res.body.tokenCount).toBe(0);
  });

  it("returns tokenCount matching registered member tokens", async () => {
    const { agent, userId, groupId } = await setupSquadWithPremiumAdmin();
    memStore._setPushTokens([
      { id: 1, userId, token: "ExponentPushToken[valid-token-1]", platform: "ios", createdAt: new Date() },
      { id: 2, userId, token: "ExponentPushToken[valid-token-2]", platform: "android", createdAt: new Date() },
    ]);
    const res = await agent.post(`/api/squads/${groupId}/broadcast`).send({ milestone: "Double trouble" });
    expect(res.status).toBe(200);
    expect(res.body.tokenCount).toBe(2);
  });

  it("returns 400 when milestone is missing", async () => {
    const { agent, groupId } = await setupSquadWithPremiumAdmin();
    const res = await agent.post(`/api/squads/${groupId}/broadcast`).send({});
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/milestone/i);
  });

  it("returns 403 for a free user", async () => {
    const agent = await loginAs("broadcast-free");
    const userId = "dev-broadcast-free";
    const groups = await memStore.getUserGroups(userId);
    const groupId = groups[0].id;
    const res = await agent.post(`/api/squads/${groupId}/broadcast`).send({ milestone: "Free milestone" });
    expect(res.status).toBe(403);
  });

  it("returns 403 for a premium user who is NOT a group member", async () => {
    const { groupId } = await setupSquadWithPremiumAdmin();
    const outsider = await loginAsPremium("broadcast-outsider");
    const res = await outsider.post(`/api/squads/${groupId}/broadcast`).send({ milestone: "Sneak" });
    expect(res.status).toBe(403);
  });

  it("returns 400 for a malformed (non-UUID) group id", async () => {
    const agent = await loginAsPremium("broadcast-uuid-check");
    const res = await agent.post("/api/squads/not-a-uuid/broadcast").send({ milestone: "Test" });
    expect(res.status).toBe(400);
  });

  it("returns 401 without authentication", async () => {
    const res = await supertest(app).post("/api/squads/some-id/broadcast").send({ milestone: "Test" });
    expect(res.status).toBe(401);
  });
});
