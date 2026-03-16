import { Router, type Request, type Response } from "express";
import logger from "../lib/logger";
import { v4 as uuidv4 } from "uuid";
import { storage } from "../storage";
import { isAuthenticated } from "../replitAuth";
import { requiresPremiumFor } from "../premiumAuth";
import type { BingoSquare } from "@shared/schema";

// 25 challenge templates — shuffled each month per card
const BINGO_CHALLENGES: Omit<BingoSquare, 'id' | 'completed'>[] = [
  { title: 'Early Bird',        description: 'Log before 7am',                          condition_type: 'time_before',       condition_value: 7  },
  { title: 'Consistency King',  description: '5-day squad streak',                      condition_type: 'streak_days',       condition_value: 5  },
  { title: 'Throne Veteran',     description: 'Log 10 deuces this month',                 condition_type: 'monthly_logs',      condition_value: 10 },
  { title: 'Night Owl',         description: 'Log after 10pm',                          condition_type: 'time_after',        condition_value: 22 },
  { title: 'Marathon Session',  description: 'Maintain a 7-day squad streak',           condition_type: 'streak_days',       condition_value: 7  },
  { title: 'Location Scout',    description: 'Log from 3 different locations',          condition_type: 'unique_locations',  condition_value: 3  },
  { title: 'Speed Demon',       description: 'Log 3 quick notes (under 20 chars)',      condition_type: 'fast_log',          condition_value: 3  },
  { title: 'Double Flush',      description: 'Log twice in one day',                    condition_type: 'daily_count',       condition_value: 2  },
  { title: 'Weekend Warrior',   description: 'Log both Sat and Sun this month',         condition_type: 'weekend_both',      condition_value: 1  },
  { title: 'Group Legend',      description: 'Squad streak hits 10+',                  condition_type: 'group_streak_min',  condition_value: 10 },
  { title: 'Creature of Habit', description: 'Log at the same time (±1hr) 3 days in a row', condition_type: 'consistent_time', condition_value: 3  },
  { title: 'Early Riser',       description: 'Log before 6am',                         condition_type: 'time_before',       condition_value: 6  },
  { title: 'Hat Trick',         description: 'Log 3 times in one day',                 condition_type: 'daily_count',       condition_value: 3  },
  { title: 'Globetrotter',      description: 'Log from 5 different locations',         condition_type: 'unique_locations',  condition_value: 5  },
  { title: 'Monthly Loyal',     description: 'Log on 20 different days this month',    condition_type: 'monthly_days',      condition_value: 20 },
  { title: 'Midnight Flush',    description: 'Log after 11pm',                         condition_type: 'time_after',        condition_value: 23 },
  { title: 'Social Throne',     description: 'Receive 5 reactions on your entries',    condition_type: 'reactions_received',condition_value: 5  },
  { title: 'Triple Crown',      description: '3-day squad streak',                     condition_type: 'streak_days',       condition_value: 3  },
  { title: 'Throne Thoughts',    description: 'Write 5 logs with notes',                 condition_type: 'thoughts_count',    condition_value: 5  },
  { title: 'Wordsmith',         description: 'Write 3 thoughtful logs (100+ chars)',   condition_type: 'long_thoughts',     condition_value: 3  },
  { title: 'Full Week',         description: 'Log all 7 days of a single week',        condition_type: 'full_week',         condition_value: 1  },
  { title: 'Tuesday Throne',    description: 'Log on 3 different Tuesdays',            condition_type: 'weekday_logs',      condition_value: 3  },
  { title: 'Power Hour',        description: 'Log twice within 30 minutes',            condition_type: 'hourly_burst',      condition_value: 1  },
  { title: 'The Regular',       description: 'Visit the same location 5 times',        condition_type: 'repeated_location', condition_value: 5  },
  { title: 'Century Club',      description: 'Reach 50 all-time logs',                 condition_type: 'total_logs',        condition_value: 50 },
];

function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateSquares(): BingoSquare[] {
  return shuffleArray(BINGO_CHALLENGES).map((challenge, index) => ({
    ...challenge,
    id: index,
    completed: false,
  }));
}

type BingoRouteHandler = (userId: string, month: string, req: Request & { user: { id: string } }, res: Response) => Promise<void>;

function bingoHandler(label: string, handler: BingoRouteHandler) {
  return async (req: Request & { user: { id: string } }, res: Response) => {
    try {
      await handler(req.user.id, getCurrentMonth(), req, res);
    } catch (error) {
      logger.error(`Error ${label}:`, error);
      res.status(500).json({ message: `Failed to ${label}` });
    }
  };
}

export function createBingoRouter(): Router {
  const router = Router();

  // GET /api/bingo/current — get or create current month bingo card (premium only)
  router.get('/api/bingo/current', isAuthenticated, requiresPremiumFor('bingo'),
    bingoHandler('fetch bingo card', async (userId, month, _req, res) => {
      let card = await storage.getBingoCard(userId, month);

      // Regenerate cards that contain deprecated Bristol/photo squares
      if (card) {
        const squares = card.squares as BingoSquare[];
        const hasDeprecated = squares.some((sq: BingoSquare) =>
          sq.condition_type === 'photo_count' ||
          sq.condition_type === 'bristol_score' ||
          /bristol/i.test(sq.title || '') ||
          /bristol/i.test(sq.description || '') ||
          /photo/i.test(sq.title || '') ||
          /photo.*log/i.test(sq.description || '')
        );
        if (hasDeprecated) {
          await storage.deleteBingoCard(card.id);
          card = undefined;
        }
      }

      if (!card) {
        const userGroups = await storage.getUserGroups(userId);
        const primaryGroupId = userGroups.length > 0 ? userGroups[0].id : null;

        card = await storage.createBingoCard({
          id: uuidv4(),
          userId,
          groupId: primaryGroupId,
          month,
          squares: generateSquares(),
          completedSquares: [],
        });
      }

      const completedSquares = (card.completedSquares as number[]) || [];
      res.json({ card, month, ...buildBingoStats(completedSquares) });
    })
  );

  // POST /api/bingo/check — re-evaluate progress against actual DB data (premium only)
  router.post('/api/bingo/check', isAuthenticated, requiresPremiumFor('bingo'),
    bingoHandler('check bingo progress', async (userId, month, _req, res) => {
      const card = await storage.getBingoCard(userId, month);
      if (!card) {
        return res.status(404).json({ message: 'No bingo card found for this month. Visit /api/bingo/current first.' });
      }

      const { completedSquares } = await storage.checkAndUpdateBingoProgress(userId, month);
      res.json({
        completedSquares,
        ...buildBingoStats(completedSquares),
        newlyCompleted: completedSquares.length - ((card.completedSquares as number[])?.length ?? 0),
      });
    })
  );

  // GET /api/bingo/leaderboard — group bingo comparison (premium only)
  router.get('/api/bingo/leaderboard', isAuthenticated, requiresPremiumFor('bingo'),
    bingoHandler('fetch bingo leaderboard', async (userId, month, _req, res) => {
      const userGroups = await storage.getUserGroups(userId);
      const groupIds = userGroups.map(g => g.id);
      const leaderboard = await storage.getBingoLeaderboard(groupIds, month);
      res.json({ month, leaderboard });
    })
  );

  return router;
}

const BINGO_TOTAL = 25;

function buildBingoStats(completedSquares: number[]) {
  const completed = completedSquares.length;
  return {
    completedCount: completed,
    totalCount: BINGO_TOTAL,
    percentComplete: Math.round((completed / BINGO_TOTAL) * 100),
    hasBlackout: completed === BINGO_TOTAL,
    hasBingo: checkHasBingo(completedSquares),
  };
}

/** Returns true if completed squares form any bingo line (row, col, or diagonal) */
function checkHasBingo(completedSquares: number[]): boolean {
  const s = new Set(completedSquares);
  // Rows
  for (let r = 0; r < 5; r++) {
    if ([0,1,2,3,4].every(c => s.has(r * 5 + c))) return true;
  }
  // Columns
  for (let c = 0; c < 5; c++) {
    if ([0,1,2,3,4].every(r => s.has(r * 5 + c))) return true;
  }
  // Diagonals
  if ([0,6,12,18,24].every(i => s.has(i))) return true;
  if ([4,8,12,16,20].every(i => s.has(i))) return true;
  return false;
}
