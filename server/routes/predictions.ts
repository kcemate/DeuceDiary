import { Router, type Request, type Response } from "express";
import { z } from "zod";
import { db } from "../db";
import { isAuthenticated } from "../replitAuth";
import { requireGroupMember } from "../groupAuth";
import { requiresPremiumFor } from "../premiumAuth";
import { asyncRoute } from "./helpers";
import {
  predictionCards,
  predictions,
  squadPoopPoints,
  groupMembers,
  deuceEntries,
  users,
} from "@shared/schema";
import { eq, and, desc, sql, gte, lt, sum, count } from "drizzle-orm";

type AuthReq = Request & { user: { id: string }; groupId: string };

// --- Question generation ---

/**
 * Get the Monday of the current UTC week (Mon 00:00:00 UTC).
 */
function getCurrentWeekStart(): Date {
  const now = new Date();
  const dayOfWeek = now.getUTCDay(); // 0=Sun
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const weekStart = new Date(now);
  weekStart.setUTCDate(weekStart.getUTCDate() - daysToMonday);
  weekStart.setUTCHours(0, 0, 0, 0);
  return weekStart;
}

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function generateQuestions(memberIds: string[], memberNames: Map<string, string>): string[] {
  const ids = [...memberIds];
  // Pick a random member for Q4
  const randomMember = ids[Math.floor(Math.random() * ids.length)];
  const randomMemberName = memberNames.get(randomMember) ?? "someone";
  const randomDay = DAYS_OF_WEEK[Math.floor(Math.random() * 5)]; // Mon–Fri

  return [
    "Who will log first this week?",
    "Who will have the longest streak by Friday?",
    "Total squad logs this week: ___",
    `Will ${randomMemberName} log before 10am on ${randomDay}?`,
    "Most logs in a single day by any member: ___",
  ];
}

/** Ensure a squadPoopPoints row exists for the user+group, inserting with 50 SPP if missing. */
async function ensureSppBalance(userId: string, groupId: string): Promise<number> {
  const existing = await db
    .select()
    .from(squadPoopPoints)
    .where(and(eq(squadPoopPoints.userId, userId), eq(squadPoopPoints.groupId, groupId)))
    .limit(1);

  if (existing.length > 0) return existing[0].balance;

  const inserted = await db
    .insert(squadPoopPoints)
    .values({ userId, groupId, balance: 50 })
    .onConflictDoNothing()
    .returning();

  if (inserted.length > 0) return inserted[0].balance;

  // Race condition: row was created concurrently
  const refetch = await db
    .select()
    .from(squadPoopPoints)
    .where(and(eq(squadPoopPoints.userId, userId), eq(squadPoopPoints.groupId, groupId)))
    .limit(1);
  return refetch[0]?.balance ?? 50;
}

/** Get or create the current week's prediction card for a group. */
async function getOrCreateCard(groupId: string, memberIds: string[], memberNames: Map<string, string>) {
  const weekStart = getCurrentWeekStart();

  const existing = await db
    .select()
    .from(predictionCards)
    .where(
      and(
        eq(predictionCards.groupId, groupId),
        eq(predictionCards.weekStart, weekStart),
      ),
    )
    .limit(1);

  if (existing.length > 0) return existing[0];

  // Create new card and replenish SPP for all members
  const [card] = await db
    .insert(predictionCards)
    .values({ groupId, weekStart, status: "active" })
    .onConflictDoNothing()
    .returning();

  if (!card) {
    // Created concurrently — fetch it
    const refetch = await db
      .select()
      .from(predictionCards)
      .where(
        and(
          eq(predictionCards.groupId, groupId),
          eq(predictionCards.weekStart, weekStart),
        ),
      )
      .limit(1);
    return refetch[0];
  }

  // Replenish 50 SPP for all group members on new card
  for (const userId of memberIds) {
    await db
      .insert(squadPoopPoints)
      .values({ userId, groupId, balance: 50 })
      .onConflictDoUpdate({
        target: [squadPoopPoints.userId, squadPoopPoints.groupId],
        set: {
          balance: sql`${squadPoopPoints.balance} + 50`,
          updatedAt: new Date(),
        },
      });
  }

  return card;
}

// --- Validation ---

const submitPredictionsSchema = z.object({
  predictions: z
    .array(
      z.object({
        questionIndex: z.number().int().min(0).max(4),
        answer: z.string().min(1).max(200),
        wager: z.number().int().min(1).max(50),
      }),
    )
    .min(1)
    .max(5),
});

// --- Router ---

export function createPredictionsRouter(): Router {
  const router = Router();

  // GET /api/groups/:groupId/predictions — current card + user's predictions
  router.get(
    "/api/groups/:groupId/predictions",
    isAuthenticated,
    requireGroupMember(),
    asyncRoute<AuthReq>("get predictions", "Failed to load predictions", async (req, res) => {
      const { groupId } = req;
      const userId = req.user.id;

      // Get group members for question generation
      const members = await db
        .select({ userId: groupMembers.userId, username: users.username, firstName: users.firstName, lastName: users.lastName })
        .from(groupMembers)
        .innerJoin(users, eq(users.id, groupMembers.userId))
        .where(eq(groupMembers.groupId, groupId));

      const memberIds = members.map((m) => m.userId);
      const memberNames = new Map(
        members.map((m) => [
          m.userId,
          m.username ?? (`${m.firstName ?? ""} ${m.lastName ?? ""}`.trim() || "Member"),
        ]),
      );

      const card = await getOrCreateCard(groupId, memberIds, memberNames);
      const questions = generateQuestions(memberIds, memberNames);

      // User's existing predictions for this card
      const userPredictions = await db
        .select()
        .from(predictions)
        .where(and(eq(predictions.cardId, card.id), eq(predictions.userId, userId)));

      const sppBalance = await ensureSppBalance(userId, groupId);

      res.json({
        card: {
          id: card.id,
          weekStart: card.weekStart,
          status: card.status,
        },
        questions,
        userPredictions,
        sppBalance,
        members: members.map((m) => ({
          userId: m.userId,
          displayName: memberNames.get(m.userId),
        })),
      });
    }),
  );

  // POST /api/groups/:groupId/predictions — submit predictions
  router.post(
    "/api/groups/:groupId/predictions",
    isAuthenticated,
    requireGroupMember(),
    asyncRoute<AuthReq>("submit predictions", "Failed to submit predictions", async (req, res) => {
      const { groupId } = req;
      const userId = req.user.id;

      const parsed = submitPredictionsSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.issues[0]?.message ?? "Invalid input" });
      }

      const { predictions: preds } = parsed.data;

      const weekStart = getCurrentWeekStart();
      const [card] = await db
        .select()
        .from(predictionCards)
        .where(and(eq(predictionCards.groupId, groupId), eq(predictionCards.weekStart, weekStart)))
        .limit(1);

      if (!card) return res.status(404).json({ message: "No active prediction card this week" });
      if (card.status !== "active") return res.status(409).json({ message: "Predictions are closed for this week" });

      const existing = await db
        .select()
        .from(predictions)
        .where(and(eq(predictions.cardId, card.id), eq(predictions.userId, userId)));

      if (existing.length > 0) {
        return res.status(409).json({ message: "You have already submitted predictions this week" });
      }

      const balance = await ensureSppBalance(userId, groupId);
      const totalWager = preds.reduce((sum, p) => sum + p.wager, 0);
      if (totalWager > balance) {
        return res.status(400).json({
          message: `Total wager (${totalWager} SPP) exceeds your balance (${balance} SPP)`,
        });
      }

      await db.insert(predictions).values(
        preds.map((p) => ({
          cardId: card.id,
          userId,
          questionIndex: p.questionIndex,
          answer: p.answer,
          wager: p.wager,
        })),
      );

      await db
        .update(squadPoopPoints)
        .set({
          balance: sql`${squadPoopPoints.balance} - ${totalWager}`,
          lifetimeWagered: sql`${squadPoopPoints.lifetimeWagered} + ${totalWager}`,
          updatedAt: new Date(),
        })
        .where(and(eq(squadPoopPoints.userId, userId), eq(squadPoopPoints.groupId, groupId)));

      res.json({ message: "Predictions submitted", totalWager });
    }),
  );

  // GET /api/groups/:groupId/predictions/leaderboard — SPP leaderboard
  router.get(
    "/api/groups/:groupId/predictions/leaderboard",
    isAuthenticated,
    requireGroupMember(),
    asyncRoute<AuthReq>("get spp leaderboard", "Failed to load leaderboard", async (req, res) => {
      const { groupId } = req;

      const rows = await db
        .select({
          userId: squadPoopPoints.userId,
          balance: squadPoopPoints.balance,
          lifetimeEarned: squadPoopPoints.lifetimeEarned,
          lifetimeWagered: squadPoopPoints.lifetimeWagered,
          username: users.username,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
        })
        .from(squadPoopPoints)
        .innerJoin(users, eq(users.id, squadPoopPoints.userId))
        .where(eq(squadPoopPoints.groupId, groupId))
        .orderBy(desc(squadPoopPoints.lifetimeEarned));

      res.json({
        leaderboard: rows.map((r, i) => ({
          rank: i + 1,
          userId: r.userId,
          displayName:
            r.username ?? (`${r.firstName ?? ""} ${r.lastName ?? ""}`.trim() || "Member"),
          profileImageUrl: r.profileImageUrl,
          balance: r.balance,
          lifetimeEarned: r.lifetimeEarned,
          lifetimeWagered: r.lifetimeWagered,
        })),
      });
    }),
  );

  // POST /api/groups/:groupId/predictions/resolve — resolve predictions (admin/cron)
  router.post(
    "/api/groups/:groupId/predictions/resolve",
    isAuthenticated,
    requireGroupMember(),
    asyncRoute<AuthReq>("resolve predictions", "Failed to resolve predictions", async (req, res) => {
      const { groupId } = req;
      const userId = req.user.id;

      // Only group admins can resolve
      const [membership] = await db
        .select({ role: groupMembers.role })
        .from(groupMembers)
        .where(and(eq(groupMembers.userId, userId), eq(groupMembers.groupId, groupId)))
        .limit(1);

      if (!membership || membership.role !== "admin") {
        return res.status(403).json({ message: "Only group admins can resolve predictions" });
      }

      const weekStart = getCurrentWeekStart();

      const [card] = await db
        .select()
        .from(predictionCards)
        .where(and(eq(predictionCards.groupId, groupId), eq(predictionCards.weekStart, weekStart)))
        .limit(1);

      if (!card) return res.status(404).json({ message: "No prediction card found for this week" });
      if (card.status === "resolved") return res.status(409).json({ message: "Already resolved" });

      // Resolve each question with computed answers
      const weekEnd = new Date(weekStart);
      weekEnd.setUTCDate(weekEnd.getUTCDate() + 7);

      // Get all group members' logs this week
      const weekLogs = await db
        .select({
          userId: deuceEntries.userId,
          loggedAt: deuceEntries.loggedAt,
        })
        .from(deuceEntries)
        .innerJoin(groupMembers, eq(groupMembers.userId, deuceEntries.userId))
        .where(
          and(
            eq(groupMembers.groupId, groupId),
            gte(deuceEntries.loggedAt, weekStart),
            lt(deuceEntries.loggedAt, weekEnd),
          ),
        );

      // Q0: who logged first
      const firstLog = weekLogs.sort((a, b) => a.loggedAt.getTime() - b.loggedAt.getTime())[0];
      const q0Answer = firstLog?.userId ?? null;

      // Q2: total logs
      const q2Answer = String(weekLogs.length);

      // Q4: most logs in a single day
      const logsByUserDay: Record<string, number> = {};
      for (const log of weekLogs) {
        const day = log.loggedAt.toISOString().slice(0, 10);
        const key = `${log.userId}|${day}`;
        logsByUserDay[key] = (logsByUserDay[key] ?? 0) + 1;
      }
      const q4Answer = String(Math.max(0, ...Object.values(logsByUserDay)));

      // Q1 (longest streak by Friday): approximate — user with most logs Mon–Fri
      const friday = new Date(weekStart);
      friday.setUTCDate(friday.getUTCDate() + 4);
      friday.setUTCHours(23, 59, 59, 999);
      const logsByUser: Record<string, number> = {};
      for (const log of weekLogs) {
        if (log.loggedAt <= friday) {
          logsByUser[log.userId] = (logsByUser[log.userId] ?? 0) + 1;
        }
      }
      const q1Answer =
        Object.entries(logsByUser).sort(([, a], [, b]) => b - a)[0]?.[0] ?? null;

      // Q3 answer is unknowable at resolution time — all Q3 predictions are refunded

      const correctAnswers: (string | null)[] = [q0Answer, q1Answer, q2Answer, null, q4Answer];

      // Get all predictions for this card
      const allPredictions = await db
        .select()
        .from(predictions)
        .where(eq(predictions.cardId, card.id));

      // Update each prediction
      for (const pred of allPredictions) {
        const correctAnswer = correctAnswers[pred.questionIndex];
        if (correctAnswer === null) {
          // Unresolvable (Q3) — refund wager
          await db
            .update(predictions)
            .set({ result: "correct", payout: pred.wager })
            .where(eq(predictions.id, pred.id));

          await db
            .update(squadPoopPoints)
            .set({
              balance: sql`${squadPoopPoints.balance} + ${pred.wager}`,
              lifetimeEarned: sql`${squadPoopPoints.lifetimeEarned} + ${pred.wager}`,
              updatedAt: new Date(),
            })
            .where(and(eq(squadPoopPoints.userId, pred.userId), eq(squadPoopPoints.groupId, groupId)));
        } else {
          // For numeric answers (Q2, Q4) we use closest-wins logic
          const isNumeric = pred.questionIndex === 2 || pred.questionIndex === 4;
          let isCorrect: boolean;

          if (isNumeric) {
            // Closest answer among all predictors wins
            const correctNum = parseFloat(correctAnswer);
            const predNum = parseFloat(pred.answer);
            isCorrect = !isNaN(predNum) && !isNaN(correctNum) && Math.abs(predNum - correctNum) <= 1;
          } else {
            isCorrect = pred.answer === correctAnswer;
          }

          const payout = isCorrect ? pred.wager * 2 : 0;
          await db
            .update(predictions)
            .set({ result: isCorrect ? "correct" : "wrong", payout })
            .where(eq(predictions.id, pred.id));

          if (isCorrect) {
            await db
              .update(squadPoopPoints)
              .set({
                balance: sql`${squadPoopPoints.balance} + ${payout}`,
                lifetimeEarned: sql`${squadPoopPoints.lifetimeEarned} + ${payout}`,
                updatedAt: new Date(),
              })
              .where(and(eq(squadPoopPoints.userId, pred.userId), eq(squadPoopPoints.groupId, groupId)));
          }
        }
      }

      // Mark card as resolved
      await db
        .update(predictionCards)
        .set({ status: "resolved" })
        .where(eq(predictionCards.id, card.id));

      res.json({ message: "Predictions resolved" });
    }),
  );

  // GET /api/groups/:groupId/predictions/spy — premium: see others' picks
  router.get(
    "/api/groups/:groupId/predictions/spy",
    isAuthenticated,
    requireGroupMember(),
    requiresPremiumFor("squad_spy"),
    asyncRoute<AuthReq>("spy on predictions", "Failed to load spy data", async (req, res) => {
      const { groupId } = req;

      const weekStart = getCurrentWeekStart();
      const [card] = await db
        .select()
        .from(predictionCards)
        .where(and(eq(predictionCards.groupId, groupId), eq(predictionCards.weekStart, weekStart)))
        .limit(1);

      if (!card) return res.json({ picks: [] });

      const allPicks = await db
        .select({
          userId: predictions.userId,
          questionIndex: predictions.questionIndex,
          answer: predictions.answer,
          wager: predictions.wager,
          username: users.username,
          firstName: users.firstName,
          lastName: users.lastName,
        })
        .from(predictions)
        .innerJoin(users, eq(users.id, predictions.userId))
        .where(eq(predictions.cardId, card.id));

      res.json({ picks: allPicks });
    }),
  );

  return router;
}
