import { storage } from "./storage";

/** Get today's date as YYYY-MM-DD in UTC */
function getTodayUTC(): string {
  return new Date().toISOString().slice(0, 10);
}

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
    const missing = memberStatuses.filter((m) => !m.hasLogged);

    if (missing.length === 0) continue;

    atRiskCount++;
    const missingNames = missing.map(
      (m) => m.username || m.firstName || m.userId,
    );

    console.log(
      `[STREAK ALERT] Group: ${group.name}, Streak: ${group.currentStreak} days, Missing: ${missingNames.join(", ")}`,
    );

    // Build notification payload
    const firstMissing = missingNames[0];
    const payload = {
      title: "\uD83D\uDD25 Streak at risk!",
      body: `${group.name} \u2014 ${group.currentStreak}-day streak. ${firstMissing} hasn't logged yet.`,
    };

    console.log(`[STREAK NOTIFICATION]`, payload);

    // Persist alert to DB
    await storage.createStreakAlert({
      groupId: group.id,
      streakLength: group.currentStreak,
      missingMembers: JSON.stringify(missingNames),
      notified: false,
    });

    notificationsSent++;
  }

  const summary: StreakCheckSummary = {
    groupsChecked: activeGroups.length,
    atRiskCount,
    notificationsSent,
  };

  console.log(`[STREAK CHECK COMPLETE]`, summary);
  return summary;
}
