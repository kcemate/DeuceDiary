import { TEST_SESSION_SECRET, TEST_ADMIN_KEY, TEST_INTERNAL_KEY, TEST_WEBHOOK_SECRET } from "./test-constants";
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
  const _streaks = new Map<string, { currentStreak: number; longestStreak: number; lastStreakDate: string | null }>();
  let _memberId = 1;
  let _locationId = 1;
  let _reactionId = 1;

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

    /* ---- Premium analytics ---- */
    async getPremiumAnalytics(userId: string) {
      const userEntries = [..._entries.values()].filter((e) => e.userId === userId);
      const groupIds = _members.filter((m) => m.userId === userId).map((m) => m.groupId);
      let longestStreak = 0;
      let currentStreak = 0;
      for (const gid of groupIds) {
        const s = _streaks.get(gid);
        if (s) {
          longestStreak = Math.max(longestStreak, s.longestStreak);
          currentStreak = Math.max(currentStreak, s.currentStreak);
        }
      }
      return {
        totalDeuces: userEntries.length,
        avgPerWeek: userEntries.length,
        longestStreak,
        currentStreak,
        bestDay: { day: "Monday", count: userEntries.length },
        groupRankings: groupIds.map((gid) => {
          const g = _groups.get(gid);
          return { groupId: gid, groupName: g?.name ?? "Unknown", rank: 1, total: 1 };
        }),
      };
    },

    /* ---- Group ops ---- */
    async createGroup(group: any) {
      const newGroup = {
        id: group.id,
        name: group.name,
        description: group.description ?? null,
        createdBy: group.createdBy,
        currentStreak: 0,
        longestStreak: 0,
        lastStreakDate: null,
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

    /* ---- Deuce entry ops ---- */
    async createDeuceEntry(entry: any) {
      const e = {
        id: entry.id,
        userId: entry.userId,
        groupId: entry.groupId,
        location: entry.location,
        thoughts: entry.thoughts,
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
          const entryReactions = _reactions.filter((r: any) => r.entryId === e.id);
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
    async getGroupStreak(groupId: string) {
      return _streaks.get(groupId) ?? { currentStreak: 0, longestStreak: 0, lastStreakDate: null as string | null };
    },
    async getGroupStreaksBatch(groupIds: string[]) {
      const map = new Map<string, { currentStreak: number; longestStreak: number; lastStreakDate: string | null }>();
      for (const id of groupIds) {
        map.set(id, await this.getGroupStreak(id));
      }
      return map;
    },
    async updateGroupStreak(groupId: string, currentStreak: number, longestStreak: number, lastStreakDate: string) {
      _streaks.set(groupId, { currentStreak, longestStreak, lastStreakDate });
    },
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

    /* ---- Stubs ---- */
    async getAllGroupsWithActiveStreaks(_minStreak: number) {
      return [];
    },
    async createStreakAlert(_alert: any) {
      return _alert;
    },
    async getGroupMemberCount(groupId: string) {
      return _members.filter((m) => m.groupId === groupId).length;
    },
    async getGroupDeuceCount(groupId: string) {
      return [..._entries.values()].filter((e) => e.groupId === groupId).length;
    },
    async getWeeklyReport(_userId: string) {
      return {
        totalDeuces: 0,
        peakDay: { date: "", count: 0 },
        mostActiveSquad: { name: "None", count: 0 },
        longestStreak: 0,
        funniestEntry: null,
        totalReactionsReceived: 0,
        weekOf: "",
      };
    },

    /* ---- Referral dashboard ---- */
    async getReferralDashboardStats(_userId: string) {
      return { totalReferrals: 0, premiumConversions: 0, pendingConversions: 0 };
    },
    async getReferralLeaderboard() {
      return [];
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
      _streaks.clear();
      _memberId = 1;
      _locationId = 1;
      _reactionId = 1;
    },
  };
});

/* ================================================================
 *  MODULE MOCKS
 * ================================================================ */
vi.mock("../db", () => ({ db: {}, pool: {} }));
vi.mock("../storage", () => ({ storage: memStore }));
vi.mock("@clerk/clerk-sdk-node", () => ({ createClerkClient: () => null }));

// Mock Svix so the Clerk webhook handler skips real signature verification in tests
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
    getSession: () => session({ secret: TEST_SESSION_SECRET, resave: false, saveUninitialized: false }),

    setupAuth: async (app: any) => {
      app.use(
        session({
          secret: TEST_SESSION_SECRET,
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
          res.json({ ok: true, user: { id: user.id, username: user.username, createdAt: user.createdAt } });
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
  process.env.CLERK_WEBHOOK_SECRET = TEST_WEBHOOK_SECRET;
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

/* ================================================================
 *  GET /api/subscription
 * ================================================================ */
describe("GET /api/subscription", () => {
  it("returns { tier: 'free' } for new user", async () => {
    const agent = await loginAs("alice");
    const res = await agent.get("/api/subscription");
    expect(res.status).toBe(200);
    expect(res.body.tier).toBe("free");
    expect(res.body.features).toEqual([]);
  });

  it("returns { tier: 'premium' } after upgrade", async () => {
    const agent = await loginAs("alice");
    await agent.post("/api/subscription/upgrade").send({ plan: "monthly" });

    const res = await agent.get("/api/subscription");
    expect(res.status).toBe(200);
    expect(res.body.tier).toBe("premium");
    expect(res.body.expiresAt).toBeDefined();
    expect(res.body.features).toContain("streak_insurance");
    expect(res.body.features).toContain("detailed_analytics");
    expect(res.body.features).toContain("gold_badge");
  });
});

/* ================================================================
 *  POST /api/subscription/upgrade
 * ================================================================ */
describe("POST /api/subscription/upgrade", () => {
  it("sets tier to premium (monthly)", async () => {
    const agent = await loginAs("alice");
    const res = await agent.post("/api/subscription/upgrade").send({ plan: "monthly" });
    expect(res.status).toBe(200);
    expect(res.body.subscription).toBe("premium");
    expect(res.body.subscriptionExpiresAt).toBeDefined();
  });

  it("sets tier to premium (annual)", async () => {
    const agent = await loginAs("alice");
    const res = await agent.post("/api/subscription/upgrade").send({ plan: "annual" });
    expect(res.status).toBe(200);
    expect(res.body.subscription).toBe("premium");

    // Annual plan expires ~1 year from now
    const expiresAt = new Date(res.body.subscriptionExpiresAt);
    const elevenMonthsFromNow = new Date();
    elevenMonthsFromNow.setMonth(elevenMonthsFromNow.getMonth() + 11);
    expect(expiresAt.getTime()).toBeGreaterThan(elevenMonthsFromNow.getTime());
  });

  it("requires authentication", async () => {
    const res = await supertest(app)
      .post("/api/subscription/upgrade")
      .send({ plan: "monthly" });
    expect(res.status).toBe(401);
  });
});

/* ================================================================
 *  GET /api/analytics/me  (premium-gated)
 * ================================================================ */
describe("GET /api/analytics/me", () => {
  it("returns 403 with { upgrade: true } for free user", async () => {
    const agent = await loginAs("alice");
    const res = await agent.get("/api/analytics/me");
    expect(res.status).toBe(403);
    expect(res.body.upgrade).toBe(true);
  });

  it("returns analytics object for premium user", async () => {
    const agent = await loginAs("alice");
    await agent.post("/api/subscription/upgrade").send({ plan: "monthly" });

    const res = await agent.get("/api/analytics/me");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("totalDeuces");
    expect(res.body).toHaveProperty("avgPerWeek");
    expect(res.body).toHaveProperty("longestStreak");
    expect(res.body).toHaveProperty("currentStreak");
    expect(res.body).toHaveProperty("bestDay");
    expect(res.body).toHaveProperty("groupRankings");
  });
});

/* ================================================================
 *  POST /api/subscription/streak-insurance  (premium-gated)
 * ================================================================ */
describe("POST /api/subscription/streak-insurance", () => {
  it("returns 403 for free user", async () => {
    const agent = await loginAs("alice");
    const res = await agent.post("/api/subscription/streak-insurance");
    expect(res.status).toBe(403);
    expect(res.body.upgrade).toBe(true);
  });

  it("activates streak insurance for premium user", async () => {
    const agent = await loginAs("alice");
    await agent.post("/api/subscription/upgrade").send({ plan: "monthly" });

    const res = await agent.post("/api/subscription/streak-insurance");
    expect(res.status).toBe(200);
    expect(res.body.used).toBe(true);
  });

  it("rejects double-use within the same month", async () => {
    const agent = await loginAs("alice");
    await agent.post("/api/subscription/upgrade").send({ plan: "monthly" });

    await agent.post("/api/subscription/streak-insurance");
    const res = await agent.post("/api/subscription/streak-insurance");
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/already used/i);
  });
});

/* ================================================================
 *  POST /api/webhooks/clerk — subscription events
 * ================================================================ */
function clerkSubWebhook(app: any, type: string, data: Record<string, unknown>) {
  return supertest(app)
    .post("/api/webhooks/clerk")
    .set("content-type", "application/json")
    .set("svix-id", "test-id")
    .set("svix-timestamp", String(Date.now()))
    .set("svix-signature", "v1,test-sig")
    .send(JSON.stringify({ type, data }));
}

describe("POST /api/webhooks/clerk — subscription events", () => {
  const periodEnd = Math.floor((Date.now() + 30 * 24 * 60 * 60 * 1000) / 1000);

  it("subscription.created (active) sets user to premium", async () => {
    const agent = await loginAs("alice");
    const userId = "dev-alice";

    await clerkSubWebhook(app, "subscription.created", {
      user_id: userId,
      status: "active",
      current_period_end: periodEnd,
    }).expect(200);

    const res = await agent.get("/api/subscription");
    expect(res.status).toBe(200);
    expect(res.body.tier).toBe("premium");
  });

  it("subscription.deleted sets user back to free", async () => {
    const agent = await loginAs("alice");
    const userId = "dev-alice";

    await clerkSubWebhook(app, "subscription.created", {
      user_id: userId,
      status: "active",
      current_period_end: periodEnd,
    }).expect(200);

    await clerkSubWebhook(app, "subscription.deleted", {
      user_id: userId,
    }).expect(200);

    const res = await agent.get("/api/subscription");
    expect(res.status).toBe(200);
    expect(res.body.tier).toBe("free");
  });

  it("rejects webhook with missing svix headers", async () => {
    const res = await supertest(app)
      .post("/api/webhooks/clerk")
      .set("content-type", "application/json")
      .send(JSON.stringify({ type: "subscription.created", data: {} }));
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/missing svix headers/i);
  });
});
