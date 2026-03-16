import cron from "node-cron";
import { checkAllGroupStreaksAndNotify } from "./streakNotifications";
import { storage } from "./storage";
import logger from "./lib/logger";

export function startCronJobs(): void {
  // Evening check — 8 PM UTC every day
  cron.schedule("0 20 * * *", async () => {
    logger.info("[CRON] Running 8 PM streak check...");
    try {
      const summary = await checkAllGroupStreaksAndNotify();
      logger.info({ summary }, "[CRON] 8 PM streak check done");
    } catch (err) {
      logger.error({ err }, "[CRON] 8 PM streak check failed");
    }
  });

  // Midday check — noon UTC every day (early bird nudge)
  cron.schedule("0 12 * * *", async () => {
    logger.info("[CRON] Running noon streak check...");
    try {
      const summary = await checkAllGroupStreaksAndNotify();
      logger.info({ summary }, "[CRON] Noon streak check done");
    } catch (err) {
      logger.error({ err }, "[CRON] Noon streak check failed");
    }
  });

  // Monthly streak insurance reset — 1st of each month at midnight UTC
  cron.schedule("0 0 1 * *", async () => {
    logger.info("[CRON] Running monthly streak insurance reset...");
    try {
      const resetCount = await storage.resetAllStreakInsurance();
      logger.info(`[CRON] Monthly streak insurance reset done: ${resetCount} users reset`);
    } catch (err) {
      logger.error({ err }, "[CRON] Monthly streak insurance reset failed");
    }
  });

  logger.info("[CRON] Streak check jobs scheduled — noon & 8 PM UTC, insurance reset 1st of month");
}
