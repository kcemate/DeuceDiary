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
    async getUser(id: string) { return _users.get(id); },
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
      if (user) { user.deuceCount = (user.deuceCount ?? 0) + increment; user.updatedAt = new Date(); }
    },
    async updateUserUsername(userId: string, username: string) {
      const user = _users.get(userId);
      if (!user) throw new Error("User not found");
      for (const [, u] of _users) { if (u.username === username && u.id !== userId) throw new Error("duplicate key value"); }
      user.username = username; user.updatedAt = new Date(); return user;
    },
    async updateUserProfilePicture(userId: string, profileImageUrl: string) {
      const user = _users.get(userId);
      if (!user) throw new Error("User not found");
      user.profileImageUrl = profileImageUrl; user.updatedAt = new Date(); return user;
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
    async resetAllStreakInsurance() {
      let count = 0;
      for (const [, user] of _users) {
        if (user.streakInsuranceUsed) { user.streakInsuranceUsed = false; user.updatedAt = new Date(); count++; }
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
        if (s) { longestStreak = Math.max(longestStreak, s.longestStreak); currentStreak = Math.max(currentStreak, s.currentStreak); }
      }
      return {
        totalDeuces: userEntries.length, avgPerWeek: userEntries.length,
        longestStreak, currentStreak,
        bestDay: { day: "Monday", count: userEntries.length },
        groupRankings: groupIds.map((gid) => {
          const g = _groups.get(gid);
          return { groupId: gid, groupName: g?.name ?? "Unknown", rank: 1, total: 1 };
        }),
      };
    },

    async createGroup(group: any) {
      const g = {
        id: group.id, name: group.name, description: group.description ?? null,
        createdBy: group.createdBy, currentStreak: 0, longestStreak: 0,
        lastStreakDate: null, createdAt: new Date(), updatedAt: new Date(),
      };
      _groups.set(g.id, g);
      _members.push({ id: _memberId++, groupId: g.id, userId: group.createdBy, role: "admin", joinedAt: new Date() });
      return g;
    },
    async getUserGroups(userId: string) {
      const ids = _members.filter((m) => m.userId === userId).map((m) => m.groupId);
      return ids.map((gid) => {
        const g = _groups.get(gid)!;
        const memberCount = _members.filter((m) => m.groupId === gid).length;
        const groupEntries = [..._entries.values()].filter((e) => e.groupId === gid);
        return { ...g, memberCount, entryCount: groupEntries.length,
          lastActivity: groupEntries.length ? new Date(Math.max(...groupEntries.map((e: any) => (e.createdAt ?? new Date()).getTime()))) : undefined };
      });
    },
    async getGroupById(groupId: string) { return _groups.get(groupId); },
    async addGroupMember(member: any) {
      const m = { id: _memberId++, groupId: member.groupId, userId: member.userId, role: member.role ?? "member", joinedAt: new Date() };
      _members.push(m); return m;
    },
    async getGroupMembers(groupId: string) {
      return _members.filter((m) => m.groupId === groupId)
        .map((m) => ({ ...m, user: { ..._users.get(m.userId)!, personalRecord: undefined } }));
    },
    async isUserInGroup(userId: string, groupId: string) { return _members.some((m) => m.userId === userId && m.groupId === groupId); },
    async removeGroupMember(userId: string, groupId: string) { _members = _members.filter((m) => !(m.userId === userId && m.groupId === groupId)); },

    async createDeuceEntry(entry: any) {
      const e = { id: entry.id, userId: entry.userId, groupId: entry.groupId, location: entry.location, thoughts: entry.thoughts, loggedAt: entry.loggedAt, createdAt: new Date() };
      _entries.set(e.id, e); return e;
    },
    async getGroupEntries(groupId: string) {
      return [..._entries.values()].filter((e) => e.groupId === groupId)
        .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))
        .map((e) => ({ ...e, user: _users.get(e.userId)! }));
    },
    async getUserDeucesByDate(userId: string) {
      const byDate = new Map<string, number>();
      for (const e of _entries.values()) {
        if (e.userId === userId) { const d = (e.createdAt ?? new Date()).toISOString().split("T")[0]; byDate.set(d, (byDate.get(d) ?? 0) + 1); }
      }
      return [...byDate.entries()].map(([date, count]) => ({ date, count })).sort((a, b) => b.date.localeCompare(a.date));
    },
    async getEntryById(entryId: string) { return _entries.get(entryId); },
    async getFeedEntries(groupIds: string[], limit: number) {
      return [..._entries.values()].filter((e) => groupIds.includes(e.groupId))
        .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0)).slice(0, limit)
        .map((e) => { const user = _users.get(e.userId); const entryReactions = _reactions.filter((r: any) => r.entryId === e.id);
          return { ...e, user: user ? { id: user.id, username: user.username, profileImageUrl: user.profileImageUrl } : undefined, reactions: entryReactions }; });
    },

    async createInvite(invite: any) {
      const inv = { id: invite.id, groupId: invite.groupId, createdBy: invite.createdBy, expiresAt: invite.expiresAt, createdAt: new Date() };
      _invites.set(inv.id, inv); return inv;
    },
    async getInviteById(inviteId: string) { return _invites.get(inviteId); },
    async deleteInvite(inviteId: string) { _invites.delete(inviteId); },
    async cleanupExpiredInvites() { const now = new Date(); for (const [id, inv] of _invites) { if (inv.expiresAt < now) _invites.delete(id); } },

    async getLocations() { return [..._locations].sort((a, b) => a.isDefault !== b.isDefault ? (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0) : (a.name ?? "").localeCompare(b.name ?? "")); },
    async createLocation(loc: any) { const l = { id: _locationId++, name: loc.name, isDefault: loc.isDefault ?? false, createdBy: loc.createdBy ?? null, createdAt: new Date() }; _locations.push(l); return l; },
    async getLocationByName(name: string) { return _locations.find((l) => l.name === name); },

    async getUserPersonalRecord(userId: string) {
      const byDate = new Map<string, number>();
      for (const e of _entries.values()) { if (e.userId === userId) { const d = (e.createdAt ?? new Date()).toISOString().split("T")[0]; byDate.set(d, (byDate.get(d) ?? 0) + 1); } }
      const arr = [...byDate.entries()].map(([date, count]) => ({ date, count }));
      if (arr.length === 0) return undefined;
      return arr.reduce((mx, c) => (c.count > mx.count ? c : mx), arr[0]);
    },

    async getGroupStreak(groupId: string) { return _streaks.get(groupId) ?? { currentStreak: 0, longestStreak: 0, lastStreakDate: null as string | null }; },
    async updateGroupStreak(groupId: string, currentStreak: number, longestStreak: number, lastStreakDate: string) { _streaks.set(groupId, { currentStreak, longestStreak, lastStreakDate }); },
    async getMembersLogStatusToday(groupId: string, _today: string) {
      const memberIds = _members.filter((m) => m.groupId === groupId).map((m) => m.userId);
      return memberIds.map((uid) => {
        const user = _users.get(uid);
        return { userId: uid, username: user?.username ?? null, firstName: user?.firstName ?? null, profileImageUrl: user?.profileImageUrl ?? null,
          hasLogged: [..._entries.values()].some((e) => e.groupId === groupId && e.userId === uid) };
      });
    },

    async addReaction(reaction: any) {
      const exists = _reactions.find((r) => r.entryId === reaction.entryId && r.userId === reaction.userId && r.emoji === reaction.emoji);
      if (exists) throw new Error("duplicate key value violates unique constraint");
      const r = { id: _reactionId++, entryId: reaction.entryId, userId: reaction.userId, emoji: reaction.emoji, createdAt: new Date() };
      _reactions.push(r); return r;
    },
    async removeReaction(userId: string, entryId: string, emoji: string) { _reactions = _reactions.filter((r) => !(r.userId === userId && r.entryId === entryId && r.emoji === emoji)); },
    async getEntryReactions(entryId: string) {
      return _reactions.filter((r) => r.entryId === entryId).sort((a, b) => (a.createdAt ?? 0) - (b.createdAt ?? 0)).map((r) => ({ ...r, user: _users.get(r.userId)! }));
    },

    /* ---- Daily challenge ops ---- */
    async getDailyChallengeCompletion(_userId: string, _challengeDate: string) { return undefined; },
    async completeDailyChallenge(completion: any) { return { id: 1, ...completion, createdAt: new Date() }; },

    /* ---- Push / broadcast / reminder stubs ---- */
    async upsertPushToken(token: any) { return token; },
    async getGroupPushTokens(_gid: string) { return []; },
    async createBroadcast(b: any) { return b; },
    async updateUserReminder(_userId: string, _h: number, _m: number) { return _users.get(_userId); },

    /* ---- Legacy wall ops ---- */
    async getUserByUsername(username: string) {
      for (const [, u] of _users) { if (u.username === username) return u; }
      return undefined;
    },
    async getUserLongestStreak(_userId: string) { return 0; },
    async getUserBestDay(_userId: string) { return undefined; },

    /* ---- Squad spy mode ---- */
    async getGroupMemberTypicalHours(_groupId: string) { return []; },

    async getAllGroupsWithActiveStreaks(_minStreak: number) { return []; },
    async createStreakAlert(_alert: any) { return _alert; },
    async getGroupMemberCount(groupId: string) { return _members.filter((m) => m.groupId === groupId).length; },
    async getGroupDeuceCount(groupId: string) { return [..._entries.values()].filter((e) => e.groupId === groupId).length; },
    async getWeeklyReport(_userId: string) {
      return { totalDeuces: 0, peakDay: { date: "", count: 0 }, mostActiveSquad: { name: "None", count: 0 }, longestStreak: 0, funniestEntry: null, totalReactionsReceived: 0, weekOf: "" };
    },

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
      app.use(session({ secret: "test-secret", resave: false, saveUninitialized: false }));

      app.post("/api/login", async (req: any, res: any) => {
        const { username, inviteCode } = req.body;
        if (!username || typeof username !== "string" || !username.trim()) {
          return res.status(400).json({ message: "Username is required" });
        }
        const name = username.trim();
        const userId = `dev-${name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
        const user = await memStore.upsertUser({
          id: userId, email: `${name.toLowerCase().replace(/\s+/g, ".")}@localhost.dev`,
          firstName: name, lastName: null, profileImageUrl: null,
        });

        const userGroups = await memStore.getUserGroups(userId);
        if (userGroups.length === 0) {
          const { v4: uuidv4 } = await import("uuid");
          await memStore.createGroup({ id: uuidv4(), name: "Solo Deuces", description: "Your personal throne log", createdBy: userId });
        }

        let joinedGroup: { id: string; name: string } | null = null;
        if (inviteCode && typeof inviteCode === "string") {
          try {
            const invite = await memStore.getInviteById(inviteCode);
            if (invite && invite.expiresAt >= new Date()) {
              const alreadyMember = await memStore.isUserInGroup(userId, invite.groupId);
              if (!alreadyMember) {
                await memStore.addGroupMember({ groupId: invite.groupId, userId, role: "member" });
                await memStore.deleteInvite(inviteCode);
              }
              const group = await memStore.getGroupById(invite.groupId);
              if (group) joinedGroup = { id: group.id, name: group.name };
            }
          } catch (joinErr) { console.error("Auto-join on login failed:", joinErr); }
        }

        req.session.userId = userId;
        req.session.save((err: any) => {
          if (err) return res.status(500).json({ message: "Failed to save session" });
          res.json({ ok: true, user: { id: user.id, username: user.username, profilePicture: user.profileImageUrl, createdAt: user.createdAt }, ...(joinedGroup ? { joinedGroup } : {}) });
        });
      });

      app.get("/api/logout", (req: any, res: any) => { req.session.destroy(() => { res.redirect("/"); }); });
      app.post("/api/auth/logout", (req: any, res: any) => { req.session.destroy(() => { res.json({ ok: true }); }); });
    },

    isAuthenticated: async (req: any, res: any, next: any) => {
      const userId = req.session?.userId;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });
      const user = await memStore.getUser(userId);
      if (!user) return res.status(401).json({ message: "Unauthorized" });
      req.user = user; next();
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

/** Create an authenticated premium supertest agent. */
async function loginAsPremium(username: string) {
  const agent = await loginAs(username);
  const userId = `dev-${username.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
  await memStore.updateUserSubscription(userId, "premium", new Date(Date.now() + 365 * 24 * 60 * 60 * 1000));
  return agent;
}

/* ================================================================
 *  INVITE FLOW INTEGRATION
 * ================================================================ */
describe("Invite flow integration", () => {

  it("full lifecycle: create group → invite → preview → join → verify → streak", async () => {
    // 1) User A creates a group and gets an invite code
    const alice = await loginAsPremium("alice");
    const groupRes = await alice.post("/api/groups").send({ name: "Test Squad" });
    expect(groupRes.status).toBe(200);
    const groupId = groupRes.body.id;

    const inviteRes = await alice.post(`/api/groups/${groupId}/invite`);
    expect(inviteRes.status).toBe(200);
    const inviteCode = inviteRes.body.id;
    expect(inviteCode).toBeDefined();
    expect(inviteRes.body.inviteLink).toContain(inviteCode);

    // 2) GET /api/groups/preview/:inviteCode → returns group info (no auth)
    const previewRes = await supertest(app).get(`/api/groups/preview/${inviteCode}`);
    expect(previewRes.status).toBe(200);
    expect(previewRes.body.name).toBe("Test Squad");
    expect(previewRes.body.memberCount).toBe(1);
    expect(previewRes.body.deuceCount).toBe(0);

    // 3) User B logs in with inviteCode in body → auto-joins group
    const bob = supertest.agent(app);
    const bobLogin = await bob.post("/api/login").send({ username: "bob", inviteCode });
    expect(bobLogin.status).toBe(200);
    expect(bobLogin.body.ok).toBe(true);
    expect(bobLogin.body.joinedGroup).toBeDefined();
    expect(bobLogin.body.joinedGroup.name).toBe("Test Squad");

    // Upgrade Bob to premium so he can access premium-gated endpoints
    await memStore.updateUserSubscription("dev-bob", "premium", new Date(Date.now() + 365 * 24 * 60 * 60 * 1000));

    // 4) GET /api/groups → User B sees the group (premium-gated)
    const bobGroups = await bob.get("/api/groups");
    expect(bobGroups.status).toBe(200);
    const groupNames = bobGroups.body.map((g: any) => g.name);
    expect(groupNames).toContain("Test Squad");
    expect(groupNames).toContain("Solo Deuces");

    // 5) GET /api/groups/:id/streak → streak is 0 (no entries yet, premium-gated)
    const streakRes = await bob.get(`/api/groups/${groupId}/streak`);
    expect(streakRes.status).toBe(200);
    expect(streakRes.body.currentStreak).toBe(0);
    expect(streakRes.body.longestStreak).toBe(0);

    // 6) User B POSTs a deuce → streak recalculates (Alice hasn't logged, so still 0)
    const bobDeuce = await bob.post("/api/deuces").send({
      groupIds: [groupId], location: "Home", thoughts: "Bob's first deuce",
      loggedAt: new Date().toISOString(),
    });
    expect(bobDeuce.status).toBe(200);
    expect(bobDeuce.body.entries).toHaveLength(1);

    const streakAfterBob = await bob.get(`/api/groups/${groupId}/streak`);
    expect(streakAfterBob.body.currentStreak).toBe(0);

    // 7) User A POSTs a deuce → both members logged today → streak = 1
    const aliceDeuce = await alice.post("/api/deuces").send({
      groupIds: [groupId], location: "Office", thoughts: "Alice's deuce",
      loggedAt: new Date().toISOString(),
    });
    expect(aliceDeuce.status).toBe(200);

    const streakAfterAll = await alice.get(`/api/groups/${groupId}/streak`);
    expect(streakAfterAll.body.currentStreak).toBe(1);
    expect(streakAfterAll.body.longestStreak).toBe(1);
  });

  it("rejects already-consumed invite code", async () => {
    // 8) Alice creates group + invite, Bob consumes it, Charlie tries same code
    const alice = await loginAsPremium("alice");
    const groupRes = await alice.post("/api/groups").send({ name: "One-Use Invite" });
    const groupId = groupRes.body.id;
    const inviteRes = await alice.post(`/api/groups/${groupId}/invite`);
    const inviteCode = inviteRes.body.id;

    // Bob joins via invite (consumes it) — premium-gated endpoint
    const bob = await loginAsPremium("bob");
    const bobJoin = await bob.post(`/api/join/${inviteCode}`);
    expect(bobJoin.status).toBe(200);
    expect(bobJoin.body.group).toBeDefined();

    // Charlie tries the same code → fails (invite was deleted)
    const charlie = await loginAsPremium("charlie");
    const charlieJoin = await charlie.post(`/api/join/${inviteCode}`);
    expect(charlieJoin.status).toBe(400);
    expect(charlieJoin.body.message).toMatch(/invalid|expired/i);
  });

  it("returns 404 for invalid invite code on preview", async () => {
    // 9a) Nonexistent invite code
    const res = await supertest(app).get("/api/groups/preview/nonexistent-code");
    expect(res.status).toBe(404);
  });

  it("returns 404 for expired invite code on preview", async () => {
    // 9b) Create an expired invite and try preview
    const alice = await loginAsPremium("alice");
    const groupRes = await alice.post("/api/groups").send({ name: "Expired Group" });
    const groupId = groupRes.body.id;

    // Directly insert expired invite into store
    await memStore.createInvite({
      id: "expired-invite-code",
      groupId,
      createdBy: "dev-alice",
      expiresAt: new Date(Date.now() - 1000), // already expired
    });

    const previewRes = await supertest(app).get("/api/groups/preview/expired-invite-code");
    expect(previewRes.status).toBe(404);
  });

  it("returns 400 for expired invite code on join", async () => {
    const alice = await loginAsPremium("alice");
    const groupRes = await alice.post("/api/groups").send({ name: "Expired Join" });
    const groupId = groupRes.body.id;

    await memStore.createInvite({
      id: "expired-join-code",
      groupId,
      createdBy: "dev-alice",
      expiresAt: new Date(Date.now() - 1000),
    });

    const bob = await loginAsPremium("bob");
    const joinRes = await bob.post("/api/join/expired-join-code");
    expect(joinRes.status).toBe(400);
    expect(joinRes.body.message).toMatch(/invalid|expired/i);
  });

  it("returns 400 for completely nonexistent invite on join", async () => {
    const bob = await loginAsPremium("bob");
    const joinRes = await bob.post("/api/join/totally-fake-id");
    expect(joinRes.status).toBe(400);
  });
});
