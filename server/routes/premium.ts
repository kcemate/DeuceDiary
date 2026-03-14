import { Router } from "express";
import { storage } from "../storage";
import { isAuthenticated } from "../replitAuth";
import { requiresPremiumFor } from "../premiumAuth";
import { getTodayUTC, getYesterdayUTC, subscriptionUpgradeSchema, referralApplySchema, getTitle } from "./helpers";
import { getTodayChallenge, todayChallengeDate } from "../challenges";
import { subscriptionCache } from "../lib/cache";

export function createPremiumRouter(): Router {
  const router = Router();

  // --- Referral routes ---

  router.get('/api/referral', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      res.json({
        code: user.referralCode,
        referralCount: user.referralCount ?? 0,
        referralLink: `https://deuce-diary-web-production.up.railway.app/join?ref=${user.referralCode}`,
      });
    } catch (error) {
      console.error('Error fetching referral info:', error);
      res.status(500).json({ message: 'Failed to fetch referral info' });
    }
  });

  router.post('/api/referral/apply', isAuthenticated, async (req: any, res) => {
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

      res.json({ ok: true, referrerUsername: referrer.username });
    } catch (error) {
      console.error('Error applying referral:', error);
      res.status(500).json({ message: 'Failed to apply referral' });
    }
  });

  router.get('/api/referral/stats', isAuthenticated, requiresPremiumFor('referral_stats'), async (req: any, res) => {
    try {
      const stats = await storage.getReferralStats(req.user.id);
      res.json(stats);
    } catch (error) {
      console.error('Error fetching referral stats:', error);
      res.status(500).json({ message: 'Failed to fetch referral stats' });
    }
  });

  // --- Referral dashboard routes ---

  router.get('/api/referrals/stats', isAuthenticated, async (req: any, res) => {
    try {
      const stats = await storage.getReferralDashboardStats(req.user.id);
      res.json(stats);
    } catch (error) {
      console.error('Error fetching referral dashboard stats:', error);
      res.status(500).json({ message: 'Failed to fetch referral stats' });
    }
  });

  router.get('/api/referrals/leaderboard', isAuthenticated, async (req: any, res) => {
    try {
      const leaderboard = await storage.getReferralLeaderboard();
      res.json(leaderboard);
    } catch (error) {
      console.error('Error fetching referral leaderboard:', error);
      res.status(500).json({ message: 'Failed to fetch referral leaderboard' });
    }
  });

  // --- Subscription routes ---

  router.get('/api/subscription', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;

      const cached = subscriptionCache.get(userId);
      if (cached) {
        res.setHeader('Cache-Control', 'private, max-age=60');
        return res.json(cached);
      }

      const sub = await storage.getUserSubscription(userId);
      const isPremium = sub.subscription === 'premium' && sub.subscriptionExpiresAt && new Date(sub.subscriptionExpiresAt) > new Date();
      const payload = {
        tier: isPremium ? 'premium' : 'free',
        expiresAt: sub.subscriptionExpiresAt,
        features: isPremium
          ? ['custom_themes', 'streak_insurance', 'gold_badge', 'priority_support', 'detailed_analytics']
          : [],
      };
      subscriptionCache.set(userId, payload);
      res.setHeader('Cache-Control', 'private, max-age=60');
      res.json(payload);
    } catch (error) {
      console.error("Error fetching subscription:", error);
      res.status(500).json({ message: "Failed to fetch subscription" });
    }
  });

  /** Shared streak insurance logic for both PUT and POST endpoints */
  async function handleStreakInsurance(userId: string): Promise<{ used: boolean; extended: boolean; message: string } | { status: 400; message: string }> {
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
    return { used: true, extended, message: extended ? "Streak preserved!" : "Insurance activated (no at-risk streaks found)" };
  }

  // Alias for streak insurance — PUT /api/user/streak-insurance matches frontend expectation
  router.put('/api/user/streak-insurance', isAuthenticated, requiresPremiumFor('streak_insurance'), async (req: any, res) => {
    try {
      const result = await handleStreakInsurance(req.user.id);
      if ('status' in result) return res.status(result.status).json({ message: result.message });
      res.json(result);
    } catch (error) {
      console.error("Error using streak insurance:", error);
      res.status(500).json({ message: "Failed to use streak insurance" });
    }
  });

  router.post('/api/subscription/streak-insurance', isAuthenticated, requiresPremiumFor('streak_insurance'), async (req: any, res) => {
    try {
      const result = await handleStreakInsurance(req.user.id);
      if ('status' in result) return res.status(result.status).json({ message: result.message });
      res.json(result);
    } catch (error) {
      console.error("Error using streak insurance:", error);
      res.status(500).json({ message: "Failed to use streak insurance" });
    }
  });

  // --- Premium analytics ---

  router.get('/api/analytics/me', isAuthenticated, requiresPremiumFor('analytics'), async (req: any, res) => {
    try {
      const analytics = await storage.getPremiumAnalytics(req.user.id);
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching premium analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  router.get('/api/analytics/most-deuces', isAuthenticated, requiresPremiumFor('analytics'), async (req: any, res) => {
    try {
      const userId = req.user.id;
      const deucesByDate = await storage.getUserDeucesByDate(userId);

      const topDay = deucesByDate.reduce((max, current) =>
        current.count > max.count ? current : max,
        { date: '', count: 0 }
      );

      res.json(topDay);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // Weekly Throne Report (premium)
  router.get('/api/users/:userId/weekly-report', isAuthenticated, requiresPremiumFor('analytics'), async (req: any, res) => {
    try {
      const targetUserId = req.params.userId === 'me' ? req.user.id : req.params.userId;
      const report = await storage.getWeeklyReport(targetUserId);
      res.json(report);
    } catch (error) {
      console.error("Error fetching weekly report:", error);
      res.status(500).json({ message: "Failed to fetch weekly report" });
    }
  });

  // Subscription upgrade (dev mode — no real payment)
  router.post('/api/subscription/upgrade', isAuthenticated, async (req: any, res) => {
    try {
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
      subscriptionCache.delete(userId);
      res.json(updatedUser);
    } catch (error) {
      console.error("Error upgrading subscription:", error);
      res.status(500).json({ message: "Failed to upgrade subscription" });
    }
  });

  // --- Daily Challenges (premium) ---
  router.get('/api/challenges/today', isAuthenticated, requiresPremiumFor('daily_challenges'), async (req: any, res) => {
    try {
      const userId = req.user.id;
      const challenge = getTodayChallenge();
      const challengeDate = todayChallengeDate();
      const completion = await storage.getDailyChallengeCompletion(userId, challengeDate);

      res.json({ challenge, date: challengeDate, completed: !!completion });
    } catch (error) {
      console.error('Error fetching daily challenge:', error);
      res.status(500).json({ message: 'Failed to fetch daily challenge' });
    }
  });

  router.post('/api/challenges/complete', isAuthenticated, requiresPremiumFor('daily_challenges'), async (req: any, res) => {
    try {
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
    } catch (error) {
      console.error('Error completing challenge:', error);
      res.status(500).json({ message: 'Failed to complete challenge' });
    }
  });

  return router;
}
