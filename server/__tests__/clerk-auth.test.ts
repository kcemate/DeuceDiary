/**
 * clerk-auth.test.ts
 *
 * Integration tests for the Clerk JWT auth flow.
 *
 * Strategy: mock ../replitAuth so that clerkEnabled=true and clerk.verifyToken
 * is a vi.fn() we can control per-test. The rest of the stack (routes, storage)
 * uses the real in-memory storage mock, mirroring the other test files.
 *
 * Scenarios tested:
 *  1. New user signs in (valid JWT, user absent from DB)
 *       → user auto-created in DB
 *       → Solo Deuces group auto-created
 *       → can immediately log a deuce
 *  2. Existing user signs in (valid JWT, user already in DB)
 *       → returns existing profile (no duplicates)
 *  3. Invalid / expired token → 401
 *  4. Missing Authorization header → 401
 */

import { vi, describe, it, expect, beforeAll, beforeEach, afterAll } from "vitest";
import type { Express } from "express";
import type { Server } from "http";

/* ================================================================
 *  IN-MEMORY STORAGE  (hoisted)
 * ================================================================ */
const memStore = vi.hoisted(() => {
  const _users = new Map<string, any>();
  const _groups = new Map<string, any>();
  let _members: any[] = [];
  const _entries = new Map<string, any>();
  let _locations: any[] = [];
  let _reactions: any[] = [];
  let _broadcasts: any[] = [];
  let _challengeCompletions: any[] = [];
  let _memberId = 1;
  let _locationId = 1;
  let _reactionId = 1;
  let _broadcastId = 1;
  let _challengeId = 1;

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
      return { subscription: user?.subscription ?? "free", subscriptionExpiresAt: null, streakInsuranceUsed: false };
    },
    async updateUserSubscription(userId: string, sub: string, exp: Date) {
      const user = _users.get(userId);
      if (user) { user.subscription = sub; user.subscriptionExpiresAt = exp; }
      return user;
    },
    async useStreakInsurance(userId: string) {
      const user = _users.get(userId);
      if (user) user.streakInsuranceUsed = true;
    },
    async resetStreakInsurance(userId: string) {
      const user = _users.get(userId);
      if (user) user.streakInsuranceUsed = false;
    },
    async resetAllStreakInsurance() { return 0; },
    async getPremiumAnalytics(_userId: string) {
      return { totalDeuces: 0, avgPerWeek: 0, longestStreak: 0, currentStreak: 0, bestDay: { day: "Monday", count: 0 }, groupRankings: [] };
    },
    async getWeeklyReport(_userId: string) {
      return { totalDeuces: 0, peakDay: { date: "2026-01-01", count: 0 }, mostActiveSquad: { name: "None", count: 0 }, longestStreak: 0, funniestEntry: null, totalReactionsReceived: 0, weekOf: "2026-01-01" };
    },
    async getUserByUsername(username: string) {
      return [..._users.values()].find((u) => u.username === username);
    },

    /* ---- Groups ---- */
    async createGroup(group: any) {
      const g = { id: group.id, name: group.name, description: group.description ?? null, createdBy: group.createdBy, createdAt: new Date(), updatedAt: new Date() };
      _groups.set(g.id, g);
      _members.push({ id: _memberId++, groupId: g.id, userId: group.createdBy, role: "admin", joinedAt: new Date() });
      return g;
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
      return _members.filter((m) => m.groupId === groupId).map((m) => ({ ...m, user: _users.get(m.userId)! }));
    },
    async isUserInGroup(userId: string, groupId: string) {
      return _members.some((m) => m.userId === userId && m.groupId === groupId);
    },
    async removeGroupMember(userId: string, groupId: string) {
      _members = _members.filter((m) => !(m.userId === userId && m.groupId === groupId));
    },
    async getGroupMemberRole(_groupId: string, _userId: string) {
      const m = _members.find((m) => m.groupId === _groupId && m.userId === _userId);
      return m?.role ?? null;
    },
    async deleteGroup(_id: string) {},
    async updateGroup(_id: string, _data: any) {},
    async getGroupInvites(_id: string) { return []; },
    async getGroupWithMemberCount(groupId: string) {
      const g = _groups.get(groupId);
      if (!g) return undefined;
      return { ...g, memberCount: _members.filter((m) => m.groupId === groupId).length };
    },

    /* ---- Deuces ---- */
    async createDeuceEntry(entry: any) {
      const e = { id: entry.id, userId: entry.userId, groupId: entry.groupId, location: entry.location, thoughts: entry.thoughts, ghost: entry.ghost ?? false, loggedAt: entry.loggedAt, bristolScore: entry.bristolScore ?? null, photoUrl: entry.photoUrl ?? null, createdAt: new Date() };
      _entries.set(e.id, e);
      return e;
    },
    async getUserDailyLogCount(userId: string, dateUTC: string) {
      const start = new Date(`${dateUTC}T00:00:00.000Z`);
      const end = new Date(`${dateUTC}T23:59:59.999Z`);
      return [..._entries.values()].filter((e) => e.userId === userId && e.createdAt >= start && e.createdAt <= end).length;
    },
    async getGroupEntries(groupId: string) {
      return [..._entries.values()].filter((e) => e.groupId === groupId).map((e) => ({ ...e, user: _users.get(e.userId)! }));
    },
    async getUserDeucesByDate(userId: string) { return []; },
    async getEntryById(entryId: string) { return _entries.get(entryId); },
    async getFeedEntries(groupIds: string[], limit: number) {
      return [..._entries.values()].filter((e) => groupIds.includes(e.groupId)).slice(0, limit).map((e) => ({ ...e, user: _users.get(e.userId), reactions: [] }));
    },
    async deleteDeuceEntry(entryId: string) { _entries.delete(entryId); },

    /* ---- Invites ---- */
    async createInvite(invite: any) {
      const inv = { id: invite.id, groupId: invite.groupId, createdBy: invite.createdBy, expiresAt: invite.expiresAt, createdAt: new Date() };
      const _invites = new Map<string, any>();
      _invites.set(inv.id, inv);
      return inv;
    },
    async getInviteById(_id: string) { return undefined; },
    async deleteInvite(_id: string) {},
    async cleanupExpiredInvites() {},

    /* ---- Locations ---- */
    async getLocations() { return _locations; },
    async getLocationsForUser(userId: string) {
      return _locations.filter((l) => l.isDefault === true || l.createdBy === userId);
    },
    async createLocation(loc: any) {
      const l = { id: _locationId++, name: loc.name, isDefault: loc.isDefault ?? false, createdBy: loc.createdBy ?? null, createdAt: new Date() };
      _locations.push(l);
      return l;
    },
    async getLocationByName(name: string) { return _locations.find((l) => l.name === name); },

    /* ---- Personal records ---- */
    async getUserPersonalRecord(_userId: string) { return undefined; },

    /* ---- Streaks ---- */
    async getGroupStreak(_id: string) { return { currentStreak: 0, longestStreak: 0, lastStreakDate: null }; },
    async getGroupStreaksBatch(groupIds: string[]) {
      const map = new Map<string, { currentStreak: number; longestStreak: number; lastStreakDate: string | null }>();
      for (const id of groupIds) {
        map.set(id, await this.getGroupStreak(id));
      }
      return map;
    },
    async updateGroupStreak(_id: string, _c: number, _l: number, _d: string) {},
    async resetGroupStreak() {},
    async getMembersLogStatusToday(groupId: string, _today: string) {
      return _members.filter((m) => m.groupId === groupId).map((m) => ({ userId: m.userId, username: null, firstName: null, profileImageUrl: null, hasLogged: false }));
    },

    /* ---- Reactions ---- */
    async addReaction(reaction: any) {
      const r = { id: _reactionId++, ...reaction, createdAt: new Date() };
      _reactions.push(r);
      return r;
    },
    async removeReaction(userId: string, entryId: string, emoji: string) {
      _reactions = _reactions.filter((r) => !(r.userId === userId && r.entryId === entryId && r.emoji === emoji));
    },
    async getEntryReactions(entryId: string) { return _reactions.filter((r) => r.entryId === entryId); },

    /* ---- Notifications ---- */
    async registerPushToken(_u: string, _t: string, _p: string) {},
    async deletePushToken(_u: string, _t: string) {},
    async getUserPushTokens(_u: string) { return []; },
    async getGroupPushTokens(_g: string) { return []; },
    async getAllPushTokens() { return []; },
    async setReminderTime(_u: string, _h: number, _m: number) {},

    /* ---- Broadcasts ---- */
    async createBroadcast(b: any) { const br = { id: _broadcastId++, ...b, createdAt: new Date() }; _broadcasts.push(br); return br; },
    async getRecentBroadcasts(_g: string) { return []; },

    /* ---- Challenges ---- */
    async getChallengeCompletion(_u: string, _d: string) { return null; },
    async createChallengeCompletion(c: any) { const ch = { id: _challengeId++, ...c, createdAt: new Date() }; _challengeCompletions.push(ch); return ch; },
    async getGroupChallengeCompletions(_g: string, _d: string) { return []; },
    async getBingoCard(_u: string, _m: string) { return null; },
    async upsertBingoCard(_d: any) { return { id: 1, userId: "", month: "", completedSquares: [], createdAt: new Date(), updatedAt: new Date() }; },
    async getBingoLeaderboard(_g: string[], _m: string) { return []; },

    /* ---- Referrals ---- */
    async getUserReferralCode(userId: string) { return _users.get(userId)?.referralCode ?? null; },
    async applyReferralCode(_u: string, _c: string) {},
    async getReferralStats(_u: string) { return { referralCount: 0, referrals: [] }; },
    async getReferralLeaderboard() { return []; },

    /* ---- Weekly report ---- */
    async getGroupWeeklyReport(_id: string) { return { totalDeuces: 0, mvp: null, memberStats: [], funnyStats: { longestGap: null, mostReactionsReceived: null, funniestEntry: null } }; },
    async getGroupMemberTypicalHours(_id: string) { return []; },

    /* ---- Reset ---- */
    _reset() {
      _users.clear(); _groups.clear(); _members = []; _entries.clear();
      _locations = []; _reactions = []; _broadcasts = []; _challengeCompletions = [];
      _memberId = 1; _locationId = 1; _reactionId = 1; _broadcastId = 1; _challengeId = 1;
    },

    /* helpers for test inspection */
    _users: () => _users,
    _groups: () => _groups,
    _members: () => _members,
  };
});

/* ================================================================
 *  Controllable mock for clerk.verifyToken
 * ================================================================ */
const mockVerifyToken = vi.hoisted(() => vi.fn<(token: string) => Promise<any>>());

/* ================================================================
 *  MODULE MOCKS
 * ================================================================ */
vi.mock("../db", () => ({ db: {}, pool: {} }));
vi.mock("../storage", () => ({ storage: memStore }));
vi.mock("@clerk/clerk-sdk-node", () => ({
  createClerkClient: () => ({ verifyToken: mockVerifyToken }),
}));

vi.mock("../replitAuth", async () => {
  // Re-implement replitAuth with clerkEnabled=true, using our controllable mock
  return {
    clerkEnabled: true,
    clerk: { verifyToken: mockVerifyToken },

    getSession: () => {
      // No session needed in Clerk mode — return a no-op middleware
      return (_req: any, _res: any, next: any) => next();
    },

    setupAuth: async (app: any) => {
      // In Clerk mode, setupAuth just mounts the session (no dev login routes)
      const sessionMod = await import("express-session");
      const session = sessionMod.default;
      app.use(session({ secret: "test-secret", resave: false, saveUninitialized: false }));
    },

    isAuthenticated: async (req: any, res: any, next: any) => {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const token = authHeader.split(" ")[1];
      let payload: any;
      try {
        payload = await mockVerifyToken(token);
      } catch (_err) {
        return res.status(401).json({ message: "Invalid token" });
      }

      // Auto-create user if not in DB (mirrors replitAuth.ts behaviour)
      let user = await memStore.getUser(payload.sub);
      if (!user) {
        user = await memStore.upsertUser({
          id: payload.sub,
          email: payload.email ?? null,
          firstName: payload.first_name ?? null,
          lastName: payload.last_name ?? null,
          profileImageUrl: payload.image_url ?? null,
        });

        // Auto-create Solo Deuces
        const groups = await memStore.getUserGroups(payload.sub);
        if (groups.length === 0) {
          const { v4: uuidv4 } = await import("uuid");
          await memStore.createGroup({
            id: uuidv4(),
            name: "Solo Deuces",
            description: "Your personal throne log",
            createdBy: payload.sub,
          });
        }
      }

      req.user = user;
      next();
    },
  };
});

/* ================================================================
 *  IMPORTS  (after mocks)
 * ================================================================ */
import express from "express";
import supertest from "supertest";
import { registerRoutes } from "../routes";

/* ================================================================
 *  SETUP
 * ================================================================ */
let app: Express;
let server: Server;

beforeAll(async () => {
  process.env.ADMIN_KEY = "test-admin-key";
  process.env.INTERNAL_API_KEY = "test-internal-key";
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
  mockVerifyToken.mockReset();
});

/** Make a supertest agent pre-loaded with a Bearer token */
function withToken(token: string) {
  return supertest.agent(app).set("Authorization", `Bearer ${token}`);
}

/* ================================================================
 *  HELPERS
 * ================================================================ */
/** Seed a valid Clerk JWT payload for mockVerifyToken */
function mockValidToken(userId: string, overrides: Record<string, any> = {}) {
  const payload = {
    sub: userId,
    email: `${userId}@example.com`,
    first_name: "Test",
    last_name: "User",
    image_url: null,
    ...overrides,
  };
  mockVerifyToken.mockResolvedValueOnce(payload);
  return payload;
}

/* ================================================================
 *  TESTS
 * ================================================================ */

describe("Clerk auth — missing / malformed token", () => {
  it("returns 401 when Authorization header is missing", async () => {
    const res = await supertest(app).get("/api/auth/user");
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/unauthorized/i);
  });

  it("returns 401 when Authorization header lacks 'Bearer ' prefix", async () => {
    const res = await supertest(app)
      .get("/api/auth/user")
      .set("Authorization", "Token some-bad-token");
    expect(res.status).toBe(401);
  });

  it("returns 401 when verifyToken throws (expired/invalid token)", async () => {
    mockVerifyToken.mockRejectedValueOnce(new Error("JWT expired"));
    const res = await withToken("expired.token.here").get("/api/auth/user");
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/invalid token/i);
  });

  it("returns 401 for a structurally-invalid token string", async () => {
    mockVerifyToken.mockRejectedValueOnce(new Error("invalid signature"));
    const res = await withToken("not-a-real-jwt").get("/api/auth/user");
    expect(res.status).toBe(401);
  });
});

describe("Clerk auth — new user sign-in", () => {
  it("auto-creates user in DB on first sign-in", async () => {
    const userId = "clerk_new_user_001";
    mockValidToken(userId);

    const res = await withToken("valid.token.001").get("/api/auth/user");
    expect(res.status).toBe(200);

    // User should now exist in the store
    const user = await memStore.getUser(userId);
    expect(user).toBeDefined();
    expect(user!.id).toBe(userId);
  });

  it("auto-creates a 'Solo Deuces' group for the new user", async () => {
    const userId = "clerk_new_user_002";
    mockValidToken(userId);

    await withToken("valid.token.002").get("/api/auth/user");

    const groups = await memStore.getUserGroups(userId);
    expect(groups.length).toBeGreaterThanOrEqual(1);
    const solo = groups.find((g: any) => g.name === "Solo Deuces");
    expect(solo).toBeDefined();
  });

  it("new user can immediately log a deuce after sign-in", async () => {
    const userId = "clerk_new_user_003";

    // First request triggers auto-creation
    mockValidToken(userId);
    await withToken("token.003").get("/api/auth/user");

    // Get their group
    const groups = await memStore.getUserGroups(userId);
    const soloGroupId = groups[0].id;

    // Now log a deuce
    mockValidToken(userId);
    const res = await withToken("token.003b")
      .post("/api/deuces")
      .send({
        groupIds: [soloGroupId],
        location: "Work bathroom",
        loggedAt: new Date().toISOString(),
      });
    expect(res.status).toBe(200);
    expect(res.body.entries).toHaveLength(1);
  });

  it("new user's profile has username=null initially (triggers onboarding)", async () => {
    const userId = "clerk_new_user_004";
    mockValidToken(userId);

    const res = await withToken("token.004").get("/api/auth/user");
    expect(res.status).toBe(200);
    expect(res.body.username).toBeNull();
  });

  it("new user can set their username via PUT /api/auth/user", async () => {
    const userId = "clerk_new_user_005";

    mockValidToken(userId);
    await withToken("token.005a").get("/api/auth/user"); // create user

    mockValidToken(userId);
    const res = await withToken("token.005b")
      .put("/api/auth/user")
      .send({ username: "throne_master" });
    expect(res.status).toBe(200);
    expect(res.body.username).toBe("throne_master");
  });
});

describe("Clerk auth — existing user sign-in", () => {
  it("returns existing user profile without creating duplicates", async () => {
    const userId = "clerk_existing_001";

    // First sign-in (creates user)
    mockValidToken(userId);
    const first = await withToken("token.ex.001a").get("/api/auth/user");
    expect(first.status).toBe(200);

    // Second sign-in (existing user)
    mockValidToken(userId);
    const second = await withToken("token.ex.001b").get("/api/auth/user");
    expect(second.status).toBe(200);
    expect(second.body.id).toBe(userId);

    // Still only one user in the store
    const user = await memStore.getUser(userId);
    expect(user).toBeDefined();
    expect(user!.id).toBe(userId);
  });

  it("does NOT create a second Solo Deuces group on second sign-in", async () => {
    const userId = "clerk_existing_002";

    // First sign-in
    mockValidToken(userId);
    await withToken("token.ex.002a").get("/api/auth/user");

    // Second sign-in
    mockValidToken(userId);
    await withToken("token.ex.002b").get("/api/auth/user");

    const groups = await memStore.getUserGroups(userId);
    const soloGroups = groups.filter((g: any) => g.name === "Solo Deuces");
    expect(soloGroups.length).toBe(1);
  });

  it("preserves username set by the user across sign-ins", async () => {
    const userId = "clerk_existing_003";

    // Create user
    mockValidToken(userId);
    await withToken("token.ex.003a").get("/api/auth/user");

    // Set username
    mockValidToken(userId);
    await withToken("token.ex.003b").put("/api/auth/user").send({ username: "sticky_name" });

    // Sign in again — username should still be there
    mockValidToken(userId);
    const res = await withToken("token.ex.003c").get("/api/auth/user");
    expect(res.status).toBe(200);
    expect(res.body.username).toBe("sticky_name");
  });

  it("returns 200 with full profile including deuceCount", async () => {
    const userId = "clerk_existing_004";

    mockValidToken(userId);
    const res = await withToken("token.ex.004").get("/api/auth/user");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("deuceCount");
    expect(res.body).toHaveProperty("subscription");
    expect(res.body).toHaveProperty("id", userId);
  });
});

describe("Clerk auth — POST /api/auth/sync", () => {
  it("sync endpoint upserts profile data from Clerk", async () => {
    const userId = "clerk_sync_001";

    // Auto-create user via GET first
    mockValidToken(userId);
    await withToken("token.sync.001a").get("/api/auth/user");

    // Call sync with richer data
    mockValidToken(userId);
    const res = await withToken("token.sync.001b")
      .post("/api/auth/sync")
      .send({
        email: "synced@clerk.dev",
        firstName: "Synced",
        lastName: "User",
        imageUrl: "https://img.clerk.dev/synced.jpg",
        username: null,
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", userId);
    expect(res.body).toHaveProperty("streaks");
  });

  it("sync creates Solo Deuces if user somehow has no groups", async () => {
    const userId = "clerk_sync_002";

    // Create user without going through isAuthenticated auto-group-creation
    await memStore.upsertUser({ id: userId, email: "nosolo@test.com" });
    // Don't create any group — simulate edge case

    mockValidToken(userId);
    const res = await withToken("token.sync.002")
      .post("/api/auth/sync")
      .send({ email: "nosolo@test.com" });

    expect(res.status).toBe(200);
    const groups = await memStore.getUserGroups(userId);
    expect(groups.some((g: any) => g.name === "Solo Deuces")).toBe(true);
  });
});
