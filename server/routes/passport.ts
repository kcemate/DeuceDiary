import { Router, Request } from "express";
import logger from "../lib/logger";

type AuthReq = Request & { user: { id: string } };
import { storage } from "../storage";
import { isAuthenticated } from "../replitAuth";
import { requiresPremiumFor } from "../premiumAuth";

export function createPassportRouter(): Router {
  const router = Router();

  // Get passport stamps + stats for the authenticated user
  router.get(
    "/api/passport",
    isAuthenticated,
    requiresPremiumFor("passport"),
    async (req: AuthReq, res) => {
      try {
        const userId = req.user.id;
        const [stamps, stats] = await Promise.all([
          storage.getPassportStamps(userId),
          storage.getPassportStats(userId),
        ]);
        res.json({ stamps, stats });
      } catch (error) {
        logger.error("Error fetching passport:", error);
        res.status(500).json({ message: "Failed to fetch passport data" });
      }
    },
  );

  // Get passport stamps + stats for a specific user (public share view)
  router.get(
    "/api/passport/:userId",
    async (req: Request, res) => {
      try {
        const { userId } = req.params;
        const user = await storage.getUser(userId);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        const [stamps, stats] = await Promise.all([
          storage.getPassportStamps(userId),
          storage.getPassportStats(userId),
        ]);

        res.json({
          stamps,
          stats,
          user: {
            id: user.id,
            username: user.username,
            firstName: user.firstName,
            profileImageUrl: user.profileImageUrl,
          },
        });
      } catch (error) {
        logger.error("Error fetching passport share data:", error);
        res.status(500).json({ message: "Failed to fetch passport data" });
      }
    },
  );

  // Delete all passport location data (privacy)
  router.delete(
    "/api/passport",
    isAuthenticated,
    async (req: AuthReq, res) => {
      try {
        const userId = req.user.id;
        await storage.deletePassportStamps(userId);
        res.json({ message: "Passport data deleted" });
      } catch (error) {
        logger.error("Error deleting passport data:", error);
        res.status(500).json({ message: "Failed to delete passport data" });
      }
    },
  );

  return router;
}
