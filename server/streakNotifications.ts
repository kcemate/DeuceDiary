import { storage } from "./storage";
import logger from "./lib/logger";
import { sendGroupPushNotification } from "./notifications";
import { getTodayUTC } from "./routes/helpers";

export interface StreakCheckSummary {
  groupsChecked: number;
  atRiskCount: number;
  notificationsSent: number;
}

/**
 * Check ALL groups with active streaks and generate alerts
 * for any group where the streak is at risk (missing members today).
 * Only alerts for streaks >= 3 (worth saving).
 */
export async function checkAllGroupStreaksAndNotify(): Promise<StreakCheckSummary> {
  const MIN_STREAK = 3;
  const today = getTodayUTC();

  const activeGroups = await storage.getAllGroupsWithActiveStreaks(MIN_STREAK);

  let atRiskCount = 0;
  let notificationsSent = 0;

  for (const group of activeGroups) {
    const memberStatuses = await storage.getMembersLogStatusToday(group.id, today);
    const missingRaw = memberStatuses.filter((m) => !m.hasLogged);

    if (missingRaw.length === 0) continue;

    // Filter out members who have premium + unused streak insurance (covered)
    // Fetch all subscriptions in parallel instead of sequentially
    const subscriptions = await Promise.all(
      missingRaw.map(m => storage.getUserSubscription(m.userId))
    );
    const now = new Date();
    const missing = missingRaw.filter((_, i) => {
      const sub = subscriptions[i];
      const hasCoverage =
        sub.subscription === "premium" &&
        sub.subscriptionExpiresAt &&
        new Date(sub.subscriptionExpiresAt) > now &&
        !sub.streakInsuranceUsed;
      return !hasCoverage;
    });

    if (missing.length === 0) continue;

    atRiskCount++;
    const missingNames = missing.map(
      (m) => m.username || m.firstName || m.userId,
    );

    logger.info(
      `[STREAK ALERT] Group: ${group.name}, Streak: ${group.currentStreak} days, Missing: ${missingNames.join(", ")}`,
    );

    // Build notification payload
    const firstMissing = missingNames[0];
    const payload = {
      title: "\uD83D\uDD25 Streak at risk!",
      body: `${group.name} \u2014 ${group.currentStreak}-day streak. ${firstMissing} hasn't logged yet.`,
    };

    logger.info(payload, "[STREAK NOTIFICATION]");

    // Send push notification to all group members
    try {
      const result = await sendGroupPushNotification(
        group.id,
        payload.title,
        payload.body,
        { type: "streak_at_risk", groupId: group.id },
      );
      logger.info(`[STREAK PUSH] Group ${group.name}: sent=${result.sent}, failed=${result.failed}`);
    } catch (pushErr) {
      logger.error({ err: pushErr, groupName: group.name }, "[STREAK PUSH] Failed");
    }

    // Persist alert to DB
    await storage.createStreakAlert({
      groupId: group.id,
      streakLength: group.currentStreak,
      missingMembers: JSON.stringify(missingNames),
      notified: true,
    });

    notificationsSent++;
  }

  const summary: StreakCheckSummary = {
    groupsChecked: activeGroups.length,
    atRiskCount,
    notificationsSent,
  };

  logger.info(summary, "[STREAK CHECK COMPLETE]");
  return summary;
}
