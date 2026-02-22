import { vi, describe, it, expect, beforeAll, beforeEach, afterAll } from "vitest";
import type { Express } from "express";
import type { Server } from "http";

/* ================================================================
 *  IN-MEMORY STORAGE  (date-aware getMembersLogStatusToday for streak tests)
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

    // DATE-AWARE: filters entries by loggedAt matching the _today param (YYYY-MM-DD)
    async getMembersLogStatusToday(groupId: string, _today: string) {
      const memberIds = _members.filter((m) => m.groupId === groupId).map((m) => m.userId);
      return memberIds.map((uid) => {
        const user = _users.get(uid);
        return { userId: uid, username: user?.username ?? null, firstName: user?.firstName ?? null, profileImageUrl: user?.profileImageUrl ?? null,
          hasLogged: [..._entries.values()].some(
            (e) => e.groupId === groupId && e.userId === uid &&
              new Date(e.loggedAt).toISOString().slice(0, 10) === _today,
          ),
        };
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
        const { username } = req.body;
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

        req.session.userId = userId;
        req.session.save((err: any) => {
          if (err) return res.status(500).json({ message: "Failed to save session" });
          res.json({ ok: true, user: { id: user.id, username: user.username, createdAt: user.createdAt } });
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
 *  FAKE TIMERS — control "today" for streak calculation
 * ================================================================ */
vi.useFakeTimers();

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
const BASE_DATE = "2024-06-01T12:00:00Z";

beforeAll(async () => {
  vi.setSystemTime(new Date(BASE_DATE));
  app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  server = await registerRoutes(app);
});

afterAll(() => {
  vi.useRealTimers();
  server.close();
});

beforeEach(() => {
  memStore._reset();
  vi.setSystemTime(new Date(BASE_DATE));
});

async function loginAs(username: string) {
  const agent = supertest.agent(app);
  await agent.post("/api/login").send({ username });
  return agent;
}

/** Helper: POST a deuce for a given agent + group */
async function logDeuce(agent: any, groupId: string, thoughts = "test") {
  return agent.post("/api/deuces").send({
    groupIds: [groupId], location: "Home", thoughts,
    loggedAt: new Date().toISOString(),
  });
}

/** Helper: advance fake clock to a specific day offset from BASE_DATE */
function setDay(dayOffset: number) {
  const d = new Date(BASE_DATE);
  d.setUTCDate(d.getUTCDate() + dayOffset);
  vi.setSystemTime(d);
}

/* ================================================================
 *  STREAK EDGE CASE TESTS
 * ================================================================ */
describe("Streak edge cases", () => {

  it("single member group: streak increments daily on solo logs", async () => {
    setDay(0);
    const alice = await loginAs("alice");
    const groupRes = await alice.post("/api/groups").send({ name: "Solo Streak" });
    const groupId = groupRes.body.id;

    // Day 0: log → streak = 1
    await logDeuce(alice, groupId, "Day 0");
    let streak = await alice.get(`/api/groups/${groupId}/streak`);
    expect(streak.body.currentStreak).toBe(1);

    // Day 1: log → streak = 2
    setDay(1);
    await logDeuce(alice, groupId, "Day 1");
    streak = await alice.get(`/api/groups/${groupId}/streak`);
    expect(streak.body.currentStreak).toBe(2);

    // Day 2: log → streak = 3
    setDay(2);
    await logDeuce(alice, groupId, "Day 2");
    streak = await alice.get(`/api/groups/${groupId}/streak`);
    expect(streak.body.currentStreak).toBe(3);
    expect(streak.body.longestStreak).toBe(3);
  });

  it("multi-member group: streak only advances when ALL members log that day", async () => {
    setDay(0);
    const alice = await loginAs("alice");
    const groupRes = await alice.post("/api/groups").send({ name: "Team Streak" });
    const groupId = groupRes.body.id;

    // Bob joins
    const inviteRes = await alice.post(`/api/groups/${groupId}/invite`);
    const bob = await loginAs("bob");
    await bob.post(`/api/join/${inviteRes.body.id}`);

    // Only Alice logs → streak stays 0
    await logDeuce(alice, groupId, "Just Alice");
    let streak = await alice.get(`/api/groups/${groupId}/streak`);
    expect(streak.body.currentStreak).toBe(0);

    // Bob logs too → both logged → streak = 1
    await logDeuce(bob, groupId, "Bob too");
    streak = await alice.get(`/api/groups/${groupId}/streak`);
    expect(streak.body.currentStreak).toBe(1);
  });

  it("missing a day breaks streak back to 0", async () => {
    setDay(0);
    const alice = await loginAs("alice");
    const groupRes = await alice.post("/api/groups").send({ name: "Break Streak" });
    const groupId = groupRes.body.id;

    // Day 0: log → streak = 1
    await logDeuce(alice, groupId, "Day 0");
    let streak = await alice.get(`/api/groups/${groupId}/streak`);
    expect(streak.body.currentStreak).toBe(1);

    // Day 1: log → streak = 2
    setDay(1);
    await logDeuce(alice, groupId, "Day 1");
    streak = await alice.get(`/api/groups/${groupId}/streak`);
    expect(streak.body.currentStreak).toBe(2);

    // Day 2: SKIP (no log)

    // Day 3: log → streak resets to 1 (missed day 2)
    setDay(3);
    await logDeuce(alice, groupId, "Day 3");
    streak = await alice.get(`/api/groups/${groupId}/streak`);
    expect(streak.body.currentStreak).toBe(1);
  });

  it("POST /api/groups/:id/streak/check correctly identifies at-risk members", async () => {
    setDay(0);
    const alice = await loginAs("alice");
    const groupRes = await alice.post("/api/groups").send({ name: "Risk Check" });
    const groupId = groupRes.body.id;

    // Bob joins
    const inviteRes = await alice.post(`/api/groups/${groupId}/invite`);
    const bob = await loginAs("bob");
    await bob.post(`/api/join/${inviteRes.body.id}`);

    // Nobody logged → both at risk
    let checkRes = await alice.post(`/api/groups/${groupId}/streak/check`);
    expect(checkRes.body.atRisk).toBe(true);
    expect(checkRes.body.missingMembers).toHaveLength(2);

    // Only Alice logs → Bob is at risk
    await logDeuce(alice, groupId, "Alice logged");
    checkRes = await alice.post(`/api/groups/${groupId}/streak/check`);
    expect(checkRes.body.atRisk).toBe(true);
    expect(checkRes.body.missingMembers).toHaveLength(1);
    expect(checkRes.body.missingMembers[0]).toMatch(/bob/i);

    // Bob logs too → nobody at risk
    await logDeuce(bob, groupId, "Bob logged");
    checkRes = await alice.post(`/api/groups/${groupId}/streak/check`);
    expect(checkRes.body.atRisk).toBe(false);
    expect(checkRes.body.missingMembers).toEqual([]);
  });

  it("longest streak tracking persists correctly across multiple days", async () => {
    setDay(0);
    const alice = await loginAs("alice");
    const groupRes = await alice.post("/api/groups").send({ name: "Longest Streak" });
    const groupId = groupRes.body.id;

    // Build streak to 3 (days 0, 1, 2)
    for (let day = 0; day <= 2; day++) {
      setDay(day);
      await logDeuce(alice, groupId, `Day ${day}`);
    }
    let streak = await alice.get(`/api/groups/${groupId}/streak`);
    expect(streak.body.currentStreak).toBe(3);
    expect(streak.body.longestStreak).toBe(3);

    // Day 3: skip

    // Day 4: log → streak resets to 1, but longestStreak stays 3
    setDay(4);
    await logDeuce(alice, groupId, "Day 4 restart");
    streak = await alice.get(`/api/groups/${groupId}/streak`);
    expect(streak.body.currentStreak).toBe(1);
    expect(streak.body.longestStreak).toBe(3);

    // Day 5: log → streak = 2, longestStreak still 3
    setDay(5);
    await logDeuce(alice, groupId, "Day 5");
    streak = await alice.get(`/api/groups/${groupId}/streak`);
    expect(streak.body.currentStreak).toBe(2);
    expect(streak.body.longestStreak).toBe(3);

    // Day 6: log → streak = 3, longestStreak still 3
    setDay(6);
    await logDeuce(alice, groupId, "Day 6");
    streak = await alice.get(`/api/groups/${groupId}/streak`);
    expect(streak.body.currentStreak).toBe(3);
    expect(streak.body.longestStreak).toBe(3);

    // Day 7: log → streak = 4, longestStreak updates to 4
    setDay(7);
    await logDeuce(alice, groupId, "Day 7 new record");
    streak = await alice.get(`/api/groups/${groupId}/streak`);
    expect(streak.body.currentStreak).toBe(4);
    expect(streak.body.longestStreak).toBe(4);
  });
});
