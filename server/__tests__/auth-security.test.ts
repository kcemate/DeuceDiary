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

    /* ---- Theme ops ---- */
    async updateUserTheme(userId: string, theme: string) {
      const user = _users.get(userId);
      if (!user) throw new Error("User not found");
      user.theme = theme;
      user.updatedAt = new Date();
      return user;
    },

    /* ---- Subscription ops ---- */
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

    /* ---- Premium analytics (stub) ---- */
    async getPremiumAnalytics(_userId: string) {
      return { totalDeuces: 0, avgPerWeek: 0, longestStreak: 0, currentStreak: 0, bestDay: { day: "Monday", count: 0 }, groupRankings: [] };
    },

    /* ---- Weekly report (stub) ---- */
    async getWeeklyReport(_userId: string) {
      return { totalDeuces: 0, peakDay: { date: "2026-01-01", count: 0 }, mostActiveSquad: { name: "None", count: 0 }, longestStreak: 0, funniestEntry: null, totalReactionsReceived: 0, weekOf: "2026-01-01" };
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
    async removeGroupMember(userId: string, groupId: string) {
      _members = _members.filter((m) => !(m.userId === userId && m.groupId === groupId));
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
          const entryReactions = _reactions
            .filter((r: any) => r.entryId === e.id);
          return {
            ...e,
            user: user ? { id: user.id, username: user.username, profileImageUrl: user.profileImageUrl } : undefined,
            reactions: entryReactions,
          };
        });
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
    async updateGroupStreak(
      _groupId: string,
      _currentStreak: number,
      _longestStreak: number,
      _lastStreakDate: string,
    ) {},
    async getMembersLogStatusToday(groupId: string, _today: string) {
      const memberIds = _members
        .filter((m) => m.groupId === groupId)
        .map((m) => m.userId);
      return memberIds.map((uid) => ({
        userId: uid,
        username: _users.get(uid)?.username ?? null,
        firstName: _users.get(uid)?.firstName ?? null,
        profileImageUrl: _users.get(uid)?.profileImageUrl ?? null,
        hasLogged: [..._entries.values()].some(
          (e) => e.groupId === groupId && e.userId === uid,
        ),
      }));
    },

    /* ---- Streak alert ops ---- */
    async getAllGroupsWithActiveStreaks(_minStreak: number) { return []; },
    async createStreakAlert(_alert: any) { return { id: 1 }; },

    /* ---- Group preview ops ---- */
    async getGroupMemberCount(groupId: string) {
      return _members.filter((m) => m.groupId === groupId).length;
    },
    async getGroupDeuceCount(groupId: string) {
      return [..._entries.values()].filter((e) => e.groupId === groupId).length;
    },

    /* ---- Reaction ops ---- */
    async addReaction(reaction: any) {
      const exists = _reactions.find(
        (r) => r.entryId === reaction.entryId && r.userId === reaction.userId && r.emoji === reaction.emoji,
      );
      if (exists) throw new Error("duplicate key value violates unique constraint");
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
        (r) => !(r.userId === userId && r.entryId === entryId && r.emoji === emoji),
      );
    },
    async getEntryReactions(entryId: string) {
      return _reactions
        .filter((r) => r.entryId === entryId)
        .sort((a, b) => (a.createdAt ?? 0) - (b.createdAt ?? 0))
        .map((r) => ({ ...r, user: _users.get(r.userId)! }));
    },

    /* ---- Push token ops ---- */
    async upsertPushToken(token: any) {
      return { id: 1, ...token, createdAt: new Date() };
    },
    async getGroupPushTokens(groupId: string) {
      const memberIds = _members.filter((m) => m.groupId === groupId).map((m) => m.userId);
      return memberIds.map((uid) => ({ id: 1, userId: uid, token: `mock-token-${uid}`, platform: "ios", createdAt: new Date() }));
    },
    async deletePushToken(_userId: string, _token: string) {},

    /* ---- Broadcast ops ---- */
    async createBroadcast(broadcast: any) {
      const b = { id: _broadcastId++, ...broadcast, createdAt: new Date() };
      _broadcasts.push(b);
      return b;
    },

    /* ---- Daily challenge ops ---- */
    async getDailyChallengeCompletion(userId: string, challengeDate: string) {
      return _challengeCompletions.find((c) => c.userId === userId && c.challengeDate === challengeDate);
    },
    async completeDailyChallenge(completion: any) {
      const c = { id: _challengeId++, ...completion, createdAt: new Date() };
      _challengeCompletions.push(c);
      return c;
    },

    /* ---- Reminder ops ---- */
    async updateUserReminder(userId: string, hour: number, minute: number) {
      const user = _users.get(userId);
      if (!user) throw new Error("User not found");
      user.reminderHour = hour;
      user.reminderMinute = minute;
      user.updatedAt = new Date();
      return user;
    },

    /* ---- Legacy wall ops ---- */
    async getUserByUsername(username: string) {
      for (const [, u] of _users) {
        if (u.username === username) return u;
      }
      return undefined;
    },
    async getUserLongestStreak(_userId: string) {
      return 0;
    },
    async getUserBestDay(_userId: string) {
      return undefined;
    },

    /* ---- Squad spy mode ---- */
    async getGroupMemberTypicalHours(_groupId: string) {
      return [];
    },

    /* ---- Referral ops ---- */
    async getUserByReferralCode(code: string) {
      for (const [, u] of _users) {
        if (u.referralCode === code) return u;
      }
      return undefined;
    },
    async applyReferral(refereeId: string, referrerId: string) {
      const referee = _users.get(refereeId);
      if (referee) {
        referee.referredBy = referrerId;
        referee.updatedAt = new Date();
      }
      const referrer = _users.get(referrerId);
      if (referrer) {
        referrer.referralCount = (referrer.referralCount ?? 0) + 1;
        referrer.updatedAt = new Date();
      }
      const referral = {
        id: _referralId++,
        referrerId,
        refereeId,
        discountApplied: false,
        createdAt: new Date(),
      };
      _referrals.push(referral);
      return referral;
    },
    async getReferralStats(userId: string) {
      const user = _users.get(userId);
      const userReferrals = _referrals
        .filter((r) => r.referrerId === userId)
        .sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0))
        .map((r) => {
          const referee = _users.get(r.refereeId);
          return { username: referee?.username ?? null, joinedAt: r.createdAt };
        });
      return {
        referralCount: user?.referralCount ?? 0,
        referrals: userReferrals,
      };
    },

    /* ---- Referral dashboard ---- */
    async getReferralDashboardStats(_userId: string) {
      return { totalReferrals: 0, premiumConversions: 0, pendingConversions: 0 };
    },
    async getReferralLeaderboard() {
      return [];
    },

    /* ---- Admin stats ---- */
    async getAdminStats() {
      return {
        totalUsers: _users.size,
        premiumUsers: [..._users.values()].filter((u) => u.subscription === "premium").length,
        dauToday: 0,
        totalLogsToday: 0,
        totalLogsAllTime: _entries.size,
        activeGroups: _groups.size,
        avgStreakLength: 0,
      };
    },

    /* ---- test helper ---- */
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
      app.use(
        session({
          secret: "test-secret",
          resave: false,
          saveUninitialized: false,
        }),
      );

      /* dev login */
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

        // Auto-create Solo Deuces for users with no groups
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
          res.json({
            ok: true,
            user: {
              id: user.id,
              username: user.username,
              profilePicture: user.profileImageUrl,
              createdAt: user.createdAt,
            },
          });
        });
      });

      /* dev logout */
      app.get("/api/logout", (req: any, res: any) => {
        req.session.destroy(() => {
          res.redirect("/");
        });
      });

      /* dev logout (JSON) */
      app.post("/api/auth/logout", (req: any, res: any) => {
        req.session.destroy(() => {
          res.json({ ok: true });
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
 *  IMPORTS  (resolved AFTER mocks are in place)
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
});

/** Create an authenticated supertest agent for the given username. */
async function loginAs(username: string) {
  const agent = supertest.agent(app);
  await agent.post("/api/login").send({ username });
  return agent;
}

/** Create an authenticated premium supertest agent. */
async function loginAsPremium(username: string) {
  const agent = await loginAs(username);
  const userId = `dev-${username.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
  await memStore.updateUserSubscription(userId, "premium", new Date(Date.now() + 365 * 24 * 60 * 60 * 1000));
  return agent;
}

/* ================================================================
 *  1. MISSING AUTH HEADERS / NO SESSION  (all authenticated endpoints → 401)
 * ================================================================ */
describe("Missing auth / no session returns 401", () => {
  it("GET /api/auth/user", async () => {
    const res = await supertest(app).get("/api/auth/user");
    expect(res.status).toBe(401);
  });

  it("PUT /api/auth/user", async () => {
    const res = await supertest(app).put("/api/auth/user").send({ username: "hacker" });
    expect(res.status).toBe(401);
  });

  it("POST /api/groups", async () => {
    const res = await supertest(app).post("/api/groups").send({ name: "Sneaky Squad" });
    expect(res.status).toBe(401);
  });

  it("GET /api/groups", async () => {
    const res = await supertest(app).get("/api/groups");
    expect(res.status).toBe(401);
  });

  it("POST /api/deuces", async () => {
    const res = await supertest(app).post("/api/deuces").send({
      groupIds: ["fake-uuid"],
      location: "Home",
      thoughts: "test",
      loggedAt: new Date().toISOString(),
    });
    expect(res.status).toBe(401);
  });

  it("GET /api/deuces", async () => {
    const res = await supertest(app).get("/api/deuces");
    expect(res.status).toBe(401);
  });

  it("POST /api/entries/fake-id/reactions", async () => {
    const res = await supertest(app).post("/api/entries/fake-id/reactions").send({ emoji: "poop" });
    expect(res.status).toBe(401);
  });

  it("GET /api/subscription", async () => {
    const res = await supertest(app).get("/api/subscription");
    expect(res.status).toBe(401);
  });

  it("POST /api/subscription/upgrade", async () => {
    const res = await supertest(app).post("/api/subscription/upgrade").send({ plan: "monthly" });
    expect(res.status).toBe(401);
  });

  it("GET /api/analytics/me", async () => {
    const res = await supertest(app).get("/api/analytics/me");
    expect(res.status).toBe(401);
  });

  it("POST /api/notifications/register", async () => {
    const res = await supertest(app).post("/api/notifications/register").send({ token: "tok", platform: "ios" });
    expect(res.status).toBe(401);
  });

  it("GET /api/referral", async () => {
    const res = await supertest(app).get("/api/referral");
    expect(res.status).toBe(401);
  });

  it("POST /api/referral/apply", async () => {
    const res = await supertest(app).post("/api/referral/apply").send({ code: "ABC" });
    expect(res.status).toBe(401);
  });

  it("GET /api/challenges/today", async () => {
    const res = await supertest(app).get("/api/challenges/today");
    expect(res.status).toBe(401);
  });

  it("POST /api/challenges/complete", async () => {
    const res = await supertest(app).post("/api/challenges/complete");
    expect(res.status).toBe(401);
  });

  it("PUT /api/notifications/reminder", async () => {
    const res = await supertest(app).put("/api/notifications/reminder").send({ hour: 9, minute: 0 });
    expect(res.status).toBe(401);
  });
});

/* ================================================================
 *  2. CROSS-USER DATA ACCESS
 * ================================================================ */
describe("Cross-user data access", () => {
  it("User B (free, not member) tries GET /api/groups/:id -> 403 (not a member)", async () => {
    // Alice creates a group
    const alice = await loginAs("alice");
    const groupRes = await alice.post("/api/groups").send({ name: "Alice's Squad" });
    expect(groupRes.status).toBe(200);
    const groupId = groupRes.body.id;

    // Bob is free and not a member, tries to access the group
    const bob = await loginAs("bob");
    const res = await bob.get(`/api/groups/${groupId}`);
    expect(res.status).toBe(403);
  });

  it("User B (premium, not member) tries GET /api/groups/:id -> 403 (not authorized)", async () => {
    // Alice creates a group (premium)
    const alice = await loginAsPremium("alice");
    const groupRes = await alice.post("/api/groups").send({ name: "Alice's Private Squad" });
    expect(groupRes.status).toBe(200);
    const groupId = groupRes.body.id;

    // Bob is premium but NOT a member of Alice's group
    const bob = await loginAsPremium("bob");
    const res = await bob.get(`/api/groups/${groupId}`);
    expect(res.status).toBe(403);
    expect(res.body.message).toMatch(/not authorized/i);
  });

  it("User B (premium) cannot react to User A's entry if not in the same group", async () => {
    // Alice creates a group and logs a deuce
    const alice = await loginAsPremium("alice");
    const groupRes = await alice.post("/api/groups").send({ name: "Alice Only Squad" });
    const groupId = groupRes.body.id;

    const deuceRes = await alice.post("/api/deuces").send({
      groupIds: [groupId],
      location: "Home",
      thoughts: "Alice's private log",
      loggedAt: new Date().toISOString(),
    });
    expect(deuceRes.status).toBe(200);
    const entryId = deuceRes.body.entries[0].id;

    // Bob is premium but not in Alice's group
    const bob = await loginAsPremium("bob");
    const res = await bob.post(`/api/entries/${entryId}/reactions`).send({ emoji: "poop" });
    // Should get 403 (not authorized to react) or 404 (entry not accessible)
    expect([403, 404]).toContain(res.status);
  });

  it("User A cannot see User B's analytics (each user gets their own analytics)", async () => {
    // Alice and Bob both upgrade to premium
    const alice = await loginAsPremium("alice");
    const bob = await loginAsPremium("bob");

    // Each user sees only their own data from /api/analytics/me
    const aliceAnalytics = await alice.get("/api/analytics/me");
    expect(aliceAnalytics.status).toBe(200);

    const bobAnalytics = await bob.get("/api/analytics/me");
    expect(bobAnalytics.status).toBe(200);

    // The endpoint is /api/analytics/me — user-scoped, no way to pass another user's ID
    // Verify the responses are independent (both should have 0 deuces since neither logged any)
    expect(aliceAnalytics.body.totalDeuces).toBe(0);
    expect(bobAnalytics.body.totalDeuces).toBe(0);
  });
});

/* ================================================================
 *  3. ADMIN ENDPOINT SECURITY
 * ================================================================ */
describe("Admin endpoint security", () => {
  it("GET /api/admin/stats without X-Admin-Key returns 401", async () => {
    const res = await supertest(app).get("/api/admin/stats");
    expect(res.status).toBe(401);
  });

  it("GET /api/admin/stats with wrong X-Admin-Key returns 401", async () => {
    const res = await supertest(app)
      .get("/api/admin/stats")
      .set("X-Admin-Key", "wrong-key-12345");
    expect(res.status).toBe(401);
  });

  it("POST /api/internal/streak-check without X-Internal-Key returns 401", async () => {
    const res = await supertest(app).post("/api/internal/streak-check");
    expect(res.status).toBe(401);
  });

  it("POST /api/internal/streak-check with wrong X-Internal-Key returns 401", async () => {
    const res = await supertest(app)
      .post("/api/internal/streak-check")
      .set("X-Internal-Key", "wrong-internal-key");
    expect(res.status).toBe(401);
  });
});

/* ================================================================
 *  4. SESSION INVALIDATION
 * ================================================================ */
describe("Session invalidation", () => {
  it("POST /api/auth/logout destroys session, subsequent requests return 401", async () => {
    const agent = await loginAs("alice");

    // Confirm authenticated
    const before = await agent.get("/api/auth/user");
    expect(before.status).toBe(200);

    // Logout
    const logoutRes = await agent.post("/api/auth/logout");
    expect(logoutRes.status).toBe(200);
    expect(logoutRes.body.ok).toBe(true);

    // Subsequent request should be 401
    const after = await agent.get("/api/auth/user");
    expect(after.status).toBe(401);
  });

  it("GET /api/logout redirects to /", async () => {
    const agent = await loginAs("alice");

    const res = await agent.get("/api/logout");
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe("/");
  });
});

/* ================================================================
 *  5. PREMIUM GATING COMPLETENESS  (all premium endpoints block free users)
 * ================================================================ */
describe("Premium gating — free users get 403", () => {
  it("GET /api/user/theme", async () => {
    const agent = await loginAs("alice");
    const res = await agent.get("/api/user/theme");
    expect(res.status).toBe(403);
    expect(res.body.upgrade).toBe(true);
  });

  it("PUT /api/user/theme", async () => {
    const agent = await loginAs("alice");
    const res = await agent.put("/api/user/theme").send({ theme: "dark" });
    expect(res.status).toBe(403);
    expect(res.body.upgrade).toBe(true);
  });

  it("GET /api/groups/:id/spy", async () => {
    const agent = await loginAs("alice");
    const res = await agent.get("/api/groups/fake-group-id/spy");
    expect(res.status).toBe(403);
    expect(res.body.upgrade).toBe(true);
  });

  it("GET /api/analytics/me", async () => {
    const agent = await loginAs("alice");
    const res = await agent.get("/api/analytics/me");
    expect(res.status).toBe(403);
    expect(res.body.upgrade).toBe(true);
  });

  it("GET /api/analytics/most-deuces", async () => {
    const agent = await loginAs("alice");
    const res = await agent.get("/api/analytics/most-deuces");
    expect(res.status).toBe(403);
    expect(res.body.upgrade).toBe(true);
  });

  it("POST /api/subscription/streak-insurance", async () => {
    const agent = await loginAs("alice");
    const res = await agent.post("/api/subscription/streak-insurance");
    expect(res.status).toBe(403);
    expect(res.body.upgrade).toBe(true);
  });

  it("POST /api/squads/:id/broadcast", async () => {
    const agent = await loginAs("alice");
    const res = await agent.post("/api/squads/fake-squad-id/broadcast").send({ milestone: "10 deuces!" });
    expect(res.status).toBe(403);
    expect(res.body.upgrade).toBe(true);
  });

  it("GET /api/challenges/today", async () => {
    const agent = await loginAs("alice");
    const res = await agent.get("/api/challenges/today");
    expect(res.status).toBe(403);
    expect(res.body.upgrade).toBe(true);
  });

  it("POST /api/challenges/complete", async () => {
    const agent = await loginAs("alice");
    const res = await agent.post("/api/challenges/complete");
    expect(res.status).toBe(403);
    expect(res.body.upgrade).toBe(true);
  });

  it("PUT /api/notifications/reminder", async () => {
    const agent = await loginAs("alice");
    const res = await agent.put("/api/notifications/reminder").send({ hour: 9, minute: 0 });
    expect(res.status).toBe(403);
    expect(res.body.upgrade).toBe(true);
  });

  it("GET /api/referral/stats", async () => {
    const agent = await loginAs("alice");
    const res = await agent.get("/api/referral/stats");
    expect(res.status).toBe(403);
    expect(res.body.message).toMatch(/premium required/i);
  });
});
