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
  let _pushTokens: any[] = [];
  let _memberId = 1;
  let _locationId = 1;
  let _reactionId = 1;
  let _broadcastId = 1;
  let _challengeId = 1;
  let _referralId = 1;
  let _pushTokenId = 1;

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
        username: existing?.username ?? null,
        profileImageUrl: data.profileImageUrl ?? existing?.profileImageUrl ?? null,
        deuceCount: existing?.deuceCount ?? 0,
        subscription: existing?.subscription ?? "free",
        subscriptionExpiresAt: existing?.subscriptionExpiresAt ?? null,
        streakInsuranceUsed: existing?.streakInsuranceUsed ?? false,
        theme: existing?.theme ?? "default",
        reminderHour: existing?.reminderHour ?? null,
        reminderMinute: existing?.reminderMinute ?? null,
        referralCode:
          existing?.referralCode ??
          Math.random().toString(36).substring(2, 10).toUpperCase(),
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
    async updateUserSubscription(
      userId: string,
      subscription: string,
      expiresAt: Date,
    ) {
      const user = _users.get(userId);
      if (!user) throw new Error("User not found");
      user.subscription = subscription;
      user.subscriptionExpiresAt = expiresAt;
      user.updatedAt = new Date();
      return user;
    },
    async useStreakInsurance(userId: string) {
      const user = _users.get(userId);
      if (user) {
        user.streakInsuranceUsed = true;
        user.updatedAt = new Date();
      }
    },
    async resetStreakInsurance(userId: string) {
      const user = _users.get(userId);
      if (user) {
        user.streakInsuranceUsed = false;
        user.updatedAt = new Date();
      }
    },
    async resetAllStreakInsurance() {
      return 0;
    },

    /* ---- Premium analytics (stub) ---- */
    async getPremiumAnalytics(_userId: string) {
      return {
        totalDeuces: 0,
        avgPerWeek: 0,
        longestStreak: 0,
        currentStreak: 0,
        bestDay: { day: "Monday", count: 0 },
        groupRankings: [],
      };
    },

    /* ---- Weekly report (stub) ---- */
    async getWeeklyReport(_userId: string) {
      return {
        totalDeuces: 0,
        peakDay: { date: "2026-01-01", count: 0 },
        mostActiveSquad: { name: "None", count: 0 },
        longestStreak: 0,
        funniestEntry: null,
        totalReactionsReceived: 0,
        weekOf: "2026-01-01",
      };
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
      const ids = _members
        .filter((m) => m.userId === userId)
        .map((m) => m.groupId);
      return ids.map((gid) => {
        const g = _groups.get(gid)!;
        const memberCount = _members.filter((m) => m.groupId === gid).length;
        const groupEntries = [..._entries.values()].filter(
          (e) => e.groupId === gid,
        );
        return {
          ...g,
          memberCount,
          entryCount: groupEntries.length,
          lastActivity: groupEntries.length
            ? new Date(
                Math.max(
                  ...groupEntries.map((e: any) =>
                    (e.createdAt ?? new Date()).getTime(),
                  ),
                ),
              )
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
        .map((m) => ({
          ...m,
          user: { ..._users.get(m.userId)!, personalRecord: undefined },
        }));
    },
    async isUserInGroup(userId: string, groupId: string) {
      return _members.some(
        (m) => m.userId === userId && m.groupId === groupId,
      );
    },
    async removeGroupMember(userId: string, groupId: string) {
      _members = _members.filter(
        (m) => !(m.userId === userId && m.groupId === groupId),
      );
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
          const entryReactions = _reactions.filter(
            (r: any) => r.entryId === e.id,
          );
          return {
            ...e,
            user: user
              ? {
                  id: user.id,
                  username: user.username,
                  profileImageUrl: user.profileImageUrl,
                }
              : undefined,
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
      const arr = [...byDate.entries()].map(([date, count]) => ({
        date,
        count,
      }));
      if (arr.length === 0) return undefined;
      return arr.reduce((mx, c) => (c.count > mx.count ? c : mx), arr[0]);
    },

    /* ---- Streak ops ---- */
    async getGroupStreak(_groupId: string) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        lastStreakDate: null as string | null,
      };
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
      return memberIds.map((uid) => {
        const user = _users.get(uid);
        return {
          userId: uid,
          username: user?.username ?? null,
          firstName: user?.firstName ?? null,
          profileImageUrl: user?.profileImageUrl ?? null,
          hasLogged: [..._entries.values()].some(
            (e) => e.groupId === groupId && e.userId === uid,
          ),
        };
      });
    },

    /* ---- Streak alert ops ---- */
    async getAllGroupsWithActiveStreaks(_minStreak: number) {
      return [];
    },
    async createStreakAlert(_alert: any) {
      return { id: 1 };
    },

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
        (r) =>
          r.entryId === reaction.entryId &&
          r.userId === reaction.userId &&
          r.emoji === reaction.emoji,
      );
      if (exists)
        throw new Error("duplicate key value violates unique constraint");
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
        (r) =>
          !(r.userId === userId && r.entryId === entryId && r.emoji === emoji),
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
      const existing = _pushTokens.find(
        (t) => t.userId === token.userId && t.token === token.token,
      );
      if (existing) return existing;
      const t = { id: _pushTokenId++, ...token, createdAt: new Date() };
      _pushTokens.push(t);
      return t;
    },
    async getUserPushTokens(userId: string) {
      return _pushTokens.filter((t) => t.userId === userId);
    },
    async deletePushToken(userId: string, token: string) {
      _pushTokens = _pushTokens.filter(
        (t) => !(t.userId === userId && t.token === token),
      );
    },
    async getGroupPushTokens(groupId: string) {
      const memberIds = _members
        .filter((m) => m.groupId === groupId)
        .map((m) => m.userId);
      return _pushTokens.filter((t) => memberIds.includes(t.userId));
    },

    /* ---- Broadcast ops ---- */
    async createBroadcast(broadcast: any) {
      const b = {
        id: _broadcastId++,
        ...broadcast,
        createdAt: new Date(),
      };
      _broadcasts.push(b);
      return b;
    },

    /* ---- Daily challenge ops ---- */
    async getDailyChallengeCompletion(
      userId: string,
      challengeDate: string,
    ) {
      return _challengeCompletions.find(
        (c) => c.userId === userId && c.challengeDate === challengeDate,
      );
    },
    async completeDailyChallenge(completion: any) {
      const c = {
        id: _challengeId++,
        ...completion,
        createdAt: new Date(),
      };
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
        .sort(
          (a, b) =>
            (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
        )
        .map((r) => {
          const referee = _users.get(r.refereeId);
          return {
            username: referee?.username ?? null,
            joinedAt: r.createdAt,
          };
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
        premiumUsers: [..._users.values()].filter(
          (u) => u.subscription === "premium",
        ).length,
        dauToday: 0,
        totalLogsToday: 0,
        totalLogsAllTime: _entries.size,
        activeGroups: _groups.size,
        avgStreakLength: 0,
      };
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
      _broadcasts = [];
      _challengeCompletions = [];
      _referrals = [];
      _pushTokens = [];
      _memberId = 1;
      _locationId = 1;
      _reactionId = 1;
      _broadcastId = 1;
      _challengeId = 1;
      _referralId = 1;
      _pushTokenId = 1;
    },

    /** Expose internals for test seeding */
    _seedEntry(entry: any) {
      _entries.set(entry.id, entry);
    },
    _seedMember(member: any) {
      _members.push({ id: _memberId++, ...member, joinedAt: new Date() });
    },
    _seedGroup(group: any) {
      _groups.set(group.id, group);
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
          if (err)
            return res
              .status(500)
              .json({ message: "Failed to save session" });
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
  await memStore.updateUserSubscription(
    userId,
    "premium",
    new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
  );
  return agent;
}

/** Helper: get the solo group ID for a user who logged in. */
async function getSoloGroupId(username: string): Promise<string> {
  const userId = `dev-${username.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
  const groups = await memStore.getUserGroups(userId);
  return groups[0].id;
}

/* ================================================================
 *  1. GET /api/health
 * ================================================================ */
describe("GET /api/health", () => {
  it("returns { status: 'ok', timestamp } without auth", async () => {
    const res = await supertest(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(res.body.timestamp).toBeDefined();
    // timestamp should be a valid ISO string
    expect(new Date(res.body.timestamp).toISOString()).toBe(
      res.body.timestamp,
    );
  });
});

/* ================================================================
 *  2. GET /api/auth/user
 * ================================================================ */
describe("GET /api/auth/user", () => {
  it("returns user profile for authenticated user", async () => {
    const agent = await loginAs("alice");
    const res = await agent.get("/api/auth/user");
    expect(res.status).toBe(200);
    expect(res.body.id).toBe("dev-alice");
    expect(res.body).toHaveProperty("title");
    expect(res.body).toHaveProperty("subscription");
    expect(res.body).toHaveProperty("subscriptionExpiresAt");
    expect(res.body).toHaveProperty("streakInsuranceUsed");
    expect(res.body.subscription).toBe("free");
    expect(res.body.title).toBe("Rookie");
  });

  it("returns 401 for unauthenticated request", async () => {
    const res = await supertest(app).get("/api/auth/user");
    expect(res.status).toBe(401);
  });
});

/* ================================================================
 *  3. PUT /api/auth/user
 * ================================================================ */
describe("PUT /api/auth/user", () => {
  it("sets username successfully", async () => {
    const agent = await loginAs("alice");
    const res = await agent
      .put("/api/auth/user")
      .send({ username: "AliceCool" });
    expect(res.status).toBe(200);
    expect(res.body.username).toBe("AliceCool");
  });

  it("returns error for missing username (empty body)", async () => {
    const agent = await loginAs("alice");
    const res = await agent.put("/api/auth/user").send({});
    expect(res.status).toBe(500);
  });

  it("returns error for username too short", async () => {
    const agent = await loginAs("alice");
    const res = await agent.put("/api/auth/user").send({ username: "ab" });
    // Zod validation rejects < 3 chars, caught as 500 (generic error handler)
    expect(res.status).toBe(500);
  });

  it("returns 400 for duplicate username", async () => {
    const agent1 = await loginAs("alice");
    await agent1.put("/api/auth/user").send({ username: "TakenName" });

    const agent2 = await loginAs("bob");
    const res = await agent2
      .put("/api/auth/user")
      .send({ username: "TakenName" });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/already taken/i);
  });

  it("returns 401 for unauthenticated request", async () => {
    const res = await supertest(app)
      .put("/api/auth/user")
      .send({ username: "test" });
    expect(res.status).toBe(401);
  });
});

/* ================================================================
 *  4. GET /api/groups/:groupId  (free)
 * ================================================================ */
describe("GET /api/groups/:groupId", () => {
  it("returns group details with members and entries for premium member", async () => {
    const agent = await loginAsPremium("alice");
    const groupId = await getSoloGroupId("alice");

    const res = await agent.get(`/api/groups/${groupId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("group");
    expect(res.body).toHaveProperty("members");
    expect(res.body).toHaveProperty("entries");
    expect(res.body.group.id).toBe(groupId);
    expect(res.body.members.length).toBeGreaterThanOrEqual(1);
    expect(Array.isArray(res.body.entries)).toBe(true);
  });

  it("returns 403 for non-member of the group", async () => {
    const agent = await loginAsPremium("alice");
    // bob creates a group that alice is NOT in
    await loginAsPremium("bob");
    const bobGroupId = await getSoloGroupId("bob");

    const res = await agent.get(`/api/groups/${bobGroupId}`);
    expect(res.status).toBe(403);
    expect(res.body.message).toMatch(/not authorized/i);
  });

  it("returns 200 for free user (route is now free)", async () => {
    const agent = await loginAs("alice");
    const groupId = await getSoloGroupId("alice");

    const res = await agent.get(`/api/groups/${groupId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("group");
    expect(res.body).toHaveProperty("members");
    expect(res.body).toHaveProperty("entries");
  });
});

/* ================================================================
 *  5. GET /api/groups/:groupId/spy  (premium-gated)
 * ================================================================ */
describe("GET /api/groups/:groupId/spy", () => {
  it("returns typical hours for premium member", async () => {
    const agent = await loginAsPremium("alice");
    const groupId = await getSoloGroupId("alice");

    const res = await agent.get(`/api/groups/${groupId}/spy`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("returns 403 for non-member of the group", async () => {
    const agent = await loginAsPremium("alice");
    await loginAsPremium("bob");
    const bobGroupId = await getSoloGroupId("bob");

    const res = await agent.get(`/api/groups/${bobGroupId}/spy`);
    expect(res.status).toBe(403);
    expect(res.body.message).toMatch(/not authorized/i);
  });

  it("returns 403 for free user", async () => {
    const agent = await loginAs("alice");
    const groupId = await getSoloGroupId("alice");

    const res = await agent.get(`/api/groups/${groupId}/spy`);
    expect(res.status).toBe(403);
    expect(res.body.upgrade).toBe(true);
  });
});

/* ================================================================
 *  6. GET /api/deuces?groupId=X  (free feed)
 * ================================================================ */
describe("GET /api/deuces", () => {
  it("returns feed entries for premium user with groupId filter", async () => {
    const agent = await loginAsPremium("alice");
    const groupId = await getSoloGroupId("alice");

    // Log a deuce first
    await agent.post("/api/deuces").send({
      groupIds: [groupId],
      location: "Home",
      thoughts: "Test entry",
      loggedAt: new Date().toISOString(),
    });

    const res = await agent.get(`/api/deuces?groupId=${groupId}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].thoughts).toBe("Test entry");
  });

  it("returns feed entries across all groups when no groupId specified", async () => {
    const agent = await loginAsPremium("alice");
    const groupId = await getSoloGroupId("alice");

    await agent.post("/api/deuces").send({
      groupIds: [groupId],
      location: "Office",
      thoughts: "All-groups feed",
      loggedAt: new Date().toISOString(),
    });

    const res = await agent.get("/api/deuces");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it("returns 403 for non-member accessing groupId feed", async () => {
    const agent = await loginAsPremium("alice");
    await loginAsPremium("bob");
    const bobGroupId = await getSoloGroupId("bob");

    const res = await agent.get(`/api/deuces?groupId=${bobGroupId}`);
    expect(res.status).toBe(403);
    expect(res.body.message).toMatch(/not authorized/i);
  });

  it("returns 200 for free user (feed is now free)", async () => {
    const agent = await loginAs("alice");
    const groupId = await getSoloGroupId("alice");

    const res = await agent.get(`/api/deuces?groupId=${groupId}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

/* ================================================================
 *  7. DELETE /api/entries/:entryId/reactions  (free)
 * ================================================================ */
describe("DELETE /api/entries/:entryId/reactions", () => {
  it("removes a reaction successfully", async () => {
    const agent = await loginAsPremium("alice");
    const groupId = await getSoloGroupId("alice");

    // Create an entry
    const entryRes = await agent.post("/api/deuces").send({
      groupIds: [groupId],
      location: "Home",
      thoughts: "Reaction test",
      loggedAt: new Date().toISOString(),
    });
    const entryId = entryRes.body.entries[0].id;

    // Add a reaction
    await agent
      .post(`/api/entries/${entryId}/reactions`)
      .send({ emoji: "fire" });

    // Remove the reaction
    const res = await agent
      .delete(`/api/entries/${entryId}/reactions`)
      .send({ emoji: "fire" });
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/removed/i);

    // Verify the reaction is gone
    const listRes = await agent.get(`/api/entries/${entryId}/reactions`);
    expect(listRes.body.length).toBe(0);
  });

  it("returns error when emoji is missing", async () => {
    const agent = await loginAsPremium("alice");
    const res = await agent
      .delete("/api/entries/some-entry/reactions")
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/emoji is required/i);
  });

  it("is accessible to free users (reactions are now free)", async () => {
    const agent = await loginAs("alice");
    const res = await agent
      .delete("/api/entries/some-entry/reactions")
      .send({ emoji: "fire" });
    // Should not return 403 upgrade-gate; may return 200 or 404 depending on entry
    expect(res.status).not.toBe(403);
  });
});

/* ================================================================
 *  8. GET /api/entries/:entryId/reactions  (free)
 * ================================================================ */
describe("GET /api/entries/:entryId/reactions", () => {
  it("lists reactions for an entry", async () => {
    const agent = await loginAsPremium("alice");
    const groupId = await getSoloGroupId("alice");

    // Create an entry
    const entryRes = await agent.post("/api/deuces").send({
      groupIds: [groupId],
      location: "Home",
      thoughts: "List reactions test",
      loggedAt: new Date().toISOString(),
    });
    const entryId = entryRes.body.entries[0].id;

    // Add two reactions
    await agent
      .post(`/api/entries/${entryId}/reactions`)
      .send({ emoji: "fire" });
    await agent
      .post(`/api/entries/${entryId}/reactions`)
      .send({ emoji: "poop" });

    const res = await agent.get(`/api/entries/${entryId}/reactions`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
    expect(res.body[0]).toHaveProperty("emoji");
    expect(res.body[0]).toHaveProperty("userId");
  });

  it("returns empty array when no reactions exist", async () => {
    const agent = await loginAsPremium("alice");
    const groupId = await getSoloGroupId("alice");

    const entryRes = await agent.post("/api/deuces").send({
      groupIds: [groupId],
      location: "Home",
      thoughts: "No reactions",
      loggedAt: new Date().toISOString(),
    });
    const entryId = entryRes.body.entries[0].id;

    const res = await agent.get(`/api/entries/${entryId}/reactions`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("is accessible to free users (reactions are now free)", async () => {
    const agent = await loginAs("alice");
    const res = await agent.get("/api/entries/some-entry/reactions");
    // Should not return 403 upgrade-gate; may return 200 or empty array
    expect(res.status).not.toBe(403);
  });
});

/* ================================================================
 *  9. GET /api/locations  (no auth)
 * ================================================================ */
describe("GET /api/locations", () => {
  it("returns locations list without requiring auth", async () => {
    const res = await supertest(app).get("/api/locations");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("returns seeded locations sorted by isDefault then name", async () => {
    await memStore.createLocation({
      name: "Bathroom",
      isDefault: true,
    });
    await memStore.createLocation({
      name: "Airport",
      isDefault: false,
      createdBy: "dev-alice",
    });

    const res = await supertest(app).get("/api/locations");
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
    // Default locations sort first
    expect(res.body[0].name).toBe("Bathroom");
    expect(res.body[0].isDefault).toBe(true);
    expect(res.body[1].name).toBe("Airport");
  });
});

/* ================================================================
 *  10. POST /api/locations  (auth required)
 * ================================================================ */
describe("POST /api/locations", () => {
  it("creates a custom location for authenticated user", async () => {
    const agent = await loginAs("alice");
    const res = await agent
      .post("/api/locations")
      .send({ name: "Coffee Shop" });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Coffee Shop");
    expect(res.body.isDefault).toBe(false);
    expect(res.body.createdBy).toBe("dev-alice");
    expect(res.body).toHaveProperty("id");
  });

  it("returns 400 for missing location name", async () => {
    const agent = await loginAs("alice");
    const res = await agent.post("/api/locations").send({});
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/name is required/i);
  });

  it("returns 400 for empty/whitespace name", async () => {
    const agent = await loginAs("alice");
    const res = await agent.post("/api/locations").send({ name: "   " });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/name is required/i);
  });

  it("returns 400 for duplicate location name", async () => {
    const agent = await loginAs("alice");
    await agent.post("/api/locations").send({ name: "Library" });
    const res = await agent.post("/api/locations").send({ name: "Library" });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/already exists/i);
  });

  it("returns 401 for unauthenticated request", async () => {
    const res = await supertest(app)
      .post("/api/locations")
      .send({ name: "Test" });
    expect(res.status).toBe(401);
  });
});

/* ================================================================
 *  11. GET /api/analytics/most-deuces  (premium-gated)
 * ================================================================ */
describe("GET /api/analytics/most-deuces", () => {
  it("returns best day for premium user with entries", async () => {
    const agent = await loginAsPremium("alice");
    const groupId = await getSoloGroupId("alice");

    // Log a couple of deuces
    await agent.post("/api/deuces").send({
      groupIds: [groupId],
      location: "Home",
      thoughts: "Entry 1",
      loggedAt: new Date().toISOString(),
    });
    await agent.post("/api/deuces").send({
      groupIds: [groupId],
      location: "Office",
      thoughts: "Entry 2",
      loggedAt: new Date().toISOString(),
    });

    const res = await agent.get("/api/analytics/most-deuces");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("date");
    expect(res.body).toHaveProperty("count");
    expect(res.body.count).toBe(2);
  });

  it("returns zero count for premium user with no entries", async () => {
    const agent = await loginAsPremium("alice");
    const res = await agent.get("/api/analytics/most-deuces");
    expect(res.status).toBe(200);
    expect(res.body.count).toBe(0);
    expect(res.body.date).toBe("");
  });

  it("returns 403 for free user", async () => {
    const agent = await loginAs("alice");
    const res = await agent.get("/api/analytics/most-deuces");
    expect(res.status).toBe(403);
    expect(res.body.upgrade).toBe(true);
  });
});

/* ================================================================
 *  12. GET /api/users/:userId/weekly-report  (premium-gated)
 * ================================================================ */
describe("GET /api/users/:userId/weekly-report", () => {
  it("returns weekly report for premium user using 'me'", async () => {
    const agent = await loginAsPremium("alice");
    const res = await agent.get("/api/users/me/weekly-report");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("totalDeuces");
    expect(res.body).toHaveProperty("peakDay");
    expect(res.body).toHaveProperty("mostActiveSquad");
    expect(res.body).toHaveProperty("longestStreak");
    expect(res.body).toHaveProperty("weekOf");
  });

  it("returns weekly report for premium user using explicit userId", async () => {
    const agent = await loginAsPremium("alice");
    const res = await agent.get("/api/users/dev-alice/weekly-report");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("totalDeuces");
  });

  it("returns 403 for free user", async () => {
    const agent = await loginAs("alice");
    const res = await agent.get("/api/users/me/weekly-report");
    expect(res.status).toBe(403);
    expect(res.body.upgrade).toBe(true);
  });

  it("returns 401 for unauthenticated request", async () => {
    const res = await supertest(app).get("/api/users/me/weekly-report");
    expect(res.status).toBe(401);
  });
});

/* ================================================================
 *  13. POST /api/squads/:id/broadcast  (premium-gated)
 * ================================================================ */
describe("POST /api/squads/:id/broadcast", () => {
  it("creates a broadcast for premium member in the squad", async () => {
    const agent = await loginAsPremium("alice");
    const groupId = await getSoloGroupId("alice");

    const res = await agent
      .post(`/api/squads/${groupId}/broadcast`)
      .send({ milestone: "100 deuces!" });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("broadcast");
    expect(res.body).toHaveProperty("tokenCount");
    expect(res.body.broadcast.milestone).toBe("100 deuces!");
    expect(res.body.broadcast.groupId).toBe(groupId);
    expect(res.body.broadcast.userId).toBe("dev-alice");
    expect(typeof res.body.tokenCount).toBe("number");
  });

  it("returns 400 when milestone is missing", async () => {
    const agent = await loginAsPremium("alice");
    const groupId = await getSoloGroupId("alice");

    const res = await agent
      .post(`/api/squads/${groupId}/broadcast`)
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/milestone is required/i);
  });

  it("returns 403 for non-member of the squad", async () => {
    const agent = await loginAsPremium("alice");
    await loginAsPremium("bob");
    const bobGroupId = await getSoloGroupId("bob");

    const res = await agent
      .post(`/api/squads/${bobGroupId}/broadcast`)
      .send({ milestone: "Crash attempt" });
    expect(res.status).toBe(403);
    expect(res.body.message).toMatch(/not authorized/i);
  });

  it("returns 403 for free user", async () => {
    const agent = await loginAs("alice");
    const groupId = await getSoloGroupId("alice");

    const res = await agent
      .post(`/api/squads/${groupId}/broadcast`)
      .send({ milestone: "Free user attempt" });
    expect(res.status).toBe(403);
    expect(res.body.upgrade).toBe(true);
  });
});

/* ================================================================
 *  14. PUT /api/notifications/reminder  (premium-gated)
 * ================================================================ */
describe("PUT /api/notifications/reminder", () => {
  it("sets reminder time for premium user", async () => {
    const agent = await loginAsPremium("alice");
    const res = await agent
      .put("/api/notifications/reminder")
      .send({ hour: 9, minute: 30 });
    expect(res.status).toBe(200);
    expect(res.body.reminderHour).toBe(9);
    expect(res.body.reminderMinute).toBe(30);
  });

  it("accepts boundary values (hour=0, minute=0)", async () => {
    const agent = await loginAsPremium("alice");
    const res = await agent
      .put("/api/notifications/reminder")
      .send({ hour: 0, minute: 0 });
    expect(res.status).toBe(200);
    expect(res.body.reminderHour).toBe(0);
    expect(res.body.reminderMinute).toBe(0);
  });

  it("accepts boundary values (hour=23, minute=59)", async () => {
    const agent = await loginAsPremium("alice");
    const res = await agent
      .put("/api/notifications/reminder")
      .send({ hour: 23, minute: 59 });
    expect(res.status).toBe(200);
    expect(res.body.reminderHour).toBe(23);
    expect(res.body.reminderMinute).toBe(59);
  });

  it("returns 400 for invalid hour (out of range)", async () => {
    const agent = await loginAsPremium("alice");
    const res = await agent
      .put("/api/notifications/reminder")
      .send({ hour: 25, minute: 0 });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/hour/i);
  });

  it("returns 400 for invalid minute (out of range)", async () => {
    const agent = await loginAsPremium("alice");
    const res = await agent
      .put("/api/notifications/reminder")
      .send({ hour: 9, minute: 60 });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/minute/i);
  });

  it("returns 400 for missing hour", async () => {
    const agent = await loginAsPremium("alice");
    const res = await agent
      .put("/api/notifications/reminder")
      .send({ minute: 30 });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/hour/i);
  });

  it("returns 400 for non-numeric hour", async () => {
    const agent = await loginAsPremium("alice");
    const res = await agent
      .put("/api/notifications/reminder")
      .send({ hour: "nine", minute: 30 });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/hour/i);
  });

  it("returns 403 for free user", async () => {
    const agent = await loginAs("alice");
    const res = await agent
      .put("/api/notifications/reminder")
      .send({ hour: 9, minute: 30 });
    expect(res.status).toBe(403);
    expect(res.body.upgrade).toBe(true);
  });

  it("returns 401 for unauthenticated request", async () => {
    const res = await supertest(app)
      .put("/api/notifications/reminder")
      .send({ hour: 9, minute: 30 });
    expect(res.status).toBe(401);
  });
});
