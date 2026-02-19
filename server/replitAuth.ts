/**
 * Local dev auth — replaces Replit OIDC for running outside Replit.
 * Login: POST /api/login { username }  → sets session, redirects to /
 * Logout: GET /api/logout              → destroys session, redirects to /
 * isAuthenticated: middleware that checks req.session.userId
 */

import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

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
  app.use(getSession());

  // POST /api/login — accepts any username, no password required for local dev
  app.post("/api/login", async (req: any, res) => {
    try {
      const { username } = req.body;
      if (!username || typeof username !== "string" || !username.trim()) {
        return res.status(400).json({ message: "Username is required" });
      }
      const name = username.trim();
      // Derive a stable user ID from the username
      const userId = `dev-${name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;

      await storage.upsertUser({
        id: userId,
        email: `${name.toLowerCase().replace(/\s+/g, ".")}@localhost.dev`,
        firstName: name,
        lastName: null,
        profileImageUrl: null,
      });

      req.session.userId = userId;
      req.session.save((err: any) => {
        if (err) {
          console.error("Session save error:", err);
          return res.status(500).json({ message: "Failed to save session" });
        }
        res.json({ ok: true });
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
}

export const isAuthenticated: RequestHandler = async (req: any, res, next) => {
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
