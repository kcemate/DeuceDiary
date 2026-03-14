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
  let _badges: any[] = [];
  const _streaks = new Map<string, { currentStreak: number; longestStreak: number; lastStreakDate: string | null }>();
  let _memberId = 1;

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
        timezone: existing?.timezone ?? null,
        referralCode: existing?.referralCode ?? `REF${data.id.slice(-4).toUpperCase()}`,
        referralCount: existing?.referralCount ?? 0,
        reminderHour: existing?.reminderHour ?? null,
        reminderMinute: existing?.reminderMinute ?? null,
        deletedAt: existing?.deletedAt ?? null,
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
      return { subscription: user?.subscription ?? "free", subscriptionExpiresAt: user?.subscriptionExpiresAt ?? null, streakInsuranceUsed: user?.streakInsuranceUsed ?? false };
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
    async softDeleteUser(userId: string) {
      const user = _users.get(userId);
      if (user) {
        user.deletedAt = new Date();
        user.email = null;
        user.firstName = "Deleted";
        user.lastName = "User";
      }
    },

    /* ---- Badges ---- */
    async getUserBadges(userId: string) {
      return _badges.filter((b) => b.userId === userId);
    },
    _seedBadge(userId: string, name: string, unlocked: boolean) {
      _badges.push({ id: Date.now(), userId, name, unlocked, createdAt: new Date() });
    },

    /* ---- Premium analytics ---- */
    async getPremiumAnalytics(userId: string) {
      return { totalDeuces: 0, avgPerWeek: 0, longestStreak: 0, currentStreak: 0, bestDay: { day: "Monday", count: 0 }, groupRankings: [] };
    },
    async getUserDeucesByDate(userId: string) { return []; },
    async getWeeklyReport(_userId: string) {
      return { totalDeuces: 0, peakDay: { date: "", count: 0 }, mostActiveSquad: { name: "None", count: 0 }, longestStreak: 0, funniestEntry: null, totalReactionsReceived: 0, weekOf: "" };
    },

    /* ---- Group ops ---- */
    async createGroup(group: any) {
      const newGroup = {
        id: group.id, name: group.name, description: group.description ?? null, createdBy: group.createdBy,
        currentStreak: 0, longestStreak: 0, lastStreakDate: null, createdAt: new Date(), updatedAt: new Date(),
      };
      _groups.set(newGroup.id, newGroup);
      _members.push({ id: _memberId++, groupId: newGroup.id, userId: group.createdBy, role: "admin", joinedAt: new Date() });
      return newGroup;
    },
    async getUserGroups(userId: string) {
      const ids = _members.filter((m) => m.userId === userId).map((m) => m.groupId);
      return ids.map((gid) => {
        const g = _groups.get(gid)!;
        const mem = _members.find((m) => m.groupId === gid && m.userId === userId);
        return { ...g, memberCount: _members.filter((m) => m.groupId === gid).length, entryCount: 0, joinedAt: mem?.joinedAt };
      });
    },
    async getGroupById(groupId: string) { return _groups.get(groupId); },
    async addGroupMember(member: any) {
      const m = { id: _memberId++, groupId: member.groupId, userId: member.userId, role: member.role ?? "member", joinedAt: new Date() };
      _members.push(m);
      return m;
    },
    async getGroupMembers(groupId: string) {
      return _members.filter((m) => m.groupId === groupId).map((m) => ({ ...m, user: _users.get(m.userId)! }));
    },
    async getGroupMemberRole(userId: string, groupId: string) {
      return _members.find((m) => m.userId === userId && m.groupId === groupId)?.role ?? null;
    },
    async isUserInGroup(userId: string, groupId: string) {
      return _members.some((m) => m.userId === userId && m.groupId === groupId);
    },
    async removeGroupMember(userId: string, groupId: string) {
      _members = _members.filter((m) => !(m.userId === userId && m.groupId === groupId));
    },
    async getGroupMemberCount(groupId: string) { return _members.filter((m) => m.groupId === groupId).length; },
    async getGroupDeuceCount(groupId: string) { return [..._entries.values()].filter((e) => e.groupId === groupId).length; },
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
      return _members.filter((m) => m.groupId === groupId).map((m) => {
        const u = _users.get(m.userId);
        return { userId: m.userId, username: u?.username, firstName: u?.firstName, deuceCount: u?.deuceCount ?? 0, monthlyDeuces: 0, weeklyDeuces: 0, isMvp: false };
      });
    },
    async getGroupEntries(groupId: string, _limit?: number, _offset?: number) {
      return [..._entries.values()].filter((e) => e.groupId === groupId).map((e) => ({ ...e, user: _users.get(e.userId)! }));
    },
    async getMembersLogStatusToday(groupId: string, _today: string) {
      return _members.filter((m) => m.groupId === groupId).map((m) => ({
        userId: m.userId, username: _users.get(m.userId)?.username ?? null, firstName: _users.get(m.userId)?.firstName ?? null, profileImageUrl: null, hasLogged: false,
      }));
    },
    async getGroupTypicalHours(_groupId: string) { return null; },
    async getGroupWeeklyReport(_groupId: string) {
      return { weekOf: "2026-03-09", totalDeuces: 0, mvp: null, members: [], funnyStats: {} };
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
      return [..._entries.values()].filter((e) => groupIds.includes(e.groupId)).slice(0, limit).map((e) => ({ ...e, user: _users.get(e.userId), reactions: [] }));
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

    /* ---- Push token stubs ---- */
    async countUserPushTokens(_userId: string) { return 0; },
    async getUserPushTokens(_userId: string) { return []; },
    async upsertPushToken(_data: any) {},
    async deletePushToken(_userId: string, _token: string) {},
    async getGroupPushTokens(_groupId: string) { return []; },

    /* ---- Stubs ---- */
    async getAllGroupsWithActiveStreaks(_minStreak: number) { return []; },
    async createStreakAlert(_alert: any) { return _alert; },
    async getReferralDashboardStats(_userId: string) { return { totalReferrals: 0, premiumConversions: 0, pendingConversions: 0 }; },
    async getReferralLeaderboard() { return []; },
    async createBroadcast(data: any) { return { id: 1, ...data, createdAt: new Date() }; },

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
    async getShareCardData(userId: string) {
      const user = _users.get(userId);
      if (!user) throw new Error("User not found");
      return { username: user.username, currentStreak: 0, longestStreak: 0, totalLogs: 0, squadCount: 0, memberSince: user.createdAt };
    },

    /* ---- test helpers ---- */
    _reset() {
      _users.clear();
      _groups.clear();
      _members = [];
      _entries.clear();
      _invites.clear();
      _locations = [];
      _reactions = [];
      _badges = [];
      _streaks.clear();
      _memberId = 1;
    },
    _getUser(id: string) { return _users.get(id); },
    _getEntries() { return [..._entries.values()]; },
    _setDailyCount(userId: string, count: number) {
      // Seed existing entries to simulate daily count
      for (let i = 0; i < count; i++) {
        const e = { id: `preset-${userId}-${i}`, userId, groupId: "x", location: "A", thoughts: null, loggedAt: new Date(), createdAt: new Date() };
        _entries.set(e.id, e);
      }
    },
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

/* ================================================================
 *  TESTS: GET /api/user/export
 * ================================================================ */
describe("GET /api/user/export", () => {
  it("returns a JSON export with account, groups, and badges", async () => {
    const agent = await loginAs("export-user");
    const userId = "dev-export-user";
    memStore._seedBadge(userId, "First Flush", true);
    memStore._seedBadge(userId, "Royal Flush", false);

    const res = await agent.get("/api/user/export");
    expect(res.status).toBe(200);
    expect(res.headers["content-disposition"]).toMatch(/attachment/);
    expect(res.body).toHaveProperty("exportedAt");
    expect(res.body).toHaveProperty("account");
    expect(res.body).toHaveProperty("groups");
    expect(res.body).toHaveProperty("badges");
    expect(Array.isArray(res.body.groups)).toBe(true);
    expect(Array.isArray(res.body.badges)).toBe(true);
  });

  it("includes badge names and unlocked status", async () => {
    const agent = await loginAs("export-badges-user");
    const userId = "dev-export-badges-user";
    memStore._seedBadge(userId, "First Flush", true);
    memStore._seedBadge(userId, "Streak Master", false);

    const res = await agent.get("/api/user/export");
    expect(res.status).toBe(200);
    const badgeNames = res.body.badges.map((b: any) => b.name);
    expect(badgeNames).toContain("First Flush");
    expect(badgeNames).toContain("Streak Master");
    const firstFlush = res.body.badges.find((b: any) => b.name === "First Flush");
    expect(firstFlush.unlocked).toBe(true);
  });

  it("includes all joined groups", async () => {
    const agent = await loginAs("export-groups-user");
    const userId = "dev-export-groups-user";
    const groups = await memStore.getUserGroups(userId);
    expect(groups).toHaveLength(1);

    const res = await agent.get("/api/user/export");
    expect(res.status).toBe(200);
    expect(res.body.groups).toHaveLength(1);
    expect(res.body.groups[0]).toHaveProperty("name", "Solo Deuces");
  });

  it("export has correct account fields", async () => {
    const agent = await loginAs("export-account-user");
    const res = await agent.get("/api/user/export");
    expect(res.status).toBe(200);
    const { account } = res.body;
    expect(account).toHaveProperty("subscription", "free");
    expect(account).toHaveProperty("theme", "default");
    expect(account).toHaveProperty("deuceCount", 0);
  });

  it("returns 401 without authentication", async () => {
    const res = await supertest(app).get("/api/user/export");
    expect(res.status).toBe(401);
  });
});

/* ================================================================
 *  TESTS: GET /api/user/badges
 * ================================================================ */
describe("GET /api/user/badges", () => {
  it("returns empty array when user has no badges", async () => {
    const agent = await loginAs("badges-empty-user");
    const res = await agent.get("/api/user/badges");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(0);
  });

  it("returns badges for user who has earned some", async () => {
    const agent = await loginAs("badges-user");
    const userId = "dev-badges-user";
    memStore._seedBadge(userId, "First Flush", true);
    memStore._seedBadge(userId, "Streak Starter", true);

    const res = await agent.get("/api/user/badges");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    const names = res.body.map((b: any) => b.name);
    expect(names).toContain("First Flush");
    expect(names).toContain("Streak Starter");
  });

  it("does not return badges belonging to another user", async () => {
    const agent = await loginAs("badges-isolation-user");
    const otherUserId = "dev-other-badges-user";
    memStore._seedBadge(otherUserId, "Other User Badge", true);

    const res = await agent.get("/api/user/badges");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(0);
  });

  it("returns 401 without authentication", async () => {
    const res = await supertest(app).get("/api/user/badges");
    expect(res.status).toBe(401);
  });
});

/* ================================================================
 *  TESTS: DELETE /api/user/account
 * ================================================================ */
describe("DELETE /api/user/account", () => {
  it("soft-deletes the account and returns success", async () => {
    const agent = await loginAs("delete-account-user");
    const userId = "dev-delete-account-user";

    const res = await agent.delete("/api/user/account");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("success", true);

    // User should now be soft-deleted (deletedAt set)
    const raw = memStore._getUser(userId);
    expect(raw.deletedAt).toBeTruthy();
  });

  it("subsequent auth/user call returns 401 after account deletion", async () => {
    const agent = await loginAs("delete-then-auth-user");

    const deleteRes = await agent.delete("/api/user/account");
    expect(deleteRes.status).toBe(200);

    // Session still has userId but getUser now returns undefined
    const authRes = await agent.get("/api/auth/user");
    expect(authRes.status).toBe(401);
  });

  it("returns 401 without authentication", async () => {
    const res = await supertest(app).delete("/api/user/account");
    expect(res.status).toBe(401);
  });
});

/* ================================================================
 *  TESTS: POST /api/deuces/sync
 * ================================================================ */
describe("POST /api/deuces/sync", () => {
  it("returns 401 without authentication", async () => {
    const res = await supertest(app).post("/api/deuces/sync").send({ entries: [] });
    expect(res.status).toBe(401);
  });

  it("returns 400 for invalid sync payload (missing entries)", async () => {
    const agent = await loginAs("sync-invalid-user");
    const res = await agent.post("/api/deuces/sync").send({ notEntries: [] });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/invalid sync payload/i);
  });

  it("syncs a single valid entry to a single group", async () => {
    const agent = await loginAs("sync-user");
    const userId = "dev-sync-user";
    const groups = await memStore.getUserGroups(userId);
    const groupId = groups[0].id;

    const entryId = uuidv4();
    const res = await agent.post("/api/deuces/sync").send({
      entries: [{ id: entryId, groupIds: [groupId], location: "Home", thoughts: "All good", loggedAt: new Date().toISOString() }],
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("synced", 1);
    expect(res.body.results).toHaveLength(1);
    expect(res.body.results[0]).toMatchObject({ id: entryId, status: "ok" });
  });

  it("returns status:error when user is not in the target group", async () => {
    const agent = await loginAs("sync-outsider");
    const fakeGroupId = uuidv4();

    const entryId = uuidv4();
    const res = await agent.post("/api/deuces/sync").send({
      entries: [{ id: entryId, groupIds: [fakeGroupId], location: "Office", loggedAt: new Date().toISOString() }],
    });
    expect(res.status).toBe(200);
    expect(res.body.synced).toBe(0);
    expect(res.body.results[0]).toMatchObject({ id: entryId, status: "error" });
    expect(res.body.results[0].reason).toMatch(/member/i);
  });

  it("returns status:error for a future loggedAt date", async () => {
    const agent = await loginAs("sync-future-user");
    const userId = "dev-sync-future-user";
    const groups = await memStore.getUserGroups(userId);
    const groupId = groups[0].id;

    const futureDate = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes in future
    const entryId = uuidv4();
    const res = await agent.post("/api/deuces/sync").send({
      entries: [{ id: entryId, groupIds: [groupId], location: "Future", loggedAt: futureDate }],
    });
    expect(res.status).toBe(200);
    expect(res.body.synced).toBe(0);
    expect(res.body.results[0]).toMatchObject({ id: entryId, status: "error" });
    expect(res.body.results[0].reason).toMatch(/future/i);
  });

  it("returns status:error for an invalid loggedAt date string", async () => {
    const agent = await loginAs("sync-baddate-user");
    const userId = "dev-sync-baddate-user";
    const groups = await memStore.getUserGroups(userId);
    const groupId = groups[0].id;

    const entryId = uuidv4();
    const res = await agent.post("/api/deuces/sync").send({
      entries: [{ id: entryId, groupIds: [groupId], location: "Here", loggedAt: "not-a-date" }],
    });
    expect(res.status).toBe(200);
    expect(res.body.results[0]).toMatchObject({ id: entryId, status: "error" });
    expect(res.body.results[0].reason).toMatch(/invalid/i);
  });

  it("returns 400 for empty entries array (Zod requires at least one entry)", async () => {
    const agent = await loginAs("sync-empty-user");
    const res = await agent.post("/api/deuces/sync").send({ entries: [] });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  it("processes multiple entries in one request and reports per-entry status", async () => {
    const agent = await loginAs("sync-multi-user");
    const userId = "dev-sync-multi-user";
    const groups = await memStore.getUserGroups(userId);
    const groupId = groups[0].id;
    const fakeGroupId = uuidv4();

    const okId = uuidv4();
    const badId = uuidv4();
    const res = await agent.post("/api/deuces/sync").send({
      entries: [
        { id: okId, groupIds: [groupId], location: "Home", loggedAt: new Date().toISOString() },
        { id: badId, groupIds: [fakeGroupId], location: "Nowhere", loggedAt: new Date().toISOString() },
      ],
    });
    expect(res.status).toBe(200);
    expect(res.body.synced).toBe(1);
    expect(res.body.results).toHaveLength(2);
    const okResult = res.body.results.find((r: any) => r.id === okId);
    const badResult = res.body.results.find((r: any) => r.id === badId);
    expect(okResult.status).toBe("ok");
    expect(badResult.status).toBe("error");
  });
});
