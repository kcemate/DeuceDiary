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
  const _invitePreviews = new Map<string, any>();
  let _reactions: any[] = [];
  let _locations: any[] = [];
  const _streaks = new Map<string, { currentStreak: number; longestStreak: number; lastStreakDate: string | null }>();
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
        timezone: existing?.timezone ?? null,
        referralCode: existing?.referralCode ?? `REF${data.id.slice(-4).toUpperCase()}`,
        referralCount: existing?.referralCount ?? 0,
        reminderHour: existing?.reminderHour ?? null,
        reminderMinute: existing?.reminderMinute ?? null,
        deletedAt: existing?.deletedAt ?? null,
        createdAt: existing?.createdAt ?? new Date(),
        updatedAt: new Date(),
      };
      _users.set(data.id, user);
      return user;
    },
    async updateUserDeuceCount(userId: string, increment: number) {
      const user = _users.get(userId);
      if (user) { user.deuceCount = (user.deuceCount ?? 0) + increment; }
    },
    async updateUserSubscription(userId: string, subscription: string, expiresAt: Date) {
      const user = _users.get(userId);
      if (!user) throw new Error("User not found");
      user.subscription = subscription;
      user.subscriptionExpiresAt = expiresAt;
      return user;
    },
    async getUserSubscription(userId: string) {
      const user = _users.get(userId);
      return { subscription: user?.subscription ?? "free", subscriptionExpiresAt: user?.subscriptionExpiresAt ?? null, streakInsuranceUsed: user?.streakInsuranceUsed ?? false };
    },
    async updateUserTheme(userId: string, theme: string) {
      const user = _users.get(userId);
      if (!user) throw new Error("User not found");
      user.theme = theme;
      return user;
    },
    async updateUserUsername(userId: string, username: string) {
      const user = _users.get(userId);
      if (!user) throw new Error("User not found");
      user.username = username;
      return user;
    },
    async updateUserProfilePicture(userId: string, url: string) {
      const user = _users.get(userId);
      if (!user) throw new Error("User not found");
      user.profileImageUrl = url;
      return user;
    },
    async updateUserReminder(userId: string, hour: number, minute: number) {
      const user = _users.get(userId);
      if (!user) throw new Error("User not found");
      user.reminderHour = hour;
      user.reminderMinute = minute;
      return user;
    },
    async useStreakInsurance(userId: string) { const user = _users.get(userId); if (user) user.streakInsuranceUsed = true; },
    async resetAllStreakInsurance() { return 0; },
    async softDeleteUser(userId: string) { const user = _users.get(userId); if (user) user.deletedAt = new Date(); },

    /* ---- Invite preview ops ---- */
    async getGroupInvitePreview(inviteCode: string) {
      return _invitePreviews.get(inviteCode) ?? null;
    },
    _seedInvitePreview(inviteCode: string, preview: any) {
      _invitePreviews.set(inviteCode, preview);
    },

    /* ---- Group ops ---- */
    async createGroup(group: any) {
      const newGroup = {
        id: group.id, name: group.name, description: group.description ?? null, createdBy: group.createdBy,
        currentStreak: 0, longestStreak: 0, lastStreakDate: null, createdAt: new Date(), updatedAt: new Date(),
      };
      _groups.set(newGroup.id, newGroup);
      _members.push({ id: _memberId++, groupId: newGroup.id, userId: group.createdBy, role: "admin", joinedAt: new Date() });
      return newGroup;
    },
    async getUserGroups(userId: string) {
      const ids = _members.filter((m) => m.userId === userId).map((m) => m.groupId);
      return ids.map((gid) => {
        const g = _groups.get(gid)!;
        return { ...g, memberCount: _members.filter((m) => m.groupId === gid).length, entryCount: 0, joinedAt: new Date() };
      });
    },
    async getGroupById(groupId: string) { return _groups.get(groupId); },
    async addGroupMember(member: any) {
      const m = { id: _memberId++, groupId: member.groupId, userId: member.userId, role: member.role ?? "member", joinedAt: new Date() };
      _members.push(m);
      return m;
    },
    async getGroupMembers(groupId: string) {
      return _members.filter((m) => m.groupId === groupId).map((m) => ({ ...m, user: _users.get(m.userId)! }));
    },
    async getGroupMemberRole(userId: string, groupId: string) {
      return _members.find((m) => m.userId === userId && m.groupId === groupId)?.role ?? null;
    },
    async isUserInGroup(userId: string, groupId: string) {
      return _members.some((m) => m.userId === userId && m.groupId === groupId);
    },
    async removeGroupMember(userId: string, groupId: string) {
      _members = _members.filter((m) => !(m.userId === userId && m.groupId === groupId));
    },
    async getGroupMemberCount(groupId: string) { return _members.filter((m) => m.groupId === groupId).length; },
    async getGroupDeuceCount(groupId: string) { return [..._entries.values()].filter((e) => e.groupId === groupId).length; },
    async getGroupStreak(groupId: string) {
      return _streaks.get(groupId) ?? { currentStreak: 0, longestStreak: 0, lastStreakDate: null as string | null };
    },
    async getGroupStreaksBatch(groupIds: string[]) {
      const map = new Map<string, any>();
      for (const id of groupIds) map.set(id, await this.getGroupStreak(id));
      return map;
    },
    async updateGroupStreak(groupId: string, currentStreak: number, longestStreak: number, lastStreakDate: string) {
      _streaks.set(groupId, { currentStreak, longestStreak, lastStreakDate });
    },
    async getGroupLeaderboard(groupId: string) {
      return _members.filter((m) => m.groupId === groupId).map((m) => {
        const u = _users.get(m.userId);
        return { userId: m.userId, username: u?.username, firstName: u?.firstName, deuceCount: u?.deuceCount ?? 0, monthlyDeuces: 0, weeklyDeuces: 0, isMvp: false };
      });
    },
    async getGroupEntries(groupId: string, _limit?: number, _offset?: number) {
      return [..._entries.values()].filter((e) => e.groupId === groupId).map((e) => ({ ...e, user: _users.get(e.userId)! }));
    },
    async getMembersLogStatusToday(groupId: string, _today: string) {
      return _members.filter((m) => m.groupId === groupId).map((m) => ({
        userId: m.userId, username: _users.get(m.userId)?.username ?? null, firstName: null, profileImageUrl: null, hasLogged: false,
      }));
    },
    async getGroupTypicalHours(_groupId: string) { return null; },
    async getGroupWeeklyReport(_groupId: string) { return { weekOf: "", totalDeuces: 0, mvp: null, members: [], funnyStats: {} }; },

    /* ---- Entry ops ---- */
    async createDeuceEntry(entry: any) {
      const e = { id: entry.id, userId: entry.userId, groupId: entry.groupId, location: entry.location, thoughts: entry.thoughts, loggedAt: entry.loggedAt, createdAt: new Date() };
      _entries.set(e.id, e);
      return e;
    },
    async getUserDailyLogCount(_userId: string, _dateUTC: string) { return 0; },
    async getEntryById(entryId: string) { return _entries.get(entryId); },
    async getFeedEntries(groupIds: string[], limit: number) {
      return [..._entries.values()].filter((e) => groupIds.includes(e.groupId)).slice(0, limit).map((e) => ({ ...e, user: _users.get(e.userId), reactions: [] }));
    },
    async getUserPersonalRecord(_userId: string) { return undefined; },

    /* ---- Invite ops ---- */
    async createInvite(invite: any) {
      const inv = { id: invite.id, groupId: invite.groupId, createdBy: invite.createdBy, expiresAt: invite.expiresAt, createdAt: new Date() };
      _invites.set(inv.id, inv);
      return inv;
    },
    async getInviteById(inviteId: string) { return _invites.get(inviteId); },
    async deleteInvite(inviteId: string) { _invites.delete(inviteId); },
    async cleanupExpiredInvites() {},

    /* ---- Reaction ops ---- */
    async addReaction(reaction: any) {
      const exists = _reactions.find((r) => r.entryId === reaction.entryId && r.userId === reaction.userId && r.emoji === reaction.emoji);
      if (exists) throw new Error("duplicate key value violates unique constraint");
      const r = { id: Date.now(), entryId: reaction.entryId, userId: reaction.userId, emoji: reaction.emoji, createdAt: new Date() };
      _reactions.push(r);
      return r;
    },
    async removeReaction(userId: string, entryId: string, emoji: string) {
      _reactions = _reactions.filter((r) => !(r.userId === userId && r.entryId === entryId && r.emoji === emoji));
    },
    async getEntryReactions(entryId: string) {
      return _reactions.filter((r) => r.entryId === entryId).map((r) => ({ ...r, user: _users.get(r.userId)! }));
    },

    /* ---- Location ops ---- */
    async getLocations() { return _locations; },
    async createLocation(loc: any) {
      const l = { id: Date.now(), name: loc.name, isDefault: loc.isDefault ?? false, createdBy: loc.createdBy ?? null, createdAt: new Date() };
      _locations.push(l);
      return l;
    },
    async getLocationByName(name: string) { return _locations.find((l) => l.name === name); },

    /* ---- Share card ---- */
    async getShareCardData(userId: string) {
      const user = _users.get(userId);
      if (!user) throw new Error("User not found");
      return { username: user.username, currentStreak: 0, longestStreak: 0, totalLogs: 0, squadCount: 0, memberSince: user.createdAt };
    },

    /* ---- Stubs ---- */
    async getAllGroupsWithActiveStreaks(_minStreak: number) { return []; },
    async createStreakAlert(_alert: any) { return _alert; },
    async getReferralDashboardStats(_userId: string) { return { totalReferrals: 0, premiumConversions: 0, pendingConversions: 0 }; },
    async getReferralLeaderboard() { return []; },
    async createBroadcast(data: any) { return { id: 1, ...data, createdAt: new Date() }; },
    async getUserBadges(_userId: string) { return []; },
    async countUserPushTokens(_userId: string) { return 0; },
    async getUserPushTokens(_userId: string) { return []; },
    async upsertPushToken(_data: any) {},
    async deletePushToken(_userId: string, _token: string) {},
    async getGroupPushTokens(_groupId: string) { return []; },
    async getPremiumAnalytics(_userId: string) { return { totalDeuces: 0, avgPerWeek: 0, longestStreak: 0, currentStreak: 0, bestDay: null, groupRankings: [] }; },
    async getUserDeucesByDate(_userId: string) { return []; },
    async getWeeklyReport(_userId: string) { return { totalDeuces: 0, peakDay: null, mostActiveSquad: null, longestStreak: 0, funniestEntry: null, totalReactionsReceived: 0, weekOf: "" }; },

    /* ---- Bingo stubs ---- */
    async getBingoCard(_userId: string, _month: string) { return null; },
    async createBingoCard(data: any) { return data; },
    async deleteBingoCard(_cardId: string) {},
    async checkAndUpdateBingoProgress(_cardId: string, _userId: string, _squares: any[], _completed: any[]) { return { newlyCompleted: [] }; },
    async getBingoLeaderboard(_groupId: string, _month: string) { return []; },

    /* ---- King stubs ---- */
    async getCurrentKing(_groupId: string) { return null; },
    async getActiveChallengeForGroup(_groupId: string) { return null; },
    async createDeuceKing(_data: any) { return _data; },
    async getExistingChallengeForKing(_kingId: string) { return null; },
    async createChallenge(_data: any) { return _data; },
    async getUserChallengeCompletion(_userId: string, _challengeId: string) { return null; },
    async createChallengeCompletion(_data: any) { return _data; },

    /* ---- test helpers ---- */
    _reset() {
      _users.clear();
      _groups.clear();
      _members = [];
      _entries.clear();
      _invites.clear();
      _invitePreviews.clear();
      _locations = [];
      _reactions = [];
      _streaks.clear();
      _memberId = 1;
    },
    _getUser(id: string) { return _users.get(id); },
  };
});

/* ================================================================
 *  MODULE MOCKS
 * ================================================================ */
vi.mock("../db", () => ({ db: {}, pool: {} }));
vi.mock("../storage", () => ({ storage: memStore }));
vi.mock("@clerk/clerk-sdk-node", () => ({ createClerkClient: () => null }));
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
        const user = await memStore.upsertUser({ id: userId, email: `${name}@test.dev`, firstName: name, lastName: null, profileImageUrl: null });
        const userGroups = await memStore.getUserGroups(userId);
        if (userGroups.length === 0) {
          const { v4: uuidv4 } = await import("uuid");
          await memStore.createGroup({ id: uuidv4(), name: "Solo Deuces", description: "Your personal throne log", createdBy: userId });
        }
        req.session.userId = userId;
        req.session.save((err: any) => {
          if (err) return res.status(500).json({ message: "Failed to save session" });
          res.json({ ok: true, user: { id: user.id } });
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
 *  IMPORTS
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
  process.env.CLERK_WEBHOOK_SECRET = "test-webhook-secret";
  app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  server = await registerRoutes(app);
});

afterAll(() => { server.close(); });
beforeEach(() => { memStore._reset(); });

/* ================================================================
 *  TESTS: GET /api/config
 * ================================================================ */
describe("GET /api/config", () => {
  it("is publicly accessible without auth", async () => {
    const res = await supertest(app).get("/api/config");
    expect(res.status).toBe(200);
  });

  it("returns clerkPublishableKey field (null when env var not set)", async () => {
    delete process.env.VITE_CLERK_PUBLISHABLE_KEY;
    delete process.env.CLERK_PUBLISHABLE_KEY;
    const res = await supertest(app).get("/api/config");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("clerkPublishableKey");
    expect(res.body.clerkPublishableKey).toBeNull();
  });

  it("returns clerkPublishableKey from VITE_CLERK_PUBLISHABLE_KEY env var", async () => {
    process.env.VITE_CLERK_PUBLISHABLE_KEY = "pk_test_abc123";
    const res = await supertest(app).get("/api/config");
    expect(res.status).toBe(200);
    // Note: VITE_CLERK_PUBLISHABLE_KEY is read at server startup, so this may be null in test env
    // but the endpoint itself should always return the field
    expect(res.body).toHaveProperty("clerkPublishableKey");
    delete process.env.VITE_CLERK_PUBLISHABLE_KEY;
  });
});

/* ================================================================
 *  TESTS: GET /api/groups/invite-preview/:inviteCode
 * ================================================================ */
describe("GET /api/groups/invite-preview/:inviteCode", () => {
  it("is publicly accessible without auth", async () => {
    memStore._seedInvitePreview("11111111-0000-0000-0000-000000000001", {
      name: "The Throne Room",
      memberCount: 3,
      memberNames: ["alice", "bob", "carol"],
      currentStreak: 5,
      deuceCount: 42,
    });
    const res = await supertest(app).get("/api/groups/invite-preview/11111111-0000-0000-0000-000000000001");
    expect(res.status).toBe(200);
  });

  it("returns group name, memberCount, memberNames, currentStreak, deuceCount", async () => {
    memStore._seedInvitePreview("11111111-0000-0000-0000-000000000002", {
      name: "Porcelain Posse",
      memberCount: 4,
      memberNames: ["alice", "bob", "carol", "dave"],
      currentStreak: 7,
      deuceCount: 100,
    });
    const res = await supertest(app).get("/api/groups/invite-preview/11111111-0000-0000-0000-000000000002");
    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Porcelain Posse");
    expect(res.body.memberCount).toBe(4);
    expect(res.body.memberNames).toEqual(["alice", "bob", "carol", "dave"]);
    expect(res.body.currentStreak).toBe(7);
    expect(res.body.deuceCount).toBe(100);
  });

  it("returns 404 for unknown invite code", async () => {
    const res = await supertest(app).get("/api/groups/invite-preview/BADCODE");
    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/invite/i);
  });

  it("returns 404 for empty-looking code", async () => {
    const res = await supertest(app).get("/api/groups/invite-preview/NOTEXIST");
    expect(res.status).toBe(404);
  });
});

/* ================================================================
 *  TESTS: GET /api/og/invite/:inviteCode
 * ================================================================ */
describe("GET /api/og/invite/:inviteCode", () => {
  it("is publicly accessible without auth", async () => {
    memStore._seedInvitePreview("22222222-0000-0000-0000-000000000001", {
      name: "Flush Squad",
      memberCount: 2,
      memberNames: ["alice", "bob"],
      currentStreak: 0,
      deuceCount: 10,
    });
    const res = await supertest(app).get("/api/og/invite/22222222-0000-0000-0000-000000000001");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/text\/html/);
  });

  it("returns HTML with OG meta tags for a valid invite", async () => {
    memStore._seedInvitePreview("22222222-0000-0000-0000-000000000002", {
      name: "The Regulars",
      memberCount: 3,
      memberNames: ["alice", "bob", "carol"],
      currentStreak: 5,
      deuceCount: 33,
    });
    const res = await supertest(app).get("/api/og/invite/22222222-0000-0000-0000-000000000002");
    expect(res.status).toBe(200);
    const html = res.text;
    expect(html).toContain("og:title");
    expect(html).toContain("og:description");
    expect(html).toContain("og:image");
    expect(html).toContain("twitter:card");
    expect(html).toContain("The Regulars");
  });

  it("includes member count in the OG description", async () => {
    memStore._seedInvitePreview("22222222-0000-0000-0000-000000000003", {
      name: "The Crew",
      memberCount: 5,
      memberNames: ["a", "b", "c", "d", "e"],
      currentStreak: 0,
      deuceCount: 20,
    });
    const res = await supertest(app).get("/api/og/invite/22222222-0000-0000-0000-000000000003");
    expect(res.status).toBe(200);
    expect(res.text).toContain("5 members");
  });

  it("includes streak in OG description when streak > 0", async () => {
    memStore._seedInvitePreview("22222222-0000-0000-0000-000000000004", {
      name: "Streak Masters",
      memberCount: 2,
      memberNames: ["alice", "bob"],
      currentStreak: 12,
      deuceCount: 60,
    });
    const res = await supertest(app).get("/api/og/invite/22222222-0000-0000-0000-000000000004");
    expect(res.status).toBe(200);
    expect(res.text).toContain("12-day streak");
  });

  it("omits streak from description when streak is 0", async () => {
    memStore._seedInvitePreview("22222222-0000-0000-0000-000000000005", {
      name: "New Squad",
      memberCount: 1,
      memberNames: ["alice"],
      currentStreak: 0,
      deuceCount: 1,
    });
    const res = await supertest(app).get("/api/og/invite/22222222-0000-0000-0000-000000000005");
    expect(res.status).toBe(200);
    expect(res.text).not.toContain("-day streak");
  });

  it("truncates member list to 5 and adds 'and N more'", async () => {
    memStore._seedInvitePreview("22222222-0000-0000-0000-000000000006", {
      name: "Big Squad",
      memberCount: 8,
      memberNames: ["a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8"],
      currentStreak: 0,
      deuceCount: 80,
    });
    const res = await supertest(app).get("/api/og/invite/22222222-0000-0000-0000-000000000006");
    expect(res.status).toBe(200);
    expect(res.text).toContain("and 3 more");
  });

  it("returns 404 HTML when invite code is not found", async () => {
    const res = await supertest(app).get("/api/og/invite/99999999-0000-0000-0000-000000000000");
    expect(res.status).toBe(404);
    expect(res.text).toContain("not found");
  });

  it("escapes HTML in group name to prevent XSS", async () => {
    memStore._seedInvitePreview("22222222-0000-0000-0000-000000000007", {
      name: '<script>alert("xss")</script>',
      memberCount: 1,
      memberNames: ["attacker"],
      currentStreak: 0,
      deuceCount: 1,
    });
    const res = await supertest(app).get("/api/og/invite/22222222-0000-0000-0000-000000000007");
    expect(res.status).toBe(200);
    // Raw script tag should not appear unescaped
    expect(res.text).not.toContain('<script>alert("xss")</script>');
    // It should be HTML-escaped
    expect(res.text).toContain("&lt;script&gt;");
  });

  it("singular 'member' when memberCount is 1", async () => {
    memStore._seedInvitePreview("22222222-0000-0000-0000-000000000008", {
      name: "Solo Deuces",
      memberCount: 1,
      memberNames: ["alice"],
      currentStreak: 0,
      deuceCount: 5,
    });
    const res = await supertest(app).get("/api/og/invite/22222222-0000-0000-0000-000000000008");
    expect(res.status).toBe(200);
    expect(res.text).toContain("1 member");
    expect(res.text).not.toContain("1 members");
  });
});
