import { z } from "zod";
import { db } from "../db";
import { groups, groupMembers, deuceEntries } from "@shared/schema";
import { eq, and, sql } from "drizzle-orm";
import { storage } from "../storage";

// --- Zod Validation Schemas ---
export const loginSchema = z.object({
  username: z.string().min(1).max(50),
  inviteCode: z.string().optional(),
});

export const createGroupSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
});

export const createLocationSchema = z.object({
  name: z.string().min(1).max(100),
});

export const createDeuceSchema = z.object({
  groupIds: z.array(z.string()).optional(),
  groupId: z.string().optional(),
  location: z.string().min(1).max(200),
  thoughts: z.string().optional(),
  loggedAt: z.union([z.string(), z.null()]).optional(),
  ghost: z.boolean().optional(),
});

export const reactionSchema = z.object({
  emoji: z.string().min(1).max(10),
});

export const referralApplySchema = z.object({
  code: z.string().min(1).max(20),
});

export const subscriptionUpgradeSchema = z.object({
  plan: z.enum(["monthly", "annual"]),
});

export const pushTokenSchema = z.object({
  token: z.string().min(1).max(500),
  platform: z.enum(["ios", "android"]),
});

export const reminderSchema = z.object({
  hour: z.number().int().min(0).max(23),
  minute: z.number().int().min(0).max(59),
});

export const themeSchema = z.object({
  theme: z.enum(["default", "dark", "cream", "midnight"]),
});

export const broadcastSchema = z.object({
  milestone: z.string().min(1).max(200),
});

export const deleteReactionSchema = z.object({
  emoji: z.string().min(1).max(10),
});

export const unregisterPushSchema = z.object({
  token: z.string().min(1).max(500),
});

// --- Constants ---
export const MAX_LOGS_PER_DAY = 10;
export const VALID_THEMES = ['default', 'dark', 'cream', 'midnight'] as const;
export const MAX_PUSH_TOKENS_PER_USER = 10;

// --- Utility Functions ---

/** Check if a user has an active premium subscription */
export function isPremiumUser(user: any): boolean {
  return (
    user?.subscription === "premium" &&
    user.subscriptionExpiresAt &&
    new Date(user.subscriptionExpiresAt) > new Date()
  );
}

/** Get today's date as YYYY-MM-DD in UTC */
export function getTodayUTC(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Get yesterday's date as YYYY-MM-DD in UTC */
export function getYesterdayUTC(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

/** Get today's date as YYYY-MM-DD in the given IANA timezone (falls back to UTC) */
export function getTodayInZone(tz: string): string {
  try {
    return new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

/** Get yesterday's date as YYYY-MM-DD in the given IANA timezone (falls back to UTC) */
export function getYesterdayInZone(tz: string): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  try {
    return new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
  } catch {
    d.setUTCDate(d.getUTCDate());
    return d.toISOString().slice(0, 10);
  }
}

/** Simple string hash for advisory lock keys */
export function hashCode(s: string): number {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = ((hash << 5) - hash + s.charCodeAt(i)) | 0;
  }
  return hash;
}

/**
 * After a deuce is logged, check if all group members have logged today.
 * If yes, advance the streak. If a day was missed, reset first.
 */
export async function recalculateStreak(groupId: string): Promise<void> {
  await db.transaction(async (tx) => {
    // Advisory lock on groupId hash — serializes streak updates per group
    const lockKey = Math.abs(hashCode(groupId));
    await tx.execute(sql`SELECT pg_advisory_xact_lock(${lockKey})`);

    // Read streak state + group timezone within the same transaction
    const [streak] = await tx
      .select({
        currentStreak: groups.currentStreak,
        longestStreak: groups.longestStreak,
        lastStreakDate: groups.lastStreakDate,
        timezone: groups.timezone,
      })
      .from(groups)
      .where(eq(groups.id, groupId));

    if (!streak) return;

    const tz = streak.timezone || 'UTC';
    const today = getTodayInZone(tz);
    const yesterday = getYesterdayInZone(tz);

    // Idempotency: already counted today — skip
    if (streak.lastStreakDate === today) return;

    // Check who has logged today within the same transaction (using group timezone)
    const members = await tx
      .select({ userId: groupMembers.userId })
      .from(groupMembers)
      .where(eq(groupMembers.groupId, groupId));

    const loggedToday = await tx
      .select({ userId: deuceEntries.userId })
      .from(deuceEntries)
      .where(
        and(
          eq(deuceEntries.groupId, groupId),
          sql`DATE(${deuceEntries.loggedAt} AT TIME ZONE ${tz}) = ${today}`
        )
      )
      .groupBy(deuceEntries.userId);

    const loggedUserIds = new Set(loggedToday.map(r => r.userId));
    const allLoggedToday = members.every(m => loggedUserIds.has(m.userId));

    if (!allLoggedToday) {
      // Not everyone has logged today yet — but check if streak needs resetting
      if (streak.lastStreakDate && streak.lastStreakDate !== today && streak.lastStreakDate !== yesterday) {
        await tx
          .update(groups)
          .set({ currentStreak: 0, updatedAt: new Date() })
          .where(eq(groups.id, groupId));
      }
      return;
    }

    // Everyone logged today — advance streak
    let newStreak: number;
    if (!streak.lastStreakDate || (streak.lastStreakDate !== yesterday && streak.lastStreakDate !== today)) {
      newStreak = 1;
    } else {
      newStreak = streak.currentStreak + 1;
    }

    const newLongest = Math.max(newStreak, streak.longestStreak);
    await tx
      .update(groups)
      .set({ currentStreak: newStreak, longestStreak: newLongest, lastStreakDate: today, updatedAt: new Date() })
      .where(eq(groups.id, groupId));
  });
}

/**
 * Check if a group's streak is at risk (any member hasn't logged today).
 */
export async function checkAndNotifyStreakRisk(groupId: string): Promise<{ atRisk: boolean; missingMembers: string[] }> {
  const today = getTodayUTC();
  const memberStatuses = await storage.getMembersLogStatusToday(groupId, today);
  const missing = memberStatuses.filter(m => !m.hasLogged);

  if (missing.length > 0) {
    const missingNames = missing.map(m => m.username || m.firstName || m.userId);
    console.log(`[STREAK RISK] Group ${groupId}: ${missingNames.join(', ')} haven't logged today`);
    return { atRisk: true, missingMembers: missingNames };
  }

  return { atRisk: false, missingMembers: [] };
}

/** Derive title from total log count. */
export function getTitle(totalLogs: number): string {
  if (totalLogs >= 500) return 'Legend';
  if (totalLogs >= 100) return 'Elite';
  if (totalLogs >= 50) return 'Veteran';
  if (totalLogs >= 10) return 'Regular';
  return 'Rookie';
}
