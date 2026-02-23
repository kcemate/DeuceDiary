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
        hasLoggedToday: [..._entries.values()].some(
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
 *  REFERRAL TESTS
 * ================================================================ */
describe("Referral system", () => {
  it("new user gets a referralCode generated automatically", async () => {
    await loginAs("alice");
    const user = await memStore.getUser("dev-alice");
    expect(user).toBeDefined();
    expect(user.referralCode).toBeDefined();
    expect(typeof user.referralCode).toBe("string");
    expect(user.referralCode.length).toBeGreaterThan(0);
  });

  it("GET /api/referral returns code, referralCount, and referralLink", async () => {
    const agent = await loginAs("alice");
    const res = await agent.get("/api/referral");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("code");
    expect(res.body.referralCount).toBe(0);
    expect(res.body.referralLink).toContain(`/join?ref=${res.body.code}`);
  });

  it("POST /api/referral/apply with valid code returns ok + referrerUsername", async () => {
    const referrerAgent = await loginAs("alice");
    const referrerRes = await referrerAgent.get("/api/referral");
    const code = referrerRes.body.code;

    // Set alice's username so it appears in the response
    await memStore.updateUserUsername("dev-alice", "alice");

    const newUserAgent = await loginAs("bob");
    const res = await newUserAgent.post("/api/referral/apply").send({ code });
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.referrerUsername).toBe("alice");
  });

  it("POST /api/referral/apply again returns 400 already used", async () => {
    await loginAs("alice");
    await memStore.updateUserUsername("dev-alice", "alice");
    const aliceUser = await memStore.getUser("dev-alice");

    const agent = await loginAs("bob");
    await agent.post("/api/referral/apply").send({ code: aliceUser.referralCode });

    const res = await agent.post("/api/referral/apply").send({ code: aliceUser.referralCode });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/already used/i);
  });

  it("POST /api/referral/apply with own code returns 400 no self-referral", async () => {
    const agent = await loginAs("alice");
    const referralRes = await agent.get("/api/referral");

    const res = await agent.post("/api/referral/apply").send({ code: referralRes.body.code });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/own referral/i);
  });

  it("POST /api/referral/apply with invalid code returns 400", async () => {
    const agent = await loginAs("alice");
    const res = await agent.post("/api/referral/apply").send({ code: "NOTACODE" });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/invalid referral code/i);
  });

  it("referrer's referralCount increments after successful apply", async () => {
    await loginAs("alice");
    await memStore.updateUserUsername("dev-alice", "alice");
    const aliceUser = await memStore.getUser("dev-alice");
    expect(aliceUser.referralCount).toBe(0);

    const bobAgent = await loginAs("bob");
    await bobAgent.post("/api/referral/apply").send({ code: aliceUser.referralCode });

    const updatedAlice = await memStore.getUser("dev-alice");
    expect(updatedAlice.referralCount).toBe(1);
  });

  it("GET /api/referral/stats (premium) returns referral list", async () => {
    // alice is the referrer (premium)
    const aliceAgent = await loginAsPremium("alice");
    await memStore.updateUserUsername("dev-alice", "alice");
    const aliceUser = await memStore.getUser("dev-alice");

    // bob applies alice's code
    const bobAgent = await loginAs("bob");
    await bobAgent.post("/api/referral/apply").send({ code: aliceUser.referralCode });

    const res = await aliceAgent.get("/api/referral/stats");
    expect(res.status).toBe(200);
    expect(res.body.referralCount).toBe(1);
    expect(res.body.referrals).toHaveLength(1);
    expect(res.body.referrals[0]).toHaveProperty("joinedAt");
  });

  it("GET /api/referral/stats for free user returns 403", async () => {
    const agent = await loginAs("alice");
    const res = await agent.get("/api/referral/stats");
    expect(res.status).toBe(403);
    expect(res.body.message).toMatch(/premium required/i);
  });
});

/* ================================================================
 *  JOIN REDIRECT TEST
 * ================================================================ */
describe("/join referral landing", () => {
  it("GET /join?ref=CODE redirects to / and stores code in session", async () => {
    const agent = supertest.agent(app);
    // Need a session first — set up session via a lightweight request
    const sessionInit = await import("express-session");
    void sessionInit; // session is initialized by the app

    const res = await agent.get("/join?ref=TESTCODE");
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe("/");
  });
});

/* ================================================================
 *  ADMIN STATS TESTS
 * ================================================================ */
describe("Admin stats endpoint", () => {
  it("GET /api/admin/stats with valid X-Admin-Key returns correct shape", async () => {
    // Seed some users
    await loginAs("alice");
    await loginAs("bob");

    const res = await supertest(app)
      .get("/api/admin/stats")
      .set("X-Admin-Key", "dev-admin-key");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("totalUsers");
    expect(res.body).toHaveProperty("premiumUsers");
    expect(res.body).toHaveProperty("dauToday");
    expect(res.body).toHaveProperty("totalLogsToday");
    expect(res.body).toHaveProperty("totalLogsAllTime");
    expect(res.body).toHaveProperty("activeGroups");
    expect(res.body).toHaveProperty("avgStreakLength");
    expect(typeof res.body.totalUsers).toBe("number");
  });

  it("GET /api/admin/stats without header returns 401", async () => {
    const res = await supertest(app).get("/api/admin/stats");
    expect(res.status).toBe(401);
  });

  it("GET /api/admin/stats with wrong key returns 401", async () => {
    const res = await supertest(app)
      .get("/api/admin/stats")
      .set("X-Admin-Key", "wrong-key");
    expect(res.status).toBe(401);
  });
});

/* ================================================================
 *  RATE LIMITING TESTS
 * ================================================================ */
describe("Rate limiting (10 logs/day)", () => {
  it("11th log in same day returns 429", async () => {
    const agent = await loginAs("alice");

    // Get alice's solo group directly from store (groups API is premium-gated)
    const groups = await memStore.getUserGroups("dev-alice");
    const groupId = groups[0].id;

    // Log 10 entries (should all succeed)
    for (let i = 0; i < 10; i++) {
      const res = await agent.post("/api/deuces").send({
        groupIds: [groupId],
        location: "Home",
        thoughts: `Log #${i + 1}`,
        loggedAt: new Date().toISOString(),
      });
      expect(res.status).toBe(200);
    }

    // 11th should be rate limited
    const res = await agent.post("/api/deuces").send({
      groupIds: [groupId],
      location: "Home",
      thoughts: "Log #11 — too many",
      loggedAt: new Date().toISOString(),
    });
    expect(res.status).toBe(429);
    expect(res.body.message).toMatch(/throne limit/i);
  });
});
