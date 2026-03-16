import { Router, Request } from "express";
import logger from "../lib/logger";

type AuthReq = Request & { user: { id: string }; groupId: string };
import { storage } from "../storage";
import { isAuthenticated } from "../replitAuth";
import { requireGroupMember } from "../groupAuth";
import { isPremiumUser } from "./helpers";
import { CHALLENGE_TEMPLATES, getTemplateByKey } from "../challengeTemplates";
import { z } from "zod";

const setChallengeSchema = z.object({
  title: z.string().min(1).max(140).optional(),
  templateKey: z.string().optional(),
}).refine((d) => d.title || d.templateKey, {
  message: "Either title or templateKey is required",
});

export function createKingRouter(): Router {
  const router = Router();

  // GET /api/groups/:groupId/king — current Deuce King + active challenge
  router.get(
    "/api/groups/:groupId/king",
    isAuthenticated,
    requireGroupMember(),
    async (req: AuthReq, res) => {
      try {
        const groupId = req.groupId as string;
        const king = await storage.getCurrentKing(groupId);
        const activeChallenge = await storage.getActiveChallenge(groupId);

        res.json({
          king: king
            ? {
                id: king.id,
                userId: king.userId,
                username: king.user?.username ?? null,
                profileImageUrl: king.user?.profileImageUrl ?? null,
                logCount: king.logCount,
                consecutiveWins: king.consecutiveWins,
                periodStart: king.periodStart,
                periodEnd: king.periodEnd,
              }
            : null,
          challenge: activeChallenge
            ? {
                id: activeChallenge.id,
                title: activeChallenge.title,
                templateKey: activeChallenge.templateKey,
                periodStart: activeChallenge.periodStart,
                periodEnd: activeChallenge.periodEnd,
                completionCount: activeChallenge.completionCount,
                isAutoSelected: activeChallenge.isAutoSelected,
              }
            : null,
          templates: CHALLENGE_TEMPLATES,
        });
      } catch (error) {
        logger.error({ err: error }, "[king] GET /king error:");
        res.status(500).json({ message: "Failed to fetch Deuce King" });
      }
    },
  );

  // GET /api/groups/:groupId/challenge/history — MUST be before /:groupId/challenge
  router.get(
    "/api/groups/:groupId/challenge/history",
    isAuthenticated,
    requireGroupMember(),
    async (req: AuthReq, res) => {
      try {
        const groupId = req.groupId as string;
        const history = await storage.getChallengeHistory(groupId, 10);

        res.json(
          history.map((h) => ({
            king: {
              userId: h.king.userId,
              username: h.king.user?.username ?? null,
              profileImageUrl: h.king.user?.profileImageUrl ?? null,
              logCount: h.king.logCount,
              consecutiveWins: h.king.consecutiveWins,
              periodStart: h.king.periodStart,
              periodEnd: h.king.periodEnd,
            },
            challenge: h.challenge
              ? {
                  id: h.challenge.id,
                  title: h.challenge.title,
                  templateKey: h.challenge.templateKey,
                  isAutoSelected: h.challenge.isAutoSelected,
                }
              : null,
            completionCount: h.completionCount,
          })),
        );
      } catch (error) {
        logger.error({ err: error }, "[king] GET /challenge/history error:");
        res.status(500).json({ message: "Failed to fetch challenge history" });
      }
    },
  );

  // GET /api/groups/:groupId/challenge — active challenge + member progress
  router.get(
    "/api/groups/:groupId/challenge",
    isAuthenticated,
    requireGroupMember(),
    async (req: AuthReq, res) => {
      try {
        const groupId = req.groupId as string;
        const userId = req.user.id as string;
        const { challenge, completions, memberCount } =
          await storage.getChallengeWithMemberProgress(groupId);

        const userCompleted = challenge
          ? completions.some((c) => c.userId === userId)
          : false;

        res.json({
          challenge: challenge
            ? {
                id: challenge.id,
                title: challenge.title,
                templateKey: challenge.templateKey,
                kingId: challenge.kingId,
                periodStart: challenge.periodStart,
                periodEnd: challenge.periodEnd,
                isAutoSelected: challenge.isAutoSelected,
              }
            : null,
          completionCount: completions.length,
          memberCount,
          userCompleted,
        });
      } catch (error) {
        logger.error({ err: error }, "[king] GET /challenge error:");
        res.status(500).json({ message: "Failed to fetch challenge" });
      }
    },
  );

  // POST /api/groups/:groupId/challenge — King sets a challenge
  router.post(
    "/api/groups/:groupId/challenge",
    isAuthenticated,
    requireGroupMember(),
    async (req: AuthReq, res) => {
      try {
        const groupId = req.groupId as string;
        const userId = req.user.id as string;

        // Verify requester is the current king
        const king = await storage.getCurrentKing(groupId);
        if (!king) {
          return res.status(403).json({ message: "No active Deuce King for this group" });
        }
        if (king.userId !== userId) {
          return res.status(403).json({ message: "Only the current Deuce King can set a challenge" });
        }

        // Check if challenge already set for this king period
        const existing = await storage.getExistingChallengeForKing(king.id);
        if (existing) {
          return res.status(409).json({ message: "Challenge already set for this period" });
        }

        const parsed = setChallengeSchema.safeParse(req.body);
        if (!parsed.success) {
          return res.status(400).json({ message: parsed.error.issues[0]?.message ?? "Invalid input" });
        }

        const { title, templateKey } = parsed.data;

        // Free text challenges require premium
        if (title && !templateKey) {
          if (!isPremiumUser(req.user)) {
            return res.status(403).json({
              message: "Custom free-text challenges require Premium. Use a template instead.",
              upgrade: true,
              feature: "custom_challenges",
            });
          }
        }

        // If templateKey provided, validate and derive title
        let finalTitle = title ?? "";
        let finalTemplateKey: string | null = templateKey ?? null;

        if (templateKey) {
          const template = getTemplateByKey(templateKey);
          if (!template) {
            return res.status(400).json({ message: "Invalid template key" });
          }
          finalTitle = template.title;
          finalTemplateKey = templateKey;
        }

        const challenge = await storage.createChallenge({
          groupId,
          kingId: userId,
          deuceKingId: king.id,
          title: finalTitle,
          templateKey: finalTemplateKey,
          periodStart: king.periodStart,
          periodEnd: king.periodEnd,
          isAutoSelected: false,
        });

        res.json({
          id: challenge.id,
          title: challenge.title,
          templateKey: challenge.templateKey,
          periodStart: challenge.periodStart,
          periodEnd: challenge.periodEnd,
        });
      } catch (error) {
        logger.error({ err: error }, "[king] POST /challenge error:");
        res.status(500).json({ message: "Failed to set challenge" });
      }
    },
  );

  // POST /api/groups/:groupId/challenge/complete — member marks active challenge complete
  router.post(
    "/api/groups/:groupId/challenge/complete",
    isAuthenticated,
    requireGroupMember(),
    async (req: AuthReq, res) => {
      try {
        const groupId = req.groupId as string;
        const userId = req.user.id as string;

        const { challenge } = await storage.getChallengeWithMemberProgress(groupId);
        if (!challenge) {
          return res.status(404).json({ message: "No active challenge for this group" });
        }

        const existing = await storage.getUserChallengeCompletion(challenge.id, userId);
        if (existing) {
          return res.status(409).json({ message: "You already completed this challenge" });
        }

        await storage.addChallengeCompletion(challenge.id, userId);

        res.json({ ok: true, challengeId: challenge.id });
      } catch (error) {
        logger.error({ err: error }, "[king] POST /challenge/complete error:");
        res.status(500).json({ message: "Failed to mark challenge complete" });
      }
    },
  );

  return router;
}
