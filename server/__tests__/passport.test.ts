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
  let _stamps: any[] = [];
  let _memberId = 1;
  let _locationId = 1;
  let _reactionId = 1;
  let _stampId = 1;

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
      return {
        totalDeuces: 0,
        avgPerWeek: 0,
        longestStreak: 0,
        currentStreak: 0,
        bestDay: { day: "Monday", count: 0 },
        groupRankings: [],
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
        return { ...g, memberCount: 1, entryCount: 0 };
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
      return [];
    },
    async getEntryById(entryId: string) {
      return _entries.get(entryId);
    },
    async getFeedEntries(groupIds: string[], limit: number) {
      return [];
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
    async cleanupExpiredInvites() {},
    async deleteExpiredGroupInvites() {},

    /* ---- Location ops ---- */
    async getLocations() {
      return _locations;
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
      return undefined;
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
      return [];
    },

    /* ---- Reaction ops ---- */
    async addReaction(reaction: any) {
      return reaction;
    },
    async removeReaction(userId: string, entryId: string, emoji: string) {},
    async getEntryReactions(entryId: string) {
      return [];
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
      return 0;
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
    async getReferralDashboardStats(_userId: string) {
      return { totalReferrals: 0, premiumConversions: 0, pendingConversions: 0 };
    },
    async getReferralLeaderboard() {
      return [];
    },

    /* ---- Passport ops ---- */
    async upsertPassportStamp(
      userId: string,
      city: string,
      country: string,
      region: string | null,
      countryCode: string | null,
      latitude: string,
      longitude: string,
    ) {
      const existing = _stamps.find(
        (s) => s.userId === userId && s.city === city && s.country === country,
      );
      if (existing) {
        existing.entryCount += 1;
        existing.lastVisitAt = new Date();
        return { ...existing };
      }
      const stamp = {
        id: _stampId++,
        userId,
        city,
        country,
        region,
        countryCode,
        latitude,
        longitude,
        entryCount: 1,
        firstVisitAt: new Date(),
        lastVisitAt: new Date(),
      };
      _stamps.push(stamp);
      return stamp;
    },
    async getPassportStamps(userId: string) {
      return _stamps
        .filter((s) => s.userId === userId)
        .sort((a, b) => b.lastVisitAt.getTime() - a.lastVisitAt.getTime());
    },
    async getPassportStats(userId: string) {
      const userStamps = _stamps.filter((s) => s.userId === userId);
      const countries = new Set(userStamps.map((s) => s.country));
      const totalStampedDeuces = userStamps.reduce((sum, s) => sum + s.entryCount, 0);
      return {
        totalCities: userStamps.length,
        totalCountries: countries.size,
        totalStampedDeuces,
      };
    },
    async deletePassportStamps(userId: string) {
      _stamps = _stamps.filter((s) => s.userId !== userId);
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
      _stamps = [];
      _memberId = 1;
      _locationId = 1;
      _reactionId = 1;
      _stampId = 1;
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

/** Upgrade a logged-in agent to premium. */
async function makePremium(agent: supertest.SuperAgentTest) {
  await agent.post("/api/subscription/upgrade").send({ plan: "monthly" });
}

/** Seed passport stamps directly via the in-memory store. */
async function seedStamps(userId: string) {
  await memStore.upsertPassportStamp(userId, "New York", "United States", "NY", "US", "40.7128", "-74.0060");
  await memStore.upsertPassportStamp(userId, "London", "United Kingdom", "England", "GB", "51.5074", "-0.1278");
  await memStore.upsertPassportStamp(userId, "Tokyo", "Japan", "Kanto", "JP", "35.6762", "139.6503");
}

/* ================================================================
 *  GET /api/passport  (premium-gated)
 * ================================================================ */
describe("GET /api/passport", () => {
  it("returns 401 for unauthenticated user", async () => {
    const res = await supertest(app).get("/api/passport");
    expect(res.status).toBe(401);
  });

  it("returns 403 with { upgrade: true } for free user", async () => {
    const agent = await loginAs("alice");
    const res = await agent.get("/api/passport");
    expect(res.status).toBe(403);
    expect(res.body.feature).toBe("passport");
    expect(res.body.message).toMatch(/premium required/i);
    expect(res.body.upgrade).toBe(true);
  });

  it("returns stamps and stats for premium user", async () => {
    const agent = await loginAs("alice");
    await makePremium(agent);

    const userId = "dev-alice";
    await seedStamps(userId);

    const res = await agent.get("/api/passport");
    expect(res.status).toBe(200);
    expect(res.body.stamps).toHaveLength(3);
    expect(res.body.stats).toEqual({
      totalCities: 3,
      totalCountries: 3,
      totalStampedDeuces: 3,
    });
  });

  it("returns empty stamps and zero stats for premium user with no stamps", async () => {
    const agent = await loginAs("alice");
    await makePremium(agent);

    const res = await agent.get("/api/passport");
    expect(res.status).toBe(200);
    expect(res.body.stamps).toHaveLength(0);
    expect(res.body.stats).toEqual({
      totalCities: 0,
      totalCountries: 0,
      totalStampedDeuces: 0,
    });
  });
});

/* ================================================================
 *  GET /api/passport/:userId  (public share view)
 * ================================================================ */
describe("GET /api/passport/:userId", () => {
  it("returns stamps, stats, and user info for an existing user", async () => {
    // Create user via login
    await loginAs("bob");
    const userId = "dev-bob";
    await seedStamps(userId);

    // Public request (no auth needed)
    const res = await supertest(app).get(`/api/passport/${userId}`);
    expect(res.status).toBe(200);
    expect(res.body.stamps).toHaveLength(3);
    expect(res.body.stats.totalCities).toBe(3);
    expect(res.body.stats.totalCountries).toBe(3);
    expect(res.body.stats.totalStampedDeuces).toBe(3);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.id).toBe(userId);
    expect(res.body.user.firstName).toBe("bob");
  });

  it("returns 404 for nonexistent user", async () => {
    const res = await supertest(app).get("/api/passport/no-such-user");
    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/user not found/i);
  });

  it("does not require authentication", async () => {
    await loginAs("charlie");
    const userId = "dev-charlie";
    await seedStamps(userId);

    // Fresh supertest instance, no cookies
    const res = await supertest(app).get(`/api/passport/${userId}`);
    expect(res.status).toBe(200);
    expect(res.body.stamps).toHaveLength(3);
  });

  it("returns empty stamps for user with no passport data", async () => {
    await loginAs("diana");
    const userId = "dev-diana";

    const res = await supertest(app).get(`/api/passport/${userId}`);
    expect(res.status).toBe(200);
    expect(res.body.stamps).toHaveLength(0);
    expect(res.body.stats.totalCities).toBe(0);
  });
});

/* ================================================================
 *  DELETE /api/passport
 * ================================================================ */
describe("DELETE /api/passport", () => {
  it("returns 401 for unauthenticated user", async () => {
    const res = await supertest(app).delete("/api/passport");
    expect(res.status).toBe(401);
  });

  it("deletes all passport stamps for authenticated user", async () => {
    const agent = await loginAs("alice");
    await makePremium(agent);
    const userId = "dev-alice";
    await seedStamps(userId);

    // Verify stamps exist
    const before = await agent.get("/api/passport");
    expect(before.body.stamps).toHaveLength(3);

    // Delete
    const delRes = await agent.delete("/api/passport");
    expect(delRes.status).toBe(200);
    expect(delRes.body.message).toMatch(/deleted/i);

    // Verify stamps are gone
    const after = await agent.get("/api/passport");
    expect(after.body.stamps).toHaveLength(0);
    expect(after.body.stats.totalCities).toBe(0);
  });

  it("succeeds even when user has no stamps", async () => {
    const agent = await loginAs("alice");

    const res = await agent.delete("/api/passport");
    expect(res.status).toBe(200);
  });

  it("only deletes stamps for the authenticated user, not others", async () => {
    const agentAlice = await loginAs("alice");
    const agentBob = await loginAs("bob");
    await makePremium(agentAlice);
    await makePremium(agentBob);

    await seedStamps("dev-alice");
    await seedStamps("dev-bob");

    // Alice deletes her stamps
    await agentAlice.delete("/api/passport");

    // Bob's stamps remain
    const bobRes = await agentBob.get("/api/passport");
    expect(bobRes.body.stamps).toHaveLength(3);

    // Alice's stamps are gone
    const aliceRes = await agentAlice.get("/api/passport");
    expect(aliceRes.body.stamps).toHaveLength(0);
  });
});

/* ================================================================
 *  Storage: upsertPassportStamp
 * ================================================================ */
describe("Storage: upsertPassportStamp", () => {
  it("creates a new stamp with entryCount 1", async () => {
    const stamp = await memStore.upsertPassportStamp(
      "user-1", "Paris", "France", "Ile-de-France", "FR", "48.8566", "2.3522",
    );
    expect(stamp.city).toBe("Paris");
    expect(stamp.country).toBe("France");
    expect(stamp.entryCount).toBe(1);
    expect(stamp.region).toBe("Ile-de-France");
    expect(stamp.countryCode).toBe("FR");
  });

  it("increments entryCount on second call for same city+country", async () => {
    await memStore.upsertPassportStamp(
      "user-1", "Paris", "France", "Ile-de-France", "FR", "48.8566", "2.3522",
    );
    const updated = await memStore.upsertPassportStamp(
      "user-1", "Paris", "France", "Ile-de-France", "FR", "48.8566", "2.3522",
    );
    expect(updated.entryCount).toBe(2);
  });

  it("creates separate stamps for different cities", async () => {
    await memStore.upsertPassportStamp(
      "user-1", "Paris", "France", null, "FR", "48.8566", "2.3522",
    );
    await memStore.upsertPassportStamp(
      "user-1", "Lyon", "France", null, "FR", "45.7640", "4.8357",
    );
    const stamps = await memStore.getPassportStamps("user-1");
    expect(stamps).toHaveLength(2);
  });

  it("creates separate stamps for same city but different country", async () => {
    await memStore.upsertPassportStamp(
      "user-1", "Portland", "United States", "OR", "US", "45.5152", "-122.6784",
    );
    await memStore.upsertPassportStamp(
      "user-1", "Portland", "United Kingdom", null, "GB", "50.3755", "-3.3840",
    );
    const stamps = await memStore.getPassportStamps("user-1");
    expect(stamps).toHaveLength(2);
  });
});

/* ================================================================
 *  Storage: getPassportStats
 * ================================================================ */
describe("Storage: getPassportStats", () => {
  it("returns zero stats for user with no stamps", async () => {
    const stats = await memStore.getPassportStats("no-stamps-user");
    expect(stats).toEqual({
      totalCities: 0,
      totalCountries: 0,
      totalStampedDeuces: 0,
    });
  });

  it("returns correct aggregates across multiple stamps", async () => {
    // 2 cities in France, 1 in Japan
    await memStore.upsertPassportStamp("user-1", "Paris", "France", null, "FR", "48.8566", "2.3522");
    await memStore.upsertPassportStamp("user-1", "Lyon", "France", null, "FR", "45.7640", "4.8357");
    await memStore.upsertPassportStamp("user-1", "Tokyo", "Japan", null, "JP", "35.6762", "139.6503");

    // Visit Paris again to bump entryCount
    await memStore.upsertPassportStamp("user-1", "Paris", "France", null, "FR", "48.8566", "2.3522");

    const stats = await memStore.getPassportStats("user-1");
    expect(stats.totalCities).toBe(3);
    expect(stats.totalCountries).toBe(2);
    expect(stats.totalStampedDeuces).toBe(4); // Paris(2) + Lyon(1) + Tokyo(1)
  });

  it("isolates stats per user", async () => {
    await memStore.upsertPassportStamp("user-a", "Berlin", "Germany", null, "DE", "52.5200", "13.4050");
    await memStore.upsertPassportStamp("user-b", "Rome", "Italy", null, "IT", "41.9028", "12.4964");

    const statsA = await memStore.getPassportStats("user-a");
    const statsB = await memStore.getPassportStats("user-b");

    expect(statsA.totalCities).toBe(1);
    expect(statsB.totalCities).toBe(1);
    expect(statsA.totalCountries).toBe(1);
    expect(statsB.totalCountries).toBe(1);
  });
});

/* ================================================================
 *  Storage: deletePassportStamps
 * ================================================================ */
describe("Storage: deletePassportStamps", () => {
  it("removes all stamps for the specified user", async () => {
    await memStore.upsertPassportStamp("user-1", "Paris", "France", null, "FR", "48.8566", "2.3522");
    await memStore.upsertPassportStamp("user-1", "Tokyo", "Japan", null, "JP", "35.6762", "139.6503");

    await memStore.deletePassportStamps("user-1");

    const stamps = await memStore.getPassportStamps("user-1");
    expect(stamps).toHaveLength(0);

    const stats = await memStore.getPassportStats("user-1");
    expect(stats.totalCities).toBe(0);
  });

  it("does not affect other users", async () => {
    await memStore.upsertPassportStamp("user-1", "Paris", "France", null, "FR", "48.8566", "2.3522");
    await memStore.upsertPassportStamp("user-2", "Tokyo", "Japan", null, "JP", "35.6762", "139.6503");

    await memStore.deletePassportStamps("user-1");

    const stamps2 = await memStore.getPassportStamps("user-2");
    expect(stamps2).toHaveLength(1);
  });
});
