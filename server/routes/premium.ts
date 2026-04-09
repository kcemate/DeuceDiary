import { Router, Request, Response } from "express";
import logger from "../lib/logger";

type AuthReq = Request & { user: { id: string } };
import { storage } from "../storage";
import { isAuthenticated } from "../replitAuth";
import { requiresPremiumFor } from "../premiumAuth";
import {
  getTodayUTC, getYesterdayUTC, subscriptionUpgradeSchema, referralApplySchema, getTitle, asyncRoute,
} from "./helpers";
import { getTodayChallenge, todayChallengeDate } from "../challenges";

const wrap = (logMsg: string, resMsg: string, fn: (req: AuthReq, res: Response) => Promise<void>) =>
  asyncRoute<AuthReq>(logMsg, resMsg, fn);

export function createPremiumRouter(): Router {
  const router = Router();

  // --- Referral routes ---

  router.get('/api/referral',
    isAuthenticated,
    wrap('Error fetching referral info:', 'Failed to fetch referral info', async (req, res) => {
    const user = await storage.getUser(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      code: user.referralCode,
      referralCount: user.referralCount ?? 0,
      referralLink: `${process.env.APP_URL}/join?ref=${user.referralCode}`,
    });
  }));

  router.post('/api/referral/apply', isAuthenticated, async (req: AuthReq, res) => {
    try {
      const userId = req.user.id;
      const parsed = referralApplySchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: 'Referral code is required' });
      }
      const { code } = parsed.data;

      // Fetch referrer and current user in parallel
      const [referrer, currentUser] = await Promise.all([
        storage.getUserByReferralCode(code.toUpperCase()),
        storage.getUser(userId),
      ]);

      if (!referrer) {
        return res.status(400).json({ message: 'Invalid referral code' });
      }
      if (referrer.id === userId) {
        return res.status(400).json({ message: 'Cannot use your own referral code' });
      }
      if (currentUser?.referredBy) {
        return res.status(400).json({ message: 'You have already used a referral code' });
      }

      await storage.applyReferral(userId, referrer.id);

      // Auto-grant 1 month premium to referrer after reaching 3 referrals
      const updatedReferrer = await storage.getUser(referrer.id);
      if (updatedReferrer && (updatedReferrer.referralCount ?? 0) >= 3) {
        const isPremiumActive = updatedReferrer.subscription === 'premium' &&
          updatedReferrer.subscriptionExpiresAt &&
          new Date(updatedReferrer.subscriptionExpiresAt) > new Date();
        if (!isPremiumActive) {
          const expiresAt = new Date();
          expiresAt.setMonth(expiresAt.getMonth() + 1);
          await storage.updateUserSubscription(referrer.id, 'premium', expiresAt);
        }
      }

      res.json({ ok: true, referrerUsername: referrer.username });
    } catch (error) {
      // DB unique constraint fired — concurrent duplicate application
      if (error instanceof Error && error.message === 'REFERRAL_ALREADY_APPLIED') {
        return res.status(400).json({ message: 'You have already used a referral code' });
      }
      logger.error({ err: error }, 'Error applying referral');
      res.status(500).json({ message: 'Failed to apply referral' });
    }
  });

  router.get('/api/referral/stats',
    isAuthenticated, requiresPremiumFor('referral_stats'),
    wrap('Error fetching referral stats:', 'Failed to fetch referral stats', async (req, res) => {
    const stats = await storage.getReferralStats(req.user.id);
    res.json(stats);
  }));

  // --- Referral dashboard routes ---

  router.get('/api/referrals/stats',
    isAuthenticated,
    wrap('Error fetching referral dashboard stats:', 'Failed to fetch referral stats', async (req, res) => {
    const stats = await storage.getReferralDashboardStats(req.user.id);
    res.json(stats);
  }));

  router.get('/api/referrals/leaderboard',
    isAuthenticated,
    wrap('Error fetching referral leaderboard:', 'Failed to fetch referral leaderboard', async (req, res) => {
    const leaderboard = await storage.getReferralLeaderboard();
    res.json(leaderboard);
  }));

  // --- Subscription routes ---

  router.get('/api/subscription',
    isAuthenticated,
    wrap('Error fetching subscription:', 'Failed to fetch subscription', async (req, res) => {
    const sub = await storage.getUserSubscription(req.user.id);
    const isPremium = sub.subscription === 'premium'
      && sub.subscriptionExpiresAt
      && new Date(sub.subscriptionExpiresAt) > new Date();
    res.json({
      tier: isPremium ? 'premium' : 'free',
      expiresAt: sub.subscriptionExpiresAt,
      features: isPremium
        ? ['custom_themes', 'streak_insurance', 'gold_badge', 'priority_support', 'detailed_analytics']
        : [],
    });
  }));

  /** Shared streak insurance logic for both PUT and POST endpoints */
  async function handleStreakInsurance(
    userId: string,
  ): Promise<{ used: boolean; extended: boolean; message: string } | { status: 400; message: string }> {
    const sub = await storage.getUserSubscription(userId);
    if (sub.streakInsuranceUsed) {
      return { status: 400, message: "Streak insurance already used this month" };
    }
    const userGroups = await storage.getUserGroups(userId);
    const today = getTodayUTC();
    const yesterday = getYesterdayUTC();
    let extended = false;
    const groupIds = userGroups.map(g => g.id);
    const streaksMap = await storage.getGroupStreaksBatch(groupIds);
    const updatePromises: Promise<void>[] = [];
    for (const group of userGroups) {
      const streak = streaksMap.get(group.id) ?? { currentStreak: 0, longestStreak: 0, lastStreakDate: null };
      if (streak.lastStreakDate === yesterday && streak.currentStreak > 0) {
        updatePromises.push(storage.updateGroupStreak(group.id, streak.currentStreak, streak.longestStreak, today));
        extended = true;
      }
    }
    await Promise.all(updatePromises);
    await storage.useStreakInsurance(userId);
    const msg = extended ? "Streak preserved!" : "Insurance activated (no at-risk streaks found)";
    return { used: true, extended, message: msg };
  }

  const streakInsuranceHandler = wrap(
    'Error using streak insurance:',
    'Failed to use streak insurance',
    async (req, res) => {
    const result = await handleStreakInsurance(req.user.id);
    if ('status' in result) return res.status(result.status).json({ message: result.message });
    res.json(result);
  });

  // Alias for streak insurance — PUT /api/user/streak-insurance matches frontend expectation
  router.put('/api/user/streak-insurance',
    isAuthenticated, requiresPremiumFor('streak_insurance'), streakInsuranceHandler);
  router.post('/api/subscription/streak-insurance',
    isAuthenticated, requiresPremiumFor('streak_insurance'), streakInsuranceHandler);

  // --- Premium analytics ---

  router.get('/api/analytics/me',
    isAuthenticated, requiresPremiumFor('analytics'),
    wrap('Error fetching premium analytics:', 'Failed to fetch analytics', async (req, res) => {
    const analytics = await storage.getPremiumAnalytics(req.user.id);
    res.json(analytics);
  }));

  router.get('/api/analytics/most-deuces',
    isAuthenticated, requiresPremiumFor('analytics'),
    wrap('Error fetching analytics:', 'Failed to fetch analytics', async (req, res) => {
    const deucesByDate = await storage.getUserDeucesByDate(req.user.id);
    const topDay = deucesByDate.reduce((max, current) =>
      current.count > max.count ? current : max,
      { date: '', count: 0 }
    );
    res.json(topDay);
  }));

  // Weekly Throne Report (premium) — IDOR: users can only access their own report
  router.get('/api/users/:userId/weekly-report',
    isAuthenticated, requiresPremiumFor('analytics'),
    wrap('Error fetching weekly report:', 'Failed to fetch weekly report', async (req, res) => {
    const targetUserId = req.params.userId === 'me' ? req.user.id : req.params.userId;
    if (targetUserId !== req.user.id) {
      return res.status(403).json({ message: 'Cannot access another user\'s weekly report' });
    }
    const report = await storage.getWeeklyReport(targetUserId);
    res.json(report);
  }));

  // Subscription upgrade (dev mode — no real payment)
  // Disabled in production: Clerk Billing + RevenueCat handle real upgrades via webhooks
  if (process.env.NODE_ENV === 'production') {
    router.post('/api/subscription/upgrade', isAuthenticated, (_req, res) => {
      res.status(403).json({ message: 'Use in-app purchase to upgrade' });
    });
  } else {
  router.post('/api/subscription/upgrade',
    isAuthenticated,
    wrap('Error upgrading subscription:', 'Failed to upgrade subscription', async (req, res) => {
    const userId = req.user.id;
    const parsed = subscriptionUpgradeSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid plan. Must be 'monthly' or 'annual'" });
    }
    const { plan } = parsed.data;

    const expiresAt = new Date();
    if (plan === 'annual') {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    } else {
      expiresAt.setMonth(expiresAt.getMonth() + 1);
    }

    const updatedUser = await storage.updateUserSubscription(userId, 'premium', expiresAt);
    res.json(updatedUser);
  }));
  }

  // --- Daily Challenges (premium) ---
  router.get('/api/challenges/today',
    isAuthenticated, requiresPremiumFor('daily_challenges'),
    wrap('Error fetching daily challenge:', 'Failed to fetch daily challenge', async (req, res) => {
    const userId = req.user.id;
    const challenge = getTodayChallenge();
    const challengeDate = todayChallengeDate();
    const completion = await storage.getDailyChallengeCompletion(userId, challengeDate);
    res.json({ challenge, date: challengeDate, completed: !!completion });
  }));

  router.post('/api/challenges/complete',
    isAuthenticated, requiresPremiumFor('daily_challenges'),
    wrap('Error completing challenge:', 'Failed to complete challenge', async (req, res) => {
    const userId = req.user.id;
    const challengeDate = todayChallengeDate();

    const existing = await storage.getDailyChallengeCompletion(userId, challengeDate);
    if (existing) {
      return res.status(400).json({ message: 'Challenge already completed today' });
    }

    const completion = await storage.completeDailyChallenge({ userId, challengeDate });

    // Award +1 streak bonus (increment deuce count as bonus)
    await storage.updateUserDeuceCount(userId, 1);

    res.json({ completion, bonusAwarded: true });
  }));

  return router;
}
