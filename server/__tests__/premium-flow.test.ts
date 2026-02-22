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
    async resetAllStreakInsurance() {
      let count = 0;
      for (const [, user] of _users) {
        if (user.streakInsuranceUsed) {
          user.streakInsuranceUsed = false;
          user.updatedAt = new Date();
          count++;
        }
      }
      return count;
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

    /* ---- direct user access for test manipulation ---- */
    _getUser(id: string) {
      return _users.get(id);
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
 *  FULL PREMIUM USER JOURNEY  (E2E sequential flow)
 * ================================================================ */
describe("Premium subscription E2E flow", () => {
  it("walks through the complete free → premium → feature-access lifecycle", async () => {
    // 1. User signs up (free)
    const agent = await loginAs("journeyuser");

    // 2. GET /api/subscription → { tier: 'free' }
    const subFree = await agent.get("/api/subscription");
    expect(subFree.status).toBe(200);
    expect(subFree.body.tier).toBe("free");
    expect(subFree.body.features).toEqual([]);

    // 3. GET /api/analytics/me → 403 with { upgrade: true }
    const analyticsDenied = await agent.get("/api/analytics/me");
    expect(analyticsDenied.status).toBe(403);
    expect(analyticsDenied.body.upgrade).toBe(true);

    // 4. POST /api/subscription/upgrade → 200, user now premium
    const upgrade = await agent.post("/api/subscription/upgrade").send({ plan: "monthly" });
    expect(upgrade.status).toBe(200);
    expect(upgrade.body.subscription).toBe("premium");
    expect(upgrade.body.subscriptionExpiresAt).toBeDefined();

    // 5. GET /api/subscription → { tier: 'premium' }
    const subPremium = await agent.get("/api/subscription");
    expect(subPremium.status).toBe(200);
    expect(subPremium.body.tier).toBe("premium");
    expect(subPremium.body.features).toContain("streak_insurance");
    expect(subPremium.body.features).toContain("detailed_analytics");

    // 6. GET /api/analytics/me → 200 with analytics data
    const analytics = await agent.get("/api/analytics/me");
    expect(analytics.status).toBe(200);
    expect(analytics.body).toHaveProperty("totalDeuces");
    expect(analytics.body).toHaveProperty("avgPerWeek");
    expect(analytics.body).toHaveProperty("longestStreak");
    expect(analytics.body).toHaveProperty("currentStreak");
    expect(analytics.body).toHaveProperty("bestDay");
    expect(analytics.body).toHaveProperty("groupRankings");

    // 7. POST /api/subscription/streak-insurance → 200 (first use)
    const insurance1 = await agent.post("/api/subscription/streak-insurance");
    expect(insurance1.status).toBe(200);
    expect(insurance1.body.used).toBe(true);

    // 8. POST /api/subscription/streak-insurance → 400 (already used this month)
    const insurance2 = await agent.post("/api/subscription/streak-insurance");
    expect(insurance2.status).toBe(400);
    expect(insurance2.body.message).toMatch(/already used/i);
  });
});

/* ================================================================
 *  REVENUECAT WEBHOOK FLOW  (external purchase → status change)
 * ================================================================ */
describe("RevenueCat webhook → subscription state transitions", () => {
  it("INITIAL_PURCHASE sets user to premium", async () => {
    const agent = await loginAs("buyer");
    const userId = "dev-buyer";

    // Verify starts free
    const before = await agent.get("/api/subscription");
    expect(before.body.tier).toBe("free");

    // Simulate RevenueCat INITIAL_PURCHASE
    const expirationMs = Date.now() + 30 * 24 * 60 * 60 * 1000;
    await supertest(app)
      .post("/api/webhooks/revenuecat")
      .send({
        event: {
          type: "INITIAL_PURCHASE",
          app_user_id: userId,
          expiration_at_ms: expirationMs,
        },
      })
      .expect(200);

    // Verify now premium
    const after = await agent.get("/api/subscription");
    expect(after.body.tier).toBe("premium");
    expect(after.body.expiresAt).toBeDefined();

    // Verify premium features are now accessible
    const analytics = await agent.get("/api/analytics/me");
    expect(analytics.status).toBe(200);
  });

  it("CANCELLATION sets user back to free", async () => {
    const agent = await loginAs("canceller");
    const userId = "dev-canceller";

    // Purchase first
    await supertest(app)
      .post("/api/webhooks/revenuecat")
      .send({
        event: {
          type: "INITIAL_PURCHASE",
          app_user_id: userId,
          expiration_at_ms: Date.now() + 30 * 24 * 60 * 60 * 1000,
        },
      })
      .expect(200);

    // Confirm premium
    const mid = await agent.get("/api/subscription");
    expect(mid.body.tier).toBe("premium");

    // Cancel
    await supertest(app)
      .post("/api/webhooks/revenuecat")
      .send({
        event: {
          type: "CANCELLATION",
          app_user_id: userId,
        },
      })
      .expect(200);

    // Verify reverted to free
    const after = await agent.get("/api/subscription");
    expect(after.body.tier).toBe("free");

    // Verify premium features are blocked again
    const analytics = await agent.get("/api/analytics/me");
    expect(analytics.status).toBe(403);
    expect(analytics.body.upgrade).toBe(true);
  });

  it("RENEWAL extends an existing premium subscription", async () => {
    const agent = await loginAs("renewer");
    const userId = "dev-renewer";

    // Initial purchase
    const firstExpiration = Date.now() + 30 * 24 * 60 * 60 * 1000;
    await supertest(app)
      .post("/api/webhooks/revenuecat")
      .send({
        event: {
          type: "INITIAL_PURCHASE",
          app_user_id: userId,
          expiration_at_ms: firstExpiration,
        },
      })
      .expect(200);

    // Renewal with later expiration
    const renewedExpiration = Date.now() + 60 * 24 * 60 * 60 * 1000;
    await supertest(app)
      .post("/api/webhooks/revenuecat")
      .send({
        event: {
          type: "RENEWAL",
          app_user_id: userId,
          expiration_at_ms: renewedExpiration,
        },
      })
      .expect(200);

    // Still premium with updated expiration
    const sub = await agent.get("/api/subscription");
    expect(sub.body.tier).toBe("premium");
    const expiresAt = new Date(sub.body.expiresAt).getTime();
    expect(expiresAt).toBeGreaterThan(firstExpiration);
  });

  it("EXPIRATION event sets user back to free", async () => {
    const agent = await loginAs("expirer");
    const userId = "dev-expirer";

    // Purchase
    await supertest(app)
      .post("/api/webhooks/revenuecat")
      .send({
        event: {
          type: "INITIAL_PURCHASE",
          app_user_id: userId,
          expiration_at_ms: Date.now() + 30 * 24 * 60 * 60 * 1000,
        },
      })
      .expect(200);

    // Expire
    await supertest(app)
      .post("/api/webhooks/revenuecat")
      .send({
        event: {
          type: "EXPIRATION",
          app_user_id: userId,
        },
      })
      .expect(200);

    const after = await agent.get("/api/subscription");
    expect(after.body.tier).toBe("free");
  });

  it("rejects webhook with invalid payload", async () => {
    const res = await supertest(app)
      .post("/api/webhooks/revenuecat")
      .send({ garbage: true });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/invalid payload/i);
  });
});

/* ================================================================
 *  GET /api/auth/user — subscription fields present
 * ================================================================ */
describe("GET /api/auth/user includes subscription fields", () => {
  it("returns subscription, subscriptionExpiresAt, streakInsuranceUsed for free user", async () => {
    const agent = await loginAs("freeuser");
    const res = await agent.get("/api/auth/user");
    expect(res.status).toBe(200);
    expect(res.body.subscription).toBe("free");
    expect(res.body.subscriptionExpiresAt).toBeNull();
    expect(res.body.streakInsuranceUsed).toBe(false);
  });

  it("returns updated subscription fields after upgrade", async () => {
    const agent = await loginAs("upgrader");
    await agent.post("/api/subscription/upgrade").send({ plan: "monthly" });

    const res = await agent.get("/api/auth/user");
    expect(res.status).toBe(200);
    expect(res.body.subscription).toBe("premium");
    expect(res.body.subscriptionExpiresAt).toBeDefined();
    expect(res.body.subscriptionExpiresAt).not.toBeNull();
    expect(res.body.streakInsuranceUsed).toBe(false);
  });

  it("reflects streakInsuranceUsed after using streak insurance", async () => {
    const agent = await loginAs("insured");
    await agent.post("/api/subscription/upgrade").send({ plan: "monthly" });
    await agent.post("/api/subscription/streak-insurance");

    const res = await agent.get("/api/auth/user");
    expect(res.status).toBe(200);
    expect(res.body.streakInsuranceUsed).toBe(true);
  });
});

/* ================================================================
 *  MONTHLY RESET — streak insurance flag clears on 1st of month
 * ================================================================ */
describe("Monthly streak insurance reset", () => {
  it("resets streakInsuranceUsed flag (simulating monthly cron)", async () => {
    const agent = await loginAs("monthly");
    const userId = "dev-monthly";

    // Upgrade and use streak insurance
    await agent.post("/api/subscription/upgrade").send({ plan: "monthly" });
    await agent.post("/api/subscription/streak-insurance");

    // Confirm used
    const before = await agent.get("/api/auth/user");
    expect(before.body.streakInsuranceUsed).toBe(true);

    // Simulate what the monthly cron does: resetAllStreakInsurance
    const resetCount = await memStore.resetAllStreakInsurance();
    expect(resetCount).toBe(1);

    // After reset, user can use streak insurance again
    const after = await agent.get("/api/auth/user");
    expect(after.body.streakInsuranceUsed).toBe(false);

    // Should be able to use streak insurance again
    const insuranceAgain = await agent.post("/api/subscription/streak-insurance");
    expect(insuranceAgain.status).toBe(200);
    expect(insuranceAgain.body.used).toBe(true);
  });

  it("resetAllStreakInsurance only resets users who have used it", async () => {
    // User A: premium, insurance used
    const agentA = await loginAs("resetA");
    await agentA.post("/api/subscription/upgrade").send({ plan: "monthly" });
    await agentA.post("/api/subscription/streak-insurance");

    // User B: premium, insurance NOT used
    const agentB = await loginAs("resetB");
    await agentB.post("/api/subscription/upgrade").send({ plan: "monthly" });

    // User C: free, insurance not applicable
    await loginAs("resetC");

    // Reset all
    const resetCount = await memStore.resetAllStreakInsurance();
    expect(resetCount).toBe(1); // only user A

    // Verify user A is reset
    const userA = await agentA.get("/api/auth/user");
    expect(userA.body.streakInsuranceUsed).toBe(false);

    // Verify user B unchanged
    const userB = await agentB.get("/api/auth/user");
    expect(userB.body.streakInsuranceUsed).toBe(false);
  });
});

/* ================================================================
 *  EDGE CASES
 * ================================================================ */
describe("Premium edge cases", () => {
  it("streak insurance is 403 for free users", async () => {
    const agent = await loginAs("cheapskate");
    const res = await agent.post("/api/subscription/streak-insurance");
    expect(res.status).toBe(403);
    expect(res.body.upgrade).toBe(true);
  });

  it("upgrade requires authentication", async () => {
    const res = await supertest(app)
      .post("/api/subscription/upgrade")
      .send({ plan: "monthly" });
    expect(res.status).toBe(401);
  });

  it("subscription endpoint requires authentication", async () => {
    const res = await supertest(app).get("/api/subscription");
    expect(res.status).toBe(401);
  });

  it("analytics endpoint requires authentication", async () => {
    const res = await supertest(app).get("/api/analytics/me");
    expect(res.status).toBe(401);
  });

  it("annual plan expires ~1 year out", async () => {
    const agent = await loginAs("annual");
    const res = await agent.post("/api/subscription/upgrade").send({ plan: "annual" });
    expect(res.status).toBe(200);

    const expiresAt = new Date(res.body.subscriptionExpiresAt);
    const elevenMonthsFromNow = new Date();
    elevenMonthsFromNow.setMonth(elevenMonthsFromNow.getMonth() + 11);
    expect(expiresAt.getTime()).toBeGreaterThan(elevenMonthsFromNow.getTime());
  });
});
