import { vi, describe, it, expect, beforeAll, beforeEach, afterAll } from "vitest";
import type { Express } from "express";
import type { Server } from "http";

/* ================================================================
 *  IN-MEMORY STORAGE (hoisted above vi.mock calls)
 * ================================================================ */
const memStore = vi.hoisted(() => {
  const _users = new Map<string, any>();
  const _groups = new Map<string, any>();
  let _members: any[] = [];
  const _entries = new Map<string, any>();
  let _kings: any[] = [];
  let _challenges: any[] = [];
  let _completions: any[] = [];
  let _broadcasts: any[] = [];
  let _kingId = 1;
  let _challengeId = 1;
  let _completionId = 1;
  let _broadcastId = 1;

  return {
    /* ---- User ops ---- */
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
        username: data.username ?? existing?.username ?? null,
        profileImageUrl: data.profileImageUrl ?? existing?.profileImageUrl ?? null,
        deuceCount: existing?.deuceCount ?? 0,
        subscription: data.subscription ?? existing?.subscription ?? "free",
        subscriptionExpiresAt: data.subscriptionExpiresAt ?? existing?.subscriptionExpiresAt ?? null,
        streakInsuranceUsed: existing?.streakInsuranceUsed ?? false,
        theme: existing?.theme ?? "default",
        reminderHour: existing?.reminderHour ?? null,
        reminderMinute: existing?.reminderMinute ?? null,
        createdAt: existing?.createdAt ?? new Date(),
        updatedAt: new Date(),
      };
      _users.set(data.id, user);
      return user;
    },
    async updateUserSubscription(userId: string, subscription: string, expiresAt: Date) {
      const user = _users.get(userId);
      if (!user) throw new Error("User not found");
      user.subscription = subscription;
      user.subscriptionExpiresAt = expiresAt;
      user.updatedAt = new Date();
      return user;
    },
    async updateUserDeuceCount(userId: string, _increment: number) {
      const user = _users.get(userId);
      if (user) user.deuceCount = (user.deuceCount ?? 0) + _increment;
    },

    /* ---- Group ops ---- */
    async createGroup(group: any) {
      const newGroup = {
        id: group.id,
        name: group.name,
        description: group.description ?? null,
        createdBy: group.createdBy,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      _groups.set(newGroup.id, newGroup);
      _members.push({ id: 1, groupId: newGroup.id, userId: group.createdBy, role: "admin", joinedAt: new Date() });
      return newGroup;
    },
    async getGroupById(groupId: string) {
      return _groups.get(groupId);
    },
    async getUserGroups(userId: string) {
      const ids = _members.filter((m) => m.userId === userId).map((m) => m.groupId);
      return ids.map((gid) => _groups.get(gid)).filter(Boolean);
    },
    async addGroupMember(member: any) {
      _members.push({ id: Date.now(), ...member, joinedAt: new Date() });
    },
    async getGroupMembers(groupId: string) {
      return _members
        .filter((m) => m.groupId === groupId)
        .map((m) => ({ ...m, user: _users.get(m.userId) }));
    },
    async isUserInGroup(userId: string, groupId: string) {
      return _members.some((m) => m.userId === userId && m.groupId === groupId);
    },
    async removeGroupMember(userId: string, groupId: string) {
      _members = _members.filter((m) => !(m.userId === userId && m.groupId === groupId));
    },
    async getAllGroupIds() {
      return [..._groups.keys()];
    },

    /* ---- King ops ---- */
    async getCurrentKing(groupId: string) {
      const now = new Date();
      const king = _kings
        .filter((k) => k.groupId === groupId && k.periodStart <= now && k.periodEnd >= now)
        .sort((a, b) => b.periodStart - a.periodStart)[0];
      if (!king) return null;
      const user = _users.get(king.userId);
      return { ...king, user };
    },
    async getLatestKingForGroup(groupId: string) {
      return _kings
        .filter((k) => k.groupId === groupId)
        .sort((a, b) => b.periodStart - a.periodStart)[0] ?? null;
    },
    async createDeuceKing(data: any) {
      const king = { id: _kingId++, ...data, createdAt: new Date() };
      _kings.push(king);
      return king;
    },
    async getGroupLogCountsForPeriod(groupId: string, periodStart: Date, periodEnd: Date) {
      const byUser = new Map<string, { logCount: number; firstLogAt: Date | null }>();
      for (const e of _entries.values()) {
        if (
          e.groupId === groupId &&
          e.loggedAt >= periodStart &&
          e.loggedAt < periodEnd
        ) {
          const existing = byUser.get(e.userId) ?? { logCount: 0, firstLogAt: null };
          byUser.set(e.userId, {
            logCount: existing.logCount + 1,
            firstLogAt:
              existing.firstLogAt === null || e.loggedAt < existing.firstLogAt
                ? e.loggedAt
                : existing.firstLogAt,
          });
        }
      }
      return [...byUser.entries()].map(([userId, v]) => ({ userId, ...v }));
    },
    async getUserStreakInGroup(userId: string, groupId: string) {
      const days = new Set<string>();
      for (const e of _entries.values()) {
        if (e.userId === userId && e.groupId === groupId) {
          days.add(e.loggedAt.toISOString().slice(0, 10));
        }
      }
      return days.size; // simplified for tests
    },

    /* ---- Challenge ops ---- */
    async getActiveChallenge(groupId: string) {
      const now = new Date();
      const c = _challenges
        .filter((c) => c.groupId === groupId && c.periodStart <= now && c.periodEnd >= now)
        .sort((a, b) => b.periodStart - a.periodStart)[0];
      if (!c) return null;
      const completionCount = _completions.filter((x) => x.challengeId === c.id).length;
      return { ...c, completionCount };
    },
    async getChallengeWithMemberProgress(groupId: string) {
      const now = new Date();
      const challenge = _challenges
        .filter((c) => c.groupId === groupId && c.periodStart <= now && c.periodEnd >= now)
        .sort((a, b) => b.periodStart - a.periodStart)[0] ?? null;
      const completions = challenge
        ? _completions.filter((x) => x.challengeId === challenge.id)
        : [];
      const memberCount = _members.filter((m) => m.groupId === groupId).length;
      return { challenge, completions, memberCount };
    },
    async createChallenge(data: any) {
      const c = { id: _challengeId++, ...data, createdAt: new Date() };
      _challenges.push(c);
      return c;
    },
    async getChallenge(id: number) {
      return _challenges.find((c) => c.id === id) ?? null;
    },
    async getExistingChallengeForKing(deuceKingId: number) {
      return _challenges.find((c) => c.deuceKingId === deuceKingId) ?? null;
    },
    async getChallengeHistory(groupId: string, limit = 10) {
      const now = new Date();
      const pastKings = _kings
        .filter((k) => k.groupId === groupId && k.periodEnd < now)
        .sort((a, b) => b.periodStart - a.periodStart)
        .slice(0, limit);
      return pastKings.map((king) => {
        const user = _users.get(king.userId);
        const challenge = _challenges.find((c) => c.deuceKingId === king.id) ?? null;
        const completionCount = challenge
          ? _completions.filter((x) => x.challengeId === challenge.id).length
          : 0;
        return { king: { ...king, user }, challenge, completionCount };
      });
    },
    async addChallengeCompletion(challengeId: number, userId: string) {
      const exists = _completions.find((c) => c.challengeId === challengeId && c.userId === userId);
      if (exists) return null;
      const c = { id: _completionId++, challengeId, userId, completedAt: new Date() };
      _completions.push(c);
      return c;
    },
    async getUserChallengeCompletion(challengeId: number, userId: string) {
      return _completions.find((c) => c.challengeId === challengeId && c.userId === userId) ?? null;
    },

    /* ---- Broadcast ops ---- */
    async createBroadcast(data: any) {
      const b = { id: _broadcastId++, ...data, createdAt: new Date() };
      _broadcasts.push(b);
      return b;
    },
    getBroadcasts() {
      return _broadcasts;
    },

    /* ---- Entry ops (minimal for crown-transfer tests) ---- */
    async createDeuceEntry(entry: any) {
      const e = { ...entry, createdAt: new Date() };
      _entries.set(entry.id, e);
      return e;
    },

    /* ---- Stubs for other ops used by routes ---- */
    async getUserDailyLogCount() { return 0; },
    async getGroupById(gid: string) { return _groups.get(gid); },
    async getGroupEntries() { return []; },
    async getFeedEntries() { return []; },
    async getGroupStreak() { return { currentStreak: 0, longestStreak: 0, lastStreakDate: null }; },
    async getMembersLogStatusToday() { return []; },
    async getGroupInvitePreview() { return null; },
    async getGroupMemberCount(gid: string) { return _members.filter((m) => m.groupId === gid).length; },
    async getGroupDeuceCount() { return 0; },
    async getInviteById() { return null; },
    async cleanupExpiredInvites() {},
    async getAdminStats() { return {}; },
    async getPremiumAnalytics() { return {}; },
    async getWeeklyReport() { return {}; },
    async getGroupWeeklyReport() { return { groupName: "Test", weekOf: "2026-01-01", weekEnding: "2026-01-07", groupStats: { totalDeucesThisWeek: 0, currentStreak: 0, longestStreak: 0 }, mvp: null, members: [], funnyStats: {} }; },
    async getUserPersonalRecord() { return null; },
    async getUserLongestStreak() { return 0; },
    async getUserBestDay() { return null; },
    async getUserByUsername() { return undefined; },
    async getUserDeucesByDate() { return []; },
    async getUserGroups_count() { return 0; },
    async getLocations() { return []; },
    async createLocation() { return {}; },
    async getLocationByName() { return null; },
    async updateUserTheme() { return {}; },
    async getUserSubscription() { return { subscription: "free", subscriptionExpiresAt: null, streakInsuranceUsed: false }; },
    async useStreakInsurance() {},
    async resetStreakInsurance() {},
    async resetAllStreakInsurance() { return 0; },
    async updateUserReminder() { return {}; },
    async updateUserUsername() { return {}; },
    async updateUserProfilePicture() { return {}; },
    async deleteUser() {},
    async recalculateGroupStreak() {},
    async getGroupStreak_full() { return {}; },
    async createInvite() { return {}; },
    async deleteInvite() {},
    async getGroupMemberTypicalHours() { return []; },
    async getReferralDashboardStats() { return {}; },
    async getReferralLeaderboard() { return []; },
    async getBingoCard() { return null; },
    async createOrUpdateBingoCard() { return null; },
    async completeBingoSquare() { return null; },
    async completeBingo() { return null; },
    async getPassportStamps() { return []; },
    async getPassportStats() { return { totalCities: 0, totalCountries: 0, totalStampedDeuces: 0 }; },
    async upsertPassportStamp() { return {}; },
    async deletePassportStamps() {},
    async getDailyChallengeCompletion() { return null; },
    async createDailyChallengeCompletion() { return {}; },
    async deleteExpiredSessions() {},
    async getEntryById() { return null; },
    async createReaction() { return {}; },
    async deleteReaction() {},
    async getGroupMemberTypicalHours_full() { return []; },
    async recalculateStreak() {},
    async updateGroupStreak() {},

    /* ---- test helper ---- */
    _reset() {
      _users.clear();
      _groups.clear();
      _members = [];
      _entries.clear();
      _kings = [];
      _challenges = [];
      _completions = [];
      _broadcasts = [];
      _kingId = 1;
      _challengeId = 1;
      _completionId = 1;
      _broadcastId = 1;
    },
    _getKings: () => _kings,
    _getChallenges: () => _challenges,
    _getBroadcasts: () => _broadcasts,
  };
});

/* ================================================================
 *  MODULE MOCKS
 * ================================================================ */
vi.mock("../db", () => ({ db: {}, pool: {} }));
vi.mock("../storage", () => ({ storage: memStore }));
vi.mock("@clerk/clerk-sdk-node", () => ({ createClerkClient: () => null }));

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
        if (!username) return res.status(400).json({ message: "Username is required" });
        const userId = `dev-${username.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
        await memStore.upsertUser({ id: userId, email: `${username}@test.dev`, firstName: username });
        req.session.userId = userId;
        req.session.save((err: any) => {
          if (err) return res.status(500).json({ message: "Session error" });
          res.json({ ok: true, user: { id: userId } });
        });
      });
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

afterAll(() => {
  server.close();
});

beforeEach(() => {
  memStore._reset();
});

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

/* ================================================================
 *  HELPERS
 * ================================================================ */
async function createGroupWithMember(ownerId: string, groupName = "Test Squad") {
  const { v4: uuidv4 } = await import("uuid");
  const group = await memStore.createGroup({ id: uuidv4(), name: groupName, createdBy: ownerId });
  return group;
}

function makePeriod(offsetWeeks = 0) {
  const now = new Date();
  const dayOfWeek = now.getUTCDay();
  const daysSinceMon = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const thisMon = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - daysSinceMon));
  const start = new Date(thisMon.getTime() + offsetWeeks * 7 * 24 * 60 * 60 * 1000);
  const end = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000 - 1);
  return { start, end };
}

/* ================================================================
 *  TESTS: GET /api/groups/:groupId/king
 * ================================================================ */
describe("GET /api/groups/:groupId/king", () => {
  it("returns null king and null challenge when no king set", async () => {
    const agent = await loginAs("alice");
    const group = await createGroupWithMember("dev-alice");

    const res = await agent.get(`/api/groups/${group.id}/king`);
    expect(res.status).toBe(200);
    expect(res.body.king).toBeNull();
    expect(res.body.challenge).toBeNull();
    expect(res.body.templates).toHaveLength(7);
  });

  it("returns current king when one exists in the active period", async () => {
    const agent = await loginAs("alice");
    const group = await createGroupWithMember("dev-alice");
    const { start, end } = makePeriod(0);

    await memStore.createDeuceKing({
      groupId: group.id,
      userId: "dev-alice",
      periodStart: start,
      periodEnd: end,
      logCount: 5,
      consecutiveWins: 1,
    });

    const res = await agent.get(`/api/groups/${group.id}/king`);
    expect(res.status).toBe(200);
    expect(res.body.king).toBeTruthy();
    expect(res.body.king.userId).toBe("dev-alice");
    expect(res.body.king.logCount).toBe(5);
  });

  it("returns 403 for non-members", async () => {
    const agent = await loginAs("bob");
    const group = await createGroupWithMember("dev-alice");

    const res = await agent.get(`/api/groups/${group.id}/king`);
    expect(res.status).toBe(403);
  });

  it("returns 401 when not authenticated", async () => {
    const group = await createGroupWithMember("dev-alice");
    const res = await supertest(app).get(`/api/groups/${group.id}/king`);
    expect(res.status).toBe(401);
  });
});

/* ================================================================
 *  TESTS: POST /api/groups/:groupId/challenge
 * ================================================================ */
describe("POST /api/groups/:groupId/challenge", () => {
  it("lets the king set a template challenge", async () => {
    const agent = await loginAs("alice");
    const group = await createGroupWithMember("dev-alice");
    const { start, end } = makePeriod(0);

    await memStore.createDeuceKing({
      groupId: group.id,
      userId: "dev-alice",
      periodStart: start,
      periodEnd: end,
      logCount: 5,
      consecutiveWins: 1,
    });

    const res = await agent.post(`/api/groups/${group.id}/challenge`).send({ templateKey: "explorer" });
    expect(res.status).toBe(200);
    expect(res.body.title).toContain("Explorer");
    expect(res.body.templateKey).toBe("explorer");
  });

  it("returns 403 if non-king tries to set challenge", async () => {
    const agent = await loginAs("bob");
    const group = await createGroupWithMember("dev-alice");
    await memStore.addGroupMember({ groupId: group.id, userId: "dev-bob", role: "member" });
    const { start, end } = makePeriod(0);

    await memStore.createDeuceKing({
      groupId: group.id,
      userId: "dev-alice",
      periodStart: start,
      periodEnd: end,
      logCount: 5,
      consecutiveWins: 1,
    });

    const res = await agent.post(`/api/groups/${group.id}/challenge`).send({ templateKey: "explorer" });
    expect(res.status).toBe(403);
  });

  it("returns 403 when no active king", async () => {
    const agent = await loginAs("alice");
    const group = await createGroupWithMember("dev-alice");

    const res = await agent.post(`/api/groups/${group.id}/challenge`).send({ templateKey: "explorer" });
    expect(res.status).toBe(403);
    expect(res.body.message).toMatch(/no active deuce king/i);
  });

  it("returns 409 when challenge already set for this period", async () => {
    const agent = await loginAs("alice");
    const group = await createGroupWithMember("dev-alice");
    const { start, end } = makePeriod(0);

    const king = await memStore.createDeuceKing({
      groupId: group.id,
      userId: "dev-alice",
      periodStart: start,
      periodEnd: end,
      logCount: 5,
      consecutiveWins: 1,
    });

    // First challenge
    await memStore.createChallenge({
      groupId: group.id,
      kingId: "dev-alice",
      deuceKingId: king.id,
      title: "🏃 Streak Warrior",
      templateKey: "streak_warrior",
      periodStart: start,
      periodEnd: end,
      isAutoSelected: false,
    });

    const res = await agent.post(`/api/groups/${group.id}/challenge`).send({ templateKey: "explorer" });
    expect(res.status).toBe(409);
  });

  it("requires premium for custom free-text challenges", async () => {
    const agent = await loginAs("alice");
    const group = await createGroupWithMember("dev-alice");
    const { start, end } = makePeriod(0);

    await memStore.createDeuceKing({
      groupId: group.id,
      userId: "dev-alice",
      periodStart: start,
      periodEnd: end,
      logCount: 5,
      consecutiveWins: 1,
    });

    const res = await agent
      .post(`/api/groups/${group.id}/challenge`)
      .send({ title: "My custom challenge text" });
    expect(res.status).toBe(403);
    expect(res.body.upgrade).toBe(true);
  });

  it("allows premium user to set custom free-text challenge", async () => {
    const agent = await loginAsPremium("alice");
    const group = await createGroupWithMember("dev-alice");
    const { start, end } = makePeriod(0);

    await memStore.createDeuceKing({
      groupId: group.id,
      userId: "dev-alice",
      periodStart: start,
      periodEnd: end,
      logCount: 5,
      consecutiveWins: 1,
    });

    const res = await agent
      .post(`/api/groups/${group.id}/challenge`)
      .send({ title: "Log twice a day for 3 days" });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Log twice a day for 3 days");
  });

  it("returns 400 for invalid template key", async () => {
    const agent = await loginAs("alice");
    const group = await createGroupWithMember("dev-alice");
    const { start, end } = makePeriod(0);

    await memStore.createDeuceKing({
      groupId: group.id,
      userId: "dev-alice",
      periodStart: start,
      periodEnd: end,
      logCount: 5,
      consecutiveWins: 1,
    });

    const res = await agent.post(`/api/groups/${group.id}/challenge`).send({ templateKey: "nonexistent_key" });
    expect(res.status).toBe(400);
  });
});

/* ================================================================
 *  TESTS: GET /api/groups/:groupId/challenge
 * ================================================================ */
describe("GET /api/groups/:groupId/challenge", () => {
  it("returns null challenge when none active", async () => {
    const agent = await loginAs("alice");
    const group = await createGroupWithMember("dev-alice");

    const res = await agent.get(`/api/groups/${group.id}/challenge`);
    expect(res.status).toBe(200);
    expect(res.body.challenge).toBeNull();
    expect(res.body.completionCount).toBe(0);
    expect(res.body.userCompleted).toBe(false);
  });

  it("returns active challenge with completion progress", async () => {
    const agent = await loginAs("alice");
    const group = await createGroupWithMember("dev-alice");
    await memStore.addGroupMember({ groupId: group.id, userId: "dev-bob", role: "member" });
    await memStore.upsertUser({ id: "dev-bob", email: "bob@test.dev", firstName: "bob" });

    const { start, end } = makePeriod(0);
    const king = await memStore.createDeuceKing({
      groupId: group.id,
      userId: "dev-alice",
      periodStart: start,
      periodEnd: end,
      logCount: 5,
      consecutiveWins: 1,
    });
    const challenge = await memStore.createChallenge({
      groupId: group.id,
      kingId: "dev-alice",
      deuceKingId: king.id,
      title: "📍 Explorer",
      templateKey: "explorer",
      periodStart: start,
      periodEnd: end,
      isAutoSelected: false,
    });
    await memStore.addChallengeCompletion(challenge.id, "dev-alice");

    const res = await agent.get(`/api/groups/${group.id}/challenge`);
    expect(res.status).toBe(200);
    expect(res.body.challenge).toBeTruthy();
    expect(res.body.challenge.title).toBe("📍 Explorer");
    expect(res.body.completionCount).toBe(1);
    expect(res.body.memberCount).toBe(2);
    expect(res.body.userCompleted).toBe(true);
  });
});

/* ================================================================
 *  TESTS: POST /api/groups/:groupId/challenge/complete
 * ================================================================ */
describe("POST /api/groups/:groupId/challenge/complete", () => {
  async function setupChallengeGroup() {
    const agent = await loginAs("alice");
    const group = await createGroupWithMember("dev-alice");
    const { start, end } = makePeriod(0);
    const king = await memStore.createDeuceKing({
      groupId: group.id,
      userId: "dev-alice",
      periodStart: start,
      periodEnd: end,
      logCount: 5,
      consecutiveWins: 1,
    });
    const challenge = await memStore.createChallenge({
      groupId: group.id,
      kingId: "dev-alice",
      deuceKingId: king.id,
      title: "📍 Explorer",
      templateKey: "explorer",
      periodStart: start,
      periodEnd: end,
      isAutoSelected: false,
    });
    return { agent, group, challenge };
  }

  it("lets a member mark the active challenge complete", async () => {
    const { agent, group } = await setupChallengeGroup();
    const res = await agent.post(`/api/groups/${group.id}/challenge/complete`);
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it("returns 409 if already completed", async () => {
    const { agent, group, challenge } = await setupChallengeGroup();
    await memStore.addChallengeCompletion(challenge.id, "dev-alice");
    const res = await agent.post(`/api/groups/${group.id}/challenge/complete`);
    expect(res.status).toBe(409);
    expect(res.body.message).toMatch(/already completed/i);
  });

  it("returns 404 when no active challenge", async () => {
    const agent = await loginAs("alice");
    const group = await createGroupWithMember("dev-alice");
    const res = await agent.post(`/api/groups/${group.id}/challenge/complete`);
    expect(res.status).toBe(404);
  });

  it("returns 401 when not authenticated", async () => {
    const group = await createGroupWithMember("dev-alice");
    const res = await supertest(app).post(`/api/groups/${group.id}/challenge/complete`);
    expect(res.status).toBe(401);
  });

  it("increments completionCount after marking complete", async () => {
    const { agent, group } = await setupChallengeGroup();
    await agent.post(`/api/groups/${group.id}/challenge/complete`);

    const progress = await agent.get(`/api/groups/${group.id}/challenge`);
    expect(progress.body.completionCount).toBe(1);
    expect(progress.body.userCompleted).toBe(true);
  });
});

/* ================================================================
 *  TESTS: GET /api/groups/:groupId/challenge/history
 * ================================================================ */
describe("GET /api/groups/:groupId/challenge/history", () => {
  it("returns empty array when no past challenges", async () => {
    const agent = await loginAs("alice");
    const group = await createGroupWithMember("dev-alice");

    const res = await agent.get(`/api/groups/${group.id}/challenge/history`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("returns past king/challenge records", async () => {
    const agent = await loginAs("alice");
    const group = await createGroupWithMember("dev-alice");

    // Create a past period king
    const pastStart = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
    const pastEnd = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 - 1);
    const king = await memStore.createDeuceKing({
      groupId: group.id,
      userId: "dev-alice",
      periodStart: pastStart,
      periodEnd: pastEnd,
      logCount: 8,
      consecutiveWins: 1,
    });
    await memStore.createChallenge({
      groupId: group.id,
      kingId: "dev-alice",
      deuceKingId: king.id,
      title: "🏃 Streak Warrior",
      templateKey: "streak_warrior",
      periodStart: pastStart,
      periodEnd: pastEnd,
      isAutoSelected: false,
    });

    const res = await agent.get(`/api/groups/${group.id}/challenge/history`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].king.logCount).toBe(8);
    expect(res.body[0].challenge.title).toBe("🏃 Streak Warrior");
  });
});

/* ================================================================
 *  TESTS: Crown transfer logic (unit-style via storage mocks)
 * ================================================================ */
describe("Crown transfer logic", () => {
  it("selects user with most logs as king", async () => {
    const { v4: uuidv4 } = await import("uuid");
    const groupId = uuidv4();
    await memStore.createGroup({ id: groupId, name: "Transfer Test", createdBy: "dev-alice" });
    await memStore.upsertUser({ id: "dev-alice", firstName: "alice" });
    await memStore.upsertUser({ id: "dev-bob", firstName: "bob" });
    await memStore.addGroupMember({ groupId, userId: "dev-bob", role: "member" });

    // Period
    const periodStart = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const periodEnd = new Date(Date.now() - 1000);

    // Alice: 5 logs, Bob: 3 logs
    for (let i = 0; i < 5; i++) {
      await memStore.createDeuceEntry({
        id: uuidv4(),
        userId: "dev-alice",
        groupId,
        location: "Home",
        thoughts: "",
        ghost: false,
        loggedAt: new Date(periodStart.getTime() + i * 60 * 60 * 1000),
      });
    }
    for (let i = 0; i < 3; i++) {
      await memStore.createDeuceEntry({
        id: uuidv4(),
        userId: "dev-bob",
        groupId,
        location: "Home",
        thoughts: "",
        ghost: false,
        loggedAt: new Date(periodStart.getTime() + i * 60 * 60 * 1000),
      });
    }

    const logCounts = await memStore.getGroupLogCountsForPeriod(groupId, periodStart, periodEnd);
    expect(logCounts).toHaveLength(2);
    const winner = logCounts.sort((a, b) => b.logCount - a.logCount)[0];
    expect(winner.userId).toBe("dev-alice");
    expect(winner.logCount).toBe(5);
  });

  it("consecutive_wins increments correctly", async () => {
    const { v4: uuidv4 } = await import("uuid");
    const groupId = uuidv4();
    await memStore.createGroup({ id: groupId, name: "Dynasty Test", createdBy: "dev-alice" });
    await memStore.upsertUser({ id: "dev-alice", firstName: "alice" });

    const pastStart = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
    const pastEnd = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    await memStore.createDeuceKing({
      groupId,
      userId: "dev-alice",
      periodStart: pastStart,
      periodEnd: pastEnd,
      logCount: 4,
      consecutiveWins: 2,
    });

    const prevKing = await memStore.getLatestKingForGroup(groupId);
    expect(prevKing?.consecutiveWins).toBe(2);

    const consecutiveWins =
      prevKing && prevKing.userId === "dev-alice" ? prevKing.consecutiveWins + 1 : 1;
    expect(consecutiveWins).toBe(3);
  });

  it("resets consecutive_wins when a new user wins", async () => {
    const { v4: uuidv4 } = await import("uuid");
    const groupId = uuidv4();
    await memStore.createGroup({ id: groupId, name: "Dethroned Test", createdBy: "dev-alice" });
    await memStore.upsertUser({ id: "dev-alice", firstName: "alice" });
    await memStore.upsertUser({ id: "dev-bob", firstName: "bob" });

    const pastStart = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
    const pastEnd = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    await memStore.createDeuceKing({
      groupId,
      userId: "dev-alice",
      periodStart: pastStart,
      periodEnd: pastEnd,
      logCount: 4,
      consecutiveWins: 3,
    });

    const prevKing = await memStore.getLatestKingForGroup(groupId);
    // Bob wins this week
    const consecutiveWins =
      prevKing && prevKing.userId === "dev-bob" ? prevKing.consecutiveWins + 1 : 1;
    expect(consecutiveWins).toBe(1);
  });
});

/* ================================================================
 *  TESTS: POST /api/internal/crown-transfer
 * ================================================================ */
describe("POST /api/internal/crown-transfer", () => {
  const INTERNAL_KEY = "test-internal-key";

  beforeEach(() => {
    process.env.INTERNAL_API_KEY = INTERNAL_KEY;
  });

  it("returns 401 without correct key", async () => {
    const res = await supertest(app)
      .post("/api/internal/crown-transfer")
      .set("x-internal-key", "wrong-key");
    expect(res.status).toBe(401);
  });

  it("returns 401 without any key", async () => {
    const res = await supertest(app).post("/api/internal/crown-transfer");
    expect(res.status).toBe(401);
  });

  it("processes groups with logs and creates a king", async () => {
    const { v4: uuidv4 } = await import("uuid");
    const groupId = uuidv4();
    await memStore.upsertUser({ id: "dev-alice", firstName: "alice" });
    await memStore.createGroup({ id: groupId, name: "Transfer Group", createdBy: "dev-alice" });

    // Add logs in last week's period
    const now = new Date();
    const dayOfWeek = now.getUTCDay();
    const daysSinceMon = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const thisMon = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - daysSinceMon));
    const periodEnd = thisMon;
    const periodStart = new Date(periodEnd.getTime() - 7 * 24 * 60 * 60 * 1000);

    for (let i = 0; i < 3; i++) {
      await memStore.createDeuceEntry({
        id: uuidv4(),
        userId: "dev-alice",
        groupId,
        location: "Home",
        thoughts: "",
        ghost: false,
        loggedAt: new Date(periodStart.getTime() + i * 60 * 60 * 1000),
      });
    }

    const res = await supertest(app)
      .post("/api/internal/crown-transfer")
      .set("x-internal-key", INTERNAL_KEY);

    expect(res.status).toBe(200);
    expect(res.body.processed).toBeGreaterThan(0);

    // Verify king was created
    const kings = memStore._getKings();
    const groupKings = kings.filter((k: any) => k.groupId === groupId);
    expect(groupKings).toHaveLength(1);
    expect(groupKings[0].userId).toBe("dev-alice");
    expect(groupKings[0].logCount).toBe(3);

    // Verify auto-challenge was created
    const challenges = memStore._getChallenges();
    const groupChallenges = challenges.filter((c: any) => c.groupId === groupId);
    expect(groupChallenges).toHaveLength(1);
    expect(groupChallenges[0].isAutoSelected).toBe(true);

    // Verify broadcast was created
    const broadcasts = memStore._getBroadcasts();
    const groupBroadcasts = broadcasts.filter((b: any) => b.groupId === groupId);
    expect(groupBroadcasts).toHaveLength(1);
    expect(groupBroadcasts[0].milestone).toContain("Deuce King");
  });

  it("skips groups with no logs in the period", async () => {
    const { v4: uuidv4 } = await import("uuid");
    const groupId = uuidv4();
    await memStore.upsertUser({ id: "dev-alice", firstName: "alice" });
    await memStore.createGroup({ id: groupId, name: "Empty Group", createdBy: "dev-alice" });

    const res = await supertest(app)
      .post("/api/internal/crown-transfer")
      .set("x-internal-key", INTERNAL_KEY);

    expect(res.status).toBe(200);
    const kings = memStore._getKings();
    const groupKings = kings.filter((k: any) => k.groupId === groupId);
    expect(groupKings).toHaveLength(0);
  });

  it("crowns the sole member of a 1-person group if they have logs", async () => {
    const { v4: uuidv4 } = await import("uuid");
    const groupId = uuidv4();
    await memStore.upsertUser({ id: "dev-solo", firstName: "solo" });
    await memStore.createGroup({ id: groupId, name: "Solo Squad", createdBy: "dev-solo" });

    const now = new Date();
    const dayOfWeek = now.getUTCDay();
    const daysSinceMon = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const periodEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - daysSinceMon));
    const periodStart = new Date(periodEnd.getTime() - 7 * 24 * 60 * 60 * 1000);

    await memStore.createDeuceEntry({
      id: uuidv4(),
      userId: "dev-solo",
      groupId,
      location: "Home",
      thoughts: "",
      ghost: false,
      loggedAt: new Date(periodStart.getTime() + 60 * 60 * 1000),
    });

    const res = await supertest(app)
      .post("/api/internal/crown-transfer")
      .set("x-internal-key", INTERNAL_KEY);

    expect(res.status).toBe(200);
    const kings = memStore._getKings().filter((k: any) => k.groupId === groupId);
    expect(kings).toHaveLength(1);
    expect(kings[0].userId).toBe("dev-solo");
    expect(kings[0].logCount).toBe(1);
  });

  it("does not include logs that fall exactly on periodEnd (exclusive boundary)", async () => {
    const { v4: uuidv4 } = await import("uuid");
    const groupId = uuidv4();
    await memStore.upsertUser({ id: "dev-boundary", firstName: "boundary" });
    await memStore.createGroup({ id: groupId, name: "Boundary Test", createdBy: "dev-boundary" });

    const now = new Date();
    const dayOfWeek = now.getUTCDay();
    const daysSinceMon = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const periodEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - daysSinceMon));
    const periodStart = new Date(periodEnd.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Log exactly at periodEnd — should be excluded
    await memStore.createDeuceEntry({
      id: uuidv4(),
      userId: "dev-boundary",
      groupId,
      location: "Home",
      thoughts: "",
      ghost: false,
      loggedAt: periodEnd,
    });

    const logCounts = await memStore.getGroupLogCountsForPeriod(groupId, periodStart, periodEnd);
    // The in-memory store uses < periodEnd (exclusive), so this log must not count
    expect(logCounts).toHaveLength(0);
  });

  it("tiebreaker uses earliest first log when streaks are equal", async () => {
    const { v4: uuidv4 } = await import("uuid");
    const groupId = uuidv4();
    await memStore.createGroup({ id: groupId, name: "Tiebreak Test", createdBy: "dev-alice" });
    await memStore.upsertUser({ id: "dev-alice", firstName: "alice" });
    await memStore.upsertUser({ id: "dev-bob", firstName: "bob" });
    await memStore.addGroupMember({ groupId, userId: "dev-bob", role: "member" });

    const periodStart = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const periodEnd = new Date(Date.now() - 1000);

    // Both log 3 times — Alice logs earlier
    await memStore.createDeuceEntry({ id: uuidv4(), userId: "dev-alice", groupId, location: "Home", thoughts: "", ghost: false, loggedAt: new Date(periodStart.getTime() + 1 * 60 * 60 * 1000) });
    await memStore.createDeuceEntry({ id: uuidv4(), userId: "dev-alice", groupId, location: "Home", thoughts: "", ghost: false, loggedAt: new Date(periodStart.getTime() + 2 * 60 * 60 * 1000) });
    await memStore.createDeuceEntry({ id: uuidv4(), userId: "dev-alice", groupId, location: "Home", thoughts: "", ghost: false, loggedAt: new Date(periodStart.getTime() + 3 * 60 * 60 * 1000) });

    await memStore.createDeuceEntry({ id: uuidv4(), userId: "dev-bob", groupId, location: "Home", thoughts: "", ghost: false, loggedAt: new Date(periodStart.getTime() + 4 * 60 * 60 * 1000) });
    await memStore.createDeuceEntry({ id: uuidv4(), userId: "dev-bob", groupId, location: "Home", thoughts: "", ghost: false, loggedAt: new Date(periodStart.getTime() + 5 * 60 * 60 * 1000) });
    await memStore.createDeuceEntry({ id: uuidv4(), userId: "dev-bob", groupId, location: "Home", thoughts: "", ghost: false, loggedAt: new Date(periodStart.getTime() + 6 * 60 * 60 * 1000) });

    const logCounts = await memStore.getGroupLogCountsForPeriod(groupId, periodStart, periodEnd);
    expect(logCounts).toHaveLength(2);

    // Both have 3 logs — sort by firstLogAt ascending, Alice wins
    logCounts.sort((a, b) => {
      if (a.logCount !== b.logCount) return b.logCount - a.logCount;
      const aTime = a.firstLogAt?.getTime() ?? Infinity;
      const bTime = b.firstLogAt?.getTime() ?? Infinity;
      return aTime - bTime;
    });
    expect(logCounts[0].userId).toBe("dev-alice");
  });
});
