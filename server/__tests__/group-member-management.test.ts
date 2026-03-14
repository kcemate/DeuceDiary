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
      user.username = username;
      user.updatedAt = new Date();
      return user;
    },
    async updateUserProfilePicture(userId: string, profileImageUrl: string) {
      const user = _users.get(userId);
      if (!user) throw new Error("User not found");
      user.profileImageUrl = profileImageUrl;
      user.updatedAt = new Date();
      return user;
    },
    async updateUserTheme(userId: string, theme: string) {
      const user = _users.get(userId);
      if (!user) throw new Error("User not found");
      user.theme = theme;
      user.updatedAt = new Date();
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
      user.updatedAt = new Date();
      return user;
    },
    async useStreakInsurance(userId: string) {
      const user = _users.get(userId);
      if (user) { user.streakInsuranceUsed = true; user.updatedAt = new Date(); }
    },
    async resetStreakInsurance(userId: string) {
      const user = _users.get(userId);
      if (user) { user.streakInsuranceUsed = false; user.updatedAt = new Date(); }
    },
    async resetAllStreakInsurance() { return 0; },
    async getPremiumAnalytics(_userId: string) {
      return { totalDeuces: 0, avgPerWeek: 0, longestStreak: 0, currentStreak: 0, bestDay: { day: "Monday", count: 0 }, groupRankings: [] };
    },
    async getWeeklyReport(_userId: string) {
      return { totalDeuces: 0, peakDay: { date: "2026-01-01", count: 0 }, mostActiveSquad: { name: "None", count: 0 }, longestStreak: 0, funniestEntry: null, totalReactionsReceived: 0, weekOf: "2026-01-01" };
    },
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
      _members.push({
        id: _memberId++,
        groupId: newGroup.id,
        userId: group.createdBy,
        role: "admin",
        joinedAt: new Date(),
      });
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
      return _members
        .filter((m) => m.groupId === groupId)
        .map((m) => ({ ...m, user: { ..._users.get(m.userId)!, personalRecord: undefined } }));
    },
    async isUserInGroup(userId: string, groupId: string) {
      return _members.some((m) => m.userId === userId && m.groupId === groupId);
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
    async getGroupEntries(groupId: string, _limit?: number, _offset?: number) {
      return [..._entries.values()].filter((e) => e.groupId === groupId).map((e) => ({ ...e, user: _users.get(e.userId)! }));
    },
    async getUserDeucesByDate(_userId: string) { return []; },
    async getEntryById(entryId: string) { return _entries.get(entryId); },
    async getFeedEntries(_groupIds: string[], _limit: number) { return []; },
    async createInvite(invite: any) {
      const inv = { id: invite.id, groupId: invite.groupId, createdBy: invite.createdBy, expiresAt: invite.expiresAt, createdAt: new Date() };
      _invites.set(inv.id, inv);
      return inv;
    },
    async getInviteById(inviteId: string) { return _invites.get(inviteId); },
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
    async getMembersLogStatusToday(groupId: string, _today: string) {
      return _members.filter((m) => m.groupId === groupId).map((m) => ({ userId: m.userId, username: null, firstName: null, profileImageUrl: null, hasLogged: false }));
    },
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
    async applyReferral(_refereeId: string, _referrerId: string) { return { id: 1 }; },
    async getReferralStats(_userId: string) { return { referralCount: 0, referrals: [] }; },
    async getReferralDashboardStats(_userId: string) { return { totalReferrals: 0, premiumConversions: 0, pendingConversions: 0 }; },
    async getReferralLeaderboard() { return []; },
    async getAdminStats() { return { totalUsers: _users.size, premiumUsers: 0, dauToday: 0, totalLogsToday: 0, totalLogsAllTime: _entries.size, activeGroups: _groups.size, avgStreakLength: 0 }; },
    async getGroupWeeklyReport(_groupId: string) {
      return { weekOf: "2026-01-01", totalDeuces: 0, mvp: null, members: [], funnyStats: {} };
    },
    async getGroupLeaderboard(groupId: string) {
      const groupMembers = _members.filter((m) => m.groupId === groupId);
      return groupMembers.map((m) => {
        const user = _users.get(m.userId);
        return {
          userId: m.userId,
          username: user?.username ?? null,
          profileImageUrl: user?.profileImageUrl ?? null,
          deuceCount: user?.deuceCount ?? 0,
          monthlyDeuces: 0,
          weeklyDeuces: 0,
          isMvp: false,
        };
      }).sort((a: any, b: any) => b.deuceCount - a.deuceCount);
    },
    _reset() {
      _users.clear();
      _groups.clear();
      _members = [];
      _entries.clear();
      _invites.clear();
      _memberId = 1;
    },
    _seedMember(member: any) {
      _members.push({ id: _memberId++, ...member, joinedAt: new Date() });
    },
    _seedGroup(group: any) {
      _groups.set(group.id, { ...group, createdAt: new Date(), updatedAt: new Date() });
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
          id: userId,
          email: `${name.toLowerCase().replace(/\s+/g, ".")}@localhost.dev`,
          firstName: name,
          lastName: null,
          profileImageUrl: null,
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
 *  DELETE /api/groups/:groupId/members/:userId
 * ================================================================ */
describe("DELETE /api/groups/:groupId/members/:userId — leave group (self-removal)", () => {
  it("allows a member to remove themselves from a group", async () => {
    const alice = await loginAs("alice");
    const groupId = await getSoloGroupId("alice");

    // Bob joins the group
    await loginAs("bob");
    const bobId = "dev-bob";
    await memStore.addGroupMember({ groupId, userId: bobId, role: "member" });

    const bob = await loginAs("bob");
    const res = await bob.delete(`/api/groups/${groupId}/members/${bobId}`);
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);

    // Verify bob is no longer a member
    const isMember = await memStore.isUserInGroup(bobId, groupId);
    expect(isMember).toBe(false);
    // Suppress unused warning
    void alice;
  });

  it("returns 200 when admin removes another member", async () => {
    await loginAs("alice");
    const groupId = await getSoloGroupId("alice");

    await loginAs("charlie");
    const charlieId = "dev-charlie";
    await memStore.addGroupMember({ groupId, userId: charlieId, role: "member" });

    const alice = await loginAs("alice");
    const res = await alice.delete(`/api/groups/${groupId}/members/${charlieId}`);
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);

    const isMember = await memStore.isUserInGroup(charlieId, groupId);
    expect(isMember).toBe(false);
  });

  it("returns 403 when non-admin tries to remove another member", async () => {
    await loginAs("alice");
    const groupId = await getSoloGroupId("alice");

    await loginAs("bob");
    const bobId = "dev-bob";
    await memStore.addGroupMember({ groupId, userId: bobId, role: "member" });

    await loginAs("charlie");
    const charlieId = "dev-charlie";
    await memStore.addGroupMember({ groupId, userId: charlieId, role: "member" });

    // Bob (regular member) tries to remove Charlie
    const bob = await loginAs("bob");
    const res = await bob.delete(`/api/groups/${groupId}/members/${charlieId}`);
    expect(res.status).toBe(403);
    expect(res.body.message).toMatch(/only admins/i);

    // Charlie should still be a member
    const isMember = await memStore.isUserInGroup(charlieId, groupId);
    expect(isMember).toBe(true);
  });

  it("returns 401 for unauthenticated request", async () => {
    await loginAs("alice");
    const groupId = await getSoloGroupId("alice");
    const res = await supertest(app).delete(`/api/groups/${groupId}/members/dev-alice`);
    expect(res.status).toBe(401);
  });

  it("returns 403 when user is not a member of the group", async () => {
    await loginAs("alice");
    const groupId = await getSoloGroupId("alice");

    // Bob is not in the group
    const bob = await loginAs("bob");
    const bobId = "dev-bob";
    const res = await bob.delete(`/api/groups/${groupId}/members/${bobId}`);
    // requireGroupMember middleware blocks with 403
    expect(res.status).toBe(403);
  });

  it("admin can remove themselves from the group", async () => {
    const alice = await loginAs("alice");
    const groupId = await getSoloGroupId("alice");
    const aliceId = "dev-alice";

    const res = await alice.delete(`/api/groups/${groupId}/members/${aliceId}`);
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);

    const isMember = await memStore.isUserInGroup(aliceId, groupId);
    expect(isMember).toBe(false);
  });

  it("returns success even if user is already not in group (idempotent remove)", async () => {
    await loginAs("alice");
    const groupId = await getSoloGroupId("alice");

    await loginAs("bob");
    const bobId = "dev-bob";
    await memStore.addGroupMember({ groupId, userId: bobId, role: "member" });

    // Alice removes Bob
    const alice = await loginAs("alice");
    await alice.delete(`/api/groups/${groupId}/members/${bobId}`);

    // Try to remove again — storage just does nothing
    const res2 = await alice.delete(`/api/groups/${groupId}/members/${bobId}`);
    // Note: Bob is no longer a member so requireGroupMember blocks (403) or route succeeds
    // Either outcome is acceptable, but we verify no server crash (500)
    expect(res2.status).not.toBe(500);
  });
});

/* ================================================================
 *  POST /api/groups — free user squad limit
 * ================================================================ */
describe("POST /api/groups — free user squad limit", () => {
  it("allows free user to create up to 3 groups", async () => {
    const alice = await loginAs("alice");

    // Already has Solo Deuces from login. Create 2 more.
    const r1 = await alice.post("/api/groups").send({ name: "Squad Alpha" });
    expect(r1.status).toBe(200);

    const r2 = await alice.post("/api/groups").send({ name: "Squad Beta" });
    expect(r2.status).toBe(200);
  });

  it("blocks free user from creating a 4th group", async () => {
    const alice = await loginAs("alice");
    // Login auto-creates group 1. Create 2 more.
    await alice.post("/api/groups").send({ name: "Squad Alpha" });
    await alice.post("/api/groups").send({ name: "Squad Beta" });

    // 4th attempt should be blocked
    const res = await alice.post("/api/groups").send({ name: "Squad Gamma" });
    expect(res.status).toBe(403);
    expect(res.body.upgrade).toBe(true);
    expect(res.body.feature).toBe("unlimited_squads");
  });

  it("allows premium user to create more than 3 groups", async () => {
    const alice = await loginAs("alice");
    const aliceId = "dev-alice";
    await memStore.updateUserSubscription(aliceId, "premium", new Date(Date.now() + 365 * 24 * 60 * 60 * 1000));

    await alice.post("/api/groups").send({ name: "Squad Alpha" });
    await alice.post("/api/groups").send({ name: "Squad Beta" });
    const r4 = await alice.post("/api/groups").send({ name: "Squad Gamma" });
    expect(r4.status).toBe(200);
  });
});

/* ================================================================
 *  POST /api/join/:inviteId — free user squad limit on join
 * ================================================================ */
describe("POST /api/join/:inviteId — free user squad limit on join", () => {
  it("blocks free user from joining a 4th group via invite", async () => {
    // Alice (premium) owns the target group and creates invite
    const alice = await loginAsPremium("alice");
    const groupId = await getSoloGroupId("alice");

    const invRes = await alice.post(`/api/groups/${groupId}/invite`);
    expect(invRes.status).toBe(200);
    const inviteId = invRes.body.id;

    // Bob already has 3 groups (auto-created + 2 more)
    const bob = await loginAs("bob");
    await bob.post("/api/groups").send({ name: "Bob Squad 2" });
    await bob.post("/api/groups").send({ name: "Bob Squad 3" });

    // Bob tries to join Alice's group (would be 4th)
    const res = await bob.post(`/api/join/${inviteId}`);
    expect(res.status).toBe(403);
    expect(res.body.upgrade).toBe(true);
  });

  it("allows already-member to 'join' again without error", async () => {
    const alice = await loginAsPremium("alice");
    const groupId = await getSoloGroupId("alice");

    const invRes = await alice.post(`/api/groups/${groupId}/invite`);
    expect(invRes.status).toBe(200);
    const inviteId = invRes.body.id;

    // Alice tries to join her own group (already a member)
    const res = await alice.post(`/api/join/${inviteId}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/already a member/i);
  });

  it("returns 400 for expired invite", async () => {
    const bob = await loginAs("bob");
    const { v4: uuidv4 } = await import("uuid");

    await loginAs("alice");
    const groupId = await getSoloGroupId("alice");

    // Manually create an expired invite
    const expiredInviteId = uuidv4();
    await memStore.createInvite({
      id: expiredInviteId,
      groupId,
      createdBy: "dev-alice",
      expiresAt: new Date(Date.now() - 1000), // expired 1 second ago
    });

    const res = await bob.post(`/api/join/${expiredInviteId}`);
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/expired/i);
  });
});

/* ================================================================
 *  GET /api/groups/:groupId/leaderboard
 * ================================================================ */
describe("GET /api/groups/:groupId/leaderboard", () => {
  it("returns members ranked by deuce count (uses getGroupLeaderboard)", async () => {
    await loginAs("alice");
    const groupId = await getSoloGroupId("alice");
    const aliceId = "dev-alice";

    await loginAs("bob");
    const bobId = "dev-bob";
    await memStore.addGroupMember({ groupId, userId: bobId, role: "member" });

    // Give alice more deuces than bob
    await memStore.updateUserDeuceCount(aliceId, 10);
    await memStore.updateUserDeuceCount(bobId, 3);

    const alice = await loginAs("alice");
    const res = await alice.get(`/api/groups/${groupId}/leaderboard`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
    // Alice should be first (more deuces)
    expect(res.body[0].userId).toBe(aliceId);
    expect(res.body[0].deuceCount).toBe(10);
    expect(res.body[1].userId).toBe(bobId);
    expect(res.body[1].deuceCount).toBe(3);
  });

  it("returns array for group with only one member", async () => {
    const alice = await loginAs("alice");
    const groupId = await getSoloGroupId("alice");

    const res = await alice.get(`/api/groups/${groupId}/leaderboard`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
  });

  it("returns 403 for non-member", async () => {
    await loginAs("alice");
    const groupId = await getSoloGroupId("alice");

    const bob = await loginAs("bob");
    const res = await bob.get(`/api/groups/${groupId}/leaderboard`);
    expect(res.status).toBe(403);
  });

  it("returns 401 for unauthenticated request", async () => {
    await loginAs("alice");
    const groupId = await getSoloGroupId("alice");
    const res = await supertest(app).get(`/api/groups/${groupId}/leaderboard`);
    expect(res.status).toBe(401);
  });
});

/* ================================================================
 *  GET /api/groups/:groupId/weekly-report (premium-gated)
 * ================================================================ */
describe("GET /api/groups/:groupId/weekly-report", () => {
  it("returns weekly report for premium group member", async () => {
    const alice = await loginAsPremium("alice");
    const groupId = await getSoloGroupId("alice");

    const res = await alice.get(`/api/groups/${groupId}/weekly-report`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("weekOf");
    expect(res.body).toHaveProperty("totalDeuces");
  });

  it("returns 403 for free user", async () => {
    const alice = await loginAs("alice");
    const groupId = await getSoloGroupId("alice");

    const res = await alice.get(`/api/groups/${groupId}/weekly-report`);
    expect(res.status).toBe(403);
    expect(res.body.upgrade).toBe(true);
  });

  it("returns 403 for non-member (even premium)", async () => {
    await loginAs("alice");
    const groupId = await getSoloGroupId("alice");

    const bob = await loginAsPremium("bob");
    const res = await bob.get(`/api/groups/${groupId}/weekly-report`);
    expect(res.status).toBe(403);
  });

  it("returns 401 for unauthenticated request", async () => {
    await loginAs("alice");
    const groupId = await getSoloGroupId("alice");
    const res = await supertest(app).get(`/api/groups/${groupId}/weekly-report`);
    expect(res.status).toBe(401);
  });
});

/* ================================================================
 *  GET /api/groups/:groupId/streak/check
 * ================================================================ */
describe("POST /api/groups/:groupId/streak/check", () => {
  it("returns streak check result for group member", async () => {
    const alice = await loginAs("alice");
    const groupId = await getSoloGroupId("alice");

    const res = await alice.post(`/api/groups/${groupId}/streak/check`);
    expect(res.status).toBe(200);
  });

  it("returns 403 for non-member", async () => {
    await loginAs("alice");
    const groupId = await getSoloGroupId("alice");

    const bob = await loginAs("bob");
    const res = await bob.post(`/api/groups/${groupId}/streak/check`);
    expect(res.status).toBe(403);
  });

  it("returns 401 for unauthenticated request", async () => {
    await loginAs("alice");
    const groupId = await getSoloGroupId("alice");
    const res = await supertest(app).post(`/api/groups/${groupId}/streak/check`);
    expect(res.status).toBe(401);
  });
});
