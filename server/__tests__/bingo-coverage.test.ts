import { TEST_SESSION_SECRET } from "./test-constants";
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
  const _bingoCards = new Map<string, any>(); // key: `${userId}:${month}`
  let _memberId = 1;
  let _bingoId = 1;

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
      user.username = username;
      return user;
    },
    async updateUserProfilePicture(userId: string, profileImageUrl: string) {
      const user = _users.get(userId);
      if (!user) throw new Error("User not found");
      user.profileImageUrl = profileImageUrl;
      return user;
    },
    async updateUserTheme(userId: string, theme: string) {
      const user = _users.get(userId);
      if (!user) throw new Error("User not found");
      user.theme = theme;
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
      return user;
    },
    async useStreakInsurance() {},
    async resetStreakInsurance() {},
    async resetAllStreakInsurance() { return 0; },
    async getPremiumAnalytics(_userId: string) {
      return { totalDeuces: 0, avgPerWeek: 0, longestStreak: 0, currentStreak: 0, bestDay: { day: "Monday", count: 0 }, groupRankings: [] };
    },
    async getWeeklyReport(_userId: string) {
      return { totalDeuces: 0, peakDay: { date: "2026-01-01", count: 0 }, mostActiveSquad: { name: "None", count: 0 }, longestStreak: 0, funniestEntry: null, totalReactionsReceived: 0, weekOf: "2026-01-01" };
    },
    async createGroup(group: any) {
      const newGroup = { id: group.id, name: group.name, description: group.description ?? null, createdBy: group.createdBy, createdAt: new Date(), updatedAt: new Date() };
      _groups.set(newGroup.id, newGroup);
      _members.push({ id: _memberId++, groupId: newGroup.id, userId: group.createdBy, role: "admin", joinedAt: new Date() });
      return newGroup;
    },
    async getUserGroups(userId: string) {
      const ids = _members.filter((m) => m.userId === userId).map((m) => m.groupId);
      return ids.map((gid) => {
        const g = _groups.get(gid)!;
        const memberCount = _members.filter((m) => m.groupId === gid).length;
        return { ...g, memberCount, entryCount: 0 };
      });
    },
    async getGroupById(groupId: string) { return _groups.get(groupId); },
    async addGroupMember(member: any) {
      const m = { id: _memberId++, groupId: member.groupId, userId: member.userId, role: member.role ?? "member", joinedAt: new Date() };
      _members.push(m);
      return m;
    },
    async getGroupMembers(groupId: string) {
      return _members.filter((m) => m.groupId === groupId).map((m) => ({ ...m, user: { ..._users.get(m.userId) } }));
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
    async createDeuceEntry(entry: any) {
      const e = { id: entry.id, userId: entry.userId, groupId: entry.groupId, location: entry.location, thoughts: entry.thoughts, ghost: entry.ghost ?? false, loggedAt: entry.loggedAt, createdAt: new Date() };
      _entries.set(e.id, e);
      return e;
    },
    async getUserDailyLogCount(_userId: string, _dateUTC: string) { return 0; },
    async getGroupEntries(_groupId: string, _limit?: number, _offset?: number) { return []; },
    async getUserDeucesByDate(_userId: string) { return []; },
    async getEntryById(entryId: string) { return _entries.get(entryId); },
    async getFeedEntries(_groupIds: string[], _limit: number) { return []; },
    async createInvite(invite: any) {
      return { id: invite.id, groupId: invite.groupId, createdBy: invite.createdBy, expiresAt: invite.expiresAt, createdAt: new Date() };
    },
    async getInviteById(_inviteId: string) { return undefined; },
    async getLocations() { return []; },
    async getLocationsForUser(_userId: string) { return []; },
    async createLocation(loc: any) { return { id: 1, ...loc, createdAt: new Date() }; },
    async getLocationByName(_name: string) { return undefined; },
    async getUserPersonalRecord(_userId: string) { return undefined; },
    async getGroupStreak(_groupId: string) { return { currentStreak: 0, longestStreak: 0, lastStreakDate: null }; },
    async getGroupStreaksBatch(groupIds: string[]) {
      const map = new Map<string, any>();
      for (const id of groupIds) map.set(id, { currentStreak: 0, longestStreak: 0, lastStreakDate: null });
      return map;
    },
    async updateGroupStreak() {},
    async resetGroupStreak() {},
    async getMembersLogStatusToday(_groupId: string, _today: string) { return []; },
    async getAllGroupsWithActiveStreaks(_minStreak: number) { return []; },
    async createStreakAlert(_alert: any) { return { id: 1 }; },
    async getGroupMemberCount(groupId: string) { return _members.filter((m) => m.groupId === groupId).length; },
    async getGroupDeuceCount(groupId: string) { return [..._entries.values()].filter((e) => e.groupId === groupId).length; },
    async addReaction(_reaction: any) { return { id: 1 }; },
    async removeReaction() {},
    async getEntryReactions(_entryId: string) { return []; },
    async upsertPushToken(token: any) { return { id: 1, ...token }; },
    async getUserPushTokens(_userId: string) { return []; },
    async countUserPushTokens(_userId: string) { return 0; },
    async deletePushToken() {},
    async getGroupPushTokens(_groupId: string) { return []; },
    async createBroadcast(broadcast: any) { return { id: 1, ...broadcast }; },
    async getDailyChallengeCompletion(_userId: string, _challengeDate: string) { return undefined; },
    async completeDailyChallenge(completion: any) { return { id: 1, ...completion }; },
    async updateUserReminder(userId: string, hour: number, minute: number) {
      const user = _users.get(userId);
      if (!user) throw new Error("User not found");
      user.reminderHour = hour;
      user.reminderMinute = minute;
      return user;
    },
    async getUserByUsername(username: string) {
      for (const [, u] of _users) { if (u.username === username) return u; }
      return undefined;
    },
    async getUserLongestStreak(_userId: string) { return 0; },
    async getUserBestDay(_userId: string) { return undefined; },
    async getGroupMemberTypicalHours(_groupId: string) { return []; },
    async getUserByReferralCode(code: string) {
      for (const [, u] of _users) { if (u.referralCode === code) return u; }
      return undefined;
    },
    async applyReferral() { return { id: 1 }; },
    async getReferralStats(_userId: string) { return { referralCount: 0, referrals: [] }; },
    async getReferralDashboardStats(_userId: string) { return { totalReferrals: 0, premiumConversions: 0, pendingConversions: 0 }; },
    async getReferralLeaderboard() { return []; },
    async getAdminStats() { return { totalUsers: _users.size, premiumUsers: 0, dauToday: 0, totalLogsToday: 0, totalLogsAllTime: _entries.size, activeGroups: _groups.size, avgStreakLength: 0 }; },
    async getGroupWeeklyReport(_groupId: string) {
      return { weekOf: "2026-01-01", totalDeuces: 0, mvp: null, members: [], funnyStats: {} };
    },
    async getGroupLeaderboard(groupId: string) {
      return _members.filter((m) => m.groupId === groupId).map((m) => ({
        userId: m.userId, username: null, profileImageUrl: null, deuceCount: 0, monthlyDeuces: 0, weeklyDeuces: 0, isMvp: false,
      }));
    },

    /* ---- Bingo ops ---- */
    async getBingoCard(userId: string, month: string) {
      return _bingoCards.get(`${userId}:${month}`);
    },
    async deleteBingoCard(cardId: string) {
      for (const [key, card] of _bingoCards) {
        if (card.id === cardId) { _bingoCards.delete(key); break; }
      }
    },
    async createBingoCard(data: any) {
      const card = { id: data.id, userId: data.userId, groupId: data.groupId, month: data.month, squares: data.squares, completedSquares: data.completedSquares ?? [], createdAt: new Date(), updatedAt: new Date() };
      _bingoCards.set(`${data.userId}:${data.month}`, card);
      _bingoId++;
      return card;
    },
    async checkAndUpdateBingoProgress(userId: string, month: string) {
      const card = _bingoCards.get(`${userId}:${month}`);
      if (!card) return { completedSquares: [], hasBlackout: false };
      // Simulate some progress being detected
      const newCompleted = card.completedSquares ?? [];
      card.completedSquares = newCompleted;
      return { completedSquares: newCompleted, hasBlackout: newCompleted.length === 25 };
    },
    async getBingoLeaderboard(groupIds: string[], month: string) {
      // Return basic leaderboard data for all members in the given groups
      const result: any[] = [];
      for (const groupId of groupIds) {
        const groupMembers = _members.filter((m) => m.groupId === groupId);
        for (const m of groupMembers) {
          const user = _users.get(m.userId);
          const card = [..._bingoCards.values()].find(c => c.userId === m.userId && c.month === month);
          result.push({
            userId: m.userId,
            username: user?.username ?? null,
            profileImageUrl: user?.profileImageUrl ?? null,
            completedCount: (card?.completedSquares ?? []).length,
          });
        }
      }
      return result;
    },

    _reset() {
      _users.clear();
      _groups.clear();
      _members = [];
      _entries.clear();
      _bingoCards.clear();
      _memberId = 1;
      _bingoId = 1;
    },
    _seedBingoCard(card: any) {
      _bingoCards.set(`${card.userId}:${card.month}`, { ...card, createdAt: new Date(), updatedAt: new Date() });
    },
  };
});

/* ================================================================
 *  MODULE MOCKS
 * ================================================================ */
vi.mock("../db", () => ({ db: {}, pool: { query: async () => ({}) } }));
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
          res.json({ ok: true, user: { id: user.id, username: user.username } });
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

beforeAll(async () => {
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
  await memStore.updateUserSubscription(userId, "premium", new Date(Date.now() + 365 * 24 * 60 * 60 * 1000));
  return agent;
}

async function getSoloGroupId(username: string): Promise<string> {
  const userId = `dev-${username.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
  const groups = await memStore.getUserGroups(userId);
  return groups[0].id;
}

/* ================================================================
 *  GET /api/bingo/current — get/create bingo card (premium only)
 * ================================================================ */
describe("GET /api/bingo/current", () => {
  it("returns bingo card for premium user with full shape", async () => {
    const alice = await loginAsPremium("alice");
    const res = await alice.get("/api/bingo/current");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("card");
    expect(res.body).toHaveProperty("month");
    expect(res.body).toHaveProperty("completedCount");
    expect(res.body).toHaveProperty("totalCount");
    expect(res.body).toHaveProperty("percentComplete");
    expect(res.body).toHaveProperty("hasBingo");
    expect(res.body).toHaveProperty("hasBlackout");
    expect(res.body.totalCount).toBe(25);
    expect(res.body.completedCount).toBe(0);
    expect(res.body.percentComplete).toBe(0);
  });

  it("returns 403 for free user", async () => {
    const alice = await loginAs("alice");
    const res = await alice.get("/api/bingo/current");
    expect(res.status).toBe(403);
    expect(res.body.upgrade).toBe(true);
  });

  it("returns 401 for unauthenticated user", async () => {
    const res = await supertest(app).get("/api/bingo/current");
    expect(res.status).toBe(401);
  });

  it("creates a new card if none exists for this month", async () => {
    const alice = await loginAsPremium("alice");
    const res = await alice.get("/api/bingo/current");
    expect(res.status).toBe(200);
    expect(res.body.card).toBeDefined();
    expect(res.body.card.squares).toBeDefined();
    expect(Array.isArray(res.body.card.squares)).toBe(true);
    expect(res.body.card.squares.length).toBe(25);
  });

  it("returns same card on second request (idempotent)", async () => {
    const alice = await loginAsPremium("alice");

    const res1 = await alice.get("/api/bingo/current");
    const res2 = await alice.get("/api/bingo/current");

    expect(res1.status).toBe(200);
    expect(res2.status).toBe(200);
    // Same card ID
    expect(res1.body.card.id).toBe(res2.body.card.id);
  });

  it("assigns groupId to card when user is in a group", async () => {
    const alice = await loginAsPremium("alice");
    const groupId = await getSoloGroupId("alice");

    const res = await alice.get("/api/bingo/current");
    expect(res.status).toBe(200);
    expect(res.body.card.groupId).toBe(groupId);
  });

  it("assigns null groupId when user has no groups", async () => {
    // Create alice without any groups by removing her after login
    const alice = await loginAsPremium("alice");
    const aliceId = "dev-alice";
    const groupId = await getSoloGroupId("alice");

    // Remove alice from all her groups
    await memStore.removeGroupMember(aliceId, groupId);

    // Now re-fetch — no groups → groupId should be null
    const res = await alice.get("/api/bingo/current");
    expect(res.status).toBe(200);
    expect(res.body.card.groupId).toBeNull();
  });

  it("regenerates card with deprecated bristol/photo squares", async () => {
    const alice = await loginAsPremium("alice");
    const aliceId = "dev-alice";
    const now = new Date();
    const month = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;

    // Seed a card with a deprecated 'bristol_score' condition_type
    const { v4: uuidv4 } = await import("uuid");
    const oldCardId = uuidv4();
    memStore._seedBingoCard({
      id: oldCardId,
      userId: aliceId,
      groupId: null,
      month,
      squares: [
        { id: 0, title: "Bristol Master", description: "Log your bristol score", condition_type: "bristol_score", condition_value: 5, completed: false },
        ...Array.from({ length: 24 }, (_, i) => ({
          id: i + 1, title: `Challenge ${i + 1}`, description: `Desc ${i + 1}`, condition_type: "monthly_logs", condition_value: 1, completed: false,
        })),
      ],
      completedSquares: [],
    });

    const res = await alice.get("/api/bingo/current");
    expect(res.status).toBe(200);
    // The old card should have been deleted and a new one created
    expect(res.body.card.id).not.toBe(oldCardId);
    // New card should not have deprecated squares
    const hasBristol = res.body.card.squares.some((sq: any) => sq.condition_type === "bristol_score");
    expect(hasBristol).toBe(false);
  });

  it("card month field matches current month format", async () => {
    const alice = await loginAsPremium("alice");
    const res = await alice.get("/api/bingo/current");
    expect(res.status).toBe(200);
    // Should be YYYY-MM format
    expect(res.body.month).toMatch(/^\d{4}-\d{2}$/);
    expect(res.body.card.month).toMatch(/^\d{4}-\d{2}$/);
  });

  it("hasBingo is false when no squares completed", async () => {
    const alice = await loginAsPremium("alice");
    const res = await alice.get("/api/bingo/current");
    expect(res.status).toBe(200);
    expect(res.body.hasBingo).toBe(false);
    expect(res.body.hasBlackout).toBe(false);
  });

  it("hasBingo true when first row is complete", async () => {
    const alice = await loginAsPremium("alice");
    const aliceId = "dev-alice";
    const now = new Date();
    const month = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;

    // Seed a card with first row complete [0,1,2,3,4]
    const { v4: uuidv4 } = await import("uuid");
    memStore._seedBingoCard({
      id: uuidv4(),
      userId: aliceId,
      groupId: null,
      month,
      squares: Array.from({ length: 25 }, (_, i) => ({
        id: i, title: `C${i}`, description: `D${i}`, condition_type: "monthly_logs", condition_value: 1, completed: false,
      })),
      completedSquares: [0, 1, 2, 3, 4],
    });

    const res = await alice.get("/api/bingo/current");
    expect(res.status).toBe(200);
    expect(res.body.hasBingo).toBe(true);
    expect(res.body.completedCount).toBe(5);
    expect(res.body.percentComplete).toBe(20);
  });

  it("hasBlackout true when all 25 squares complete", async () => {
    const alice = await loginAsPremium("alice");
    const aliceId = "dev-alice";
    const now = new Date();
    const month = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;

    const { v4: uuidv4 } = await import("uuid");
    memStore._seedBingoCard({
      id: uuidv4(),
      userId: aliceId,
      groupId: null,
      month,
      squares: Array.from({ length: 25 }, (_, i) => ({
        id: i, title: `C${i}`, description: `D${i}`, condition_type: "monthly_logs", condition_value: 1, completed: true,
      })),
      completedSquares: Array.from({ length: 25 }, (_, i) => i),
    });

    const res = await alice.get("/api/bingo/current");
    expect(res.status).toBe(200);
    expect(res.body.hasBlackout).toBe(true);
    expect(res.body.hasBingo).toBe(true);
    expect(res.body.completedCount).toBe(25);
    expect(res.body.percentComplete).toBe(100);
  });
});

/* ================================================================
 *  POST /api/bingo/check — re-evaluate progress (premium only)
 * ================================================================ */
describe("POST /api/bingo/check", () => {
  it("returns 404 when no bingo card exists this month", async () => {
    const alice = await loginAsPremium("alice");
    const res = await alice.post("/api/bingo/check");
    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/no bingo card/i);
  });

  it("returns updated progress after check when card exists", async () => {
    const alice = await loginAsPremium("alice");
    const aliceId = "dev-alice";
    const now = new Date();
    const month = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;

    const { v4: uuidv4 } = await import("uuid");
    memStore._seedBingoCard({
      id: uuidv4(),
      userId: aliceId,
      groupId: null,
      month,
      squares: Array.from({ length: 25 }, (_, i) => ({ id: i, title: `C${i}`, description: `D${i}`, condition_type: "monthly_logs", condition_value: 1, completed: false })),
      completedSquares: [0, 1, 2],
    });

    const res = await alice.post("/api/bingo/check");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("completedSquares");
    expect(res.body).toHaveProperty("completedCount");
    expect(res.body).toHaveProperty("totalCount");
    expect(res.body).toHaveProperty("percentComplete");
    expect(res.body).toHaveProperty("hasBlackout");
    expect(res.body).toHaveProperty("hasBingo");
    expect(res.body).toHaveProperty("newlyCompleted");
    expect(res.body.totalCount).toBe(25);
  });

  it("returns 403 for free user", async () => {
    const alice = await loginAs("alice");
    const res = await alice.post("/api/bingo/check");
    expect(res.status).toBe(403);
    expect(res.body.upgrade).toBe(true);
  });

  it("returns 401 for unauthenticated user", async () => {
    const res = await supertest(app).post("/api/bingo/check");
    expect(res.status).toBe(401);
  });

  it("newlyCompleted is 0 when no squares newly completed", async () => {
    const alice = await loginAsPremium("alice");
    const aliceId = "dev-alice";
    const now = new Date();
    const month = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;

    const { v4: uuidv4 } = await import("uuid");
    memStore._seedBingoCard({
      id: uuidv4(),
      userId: aliceId,
      groupId: null,
      month,
      squares: Array.from({ length: 25 }, (_, i) => ({ id: i, title: `C${i}`, description: `D${i}`, condition_type: "monthly_logs", condition_value: 1, completed: false })),
      completedSquares: [0, 1, 2], // 3 already completed
    });

    const res = await alice.post("/api/bingo/check");
    expect(res.status).toBe(200);
    // newlyCompleted = checked result length - previous length
    // Since mock returns same completedSquares, newlyCompleted = 0
    expect(res.body.newlyCompleted).toBe(0);
  });

  it("hasBingo is correct after check finds a bingo line", async () => {
    const alice = await loginAsPremium("alice");
    const aliceId = "dev-alice";
    const now = new Date();
    const month = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;

    const { v4: uuidv4 } = await import("uuid");
    memStore._seedBingoCard({
      id: uuidv4(),
      userId: aliceId,
      groupId: null,
      month,
      squares: Array.from({ length: 25 }, (_, i) => ({ id: i, title: `C${i}`, description: `D${i}`, condition_type: "monthly_logs", condition_value: 1, completed: false })),
      completedSquares: [0, 5, 10, 15, 20], // first column complete
    });

    const res = await alice.post("/api/bingo/check");
    expect(res.status).toBe(200);
    expect(res.body.hasBingo).toBe(true);
  });
});

/* ================================================================
 *  GET /api/bingo/leaderboard — group bingo comparison (premium only)
 * ================================================================ */
describe("GET /api/bingo/leaderboard", () => {
  it("returns bingo leaderboard for premium user with month field", async () => {
    const alice = await loginAsPremium("alice");
    const res = await alice.get("/api/bingo/leaderboard");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("month");
    expect(res.body).toHaveProperty("leaderboard");
    expect(Array.isArray(res.body.leaderboard)).toBe(true);
  });

  it("returns leaderboard with completedCount for group members", async () => {
    const alice = await loginAsPremium("alice");
    const aliceId = "dev-alice";
    const now = new Date();
    const month = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;

    // Add Bob to Alice's group and seed some bingo progress
    await loginAs("bob");
    const bobId = "dev-bob";
    const groupId = await getSoloGroupId("alice");
    await memStore.addGroupMember({ groupId, userId: bobId, role: "member" });

    const { v4: uuidv4 } = await import("uuid");
    memStore._seedBingoCard({
      id: uuidv4(),
      userId: aliceId,
      groupId,
      month,
      squares: Array.from({ length: 25 }, (_, i) => ({ id: i, title: `C${i}`, description: `D${i}`, condition_type: "monthly_logs", condition_value: 1, completed: false })),
      completedSquares: [0, 1, 2, 3, 4, 5, 6, 7], // 8 completed
    });

    const res = await alice.get("/api/bingo/leaderboard");
    expect(res.status).toBe(200);
    const aliceEntry = res.body.leaderboard.find((e: any) => e.userId === aliceId);
    expect(aliceEntry).toBeDefined();
    expect(aliceEntry.completedCount).toBe(8);
  });

  it("returns 403 for free user", async () => {
    const alice = await loginAs("alice");
    const res = await alice.get("/api/bingo/leaderboard");
    expect(res.status).toBe(403);
    expect(res.body.upgrade).toBe(true);
  });

  it("returns 401 for unauthenticated user", async () => {
    const res = await supertest(app).get("/api/bingo/leaderboard");
    expect(res.status).toBe(401);
  });

  it("returns month in YYYY-MM format", async () => {
    const alice = await loginAsPremium("alice");
    const res = await alice.get("/api/bingo/leaderboard");
    expect(res.status).toBe(200);
    expect(res.body.month).toMatch(/^\d{4}-\d{2}$/);
  });

  it("returns empty leaderboard when user has no groups", async () => {
    const alice = await loginAsPremium("alice");
    const aliceId = "dev-alice";
    const groupId = await getSoloGroupId("alice");

    // Remove alice from her group
    await memStore.removeGroupMember(aliceId, groupId);

    const res = await alice.get("/api/bingo/leaderboard");
    expect(res.status).toBe(200);
    expect(res.body.leaderboard).toEqual([]);
  });
});

/* ================================================================
 *  checkHasBingo pure logic — via GET /api/bingo/current
 * ================================================================ */
describe("Bingo line detection logic", () => {
  async function seedCardWithCompleted(userId: string, completed: number[]) {
    const now = new Date();
    const month = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
    const { v4: uuidv4 } = await import("uuid");
    memStore._seedBingoCard({
      id: uuidv4(),
      userId,
      groupId: null,
      month,
      squares: Array.from({ length: 25 }, (_, i) => ({ id: i, title: `C${i}`, description: `D${i}`, condition_type: "monthly_logs", condition_value: 1, completed: false })),
      completedSquares: completed,
    });
  }

  it("detects top-left to bottom-right diagonal [0,6,12,18,24]", async () => {
    const alice = await loginAsPremium("alice");
    const aliceId = "dev-alice";
    await seedCardWithCompleted(aliceId, [0, 6, 12, 18, 24]);

    const res = await alice.get("/api/bingo/current");
    expect(res.status).toBe(200);
    expect(res.body.hasBingo).toBe(true);
  });

  it("detects top-right to bottom-left diagonal [4,8,12,16,20]", async () => {
    const alice = await loginAsPremium("alice");
    const aliceId = "dev-alice";
    await seedCardWithCompleted(aliceId, [4, 8, 12, 16, 20]);

    const res = await alice.get("/api/bingo/current");
    expect(res.status).toBe(200);
    expect(res.body.hasBingo).toBe(true);
  });

  it("detects last row bingo [20,21,22,23,24]", async () => {
    const alice = await loginAsPremium("alice");
    const aliceId = "dev-alice";
    await seedCardWithCompleted(aliceId, [20, 21, 22, 23, 24]);

    const res = await alice.get("/api/bingo/current");
    expect(res.status).toBe(200);
    expect(res.body.hasBingo).toBe(true);
  });

  it("detects last column bingo [4,9,14,19,24]", async () => {
    const alice = await loginAsPremium("alice");
    const aliceId = "dev-alice";
    await seedCardWithCompleted(aliceId, [4, 9, 14, 19, 24]);

    const res = await alice.get("/api/bingo/current");
    expect(res.status).toBe(200);
    expect(res.body.hasBingo).toBe(true);
  });

  it("no bingo with only 4 in a row (missing 1)", async () => {
    const alice = await loginAsPremium("alice");
    const aliceId = "dev-alice";
    await seedCardWithCompleted(aliceId, [0, 1, 2, 3]); // missing index 4

    const res = await alice.get("/api/bingo/current");
    expect(res.status).toBe(200);
    expect(res.body.hasBingo).toBe(false);
  });

  it("no bingo with diagonal missing middle [0,6,18,24] without 12", async () => {
    const alice = await loginAsPremium("alice");
    const aliceId = "dev-alice";
    await seedCardWithCompleted(aliceId, [0, 6, 18, 24]); // missing 12

    const res = await alice.get("/api/bingo/current");
    expect(res.status).toBe(200);
    expect(res.body.hasBingo).toBe(false);
  });
});
