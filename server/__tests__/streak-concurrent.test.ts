import { vi, describe, it, expect, beforeAll, beforeEach, afterAll } from "vitest";
import type { Express } from "express";
import type { Server } from "http";

/* ================================================================
 *  IN-MEMORY STORAGE  (extended with concurrency helpers)
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
    async getUser(id: string) { const u = _users.get(id); return u?.deletedAt ? undefined : u; },
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
    async updateUserTheme(userId: string, theme: string) {
      const user = _users.get(userId);
      if (!user) throw new Error("User not found");
      user.theme = theme; user.updatedAt = new Date(); return user;
    },
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
      user.subscription = subscription; user.subscriptionExpiresAt = expiresAt;
      user.updatedAt = new Date(); return user;
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
    async getPremiumAnalytics(userId: string) {
      const userEntries = [..._entries.values()].filter((e) => e.userId === userId);
      const groupIds = _members.filter((m) => m.userId === userId).map((m) => m.groupId);
      let longestStreak = 0; let currentStreak = 0;
      for (const gid of groupIds) {
        const s = _streaks.get(gid);
        if (s) { longestStreak = Math.max(longestStreak, s.longestStreak); currentStreak = Math.max(currentStreak, s.currentStreak); }
      }
      return {
        totalDeuces: userEntries.length, avgPerWeek: userEntries.length, longestStreak, currentStreak,
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
          hasLogged: [..._entries.values()].some(
            (e) => e.groupId === groupId && e.userId === uid &&
              new Date(e.loggedAt).toISOString().slice(0, 10) === _today,
          ),
        };
      });
    },

    async getUserDailyLogCount(userId: string, dateUTC: string) {
      let count = 0;
      for (const e of _entries.values()) {
        if (e.userId === userId && new Date(e.loggedAt).toISOString().slice(0, 10) === dateUTC) count++;
      }
      return count;
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

    /* ---- Stubs ---- */
    async getGroupPushTokens(_gid: string) { return []; },
    async createBroadcast(b: any) { return b; },
    async getDailyChallengeCompletion(_userId: string, _challengeDate: string) { return undefined; },
    async completeDailyChallenge(completion: any) { return { id: 1, ...completion }; },
    async updateUserReminder(_userId: string, _h: number, _m: number) { return _users.get(_userId); },
    async getUserByUsername(username: string) {
      for (const [, user] of _users) { if (user.username === username) return user; }
      return undefined;
    },
    async getUserLongestStreak(_userId: string) { return 0; },
    async getUserBestDay(_userId: string) { return undefined; },
    async getGroupMemberTypicalHours(_groupId: string) { return []; },
    async upsertPushToken(token: any) { return token; },
    async getReferralDashboardStats(_userId: string) {
      return { totalReferrals: 0, premiumConversions: 0, pendingConversions: 0 };
    },
    async getReferralLeaderboard() { return []; },

    // Expose internals for assertions
    _getStreak(groupId: string) { return _streaks.get(groupId); },
    _getEntries() { return _entries; },
    _getMembers() { return _members; },

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
 *  FAKE TIMERS
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

async function loginAsPremium(username: string) {
  const agent = await loginAs(username);
  const userId = `dev-${username.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
  await memStore.updateUserSubscription(userId, "premium", new Date(Date.now() + 365 * 24 * 60 * 60 * 1000));
  return agent;
}

async function logDeuce(agent: any, groupId: string, thoughts = "test") {
  return agent.post("/api/deuces").send({
    groupIds: [groupId], location: "Home", thoughts,
    loggedAt: new Date().toISOString(),
  });
}

function setDay(dayOffset: number) {
  const d = new Date(BASE_DATE);
  d.setUTCDate(d.getUTCDate() + dayOffset);
  vi.setSystemTime(d);
}

/** Set time to a specific hour on a given day offset */
function setDayAndHour(dayOffset: number, hour: number, minute = 0) {
  const d = new Date(BASE_DATE);
  d.setUTCDate(d.getUTCDate() + dayOffset);
  d.setUTCHours(hour, minute, 0, 0);
  vi.setSystemTime(d);
}

/** Create a group with N members and return { groupId, agents[] } */
async function createGroupWithMembers(ownerName: string, memberNames: string[]) {
  const owner = await loginAsPremium(ownerName);
  const groupRes = await owner.post("/api/groups").send({ name: `Team-${ownerName}` });
  const groupId = groupRes.body.id;

  const agents: any[] = [owner];
  for (const name of memberNames) {
    const inviteRes = await owner.post(`/api/groups/${groupId}/invite`);
    const member = await loginAsPremium(name);
    await member.post(`/api/join/${inviteRes.body.id}`);
    agents.push(member);
  }

  return { groupId, agents };
}

/* ================================================================
 *  TESTS: Concurrent logging & race conditions
 * ================================================================ */
describe("Streak recalculation — concurrent logs & race conditions", () => {

  it("idempotent: multiple logs by same user same day does not double-count streak", async () => {
    setDay(0);
    const alice = await loginAsPremium("alice");
    const groupRes = await alice.post("/api/groups").send({ name: "Idempotent" });
    const groupId = groupRes.body.id;

    // Log 3 times on the same day
    await logDeuce(alice, groupId, "First log");
    await logDeuce(alice, groupId, "Second log");
    await logDeuce(alice, groupId, "Third log");

    const streak = await alice.get(`/api/groups/${groupId}/streak`);
    expect(streak.body.currentStreak).toBe(1);
    expect(streak.body.longestStreak).toBe(1);
  });

  it("concurrent member logs: streak advances only once when last member completes the day", async () => {
    setDay(0);
    const { groupId, agents: [alice, bob, charlie] } = await createGroupWithMembers("alice", ["bob", "charlie"]);

    // Alice logs first — streak should still be 0
    await logDeuce(alice, groupId, "Alice first");
    let streak = await alice.get(`/api/groups/${groupId}/streak`);
    expect(streak.body.currentStreak).toBe(0);

    // Bob logs — still not all members
    await logDeuce(bob, groupId, "Bob second");
    streak = await alice.get(`/api/groups/${groupId}/streak`);
    expect(streak.body.currentStreak).toBe(0);

    // Charlie logs — now all members have logged, streak = 1
    await logDeuce(charlie, groupId, "Charlie third");
    streak = await alice.get(`/api/groups/${groupId}/streak`);
    expect(streak.body.currentStreak).toBe(1);

    // Additional log by Alice again — idempotent, still 1
    await logDeuce(alice, groupId, "Alice again");
    streak = await alice.get(`/api/groups/${groupId}/streak`);
    expect(streak.body.currentStreak).toBe(1);
  });

  it("simulated concurrent requests: all members log nearly simultaneously", async () => {
    setDay(0);
    const { groupId, agents: [alice, bob] } = await createGroupWithMembers("alice", ["bob"]);

    // Fire both requests concurrently (Promise.all simulates near-simultaneous)
    const [resA, resB] = await Promise.all([
      logDeuce(alice, groupId, "Alice concurrent"),
      logDeuce(bob, groupId, "Bob concurrent"),
    ]);

    expect(resA.status).toBe(200);
    expect(resB.status).toBe(200);

    const streak = await alice.get(`/api/groups/${groupId}/streak`);
    expect(streak.body.currentStreak).toBe(1);
    expect(streak.body.longestStreak).toBe(1);
  });

  it("rapid double-submit by same user does not corrupt streak", async () => {
    setDay(0);
    const alice = await loginAsPremium("alice");
    const groupRes = await alice.post("/api/groups").send({ name: "DoubleSubmit" });
    const groupId = groupRes.body.id;

    // Fire 5 concurrent requests from same user
    const results = await Promise.all(
      Array.from({ length: 5 }, (_, i) => logDeuce(alice, groupId, `Rapid ${i}`))
    );

    // All should succeed (entries created)
    results.forEach((r) => expect(r.status).toBe(200));

    // Streak should still be exactly 1
    const streak = await alice.get(`/api/groups/${groupId}/streak`);
    expect(streak.body.currentStreak).toBe(1);
  });

  it("concurrent logs across consecutive days build streak correctly", async () => {
    const { groupId, agents: [alice, bob] } = await createGroupWithMembers("alice", ["bob"]);

    for (let day = 0; day < 5; day++) {
      setDay(day);
      // Both log concurrently each day
      await Promise.all([
        logDeuce(alice, groupId, `Alice day ${day}`),
        logDeuce(bob, groupId, `Bob day ${day}`),
      ]);
    }

    const streak = await alice.get(`/api/groups/${groupId}/streak`);
    expect(streak.body.currentStreak).toBe(5);
    expect(streak.body.longestStreak).toBe(5);
  });
});

/* ================================================================
 *  TESTS: Day boundary edge cases
 * ================================================================ */
describe("Streak recalculation — day boundary edge cases", () => {

  it("logging at 23:59 UTC and 00:01 UTC next day counts as two separate days", async () => {
    const alice = await loginAsPremium("alice");
    const groupRes = await alice.post("/api/groups").send({ name: "Boundary" });
    const groupId = groupRes.body.id;

    // Log at 23:59 UTC on day 0
    setDayAndHour(0, 23, 59);
    await logDeuce(alice, groupId, "Late night");
    let streak = await alice.get(`/api/groups/${groupId}/streak`);
    expect(streak.body.currentStreak).toBe(1);

    // Log at 00:01 UTC on day 1 (next calendar day)
    setDayAndHour(1, 0, 1);
    await logDeuce(alice, groupId, "Early morning");
    streak = await alice.get(`/api/groups/${groupId}/streak`);
    expect(streak.body.currentStreak).toBe(2);
  });

  it("logging twice at midnight boundary on same UTC day does not double-count", async () => {
    const alice = await loginAsPremium("alice");
    const groupRes = await alice.post("/api/groups").send({ name: "MidnightSame" });
    const groupId = groupRes.body.id;

    // Log at 00:00 UTC
    setDayAndHour(0, 0, 0);
    await logDeuce(alice, groupId, "Midnight start");
    let streak = await alice.get(`/api/groups/${groupId}/streak`);
    expect(streak.body.currentStreak).toBe(1);

    // Log again at 23:59 same UTC day
    setDayAndHour(0, 23, 59);
    await logDeuce(alice, groupId, "Midnight end");
    streak = await alice.get(`/api/groups/${groupId}/streak`);
    expect(streak.body.currentStreak).toBe(1);
  });

  it("gap of exactly 2 days resets streak to 1", async () => {
    const alice = await loginAsPremium("alice");
    const groupRes = await alice.post("/api/groups").send({ name: "TwoDayGap" });
    const groupId = groupRes.body.id;

    // Build streak to 3
    for (let d = 0; d < 3; d++) {
      setDay(d);
      await logDeuce(alice, groupId, `Day ${d}`);
    }
    let streak = await alice.get(`/api/groups/${groupId}/streak`);
    expect(streak.body.currentStreak).toBe(3);

    // Skip day 3 AND day 4 (two-day gap)
    // Log on day 5
    setDay(5);
    await logDeuce(alice, groupId, "Day 5 restart");
    streak = await alice.get(`/api/groups/${groupId}/streak`);
    expect(streak.body.currentStreak).toBe(1);
    // Longest streak preserved
    expect(streak.body.longestStreak).toBe(3);
  });

  it("gap of many days (30+) resets streak correctly", async () => {
    const alice = await loginAsPremium("alice");
    const groupRes = await alice.post("/api/groups").send({ name: "LongGap" });
    const groupId = groupRes.body.id;

    setDay(0);
    await logDeuce(alice, groupId, "Day 0");
    let streak = await alice.get(`/api/groups/${groupId}/streak`);
    expect(streak.body.currentStreak).toBe(1);

    // Jump 45 days ahead
    setDay(45);
    await logDeuce(alice, groupId, "Day 45");
    streak = await alice.get(`/api/groups/${groupId}/streak`);
    expect(streak.body.currentStreak).toBe(1);
    expect(streak.body.longestStreak).toBe(1);
  });
});

/* ================================================================
 *  TESTS: Multi-group concurrent logging
 * ================================================================ */
describe("Streak recalculation — multi-group scenarios", () => {

  it("logging to multiple groups simultaneously updates each streak independently", async () => {
    setDay(0);
    const alice = await loginAsPremium("alice");
    const group1Res = await alice.post("/api/groups").send({ name: "Group A" });
    const group2Res = await alice.post("/api/groups").send({ name: "Group B" });
    const gid1 = group1Res.body.id;
    const gid2 = group2Res.body.id;

    // Log to both groups at once
    const res = await alice.post("/api/deuces").send({
      groupIds: [gid1, gid2], location: "Home", thoughts: "Multi-group",
      loggedAt: new Date().toISOString(),
    });
    expect(res.status).toBe(200);

    const streak1 = await alice.get(`/api/groups/${gid1}/streak`);
    const streak2 = await alice.get(`/api/groups/${gid2}/streak`);
    expect(streak1.body.currentStreak).toBe(1);
    expect(streak2.body.currentStreak).toBe(1);
  });

  it("streak in one group is independent of another group's gap", async () => {
    setDay(0);
    const alice = await loginAsPremium("alice");
    const group1Res = await alice.post("/api/groups").send({ name: "Consistent" });
    const group2Res = await alice.post("/api/groups").send({ name: "Sporadic" });
    const gidA = group1Res.body.id;
    const gidB = group2Res.body.id;

    // Day 0: log to both
    await alice.post("/api/deuces").send({
      groupIds: [gidA, gidB], location: "Home", thoughts: "Both",
      loggedAt: new Date().toISOString(),
    });

    // Day 1: log to group A only
    setDay(1);
    await logDeuce(alice, gidA, "A only");

    // Day 2: log to both
    setDay(2);
    await alice.post("/api/deuces").send({
      groupIds: [gidA, gidB], location: "Home", thoughts: "Both again",
      loggedAt: new Date().toISOString(),
    });

    const streakA = await alice.get(`/api/groups/${gidA}/streak`);
    const streakB = await alice.get(`/api/groups/${gidB}/streak`);

    // Group A: 3 consecutive days
    expect(streakA.body.currentStreak).toBe(3);
    // Group B: skipped day 1, so streak resets to 1 on day 2
    expect(streakB.body.currentStreak).toBe(1);
  });
});

/* ================================================================
 *  TESTS: Member changes mid-streak
 * ================================================================ */
describe("Streak recalculation — member join/leave mid-streak", () => {

  it("new member joining mid-streak: must also log for streak to continue", async () => {
    setDay(0);
    const alice = await loginAsPremium("alice");
    const groupRes = await alice.post("/api/groups").send({ name: "Growing Team" });
    const groupId = groupRes.body.id;

    // Day 0: Alice logs solo, streak = 1
    await logDeuce(alice, groupId, "Day 0 solo");
    let streak = await alice.get(`/api/groups/${groupId}/streak`);
    expect(streak.body.currentStreak).toBe(1);

    // Day 1: Bob joins, Alice logs but Bob doesn't
    setDay(1);
    const inviteRes = await alice.post(`/api/groups/${groupId}/invite`);
    const bob = await loginAsPremium("bob");
    await bob.post(`/api/join/${inviteRes.body.id}`);

    await logDeuce(alice, groupId, "Day 1 Alice only");
    streak = await alice.get(`/api/groups/${groupId}/streak`);
    // Bob hasn't logged — streak shouldn't advance
    expect(streak.body.currentStreak).toBeLessThanOrEqual(1);

    // Bob logs too — now streak should advance
    await logDeuce(bob, groupId, "Day 1 Bob too");
    streak = await alice.get(`/api/groups/${groupId}/streak`);
    expect(streak.body.currentStreak).toBe(2);
  });

  it("member leaving does not require their log for future streak days", async () => {
    setDay(0);
    const { groupId, agents: [alice, bob] } = await createGroupWithMembers("alice", ["bob"]);

    // Day 0: both log
    await Promise.all([
      logDeuce(alice, groupId, "Alice d0"),
      logDeuce(bob, groupId, "Bob d0"),
    ]);
    let streak = await alice.get(`/api/groups/${groupId}/streak`);
    expect(streak.body.currentStreak).toBe(1);

    // Day 1: Bob leaves the group
    setDay(1);
    await alice.delete(`/api/groups/${groupId}/members/dev-bob`);

    // Alice logs alone — she's the only member now
    await logDeuce(alice, groupId, "Alice d1 solo");
    streak = await alice.get(`/api/groups/${groupId}/streak`);
    expect(streak.body.currentStreak).toBe(2);
  });
});

/* ================================================================
 *  TESTS: Streak state consistency under stress
 * ================================================================ */
describe("Streak recalculation — stress & consistency", () => {

  it("10 consecutive days with concurrent 3-member logs produces correct streak", async () => {
    const { groupId, agents: [alice, bob, charlie] } = await createGroupWithMembers("alice", ["bob", "charlie"]);

    for (let day = 0; day < 10; day++) {
      setDay(day);
      // All three log concurrently each day
      await Promise.all([
        logDeuce(alice, groupId, `Alice d${day}`),
        logDeuce(bob, groupId, `Bob d${day}`),
        logDeuce(charlie, groupId, `Charlie d${day}`),
      ]);
    }

    const streak = await alice.get(`/api/groups/${groupId}/streak`);
    expect(streak.body.currentStreak).toBe(10);
    expect(streak.body.longestStreak).toBe(10);
  });

  it("alternating complete/incomplete days reset correctly with multiple members", async () => {
    const { groupId, agents: [alice, bob] } = await createGroupWithMembers("alice", ["bob"]);

    // Day 0: both log → streak = 1
    setDay(0);
    await Promise.all([logDeuce(alice, groupId, "d0"), logDeuce(bob, groupId, "d0")]);
    let streak = await alice.get(`/api/groups/${groupId}/streak`);
    expect(streak.body.currentStreak).toBe(1);

    // Day 1: only Alice → streak stays 1 (not all logged)
    setDay(1);
    await logDeuce(alice, groupId, "d1 alice only");
    streak = await alice.get(`/api/groups/${groupId}/streak`);
    expect(streak.body.currentStreak).toBeLessThanOrEqual(1);

    // Day 2: skip entirely

    // Day 3: both log → streak resets to 1 (gap from last complete day)
    setDay(3);
    await Promise.all([logDeuce(alice, groupId, "d3"), logDeuce(bob, groupId, "d3")]);
    streak = await alice.get(`/api/groups/${groupId}/streak`);
    expect(streak.body.currentStreak).toBe(1);

    // Day 4: both log → streak = 2
    setDay(4);
    await Promise.all([logDeuce(alice, groupId, "d4"), logDeuce(bob, groupId, "d4")]);
    streak = await alice.get(`/api/groups/${groupId}/streak`);
    expect(streak.body.currentStreak).toBe(2);
  });

  it("longestStreak never decreases even after multiple breaks and rebuilds", async () => {
    const alice = await loginAsPremium("alice");
    const groupRes = await alice.post("/api/groups").send({ name: "LongestNeverShrinks" });
    const groupId = groupRes.body.id;

    // Build streak to 5 (days 0-4)
    for (let d = 0; d < 5; d++) {
      setDay(d);
      await logDeuce(alice, groupId, `Build ${d}`);
    }
    let streak = await alice.get(`/api/groups/${groupId}/streak`);
    expect(streak.body.longestStreak).toBe(5);

    // Break (skip day 5), rebuild to 3 (days 6-8)
    for (let d = 6; d <= 8; d++) {
      setDay(d);
      await logDeuce(alice, groupId, `Rebuild ${d}`);
    }
    streak = await alice.get(`/api/groups/${groupId}/streak`);
    expect(streak.body.currentStreak).toBe(3);
    expect(streak.body.longestStreak).toBe(5); // still 5

    // Break again (skip day 9), rebuild to 7 (days 10-16)
    for (let d = 10; d <= 16; d++) {
      setDay(d);
      await logDeuce(alice, groupId, `Rebuild2 ${d}`);
    }
    streak = await alice.get(`/api/groups/${groupId}/streak`);
    expect(streak.body.currentStreak).toBe(7);
    expect(streak.body.longestStreak).toBe(7); // now 7 > 5
  });

  it("first ever log starts streak at 1, not 0", async () => {
    setDay(0);
    const alice = await loginAsPremium("alice");
    const groupRes = await alice.post("/api/groups").send({ name: "FirstLog" });
    const groupId = groupRes.body.id;

    // Before any log, streak is 0
    let streak = await alice.get(`/api/groups/${groupId}/streak`);
    expect(streak.body.currentStreak).toBe(0);
    expect(streak.body.lastStreakDate).toBeNull();

    // First log ever
    await logDeuce(alice, groupId, "Very first");
    streak = await alice.get(`/api/groups/${groupId}/streak`);
    expect(streak.body.currentStreak).toBe(1);
    expect(streak.body.lastStreakDate).toBe("2024-06-01");
  });

  it("streak check after log on day with no prior lastStreakDate starts fresh", async () => {
    setDay(5); // start on a random day, not day 0
    const alice = await loginAsPremium("alice");
    const groupRes = await alice.post("/api/groups").send({ name: "LatestStart" });
    const groupId = groupRes.body.id;

    await logDeuce(alice, groupId, "Late start");
    const streak = await alice.get(`/api/groups/${groupId}/streak`);
    expect(streak.body.currentStreak).toBe(1);
    expect(streak.body.lastStreakDate).toBe("2024-06-06");
  });
});

/* ================================================================
 *  TESTS: Streak risk check under concurrent conditions
 * ================================================================ */
describe("Streak risk check — concurrent & edge scenarios", () => {

  it("risk check is accurate when members log concurrently", async () => {
    setDay(0);
    const { groupId, agents: [alice, bob, charlie] } = await createGroupWithMembers("alice", ["bob", "charlie"]);

    // Build a streak first so check is meaningful
    await Promise.all([
      logDeuce(alice, groupId, "d0"), logDeuce(bob, groupId, "d0"), logDeuce(charlie, groupId, "d0"),
    ]);

    // Day 1: only alice has logged
    setDay(1);
    await logDeuce(alice, groupId, "d1 alice");

    let check = await alice.post(`/api/groups/${groupId}/streak/check`);
    expect(check.body.atRisk).toBe(true);
    expect(check.body.missingMembers).toHaveLength(2);

    // Bob logs
    await logDeuce(bob, groupId, "d1 bob");
    check = await alice.post(`/api/groups/${groupId}/streak/check`);
    expect(check.body.atRisk).toBe(true);
    expect(check.body.missingMembers).toHaveLength(1);
    expect(check.body.missingMembers[0]).toMatch(/charlie/i);

    // Charlie logs — no longer at risk
    await logDeuce(charlie, groupId, "d1 charlie");
    check = await alice.post(`/api/groups/${groupId}/streak/check`);
    expect(check.body.atRisk).toBe(false);
    expect(check.body.missingMembers).toEqual([]);
  });

  it("risk check on a group with 0 streak shows all members missing", async () => {
    setDay(0);
    const { groupId, agents: [alice] } = await createGroupWithMembers("alice", ["bob"]);

    // No one has logged yet
    const check = await alice.post(`/api/groups/${groupId}/streak/check`);
    expect(check.body.atRisk).toBe(true);
    expect(check.body.missingMembers).toHaveLength(2);
  });
});
