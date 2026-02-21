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
import { createClerkClient } from "@clerk/clerk-sdk-node";
import { storage } from "./storage";
import { v4 as uuidv4 } from "uuid";

const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;

/** True when Clerk keys are configured and should be used for auth. */
export const clerkEnabled = !!CLERK_SECRET_KEY;

const clerk = clerkEnabled
  ? createClerkClient({ secretKey: CLERK_SECRET_KEY! })
  : null;

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
  return session({
    secret: process.env.SESSION_SECRET || "local-dev-secret",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // http is fine for local dev
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
    app.post("/api/login", async (req: any, res) => {
      try {
        const { username, inviteCode } = req.body;
        if (!username || typeof username !== "string" || !username.trim()) {
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
                await storage.deleteInvite(inviteCode);
              }
              const group = await storage.getGroupById(invite.groupId);
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
          if (err) {
            console.error("Session save error:", err);
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
        console.error("Login error:", error);
        res.status(500).json({ message: "Login failed" });
      }
    });

    app.get("/api/logout", (req: any, res) => {
      req.session.destroy(() => {
        res.redirect("/");
      });
    });

    app.post("/api/auth/logout", (req: any, res) => {
      req.session.destroy(() => {
        res.json({ ok: true });
      });
    });
  }
}

// --------------- isAuthenticated middleware ---------------

export const isAuthenticated: RequestHandler = async (req: any, res, next) => {
  // --- Clerk mode: verify Bearer JWT ---
  if (clerkEnabled) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    try {
      const payload = await clerk!.verifyToken(token);
      const user = await storage.getUser(payload.sub);
      if (!user) {
        return res.status(401).json({ message: "Unauthorized — user not synced" });
      }
      req.user = user;
      return next();
    } catch {
      return res.status(401).json({ message: "Invalid token" });
    }
  }

  // --- Dev mode: session-based auth ---
  const userId = (req.session as any)?.userId;
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
