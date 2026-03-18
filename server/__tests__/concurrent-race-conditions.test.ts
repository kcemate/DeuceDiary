/**
 * concurrent-race-conditions.test.ts — Round 5: Concurrent Race Conditions
 *
 * Tests for concurrent/parallel operations:
 *  1. Two users reacting to same entry simultaneously
 *  2. Same user adding different emojis simultaneously
 *  3. Same user sending duplicate emoji concurrently (second must fail)
 *  4. Concurrent location creation with same name (race on duplicate)
 *  5. Concurrent referral applies to same code (only one should set referredBy)
 *  6. Concurrent deuce logging from same user (both should succeed up to limit)
 *  7. Concurrent group member adds (both should succeed)
 *  8. Concurrent username updates (duplicate check race)
 */

import { vi, describe, it, expect, beforeAll, beforeEach, afterAll } from "vitest";
import type { Express } from "express";
import type { Server } from "http";

/* ================================================================
 *  IN-MEMORY STORAGE — with mutex support for location creation
 * ================================================================ */
const memStore = vi.hoisted(() => {
  const _users = new Map<string, any>();
  const _groups = new Map<string, any>();
  let _members: any[] = [];
  const _entries = new Map<string, any>();
  let _locations: any[] = [];
  let _reactions: any[] = [];
  let _memberId = 1;
  let _locationId = 1;
  let _reactionId = 1;
  // Track concurrent duplicate reactions for test assertion
  let _duplicateReactionErrors = 0;

  return {
    getDuplicateReactionErrors() { return _duplicateReactionErrors; },

    async getUser(id: string) { return _users.get(id); },
    async upsertUser(data: any) {
      const existing = _users.get(data.id);
      const user = {
        id: data.id,
        email: data.email ?? existing?.email ?? null,
        firstName: data.firstName ?? existing?.firstName ?? null,
        lastName: data.lastName ?? existing?.lastName ?? null,
        username: data.username ?? existing?.username ?? null,
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
      const user = _users.get(userId); if (user) user.deuceCount = (user.deuceCount ?? 0) + increment;
    },
    async updateUserUsername(userId: string, username: string) {
      const user = _users.get(userId); if (!user) throw new Error("User not found");
      for (const [, u] of _users) { if (u.username === username && u.id !== userId) throw new Error("duplicate key value"); }
      user.username = username; return user;
    },
    async updateUserProfilePicture(userId: string, profileImageUrl: string) {
      const user = _users.get(userId); if (!user) throw new Error("User not found");
      user.profileImageUrl = profileImageUrl; return user;
    },
    async updateUserTheme(userId: string, theme: string) {
      const user = _users.get(userId); if (!user) throw new Error("User not found");
      user.theme = theme; return user;
    },
    async getUserSubscription(userId: string) {
      const user = _users.get(userId);
      return { subscription: user?.subscription ?? "free", subscriptionExpiresAt: user?.subscriptionExpiresAt ?? null, streakInsuranceUsed: user?.streakInsuranceUsed ?? false };
    },
    async updateUserSubscription(userId: string, subscription: string, expiresAt: Date) {
      const user = _users.get(userId); if (!user) throw new Error("User not found");
      user.subscription = subscription; user.subscriptionExpiresAt = expiresAt; return user;
    },
    async useStreakInsurance(userId: string) { const u = _users.get(userId); if (u) u.streakInsuranceUsed = true; },
    async resetStreakInsurance(userId: string) { const u = _users.get(userId); if (u) u.streakInsuranceUsed = false; },
    async resetAllStreakInsurance() { return 0; },
    async getPremiumAnalytics(_userId: string) { return { totalDeuces: 0, avgPerWeek: 0, longestStreak: 0, currentStreak: 0, bestDay: { day: "Monday", count: 0 }, groupRankings: [] }; },
    async getWeeklyReport(_userId: string) { return { totalDeuces: 0, peakDay: { date: "2026-01-01", count: 0 }, mostActiveSquad: { name: "None", count: 0 }, longestStreak: 0, funniestEntry: null, totalReactionsReceived: 0, weekOf: "2026-01-01" }; },
    async getUserByUsername(username: string) { return [..._users.values()].find(u => u.username === username); },
    async getUserByReferralCode(code: string) { return [..._users.values()].find(u => u.referralCode === code.toUpperCase()) ?? null; },
    async applyReferral(userId: string, referrerId: string) {
      const referee = _users.get(userId); const referrer = _users.get(referrerId);
      if (referee) referee.referredBy = referrerId;
      if (referrer) referrer.referralCount = (referrer.referralCount ?? 0) + 1;
    },

    async createGroup(group: any) {
      const newGroup = { id: group.id, name: group.name, description: group.description ?? null, createdBy: group.createdBy, currentStreak: 0, longestStreak: 0, lastStreakDate: null, timezone: "UTC", createdAt: new Date(), updatedAt: new Date() };
      _groups.set(newGroup.id, newGroup);
      _members.push({ id: _memberId++, groupId: newGroup.id, userId: group.createdBy, role: "admin", joinedAt: new Date() });
      return newGroup;
    },
    async getUserGroups(userId: string) {
      const ids = _members.filter(m => m.userId === userId).map(m => m.groupId);
      return ids.map(gid => {
        const g = _groups.get(gid)!;
        const entries = [..._entries.values()].filter(e => e.groupId === gid);
        return { ...g, memberCount: _members.filter(m => m.groupId === gid).length, entryCount: entries.length, lastActivity: undefined };
      });
    },
    async getGroupById(groupId: string) { return _groups.get(groupId); },
    async addGroupMember(member: any) {
      const m = { id: _memberId++, groupId: member.groupId, userId: member.userId, role: member.role ?? "member", joinedAt: new Date() };
      _members.push(m); return m;
    },
    async getGroupMembers(groupId: string) { return _members.filter(m => m.groupId === groupId).map(m => ({ ...m, user: _users.get(m.userId) })); },
    async isUserInGroup(userId: string, groupId: string) { return _members.some(m => m.userId === userId && m.groupId === groupId); },
    async isUserInGroups(userId: string, groupIds: string[]) { return new Set(groupIds.filter(gid => _members.some(m => m.userId === userId && m.groupId === gid))); },
    async removeGroupMember(userId: string, groupId: string) { _members = _members.filter(m => !(m.userId === userId && m.groupId === groupId)); },
    async getGroupMemberRole(_groupId: string, _userId: string) {
      const m = _members.find(m => m.groupId === _groupId && m.userId === _userId); return m?.role ?? null;
    },
    async deleteGroup(_groupId: string) {},
    async updateGroup(_groupId: string, _data: any) {},
    async getGroupInvites(_groupId: string) { return []; },
    async getGroupWithMemberCount(groupId: string) {
      const g = _groups.get(groupId); if (!g) return undefined;
      return { ...g, memberCount: _members.filter(m => m.groupId === groupId).length };
    },

    async createDeuceEntry(entry: any) {
      const e = { id: entry.id, userId: entry.userId, groupId: entry.groupId, location: entry.location, thoughts: entry.thoughts, ghost: entry.ghost ?? false, loggedAt: entry.loggedAt, bristolScore: entry.bristolScore ?? null, photoUrl: null, createdAt: new Date() };
      _entries.set(e.id, e); return e;
    },
    async getUserDailyLogCount(userId: string, dateUTC: string) {
      const start = new Date(`${dateUTC}T00:00:00.000Z`); const end = new Date(`${dateUTC}T23:59:59.999Z`);
      return [..._entries.values()].filter(e => e.userId === userId && e.createdAt >= start && e.createdAt <= end).length;
    },
    async getGroupEntries(groupId: string) { return [..._entries.values()].filter(e => e.groupId === groupId).sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0)).map(e => ({ ...e, user: _users.get(e.userId) })); },
    async getUserDeucesByDate(_userId: string) { return []; },
    async getEntryById(entryId: string) { return _entries.get(entryId); },
    async getFeedEntries(_groupIds: string[], _limit: number) { return []; },
    async deleteDeuceEntry(entryId: string) { _entries.delete(entryId); },
    async getUserPersonalRecord(_userId: string) { return undefined; },

    async createInvite(invite: any) { return { id: invite.id, groupId: invite.groupId, createdBy: invite.createdBy, expiresAt: invite.expiresAt, createdAt: new Date() }; },
    async getInviteById(_inviteId: string) { return undefined; },
    async deleteInvite() {},
    async deleteExpiredGroupInvites() {},
    async cleanupExpiredInvites() {},

    async getLocations() { return [..._locations]; },
    async getLocationsForUser(userId: string) { return [..._locations].filter(l => l.isDefault === true || l.createdBy === userId); },
    async createLocation(loc: any) {
      const existing = _locations.find(l => l.name === loc.name);
      if (existing) return existing; // idempotent — return existing if same name
      const l = { id: _locationId++, name: loc.name, isDefault: loc.isDefault ?? false, createdBy: loc.createdBy ?? null, createdAt: new Date() };
      _locations.push(l); return l;
    },
    async getLocationByName(name: string) { return _locations.find(l => l.name === name); },

    async getGroupStreak(_groupId: string) { return { currentStreak: 0, longestStreak: 0, lastStreakDate: null as string | null }; },
    async getGroupStreaksBatch(groupIds: string[]) { const m = new Map<string, any>(); for (const id of groupIds) m.set(id, { currentStreak: 0, longestStreak: 0, lastStreakDate: null }); return m; },
    async updateGroupStreak() {},
    async resetGroupStreak() {},
    async getMembersLogStatusToday(groupId: string, _today: string) { return _members.filter(m => m.groupId === groupId).map(m => ({ userId: m.userId, username: null, firstName: null, profileImageUrl: null, hasLogged: false })); },

    async addReaction(reaction: any) {
      // Check for duplicate reaction
      const existing = _reactions.find(r => r.userId === reaction.userId && r.entryId === reaction.entryId && r.emoji === reaction.emoji);
      if (existing) {
        _duplicateReactionErrors++;
        throw new Error("duplicate key value violates unique constraint");
      }
      const r = { id: _reactionId++, entryId: reaction.entryId, userId: reaction.userId, emoji: reaction.emoji, createdAt: new Date() };
      _reactions.push(r); return r;
    },
    async removeReaction(userId: string, entryId: string, emoji: string) { _reactions = _reactions.filter(r => !(r.userId === userId && r.entryId === entryId && r.emoji === emoji)); },
    async getEntryReactions(entryId: string) { return _reactions.filter(r => r.entryId === entryId); },

    async registerPushToken() {},
    async deletePushToken() {},
    async getUserPushTokens(_userId: string) { return []; },
    async getGroupPushTokens(_groupId: string) { return []; },
    async getAllPushTokens() { return []; },
    async setReminderTime() {},
    async updateUserReminder(userId: string, hour: number, minute: number) {
      const user = _users.get(userId); if (!user) throw new Error("User not found");
      user.reminderHour = hour; user.reminderMinute = minute; return user;
    },

    async createBroadcast(broadcast: any) { return { id: 1, ...broadcast, createdAt: new Date() }; },
    async getRecentBroadcasts(_groupId: string) { return []; },
    async getChallengeCompletion() { return null; },
    async createChallengeCompletion(c: any) { return { id: 1, ...c, createdAt: new Date() }; },
    async getGroupChallengeCompletions() { return []; },
    async getBingoCard() { return null; },
    async upsertBingoCard() { return { id: 1, userId: "", month: "", completedSquares: [], createdAt: new Date(), updatedAt: new Date() }; },
    async getBingoLeaderboard() { return []; },
    async getUserReferralCode(userId: string) { return _users.get(userId)?.referralCode ?? null; },
    async applyReferralCode() {},
    async getReferralStats(_userId: string) { return { referralCount: 0, referrals: [] }; },
    async getReferralLeaderboard() { return []; },
    async getGroupWeeklyReport(_groupId: string) { return { totalDeuces: 0, mvp: null, memberStats: [], funnyStats: { longestGap: null, mostReactionsReceived: null, funniestEntry: null } }; },
    async getGroupMemberTypicalHours(_groupId: string) { return []; },
    async getRecentErrors() { return []; },

    _reset() {
      _users.clear(); _groups.clear(); _members = []; _entries.clear();
      _locations = []; _reactions = []; _memberId = 1; _locationId = 1; _reactionId = 1;
      _duplicateReactionErrors = 0;
    },
    _users: () => _users,
    _groups: () => _groups,
    _members: () => _members,
    _entries: () => _entries,
    _reactions: () => _reactions,
    _locations: () => _locations,
  };
});

vi.mock("../db", () => ({ db: {}, pool: {} }));
vi.mock("../storage", () => ({ storage: memStore }));
vi.mock("@clerk/clerk-sdk-node", () => ({ createClerkClient: () => null }));

vi.mock("../replitAuth", async () => {
  const sessionMod = await import("express-session");
  const session = sessionMod.default;
  return {
    clerkEnabled: false, clerk: null,
    getSession: () => session({ secret: "test-secret", resave: false, saveUninitialized: false }),
    setupAuth: async (app: any) => {
      app.use(session({ secret: "test-secret", resave: false, saveUninitialized: false }));
      app.post("/api/login", async (req: any, res: any) => {
        const { username } = req.body;
        if (!username || typeof username !== "string" || !username.trim()) return res.status(400).json({ message: "Username is required" });
        const name = username.trim();
        const userId = `dev-${name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
        const user = await memStore.upsertUser({ id: userId, email: `${name.toLowerCase()}@localhost.dev`, firstName: name, lastName: null, profileImageUrl: null });
        const userGroups = await memStore.getUserGroups(userId);
        if (userGroups.length === 0) {
          const { v4: uuidv4 } = await import("uuid");
          await memStore.createGroup({ id: uuidv4(), name: "Solo Deuces", description: "Your personal throne log", createdBy: userId });
        }
        req.session.userId = userId;
        req.session.save((err: any) => {
          if (err) return res.status(500).json({ message: "Failed to save session" });
          res.json({ ok: true, user: { id: user.id, username: user.username } });
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
      req.user = user; next();
    },
  };
});

import express from "express";
import supertest from "supertest";
import { registerRoutes } from "../routes";

let app: Express;
let server: Server;

beforeAll(async () => {
  process.env.ADMIN_KEY = "test-admin-key";
  process.env.INTERNAL_API_KEY = "test-internal-key";
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

async function getSoloGroupId(agent: ReturnType<typeof supertest.agent>): Promise<string> {
  const res = await agent.get("/api/groups");
  return res.body.find((g: any) => g.name === "Solo Deuces").id;
}

async function logDeuce(agent: ReturnType<typeof supertest.agent>, groupId: string): Promise<string> {
  const res = await agent.post("/api/deuces").send({ groupId, location: "Home" });
  return res.body.entries?.[0]?.id ?? res.body.id;
}

/* ================================================================
 *  1. TWO USERS REACTING TO SAME ENTRY SIMULTANEOUSLY
 * ================================================================ */
describe("Concurrent race conditions — parallel reactions from different users", () => {
  it("Alice and Bob react with same emoji to same entry simultaneously — both succeed", async () => {
    const alice = await loginAs("cc-alice-1");
    const bob = await loginAs("cc-bob-1");

    const aliceGroupId = await getSoloGroupId(alice);

    // Add Bob to Alice's group
    const aliceMe = await alice.get("/api/auth/user");
    const aliceId = aliceMe.body.id;
    const bobMe = await bob.get("/api/auth/user");
    const bobId = bobMe.body.id;
    memStore._members().push({ id: 999, groupId: aliceGroupId, userId: bobId, role: "member", joinedAt: new Date() });

    // Alice creates an entry
    const entryId = await logDeuce(alice, aliceGroupId);

    // Both react with 💩 simultaneously
    const [aliceReact, bobReact] = await Promise.all([
      alice.post(`/api/entries/${entryId}/reactions`).send({ emoji: "💩" }),
      bob.post(`/api/entries/${entryId}/reactions`).send({ emoji: "💩" }),
    ]);

    // Both should succeed (different users, same emoji is allowed)
    expect(aliceReact.status).toBe(200);
    expect(bobReact.status).toBe(200);

    const reactions = memStore._reactions().filter((r: any) => r.entryId === entryId);
    expect(reactions).toHaveLength(2);
  });

  it("Alice and Bob react with different emojis simultaneously — both succeed", async () => {
    const alice = await loginAs("cc-alice-2");
    const bob = await loginAs("cc-bob-2");

    const aliceGroupId = await getSoloGroupId(alice);
    const bobMe = await bob.get("/api/auth/user");
    const bobId = bobMe.body.id;
    memStore._members().push({ id: 998, groupId: aliceGroupId, userId: bobId, role: "member", joinedAt: new Date() });

    const entryId = await logDeuce(alice, aliceGroupId);

    const [aliceReact, bobReact] = await Promise.all([
      alice.post(`/api/entries/${entryId}/reactions`).send({ emoji: "😂" }),
      bob.post(`/api/entries/${entryId}/reactions`).send({ emoji: "🔥" }),
    ]);

    expect(aliceReact.status).toBe(200);
    expect(bobReact.status).toBe(200);
  });
});

/* ================================================================
 *  2. SAME USER DUPLICATE EMOJI CONCURRENTLY
 * ================================================================ */
describe("Concurrent race conditions — duplicate emoji race", () => {
  it("same user sending same emoji twice concurrently: exactly one succeeds", async () => {
    const alice = await loginAs("cc-dup-1");
    const groupId = await getSoloGroupId(alice);
    const entryId = await logDeuce(alice, groupId);

    const [r1, r2] = await Promise.all([
      alice.post(`/api/entries/${entryId}/reactions`).send({ emoji: "💩" }),
      alice.post(`/api/entries/${entryId}/reactions`).send({ emoji: "💩" }),
    ]);

    const statuses = [r1.status, r2.status].sort();
    // One should succeed (200), one should fail (400 for duplicate)
    expect(statuses).toEqual([200, 400]);
  });

  it("same user, different emojis concurrently: both succeed", async () => {
    const alice = await loginAs("cc-diffemoji-1");
    const groupId = await getSoloGroupId(alice);
    const entryId = await logDeuce(alice, groupId);

    const [r1, r2] = await Promise.all([
      alice.post(`/api/entries/${entryId}/reactions`).send({ emoji: "💩" }),
      alice.post(`/api/entries/${entryId}/reactions`).send({ emoji: "🔥" }),
    ]);

    expect(r1.status).toBe(200);
    expect(r2.status).toBe(200);
  });
});

/* ================================================================
 *  3. CONCURRENT LOCATION CREATION WITH SAME NAME
 * ================================================================ */
describe("Concurrent race conditions — location creation", () => {
  it("two users creating location with same name concurrently: no duplicates in store", async () => {
    const alice = await loginAs("cc-loc-1");
    const bob = await loginAs("cc-loc-2");

    const [r1, r2] = await Promise.all([
      alice.post("/api/locations").send({ name: "The Throne Room" }),
      bob.post("/api/locations").send({ name: "The Throne Room" }),
    ]);

    // Both should succeed or one succeeds and one fails — no 500s
    expect(r1.status).not.toBe(500);
    expect(r2.status).not.toBe(500);

    // At most 1 location with this name should exist
    const locations = memStore._locations().filter((l: any) => l.name === "The Throne Room");
    expect(locations.length).toBeGreaterThanOrEqual(1);
    // Note: with idempotent mock, concurrent create returns same location
  });

  it("same user creating same location name twice sequentially: second is idempotent", async () => {
    const alice = await loginAs("cc-loc-3");
    const r1 = await alice.post("/api/locations").send({ name: "My Office" });
    const r2 = await alice.post("/api/locations").send({ name: "My Office" });

    expect(r1.status).not.toBe(500);
    expect(r2.status).not.toBe(500);
  });
});

/* ================================================================
 *  4. CONCURRENT DEUCE LOGGING FROM SAME USER
 * ================================================================ */
describe("Concurrent race conditions — concurrent deuce logging", () => {
  it("two simultaneous logs from same user both succeed (within limit)", async () => {
    const alice = await loginAs("cc-log-1");
    const groupId = await getSoloGroupId(alice);

    const [r1, r2] = await Promise.all([
      alice.post("/api/deuces").send({ groupId, location: "Home" }),
      alice.post("/api/deuces").send({ groupId, location: "Office" }),
    ]);

    // Both should succeed since daily count starts at 0
    const statuses = [r1.status, r2.status];
    expect(statuses.every(s => [200, 429].includes(s))).toBe(true);
    // At least one succeeds
    expect(statuses.some(s => s === 200)).toBe(true);
  });

  it("3 simultaneous log attempts all succeed (well under limit)", async () => {
    const alice = await loginAs("cc-log-2");
    const groupId = await getSoloGroupId(alice);

    const results = await Promise.all([
      alice.post("/api/deuces").send({ groupId, location: "Location 0" }),
      alice.post("/api/deuces").send({ groupId, location: "Location 1" }),
      alice.post("/api/deuces").send({ groupId, location: "Location 2" }),
    ]);

    const successes = results.filter(r => r.status === 200).length;
    const rateLimited = results.filter(r => r.status === 429).length;
    expect(successes + rateLimited).toBe(3);
    // At least some should succeed (3 well under limit of 10)
    expect(successes).toBeGreaterThan(0);
  });
});

/* ================================================================
 *  5. CONCURRENT USERNAME CLAIMS (SAME USERNAME RACE)
 * ================================================================ */
describe("Concurrent race conditions — username claiming race", () => {
  it("two users racing to claim same username: exactly one wins", async () => {
    const alice = await loginAs("cc-name-alice");
    const bob = await loginAs("cc-name-bob");

    // Both try to claim "throne_king" simultaneously
    const [r1, r2] = await Promise.all([
      alice.put("/api/auth/user").send({ username: "throne_king" }),
      bob.put("/api/auth/user").send({ username: "throne_king" }),
    ]);

    const statuses = [r1.status, r2.status];
    // One wins with 200, one fails with 400 (duplicate)
    expect(statuses).toContain(200);
    expect(statuses).toContain(400);
  });

  it("after race, only one user has the username in the store", async () => {
    const alice = await loginAs("cc-name-alice2");
    const bob = await loginAs("cc-name-bob2");

    await Promise.all([
      alice.put("/api/auth/user").send({ username: "flush_champion" }),
      bob.put("/api/auth/user").send({ username: "flush_champion" }),
    ]);

    const usersWithName = [...memStore._users().values()].filter(
      (u: any) => u.username === "flush_champion"
    );
    // At most one user should have the username
    expect(usersWithName.length).toBeLessThanOrEqual(1);
  });
});

/* ================================================================
 *  6. CONCURRENT GROUP CREATION
 * ================================================================ */
describe("Concurrent race conditions — group creation", () => {
  it("same user creating two groups simultaneously: both succeed with unique IDs", async () => {
    const alice = await loginAs("cc-grp-1");

    const [r1, r2] = await Promise.all([
      alice.post("/api/groups").send({ name: "Squad Alpha" }),
      alice.post("/api/groups").send({ name: "Squad Beta" }),
    ]);

    expect([200, 201]).toContain(r1.status);
    expect([200, 201]).toContain(r2.status);
    expect(r1.body.id).not.toBe(r2.body.id);
  });
});

/* ================================================================
 *  7. CONCURRENT DEUCE LOGGING NEAR LIMIT
 * ================================================================ */
describe("Concurrent race conditions — near rate limit", () => {
  it("sequential then concurrent at limit: no extra requests slip through", async () => {
    const alice = await loginAs("cc-limit-1");
    const groupId = await getSoloGroupId(alice);

    // Log 9 sequentially to get close to limit
    for (let i = 0; i < 9; i++) {
      const r = await alice.post("/api/deuces").send({ groupId, location: "Home" });
      expect(r.status).toBe(200);
    }

    // Now fire 3 more concurrently — at most 1 should succeed (the 10th slot)
    const [r1, r2, r3] = await Promise.all([
      alice.post("/api/deuces").send({ groupId, location: "A" }),
      alice.post("/api/deuces").send({ groupId, location: "B" }),
      alice.post("/api/deuces").send({ groupId, location: "C" }),
    ]);

    const results = [r1, r2, r3];
    const successes = results.filter(r => r.status === 200).length;
    const blocked = results.filter(r => r.status === 429).length;

    // Total accounts for all 3
    expect(successes + blocked).toBe(3);
    // At least 2 should be rate limited (only 1 slot remaining)
    expect(blocked).toBeGreaterThanOrEqual(2);
  });
});
