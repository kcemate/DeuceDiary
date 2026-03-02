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
  const _challengeCompletions = new Map<string, any>();
  let _memberId = 1;
  let _locationId = 1;
  let _reactionId = 1;
  let _challengeId = 1;

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
        .filter((e) => groupIds.includes(e.groupId) && !e.ghost)
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

    /* ---- Daily challenge ops ---- */
    async getDailyChallengeCompletion(userId: string, challengeDate: string) {
      const key = `${userId}:${challengeDate}`;
      return _challengeCompletions.get(key);
    },
    async completeDailyChallenge(completion: any) {
      const c = {
        id: _challengeId++,
        userId: completion.userId,
        challengeDate: completion.challengeDate,
        createdAt: new Date(),
      };
      const key = `${c.userId}:${c.challengeDate}`;
      _challengeCompletions.set(key, c);
      return c;
    },

    /* ---- Legacy wall ops ---- */
    async getUserByUsername(username: string) {
      for (const [, u] of _users) {
        if (u.username === username) return u;
      }
      return undefined;
    },
    async getUserLongestStreak(userId: string) {
      let longest = 0;
      const groupIds = _members.filter((m) => m.userId === userId).map((m) => m.groupId);
      for (const gid of groupIds) {
        const s = _streaks.get(gid);
        if (s) longest = Math.max(longest, s.longestStreak);
      }
      return longest;
    },
    async getUserBestDay(userId: string) {
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
    async upsertPushToken(token: any) { return token; },
    async updateUserReminder(_userId: string, _h: number, _m: number) { return _users.get(_userId); },
    async createBroadcast(b: any) { return b; },
    async getGroupPushTokens(_gid: string) { return []; },
    async getGroupMemberTypicalHours(_gid: string) { return []; },

    /* ---- test helpers ---- */
    _reset() {
      _users.clear();
      _groups.clear();
      _members = [];
      _entries.clear();
      _invites.clear();
      _locations = [];
      _reactions = [];
      _streaks.clear();
      _challengeCompletions.clear();
      _memberId = 1;
      _locationId = 1;
      _reactionId = 1;
      _challengeId = 1;
    },
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

/** Upgrade a user to premium via the dev endpoint. */
async function upgradeToPremium(agent: any) {
  const res = await agent.post("/api/subscription/upgrade").send({ plan: "monthly" });
  expect(res.status).toBe(200);
  expect(res.body.subscription).toBe("premium");
  return res;
}

/**
 * Get the first group for a user directly from memStore.
 * Bypasses the premium-gated GET /api/groups endpoint.
 */
async function getSoloGroupId(username: string): Promise<string> {
  const userId = `dev-${username.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
  const groups = await memStore.getUserGroups(userId);
  return groups[0].id;
}

/** Log a deuce and return the created entry. */
async function logDeuce(
  agent: any,
  groupId: string,
  opts: { ghost?: boolean; thoughts?: string } = {},
) {
  const res = await agent.post("/api/deuces").send({
    groupIds: [groupId],
    location: "Home",
    thoughts: opts.thoughts ?? "test log",
    ghost: opts.ghost ?? false,
  });
  expect(res.status).toBe(200);
  return res.body.entries[0];
}

/* ================================================================
 *  FREE TIER — ALLOWED ENDPOINTS
 * ================================================================ */
describe("Free tier — allowed endpoints", () => {
  it("POST /api/deuces (log a deuce) → 200", async () => {
    const agent = await loginAs("freebird");
    const groupId = await getSoloGroupId("freebird");

    const res = await agent.post("/api/deuces").send({
      groupIds: [groupId],
      location: "Home",
      thoughts: "free user log",
    });
    expect(res.status).toBe(200);
    expect(res.body.entries).toHaveLength(1);
    expect(res.body.entries[0].location).toBe("Home");
  });

  it("GET /api/auth/user → 200", async () => {
    const agent = await loginAs("freebird");
    const res = await agent.get("/api/auth/user");
    expect(res.status).toBe(200);
    expect(res.body.subscription).toBe("free");
    expect(res.body.id).toBe("dev-freebird");
  });

  it("POST /api/subscription/upgrade → 200", async () => {
    const agent = await loginAs("freebird");
    const res = await agent.post("/api/subscription/upgrade").send({ plan: "monthly" });
    expect(res.status).toBe(200);
    expect(res.body.subscription).toBe("premium");
    expect(res.body.subscriptionExpiresAt).toBeDefined();
  });
});

/* ================================================================
 *  FREE TIER — SOCIAL CORE IS FREE
 * ================================================================ */
describe("Free tier — social core is free", () => {
  it("GET /api/groups → 200", async () => {
    const agent = await loginAs("freebird");
    const res = await agent.get("/api/groups");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /api/groups → 200 (under 3 squads)", async () => {
    const agent = await loginAs("freebird");
    const res = await agent.post("/api/groups").send({
      name: "My Squad",
      description: "Testing",
    });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe("My Squad");
  });

  it("GET /api/groups/:id/leaderboard → 200", async () => {
    const agent = await loginAs("freebird");
    const groupId = await getSoloGroupId("freebird");
    const res = await agent.get(`/api/groups/${groupId}/leaderboard`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /api/entries/:entryId/reactions → 200", async () => {
    const agent = await loginAs("freebird");
    const groupId = await getSoloGroupId("freebird");
    const entry = await logDeuce(agent, groupId);
    const res = await agent
      .post(`/api/entries/${entry.id}/reactions`)
      .send({ emoji: "💩" });
    expect(res.status).toBe(200);
    expect(res.body.emoji).toBe("💩");
  });

  it("GET /api/deuces (feed) → 200", async () => {
    const agent = await loginAs("freebird");
    const res = await agent.get("/api/deuces");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("GET /api/groups/:id/streak → 200", async () => {
    const agent = await loginAs("freebird");
    const groupId = await getSoloGroupId("freebird");
    const res = await agent.get(`/api/groups/${groupId}/streak`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("currentStreak");
  });
});

/* ================================================================
 *  FREE TIER — POWER FEATURES GET 403 WITH { upgrade: true }
 * ================================================================ */
describe("Free tier — power features get 403 with { upgrade: true }", () => {
  it("GET /api/analytics/me → 403", async () => {
    const agent = await loginAs("freebird");
    const res = await agent.get("/api/analytics/me");
    expect(res.status).toBe(403);
    expect(res.body.upgrade).toBe(true);
  });

  it("GET /api/challenges/today → 403", async () => {
    const agent = await loginAs("freebird");
    const res = await agent.get("/api/challenges/today");
    expect(res.status).toBe(403);
    expect(res.body.upgrade).toBe(true);
  });

  it("GET /api/groups/:id/spy → 403", async () => {
    const agent = await loginAs("freebird");
    const groupId = await getSoloGroupId("freebird");
    const res = await agent.get(`/api/groups/${groupId}/spy`);
    expect(res.status).toBe(403);
    expect(res.body.upgrade).toBe(true);
    expect(res.body.feature).toBe("squad_spy");
  });
});

/* ================================================================
 *  FREE TIER — 3-SQUAD LIMIT
 * ================================================================ */
describe("Free tier — 3-squad limit", () => {
  it("POST /api/groups → 403 when free user already in 3 groups", async () => {
    const agent = await loginAs("limituser");
    // Already in 1 group (Solo Deuces from login). Create 2 more to reach 3.
    await agent.post("/api/groups").send({ name: "Squad 2" });
    await agent.post("/api/groups").send({ name: "Squad 3" });

    // 4th should be blocked
    const res = await agent.post("/api/groups").send({ name: "Squad 4" });
    expect(res.status).toBe(403);
    expect(res.body.upgrade).toBe(true);
    expect(res.body.feature).toBe("unlimited_squads");
  });

  it("POST /api/join/:inviteId → 403 when free user already in 3 groups", async () => {
    // Premium user creates a group and invite
    const premium = await loginAs("inviter");
    await upgradeToPremium(premium);
    const groupRes = await premium.post("/api/groups").send({ name: "Invite Squad" });
    const inviteRes = await premium.post(`/api/groups/${groupRes.body.id}/invite`);
    const inviteId = inviteRes.body.id;

    // Free user already in 3 groups
    const free = await loginAs("limitjoin");
    await free.post("/api/groups").send({ name: "Squad 2" });
    await free.post("/api/groups").send({ name: "Squad 3" });

    const joinRes = await free.post(`/api/join/${inviteId}`);
    expect(joinRes.status).toBe(403);
    expect(joinRes.body.upgrade).toBe(true);
    expect(joinRes.body.feature).toBe("unlimited_squads");
  });

  it("premium users have no squad limit", async () => {
    const agent = await loginAs("unlimitedking");
    await upgradeToPremium(agent);

    // Create groups beyond the free limit
    await agent.post("/api/groups").send({ name: "Squad 2" });
    await agent.post("/api/groups").send({ name: "Squad 3" });
    const res = await agent.post("/api/groups").send({ name: "Squad 4" });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Squad 4");
  });
});

/* ================================================================
 *  PREMIUM TIER — FULL ACCESS
 * ================================================================ */
describe("Premium tier — can access all endpoints freely", () => {
  it("GET /api/groups → 200", async () => {
    const agent = await loginAs("premiumking");
    await upgradeToPremium(agent);

    const res = await agent.get("/api/groups");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /api/groups → 200", async () => {
    const agent = await loginAs("premiumking");
    await upgradeToPremium(agent);

    const res = await agent.post("/api/groups").send({
      name: "Premium Squad",
      description: "VIP only",
    });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Premium Squad");
  });

  it("GET /api/groups/:id/leaderboard → 200", async () => {
    const agent = await loginAs("premiumking");
    await upgradeToPremium(agent);
    const groupId = await getSoloGroupId("premiumking");

    const res = await agent.get(`/api/groups/${groupId}/leaderboard`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /api/entries/:entryId/reactions → 200", async () => {
    const agent = await loginAs("premiumking");
    await upgradeToPremium(agent);
    const groupId = await getSoloGroupId("premiumking");

    // Log a deuce first, then react to it
    const entry = await logDeuce(agent, groupId);

    const res = await agent
      .post(`/api/entries/${entry.id}/reactions`)
      .send({ emoji: "🔥" });
    expect(res.status).toBe(200);
    expect(res.body.emoji).toBe("🔥");
  });

  it("GET /api/analytics/me → 200", async () => {
    const agent = await loginAs("premiumking");
    await upgradeToPremium(agent);

    const res = await agent.get("/api/analytics/me");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("totalDeuces");
  });

  it("GET /api/challenges/today → 200", async () => {
    const agent = await loginAs("premiumking");
    await upgradeToPremium(agent);

    const res = await agent.get("/api/challenges/today");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("challenge");
  });

  it("POST /api/deuces still works for premium", async () => {
    const agent = await loginAs("premiumking");
    await upgradeToPremium(agent);
    const groupId = await getSoloGroupId("premiumking");

    const res = await agent.post("/api/deuces").send({
      groupIds: [groupId],
      location: "Office",
      thoughts: "premium log",
    });
    expect(res.status).toBe(200);
    expect(res.body.entries).toHaveLength(1);
  });
});

/* ================================================================
 *  GHOST LOG
 * ================================================================ */
describe("Ghost log", () => {
  it("POST /api/deuces with { ghost: true } → log created with ghost=true", async () => {
    const agent = await loginAs("ghostuser");
    const groupId = await getSoloGroupId("ghostuser");

    const entry = await logDeuce(agent, groupId, { ghost: true, thoughts: "stealth mode" });
    expect(entry.ghost).toBe(true);
    expect(entry.thoughts).toBe("stealth mode");
  });

  it("GET /api/deuces (as squad member) → ghost log NOT in feed", async () => {
    // Ghost user sets up a group and logs entries
    const ghostAgent = await loginAs("ghoster");
    const groupId = await getSoloGroupId("ghoster");

    // Create invite so another user can join the same group
    const inviteRes = await ghostAgent.post(`/api/groups/${groupId}/invite`);
    expect(inviteRes.status).toBe(200);
    const inviteId = inviteRes.body.id;

    // Ghost user logs a visible deuce and a ghost deuce
    await logDeuce(ghostAgent, groupId, { thoughts: "visible log" });
    await logDeuce(ghostAgent, groupId, { ghost: true, thoughts: "invisible log" });

    // Squad member joins (groups + feed are free now)
    const memberAgent = await loginAs("squadmate");
    const joinRes = await memberAgent.post(`/api/join/${inviteId}`);
    expect(joinRes.status).toBe(200);

    const feed = await memberAgent.get(`/api/deuces?groupId=${groupId}`);
    expect(feed.status).toBe(200);

    const feedThoughts = feed.body.map((e: any) => e.thoughts);
    expect(feedThoughts).toContain("visible log");
    expect(feedThoughts).not.toContain("invisible log");
  });

  it("user's own streak still counts the ghost log", async () => {
    const agent = await loginAs("ghoststreak");
    const groupId = await getSoloGroupId("ghoststreak");

    // Log a ghost deuce (only member, so all members have logged → streak advances)
    await logDeuce(agent, groupId, { ghost: true });

    const streakRes = await agent.get(`/api/groups/${groupId}/streak`);
    expect(streakRes.status).toBe(200);
    // Streak should still count the ghost log (solo group, one member logged)
    expect(streakRes.body.logsToday.some((m: any) => m.hasLogged)).toBe(true);
  });
});

/* ================================================================
 *  LEGACY WALL
 * ================================================================ */
describe("Legacy wall", () => {
  it("GET /api/users/:username/legacy → 200 with correct fields", async () => {
    const agent = await loginAs("legenduser");
    // Set a username first
    await agent.put("/api/auth/user").send({ username: "legend42" });

    // Log a few deuces to build history
    const groupId = await getSoloGroupId("legenduser");
    await logDeuce(agent, groupId, { thoughts: "first" });
    await logDeuce(agent, groupId, { thoughts: "second" });
    await logDeuce(agent, groupId, { thoughts: "third" });

    const res = await agent.get("/api/users/legend42/legacy");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("totalLogs");
    expect(res.body).toHaveProperty("title");
    expect(res.body).toHaveProperty("longestStreak");
    expect(res.body).toHaveProperty("memberSince");
    expect(res.body.totalLogs).toBe(3);
  });

  it("title correct for log count ranges", async () => {
    const agent = await loginAs("titleuser");
    await agent.put("/api/auth/user").send({ username: "titletest" });

    // 0 deuces → Rookie
    const rookie = await agent.get("/api/users/titletest/legacy");
    expect(rookie.status).toBe(200);
    expect(rookie.body.title).toBe("Rookie");

    // Manually bump deuce count to 10 → Regular
    const user = memStore._getUser("dev-titleuser");
    user.deuceCount = 10;
    const regular = await agent.get("/api/users/titletest/legacy");
    expect(regular.body.title).toBe("Regular");

    // 50 → Veteran
    user.deuceCount = 50;
    const veteran = await agent.get("/api/users/titletest/legacy");
    expect(veteran.body.title).toBe("Veteran");

    // 100 → Elite
    user.deuceCount = 100;
    const elite = await agent.get("/api/users/titletest/legacy");
    expect(elite.body.title).toBe("Elite");

    // 500 → Legend
    user.deuceCount = 500;
    const legend = await agent.get("/api/users/titletest/legacy");
    expect(legend.body.title).toBe("Legend");
  });
});

/* ================================================================
 *  DAILY CHALLENGES
 * ================================================================ */
describe("Daily challenges", () => {
  it("GET /api/challenges/today → returns challenge for today", async () => {
    const agent = await loginAs("challenger");
    await upgradeToPremium(agent);

    const res = await agent.get("/api/challenges/today");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("challenge");
    expect(res.body).toHaveProperty("date");
    // date should be today's ISO date
    const today = new Date().toISOString().slice(0, 10);
    expect(res.body.date).toBe(today);
  });

  it("POST /api/challenges/complete → marks done", async () => {
    const agent = await loginAs("challenger");
    await upgradeToPremium(agent);

    const res = await agent.post("/api/challenges/complete");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("completion");
    expect(res.body.bonusAwarded).toBe(true);
  });

  it("POST /api/challenges/complete again → 400 already completed", async () => {
    const agent = await loginAs("challenger");
    await upgradeToPremium(agent);

    // Complete once
    const first = await agent.post("/api/challenges/complete");
    expect(first.status).toBe(200);

    // Try again — should fail
    const second = await agent.post("/api/challenges/complete");
    expect(second.status).toBe(400);
    expect(second.body.message).toMatch(/already completed/i);
  });
});
