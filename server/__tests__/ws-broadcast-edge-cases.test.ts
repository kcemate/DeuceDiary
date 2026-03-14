/**
 * ws-broadcast-edge-cases.test.ts — Round 7: WebSocket Protocol Edge Cases
 *
 * Tests WS protocol behavior: join_group/leave_group, auth rejection,
 * broadcast routing, idempotent joins, multi-client fan-out.
 */

import { vi, describe, it, expect, beforeAll, beforeEach, afterAll } from "vitest";
import type { Express } from "express";
import type { Server } from "http";
import WebSocket from "ws";

/* ================================================================
 *  IN-MEMORY STORAGE
 * ================================================================ */
const memStore = vi.hoisted(() => {
  const _users = new Map<string, any>();
  const _groups = new Map<string, any>();
  let _members: any[] = [];
  const _entries = new Map<string, any>();
  let _reactions: any[] = [];
  let _memberId = 1;
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
    async updateUserDeuceCount(userId: string, increment: number) { const u = _users.get(userId); if (u) u.deuceCount = (u.deuceCount ?? 0) + increment; },
    async updateUserUsername(userId: string, username: string) { const u = _users.get(userId); if (!u) throw new Error("User not found"); u.username = username; return u; },
    async updateUserProfilePicture(userId: string, url: string) { const u = _users.get(userId); if (!u) throw new Error("User not found"); u.profileImageUrl = url; return u; },
    async updateUserTheme(userId: string, theme: string) { const u = _users.get(userId); if (!u) throw new Error("User not found"); u.theme = theme; return u; },
    async getUserSubscription(userId: string) { const u = _users.get(userId); return { subscription: u?.subscription ?? "free", subscriptionExpiresAt: u?.subscriptionExpiresAt ?? null, streakInsuranceUsed: u?.streakInsuranceUsed ?? false }; },
    async updateUserSubscription(userId: string, sub: string, exp: Date) { const u = _users.get(userId); if (!u) throw new Error("User not found"); u.subscription = sub; u.subscriptionExpiresAt = exp; return u; },
    async useStreakInsurance() {},
    async resetStreakInsurance() {},
    async resetAllStreakInsurance() { return 0; },
    async getPremiumAnalytics() { return { totalDeuces: 0, avgPerWeek: 0, longestStreak: 0, currentStreak: 0, bestDay: { day: "Monday", count: 0 }, groupRankings: [] }; },
    async getWeeklyReport() { return { totalDeuces: 0, peakDay: { date: "2026-01-01", count: 0 }, mostActiveSquad: { name: "None", count: 0 }, longestStreak: 0, funniestEntry: null, totalReactionsReceived: 0, weekOf: "2026-01-01" }; },
    async createGroup(group: any) {
      const g = { id: group.id, name: group.name, description: group.description ?? null, createdBy: group.createdBy, currentStreak: 0, longestStreak: 0, lastStreakDate: null, timezone: "UTC", createdAt: new Date(), updatedAt: new Date() };
      _groups.set(g.id, g);
      _members.push({ id: _memberId++, groupId: g.id, userId: group.createdBy, role: "admin", joinedAt: new Date() });
      return g;
    },
    async getUserGroups(userId: string) {
      const ids = _members.filter((m) => m.userId === userId).map((m) => m.groupId);
      return ids.map((gid) => ({ ..._groups.get(gid)!, memberCount: _members.filter(m => m.groupId === gid).length, entryCount: 0 }));
    },
    async getGroupById(gid: string) { return _groups.get(gid); },
    async addGroupMember(member: any) { const m = { id: _memberId++, groupId: member.groupId, userId: member.userId, role: member.role ?? "member", joinedAt: new Date() }; _members.push(m); return m; },
    async getGroupMembers(gid: string) { return _members.filter(m => m.groupId === gid).map(m => ({ ...m, user: { ..._users.get(m.userId) } })); },
    async isUserInGroup(uid: string, gid: string) { return _members.some(m => m.userId === uid && m.groupId === gid); },
    async removeGroupMember(uid: string, gid: string) { _members = _members.filter(m => !(m.userId === uid && m.groupId === gid)); },
    async createDeuceEntry(entry: any) {
      const e = { id: entry.id, userId: entry.userId, groupId: entry.groupId, location: entry.location, thoughts: entry.thoughts ?? null, ghost: entry.ghost ?? false, loggedAt: entry.loggedAt, createdAt: new Date() };
      _entries.set(e.id, e);
      return e;
    },
    async getUserDailyLogCount(userId: string, dateUTC: string) {
      const start = new Date(`${dateUTC}T00:00:00.000Z`);
      const end = new Date(`${dateUTC}T23:59:59.999Z`);
      return [..._entries.values()].filter(e => e.userId === userId && e.createdAt >= start && e.createdAt <= end).length;
    },
    async getGroupEntries(gid: string) { return [..._entries.values()].filter(e => e.groupId === gid).map(e => ({ ...e, user: _users.get(e.userId) })); },
    async getUserDeucesByDate() { return []; },
    async getEntryById(id: string) { return _entries.get(id); },
    async getFeedEntries() { return []; },
    async createInvite(inv: any) { return { id: inv.id, groupId: inv.groupId, createdBy: inv.createdBy, expiresAt: inv.expiresAt, createdAt: new Date() }; },
    async getInviteById() { return undefined; },
    async getLocations() { return []; },
    async getLocationsForUser() { return []; },
    async createLocation(loc: any) { return { id: 1, ...loc, createdAt: new Date() }; },
    async getLocationByName() { return undefined; },
    async getUserPersonalRecord() { return undefined; },
    async getGroupStreak() { return { currentStreak: 0, longestStreak: 0, lastStreakDate: null }; },
    async getGroupStreaksBatch(ids: string[]) { const m = new Map<string, any>(); for (const id of ids) m.set(id, { currentStreak: 0, longestStreak: 0, lastStreakDate: null }); return m; },
    async updateGroupStreak() {},
    async resetGroupStreak() {},
    async getMembersLogStatusToday() { return []; },
    async getAllGroupsWithActiveStreaks() { return []; },
    async createStreakAlert() { return { id: 1 }; },
    async getGroupMemberCount(gid: string) { return _members.filter(m => m.groupId === gid).length; },
    async getGroupDeuceCount(gid: string) { return [..._entries.values()].filter(e => e.groupId === gid).length; },
    async addReaction(reaction: any) {
      const exists = _reactions.find(r => r.entryId === reaction.entryId && r.userId === reaction.userId && r.emoji === reaction.emoji);
      if (exists) throw new Error("duplicate key value violates unique constraint");
      const r = { id: _reactionId++, ...reaction, createdAt: new Date() };
      _reactions.push(r);
      return r;
    },
    async removeReaction(uid: string, eid: string, emoji: string) { _reactions = _reactions.filter(r => !(r.userId === uid && r.entryId === eid && r.emoji === emoji)); },
    async getEntryReactions(eid: string) { return _reactions.filter(r => r.entryId === eid).map(r => ({ ...r, user: _users.get(r.userId) })); },
    async upsertPushToken(token: any) { return { id: 1, ...token }; },
    async getUserPushTokens() { return []; },
    async countUserPushTokens() { return 0; },
    async deletePushToken() {},
    async getGroupPushTokens() { return []; },
    async createBroadcast(b: any) { return { id: 1, ...b }; },
    async getDailyChallengeCompletion() { return undefined; },
    async completeDailyChallenge(c: any) { return { id: 1, ...c }; },
    async updateUserReminder(uid: string, h: number, m: number) { const u = _users.get(uid); if (!u) throw new Error("User not found"); u.reminderHour = h; u.reminderMinute = m; return u; },
    async getUserByUsername(username: string) { for (const [, u] of _users) { if (u.username === username) return u; } return undefined; },
    async getUserLongestStreak() { return 0; },
    async getUserBestDay() { return undefined; },
    async getGroupMemberTypicalHours() { return []; },
    async getUserByReferralCode(code: string) { for (const [, u] of _users) { if (u.referralCode === code) return u; } return undefined; },
    async applyReferral() { return { id: 1 }; },
    async getReferralStats() { return { referralCount: 0, referrals: [] }; },
    async getReferralDashboardStats() { return { totalReferrals: 0, premiumConversions: 0, pendingConversions: 0 }; },
    async getReferralLeaderboard() { return []; },
    async getAdminStats() { return { totalUsers: _users.size, premiumUsers: 0, dauToday: 0, totalLogsToday: 0, totalLogsAllTime: _entries.size, activeGroups: _groups.size, avgStreakLength: 0 }; },
    async getGroupWeeklyReport() { return { weekOf: "2026-01-01", totalDeuces: 0, mvp: null, members: [], funnyStats: {} }; },
    async getGroupLeaderboard(gid: string) { return _members.filter(m => m.groupId === gid).map(m => ({ userId: m.userId, username: null, profileImageUrl: null, deuceCount: 0, monthlyDeuces: 0, weeklyDeuces: 0, isMvp: false })); },
    async getBingoCard() { return undefined; },
    async deleteBingoCard() {},
    async createBingoCard(data: any) { return { id: data.id, ...data, createdAt: new Date() }; },
    async checkAndUpdateBingoProgress() { return { completedSquares: [], hasBlackout: false }; },
    async getBingoLeaderboard() { return []; },
    async cleanupExpiredInvites() { return 0; },

    _reset() { _users.clear(); _groups.clear(); _members = []; _entries.clear(); _reactions = []; _memberId = 1; _reactionId = 1; },
  };
});

vi.mock("../db", () => ({ db: {}, pool: { query: async () => ({}) } }));
vi.mock("../storage", () => ({ storage: memStore }));
vi.mock("@clerk/clerk-sdk-node", () => ({ createClerkClient: () => null }));

vi.mock("../replitAuth", async () => {
  const sessionMod = await import("express-session");
  const session = sessionMod.default;
  const sessionMiddleware = session({ secret: "test-secret-ws", resave: false, saveUninitialized: false });

  return {
    clerkEnabled: false,
    clerk: null,
    getSession: () => sessionMiddleware,
    setupAuth: async (app: any) => {
      app.use(sessionMiddleware);
      app.post("/api/login", async (req: any, res: any) => {
        const { username } = req.body;
        if (!username || typeof username !== "string" || !username.trim()) return res.status(400).json({ message: "Username is required" });
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

import express from "express";
import supertest from "supertest";
import { registerRoutes } from "../routes";

let app: Express;
let server: Server;
let port: number;

beforeAll(async () => {
  app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  server = await registerRoutes(app);
  await new Promise<void>((resolve) => {
    server.listen(0, () => {
      port = (server.address() as any).port;
      resolve();
    });
  });
});

afterAll(() => { server.close(); });
beforeEach(() => { memStore._reset(); });

/* ================================================================
 *  Helpers
 * ================================================================ */

/** Login via real HTTP and return session cookie string */
async function loginAndCookie(username: string): Promise<string> {
  const res = await fetch(`http://localhost:${port}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  });
  const setCookie = res.headers.get("set-cookie");
  return setCookie ?? "";
}

/** Extract the session cookie value (for subsequent requests) */
function cookieHeader(setCookie: string): string {
  // set-cookie is like "connect.sid=s%3A...; Path=/; HttpOnly"
  return setCookie.split(";")[0];
}

/** Open a WS connection authenticated with the given cookie */
function openWs(cookie: string): Promise<WebSocket> {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(`ws://localhost:${port}/ws`, {
      headers: { cookie },
    });
    const t = setTimeout(() => { ws.terminate(); reject(new Error("WS open timeout")); }, 3000);
    ws.on("open", () => { clearTimeout(t); resolve(ws); });
    ws.on("error", (err) => { clearTimeout(t); reject(err); });
  });
}

/** Send a WS message and wait for the next response message */
function sendAndWait(ws: WebSocket, msg: object, timeoutMs = 2000): Promise<any> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("WS response timeout")), timeoutMs);
    ws.once("message", (data) => { clearTimeout(t); resolve(JSON.parse(data.toString())); });
    ws.send(JSON.stringify(msg));
  });
}

/** Wait for next WS message (without sending anything) */
function waitForMessage(ws: WebSocket, timeoutMs = 2000): Promise<any> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("WS message timeout")), timeoutMs);
    ws.once("message", (data) => { clearTimeout(t); resolve(JSON.parse(data.toString())); });
  });
}

/** Expect NO message arrives within `ms` milliseconds */
function expectNoMessage(ws: WebSocket, ms = 500): Promise<void> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(resolve, ms);
    ws.once("message", () => { clearTimeout(t); reject(new Error("Unexpected WS message")); });
  });
}

/** Close a WebSocket cleanly */
function closeWs(ws: WebSocket): Promise<void> {
  return new Promise((resolve) => {
    if (ws.readyState === WebSocket.CLOSED) { resolve(); return; }
    ws.once("close", resolve);
    ws.close();
  });
}

/** Get the solo group id for a user (created at login) */
async function getSoloGroupId(username: string): Promise<string> {
  const userId = `dev-${username.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
  const groups = await memStore.getUserGroups(userId);
  return groups[0].id;
}

/** POST /api/deuces via fetch with session cookie */
async function postDeuce(cookie: string, groupId: string, extra = {}): Promise<any> {
  const res = await fetch(`http://localhost:${port}/api/deuces`, {
    method: "POST",
    headers: { "Content-Type": "application/json", cookie },
    body: JSON.stringify({ groupIds: [groupId], location: "Throne Room", ...extra }),
  });
  return res.json();
}

/* ================================================================
 *  Auth: WS rejects unauthenticated connections
 * ================================================================ */
describe("WebSocket — auth rejection", () => {
  it("no session cookie → connection destroyed with 401", async () => {
    await new Promise<void>((resolve, reject) => {
      const ws = new WebSocket(`ws://localhost:${port}/ws`);
      const t = setTimeout(() => { ws.terminate(); reject(new Error("Expected rejection but timed out")); }, 2000);
      ws.on("error", () => { clearTimeout(t); resolve(); });
      ws.on("unexpected-response", () => { clearTimeout(t); ws.terminate(); resolve(); });
      ws.on("close", () => { clearTimeout(t); resolve(); });
    });
  });

  it("bogus session cookie → connection destroyed", async () => {
    await new Promise<void>((resolve, reject) => {
      const ws = new WebSocket(`ws://localhost:${port}/ws`, {
        headers: { cookie: "connect.sid=s%3Abogus" },
      });
      const t = setTimeout(() => { ws.terminate(); reject(new Error("Expected rejection but timed out")); }, 2000);
      ws.on("error", () => { clearTimeout(t); resolve(); });
      ws.on("unexpected-response", () => { clearTimeout(t); ws.terminate(); resolve(); });
      ws.on("close", () => { clearTimeout(t); resolve(); });
    });
  });

  it("valid session → connection opens successfully", async () => {
    const setCookie = await loginAndCookie("alice");
    const cookie = cookieHeader(setCookie);
    const ws = await openWs(cookie);
    expect(ws.readyState).toBe(WebSocket.OPEN);
    await closeWs(ws);
  });
});

/* ================================================================
 *  join_group protocol
 * ================================================================ */
describe("WebSocket — join_group protocol", () => {
  it("join_group for owned group → join_group_ok with groupId", async () => {
    const setCookie = await loginAndCookie("alice");
    const cookie = cookieHeader(setCookie);
    const groupId = await getSoloGroupId("alice");
    const ws = await openWs(cookie);

    const reply = await sendAndWait(ws, { type: "join_group", groupId });
    expect(reply.type).toBe("join_group_ok");
    expect(reply.groupId).toBe(groupId);

    await closeWs(ws);
  });

  it("join_group with null groupId → error message", async () => {
    const setCookie = await loginAndCookie("alice");
    const cookie = cookieHeader(setCookie);
    const ws = await openWs(cookie);

    const reply = await sendAndWait(ws, { type: "join_group", groupId: null });
    expect(reply.type).toBe("error");
    expect(reply.message).toMatch(/invalid groupId/i);

    await closeWs(ws);
  });

  it("join_group with missing groupId field → error message", async () => {
    const setCookie = await loginAndCookie("alice");
    const cookie = cookieHeader(setCookie);
    const ws = await openWs(cookie);

    const reply = await sendAndWait(ws, { type: "join_group" });
    expect(reply.type).toBe("error");

    await closeWs(ws);
  });

  it("join_group for group user is not a member of → error message", async () => {
    const setCookie = await loginAndCookie("alice");
    const cookie = cookieHeader(setCookie);

    // Create bob's group without adding alice
    await loginAndCookie("bob");
    const bobGroupId = await getSoloGroupId("bob");

    const ws = await openWs(cookie);
    const reply = await sendAndWait(ws, { type: "join_group", groupId: bobGroupId });
    expect(reply.type).toBe("error");
    expect(reply.message).toMatch(/not a member/i);

    await closeWs(ws);
  });
});

/* ================================================================
 *  leave_group protocol
 * ================================================================ */
describe("WebSocket — leave_group protocol", () => {
  it("leave_group with null groupId → error message", async () => {
    const setCookie = await loginAndCookie("alice");
    const cookie = cookieHeader(setCookie);
    const ws = await openWs(cookie);

    const reply = await sendAndWait(ws, { type: "leave_group", groupId: null });
    expect(reply.type).toBe("error");
    expect(reply.message).toMatch(/invalid groupId/i);

    await closeWs(ws);
  });

  it("leave_group before joining is a no-op (no crash)", async () => {
    const setCookie = await loginAndCookie("alice");
    const cookie = cookieHeader(setCookie);
    const groupId = await getSoloGroupId("alice");
    const ws = await openWs(cookie);

    // Send leave without prior join — should not crash or send any message
    ws.send(JSON.stringify({ type: "leave_group", groupId }));
    // Health check confirms server still running
    await new Promise<void>(resolve => setTimeout(resolve, 200));
    const health = await fetch(`http://localhost:${port}/api/health`);
    const body = await health.json();
    expect(health.status).toBe(200);
    expect(body.status).toBe("ok");

    await closeWs(ws);
  });
});

/* ================================================================
 *  Broadcast routing
 * ================================================================ */
describe("WebSocket — broadcast routing", () => {
  it("after join_group, deuce log triggers new_deuce event on the WS client", async () => {
    const setCookie = await loginAndCookie("alice");
    const cookie = cookieHeader(setCookie);
    const groupId = await getSoloGroupId("alice");

    const ws = await openWs(cookie);
    // Subscribe to the group
    const joinReply = await sendAndWait(ws, { type: "join_group", groupId });
    expect(joinReply.type).toBe("join_group_ok");

    // Post a deuce via HTTP — expect WS broadcast
    const msgPromise = waitForMessage(ws);
    await postDeuce(cookie, groupId);
    const msg = await msgPromise;

    expect(msg.type).toBe("deuce_logged");
    expect(msg).toHaveProperty("msgId");
    expect(msg).toHaveProperty("entry");

    await closeWs(ws);
  });

  it("broadcast message has a unique msgId (two logs produce distinct msgIds)", async () => {
    const setCookie = await loginAndCookie("alice");
    const cookie = cookieHeader(setCookie);
    const groupId = await getSoloGroupId("alice");

    const ws = await openWs(cookie);
    await sendAndWait(ws, { type: "join_group", groupId });

    // First deuce
    const msg1Promise = waitForMessage(ws);
    await postDeuce(cookie, groupId);
    const msg1 = await msg1Promise;

    // Second deuce
    const msg2Promise = waitForMessage(ws);
    await postDeuce(cookie, groupId);
    const msg2 = await msg2Promise;

    expect(msg1.msgId).toBeTruthy();
    expect(msg2.msgId).toBeTruthy();
    expect(msg1.msgId).not.toBe(msg2.msgId);

    await closeWs(ws);
  });

  it("client NOT subscribed to a group does not receive that group's broadcasts", async () => {
    const setCookie = await loginAndCookie("alice");
    const cookie = cookieHeader(setCookie);
    const groupId = await getSoloGroupId("alice");

    const ws = await openWs(cookie);
    // Do NOT join the group

    const noMsgPromise = expectNoMessage(ws, 600);
    await postDeuce(cookie, groupId);
    await expect(noMsgPromise).resolves.toBeUndefined();

    await closeWs(ws);
  });

  it("after leave_group, further deuces do NOT trigger WS events", async () => {
    const setCookie = await loginAndCookie("alice");
    const cookie = cookieHeader(setCookie);
    const groupId = await getSoloGroupId("alice");

    const ws = await openWs(cookie);
    // Join then receive one broadcast to confirm subscription works
    const joinReply = await sendAndWait(ws, { type: "join_group", groupId });
    expect(joinReply.type).toBe("join_group_ok");

    const firstMsgPromise = waitForMessage(ws);
    await postDeuce(cookie, groupId);
    const firstMsg = await firstMsgPromise;
    expect(firstMsg.type).toBe("deuce_logged");

    // Now leave
    ws.send(JSON.stringify({ type: "leave_group", groupId }));
    await new Promise<void>(resolve => setTimeout(resolve, 100)); // let server process

    // Log another deuce — should NOT receive WS event
    const noMsgPromise = expectNoMessage(ws, 600);
    await postDeuce(cookie, groupId);
    await expect(noMsgPromise).resolves.toBeUndefined();

    await closeWs(ws);
  });

  it("double join_group is idempotent: one deuce → one broadcast (not two)", async () => {
    const setCookie = await loginAndCookie("alice");
    const cookie = cookieHeader(setCookie);
    const groupId = await getSoloGroupId("alice");

    const ws = await openWs(cookie);
    // Join twice
    const r1 = await sendAndWait(ws, { type: "join_group", groupId });
    expect(r1.type).toBe("join_group_ok");
    const r2 = await sendAndWait(ws, { type: "join_group", groupId });
    expect(r2.type).toBe("join_group_ok");

    // Post one deuce and count received messages within 600ms
    let received = 0;
    const listener = () => { received++; };
    ws.on("message", listener);

    await postDeuce(cookie, groupId);
    await new Promise<void>(resolve => setTimeout(resolve, 600));

    ws.off("message", listener);
    // Should receive exactly 1 broadcast even though we joined twice
    expect(received).toBe(1);

    await closeWs(ws);
  });

  it("two clients subscribed to same group both receive the broadcast", async () => {
    const setCookie1 = await loginAndCookie("alice");
    const cookie1 = cookieHeader(setCookie1);
    await loginAndCookie("bob");
    const bobId = "dev-bob";
    const groupId = await getSoloGroupId("alice");

    // Add bob as member of alice's group
    await memStore.addGroupMember({ groupId, userId: bobId, role: "member" });
    const setCookie2 = await loginAndCookie("bob");
    const cookie2 = cookieHeader(setCookie2);

    const ws1 = await openWs(cookie1);
    const ws2 = await openWs(cookie2);

    const r1 = await sendAndWait(ws1, { type: "join_group", groupId });
    expect(r1.type).toBe("join_group_ok");
    const r2 = await sendAndWait(ws2, { type: "join_group", groupId });
    expect(r2.type).toBe("join_group_ok");

    const [msg1, msg2] = await Promise.all([
      waitForMessage(ws1),
      waitForMessage(ws2),
      postDeuce(cookie1, groupId),
    ]);

    expect(msg1.type).toBe("deuce_logged");
    expect(msg2.type).toBe("deuce_logged");
    // Both receive the same msgId (same broadcast event)
    expect(msg1.msgId).toBe(msg2.msgId);

    await closeWs(ws1);
    await closeWs(ws2);
  });

  it("group A broadcast does not reach a client subscribed only to group B", async () => {
    const setCookie = await loginAndCookie("alice");
    const cookie = cookieHeader(setCookie);

    // Create a second group for alice
    const agent = supertest.agent(app);
    await agent.post("/api/login").send({ username: "alice" });
    const g2res = await agent.post("/api/groups").send({ name: "Group B" });
    expect(g2res.status).toBe(200);
    const groupB = g2res.body.id;

    const groupA = await getSoloGroupId("alice");

    const ws = await openWs(cookie);
    // Subscribe only to group B
    const r = await sendAndWait(ws, { type: "join_group", groupId: groupB });
    expect(r.type).toBe("join_group_ok");

    // Log to group A — ws should NOT receive anything
    const noMsgPromise = expectNoMessage(ws, 600);
    await postDeuce(cookie, groupA);
    await expect(noMsgPromise).resolves.toBeUndefined();

    await closeWs(ws);
  });
});

/* ================================================================
 *  WS close / cleanup
 * ================================================================ */
describe("WebSocket — close and cleanup", () => {
  it("WS disconnect after join cleans up: server stays healthy", async () => {
    const setCookie = await loginAndCookie("alice");
    const cookie = cookieHeader(setCookie);
    const groupId = await getSoloGroupId("alice");

    const ws = await openWs(cookie);
    await sendAndWait(ws, { type: "join_group", groupId });
    await closeWs(ws);

    // Health check after WS cleanup
    const health = await fetch(`http://localhost:${port}/api/health`);
    const body = await health.json();
    expect(health.status).toBe(200);
    expect(body.status).toBe("ok");
  });

  it("WS close removes subscription: broadcast to that group no longer reaches closed client", async () => {
    const setCookie = await loginAndCookie("alice");
    const cookie = cookieHeader(setCookie);
    const groupId = await getSoloGroupId("alice");

    const ws = await openWs(cookie);
    const r = await sendAndWait(ws, { type: "join_group", groupId });
    expect(r.type).toBe("join_group_ok");

    // Close the WS
    await closeWs(ws);

    // Posting a deuce should not throw (server handles closed client gracefully)
    await postDeuce(cookie, groupId);

    const health = await fetch(`http://localhost:${port}/api/health`);
    const body = await health.json();
    expect(health.status).toBe(200);
    expect(body.status).toBe("ok");
  });
});
