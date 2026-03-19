import { vi, describe, it, expect, beforeAll, beforeEach, afterAll } from "vitest";
import type { Express } from "express";
import type { Server } from "http";
import { v4 as uuidv4 } from "uuid";

/* ================================================================
 *  IN-MEMORY STORAGE (hoisted above vi.mock calls)
 * ================================================================ */
const memStore = vi.hoisted(() => {
  const _users = new Map<string, any>();
  const _groups = new Map<string, any>();
  let _members: any[] = [];
  const _entries = new Map<string, any>();
  let _matches: any[] = [];
  let _ships: any[] = [];
  let _attacks: any[] = [];
  let _tokens: any[] = [];
  let _powerups: any[] = [];
  let _badges: any[] = [];
  let _shipId = 1;
  let _attackId = 1;
  let _tokenId = 1;
  let _powerupId = 1;
  let _badgeId = 1;

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
        username: data.username ?? existing?.username ?? null,
        profileImageUrl: data.profileImageUrl ?? existing?.profileImageUrl ?? null,
        deuceCount: existing?.deuceCount ?? 0,
        subscription: data.subscription ?? existing?.subscription ?? "free",
        subscriptionExpiresAt: data.subscriptionExpiresAt ?? existing?.subscriptionExpiresAt ?? null,
        streakInsuranceUsed: existing?.streakInsuranceUsed ?? false,
        theme: existing?.theme ?? "default",
        reminderHour: existing?.reminderHour ?? null,
        reminderMinute: existing?.reminderMinute ?? null,
        createdAt: existing?.createdAt ?? new Date(),
        updatedAt: new Date(),
      };
      _users.set(data.id, user);
      return user;
    },
    async updateUserDeuceCount(userId: string, increment: number) {
      const user = _users.get(userId);
      if (user) user.deuceCount = (user.deuceCount ?? 0) + increment;
    },
    async updateUserSubscription(userId: string, subscription: string, expiresAt: Date) {
      const user = _users.get(userId);
      if (user) { user.subscription = subscription; user.subscriptionExpiresAt = expiresAt; }
      return user;
    },
    async getUserSubscription(userId: string) {
      const user = _users.get(userId);
      return { subscription: user?.subscription ?? "free", subscriptionExpiresAt: null, streakInsuranceUsed: false };
    },
    async updateUserReminder() {},
    async updateUserTheme() {},
    async softDeleteUser() {},
    async getUserByUsername() { return undefined; },
    async updateUserUsername(userId: string, username: string) {
      const user = _users.get(userId);
      if (user) user.username = username;
      return user;
    },
    async updateUserProfilePicture(userId: string, url: string) {
      const user = _users.get(userId);
      if (user) user.profileImageUrl = url;
      return user;
    },

    /* ---- Group ops ---- */
    async createGroup(group: any) {
      const g = { id: group.id ?? uuidv4(), name: group.name, description: group.description ?? null, createdBy: group.createdBy, currentStreak: 0, longestStreak: 0, lastStreakDate: null, avatarUrl: null, timezone: "UTC", createdAt: new Date(), updatedAt: new Date() };
      _groups.set(g.id, g);
      _members.push({ id: Date.now(), groupId: g.id, userId: group.createdBy, role: "admin", joinedAt: new Date() });
      return g;
    },
    async getGroupById(groupId: string) { return _groups.get(groupId); },
    async getUserGroups(userId: string) {
      const ids = _members.filter((m) => m.userId === userId).map((m) => m.groupId);
      return ids.map((gid) => _groups.get(gid)).filter(Boolean);
    },
    async addGroupMember(member: any) {
      _members.push({ id: Date.now(), ...member, joinedAt: new Date() });
    },
    async getGroupMembers(groupId: string) {
      return _members.filter((m) => m.groupId === groupId).map((m) => ({ ...m, user: _users.get(m.userId) }));
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
    async getAllGroupIds() { return [..._groups.keys()]; },
    async getGroupMemberCount(groupId: string) { return _members.filter((m) => m.groupId === groupId).length; },
    async getGroupDeuceCount() { return 0; },
    async getGroupPreview(groupId: string) {
      const g = _groups.get(groupId);
      if (!g) return undefined;
      return { name: g.name, memberCount: _members.filter((m) => m.groupId === groupId).length, deuceCount: 0 };
    },
    async updateGroupAvatar(groupId: string, avatarUrl: string) {
      const g = _groups.get(groupId);
      if (g) g.avatarUrl = avatarUrl;
      return g;
    },

    /* ---- Deuce entry ops ---- */
    async createDeuceEntry(entry: any) {
      const e = { id: entry.id ?? uuidv4(), ...entry, createdAt: new Date() };
      _entries.set(e.id, e);
      return e;
    },
    async getGroupEntries() { return []; },
    async getUserDeucesByDate() { return []; },
    async getEntryById(id: string) { return _entries.get(id); },
    async deleteDeuceEntry(id: string) { _entries.delete(id); },
    async getUserDailyLogCount(userId: string, dateUTC: string) {
      return [..._entries.values()].filter((e) => e.userId === userId && e.createdAt.toISOString().slice(0, 10) === dateUTC).length;
    },

    /* ---- Invite ops ---- */
    async createInvite() { return {}; },
    async getInviteById() { return undefined; },
    async deleteInvite() {},
    async cleanupExpiredInvites() {},
    async deleteExpiredGroupInvites() {},

    /* ---- Location ops ---- */
    async getLocations() { return []; },
    async getLocationsForUser() { return []; },
    async createLocation(loc: any) { return { id: 1, ...loc }; },
    async getLocationByName() { return undefined; },

    /* ---- Streak ops ---- */
    async getGroupStreak() { return { currentStreak: 0, longestStreak: 0, lastStreakDate: null }; },
    async getGroupStreaksBatch(groupIds: string[]) { return new Map(groupIds.map((gid) => [gid, { currentStreak: 0, longestStreak: 0, lastStreakDate: null }])); },
    async updateGroupStreak() {},
    async resetGroupStreak() {},
    async getMembersLogStatusToday() { return []; },
    async getAllGroupsWithActiveStreaks() { return []; },
    async createStreakAlert() { return {}; },
    async getGroupStreak_legacy() { return 0; },

    /* ---- Push tokens ---- */
    async upsertPushToken() { return {}; },
    async getUserPushTokens() { return []; },
    async countUserPushTokens() { return 0; },
    async deletePushToken() {},
    async getGroupPushTokens() { return []; },

    /* ---- Reactions ---- */
    async addReaction() { return {}; },
    async removeReaction() {},
    async getEntryReactions() { return []; },

    /* ---- Feed ---- */
    async getFeedEntries() { return []; },

    /* ---- Broadcast ---- */
    async createBroadcast() { return {}; },

    /* ---- Daily challenge ---- */
    async getDailyChallengeCompletion() { return undefined; },
    async completeDailyChallenge() { return {}; },

    /* ---- Analytics ---- */
    async getAdminStats() { return { totalUsers: 0, premiumUsers: 0, dauToday: 0, totalLogsToday: 0, totalLogsAllTime: 0, activeGroups: 0, avgStreakLength: 0 }; },
    async getPremiumAnalytics() { return { totalDeuces: 0, avgPerWeek: 0, longestStreak: 0, currentStreak: 0, bestDay: { day: "", count: 0 }, groupRankings: [], avgBristolScore: null, mostUsedLocation: null }; },
    async getWeeklyReport() { return { totalDeuces: 0, peakDay: { date: "", count: 0 }, mostActiveSquad: { name: "", count: 0 }, longestStreak: 0, funniestEntry: null, totalReactionsReceived: 0, weekOf: "", dailyCounts: [] }; },
    async getGroupWeeklyReport() { return null; },
    async getUserPersonalRecord() { return undefined; },
    async getUserLongestStreak() { return 0; },
    async getUserBestDay() { return undefined; },
    async getGroupLeaderboard() { return []; },
    async getUserBadges() { return []; },
    async getGroupMemberTypicalHours() { return []; },
    async getGroupInvitePreview() { return null; },
    async getShareCardData() { return { username: null, currentStreak: 0, longestStreak: 0, totalLogs: 0, memberSince: null, squadCount: 0 }; },
    async useStreakInsurance() {},
    async resetStreakInsurance() {},
    async resetAllStreakInsurance() { return 0; },
    async getUserByReferralCode() { return undefined; },
    async applyReferral() { return {}; },
    async getReferralStats() { return { referralCount: 0, referrals: [] }; },
    async getReferralDashboardStats() { return { totalReferrals: 0, premiumConversions: 0, pendingConversions: 0 }; },
    async getReferralLeaderboard() { return []; },

    /* ---- Bingo ops ---- */
    async getBingoCard() { return undefined; },
    async deleteBingoCard() {},
    async createBingoCard(data: any) { return { id: uuidv4(), ...data }; },
    async updateBingoProgress() { return {}; },
    async checkAndUpdateBingoProgress() { return { completedSquares: [], hasBlackout: false }; },
    async getBingoLeaderboard() { return []; },

    /* ---- Passport ops ---- */
    async upsertPassportStamp() { return {}; },
    async getUserPassportStamps() { return []; },
    async getPassportStampsByCountry() { return []; },

    /* ---- King ops ---- */
    async getCurrentKing() { return null; },
    async getLatestKingForGroup() { return null; },
    async createDeuceKing() { return {}; },
    async getGroupLogCountsForPeriod() { return []; },
    async getUserStreakInGroup() { return 0; },
    async getActiveChallenge() { return null; },
    async getChallengeWithMemberProgress() { return { challenge: null, completions: [], memberCount: 0 }; },
    async createChallenge() { return {}; },
    async getChallenge() { return null; },
    async getExistingChallengeForKing() { return null; },
    async getChallengeHistory() { return []; },
    async addChallengeCompletion() { return null; },
    async getUserChallengeCompletion() { return null; },

    /* ---- Battle Shits ---- */
    async createBattleMatch(match: any) {
      const m = { ...match, createdAt: new Date() };
      _matches.push(m);
      return m;
    },
    async getBattleMatch(matchId: string) {
      return _matches.find((m) => m.id === matchId) ?? null;
    },
    async getUserActiveMatches(userId: string) {
      return _matches.filter(
        (m) =>
          (m.challengerId === userId || m.opponentId === userId) &&
          ["pending", "placement", "active"].includes(m.status),
      );
    },
    async getGroupMatches(groupId: string, limit: number) {
      return _matches.filter((m) => m.groupId === groupId).slice(0, limit);
    },
    async updateBattleMatchStatus(matchId: string, status: string, winnerId?: string) {
      const m = _matches.find((m) => m.id === matchId);
      if (m) {
        m.status = status;
        if (winnerId) m.winnerId = winnerId;
      }
    },
    async placeShips(matchId: string, userId: string, ships: any[]) {
      for (const s of ships) {
        _ships.push({ id: _shipId++, matchId, userId, shipType: s.shipType, cells: s.cells, isSunk: false, createdAt: new Date() });
      }
    },
    async getShips(matchId: string, userId: string) {
      return _ships.filter((s) => s.matchId === matchId && s.userId === userId);
    },
    async createAttack(matchId: string, attackerId: string, col: number, row: number, isHit: boolean) {
      const a = { id: _attackId++, matchId, attackerId, col, row, isHit, createdAt: new Date() };
      _attacks.push(a);
      return a;
    },
    async getAttacks(matchId: string) {
      return _attacks.filter((a) => a.matchId === matchId);
    },
    async getAttacksByUser(matchId: string, userId: string) {
      return _attacks.filter((a) => a.matchId === matchId && a.attackerId === userId);
    },
    async markShipSunk(shipId: number) {
      const ship = _ships.find((s) => s.id === shipId);
      if (ship) ship.isSunk = true;
    },
    async createBattleToken(matchId: string, userId: string, deuceEntryId: string, tokenType: string) {
      // Enforce unique(matchId, deuceEntryId, tokenType)
      const exists = _tokens.some((t) => t.matchId === matchId && t.deuceEntryId === deuceEntryId && t.tokenType === tokenType);
      if (!exists) {
        _tokens.push({ id: _tokenId++, matchId, userId, deuceEntryId, tokenType, createdAt: new Date() });
      }
    },
    async getTokenBalance(matchId: string, userId: string) {
      const earned = _tokens.filter((t) => t.matchId === matchId && t.userId === userId).length;
      const spent = _attacks.filter((a) => a.matchId === matchId && a.attackerId === userId).length;
      return { earned, spent };
    },
    async earnPowerup(matchId: string, userId: string, type: string) {
      const exists = _powerups.some((p) => p.matchId === matchId && p.userId === userId && p.powerupType === type);
      if (!exists) {
        _powerups.push({ id: _powerupId++, matchId, userId, powerupType: type, usedAt: null, earnedAt: new Date(), revealedCell: null });
      }
    },
    async usePowerup(matchId: string, userId: string, type: string, revealedCell?: any) {
      const p = _powerups.find((p) => p.matchId === matchId && p.userId === userId && p.powerupType === type);
      if (p) { p.usedAt = new Date(); p.revealedCell = revealedCell ?? null; }
    },
    async getPowerups(matchId: string, userId: string) {
      return _powerups.filter((p) => p.matchId === matchId && p.userId === userId);
    },
    async awardBadge(userId: string, badgeType: string, matchId?: string, expiresAt?: Date) {
      _badges.push({ id: _badgeId++, userId, badgeType, matchId: matchId ?? null, expiresAt: expiresAt ?? null, createdAt: new Date() });
    },
    async getUserBattleBadges(userId: string) {
      return _badges.filter((b) => b.userId === userId);
    },
    async getBattleLeaderboard(groupId: string) {
      const wins = new Map<string, number>();
      for (const m of _matches) {
        if (m.groupId === groupId && m.status === "completed" && m.winnerId) {
          wins.set(m.winnerId, (wins.get(m.winnerId) ?? 0) + 1);
        }
      }
      return [...wins.entries()].map(([userId, w]) => {
        const user = _users.get(userId);
        return { userId, username: user?.username ?? null, profileImageUrl: user?.profileImageUrl ?? null, wins: w };
      });
    },
    async getBattleStats(userId: string) {
      const completed = _matches.filter((m) => (m.challengerId === userId || m.opponentId === userId) && m.status === "completed");
      const wins = completed.filter((m) => m.winnerId === userId).length;
      const myAttacks = _attacks.filter((a) => a.attackerId === userId);
      const hits = myAttacks.filter((a) => a.isHit).length;
      const hitRate = myAttacks.length > 0 ? hits / myAttacks.length : 0;
      const tokensEarned = _tokens.filter((t) => t.userId === userId).length;
      return { wins, losses: completed.length - wins, totalMatches: completed.length, hitRate, tokensEarned };
    },

    /* ---- reset helper (test use only) ---- */
    _reset() {
      _users.clear();
      _groups.clear();
      _members.length = 0;
      _entries.clear();
      _matches.length = 0;
      _ships.length = 0;
      _attacks.length = 0;
      _tokens.length = 0;
      _powerups.length = 0;
      _badges.length = 0;
      _shipId = 1;
      _attackId = 1;
      _tokenId = 1;
      _powerupId = 1;
      _badgeId = 1;
    },

    _getMatches: () => _matches,
    _getShips: () => _ships,
    _getAttacks: () => _attacks,
    _getTokens: () => _tokens,
    _getPowerups: () => _powerups,
    _getBadges: () => _badges,
  };
});

vi.mock("../storage", () => ({ storage: memStore }));
vi.mock("../db", () => ({ db: {}, pool: { query: vi.fn() } }));
vi.mock("../replitAuth", () => ({
  isAuthenticated: (req: any, _res: any, next: any) => {
    req.user = { id: req.headers["x-test-user"] ?? "user1" };
    next();
  },
  setupAuth: (_app: any) => {},
  clerkEnabled: false,
  clerk: null,
  getSession: vi.fn(),
}));
vi.mock("../lib/analytics", () => ({ track: vi.fn() }));
vi.mock("../lib/geocode", () => ({ triggerPassportStamp: vi.fn() }));
vi.mock("../lib/logger", () => ({
  default: { info: vi.fn(), error: vi.fn(), warn: vi.fn(), debug: vi.fn(), child: () => ({ info: vi.fn(), error: vi.fn(), warn: vi.fn() }) },
}));

import supertest from "supertest";

let app: Express;
let httpServer: Server;

beforeAll(async () => {
  const { registerRoutes } = await import("../routes");
  const express = (await import("express")).default;
  app = express();
  app.use(express.json());
  httpServer = await registerRoutes(app);
});

afterAll(async () => {
  await new Promise<void>((resolve) => {
    if (httpServer) {
      httpServer.closeAllConnections?.();
      httpServer.close(() => resolve());
    } else {
      resolve();
    }
  });
});

beforeEach(() => {
  memStore._reset();
});

// ────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────
async function seedUser(id: string, username?: string) {
  return memStore.upsertUser({ id, username: username ?? id, email: `${id}@test.com` });
}

async function seedGroup(creatorId: string) {
  const group = await memStore.createGroup({ id: uuidv4(), name: "Test Squad", createdBy: creatorId });
  return group;
}

async function addMember(userId: string, groupId: string) {
  await memStore.addGroupMember({ groupId, userId, role: "member" });
}

function authAs(userId: string) {
  return { "x-test-user": userId };
}

function makeStandardShips() {
  return [
    { type: "floater", cells: [{ col: 0, row: 0 }, { col: 1, row: 0 }] },
    { type: "log", cells: [{ col: 0, row: 1 }, { col: 1, row: 1 }, { col: 2, row: 1 }] },
    { type: "battleshit", cells: [{ col: 0, row: 2 }, { col: 1, row: 2 }, { col: 2, row: 2 }, { col: 3, row: 2 }] },
  ];
}

function makeQuickShips() {
  return [
    { type: "floater", cells: [{ col: 0, row: 0 }, { col: 1, row: 0 }] },
    { type: "log", cells: [{ col: 0, row: 1 }, { col: 1, row: 1 }, { col: 2, row: 1 }] },
  ];
}

// ────────────────────────────────────────────────────────────────
// Ship Placement Validation (pure logic tests)
// ────────────────────────────────────────────────────────────────
describe("ship placement validation", () => {
  // Import the validation function indirectly via API
  let matchId: string;

  beforeEach(async () => {
    await seedUser("u1");
    await seedUser("u2");
    const group = await seedGroup("u1");
    await addMember("u2", group.id);

    const res = await supertest(app)
      .post("/api/battle/challenge")
      .set(authAs("u1"))
      .send({ groupId: group.id, opponentId: "u2", matchType: "standard" });
    matchId = res.body.id;
    // Activate the match so placement is accepted (status=pending means placement allowed)
  });

  it("rejects diagonal ship placement", async () => {
    const res = await supertest(app)
      .post(`/api/battle/match/${matchId}/place`)
      .set(authAs("u1"))
      .send({
        ships: [
          { type: "floater", cells: [{ col: 0, row: 0 }, { col: 1, row: 1 }] }, // diagonal
          { type: "log", cells: [{ col: 0, row: 1 }, { col: 1, row: 1 }, { col: 2, row: 1 }] },
          { type: "battleshit", cells: [{ col: 0, row: 2 }, { col: 1, row: 2 }, { col: 2, row: 2 }, { col: 3, row: 2 }] },
        ],
      });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/diagonal/);
  });

  it("rejects out-of-bounds ship", async () => {
    const res = await supertest(app)
      .post(`/api/battle/match/${matchId}/place`)
      .set(authAs("u1"))
      .send({
        ships: [
          { type: "floater", cells: [{ col: 6, row: 0 }, { col: 7, row: 0 }] }, // col 7 out of bounds for 7-col grid
          { type: "log", cells: [{ col: 0, row: 1 }, { col: 1, row: 1 }, { col: 2, row: 1 }] },
          { type: "battleshit", cells: [{ col: 0, row: 2 }, { col: 1, row: 2 }, { col: 2, row: 2 }, { col: 3, row: 2 }] },
        ],
      });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/out of bounds/);
  });

  it("rejects overlapping ships", async () => {
    const res = await supertest(app)
      .post(`/api/battle/match/${matchId}/place`)
      .set(authAs("u1"))
      .send({
        ships: [
          { type: "floater", cells: [{ col: 0, row: 0 }, { col: 1, row: 0 }] },
          { type: "log", cells: [{ col: 1, row: 0 }, { col: 2, row: 0 }, { col: 3, row: 0 }] }, // overlaps floater at (1,0)
          { type: "battleshit", cells: [{ col: 0, row: 2 }, { col: 1, row: 2 }, { col: 2, row: 2 }, { col: 3, row: 2 }] },
        ],
      });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/overlap/);
  });

  it("rejects wrong ship size", async () => {
    const res = await supertest(app)
      .post(`/api/battle/match/${matchId}/place`)
      .set(authAs("u1"))
      .send({
        ships: [
          { type: "floater", cells: [{ col: 0, row: 0 }] }, // floater needs 2 cells
          { type: "log", cells: [{ col: 0, row: 1 }, { col: 1, row: 1 }, { col: 2, row: 1 }] },
          { type: "battleshit", cells: [{ col: 0, row: 2 }, { col: 1, row: 2 }, { col: 2, row: 2 }, { col: 3, row: 2 }] },
        ],
      });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/exactly 2 cells/);
  });

  it("rejects ships with gaps", async () => {
    const res = await supertest(app)
      .post(`/api/battle/match/${matchId}/place`)
      .set(authAs("u1"))
      .send({
        ships: [
          { type: "floater", cells: [{ col: 0, row: 0 }, { col: 2, row: 0 }] }, // gap at col 1
          { type: "log", cells: [{ col: 0, row: 1 }, { col: 1, row: 1 }, { col: 2, row: 1 }] },
          { type: "battleshit", cells: [{ col: 0, row: 2 }, { col: 1, row: 2 }, { col: 2, row: 2 }, { col: 3, row: 2 }] },
        ],
      });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/contiguous/);
  });

  it("accepts valid horizontal placement", async () => {
    const res = await supertest(app)
      .post(`/api/battle/match/${matchId}/place`)
      .set(authAs("u1"))
      .send({ ships: makeStandardShips() });
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it("accepts valid vertical placement", async () => {
    const res = await supertest(app)
      .post(`/api/battle/match/${matchId}/place`)
      .set(authAs("u1"))
      .send({
        ships: [
          { type: "floater", cells: [{ col: 0, row: 0 }, { col: 0, row: 1 }] }, // vertical
          { type: "log", cells: [{ col: 1, row: 0 }, { col: 1, row: 1 }, { col: 1, row: 2 }] }, // vertical
          { type: "battleshit", cells: [{ col: 2, row: 0 }, { col: 3, row: 0 }, { col: 4, row: 0 }, { col: 5, row: 0 }] },
        ],
      });
    expect(res.status).toBe(200);
  });

  it("rejects missing ship type", async () => {
    const res = await supertest(app)
      .post(`/api/battle/match/${matchId}/place`)
      .set(authAs("u1"))
      .send({
        ships: [
          { type: "floater", cells: [{ col: 0, row: 0 }, { col: 1, row: 0 }] },
          // missing log and battleshit
        ],
      });
    expect(res.status).toBe(400);
  });

  it("transitions to placement status when first player places", async () => {
    await supertest(app)
      .post(`/api/battle/match/${matchId}/place`)
      .set(authAs("u1"))
      .send({ ships: makeStandardShips() });

    const match = await memStore.getBattleMatch(matchId);
    expect(match.status).toBe("placement");
  });

  it("transitions to active when both players place", async () => {
    await supertest(app)
      .post(`/api/battle/match/${matchId}/place`)
      .set(authAs("u1"))
      .send({ ships: makeStandardShips() });
    await supertest(app)
      .post(`/api/battle/match/${matchId}/place`)
      .set(authAs("u2"))
      .send({ ships: makeStandardShips() });

    const match = await memStore.getBattleMatch(matchId);
    expect(match.status).toBe("active");
  });

  it("rejects double placement by same user", async () => {
    await supertest(app)
      .post(`/api/battle/match/${matchId}/place`)
      .set(authAs("u1"))
      .send({ ships: makeStandardShips() });
    const res2 = await supertest(app)
      .post(`/api/battle/match/${matchId}/place`)
      .set(authAs("u1"))
      .send({ ships: makeStandardShips() });
    expect(res2.status).toBe(409);
  });
});

// ────────────────────────────────────────────────────────────────
// Attack Resolution
// ────────────────────────────────────────────────────────────────
describe("attack resolution", () => {
  let matchId: string;

  async function setupActiveMatch() {
    await seedUser("u1");
    await seedUser("u2");
    const group = await seedGroup("u1");
    await addMember("u2", group.id);

    const challengeRes = await supertest(app)
      .post("/api/battle/challenge")
      .set(authAs("u1"))
      .send({ groupId: group.id, opponentId: "u2", matchType: "standard" });
    matchId = challengeRes.body.id;

    // Both place ships
    await supertest(app)
      .post(`/api/battle/match/${matchId}/place`)
      .set(authAs("u1"))
      .send({ ships: makeStandardShips() });
    await supertest(app)
      .post(`/api/battle/match/${matchId}/place`)
      .set(authAs("u2"))
      .send({ ships: makeStandardShips() });

    // Give u1 a token
    await memStore.createBattleToken(matchId, "u1", uuidv4(), "standard");
  }

  beforeEach(setupActiveMatch);

  it("returns hit=false for miss", async () => {
    // u2 ships are at rows 0,1,2 cols 0+; attack col 5, row 0 (no ship there)
    const res = await supertest(app)
      .post(`/api/battle/match/${matchId}/attack`)
      .set(authAs("u1"))
      .send({ col: 6, row: 2 });
    expect(res.status).toBe(200);
    expect(res.body.hit).toBe(false);
    expect(res.body.sunk).toBe(false);
    expect(res.body.gameOver).toBe(false);
  });

  it("returns hit=true for a hit", async () => {
    // u2 placed floater at (0,0) and (1,0)
    const res = await supertest(app)
      .post(`/api/battle/match/${matchId}/attack`)
      .set(authAs("u1"))
      .send({ col: 0, row: 0 });
    expect(res.status).toBe(200);
    expect(res.body.hit).toBe(true);
  });

  it("rejects attack on already-attacked cell", async () => {
    await supertest(app)
      .post(`/api/battle/match/${matchId}/attack`)
      .set(authAs("u1"))
      .send({ col: 6, row: 2 });

    // Need another token
    await memStore.createBattleToken(matchId, "u1", uuidv4(), "standard");

    const res = await supertest(app)
      .post(`/api/battle/match/${matchId}/attack`)
      .set(authAs("u1"))
      .send({ col: 6, row: 2 });
    expect(res.status).toBe(409);
    expect(res.body.message).toMatch(/already attacked/);
  });

  it("rejects attack when no tokens available", async () => {
    // Spend the only token
    await supertest(app)
      .post(`/api/battle/match/${matchId}/attack`)
      .set(authAs("u1"))
      .send({ col: 6, row: 2 });

    // No more tokens
    const res = await supertest(app)
      .post(`/api/battle/match/${matchId}/attack`)
      .set(authAs("u1"))
      .send({ col: 5, row: 2 });
    expect(res.status).toBe(409);
    expect(res.body.message).toMatch(/No attack tokens/);
  });

  it("rejects attack on inactive match", async () => {
    await memStore.updateBattleMatchStatus(matchId, "completed");
    const res = await supertest(app)
      .post(`/api/battle/match/${matchId}/attack`)
      .set(authAs("u1"))
      .send({ col: 0, row: 0 });
    expect(res.status).toBe(409);
    expect(res.body.message).toMatch(/not active/);
  });

  it("rejects out-of-bounds attack", async () => {
    const res = await supertest(app)
      .post(`/api/battle/match/${matchId}/attack`)
      .set(authAs("u1"))
      .send({ col: 10, row: 0 });
    expect(res.status).toBe(400);
  });

  it("marks match completed and sets winner when all ships sunk", async () => {
    // Give u1 enough tokens to sink all ships (2+3+4 = 9 cells)
    for (let i = 0; i < 15; i++) {
      await memStore.createBattleToken(matchId, "u1", uuidv4(), "standard");
    }

    // Sink floater (0,0) and (1,0)
    await supertest(app).post(`/api/battle/match/${matchId}/attack`).set(authAs("u1")).send({ col: 0, row: 0 });
    await supertest(app).post(`/api/battle/match/${matchId}/attack`).set(authAs("u1")).send({ col: 1, row: 0 });

    // Sink log (0,1) (1,1) (2,1)
    await supertest(app).post(`/api/battle/match/${matchId}/attack`).set(authAs("u1")).send({ col: 0, row: 1 });
    await supertest(app).post(`/api/battle/match/${matchId}/attack`).set(authAs("u1")).send({ col: 1, row: 1 });
    await supertest(app).post(`/api/battle/match/${matchId}/attack`).set(authAs("u1")).send({ col: 2, row: 1 });

    // Sink battleshit (0,2) (1,2) (2,2) (3,2)
    await supertest(app).post(`/api/battle/match/${matchId}/attack`).set(authAs("u1")).send({ col: 0, row: 2 });
    await supertest(app).post(`/api/battle/match/${matchId}/attack`).set(authAs("u1")).send({ col: 1, row: 2 });
    await supertest(app).post(`/api/battle/match/${matchId}/attack`).set(authAs("u1")).send({ col: 2, row: 2 });
    const lastRes = await supertest(app).post(`/api/battle/match/${matchId}/attack`).set(authAs("u1")).send({ col: 3, row: 2 });

    expect(lastRes.body.gameOver).toBe(true);
    expect(lastRes.body.winner).toBe("u1");

    const match = await memStore.getBattleMatch(matchId);
    expect(match.status).toBe("completed");
    expect(match.winnerId).toBe("u1");
  });
});

// ────────────────────────────────────────────────────────────────
// Token Generation
// ────────────────────────────────────────────────────────────────
describe("token generation on deuce logging", () => {
  it("creates token for active matches when deuce is logged", async () => {
    await seedUser("u1");
    await seedUser("u2");
    const group = await seedGroup("u1");
    await addMember("u2", group.id);

    // Create and activate match
    const challengeRes = await supertest(app)
      .post("/api/battle/challenge")
      .set(authAs("u1"))
      .send({ groupId: group.id, opponentId: "u2", matchType: "standard" });
    const matchId = challengeRes.body.id;

    await supertest(app).post(`/api/battle/match/${matchId}/place`).set(authAs("u1")).send({ ships: makeStandardShips() });
    await supertest(app).post(`/api/battle/match/${matchId}/place`).set(authAs("u2")).send({ ships: makeStandardShips() });

    const matchBefore = await memStore.getBattleMatch(matchId);
    expect(matchBefore.status).toBe("active");

    // Log a deuce for u1
    await supertest(app)
      .post("/api/deuces")
      .set(authAs("u1"))
      .send({ groupId: group.id, location: "Home", thoughts: "test" });

    // Allow async token generation to complete
    await new Promise((r) => setTimeout(r, 50));

    const balance = await memStore.getTokenBalance(matchId, "u1");
    expect(balance.earned).toBeGreaterThanOrEqual(1);
  });

  it("does not create tokens for non-active matches", async () => {
    await seedUser("u1");
    await seedUser("u2");
    const group = await seedGroup("u1");
    await addMember("u2", group.id);

    const challengeRes = await supertest(app)
      .post("/api/battle/challenge")
      .set(authAs("u1"))
      .send({ groupId: group.id, opponentId: "u2", matchType: "standard" });
    const matchId = challengeRes.body.id;
    // Status is "pending" — don't place ships

    await supertest(app)
      .post("/api/deuces")
      .set(authAs("u1"))
      .send({ groupId: group.id, location: "Home", thoughts: "test" });

    await new Promise((r) => setTimeout(r, 50));

    const balance = await memStore.getTokenBalance(matchId, "u1");
    expect(balance.earned).toBe(0);
  });
});

// ────────────────────────────────────────────────────────────────
// Double Flush Bonus
// ────────────────────────────────────────────────────────────────
describe("double flush bonus", () => {
  it("awards double_flush token on 2nd log of the day", async () => {
    await seedUser("u1");
    await seedUser("u2");
    const group = await seedGroup("u1");
    await addMember("u2", group.id);

    const challengeRes = await supertest(app)
      .post("/api/battle/challenge")
      .set(authAs("u1"))
      .send({ groupId: group.id, opponentId: "u2", matchType: "standard" });
    const matchId = challengeRes.body.id;

    await supertest(app).post(`/api/battle/match/${matchId}/place`).set(authAs("u1")).send({ ships: makeStandardShips() });
    await supertest(app).post(`/api/battle/match/${matchId}/place`).set(authAs("u2")).send({ ships: makeStandardShips() });

    // Log deuce #1
    await supertest(app)
      .post("/api/deuces")
      .set(authAs("u1"))
      .send({ groupId: group.id, location: "Home", thoughts: "first" });

    await new Promise((r) => setTimeout(r, 50));

    // getUserDailyLogCount returns 1 at this point (only 1 entry); no double_flush yet
    let tokens = memStore._getTokens().filter((t: any) => t.matchId === matchId && t.userId === "u1");
    const doubleFlushAfterFirst = tokens.filter((t: any) => t.tokenType === "double_flush").length;
    expect(doubleFlushAfterFirst).toBe(0);

    // Manually bump daily count to simulate 2nd entry (hook checks AFTER entry is created)
    // Actually: log a 2nd deuce
    await supertest(app)
      .post("/api/deuces")
      .set(authAs("u1"))
      .send({ groupId: group.id, location: "Work", thoughts: "second" });

    await new Promise((r) => setTimeout(r, 50));

    tokens = memStore._getTokens().filter((t: any) => t.matchId === matchId && t.userId === "u1");
    const doubleFlushAfterSecond = tokens.filter((t: any) => t.tokenType === "double_flush").length;
    expect(doubleFlushAfterSecond).toBeGreaterThanOrEqual(1);
  });
});

// ────────────────────────────────────────────────────────────────
// Power-up mechanics
// ────────────────────────────────────────────────────────────────
describe("power-ups", () => {
  let matchId: string;

  beforeEach(async () => {
    await seedUser("u1");
    await seedUser("u2");
    const group = await seedGroup("u1");
    await addMember("u2", group.id);

    const challengeRes = await supertest(app)
      .post("/api/battle/challenge")
      .set(authAs("u1"))
      .send({ groupId: group.id, opponentId: "u2", matchType: "standard" });
    matchId = challengeRes.body.id;

    await supertest(app).post(`/api/battle/match/${matchId}/place`).set(authAs("u1")).send({ ships: makeStandardShips() });
    await supertest(app).post(`/api/battle/match/${matchId}/place`).set(authAs("u2")).send({ ships: makeStandardShips() });

    // Earn a sonar_ping for u1
    await memStore.earnPowerup(matchId, "u1", "sonar_ping");
  });

  it("uses sonar_ping and returns a revealed cell", async () => {
    const res = await supertest(app)
      .post(`/api/battle/match/${matchId}/powerup`)
      .set(authAs("u1"))
      .send({ type: "sonar_ping" });
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it("rejects double use of a power-up", async () => {
    await supertest(app)
      .post(`/api/battle/match/${matchId}/powerup`)
      .set(authAs("u1"))
      .send({ type: "sonar_ping" });

    const res = await supertest(app)
      .post(`/api/battle/match/${matchId}/powerup`)
      .set(authAs("u1"))
      .send({ type: "sonar_ping" });
    expect(res.status).toBe(409);
    expect(res.body.message).toMatch(/already used/);
  });

  it("rejects power-up not earned", async () => {
    const res = await supertest(app)
      .post(`/api/battle/match/${matchId}/powerup`)
      .set(authAs("u1"))
      .send({ type: "ghost_wipe" });
    expect(res.status).toBe(404);
  });

  it("rejects power-up on inactive match", async () => {
    await memStore.updateBattleMatchStatus(matchId, "completed");
    const res = await supertest(app)
      .post(`/api/battle/match/${matchId}/powerup`)
      .set(authAs("u1"))
      .send({ type: "sonar_ping" });
    expect(res.status).toBe(409);
  });
});

// ────────────────────────────────────────────────────────────────
// Match Lifecycle
// ────────────────────────────────────────────────────────────────
describe("match lifecycle", () => {
  it("creates match in pending state", async () => {
    await seedUser("u1");
    await seedUser("u2");
    const group = await seedGroup("u1");
    await addMember("u2", group.id);

    const res = await supertest(app)
      .post("/api/battle/challenge")
      .set(authAs("u1"))
      .send({ groupId: group.id, opponentId: "u2", matchType: "standard" });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe("pending");
    expect(res.body.challengerId).toBe("u1");
    expect(res.body.opponentId).toBe("u2");
  });

  it("rejects challenge against self", async () => {
    await seedUser("u1");
    const group = await seedGroup("u1");

    const res = await supertest(app)
      .post("/api/battle/challenge")
      .set(authAs("u1"))
      .send({ groupId: group.id, opponentId: "u1", matchType: "standard" });
    expect(res.status).toBe(400);
  });

  it("rejects challenge when opponent not in group", async () => {
    await seedUser("u1");
    await seedUser("u2");
    const group = await seedGroup("u1");
    // u2 not added to group

    const res = await supertest(app)
      .post("/api/battle/challenge")
      .set(authAs("u1"))
      .send({ groupId: group.id, opponentId: "u2", matchType: "standard" });
    expect(res.status).toBe(404);
  });

  it("rejects creating 2nd active match of same type", async () => {
    await seedUser("u1");
    await seedUser("u2");
    await seedUser("u3");
    const group = await seedGroup("u1");
    await addMember("u2", group.id);
    await addMember("u3", group.id);

    // First match
    await supertest(app)
      .post("/api/battle/challenge")
      .set(authAs("u1"))
      .send({ groupId: group.id, opponentId: "u2", matchType: "standard" });

    // Second match (same type) — should fail
    const res = await supertest(app)
      .post("/api/battle/challenge")
      .set(authAs("u1"))
      .send({ groupId: group.id, opponentId: "u3", matchType: "standard" });
    expect(res.status).toBe(409);
    expect(res.body.message).toMatch(/active standard match/);
  });

  it("lists user's active matches", async () => {
    await seedUser("u1");
    await seedUser("u2");
    const group = await seedGroup("u1");
    await addMember("u2", group.id);

    await supertest(app)
      .post("/api/battle/challenge")
      .set(authAs("u1"))
      .send({ groupId: group.id, opponentId: "u2", matchType: "standard" });

    const res = await supertest(app)
      .get("/api/battle/matches")
      .set(authAs("u1"));
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
  });
});

// ────────────────────────────────────────────────────────────────
// Forfeit
// ────────────────────────────────────────────────────────────────
describe("forfeit", () => {
  it("forfeits a match and awards abandon_ship badge", async () => {
    await seedUser("u1");
    await seedUser("u2");
    const group = await seedGroup("u1");
    await addMember("u2", group.id);

    const challengeRes = await supertest(app)
      .post("/api/battle/challenge")
      .set(authAs("u1"))
      .send({ groupId: group.id, opponentId: "u2", matchType: "standard" });
    const matchId = challengeRes.body.id;

    const res = await supertest(app)
      .post(`/api/battle/match/${matchId}/forfeit`)
      .set(authAs("u1"));

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.winnerId).toBe("u2");

    const match = await memStore.getBattleMatch(matchId);
    expect(match.status).toBe("forfeited");

    const badges = memStore._getBadges().filter((b: any) => b.userId === "u1");
    expect(badges.some((b: any) => b.badgeType === "abandon_ship")).toBe(true);
  });

  it("rejects forfeit of already-completed match", async () => {
    await seedUser("u1");
    await seedUser("u2");
    const group = await seedGroup("u1");
    await addMember("u2", group.id);

    const challengeRes = await supertest(app)
      .post("/api/battle/challenge")
      .set(authAs("u1"))
      .send({ groupId: group.id, opponentId: "u2", matchType: "standard" });
    const matchId = challengeRes.body.id;
    await memStore.updateBattleMatchStatus(matchId, "completed", "u2");

    const res = await supertest(app)
      .post(`/api/battle/match/${matchId}/forfeit`)
      .set(authAs("u1"));
    expect(res.status).toBe(409);
  });

  it("rejects non-participant from forfeiting", async () => {
    await seedUser("u1");
    await seedUser("u2");
    await seedUser("u3");
    const group = await seedGroup("u1");
    await addMember("u2", group.id);

    const challengeRes = await supertest(app)
      .post("/api/battle/challenge")
      .set(authAs("u1"))
      .send({ groupId: group.id, opponentId: "u2", matchType: "standard" });
    const matchId = challengeRes.body.id;

    const res = await supertest(app)
      .post(`/api/battle/match/${matchId}/forfeit`)
      .set(authAs("u3"));
    expect(res.status).toBe(403);
  });
});

// ────────────────────────────────────────────────────────────────
// Matchmaking
// ────────────────────────────────────────────────────────────────
describe("matchmaking", () => {
  it("creates a match with a random group member", async () => {
    await seedUser("u1");
    await seedUser("u2");
    const group = await seedGroup("u1");
    await addMember("u2", group.id);

    const res = await supertest(app)
      .post("/api/battle/matchmake")
      .set(authAs("u1"))
      .send({ groupId: group.id, matchType: "standard" });

    expect(res.status).toBe(201);
    expect(res.body.opponentId).toBe("u2");
  });

  it("returns 404 when no eligible opponents", async () => {
    await seedUser("u1");
    const group = await seedGroup("u1");
    // No other members

    const res = await supertest(app)
      .post("/api/battle/matchmake")
      .set(authAs("u1"))
      .send({ groupId: group.id, matchType: "standard" });

    expect(res.status).toBe(404);
  });
});

// ────────────────────────────────────────────────────────────────
// Leaderboard & Stats
// ────────────────────────────────────────────────────────────────
describe("leaderboard and stats", () => {
  it("returns battle leaderboard for group", async () => {
    await seedUser("u1");
    await seedUser("u2");
    const group = await seedGroup("u1");
    await addMember("u2", group.id);

    // Create a completed match with u1 as winner
    await memStore.createBattleMatch({
      id: uuidv4(),
      groupId: group.id,
      challengerId: "u1",
      opponentId: "u2",
      matchType: "standard",
      status: "completed",
      winnerId: "u1",
      weekStart: new Date(),
      weekEnd: new Date(),
      placementDeadline: new Date(),
    });

    const res = await supertest(app)
      .get(`/api/battle/leaderboard/${group.id}`)
      .set(authAs("u1"));

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].userId).toBe("u1");
    expect(res.body[0].wins).toBe(1);
  });

  it("returns personal battle stats", async () => {
    await seedUser("u1");
    const res = await supertest(app)
      .get("/api/battle/stats/u1")
      .set(authAs("u1"));

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("wins");
    expect(res.body).toHaveProperty("losses");
    expect(res.body).toHaveProperty("hitRate");
    expect(res.body).toHaveProperty("badges");
  });
});

// ────────────────────────────────────────────────────────────────
// Quick match grid validation
// ────────────────────────────────────────────────────────────────
describe("quick match ship placement", () => {
  it("accepts valid quick match ship placement (2 ships)", async () => {
    await seedUser("u1");
    await seedUser("u2");
    const group = await seedGroup("u1");
    await addMember("u2", group.id);

    const challengeRes = await supertest(app)
      .post("/api/battle/challenge")
      .set(authAs("u1"))
      .send({ groupId: group.id, opponentId: "u2", matchType: "quick" });
    const matchId = challengeRes.body.id;

    const res = await supertest(app)
      .post(`/api/battle/match/${matchId}/place`)
      .set(authAs("u1"))
      .send({ ships: makeQuickShips() });
    expect(res.status).toBe(200);
  });

  it("rejects out-of-bounds for quick grid (3 cols)", async () => {
    await seedUser("u1");
    await seedUser("u2");
    const group = await seedGroup("u1");
    await addMember("u2", group.id);

    const challengeRes = await supertest(app)
      .post("/api/battle/challenge")
      .set(authAs("u1"))
      .send({ groupId: group.id, opponentId: "u2", matchType: "quick" });
    const matchId = challengeRes.body.id;

    const res = await supertest(app)
      .post(`/api/battle/match/${matchId}/place`)
      .set(authAs("u1"))
      .send({
        ships: [
          { type: "floater", cells: [{ col: 2, row: 0 }, { col: 3, row: 0 }] }, // col 3 out of bounds for 3-col grid
          { type: "log", cells: [{ col: 0, row: 1 }, { col: 1, row: 1 }, { col: 2, row: 1 }] },
        ],
      });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/out of bounds/);
  });
});
