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
        .filter((e) => groupIds.includes(e.groupId))
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

    /* ---- Stubs for endpoints not tested here ---- */
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
      _memberId = 1;
      _locationId = 1;
      _reactionId = 1;
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
        const { username, inviteCode } = req.body;
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

        // Auto-create Solo Deuces for users with no groups
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

        // Auto-join group if inviteCode provided
        let joinedGroup: { id: string; name: string } | null = null;
        if (inviteCode && typeof inviteCode === "string") {
          try {
            const invite = await memStore.getInviteById(inviteCode);
            if (invite && invite.expiresAt >= new Date()) {
              const alreadyMember = await memStore.isUserInGroup(userId, invite.groupId);
              if (!alreadyMember) {
                await memStore.addGroupMember({
                  groupId: invite.groupId,
                  userId,
                  role: "member",
                });
                await memStore.deleteInvite(inviteCode);
              }
              const group = await memStore.getGroupById(invite.groupId);
              if (group) {
                joinedGroup = { id: group.id, name: group.name };
              }
            }
          } catch (joinErr) {
            console.error("Auto-join on login failed:", joinErr);
          }
        }

        req.session.userId = userId;
        req.session.save((err: any) => {
          if (err) return res.status(500).json({ message: "Failed to save session" });
          res.json({
            ok: true,
            user: {
              id: user.id,
              username: user.username,
              profilePicture: user.profileImageUrl,
              createdAt: user.createdAt,
            },
            ...(joinedGroup ? { joinedGroup } : {}),
          });
        });
      });

      /* dev logout */
      app.get("/api/logout", (req: any, res: any) => {
        req.session.destroy(() => {
          res.redirect("/");
        });
      });

      /* dev logout (JSON) */
      app.post("/api/auth/logout", (req: any, res: any) => {
        req.session.destroy(() => {
          res.json({ ok: true });
        });
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

/* ================================================================
 *  GET /api/deuces
 * ================================================================ */
describe("GET /api/deuces", () => {
  it("returns array of all deuces", async () => {
    const agent = await loginAs("alice");
    const groupRes = await agent.post("/api/groups").send({ name: "Test Group" });
    const groupId = groupRes.body.id;

    await agent.post("/api/deuces").send({
      groupIds: [groupId],
      location: "Home",
      thoughts: "Ran 5 km, felt great",
    });
    await agent.post("/api/deuces").send({
      groupIds: [groupId],
      location: "Office",
      thoughts: "Biked 10 km, got lost",
    });

    const response = await agent.get("/api/deuces");
    expect(response.status).toBe(200);
    const data = response.body;
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(2);
  });

  it("returns empty array when no deuces exist", async () => {
    const agent = await loginAs("alice");

    const response = await agent.get("/api/deuces");
    expect(response.status).toBe(200);
    const data = response.body;
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(0);
  });
});

/* ================================================================
 *  GET /api/deuces?groupId=
 * ================================================================ */
describe("GET /api/deuces?groupId=", () => {
  it("filters deuces by valid group ID", async () => {
    const agent = await loginAs("alice");
    const g1 = await agent.post("/api/groups").send({ name: "Group 1" });
    const g2 = await agent.post("/api/groups").send({ name: "Group 2" });

    await agent.post("/api/deuces").send({
      groupIds: [g1.body.id],
      location: "Home",
      thoughts: "Group 1 deuce",
    });
    await agent.post("/api/deuces").send({
      groupIds: [g2.body.id],
      location: "Office",
      thoughts: "Group 2 deuce",
    });
    await agent.post("/api/deuces").send({
      groupIds: [g1.body.id],
      location: "Gym",
      thoughts: "Group 1 deuce again",
    });

    // Assert for group-1
    const responseGroup1 = await agent.get(`/api/deuces?groupId=${g1.body.id}`);
    expect(responseGroup1.status).toBe(200);
    const dataGroup1 = responseGroup1.body;
    expect(dataGroup1.length).toBe(2);

    // Assert for group-2
    const responseGroup2 = await agent.get(`/api/deuces?groupId=${g2.body.id}`);
    expect(responseGroup2.status).toBe(200);
    const dataGroup2 = responseGroup2.body;
    expect(dataGroup2.length).toBe(1);
  });

  it("returns 403 for group user is not a member of", async () => {
    const alice = await loginAs("alice");
    const groupRes = await alice.post("/api/groups").send({ name: "Alice Only" });

    const bob = await loginAs("bob");
    const response = await bob.get(`/api/deuces?groupId=${groupRes.body.id}`);
    expect(response.status).toBe(403);
  });

  it("returns empty array when group has no deuces", async () => {
    const agent = await loginAs("alice");
    const groupRes = await agent.post("/api/groups").send({ name: "Empty Group" });

    const response = await agent.get(`/api/deuces?groupId=${groupRes.body.id}`);
    expect(response.status).toBe(200);
    const data = response.body;
    expect(data.length).toBe(0);
  });
});

/* ================================================================
 *  POST /api/auth/logout
 * ================================================================ */
describe("POST /api/auth/logout", () => {
  it("returns { ok: true }", async () => {
    const agent = await loginAs("alice");

    const response = await agent.post("/api/auth/logout");
    expect(response.status).toBe(200);
    const data = response.body;
    expect(data).toEqual({ ok: true });
  });

  it("does not require authentication", async () => {
    const response = await supertest(app)
      .post("/api/auth/logout")
      .send();
    expect(response.status).toBe(200);
    const data = response.body;
    expect(data).toEqual({ ok: true });
  });
});

/* ================================================================
 *  POST /api/login
 * ================================================================ */
describe("POST /api/login", () => {
  it("returns user object", async () => {
    const response = await supertest.agent(app)
      .post("/api/login")
      .send({ username: "alice" });

    expect(response.status).toBe(200);
    const data = response.body;
    expect(data.ok).toBe(true);
    expect(data.user).toBeDefined();
    expect(data.user.id).toBe("dev-alice");
    expect(data.user).toHaveProperty("createdAt");
  });

  it("returns error for invalid credentials", async () => {
    const response = await supertest(app)
      .post("/api/login")
      .send({ username: "" });

    expect(response.status).toBe(400);
    const data = response.body;
    expect(data.message).toMatch(/username/i);
  });
});

/* ================================================================
 *  GET /api/auth/user
 * ================================================================ */
describe("GET /api/auth/user", () => {
  it("fetches authenticated user", async () => {
    const agent = await loginAs("alice");

    const response = await agent.get("/api/auth/user");
    expect(response.status).toBe(200);
    const data = response.body;
    expect(data.id).toBe("dev-alice");
    expect(data.firstName).toBe("alice");
  });

  it("returns 401 when not authenticated", async () => {
    const response = await supertest(app).get("/api/auth/user");
    expect(response.status).toBe(401);
  });
});

/* ================================================================
 *  GET /api/groups/:id/streak
 * ================================================================ */
describe("GET /api/groups/:id/streak", () => {
  it("returns current and longest streak", async () => {
    const agent = await loginAs("alice");
    const groupRes = await agent.post("/api/groups").send({ name: "Streak Test" });
    const groupId = groupRes.body.id;

    // Log a deuce so the streak advances
    await agent.post("/api/deuces").send({
      groupIds: [groupId],
      location: "Home",
      thoughts: "Streak builder",
      loggedAt: new Date().toISOString(),
    });

    const response = await agent.get(`/api/groups/${groupId}/streak`);
    expect(response.status).toBe(200);
    const data = response.body;
    expect(data).toHaveProperty("currentStreak");
    expect(data).toHaveProperty("longestStreak");
    expect(data.currentStreak).toBe(1);
    expect(data.longestStreak).toBe(1);
  });

  it("returns 0 for current streak when no recent deuces", async () => {
    const agent = await loginAs("alice");
    const groupRes = await agent.post("/api/groups").send({ name: "Empty Streak" });
    const groupId = groupRes.body.id;

    const response = await agent.get(`/api/groups/${groupId}/streak`);
    expect(response.status).toBe(200);
    const data = response.body;
    expect(data.currentStreak).toBe(0);
    expect(data.longestStreak).toBe(0);
  });
});

/* ================================================================
 *  POST /api/groups/:id/streak/check
 * ================================================================ */
describe("POST /api/groups/:id/streak/check", () => {
  it("returns at-risk status", async () => {
    const agent = await loginAs("alice");
    const groupRes = await agent.post("/api/groups").send({ name: "Risk Test" });
    const groupId = groupRes.body.id;

    // Alice hasn't logged a deuce — should be at risk
    const response = await agent.post(`/api/groups/${groupId}/streak/check`);
    expect(response.status).toBe(200);
    const data = response.body;
    expect(data.atRisk).toBe(true);
    expect(data.missingMembers.length).toBeGreaterThan(0);
  });

  it("returns no at-risk members", async () => {
    const agent = await loginAs("alice");
    const groupRes = await agent.post("/api/groups").send({ name: "Safe Test" });
    const groupId = groupRes.body.id;

    // All users have recent deuces
    await agent.post("/api/deuces").send({
      groupIds: [groupId],
      location: "Home",
      thoughts: "Done for today",
      loggedAt: new Date().toISOString(),
    });

    const response = await agent.post(`/api/groups/${groupId}/streak/check`);
    expect(response.status).toBe(200);
    const data = response.body;
    expect(data.atRisk).toBe(false);
    expect(data.missingMembers).toEqual([]);
  });
});

/* ================================================================
 *  GET /api/groups
 * ================================================================ */
describe("GET /api/groups", () => {
  it("returns list of groups", async () => {
    const agent = await loginAs("alice");

    const response = await agent.get("/api/groups");
    expect(response.status).toBe(200);
    const data = response.body;
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });
});

/* ================================================================
 *  GET /api/groups/:id
 * ================================================================ */
describe("GET /api/groups/:id", () => {
  it("returns group details", async () => {
    const agent = await loginAs("alice");
    const groupRes = await agent.post("/api/groups").send({ name: "Detail Test" });
    const groupId = groupRes.body.id;

    const response = await agent.get(`/api/groups/${groupId}`);
    expect(response.status).toBe(200);
    const data = response.body;
    expect(data.group.id).toBe(groupId);
    expect(data.group.name).toBeDefined();
    expect(data.members).toBeDefined();
  });

  it("returns 403 when not a member of group", async () => {
    const alice = await loginAs("alice");
    const groupRes = await alice.post("/api/groups").send({ name: "Private" });
    const groupId = groupRes.body.id;

    const bob = await loginAs("bob");
    const response = await bob.get(`/api/groups/${groupId}`);
    expect(response.status).toBe(403);
  });
});

/* ================================================================
 *  GET /api/users/:userId/weekly-report
 * ================================================================ */
describe("GET /api/users/:userId/weekly-report", () => {
  it("returns weekly report for 'me'", async () => {
    const agent = await loginAs("alice");
    const response = await agent.get("/api/users/me/weekly-report");
    expect(response.status).toBe(200);
    const data = response.body;
    expect(data).toHaveProperty("totalDeuces");
    expect(data).toHaveProperty("peakDay");
    expect(data).toHaveProperty("mostActiveSquad");
    expect(data).toHaveProperty("longestStreak");
    expect(data).toHaveProperty("totalReactionsReceived");
    expect(data).toHaveProperty("weekOf");
  });
});

/* ================================================================
 *  POST /api/internal/streak-check
 * ================================================================ */
describe("POST /api/internal/streak-check", () => {
  it("returns 401 without valid internal key", async () => {
    const response = await supertest(app)
      .post("/api/internal/streak-check")
      .set("X-Internal-Key", "wrong-key");
    expect(response.status).toBe(401);
  });

  it("returns summary with valid internal key", async () => {
    const response = await supertest(app)
      .post("/api/internal/streak-check")
      .set("X-Internal-Key", "streak-check-secret");
    expect(response.status).toBe(200);
    const data = response.body;
    expect(data).toHaveProperty("groupsChecked");
    expect(data).toHaveProperty("atRiskCount");
    expect(data).toHaveProperty("notificationsSent");
  });
});

/* ================================================================
 *  GET /api/groups/preview/:inviteCode
 * ================================================================ */
describe("GET /api/groups/preview/:inviteCode", () => {
  it("returns group preview for valid invite", async () => {
    const agent = await loginAs("alice");
    const groupRes = await agent.post("/api/groups").send({ name: "Preview Test" });
    const groupId = groupRes.body.id;
    const inviteRes = await agent.post(`/api/groups/${groupId}/invite`);
    const inviteId = inviteRes.body.id;

    // Public endpoint — no auth needed
    const response = await supertest(app).get(`/api/groups/preview/${inviteId}`);
    expect(response.status).toBe(200);
    const data = response.body;
    expect(data.name).toBe("Preview Test");
    expect(data).toHaveProperty("memberCount");
    expect(data).toHaveProperty("deuceCount");
  });

  it("returns 404 for invalid or expired invite", async () => {
    const response = await supertest(app).get("/api/groups/preview/nonexistent");
    expect(response.status).toBe(404);
  });
});

/* ================================================================
 *  POST /api/deuces
 * ================================================================ */
describe("POST /api/deuces", () => {
  it("creates a new deuce", async () => {
    const agent = await loginAs("alice");
    const groupRes = await agent.post("/api/groups").send({ name: "Deuce Test" });
    const groupId = groupRes.body.id;

    const response = await agent.post("/api/deuces").send({
      groupIds: [groupId],
      location: "Home",
      thoughts: "Test deuce content",
      loggedAt: new Date().toISOString(),
    });
    expect(response.status).toBe(200);
    const data = response.body;
    expect(data.entries).toBeDefined();
    expect(data.entries[0].location).toBe("Home");
    expect(data.entries[0].thoughts).toBe("Test deuce content");
    expect(data.count).toBe(1);
  });

  it("requires authentication", async () => {
    const response = await supertest(app)
      .post("/api/deuces")
      .send({
        groupIds: ["some-group"],
        location: "Home",
        thoughts: "Test deuce content",
      });
    expect(response.status).toBe(401);
  });

  it("requires user to be member of group", async () => {
    const alice = await loginAs("alice");
    const groupRes = await alice.post("/api/groups").send({ name: "Alice Only" });
    const groupId = groupRes.body.id;

    const bob = await loginAs("bob");
    const response = await bob.post("/api/deuces").send({
      groupIds: [groupId],
      location: "Home",
      thoughts: "Test deuce content",
    });
    expect(response.status).toBe(403);
  });
});

/* ================================================================
 *  POST /api/login with inviteCode (auto-join)
 * ================================================================ */
describe("POST /api/login with inviteCode", () => {
  it("auto-joins group when inviteCode is provided", async () => {
    const alice = await loginAs("alice");
    const groupRes = await alice.post("/api/groups").send({ name: "Invite Join" });
    const groupId = groupRes.body.id;
    const inviteRes = await alice.post(`/api/groups/${groupId}/invite`);
    const inviteId = inviteRes.body.id;

    const bob = supertest.agent(app);
    const loginRes = await bob.post("/api/login").send({ username: "bob", inviteCode: inviteId });
    expect(loginRes.status).toBe(200);
    expect(loginRes.body.ok).toBe(true);
    expect(loginRes.body.joinedGroup).toBeDefined();
    expect(loginRes.body.joinedGroup.name).toBe("Invite Join");
  });

  it("does not return joinedGroup for invalid inviteCode", async () => {
    const agent = supertest.agent(app);
    const loginRes = await agent.post("/api/login").send({ username: "charlie", inviteCode: "bad-code" });
    expect(loginRes.status).toBe(200);
    expect(loginRes.body.ok).toBe(true);
    expect(loginRes.body.joinedGroup).toBeUndefined();
  });

  it("skips join if already a member", async () => {
    const alice = await loginAs("alice");
    const groupRes = await alice.post("/api/groups").send({ name: "Already In" });
    const groupId = groupRes.body.id;
    const inviteRes = await alice.post(`/api/groups/${groupId}/invite`);
    const inviteId = inviteRes.body.id;

    // alice is already a member — login again with the invite
    const agent = supertest.agent(app);
    const loginRes = await agent.post("/api/login").send({ username: "alice", inviteCode: inviteId });
    expect(loginRes.status).toBe(200);
    expect(loginRes.body.ok).toBe(true);
    expect(loginRes.body.joinedGroup).toBeDefined();
    expect(loginRes.body.joinedGroup.name).toBe("Already In");
  });
});

/* ================================================================
 *  POST /api/join/:inviteId
 * ================================================================ */
describe("POST /api/join/:inviteId", () => {
  it("joins a group via valid invite", async () => {
    const alice = await loginAs("alice");
    const groupRes = await alice.post("/api/groups").send({ name: "Join Test" });
    const groupId = groupRes.body.id;
    const inviteRes = await alice.post(`/api/groups/${groupId}/invite`);
    const inviteId = inviteRes.body.id;

    const bob = await loginAs("bob");
    const joinRes = await bob.post(`/api/join/${inviteId}`);
    expect(joinRes.status).toBe(200);
    expect(joinRes.body.group).toBeDefined();
    expect(joinRes.body.group.name).toBe("Join Test");
  });

  it("returns error for invalid or expired invite", async () => {
    const bob = await loginAs("bob");
    const joinRes = await bob.post("/api/join/nonexistent-invite");
    expect(joinRes.status).toBe(400);
  });
});

/* ================================================================
 *  GET /api/analytics/most-deuces
 * ================================================================ */
describe("GET /api/analytics/most-deuces", () => {
  it("returns top deuce day", async () => {
    const agent = await loginAs("alice");
    const groupRes = await agent.post("/api/groups").send({ name: "Analytics Test" });
    const groupId = groupRes.body.id;

    await agent.post("/api/deuces").send({
      groupIds: [groupId],
      location: "Home",
      thoughts: "Test",
      loggedAt: new Date().toISOString(),
    });

    const response = await agent.get("/api/analytics/most-deuces");
    expect(response.status).toBe(200);
    const data = response.body;
    expect(data).toHaveProperty("date");
    expect(data).toHaveProperty("count");
  });
});
