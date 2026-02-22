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

    /* ---- Subscription ops (stubs for routes that reference storage) ---- */
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
    async resetAllStreakInsurance() { return 0; },

    /* ---- Premium analytics (stub) ---- */
    async getPremiumAnalytics(_userId: string) {
      return { totalDeuces: 0, avgPerWeek: 0, longestStreak: 0, currentStreak: 0, bestDay: { day: "Monday", count: 0 }, groupRankings: [] };
    },

    /* ---- Group ops ---- */
    async createGroup(group: any) {
      const newGroup = {
        id: group.id,
        name: group.name,
        description: group.description ?? null,
        createdBy: group.createdBy,
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
          const entryReactions = _reactions
            .filter((r: any) => r.entryId === e.id);
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
    async getGroupStreak(_groupId: string) {
      return { currentStreak: 0, longestStreak: 0, lastStreakDate: null as string | null };
    },
    async updateGroupStreak(
      _groupId: string,
      _currentStreak: number,
      _longestStreak: number,
      _lastStreakDate: string,
    ) {},
    async getMembersLogStatusToday(groupId: string, _today: string) {
      const memberIds = _members
        .filter((m) => m.groupId === groupId)
        .map((m) => m.userId);
      return memberIds.map((uid) => ({
        userId: uid,
        hasLoggedToday: [..._entries.values()].some(
          (e) => e.groupId === groupId && e.userId === uid,
        ),
      }));
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

    /* ---- test helper ---- */
    _reset() {
      _users.clear();
      _groups.clear();
      _members = [];
      _entries.clear();
      _invites.clear();
      _locations = [];
      _reactions = [];
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
 *  AUTH TESTS
 * ================================================================ */
describe("Auth", () => {
  it("POST /api/login with new username creates user and returns user object", async () => {
    const res = await supertest.agent(app).post("/api/login").send({ username: "alice" });
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.id).toBe("dev-alice");
    expect(res.body.user).toHaveProperty("createdAt");

    const user = await memStore.getUser("dev-alice");
    expect(user).toBeDefined();
    expect(user.firstName).toBe("alice");
  });

  it("POST /api/login with existing username returns ok", async () => {
    await memStore.upsertUser({
      id: "dev-bob",
      email: "bob@localhost.dev",
      firstName: "bob",
      lastName: null,
      profileImageUrl: null,
    });

    const res = await supertest.agent(app).post("/api/login").send({ username: "bob" });
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it("POST /api/login with empty username returns 400", async () => {
    const res = await supertest(app).post("/api/login").send({ username: "" });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/username/i);
  });

  it("POST /api/login with missing username returns 400", async () => {
    const res = await supertest(app).post("/api/login").send({});
    expect(res.status).toBe(400);
  });

  it("GET /api/auth/user when authenticated returns user object", async () => {
    const agent = await loginAs("casey");
    const res = await agent.get("/api/auth/user");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", "dev-casey");
    expect(res.body).toHaveProperty("firstName", "casey");
    // Subscription fields are always present in user response
    expect(res.body).toHaveProperty("subscription", "free");
    expect(res.body).toHaveProperty("subscriptionExpiresAt", null);
    expect(res.body).toHaveProperty("streakInsuranceUsed", false);
  });

  it("GET /api/auth/user when not authenticated returns 401", async () => {
    const res = await supertest(app).get("/api/auth/user");
    expect(res.status).toBe(401);
  });

  it("POST /api/login auto-creates Solo Deuces group for new users", async () => {
    const agent = await loginAs("newuser");
    const groupsRes = await agent.get("/api/groups");
    expect(groupsRes.status).toBe(200);
    expect(groupsRes.body.length).toBe(1);
    expect(groupsRes.body[0].name).toBe("Solo Deuces");
  });

  it("POST /api/auth/logout destroys session and returns JSON", async () => {
    const agent = await loginAs("eve");

    const logoutRes = await agent.post("/api/auth/logout");
    expect(logoutRes.status).toBe(200);
    expect(logoutRes.body).toEqual({ ok: true });

    // Session destroyed — should be 401
    const afterRes = await agent.get("/api/auth/user");
    expect(afterRes.status).toBe(401);
  });

  it("GET /api/auth/user does NOT auto-create groups (pure read)", async () => {
    // Login creates the Solo Deuces group, then we clear groups manually
    const agent = await loginAs("pureread");
    // Reset store to remove the auto-created group, but keep the user
    const user = await memStore.getUser("dev-pureread");
    memStore._reset();
    await memStore.upsertUser({ id: user.id, email: user.email, firstName: user.firstName, lastName: null, profileImageUrl: null });
    // Re-login to get a fresh session pointing to the existing user
    await agent.post("/api/login").send({ username: "pureread" });

    // Now user has Solo Deuces from re-login. Clear groups again for the real test.
    // We need to test that GET /api/auth/user itself doesn't create groups.
    // So let's use a different approach: create user directly, set session, check GET.
    // Actually the simplest test: after login (which creates Solo Deuces), GET /api/auth/user
    // shouldn't create a SECOND group.
    const groupsBefore = await agent.get("/api/groups");
    await agent.get("/api/auth/user");
    const groupsAfter = await agent.get("/api/groups");
    expect(groupsAfter.body.length).toBe(groupsBefore.body.length);
  });

  it("GET /api/logout clears session — subsequent auth/user returns 401", async () => {
    const agent = await loginAs("dave");

    // Confirm authenticated
    const authRes = await agent.get("/api/auth/user");
    expect(authRes.status).toBe(200);

    // Logout (follows redirect automatically)
    await agent.get("/api/logout");

    // Session destroyed — should be 401
    const afterRes = await agent.get("/api/auth/user");
    expect(afterRes.status).toBe(401);
  });
});

/* ================================================================
 *  GROUP TESTS
 * ================================================================ */
describe("Groups", () => {
  it("POST /api/groups (authenticated) creates group with id", async () => {
    const agent = await loginAs("alice");
    const res = await agent.post("/api/groups").send({ name: "Throne Room", description: "Royal flush zone" });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body.name).toBe("Throne Room");
    expect(res.body.description).toBe("Royal flush zone");
  });

  it("POST /api/groups (unauthenticated) returns 401", async () => {
    const res = await supertest(app).post("/api/groups").send({ name: "Nope" });
    expect(res.status).toBe(401);
  });

  it("GET /api/groups returns user groups array", async () => {
    const agent = await loginAs("alice");
    await agent.post("/api/groups").send({ name: "Group A" });
    await agent.post("/api/groups").send({ name: "Group B" });

    const res = await agent.get("/api/groups");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(3); // Solo Deuces (auto-created) + Group A + Group B
    expect(res.body.map((g: any) => g.name).sort()).toEqual(["Group A", "Group B", "Solo Deuces"]);
  });

  it("POST /api/join/:inviteId with valid invite joins group", async () => {
    // Alice creates a group and generates an invite
    const alice = await loginAs("alice");
    const groupRes = await alice.post("/api/groups").send({ name: "Party Throne" });
    const groupId = groupRes.body.id;

    const inviteRes = await alice.post(`/api/groups/${groupId}/invite`);
    expect(inviteRes.status).toBe(200);
    const inviteId = inviteRes.body.id;

    // Bob joins via the invite
    const bob = await loginAs("bob");
    const joinRes = await bob.post(`/api/join/${inviteId}`);
    expect(joinRes.status).toBe(200);
    expect(joinRes.body.group).toBeDefined();
    expect(joinRes.body.group.id).toBe(groupId);

    // Verify Bob is now a member
    const detailRes = await bob.get(`/api/groups/${groupId}`);
    expect(detailRes.status).toBe(200);
  });

  it("POST /api/join/:inviteId with invalid inviteId returns 400", async () => {
    const agent = await loginAs("alice");
    const res = await agent.post("/api/join/nonexistent-invite-id");
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/invalid|expired/i);
  });

  it("GET /api/groups/:id (member) returns group, members, entries", async () => {
    const agent = await loginAs("alice");
    const groupRes = await agent.post("/api/groups").send({ name: "Detail Test" });
    const groupId = groupRes.body.id;

    const res = await agent.get(`/api/groups/${groupId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("group");
    expect(res.body).toHaveProperty("members");
    expect(res.body).toHaveProperty("entries");
    expect(res.body.group.id).toBe(groupId);
    expect(res.body.members.length).toBeGreaterThanOrEqual(1);
  });

  it("GET /api/groups/:id (non-member) returns 403", async () => {
    // Alice creates a group
    const alice = await loginAs("alice");
    const groupRes = await alice.post("/api/groups").send({ name: "Private" });
    const groupId = groupRes.body.id;

    // Bob (not invited) tries to view it
    const bob = await loginAs("bob");
    const res = await bob.get(`/api/groups/${groupId}`);
    expect(res.status).toBe(403);
  });
});

/* ================================================================
 *  DEUCES / ENTRIES TESTS
 * ================================================================ */
describe("Deuces", () => {
  it("POST /api/deuces (authenticated, valid group) creates entry", async () => {
    const agent = await loginAs("alice");
    const groupRes = await agent.post("/api/groups").send({ name: "Deuce Test" });
    const groupId = groupRes.body.id;

    const res = await agent.post("/api/deuces").send({
      groupIds: [groupId],
      location: "Home",
      thoughts: "A fine morning constitutional",
      loggedAt: new Date().toISOString(),
    });
    expect(res.status).toBe(200);
    expect(res.body.entries).toHaveLength(1);
    expect(res.body.entries[0].location).toBe("Home");
    expect(res.body.count).toBe(1);
  });

  it("POST /api/deuces (unauthenticated) returns 401", async () => {
    const res = await supertest(app).post("/api/deuces").send({
      groupIds: ["fake-group"],
      location: "Work",
      thoughts: "Nope",
    });
    expect(res.status).toBe(401);
  });

  it("deuce appears in group detail entries", async () => {
    const agent = await loginAs("alice");
    const groupRes = await agent.post("/api/groups").send({ name: "Feed Test" });
    const groupId = groupRes.body.id;

    await agent.post("/api/deuces").send({
      groupIds: [groupId],
      location: "Office",
      thoughts: "Mid-morning movement",
    });

    const detailRes = await agent.get(`/api/groups/${groupId}`);
    expect(detailRes.status).toBe(200);
    expect(detailRes.body.entries.length).toBe(1);
    expect(detailRes.body.entries[0].location).toBe("Office");
    expect(detailRes.body.entries[0].user).toBeDefined();
  });

  it("POST /api/entries/:id/reactions adds reaction", async () => {
    const agent = await loginAs("alice");
    const groupRes = await agent.post("/api/groups").send({ name: "React Test" });
    const groupId = groupRes.body.id;

    const deuceRes = await agent.post("/api/deuces").send({
      groupIds: [groupId],
      location: "Home",
      thoughts: "Quick one",
    });
    const entryId = deuceRes.body.entries[0].id;

    const rxnRes = await agent.post(`/api/entries/${entryId}/reactions`).send({ emoji: "💩" });
    expect(rxnRes.status).toBe(200);
    expect(rxnRes.body.emoji).toBe("💩");
  });

  it("GET /api/deuces (unauthenticated) returns 401", async () => {
    const res = await supertest(app).get("/api/deuces");
    expect(res.status).toBe(401);
  });

  it("GET /api/deuces returns entries across all user groups", async () => {
    const agent = await loginAs("alice");
    const g1 = await agent.post("/api/groups").send({ name: "Group 1" });
    const g2 = await agent.post("/api/groups").send({ name: "Group 2" });

    await agent.post("/api/deuces").send({
      groupIds: [g1.body.id],
      location: "Home",
      thoughts: "First",
    });
    await agent.post("/api/deuces").send({
      groupIds: [g2.body.id],
      location: "Office",
      thoughts: "Second",
    });

    const res = await agent.get("/api/deuces");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    // 2 entries across groups (solo deuces auto-created has none)
    expect(res.body.length).toBe(2);
    // Each entry should have user and reactions
    expect(res.body[0]).toHaveProperty("user");
    expect(res.body[0]).toHaveProperty("reactions");
  });

  it("GET /api/deuces?groupId=x filters to single group", async () => {
    const agent = await loginAs("alice");
    const g1 = await agent.post("/api/groups").send({ name: "Target" });
    const g2 = await agent.post("/api/groups").send({ name: "Other" });

    await agent.post("/api/deuces").send({
      groupIds: [g1.body.id],
      location: "Home",
      thoughts: "In target",
    });
    await agent.post("/api/deuces").send({
      groupIds: [g2.body.id],
      location: "Office",
      thoughts: "In other",
    });

    const res = await agent.get(`/api/deuces?groupId=${g1.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].thoughts).toBe("In target");
  });

  it("GET /api/deuces?groupId=x returns 403 for non-member", async () => {
    const alice = await loginAs("alice");
    const groupRes = await alice.post("/api/groups").send({ name: "Private" });

    const bob = await loginAs("bob");
    const res = await bob.get(`/api/deuces?groupId=${groupRes.body.id}`);
    expect(res.status).toBe(403);
  });

  it("GET /api/entries/:id/reactions returns reactions array", async () => {
    const agent = await loginAs("alice");
    const groupRes = await agent.post("/api/groups").send({ name: "Rxn List" });
    const groupId = groupRes.body.id;

    const deuceRes = await agent.post("/api/deuces").send({
      groupIds: [groupId],
      location: "Gym",
      thoughts: "Post-workout",
    });
    const entryId = deuceRes.body.entries[0].id;

    await agent.post(`/api/entries/${entryId}/reactions`).send({ emoji: "🔥" });

    const res = await agent.get(`/api/entries/${entryId}/reactions`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].emoji).toBe("🔥");
    expect(res.body[0].user).toBeDefined();
  });
});

/* ================================================================
 *  EDGE CASE TESTS
 * ================================================================ */
describe("Edge cases", () => {
  it("logging deuce to a group you're not a member of returns 403", async () => {
    // Alice creates a group
    const alice = await loginAs("alice");
    const groupRes = await alice.post("/api/groups").send({ name: "Alice Only" });
    const groupId = groupRes.body.id;

    // Bob (not a member) tries to log a deuce
    const bob = await loginAs("bob");
    const res = await bob.post("/api/deuces").send({
      groupIds: [groupId],
      location: "Home",
      thoughts: "Sneaky",
    });
    expect(res.status).toBe(403);
  });

  it("duplicate reaction by same user returns 400", async () => {
    const agent = await loginAs("alice");
    const groupRes = await agent.post("/api/groups").send({ name: "Dup Rxn" });
    const groupId = groupRes.body.id;

    const deuceRes = await agent.post("/api/deuces").send({
      groupIds: [groupId],
      location: "Home",
      thoughts: "Testing dupes",
    });
    const entryId = deuceRes.body.entries[0].id;

    // First reaction succeeds
    const first = await agent.post(`/api/entries/${entryId}/reactions`).send({ emoji: "💩" });
    expect(first.status).toBe(200);

    // Duplicate reaction should return 400
    const second = await agent.post(`/api/entries/${entryId}/reactions`).send({ emoji: "💩" });
    expect(second.status).toBe(400);
    expect(second.body.message).toMatch(/already/i);
  });

  it("rejects thoughts exceeding 500 characters", async () => {
    const agent = await loginAs("alice");
    const groupRes = await agent.post("/api/groups").send({ name: "Long Text" });
    const groupId = groupRes.body.id;

    const longText = "A".repeat(501);
    const res = await agent.post("/api/deuces").send({
      groupIds: [groupId],
      location: "Home",
      thoughts: longText,
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Thought must be 500 characters or less");
  });
});
