import type { RequestHandler } from "express";
import { storage } from "./storage";

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
  return async (req: any, res, next) => {
    const groupId: string | undefined = req.params[paramName];

    if (!groupId || typeof groupId !== "string") {
      return res.status(400).json({ message: "Missing group ID" });
    }

    const userId: string | undefined = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const isMember = await storage.isUserInGroup(userId, groupId);
    if (!isMember) {
      return res.status(403).json({ message: "Not authorized" });
    }

    req.groupId = groupId;
    next();
  };
}
