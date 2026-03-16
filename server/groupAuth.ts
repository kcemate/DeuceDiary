import type { Request, RequestHandler } from "express";
import { storage } from "./storage";
import logger from "./lib/logger";

/**
 * Middleware that verifies the authenticated user is a member of the group
 * identified by :groupId or :id in req.params.
 *
 * Must be placed AFTER isAuthenticated in the middleware chain.
 * Sets req.groupId on success for downstream handlers.
 *
 * @param paramName - route param to read the group ID from (default "groupId")
 */
export function requireGroupMember(paramName = "groupId"): RequestHandler {
  return async (req: Request & { user?: { id: string }; groupId?: string }, res, next) => {
    const groupId: string | undefined = req.params[paramName];

    if (!groupId || typeof groupId !== "string") {
      return res.status(400).json({ message: "Missing group ID" });
    }

    // Reject non-UUID group IDs before any DB lookup
    const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!UUID_RE.test(groupId)) {
      return res.status(400).json({ message: "Invalid group ID format" });
    }

    const userId: string | undefined = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let isMember: boolean;
    try {
      isMember = await storage.isUserInGroup(userId, groupId);
    } catch (err) {
      logger.error({ err }, "[groupAuth] isUserInGroup error");
      return res.status(500).json({ message: "Internal server error" });
    }

    if (!isMember) {
      return res.status(403).json({ message: "Not authorized" });
    }

    req.groupId = groupId;
    next();
  };
}
