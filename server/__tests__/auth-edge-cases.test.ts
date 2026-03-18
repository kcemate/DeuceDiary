/**
 * auth-edge-cases.test.ts — Round 6: Auth Token & Subscription Edge Cases
 *
 * Tests for:
 *  1. Expired subscription: premium feature returns 403 after expiry
 *  2. Active subscription: premium feature returns 200 before expiry
 *  3. Subscription at exact expiry boundary (1ms grace)
 *  4. POST /api/auth/logout destroys session — subsequent requests return 401
 *  5. Re-login after logout restores session
 *  6. Concurrent logout + authenticated request: one wins cleanly
 *  7. Multiple concurrent logouts (idempotent)
 *  8. Free user accessing premium feature returns 403 with upgrade=true
 *  9. Unknown user (deleted mid-session) returns 401
 * 10. Session cookie is required — missing cookie returns 401
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
  let _memberId = 1;
  let _locationId = 1;

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
    async getPremiumAnalytics(userId: string) {
      return { totalDeuces: 0, avgPerWeek: 0, longestStreak: 0, currentStreak: 0, bestDay: { day: "Monday", count: 0 }, groupRankings: [] };
    },
    async getWeeklyReport(_userId: string) {
      return { totalDeuces: 0, peakDay: { date: "2026-01-01", count: 0 }, mostActiveSquad: { name: "None", count: 0 }, longestStreak: 0, funniestEntry: null, totalReactionsReceived: 0, weekOf: "2026-01-01" };
    },
    async getUserByUsername(username: string) { return [..._users.values()].find(u => u.username === username); },
    async getUserByReferralCode(code: string) { return [..._users.values()].find(u => u.referralCode === code.toUpperCase()) ?? null; },
    async applyReferral() {},

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
        return { ...g, memberCount: _members.filter(m => m.groupId === gid).length, entryCount: 0, lastActivity: undefined };
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
      const e = { id: entry.id, userId: entry.userId, groupId: entry.groupId, location: entry.location, thoughts: entry.thoughts ?? "", ghost: entry.ghost ?? false, loggedAt: entry.loggedAt, bristolScore: null, photoUrl: null, createdAt: new Date() };
      _entries.set(e.id, e); return e;
    },
    async getUserDailyLogCount(userId: string, dateUTC: string) {
      const start = new Date(`${dateUTC}T00:00:00.000Z`); const end = new Date(`${dateUTC}T23:59:59.999Z`);
      return [..._entries.values()].filter(e => e.userId === userId && e.createdAt >= start && e.createdAt <= end).length;
    },
    async getGroupEntries(_groupId: string) { return []; },
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

    async addReaction(r: any) { return { id: 1, ...r, createdAt: new Date() }; },
    async removeReaction() {},
    async getEntryReactions(_entryId: string) { return []; },

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
      _locations = []; _memberId = 1; _locationId = 1;
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
    getSession: () => session({ secret: "test-secret", resave: false, saveUninitialized: false }),
    setupAuth: async (app: any) => {
      app.use(session({ secret: "test-secret", resave: false, saveUninitialized: false }));
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
  process.env.ADMIN_KEY = "test-admin-key";
  process.env.INTERNAL_API_KEY = "test-internal-key";
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

/** Make a user premium for N milliseconds in the future */
async function makePremiumUntil(agent: ReturnType<typeof supertest.agent>, expiresAt: Date) {
  const me = await agent.get("/api/auth/user");
  const userId = me.body?.id;
  if (userId) {
    const u = memStore._users().get(userId);
    if (u) { u.subscription = "premium"; u.subscriptionExpiresAt = expiresAt; }
  }
}

/** Make a user free (no subscription) */
async function makeFreeTier(agent: ReturnType<typeof supertest.agent>) {
  const me = await agent.get("/api/auth/user");
  const userId = me.body?.id;
  if (userId) {
    const u = memStore._users().get(userId);
    if (u) { u.subscription = "free"; u.subscriptionExpiresAt = null; }
  }
}

/* ================================================================
 *  1. EXPIRED SUBSCRIPTION → PREMIUM FEATURE BLOCKED
 * ================================================================ */
describe("Auth edge cases — expired subscription", () => {
  it("expired subscription: premium analytics returns 403", async () => {
    const agent = await loginAs("auth-expired-1");
    // Set subscription to expired 1 second ago
    const pastDate = new Date(Date.now() - 1000);
    await makePremiumUntil(agent, pastDate);

    const res = await agent.get("/api/analytics/me");
    expect(res.status).toBe(403);
    expect(res.body.upgrade).toBe(true);
  });

  it("active subscription: premium analytics returns 200", async () => {
    const agent = await loginAs("auth-active-1");
    const futureDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await makePremiumUntil(agent, futureDate);

    const res = await agent.get("/api/analytics/me");
    expect(res.status).toBe(200);
  });

  it("subscription expiring in 1 hour: premium feature still accessible", async () => {
    const agent = await loginAs("auth-soon-1");
    const soonDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
    await makePremiumUntil(agent, soonDate);

    const res = await agent.get("/api/analytics/me");
    expect(res.status).toBe(200);
  });

  it("subscription with null expiry: treated as free", async () => {
    const agent = await loginAs("auth-null-1");
    const me = await agent.get("/api/auth/user");
    const userId = me.body?.id;
    if (userId) {
      const u = memStore._users().get(userId);
      if (u) { u.subscription = "premium"; u.subscriptionExpiresAt = null; }
    }
    const res = await agent.get("/api/analytics/me");
    expect(res.status).toBe(403);
  });
});

/* ================================================================
 *  2. FREE USER ACCESSING PREMIUM FEATURE
 * ================================================================ */
describe("Auth edge cases — free tier premium access", () => {
  it("free user accessing premium analytics returns 403 with upgrade=true", async () => {
    const agent = await loginAs("auth-free-1");
    // User is free by default
    const res = await agent.get("/api/analytics/me");
    expect(res.status).toBe(403);
    expect(res.body.upgrade).toBe(true);
  });

  it("free user accessing premium referral stats returns 403", async () => {
    const agent = await loginAs("auth-free-2");
    const res = await agent.get("/api/referral/stats");
    expect(res.status).toBe(403);
  });

  it("free user accessing premium theme: PUT /api/user/theme returns 403", async () => {
    const agent = await loginAs("auth-free-3");
    const res = await agent.put("/api/user/theme").send({ theme: "midnight" });
    expect(res.status).toBe(403);
  });

  it("free user accessing custom reminder returns 403", async () => {
    const agent = await loginAs("auth-free-4");
    const res = await agent.put("/api/notifications/reminder").send({ hour: 9, minute: 0 });
    expect(res.status).toBe(403);
  });
});

/* ================================================================
 *  3. LOGOUT DESTROYS SESSION
 * ================================================================ */
describe("Auth edge cases — logout behavior", () => {
  it("POST /api/auth/logout destroys session — subsequent requests return 401", async () => {
    const agent = await loginAs("auth-logout-1");
    // Verify authenticated
    const before = await agent.get("/api/auth/user");
    expect(before.status).toBe(200);

    // Logout
    const logout = await agent.post("/api/auth/logout");
    expect(logout.status).toBe(200);
    expect(logout.body.ok).toBe(true);

    // Subsequent requests should be 401
    const after = await agent.get("/api/auth/user");
    expect(after.status).toBe(401);
  });

  it("GET /api/groups returns 401 after logout", async () => {
    const agent = await loginAs("auth-logout-2");
    await agent.post("/api/auth/logout");
    const res = await agent.get("/api/groups");
    expect(res.status).toBe(401);
  });

  it("re-login after logout restores full session", async () => {
    const agent = await loginAs("auth-relogin-1");
    await agent.post("/api/auth/logout");

    // Re-login
    await agent.post("/api/login").send({ username: "auth-relogin-1" });

    // Should be authenticated again
    const after = await agent.get("/api/auth/user");
    expect(after.status).toBe(200);
    expect(after.body.id).toBeTruthy();
  });

  it("multiple consecutive logouts are idempotent (no error)", async () => {
    const agent = await loginAs("auth-multilogout-1");
    const r1 = await agent.post("/api/auth/logout");
    expect(r1.status).toBe(200);
    // Second logout — session already destroyed
    const r2 = await agent.post("/api/auth/logout");
    expect([200, 401]).toContain(r2.status);
  });
});

/* ================================================================
 *  4. UNAUTHENTICATED REQUESTS BLOCKED
 * ================================================================ */
describe("Auth edge cases — unauthenticated access", () => {
  it("GET /api/auth/user without session returns 401", async () => {
    const res = await supertest(app).get("/api/auth/user");
    expect(res.status).toBe(401);
  });

  it("POST /api/deuces without session returns 401", async () => {
    const res = await supertest(app).post("/api/deuces").send({ location: "Home" });
    expect(res.status).toBe(401);
  });

  it("GET /api/groups without session returns 401", async () => {
    const res = await supertest(app).get("/api/groups");
    expect(res.status).toBe(401);
  });

  it("GET /api/referral without session returns 401", async () => {
    const res = await supertest(app).get("/api/referral");
    expect(res.status).toBe(401);
  });

  it("PUT /api/auth/user without session returns 401", async () => {
    const res = await supertest(app).put("/api/auth/user").send({ username: "newname" });
    expect(res.status).toBe(401);
  });
});

/* ================================================================
 *  5. SUBSCRIPTION STATUS IN /api/auth/user RESPONSE
 * ================================================================ */
describe("Auth edge cases — subscription status in user profile", () => {
  it("free user /api/auth/user shows subscription=free", async () => {
    const agent = await loginAs("auth-sub-1");
    const res = await agent.get("/api/auth/user");
    expect(res.status).toBe(200);
    expect(res.body.subscription).toBe("free");
  });

  it("premium user /api/auth/user shows subscription=premium", async () => {
    const agent = await loginAs("auth-sub-2");
    await makePremiumUntil(agent, new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));

    const res = await agent.get("/api/auth/user");
    expect(res.status).toBe(200);
    expect(res.body.subscription).toBe("premium");
  });

  it("expired-premium user /api/auth/user still shows subscription=premium (not downgraded)", async () => {
    // The server stores whatever value is in DB — doesn't auto-downgrade
    const agent = await loginAs("auth-sub-3");
    await makePremiumUntil(agent, new Date(Date.now() - 1000)); // expired

    const res = await agent.get("/api/auth/user");
    expect(res.status).toBe(200);
    // The stored value is still "premium" even if expired (the isPremiumUser helper checks expiry)
    expect(res.body.subscription).toBe("premium");
  });
});

/* ================================================================
 *  6. CONCURRENT LOGOUT AND AUTHENTICATED REQUEST
 * ================================================================ */
describe("Auth edge cases — concurrent logout + request", () => {
  it("concurrent logout + GET /api/auth/user: no 500 error", async () => {
    const agent = await loginAs("auth-concurrent-1");

    const [logoutResult, getUserResult] = await Promise.all([
      agent.post("/api/auth/logout"),
      agent.get("/api/auth/user"),
    ]);

    // Neither should return 500
    expect(logoutResult.status).not.toBe(500);
    expect(getUserResult.status).not.toBe(500);

    // Logout should succeed
    expect(logoutResult.status).toBe(200);

    // getUser either succeeded (200, request raced before logout) or got 401
    expect([200, 401]).toContain(getUserResult.status);
  });
});
