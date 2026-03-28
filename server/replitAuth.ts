/**
 * Dual-mode auth: Clerk JWT when CLERK_SECRET_KEY is set,
 * dev username-only sessions otherwise.
 *
 * Login (dev):  POST /api/login { username }  → sets session
 * Logout (dev): GET /api/logout               → destroys session
 * isAuthenticated: checks Bearer JWT (Clerk) or session (dev)
 */

import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import { z } from "zod";
import { storage } from "./storage";
import { v4 as uuidv4 } from "uuid";
import logger from "./lib/logger";

const loginSchema = z.object({
  username: z.string().min(3).max(50),
  inviteCode: z.string().optional(),
});

const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;

/** True when Clerk keys are configured and should be used for auth. */
export let clerkEnabled = !!CLERK_SECRET_KEY;

type ClerkClient = {
  verifyToken(token: string): Promise<{
    sub: string; email?: string | null; first_name?: string | null;
    last_name?: string | null; image_url?: string | null;
  }>;
};
export let clerk: ClerkClient | null = null;
await (async () => {
  if (clerkEnabled) {
    try {
      const mod = await import("@clerk/clerk-sdk-node");
      const { createClerkClient } = mod;
      clerk = createClerkClient({ secretKey: CLERK_SECRET_KEY! });
    } catch (err) {
      logger.warn(
        { err: (err as Error).message },
        "[AUTH] Clerk SDK failed to initialise — falling back to session auth",
      );
      clerkEnabled = false;
    }
  }
})();

// --------------- session setup (dev mode) ---------------

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  const sessionSecret = process.env.SESSION_SECRET;
  if (!sessionSecret && process.env.NODE_ENV === "production") {
    logger.warn("[AUTH] WARNING: SESSION_SECRET is not set in production — using insecure default");
  }
  return session({
    secret: sessionSecret || "local-dev-secret",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: sessionTtl,
    },
  });
}

export async function setupAuth(app: Express) {
  // Session middleware is always mounted — dev mode needs it,
  // and it's harmless (no-op) when Clerk handles auth.
  app.use(getSession());

  if (!clerkEnabled) {
    // Dev-only login/logout routes
    app.post("/api/login", async (req, res) => {
      try {
        const parsed = loginSchema.safeParse(req.body);
        if (!parsed.success) {
          return res.status(400).json({ message: "Username is required" });
        }
        const { username, inviteCode } = parsed.data;
        if (!username.trim()) {
          return res.status(400).json({ message: "Username is required" });
        }
        const name = username.trim();
        const userId = `dev-${name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;

        const user = await storage.upsertUser({
          id: userId,
          email: `${name.toLowerCase().replace(/\s+/g, ".")}@localhost.dev`,
          firstName: name,
          lastName: null,
          profileImageUrl: null,
        });

        // Auto-create "Solo Deuces" default group for users with no groups
        const userGroups = await storage.getUserGroups(userId);
        if (userGroups.length === 0) {
          await storage.createGroup({
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
            const invite = await storage.getInviteById(inviteCode);
            if (invite && invite.expiresAt >= new Date()) {
              const alreadyMember = await storage.isUserInGroup(userId, invite.groupId);
              if (!alreadyMember) {
                await storage.addGroupMember({
                  groupId: invite.groupId,
                  userId,
                  role: "member",
                });
              }
              const group = await storage.getGroupById(invite.groupId);
              if (group) {
                joinedGroup = { id: group.id, name: group.name };
              }
            }
          } catch (joinErr) {
            logger.error({ err: joinErr }, "Auto-join on login failed");
          }
        }

        req.session.userId = userId;
        req.session.save((err: Error | null) => {
          if (err) {
            logger.error({ err }, "Session save error");
            return res.status(500).json({ message: "Failed to save session" });
          }
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
      } catch (error) {
        logger.error({ err: error }, "Login error");
        res.status(500).json({ message: "Login failed" });
      }
    });

    app.get("/api/logout", (req, res) => {
      req.session.destroy(() => {
        res.redirect("/");
      });
    });

    app.post("/api/auth/logout", (req, res) => {
      req.session.destroy(() => {
        res.json({ ok: true });
      });
    });
  }
}

// --------------- isAuthenticated middleware ---------------

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  // --- Clerk mode: verify Bearer JWT ---
  if (clerkEnabled) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      logger.info(
        { method: req.method, path: req.path,
          authHeader: authHeader ? authHeader.substring(0, 20) + '...' : 'MISSING' },
        "[AUTH] 401 no-bearer",
      );
      return res.status(401).json({ message: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    type JWTPayload = {
      sub: string; email?: string | null; first_name?: string | null;
      last_name?: string | null; image_url?: string | null;
    };
    let payload: JWTPayload;
    try {
      payload = await clerk!.verifyToken(token);
    } catch (err) {
      logger.error({ err, method: req.method, path: req.path }, "[AUTH] 401 bad-token");
      return res.status(401).json({ message: "Invalid token" });
    }

    try {
      let user = await storage.getUser(payload.sub);
      if (!user) {
        // Auto-create user on first Clerk login
        user = await storage.upsertUser({
          id: payload.sub,
          email: payload.email ?? null,
          firstName: payload.first_name ?? null,
          lastName: payload.last_name ?? null,
          profileImageUrl: payload.image_url ?? null,
        });
        logger.info({ userId: payload.sub }, "[AUTH] auto-created user");

        // Auto-create "Solo Deuces" default group
        try {
          const groups = await storage.getUserGroups(payload.sub);
          if (groups.length === 0) {
            const { v4: uuidv4 } = await import("uuid");
            await storage.createGroup({
              id: uuidv4(),
              name: "Solo Deuces",
              description: "Your personal throne log",
              createdBy: payload.sub,
            });
            logger.info({ userId: payload.sub }, "[AUTH] auto-created Solo Deuces");
          }
        } catch (groupErr) {
          logger.error({ err: groupErr }, "[AUTH] failed to create Solo Deuces");
          // Non-fatal — user can still use the app
        }
      }
      req.user = user;
      // Store decoded JWT claims so premium middleware can check Clerk Billing plan
      req.clerkAuth = payload;
      return next();
    } catch (err) {
      logger.error({ err, method: req.method, path: req.path, userId: payload.sub }, "[AUTH] 500 db-error");
      return res.status(500).json({ message: "Internal auth error" });
    }
  }

  // --- Dev mode: session-based auth ---
  const userId = req.session?.userId;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const user = await storage.getUser(userId);
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  req.user = user;
  next();
};
