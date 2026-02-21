import cron from "node-cron";
import { checkAllGroupStreaksAndNotify } from "./streakNotifications";

export function startCronJobs(): void {
  // Evening check — 8 PM UTC every day
  cron.schedule("0 20 * * *", async () => {
    console.log("[CRON] Running 8 PM streak check...");
    try {
      const summary = await checkAllGroupStreaksAndNotify();
      console.log("[CRON] 8 PM streak check done:", summary);
    } catch (err) {
      console.error("[CRON] 8 PM streak check failed:", err);
    }
  });

  // Midday check — noon UTC every day (early bird nudge)
  cron.schedule("0 12 * * *", async () => {
    console.log("[CRON] Running noon streak check...");
    try {
      const summary = await checkAllGroupStreaksAndNotify();
      console.log("[CRON] Noon streak check done:", summary);
    } catch (err) {
      console.error("[CRON] Noon streak check failed:", err);
    }
  });

  console.log("[CRON] Streak check jobs scheduled — noon & 8 PM UTC");
}
