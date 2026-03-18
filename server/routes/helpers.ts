import { z, ZodSchema } from "zod";
import logger from "../lib/logger";
import { Response, Request } from "express";
import { db } from "../db";
import { groups, groupMembers, deuceEntries } from "@shared/schema";
import { eq, and, sql } from "drizzle-orm";
import { storage } from "../storage";

// --- Shared types ---
export type AuthReq = Request & { user: { id: string } };

// --- Route utilities ---

export function parseOrFail<T>(schema: ZodSchema<T>, body: unknown, res: Response, message: string): T | null {
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    res.status(400).json({ message });
    return null;
  }
  return parsed.data;
}

export function asyncRoute<T extends Request = Request>(
  label: string,
  failMsg: string,
  handler: (req: T, res: Response) => Promise<void>,
) {
  return async (req: Request, res: Response) => {
    try {
      await handler(req as T, res);
    } catch (error) {
      logger.error({ err: error }, `Error ${label}`);
      res.status(500).json({ message: failMsg });
    }
  };
}

// --- Public user projection ---

/**
 * Strip sensitive fields from a User object before including it in
 * API responses visible to other users (e.g. entries in a group feed).
 * Keeps only the fields needed for display purposes.
 */
export function sanitizeUserForResponse(user: Record<string, unknown>) {
  return {
    id: user.id,
    username: user.username ?? null,
    firstName: user.firstName ?? null,
    lastName: user.lastName ?? null,
    profileImageUrl: user.profileImageUrl ?? null,
    deuceCount: user.deuceCount ?? 0,
  };
}

// --- Shared sanitization helpers ---

/**
 * Strip null bytes and ASCII control characters (except tab/newline) from a string.
 * This prevents storage of characters that can cause issues in JSON, PDFs, and DB logs.
 */
export function stripControlChars(s: string): string {
  // Remove null bytes and non-printable ASCII control chars (0x00–0x08, 0x0B–0x0C, 0x0E–0x1F, 0x7F)
  // Preserve: 0x09 (tab), 0x0A (newline), 0x0D (carriage return)
  // eslint-disable-next-line no-control-regex
  return s.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
}

/** Trim whitespace then strip control chars */
function sanitizeLine(s: string): string {
  return stripControlChars(s.trim());
}

const sanitizeText = sanitizeLine;

// --- Constants ---
export const MAX_LOGS_PER_DAY = 10;
export const VALID_THEMES = ['default', 'dark', 'cream', 'midnight', 'ocean', 'retro'] as const;
export const MAX_PUSH_TOKENS_PER_USER = 10;

// --- Zod Validation Schemas ---
export const loginSchema = z.object({
  username: z.string().min(3).max(50),
  inviteCode: z.string().optional(),
});

/** Validate that a string is a recognised IANA timezone name. */
function isValidIANATimezone(tz: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

export const createGroupSchema = z.object({
  name: z.string().min(1).max(100).transform(sanitizeLine).refine(s => s.length >= 1, 'Group name cannot be blank'),
  description: z.string().max(500).transform(sanitizeText).optional(),
  timezone: z.string().max(64).refine(isValidIANATimezone, 'timezone must be a valid IANA timezone name').optional(),
});

export const createLocationSchema = z.object({
  name: z.string().min(1).max(100).transform(sanitizeLine).refine(s => s.length >= 1, 'Location name cannot be blank'),
});

export const createDeuceSchema = z.object({
  groupIds: z.array(z.string().uuid('Each groupId must be a valid UUID')).optional(),
  groupId: z.string().uuid('groupId must be a valid UUID').optional(),
  location: z.string().min(1).max(100).transform(sanitizeLine).refine(s => s.length >= 1, 'Location cannot be blank'),
  thoughts: z.string().max(500, "Thought must be 500 characters or less").transform(sanitizeText).optional(),
  loggedAt: z.union([
    z.string().refine(s => !isNaN(Date.parse(s)), { message: 'loggedAt must be a valid ISO 8601 date string' }),
    z.null(),
  ]).optional(),
  ghost: z.boolean().optional(),
  bristolScore: z.number().int().min(1).max(7).optional(),
  photoUrl: z.string().url().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

// Validates that a string consists only of emoji codepoints (Extended_Pictographic)
// plus common emoji modifier codepoints: ZWJ, variation selector, skin tones, keycap.
// Rejects ASCII text, HTML, and arbitrary Unicode that isn't emoji.
const EMOJI_RE = /^[\p{Extended_Pictographic}\u200D\uFE0F\u20E3\u{1F3FB}-\u{1F3FF}]+$/u;
const emojiField = z.string().min(1).max(10).refine(
  (s) => EMOJI_RE.test(s),
  { message: 'emoji must be a valid emoji character' },
);

export const reactionSchema = z.object({
  emoji: emojiField,
});

export const referralApplySchema = z.object({
  // Codes are 8 uppercase alphanumeric chars (base-36 toUpperCase).
  // Accept 4–20 to allow future code format changes, but reject obvious garbage.
  code: z.string().min(4).max(20).regex(/^[A-Z0-9]+$/i, 'Invalid referral code format'),
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
  theme: z.enum(VALID_THEMES),
});

export const broadcastSchema = z.object({
  milestone: z.string().min(1).max(200).transform(sanitizeLine).refine(s => s.length >= 1, 'Milestone cannot be blank'),
});

export const deleteReactionSchema = reactionSchema;

export const unregisterPushSchema = z.object({
  token: z.string().min(1).max(500),
});

// --- Path param schemas ---
// UUID v4 (used for groupId, entryId, etc.)
export const uuidParamSchema = z.object({
  id: z.string().uuid(),
});
// Flexible userId: Clerk IDs (user_xxx) or internal UUIDs — allow alphanumeric + _ - .
export const userIdParamSchema = z.object({
  userId: z.string().min(1).max(128).regex(/^[\w.\-]+$/, 'Invalid user ID'),
});
export const groupIdParamSchema = z.object({
  groupId: z.string().uuid('Invalid group ID'),
});
export const usernameParamSchema = z.object({
  username: z.string().min(1).max(50).regex(/^[\w\-]+$/, 'Invalid username'),
});

// --- Utility Functions ---

/** Check if a user has an active premium subscription */
type PremiumCheckUser = { subscription?: string | null; subscriptionExpiresAt?: string | Date | null } | null | undefined;
export function isPremiumUser(user: PremiumCheckUser): boolean {
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
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit',
    }).format(new Date());
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

/** Get yesterday's date as YYYY-MM-DD in the given IANA timezone (falls back to UTC) */
export function getYesterdayInZone(tz: string): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  try {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit',
    }).format(d);
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
  // Fallback for test environments where db.transaction is not available
  if (typeof (db as any).transaction !== 'function') {
    const today = getTodayUTC();
    const yesterday = getYesterdayUTC();
    const streak = await storage.getGroupStreak(groupId);

    // Idempotency: already counted today — skip
    if (streak.lastStreakDate === today) return;

    const memberStatuses = await storage.getMembersLogStatusToday(groupId, today);
    const allLoggedToday = memberStatuses.length > 0 && memberStatuses.every(m => m.hasLogged);

    if (!allLoggedToday) {
      // Reset streak if a day was missed (not today, not yesterday)
      if (streak.lastStreakDate && streak.lastStreakDate !== today && streak.lastStreakDate !== yesterday) {
        await storage.updateGroupStreak(groupId, 0, streak.longestStreak, streak.lastStreakDate);
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
    await storage.updateGroupStreak(groupId, newStreak, newLongest, today);
    return;
  }

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
export async function checkAndNotifyStreakRisk(
  groupId: string,
): Promise<{ atRisk: boolean; missingMembers: string[] }> {
  const today = getTodayUTC();
  const memberStatuses = await storage.getMembersLogStatusToday(groupId, today);
  const missing = memberStatuses.filter(m => !m.hasLogged);

  if (missing.length > 0) {
    const missingNames = missing.map(m => m.username || m.firstName || m.userId);
    logger.info(`[STREAK RISK] Group ${groupId}: ${missingNames.join(', ')} haven't logged today`);
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

/** Minimal HTML escaping for OG tags and user-generated content in HTML responses. */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
