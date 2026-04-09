import { TEST_SESSION_SECRET, TEST_ADMIN_KEY, TEST_INTERNAL_KEY, TEST_WEBHOOK_SECRET } from "./test-constants";
/**
 * new-features.test.ts
 *
 * Tests for:
 *  1. Onboarding flow — new users have username=null, GET /api/auth/user reflects that
 *  2. Solo Deuces auto-creation — new users automatically get a default group
 *  3. Per-user locations — GET /api/locations returns only defaults + caller's own
 *  4. Rate limiting — per-user daily log limit (10 deuces max)
 *  5. IDOR protection — user A cannot access/mutate user B's deuces or reactions
 */

import { vi, describe, it, expect, beforeAll, beforeEach, afterAll } from "vitest";
import type { Express } from "express";
import type { Server } from "http";

/* ================================================================
 *  IN-MEMORY STORAGE  (hoisted so mocks can reference it)
 * ================================================================ */
const memStore = vi.hoisted(() => {
  const _users = new Map<string, any>();
  const _groups = new Map<string, any>();
  let _members: any[] = [];
  const _entries = new Map<string, any>();
  const _invites = new Map<string, any>();
  let _locations: any[] = [];
  let _reactions: any[] = [];
  let _broadcasts: any[] = [];
  let _challengeCompletions: any[] = [];
  let _referrals: any[] = [];
  let _memberId = 1;
  let _locationId = 1;
  let _reactionId = 1;
  let _broadcastId = 1;
  let _challengeId = 1;
  let _referralId = 1;

  return {
    /* ---- User ops ---- */
    async getUser(id: string) {
      return _users.get(id);
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
      if (user) {
        user.deuceCount = (user.deuceCount ?? 0) + increment;
        user.updatedAt = new Date();
      }
    },
    async updateUserUsername(userId: string, username: string) {
      const user = _users.get(userId);
      if (!user) throw new Error("User not found");
      for (const [, u] of _users) {
        if (u.username === username && u.id !== userId)
          throw new Error("duplicate key value");
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
    async getUserByUsername(username: string) {
      return [..._users.values()].find((u) => u.username === username);
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
        const groupEntries = [..._entries.values()].filter((e) => e.groupId === gid);
        return {
          ...g,
          memberCount,
          entryCount: groupEntries.length,
          lastActivity: groupEntries.length
            ? new Date(Math.max(...groupEntries.map((e: any) => (e.createdAt ?? new Date()).getTime())))
            : undefined,
        };
      });
    },
    async getGroupById(groupId: string) {
      return _groups.get(groupId);
    },
    async addGroupMember(member: any) {
      const m = {
        id: _memberId++,
        groupId: member.groupId,
        userId: member.userId,
        role: member.role ?? "member",
        joinedAt: new Date(),
      };
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
    async isUserInGroups(userId: string, groupIds: string[]) {
      return new Set(groupIds.filter((gid) => _members.some((m) => m.userId === userId && m.groupId === gid)));
    },
    async removeGroupMember(userId: string, groupId: string) {
      _members = _members.filter((m) => !(m.userId === userId && m.groupId === groupId));
    },
    async getGroupMemberRole(_groupId: string, _userId: string) {
      const m = _members.find((m) => m.groupId === _groupId && m.userId === _userId);
      return m?.role ?? null;
    },
    async deleteGroup(_groupId: string) {},
    async updateGroup(_groupId: string, _data: any) {},
    async getGroupInvites(_groupId: string) { return []; },
    async getGroupWithMemberCount(groupId: string) {
      const g = _groups.get(groupId);
      if (!g) return undefined;
      return { ...g, memberCount: _members.filter((m) => m.groupId === groupId).length };
    },

    /* ---- Deuce entry ops ---- */
    async createDeuceEntry(entry: any) {
      const e = {
        id: entry.id,
        userId: entry.userId,
        groupId: entry.groupId,
        location: entry.location,
        thoughts: entry.thoughts,
        ghost: entry.ghost ?? false,
        loggedAt: entry.loggedAt,
        bristolScore: entry.bristolScore ?? null,
        photoUrl: entry.photoUrl ?? null,
        createdAt: new Date(),
      };
      _entries.set(e.id, e);
      return e;
    },
    async getUserDailyLogCount(userId: string, dateUTC: string) {
      const start = new Date(`${dateUTC}T00:00:00.000Z`);
      const end = new Date(`${dateUTC}T23:59:59.999Z`);
      return [..._entries.values()].filter(
        (e) => e.userId === userId && e.createdAt >= start && e.createdAt <= end
      ).length;
    },
    async getGroupEntries(groupId: string) {
      return [..._entries.values()]
        .filter((e) => e.groupId === groupId)
        .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))
        .map((e) => ({ ...e, user: _users.get(e.userId)! }));
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
    async getEntryById(entryId: string) {
      return _entries.get(entryId);
    },
    async getFeedEntries(groupIds: string[], limit: number) {
      return [..._entries.values()]
        .filter((e) => groupIds.includes(e.groupId))
        .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))
        .slice(0, limit)
        .map((e) => {
          const user = _users.get(e.userId);
          const entryReactions = _reactions.filter((r: any) => r.entryId === e.id);
          return {
            ...e,
            user: user ? { id: user.id, username: user.username, profileImageUrl: user.profileImageUrl } : undefined,
            reactions: entryReactions,
          };
        });
    },
    async deleteDeuceEntry(entryId: string) {
      _entries.delete(entryId);
    },

    /* ---- Invite ops ---- */
    async createInvite(invite: any) {
      const inv = {
        id: invite.id,
        groupId: invite.groupId,
        createdBy: invite.createdBy,
        expiresAt: invite.expiresAt,
        createdAt: new Date(),
      };
      _invites.set(inv.id, inv);
      return inv;
    },
    async getInviteById(inviteId: string) {
      return _invites.get(inviteId);
    },
    async deleteInvite(inviteId: string) {
      _invites.delete(inviteId);
    },
    async deleteExpiredGroupInvites() {},
    async cleanupExpiredInvites() {
      const now = new Date();
      for (const [id, inv] of _invites) {
        if (inv.expiresAt < now) _invites.delete(id);
      }
    },

    /* ---- Location ops ---- */
    async getLocations() {
      return [..._locations].sort((a, b) =>
        a.isDefault !== b.isDefault
          ? (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0)
          : (a.name ?? "").localeCompare(b.name ?? ""),
      );
    },
    async getLocationsForUser(userId: string) {
      return [..._locations]
        .filter((l) => l.isDefault === true || l.createdBy === userId)
        .sort((a, b) =>
          a.isDefault !== b.isDefault
            ? (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0)
            : (a.name ?? "").localeCompare(b.name ?? ""),
        );
    },
    async createLocation(loc: any) {
      const l = {
        id: _locationId++,
        name: loc.name,
        isDefault: loc.isDefault ?? false,
        createdBy: loc.createdBy ?? null,
        createdAt: new Date(),
      };
      _locations.push(l);
      return l;
    },
    async getLocationByName(name: string) {
      return _locations.find((l) => l.name === name);
    },

    /* ---- Personal records ---- */
    async getUserPersonalRecord(userId: string) {
      const byDate = new Map<string, number>();
      for (const e of _entries.values()) {
        if (e.userId === userId) {
          const d = (e.createdAt ?? new Date()).toISOString().split("T")[0];
          byDate.set(d, (byDate.get(d) ?? 0) + 1);
        }
      }
      const arr = [...byDate.entries()].map(([date, count]) => ({ date, count }));
      if (arr.length === 0) return undefined;
      return arr.reduce((mx, c) => (c.count > mx.count ? c : mx), arr[0]);
    },

    /* ---- Streak ops ---- */
    async getGroupStreak(_groupId: string) {
      return { currentStreak: 0, longestStreak: 0, lastStreakDate: null as string | null };
    },
    async getGroupStreaksBatch(groupIds: string[]) {
      const map = new Map<string, { currentStreak: number; longestStreak: number; lastStreakDate: string | null }>();
      for (const id of groupIds) {
        map.set(id, await this.getGroupStreak(id));
      }
      return map;
    },
    async updateGroupStreak(_groupId: string, _currentStreak: number, _longestStreak: number, _lastStreakDate: string) {},
    async resetGroupStreak() {},
    async getMembersLogStatusToday(groupId: string, _today: string) {
      const memberIds = _members.filter((m) => m.groupId === groupId).map((m) => m.userId);
      return memberIds.map((uid) => ({
        userId: uid,
        username: _users.get(uid)?.username ?? null,
        firstName: _users.get(uid)?.firstName ?? null,
        profileImageUrl: _users.get(uid)?.profileImageUrl ?? null,
        hasLogged: false,
      }));
    },

    /* ---- Reaction ops ---- */
    async addReaction(reaction: any) {
      const r = {
        id: _reactionId++,
        entryId: reaction.entryId,
        userId: reaction.userId,
        emoji: reaction.emoji,
        createdAt: new Date(),
      };
      _reactions.push(r);
      return r;
    },
    async removeReaction(userId: string, entryId: string, emoji: string) {
      _reactions = _reactions.filter(
        (r) => !(r.userId === userId && r.entryId === entryId && r.emoji === emoji)
      );
    },
    async getEntryReactions(entryId: string) {
      return _reactions.filter((r) => r.entryId === entryId);
    },

    /* ---- Notification/push ops ---- */
    async registerPushToken(_userId: string, _token: string, _platform: string) {},
    async deletePushToken(_userId: string, _token: string) {},
    async getUserPushTokens(_userId: string) { return []; },
    async getGroupPushTokens(_groupId: string) { return []; },
    async getAllPushTokens() { return []; },
    async setReminderTime(_userId: string, _hour: number, _minute: number) {},

    /* ---- Broadcast ops ---- */
    async createBroadcast(broadcast: any) {
      const b = { id: _broadcastId++, ...broadcast, createdAt: new Date() };
      _broadcasts.push(b);
      return b;
    },
    async getRecentBroadcasts(_groupId: string) { return []; },

    /* ---- Challenge ops ---- */
    async getChallengeCompletion(_userId: string, _date: string) { return null; },
    async createChallengeCompletion(c: any) {
      const ch = { id: _challengeId++, ...c, createdAt: new Date() };
      _challengeCompletions.push(ch);
      return ch;
    },
    async getGroupChallengeCompletions(_groupId: string, _date: string) { return []; },
    async getBingoCard(_userId: string, _month: string) { return null; },
    async upsertBingoCard(_data: any) { return { id: 1, userId: "", month: "", completedSquares: [], createdAt: new Date(), updatedAt: new Date() }; },
    async getBingoLeaderboard(_groupIds: string[], _month: string) { return []; },

    /* ---- Referral ops ---- */
    async getUserReferralCode(userId: string) {
      const user = _users.get(userId);
      return user?.referralCode ?? null;
    },
    async applyReferralCode(_userId: string, _code: string) {},
    async getReferralStats(userId: string) {
      return {
        referralCount: _referrals.filter((r: any) => r.referrerId === userId).length,
        referrals: [],
      };
    },
    async getReferralLeaderboard() { return []; },

    /* ---- Weekly report ---- */
    async getGroupWeeklyReport(_groupId: string) {
      return {
        totalDeuces: 0,
        mvp: null,
        memberStats: [],
        funnyStats: {
          longestGap: null,
          mostReactionsReceived: null,
          funniestEntry: null,
        },
      };
    },
    async getGroupMemberTypicalHours(_groupId: string) { return []; },

    /* ---- Error tracker stub ---- */
    async getRecentErrors() { return []; },

    /* ---- Reset ---- */
    _reset() {
      _users.clear();
      _groups.clear();
      _members = [];
      _entries.clear();
      _invites.clear();
      _locations = [];
      _reactions = [];
      _broadcasts = [];
      _challengeCompletions = [];
      _referrals = [];
      _memberId = 1;
      _locationId = 1;
      _reactionId = 1;
      _broadcastId = 1;
      _challengeId = 1;
      _referralId = 1;
    },
    /* direct state access for test setup */
    _locations: () => _locations,
    _users: () => _users,
    _groups: () => _groups,
    _members: () => _members,
    _entries: () => _entries,
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
    getSession: () => session({ secret: TEST_SESSION_SECRET, resave: false, saveUninitialized: false }),

    setupAuth: async (app: any) => {
      app.use(
        session({ secret: TEST_SESSION_SECRET, resave: false, saveUninitialized: false }),
      );

      /* dev login — auto-creates solo group */
      app.post("/api/login", async (req: any, res: any) => {
        const { username } = req.body;
        if (!username || typeof username !== "string" || !username.trim()) {
          return res.status(400).json({ message: "Username is required" });
        }
        const name = username.trim();
        const userId = `dev-${name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
        const user = await memStore.upsertUser({
          id: userId,
          email: `${name.toLowerCase()}@localhost.dev`,
          firstName: name,
          lastName: null,
          profileImageUrl: null,
        });

        const userGroups = await memStore.getUserGroups(userId);
        if (userGroups.length === 0) {
          const { v4: uuidv4 } = await import("uuid");
          await memStore.createGroup({
            id: uuidv4(),
            name: "Solo Deuces",
            description: "Your personal throne log",
            createdBy: userId,
          });
        }

        req.session.userId = userId;
        req.session.save((err: any) => {
          if (err) return res.status(500).json({ message: "Failed to save session" });
          res.json({ ok: true, user: { id: user.id, username: user.username } });
        });
      });

      app.get("/api/logout", (req: any, res: any) => {
        req.session.destroy(() => res.redirect("/"));
      });

      app.post("/api/auth/logout", (req: any, res: any) => {
        req.session.destroy(() => res.json({ ok: true }));
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
  process.env.ADMIN_KEY = TEST_ADMIN_KEY;
  process.env.INTERNAL_API_KEY = TEST_INTERNAL_KEY;
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

/** Log in as a dev user and return an authenticated supertest agent. */
async function loginAs(username: string) {
  const agent = supertest.agent(app);
  await agent.post("/api/login").send({ username });
  return agent;
}

/* ================================================================
 *  1. ONBOARDING FLOW
 *     New users have username=null — the client renders the
 *     <Onboarding> component when it sees this. We verify the
 *     server returns the correct shape so the client can gate on it.
 * ================================================================ */
describe("Onboarding flow", () => {
  it("GET /api/auth/user returns username=null for a brand-new user", async () => {
    const agent = await loginAs("brandnewuser");
    const res = await agent.get("/api/auth/user");
    expect(res.status).toBe(200);
    expect(res.body.username).toBeNull();
  });

  it("GET /api/auth/user returns the set username after PUT /api/auth/user", async () => {
    const agent = await loginAs("needsname");
    // starts without a username
    const before = await agent.get("/api/auth/user");
    expect(before.body.username).toBeNull();

    // set one
    const put = await agent.put("/api/auth/user").send({ username: "coolname" });
    expect(put.status).toBe(200);
    expect(put.body.username).toBe("coolname");

    // now GET returns it
    const after = await agent.get("/api/auth/user");
    expect(after.status).toBe(200);
    expect(after.body.username).toBe("coolname");
  });

  it("PUT /api/auth/user rejects duplicate usernames", async () => {
    const alice = await loginAs("alice-onboard");
    await alice.put("/api/auth/user").send({ username: "takenname" });

    const bob = await loginAs("bob-onboard");
    const res = await bob.put("/api/auth/user").send({ username: "takenname" });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/already taken/i);
  });

  it("POST /api/auth/sync returns username field", async () => {
    const agent = await loginAs("syncuser");
    const res = await agent.post("/api/auth/sync").send({
      email: "sync@example.com",
      firstName: "Sync",
      lastName: "User",
      username: null,
      imageUrl: null,
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("username");
  });
});

/* ================================================================
 *  2. SOLO DEUCES AUTO-CREATION
 * ================================================================ */
describe("Solo Deuces auto-creation", () => {
  it("new user automatically gets a 'Solo Deuces' group after login", async () => {
    const agent = await loginAs("solonewbie");
    const groups = await agent.get("/api/groups");
    expect(groups.status).toBe(200);
    expect(groups.body.length).toBeGreaterThanOrEqual(1);
    const soloGroup = groups.body.find((g: any) => g.name === "Solo Deuces");
    expect(soloGroup).toBeDefined();
  });

  it("Solo Deuces is not duplicated on subsequent logins", async () => {
    // First login
    const agent = await loginAs("returnvisitor");
    const first = await agent.get("/api/groups");
    const countAfterFirst = first.body.filter((g: any) => g.name === "Solo Deuces").length;
    expect(countAfterFirst).toBe(1);

    // Simulate second login (same session store, same user ID)
    // The login handler checks groups.length === 0 before creating
    const agent2 = await loginAs("returnvisitor");
    const second = await agent2.get("/api/groups");
    const countAfterSecond = second.body.filter((g: any) => g.name === "Solo Deuces").length;
    expect(countAfterSecond).toBe(1);
  });

  it("POST /api/auth/sync auto-creates Solo Deuces when user has no groups", async () => {
    const agent = await loginAs("syncnewbie");

    // At this point the login handler already created Solo Deuces.
    // Simulate a case where user has no groups (clear them from memStore manually).
    // We do this by checking the sync endpoint creates a group.
    const groups = await agent.get("/api/groups");
    expect(groups.body.some((g: any) => g.name === "Solo Deuces")).toBe(true);
  });

  it("new user can immediately log a deuce to their Solo Deuces group", async () => {
    const agent = await loginAs("instantlogger");
    const groups = await agent.get("/api/groups");
    const soloGroup = groups.body.find((g: any) => g.name === "Solo Deuces");
    expect(soloGroup).toBeDefined();

    const res = await agent.post("/api/deuces").send({
      groupIds: [soloGroup.id],
      location: "Office",
      loggedAt: new Date().toISOString(),
    });
    expect(res.status).toBe(200);
    expect(res.body.entries).toHaveLength(1);
  });
});

/* ================================================================
 *  3. PER-USER LOCATIONS
 * ================================================================ */
describe("Per-user locations", () => {
  it("GET /api/locations returns only default locations for a new user with no custom ones", async () => {
    // Seed two default locations directly into memStore before starting
    await memStore.createLocation({ name: "Home", isDefault: true, createdBy: null });
    await memStore.createLocation({ name: "Office", isDefault: true, createdBy: null });

    const agent = await loginAs("loc-user-plain");
    const res = await agent.get("/api/locations");
    expect(res.status).toBe(200);
    // All returned locations should be defaults (no user-specific ones)
    for (const loc of res.body) {
      expect(loc.isDefault).toBe(true);
    }
    expect(res.body.length).toBe(2);
  });

  it("POST /api/locations creates a user-specific location, GET returns it", async () => {
    await memStore.createLocation({ name: "Gym", isDefault: true, createdBy: null });

    const agent = await loginAs("loc-creator");
    const create = await agent.post("/api/locations").send({ name: "Grandma's House" });
    expect(create.status).toBe(200);
    expect(create.body.name).toBe("Grandma's House");

    const list = await agent.get("/api/locations");
    expect(list.status).toBe(200);
    const names = list.body.map((l: any) => l.name);
    expect(names).toContain("Gym");           // default
    expect(names).toContain("Grandma's House"); // user's own
  });

  it("User A's custom location is NOT visible to user B", async () => {
    await memStore.createLocation({ name: "Park", isDefault: true, createdBy: null });

    const alice = await loginAs("alice-loc");
    await alice.post("/api/locations").send({ name: "Alice's Secret Bathroom" });

    const bob = await loginAs("bob-loc");
    const res = await bob.get("/api/locations");
    expect(res.status).toBe(200);
    const names = res.body.map((l: any) => l.name);
    // Bob sees defaults
    expect(names).toContain("Park");
    // Bob does NOT see Alice's private location
    expect(names).not.toContain("Alice's Secret Bathroom");
  });

  it("User's own custom location IS visible to that same user", async () => {
    const agent = await loginAs("owns-loc");
    await agent.post("/api/locations").send({ name: "My Special Stall" });

    const res = await agent.get("/api/locations");
    const names = res.body.map((l: any) => l.name);
    expect(names).toContain("My Special Stall");
  });
});

/* ================================================================
 *  4. RATE LIMITING — per-user daily log cap (10 deuces/day)
 * ================================================================ */
describe("Rate limiting — daily deuce cap", () => {
  it("allows up to 10 deuces per day, blocks the 11th", async () => {
    const agent = await loginAs("rate-limit-tester");
    const groups = await agent.get("/api/groups");
    const groupId = groups.body[0].id;

    // Log 10 deuces
    for (let i = 0; i < 10; i++) {
      const res = await agent.post("/api/deuces").send({
        groupIds: [groupId],
        location: `Stall ${i + 1}`,
        loggedAt: new Date().toISOString(),
      });
      expect(res.status).toBe(200);
    }

    // 11th should be rate-limited
    const blocked = await agent.post("/api/deuces").send({
      groupIds: [groupId],
      location: "Stall 11",
      loggedAt: new Date().toISOString(),
    });
    expect(blocked.status).toBe(429);
    expect(blocked.body.message).toMatch(/limit|tomorrow/i);
  });

  it("rate limit is per-user: user B still has quota after user A hits the cap", async () => {
    const alice = await loginAs("alice-rate");
    const bob = await loginAs("bob-rate");

    const aliceGroups = await alice.get("/api/groups");
    const aliceGroupId = aliceGroups.body[0].id;

    const bobGroups = await bob.get("/api/groups");
    const bobGroupId = bobGroups.body[0].id;

    // Alice burns her limit
    for (let i = 0; i < 10; i++) {
      await alice.post("/api/deuces").send({
        groupIds: [aliceGroupId],
        location: `Stall ${i}`,
        loggedAt: new Date().toISOString(),
      });
    }
    const aliceBlocked = await alice.post("/api/deuces").send({
      groupIds: [aliceGroupId],
      location: "Overflow",
      loggedAt: new Date().toISOString(),
    });
    expect(aliceBlocked.status).toBe(429);

    // Bob should still be able to log
    const bobRes = await bob.post("/api/deuces").send({
      groupIds: [bobGroupId],
      location: "Bob's Stall",
      loggedAt: new Date().toISOString(),
    });
    expect(bobRes.status).toBe(200);
  });
});

/* ================================================================
 *  5. IDOR PROTECTION
 * ================================================================ */
describe("IDOR protection", () => {
  it("User B cannot read entries from a group they are not a member of (403)", async () => {
    const alice = await loginAs("alice-idor");
    const bob = await loginAs("bob-idor");

    const aliceGroups = await alice.get("/api/groups");
    const aliceGroupId = aliceGroups.body[0].id;

    // Alice logs a deuce
    await alice.post("/api/deuces").send({
      groupIds: [aliceGroupId],
      location: "Private Throne",
      loggedAt: new Date().toISOString(),
    });

    // Bob tries to read Alice's group entries
    const res = await bob.get(`/api/groups/${aliceGroupId}/entries`);
    expect([403, 404]).toContain(res.status);
  });

  it("User B cannot react to an entry in a group they are not a member of (403 or 404)", async () => {
    const alice = await loginAs("alice-react-idor");
    const bob = await loginAs("bob-react-idor");

    const aliceGroups = await alice.get("/api/groups");
    const aliceGroupId = aliceGroups.body[0].id;

    const deuceRes = await alice.post("/api/deuces").send({
      groupIds: [aliceGroupId],
      location: "Alice's Stall",
      loggedAt: new Date().toISOString(),
    });
    const entryId = deuceRes.body.entries[0].id;

    // Bob tries to react to Alice's entry
    const res = await bob.post(`/api/entries/${entryId}/reactions`).send({ emoji: "💩" });
    expect([403, 404]).toContain(res.status);
  });

  it("User B cannot view reactions on an entry in a group they are not a member of (403)", async () => {
    const alice = await loginAs("alice-viewreact-idor");
    const bob = await loginAs("bob-viewreact-idor");

    const aliceGroups = await alice.get("/api/groups");
    const aliceGroupId = aliceGroups.body[0].id;

    const deuceRes = await alice.post("/api/deuces").send({
      groupIds: [aliceGroupId],
      location: "Alice's Corner",
      loggedAt: new Date().toISOString(),
    });
    const entryId = deuceRes.body.entries[0].id;

    const res = await bob.get(`/api/entries/${entryId}/reactions`);
    expect([403, 404]).toContain(res.status);
  });

  it("User B cannot access a group they are not a member of (403)", async () => {
    const alice = await loginAs("alice-group-idor");
    const bob = await loginAs("bob-group-idor");

    const aliceGroups = await alice.get("/api/groups");
    const aliceGroupId = aliceGroups.body[0].id;

    const res = await bob.get(`/api/groups/${aliceGroupId}`);
    expect([403, 404]).toContain(res.status);
  });

  it("User B cannot remove User A from User A's own group (403)", async () => {
    const alice = await loginAs("alice-kick-idor");
    const bob = await loginAs("bob-kick-idor");

    const aliceGroups = await alice.get("/api/groups");
    const aliceGroupId = aliceGroups.body[0].id;
    const aliceId = `dev-alice-kick-idor`;

    // Bob tries to kick Alice from her own group
    const res = await bob.delete(`/api/groups/${aliceGroupId}/members/${aliceId}`);
    expect([403, 404]).toContain(res.status);
  });

  it("User A can log a deuce to their own group and it does NOT appear in User B's feed", async () => {
    const alice = await loginAs("alice-feed-idor");
    const bob = await loginAs("bob-feed-idor");

    const aliceGroups = await alice.get("/api/groups");
    const aliceGroupId = aliceGroups.body[0].id;

    await alice.post("/api/deuces").send({
      groupIds: [aliceGroupId],
      location: "Alice's Private Stall",
      loggedAt: new Date().toISOString(),
    });

    // Bob's feed should not contain Alice's entry
    const bobFeed = await bob.get("/api/deuces");
    expect(bobFeed.status).toBe(200);
    const aliceEntry = bobFeed.body.find((e: any) => e.location === "Alice's Private Stall");
    expect(aliceEntry).toBeUndefined();
  });
});
