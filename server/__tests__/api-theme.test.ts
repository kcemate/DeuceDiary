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
        subscription: data.subscription ?? existing?.subscription ?? "free",
        subscriptionExpiresAt: data.subscriptionExpiresAt ?? existing?.subscriptionExpiresAt ?? null,
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

    /* ---- Premium analytics ---- */
    async getPremiumAnalytics(_userId: string) {
      return {
        totalDeuces: 0, avgPerWeek: 0, longestStreak: 0, currentStreak: 0,
        bestDay: { day: "N/A", count: 0 }, groupRankings: [],
      };
    },

    /* ---- Group ops ---- */
    async createGroup(group: any) {
      const newGroup = {
        id: group.id, name: group.name, description: group.description ?? null,
        createdBy: group.createdBy, currentStreak: 0, longestStreak: 0,
        lastStreakDate: null, createdAt: new Date(), updatedAt: new Date(),
      };
      _groups.set(newGroup.id, newGroup);
      _members.push({ id: _memberId++, groupId: newGroup.id, userId: group.createdBy, role: "admin", joinedAt: new Date() });
      return newGroup;
    },
    async getUserGroups(userId: string) {
      const ids = _members.filter((m) => m.userId === userId).map((m) => m.groupId);
      return ids.map((gid) => {
        const g = _groups.get(gid)!;
        return { ...g, memberCount: _members.filter((m) => m.groupId === gid).length, entryCount: 0 };
      });
    },
    async getGroupById(groupId: string) { return _groups.get(groupId); },
    async addGroupMember(member: any) {
      const m = { id: _memberId++, groupId: member.groupId, userId: member.userId, role: member.role ?? "member", joinedAt: new Date() };
      _members.push(m);
      return m;
    },
    async getGroupMembers(groupId: string) {
      return _members.filter((m) => m.groupId === groupId)
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
      const e = { id: entry.id, userId: entry.userId, groupId: entry.groupId, location: entry.location, thoughts: entry.thoughts, loggedAt: entry.loggedAt, createdAt: new Date() };
      _entries.set(e.id, e);
      return e;
    },
    async getGroupEntries(groupId: string) {
      return [..._entries.values()].filter((e) => e.groupId === groupId).map((e) => ({ ...e, user: _users.get(e.userId)! }));
    },
    async getUserDeucesByDate(_userId: string) { return []; },
    async getEntryById(entryId: string) { return _entries.get(entryId); },
    async getFeedEntries(groupIds: string[], limit: number) {
      return [..._entries.values()].filter((e) => groupIds.includes(e.groupId)).slice(0, limit)
        .map((e) => ({ ...e, user: _users.get(e.userId), reactions: [] }));
    },

    /* ---- Invite ops ---- */
    async createInvite(invite: any) { _invites.set(invite.id, { ...invite, createdAt: new Date() }); return invite; },
    async getInviteById(inviteId: string) { return _invites.get(inviteId); },
    async deleteInvite(inviteId: string) { _invites.delete(inviteId); },
    async cleanupExpiredInvites() {},

    /* ---- Location ops ---- */
    async getLocations() { return _locations; },
    async createLocation(loc: any) { const l = { id: _locationId++, ...loc, createdAt: new Date() }; _locations.push(l); return l; },
    async getLocationByName(name: string) { return _locations.find((l) => l.name === name); },

    /* ---- Personal records ---- */
    async getUserPersonalRecord(_userId: string) { return undefined; },

    /* ---- Streak ops ---- */
    async getGroupStreak(groupId: string) {
      return _streaks.get(groupId) ?? { currentStreak: 0, longestStreak: 0, lastStreakDate: null as string | null };
    },
    async updateGroupStreak(groupId: string, currentStreak: number, longestStreak: number, lastStreakDate: string) {
      _streaks.set(groupId, { currentStreak, longestStreak, lastStreakDate });
    },
    async getMembersLogStatusToday(groupId: string, _today: string) {
      return _members.filter((m) => m.groupId === groupId).map((m) => ({
        userId: m.userId, username: _users.get(m.userId)?.username ?? null,
        firstName: _users.get(m.userId)?.firstName ?? null, profileImageUrl: null,
        hasLogged: [..._entries.values()].some((e) => e.groupId === groupId && e.userId === m.userId),
      }));
    },

    /* ---- Reaction ops ---- */
    async addReaction(reaction: any) {
      const r = { id: _reactionId++, ...reaction, createdAt: new Date() };
      _reactions.push(r);
      return r;
    },
    async removeReaction(userId: string, entryId: string, emoji: string) {
      _reactions = _reactions.filter((r) => !(r.userId === userId && r.entryId === entryId && r.emoji === emoji));
    },
    async getEntryReactions(entryId: string) {
      return _reactions.filter((r) => r.entryId === entryId).map((r) => ({ ...r, user: _users.get(r.userId)! }));
    },

    /* ---- Push token / broadcast / challenge / reminder stubs ---- */
    async getGroupPushTokens(_groupId: string) { return []; },
    async createBroadcast(b: any) { return b; },
    async getDailyChallengeCompletion(_userId: string, _date: string) { return undefined; },
    async completeDailyChallenge(c: any) { return c; },
    async updateUserReminder(_userId: string, _hour: number, _minute: number) {
      return _users.values().next().value;
    },
    async getUserByUsername(username: string) {
      return [..._users.values()].find((u) => u.username === username);
    },
    async getUserLongestStreak(_userId: string) { return 0; },
    async getUserBestDay(_userId: string) { return undefined; },
    async getGroupMemberTypicalHours(_groupId: string) { return []; },

    /* ---- Other stubs ---- */
    async getAllGroupsWithActiveStreaks() { return []; },
    async createStreakAlert(a: any) { return a; },
    async getGroupMemberCount(groupId: string) { return _members.filter((m) => m.groupId === groupId).length; },
    async getGroupDeuceCount(groupId: string) { return [..._entries.values()].filter((e) => e.groupId === groupId).length; },
    async getWeeklyReport() {
      return { totalDeuces: 0, peakDay: { date: "", count: 0 }, mostActiveSquad: { name: "None", count: 0 }, longestStreak: 0, funniestEntry: null, totalReactionsReceived: 0, weekOf: "" };
    },
    async resetAllStreakInsurance() { return 0; },
    async upsertPushToken(token: any) { return token; },

    /* ---- test helper ---- */
    _reset() {
      _users.clear(); _groups.clear(); _members = []; _entries.clear();
      _invites.clear(); _locations = []; _reactions = []; _streaks.clear();
      _memberId = 1; _locationId = 1; _reactionId = 1;
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
        session({ secret: "test-secret", resave: false, saveUninitialized: false }),
      );

      app.post("/api/login", async (req: any, res: any) => {
        const { username } = req.body;
        if (!username || typeof username !== "string" || !username.trim()) {
          return res.status(400).json({ message: "Username is required" });
        }
        const name = username.trim();
        const userId = `dev-${name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
        const user = await memStore.upsertUser({
          id: userId, email: `${name.toLowerCase()}@localhost.dev`,
          firstName: name, lastName: null, profileImageUrl: null,
        });

        const userGroups = await memStore.getUserGroups(userId);
        if (userGroups.length === 0) {
          const { v4: uuidv4 } = await import("uuid");
          await memStore.createGroup({ id: uuidv4(), name: "Solo Deuces", description: "Your personal throne log", createdBy: userId });
        }

        req.session.userId = userId;
        req.session.save((err: any) => {
          if (err) return res.status(500).json({ message: "Failed to save session" });
          res.json({ ok: true, user: { id: user.id, username: user.username, createdAt: user.createdAt } });
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

afterAll(() => { server.close(); });

beforeEach(() => { memStore._reset(); });

async function loginAs(username: string) {
  const agent = supertest.agent(app);
  await agent.post("/api/login").send({ username });
  return agent;
}

/**
 * Log in and upgrade the user to premium so premium-gated routes are accessible.
 */
async function loginAsPremium(username: string) {
  const agent = await loginAs(username);
  const userId = `dev-${username.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
  await memStore.updateUserSubscription(userId, "premium", expiresAt);
  return agent;
}

/* ================================================================
 *  GET /api/user/theme
 * ================================================================ */
describe("GET /api/user/theme", () => {
  it("returns 'default' for new premium user", async () => {
    const agent = await loginAsPremium("alice");
    const res = await agent.get("/api/user/theme");
    expect(res.status).toBe(200);
    expect(res.body.theme).toBe("default");
  });

  it("returns 403 for non-premium user", async () => {
    const agent = await loginAs("freeuser");
    const res = await agent.get("/api/user/theme");
    expect(res.status).toBe(403);
    expect(res.body.upgrade).toBe(true);
    expect(res.body.feature).toBe("custom_themes");
  });

  it("requires authentication", async () => {
    const res = await supertest(app).get("/api/user/theme");
    expect(res.status).toBe(401);
  });
});

/* ================================================================
 *  PUT /api/user/theme
 * ================================================================ */
describe("PUT /api/user/theme", () => {
  it("sets theme to 'dark'", async () => {
    const agent = await loginAsPremium("alice");
    const res = await agent.put("/api/user/theme").send({ theme: "dark" });
    expect(res.status).toBe(200);
    expect(res.body.theme).toBe("dark");
  });

  it("sets theme to 'cream'", async () => {
    const agent = await loginAsPremium("alice");
    const res = await agent.put("/api/user/theme").send({ theme: "cream" });
    expect(res.status).toBe(200);
    expect(res.body.theme).toBe("cream");
  });

  it("sets theme to 'midnight'", async () => {
    const agent = await loginAsPremium("alice");
    const res = await agent.put("/api/user/theme").send({ theme: "midnight" });
    expect(res.status).toBe(200);
    expect(res.body.theme).toBe("midnight");
  });

  it("persists across GET calls", async () => {
    const agent = await loginAsPremium("alice");
    await agent.put("/api/user/theme").send({ theme: "midnight" });

    const res = await agent.get("/api/user/theme");
    expect(res.status).toBe(200);
    expect(res.body.theme).toBe("midnight");
  });

  it("returns 400 for invalid theme", async () => {
    const agent = await loginAsPremium("alice");
    const res = await agent.put("/api/user/theme").send({ theme: "neon-pink" });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/invalid theme/i);
  });

  it("returns 400 for missing theme", async () => {
    const agent = await loginAsPremium("alice");
    const res = await agent.put("/api/user/theme").send({});
    expect(res.status).toBe(400);
  });

  it("returns 403 for non-premium user", async () => {
    const agent = await loginAs("freeuser");
    const res = await agent.put("/api/user/theme").send({ theme: "dark" });
    expect(res.status).toBe(403);
    expect(res.body.upgrade).toBe(true);
    expect(res.body.feature).toBe("custom_themes");
  });

  it("requires authentication", async () => {
    const res = await supertest(app).put("/api/user/theme").send({ theme: "dark" });
    expect(res.status).toBe(401);
  });
});
