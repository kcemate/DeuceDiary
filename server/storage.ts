import {
  users,
  groups,
  groupMembers,
  deuceEntries,
  invites,
  locations,
  reactions,
  streakAlerts,
  broadcasts,
  dailyChallengeCompletions,
  referrals,
  type User,
  type UpsertUser,
  type Group,
  type InsertGroup,
  type GroupMember,
  type InsertGroupMember,
  type DeuceEntry,
  type InsertDeuceEntry,
  type Invite,
  type InsertInvite,
  type Location,
  type InsertLocation,
  type Reaction,
  type InsertReaction,
  type StreakAlert,
  type InsertStreakAlert,
  pushTokens,
  type PushToken,
  type InsertPushToken,
  type Broadcast,
  type InsertBroadcast,
  type DailyChallengeCompletion,
  type InsertDailyChallengeCompletion,
  type Referral,
  bingoCards,
  bingoCompletions,
  type BingoCard,
  type InsertBingoCard,
  type BingoSquare,
  passportStamps,
  type PassportStamp,
  deuceKings,
  challenges,
  challengeCompletions,
  type DeuceKing,
  type InsertDeuceKing,
  type Challenge,
  type InsertChallenge,
  type ChallengeCompletion,
  battleMatches,
  battleShips,
  battleAttacks,
  battleTokens,
  battlePowerups,
  battleBadges,
  type BattleMatch,
  type InsertBattleMatch,
  type BattleShip,
  type BattleAttack,
  type BattleToken,
  type BattlePowerup,
  type BattleBadge,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, count, sql, inArray, gte, gt, lt, lte, isNull } from "drizzle-orm";

/** Internal helper — today as YYYY-MM-DD in UTC */
function getTodayStorageUTC(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Evaluate a single bingo square condition against user data */
function evaluateBingoCondition(
  conditionType: string,
  conditionValue: number,
  entries: {
    loggedAt: Date; bristolScore: number | null; thoughts: string;
    photoUrl: string | null; location: string;
  }[],
  groups: { id: string; currentStreak: number }[],
  user: { deuceCount?: number | null } | undefined,
  reactionCounts: Map<string, number>,
): boolean {
  switch (conditionType) {
    case 'time_before':
      return entries.some(e => e.loggedAt.getUTCHours() < conditionValue);
    case 'time_after':
      return entries.some(e => e.loggedAt.getUTCHours() >= conditionValue);
    case 'streak_days':
      return groups.some(g => g.currentStreak >= conditionValue);
    case 'monthly_logs': {
      return entries.length >= conditionValue;
    }
    case 'unique_locations': {
      const locs = new Set(entries.map(e => e.location.toLowerCase().trim()));
      return locs.size >= conditionValue;
    }
    case 'fast_log': {
      // Interpret as: at least conditionValue logs with short thoughts (< 20 chars)
      const c = entries.filter(e => e.thoughts.trim().length < 20).length;
      return c >= conditionValue;
    }
    case 'daily_count': {
      const byDay = new Map<string, number>();
      for (const e of entries) {
        const day = e.loggedAt.toISOString().slice(0, 10);
        byDay.set(day, (byDay.get(day) || 0) + 1);
      }
      return Array.from(byDay.values()).some(c => c >= conditionValue);
    }
    case 'weekend_both': {
      const hasSat = entries.some(e => e.loggedAt.getUTCDay() === 6);
      const hasSun = entries.some(e => e.loggedAt.getUTCDay() === 0);
      return hasSat && hasSun;
    }
    case 'group_streak_min':
      return groups.some(g => g.currentStreak >= conditionValue);
    case 'consistent_time': {
      // Check if user logged at roughly the same hour for conditionValue consecutive days
      const sorted = [...entries].sort((a, b) => a.loggedAt.getTime() - b.loggedAt.getTime());
      let streak = 1;
      for (let i = 1; i < sorted.length; i++) {
        const prev = sorted[i - 1];
        const curr = sorted[i];
        const dayDiff = Math.round((curr.loggedAt.getTime() - prev.loggedAt.getTime()) / 86400000);
        const hourDiff = Math.abs(curr.loggedAt.getUTCHours() - prev.loggedAt.getUTCHours());
        if (dayDiff === 1 && hourDiff <= 1) {
          streak++;
          if (streak >= conditionValue) return true;
        } else {
          streak = 1;
        }
      }
      return false;
    }
    case 'monthly_days': {
      const days = new Set(entries.map(e => e.loggedAt.toISOString().slice(0, 10)));
      return days.size >= conditionValue;
    }
    case 'reactions_received': {
      const total = Array.from(reactionCounts.values()).reduce((a, b) => a + b, 0);
      return total >= conditionValue;
    }
    case 'photo_count':
    case 'thoughts_count': {
      const c = entries.filter(e => e.thoughts && e.thoughts.trim().length > 0).length;
      return c >= conditionValue;
    }
    case 'long_thoughts': {
      const c = entries.filter(e => e.thoughts.trim().length >= 100).length;
      return c >= conditionValue;
    }
    case 'full_week': {
      const daysByWeek = new Map<string, Set<number>>();
      for (const e of entries) {
        const d = e.loggedAt;
        const jan1 = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        const week = String(Math.ceil(((d.getTime() - jan1.getTime()) / 86400000 + jan1.getUTCDay() + 1) / 7));
        const year = String(d.getUTCFullYear());
        const key = `${year}-W${week}`;
        if (!daysByWeek.has(key)) daysByWeek.set(key, new Set());
        daysByWeek.get(key)!.add(d.getUTCDay());
      }
      return Array.from(daysByWeek.values()).some(days => days.size === 7);
    }
    case 'weekday_logs': {
      // Tuesday (2) logs on distinct days
      const tueDays = new Set(
        entries.filter(e => e.loggedAt.getUTCDay() === 2).map(e => e.loggedAt.toISOString().slice(0, 10))
      );
      return tueDays.size >= conditionValue;
    }
    case 'hourly_burst': {
      const sorted = [...entries].sort((a, b) => a.loggedAt.getTime() - b.loggedAt.getTime());
      for (let i = 0; i < sorted.length - 1; i++) {
        const diff = (sorted[i + 1].loggedAt.getTime() - sorted[i].loggedAt.getTime()) / (1000 * 60);
        if (diff <= 30) return true;
      }
      return false;
    }
    case 'repeated_location': {
      const locCounts = new Map<string, number>();
      for (const e of entries) {
        const loc = e.location.toLowerCase().trim();
        locCounts.set(loc, (locCounts.get(loc) || 0) + 1);
      }
      return Array.from(locCounts.values()).some(c => c >= conditionValue);
    }
    case 'total_logs':
      return (user?.deuceCount ?? 0) >= conditionValue;
    default:
      return false;
  }
}

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserDeuceCount(userId: string, increment: number): Promise<void>;
  updateUserUsername(userId: string, username: string): Promise<User>;
  updateUserProfilePicture(userId: string, profileImageUrl: string): Promise<User>;
  
  // Group operations
  createGroup(group: InsertGroup): Promise<Group>;
  getUserGroups(userId: string): Promise<(Group & { memberCount: number; entryCount: number; lastActivity?: Date })[]>;
  getGroupById(groupId: string): Promise<Group | undefined>;
  updateGroupAvatar(groupId: string, avatarUrl: string): Promise<Group>;
  addGroupMember(member: InsertGroupMember): Promise<GroupMember>;
  getGroupMembers(groupId: string): Promise<(GroupMember & {
    user: User & { personalRecord?: { date: string; count: number } };
  })[]>;
  isUserInGroup(userId: string, groupId: string): Promise<boolean>;
  isUserInGroups(userId: string, groupIds: string[]): Promise<Set<string>>;
  removeGroupMember(userId: string, groupId: string): Promise<void>;
  
  // Deuce entry operations
  createDeuceEntry(entry: InsertDeuceEntry): Promise<DeuceEntry>;
  getGroupEntries(groupId: string, limit?: number, offset?: number): Promise<(DeuceEntry & { user: User })[]>;
  getUserDeucesByDate(userId: string): Promise<{ date: string; count: number }[]>;
  getEntryById(entryId: string): Promise<DeuceEntry | undefined>;
  deleteDeuceEntry(entryId: string): Promise<void>;

  // Invite operations
  createInvite(invite: InsertInvite): Promise<Invite>;
  getInviteById(inviteId: string): Promise<Invite | undefined>;
  deleteInvite(inviteId: string): Promise<void>;
  cleanupExpiredInvites(): Promise<void>;
  deleteExpiredGroupInvites(groupId: string): Promise<void>;
  
  // Location operations
  getLocations(): Promise<Location[]>;
  getLocationsForUser(userId: string): Promise<Location[]>;
  createLocation(location: InsertLocation): Promise<Location>;
  getLocationByName(name: string, userId?: string): Promise<Location | undefined>;
  
  // Personal records
  getUserPersonalRecord(userId: string): Promise<{ date: string; count: number } | undefined>;
  
  // Reaction operations
  addReaction(reaction: InsertReaction): Promise<Reaction>;
  removeReaction(userId: string, entryId: string, emoji: string): Promise<void>;
  getEntryReactions(entryId: string): Promise<(Reaction & { user: User })[]>;

  // Feed operations
  getFeedEntries(
    groupIds: string[],
    limit: number,
    offset?: number,
  ): Promise<(DeuceEntry & {
    user: Pick<User, 'id' | 'username' | 'profileImageUrl'>;
    reactions: Reaction[];
  })[]>;

  // Streak operations
  getGroupStreak(groupId: string): Promise<{
    currentStreak: number; longestStreak: number; lastStreakDate: string | null;
  }>;
  getGroupStreaksBatch(groupIds: string[]): Promise<Map<string, {
    currentStreak: number; longestStreak: number; lastStreakDate: string | null;
  }>>;
  updateGroupStreak(
    groupId: string, currentStreak: number,
    longestStreak: number, lastStreakDate: string,
  ): Promise<void>;
  resetGroupStreak(groupId: string): Promise<void>;
  getMembersLogStatusToday(groupId: string, todayUTC: string): Promise<{
    userId: string; username: string | null; firstName: string | null;
    email: string | null; profileImageUrl: string | null;
    hasLogged: boolean;
  }[]>;

  // Streak alert operations
  getAllGroupsWithActiveStreaks(minStreak: number): Promise<Group[]>;
  createStreakAlert(alert: InsertStreakAlert): Promise<StreakAlert>;

  // Group preview (for invite landing — no auth needed)
  getGroupMemberCount(groupId: string): Promise<number>;
  getGroupDeuceCount(groupId: string): Promise<number>;
  getGroupPreview(groupId: string): Promise<{ name: string; memberCount: number; deuceCount: number } | undefined>;

  // Theme operations
  updateUserTheme(userId: string, theme: string): Promise<User>;

  // Subscription operations
  updateUserSubscription(userId: string, subscription: string, expiresAt: Date): Promise<User>;
  getUserSubscription(userId: string): Promise<{
    subscription: string; subscriptionExpiresAt: Date | null;
    streakInsuranceUsed: boolean;
  }>;
  useStreakInsurance(userId: string): Promise<void>;
  resetStreakInsurance(userId: string): Promise<void>;
  resetAllStreakInsurance(): Promise<number>;

  // Push token operations
  upsertPushToken(token: InsertPushToken): Promise<PushToken>;
  getUserPushTokens(userId: string): Promise<PushToken[]>;
  countUserPushTokens(userId: string): Promise<number>;
  deletePushToken(userId: string, token: string): Promise<void>;
  getGroupPushTokens(groupId: string): Promise<PushToken[]>;

  // Broadcast operations
  createBroadcast(broadcast: InsertBroadcast): Promise<Broadcast>;

  // Daily challenge operations
  getDailyChallengeCompletion(userId: string, challengeDate: string): Promise<DailyChallengeCompletion | undefined>;
  completeDailyChallenge(completion: InsertDailyChallengeCompletion): Promise<DailyChallengeCompletion>;

  // Reminder operations
  updateUserReminder(userId: string, hour: number, minute: number): Promise<User>;

  // Legacy wall
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserLongestStreak(userId: string): Promise<number>;
  getUserBestDay(userId: string): Promise<{ date: string; count: number } | undefined>;

  // Premium analytics
  getPremiumAnalytics(userId: string): Promise<{
    totalDeuces: number;
    avgPerWeek: number;
    longestStreak: number;
    currentStreak: number;
    bestDay: { day: string; count: number };
    groupRankings: { groupId: string; groupName: string; rank: number; total: number }[];
    avgBristolScore: number | null;
    mostUsedLocation: string | null;
  }>;

  // Weekly report
  getWeeklyReport(userId: string): Promise<{
    totalDeuces: number;
    peakDay: { date: string; count: number };
    mostActiveSquad: { name: string; count: number };
    longestStreak: number;
    funniestEntry: { thought: string; reactions: number } | null;
    totalReactionsReceived: number;
    weekOf: string;
    dailyCounts: { date: string; count: number }[];
  }>;

  // Weekly Throne Report — group-level weekly summary
  getGroupWeeklyReport(groupId: string): Promise<{
    groupId: string;
    groupName: string;
    weekOf: string;
    weekEnding: string;
    groupStats: {
      currentStreak: number;
      longestStreak: number;
      totalDeucesThisWeek: number;
    };
    members: Array<{
      userId: string;
      username: string | null;
      profileImageUrl: string | null;
      deucesThisWeek: number;
      streakStatus: 'active' | 'at_risk' | 'inactive';
    }>;
    mvp: {
      userId: string;
      username: string | null;
      profileImageUrl: string | null;
      deuceCount: number;
    } | null;
    funnyStats: {
      longestGap: { userId: string; username: string | null; gapDays: number } | null;
      mostReactionsReceived: { userId: string; username: string | null; reactionCount: number } | null;
      funniestEntry: { userId: string; username: string | null; thought: string; reactions: number } | null;
    };
  }>;

  // Group preview (rich) — for invite OG/landing pages
  getGroupInvitePreview(inviteCode: string): Promise<{
    name: string;
    description: string | null;
    memberCount: number;
    memberNames: string[];
    deuceCount: number;
    currentStreak: number;
    longestStreak: number;
  } | null>;

  // Badges — tiered badge catalog for a user
  getUserBadges(userId: string): Promise<Array<{
    id: string;
    name: string;
    description: string;
    emoji: string;
    tier: 'free' | 'premium';
    unlocked: boolean;
    unlockedAt?: Date | null;
  }>>;

  // Squad spy mode — modal log hour per member
  getGroupMemberTypicalHours(groupId: string): Promise<{ username: string; typicalHour: number | null }[]>;

  // Referral operations
  getUserByReferralCode(code: string): Promise<User | undefined>;
  applyReferral(refereeId: string, referrerId: string): Promise<Referral>;
  getReferralStats(userId: string): Promise<{
    referralCount: number;
    referrals: { username: string | null; joinedAt: Date | null }[];
  }>;

  // Referral dashboard
  getReferralDashboardStats(userId: string): Promise<{
    totalReferrals: number; premiumConversions: number;
    pendingConversions: number;
  }>;
  getReferralLeaderboard(): Promise<{
    username: string | null; profileImageUrl: string | null;
    referralCount: number; premiumConversionCount: number;
  }[]>;

  // User lifecycle
  softDeleteUser(userId: string): Promise<void>;

  // Share card
  getShareCardData(userId: string): Promise<{
    username: string | null;
    currentStreak: number;
    longestStreak: number;
    totalLogs: number;
    memberSince: Date | null;
    squadCount: number;
  }>;

  // Daily log count (for rate limiting)
  getUserDailyLogCount(userId: string, dateUTC: string): Promise<number>;

  // Admin stats
  getAdminStats(): Promise<{
    totalUsers: number;
    premiumUsers: number;
    dauToday: number;
    totalLogsToday: number;
    totalLogsAllTime: number;
    activeGroups: number;
    avgStreakLength: number;
  }>;

  // Group leaderboard
  getGroupLeaderboard(groupId: string): Promise<{
    userId: string;
    username: string | null;
    profileImageUrl: string | null;
    weekly: { totalDeuces: number; reactionsReceived: number };
    monthly: { totalDeuces: number; reactionsReceived: number };
    allTime: { totalDeuces: number; reactionsReceived: number; currentStreak: number };
    isMvp: boolean;
  }[]>;

  // Battle Shits operations
  createBattleMatch(match: InsertBattleMatch): Promise<BattleMatch>;
  getBattleMatch(matchId: string): Promise<BattleMatch | null>;
  getUserActiveMatches(userId: string): Promise<BattleMatch[]>;
  getGroupMatches(groupId: string, limit: number): Promise<BattleMatch[]>;
  updateBattleMatchStatus(matchId: string, status: string, winnerId?: string): Promise<void>;

  placeShips(matchId: string, userId: string, ships: { shipType: string; cells: { col: number; row: number }[] }[]): Promise<void>;
  getShips(matchId: string, userId: string): Promise<BattleShip[]>;

  createAttack(matchId: string, attackerId: string, col: number, row: number, isHit: boolean): Promise<BattleAttack>;
  getAttacks(matchId: string): Promise<BattleAttack[]>;
  getAttacksByUser(matchId: string, userId: string): Promise<BattleAttack[]>;
  markShipSunk(shipId: number): Promise<void>;

  createBattleToken(matchId: string, userId: string, deuceEntryId: string, tokenType: string): Promise<void>;
  getTokenBalance(matchId: string, userId: string): Promise<{ earned: number; spent: number }>;

  earnPowerup(matchId: string, userId: string, type: string): Promise<void>;
  usePowerup(matchId: string, userId: string, type: string, revealedCell?: { col: number; row: number }): Promise<void>;
  getPowerups(matchId: string, userId: string): Promise<BattlePowerup[]>;

  awardBadge(userId: string, badgeType: string, matchId?: string, expiresAt?: Date): Promise<void>;
  getUserBattleBadges(userId: string): Promise<BattleBadge[]>;
  getBattleLeaderboard(groupId: string, seasonStart: Date): Promise<{ userId: string; username: string | null; profileImageUrl: string | null; wins: number }[]>;
  getBattleStats(userId: string): Promise<{ wins: number; losses: number; totalMatches: number; hitRate: number; tokensEarned: number }>;

  // Bingo operations
  getBingoCard(userId: string, month: string): Promise<BingoCard | undefined>;
  deleteBingoCard(cardId: string): Promise<void>;
  createBingoCard(data: InsertBingoCard): Promise<BingoCard>;
  updateBingoProgress(cardId: string, completedSquares: number[]): Promise<BingoCard>;
  checkAndUpdateBingoProgress(
    userId: string, month: string,
  ): Promise<{ completedSquares: number[]; hasBlackout: boolean }>;
  getBingoLeaderboard(
    groupIds: string[], month: string,
  ): Promise<{
    userId: string; username: string | null;
    profileImageUrl: string | null; completedCount: number;
  }[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(and(eq(users.id, id), isNull(users.deletedAt)));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();

    // Generate referral code if missing
    if (!user.referralCode) {
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();
      const [updated] = await db
        .update(users)
        .set({ referralCode: code })
        .where(eq(users.id, user.id))
        .returning();
      return updated;
    }

    return user;
  }

  async updateUserDeuceCount(userId: string, increment: number): Promise<void> {
    await db
      .update(users)
      .set({ 
        deuceCount: sql`${users.deuceCount} + ${increment}`,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));
  }

  async updateUserUsername(userId: string, username: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        username,
        updatedAt: new Date()
      })
      .where(and(eq(users.id, userId), isNull(users.deletedAt)))
      .returning();
    return user;
  }

  async updateUserProfilePicture(userId: string, profileImageUrl: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        profileImageUrl,
        updatedAt: new Date()
      })
      .where(and(eq(users.id, userId), isNull(users.deletedAt)))
      .returning();
    return user;
  }

  // Group operations
  async createGroup(group: InsertGroup): Promise<Group> {
    // Use transaction to ensure group + creator membership are created atomically
    return await db.transaction(async (tx) => {
      const [newGroup] = await tx.insert(groups).values(group).returning();

      // Add creator as admin
      await tx.insert(groupMembers).values({
        groupId: newGroup.id,
        userId: group.createdBy,
        role: "admin",
      });

      return newGroup;
    });
  }

  async updateGroupAvatar(groupId: string, avatarUrl: string): Promise<Group> {
    const [group] = await db
      .update(groups)
      .set({ avatarUrl, updatedAt: new Date() })
      .where(eq(groups.id, groupId))
      .returning();
    return group;
  }

  async getUserGroups(
    userId: string,
  ): Promise<(Group & { memberCount: number; entryCount: number; lastActivity?: Date })[]> {
    // Get all groups the user is a member of
    const userGroupMemberships = await db
      .select({ groupId: groupMembers.groupId })
      .from(groupMembers)
      .where(eq(groupMembers.userId, userId));

    if (userGroupMemberships.length === 0) {
      return [];
    }

    const groupIds = userGroupMemberships.map(m => m.groupId);

    // Get group details with counts in a single query
    const userGroups = await db
      .select({
        group: groups,
        memberCount: sql<number>`COUNT(DISTINCT ${groupMembers.id})`,
        entryCount: sql<number>`COUNT(DISTINCT ${deuceEntries.id})`,
        lastActivity: sql<Date>`MAX(${deuceEntries.loggedAt})`,
      })
      .from(groups)
      .leftJoin(groupMembers, eq(groups.id, groupMembers.groupId))
      .leftJoin(deuceEntries, eq(groups.id, deuceEntries.groupId))
      .where(inArray(groups.id, groupIds))
      .groupBy(groups.id)
      .orderBy(desc(sql`MAX(${deuceEntries.loggedAt})`));

    return userGroups.map(row => ({
      ...row.group,
      memberCount: Number(row.memberCount),
      entryCount: Number(row.entryCount),
      lastActivity: row.lastActivity,
    }));
  }

  async getGroupById(groupId: string): Promise<Group | undefined> {
    const [group] = await db.select().from(groups).where(eq(groups.id, groupId));
    return group;
  }

  async addGroupMember(member: InsertGroupMember): Promise<GroupMember> {
    const [newMember] = await db.insert(groupMembers).values(member).returning();
    return newMember;
  }

  async getGroupMembers(groupId: string): Promise<(GroupMember & {
    user: User & { personalRecord?: { date: string; count: number } };
  })[]> {
    // Single JOIN query: group_members + users (filtered to non-deleted)
    const rows = await db
      .select({
        member: groupMembers,
        user: users,
      })
      .from(groupMembers)
      .innerJoin(users, eq(groupMembers.userId, users.id))
      .where(and(eq(groupMembers.groupId, groupId), isNull(users.deletedAt)))
      .orderBy(desc(groupMembers.joinedAt));

    if (rows.length === 0) return [];

    // Batch personal records — DISTINCT ON returns only the best day per user,
    // avoiding a full-scan result set that the app then has to filter down
    const userIds = rows.map((r) => r.member.userId);
    const prRows = await db.execute<{ userId: string; date: string; count: number }>(sql`
      SELECT DISTINCT ON (user_id)
        user_id   AS "userId",
        DATE(logged_at AT TIME ZONE 'UTC') AS date,
        COUNT(*)::int AS count
      FROM deuce_entries
      WHERE user_id IN (${sql.join(userIds.map(id => sql`${id}`), sql`, `)})
      GROUP BY user_id, DATE(logged_at AT TIME ZONE 'UTC')
      ORDER BY user_id, count DESC
    `);
    const personalRecordMap = new Map<string, { date: string; count: number }>();
    for (const r of prRows.rows) {
      personalRecordMap.set(r.userId, { date: r.date, count: r.count });
    }

    return rows.map((row) => ({
      ...row.member,
      user: {
        ...row.user,
        personalRecord: personalRecordMap.get(row.member.userId),
      },
    }));
  }

  async isUserInGroup(userId: string, groupId: string): Promise<boolean> {
    const [member] = await db
      .select()
      .from(groupMembers)
      .where(and(eq(groupMembers.userId, userId), eq(groupMembers.groupId, groupId)));
    return !!member;
  }

  async isUserInGroups(userId: string, groupIds: string[]): Promise<Set<string>> {
    if (groupIds.length === 0) return new Set();
    const rows = await db
      .select({ groupId: groupMembers.groupId })
      .from(groupMembers)
      .where(and(eq(groupMembers.userId, userId), inArray(groupMembers.groupId, groupIds)));
    return new Set(rows.map(r => r.groupId));
  }

  async removeGroupMember(userId: string, groupId: string): Promise<void> {
    await db
      .delete(groupMembers)
      .where(and(eq(groupMembers.userId, userId), eq(groupMembers.groupId, groupId)));
  }

  // Deuce entry operations
  async createDeuceEntry(entry: InsertDeuceEntry): Promise<DeuceEntry> {
    const [newEntry] = await db.insert(deuceEntries).values(entry).returning();
    return newEntry;
  }

  async getGroupEntries(groupId: string, limit = 50, offset = 0): Promise<(DeuceEntry & { user: User })[]> {
    const entries = await db
      .select({
        entry: deuceEntries,
        user: users,
      })
      .from(deuceEntries)
      .innerJoin(users, eq(deuceEntries.userId, users.id))
      .where(and(eq(deuceEntries.groupId, groupId), isNull(users.deletedAt)))
      .orderBy(desc(deuceEntries.loggedAt))
      .limit(limit)
      .offset(offset);

    return entries.map(row => ({
      ...row.entry,
      user: row.user,
    }));
  }

  async getUserDeucesByDate(userId: string): Promise<{ date: string; count: number }[]> {
    // Use loggedAt (user-provided timestamp) not createdAt — consistent with getUserBestDay
    const result = await db
      .select({
        date: sql<string>`DATE(${deuceEntries.loggedAt} AT TIME ZONE 'UTC')`,
        count: count(deuceEntries.id),
      })
      .from(deuceEntries)
      .where(eq(deuceEntries.userId, userId))
      .groupBy(sql`DATE(${deuceEntries.loggedAt} AT TIME ZONE 'UTC')`)
      .orderBy(desc(sql`DATE(${deuceEntries.loggedAt} AT TIME ZONE 'UTC')`));

    return result;
  }

  async getEntryById(entryId: string): Promise<DeuceEntry | undefined> {
    const [entry] = await db.select().from(deuceEntries).where(eq(deuceEntries.id, entryId));
    return entry;
  }

  async deleteDeuceEntry(entryId: string): Promise<void> {
    await db.delete(deuceEntries).where(eq(deuceEntries.id, entryId));
  }

  // Invite operations
  async createInvite(invite: InsertInvite): Promise<Invite> {
    const [newInvite] = await db.insert(invites).values(invite).returning();
    return newInvite;
  }

  async getInviteById(inviteId: string): Promise<Invite | undefined> {
    const [invite] = await db.select().from(invites).where(eq(invites.id, inviteId));
    return invite;
  }

  async deleteInvite(inviteId: string): Promise<void> {
    await db.delete(invites).where(eq(invites.id, inviteId));
  }

  async cleanupExpiredInvites(): Promise<void> {
    await db.delete(invites).where(sql`${invites.expiresAt} < NOW()`);
  }

  async deleteExpiredGroupInvites(groupId: string): Promise<void> {
    // Purge expired invites for this group so they don't accumulate indefinitely
    await db
      .delete(invites)
      .where(and(eq(invites.groupId, groupId), sql`${invites.expiresAt} < NOW()`));
  }

  // Group preview helpers
  async getGroupMemberCount(groupId: string): Promise<number> {
    const [result] = await db
      .select({ count: count() })
      .from(groupMembers)
      .where(eq(groupMembers.groupId, groupId));
    return Number(result?.count ?? 0);
  }

  async getGroupDeuceCount(groupId: string): Promise<number> {
    const [result] = await db
      .select({ count: count() })
      .from(deuceEntries)
      .where(eq(deuceEntries.groupId, groupId));
    return Number(result?.count ?? 0);
  }

  async getGroupPreview(
    groupId: string,
  ): Promise<{ name: string; memberCount: number; deuceCount: number } | undefined> {
    const rows = await db.execute(sql`
      SELECT
        g.name,
        (SELECT COUNT(*)::int FROM group_members WHERE group_id = ${groupId}) AS "memberCount",
        (SELECT COUNT(*)::int FROM deuce_entries WHERE group_id = ${groupId}) AS "deuceCount"
      FROM groups g
      WHERE g.id = ${groupId}
    `);
    const row = rows.rows[0] as { name: string; memberCount: number; deuceCount: number } | undefined;
    return row;
  }

  // Location operations
  async getLocations(): Promise<Location[]> {
    return await db.select().from(locations).orderBy(locations.isDefault, locations.name);
  }

  async getLocationsForUser(userId: string): Promise<Location[]> {
    return await db.select().from(locations)
      .where(or(eq(locations.isDefault, true), eq(locations.createdBy, userId)))
      .orderBy(locations.isDefault, locations.name);
  }

  async createLocation(location: InsertLocation): Promise<Location> {
    const [newLocation] = await db.insert(locations).values(location).returning();
    return newLocation;
  }

  async getLocationByName(name: string, userId?: string): Promise<Location | undefined> {
    const conditions = [eq(locations.name, name)];
    if (userId) {
      conditions.push(eq(locations.createdBy, userId));
    }
    const [location] = await db.select().from(locations).where(and(...conditions));
    return location;
  }

  // Personal records
  async getUserPersonalRecord(userId: string): Promise<{ date: string; count: number } | undefined> {
    const result = await db
      .select({
        date: sql<string>`DATE(${deuceEntries.loggedAt} AT TIME ZONE 'UTC')`,
        count: sql<number>`COUNT(*)::int`,
      })
      .from(deuceEntries)
      .where(eq(deuceEntries.userId, userId))
      .groupBy(sql`DATE(${deuceEntries.loggedAt} AT TIME ZONE 'UTC')`)
      .orderBy(desc(sql<number>`COUNT(*)::int`))
      .limit(1);

    return result.length > 0 ? result[0] : undefined;
  }

  // Reaction operations
  async addReaction(reaction: InsertReaction): Promise<Reaction> {
    const [newReaction] = await db
      .insert(reactions)
      .values(reaction)
      .returning();
    return newReaction;
  }

  async removeReaction(userId: string, entryId: string, emoji: string): Promise<void> {
    await db
      .delete(reactions)
      .where(
        and(
          eq(reactions.userId, userId),
          eq(reactions.entryId, entryId),
          eq(reactions.emoji, emoji)
        )
      );
  }

  async getEntryReactions(entryId: string): Promise<(Reaction & { user: User })[]> {
    // Use innerJoin — reactions from deleted users are excluded via isNull(users.deletedAt),
    // which is equivalent to an inner join and removes the unsafe non-null assertion
    const entryReactions = await db
      .select()
      .from(reactions)
      .innerJoin(users, and(eq(reactions.userId, users.id), isNull(users.deletedAt)))
      .where(eq(reactions.entryId, entryId))
      .orderBy(reactions.createdAt);

    return entryReactions.map(row => ({
      ...row.reactions,
      user: row.users,
    }));
  }

  // Feed operations
  async getFeedEntries(
    groupIds: string[], limit: number, offset = 0,
  ): Promise<(DeuceEntry & {
    user: Pick<User, 'id' | 'username' | 'profileImageUrl'>;
    reactions: Reaction[];
  })[]> {
    if (groupIds.length === 0) return [];

    const entries = await db
      .select({
        entry: deuceEntries,
        user: {
          id: users.id,
          username: users.username,
          profileImageUrl: users.profileImageUrl,
        },
      })
      .from(deuceEntries)
      .innerJoin(users, eq(deuceEntries.userId, users.id))
      .where(and(inArray(deuceEntries.groupId, groupIds), isNull(users.deletedAt)))
      .orderBy(desc(deuceEntries.loggedAt))
      .limit(limit)
      .offset(offset);

    // Batch-fetch reactions for all returned entries
    const entryIds = entries.map(r => r.entry.id);
    const allReactions = entryIds.length > 0
      ? await db.select().from(reactions).where(inArray(reactions.entryId, entryIds))
      : [];

    const reactionsByEntry = new Map<string, Reaction[]>();
    for (const r of allReactions) {
      const arr = reactionsByEntry.get(r.entryId) ?? [];
      arr.push(r);
      reactionsByEntry.set(r.entryId, arr);
    }

    return entries.map(row => ({
      ...row.entry,
      user: row.user,
      reactions: reactionsByEntry.get(row.entry.id) ?? [],
    }));
  }

  // Streak operations
  async getGroupStreak(groupId: string): Promise<{
    currentStreak: number; longestStreak: number;
    lastStreakDate: string | null;
  }> {
    const [group] = await db
      .select({
        currentStreak: groups.currentStreak,
        longestStreak: groups.longestStreak,
        lastStreakDate: groups.lastStreakDate,
      })
      .from(groups)
      .where(eq(groups.id, groupId));
    return group ?? { currentStreak: 0, longestStreak: 0, lastStreakDate: null };
  }

  async getGroupStreaksBatch(
    groupIds: string[],
  ): Promise<Map<string, {
    currentStreak: number; longestStreak: number;
    lastStreakDate: string | null;
  }>> {
    const result = new Map<string, { currentStreak: number; longestStreak: number; lastStreakDate: string | null }>();
    if (groupIds.length === 0) return result;
    const rows = await db
      .select({
        id: groups.id,
        currentStreak: groups.currentStreak,
        longestStreak: groups.longestStreak,
        lastStreakDate: groups.lastStreakDate,
      })
      .from(groups)
      .where(inArray(groups.id, groupIds));
    for (const row of rows) {
      result.set(row.id, {
        currentStreak: row.currentStreak,
        longestStreak: row.longestStreak,
        lastStreakDate: row.lastStreakDate,
      });
    }
    return result;
  }

  async updateGroupStreak(
    groupId: string, currentStreak: number,
    longestStreak: number, lastStreakDate: string,
  ): Promise<void> {
    await db
      .update(groups)
      .set({ currentStreak, longestStreak, lastStreakDate, updatedAt: new Date() })
      .where(eq(groups.id, groupId));
  }

  async resetGroupStreak(groupId: string): Promise<void> {
    // Persist a stale-streak reset: sets currentStreak to 0 without touching longestStreak
    await db
      .update(groups)
      .set({ currentStreak: 0, updatedAt: new Date() })
      .where(eq(groups.id, groupId));
  }

  async getMembersLogStatusToday(
    groupId: string, todayUTC: string,
  ): Promise<{
    userId: string; username: string | null; firstName: string | null;
    email: string | null; profileImageUrl: string | null;
    hasLogged: boolean;
  }[]> {
    // Get all members of the group
    const members = await db
      .select({
        userId: groupMembers.userId,
        username: users.username,
        firstName: users.firstName,
        email: users.email,
        profileImageUrl: users.profileImageUrl,
      })
      .from(groupMembers)
      .innerJoin(users, eq(groupMembers.userId, users.id))
      .where(and(eq(groupMembers.groupId, groupId), isNull(users.deletedAt)));

    // Get user IDs who logged today in this group
    const loggedToday = await db
      .select({ userId: deuceEntries.userId })
      .from(deuceEntries)
      .where(
        and(
          eq(deuceEntries.groupId, groupId),
          sql`DATE(${deuceEntries.loggedAt} AT TIME ZONE 'UTC') = ${todayUTC}`
        )
      )
      .groupBy(deuceEntries.userId);

    const loggedUserIds = new Set(loggedToday.map(r => r.userId));

    return members.map(m => ({
      userId: m.userId,
      username: m.username,
      firstName: m.firstName,
      email: m.email,
      profileImageUrl: m.profileImageUrl,
      hasLogged: loggedUserIds.has(m.userId),
    }));
  }

  // Streak alert operations
  async getAllGroupsWithActiveStreaks(minStreak: number): Promise<Group[]> {
    return await db
      .select()
      .from(groups)
      .where(gte(groups.currentStreak, minStreak));
  }

  async createStreakAlert(alert: InsertStreakAlert): Promise<StreakAlert> {
    const [newAlert] = await db.insert(streakAlerts).values(alert).returning();
    return newAlert;
  }

  // Push token operations
  async upsertPushToken(token: InsertPushToken): Promise<PushToken> {
    // If this exact token already exists for this user, return it; otherwise insert
    const [existing] = await db
      .select()
      .from(pushTokens)
      .where(and(eq(pushTokens.userId, token.userId), eq(pushTokens.token, token.token)));
    if (existing) return existing;
    const [newToken] = await db.insert(pushTokens).values(token).returning();
    return newToken;
  }

  async getUserPushTokens(userId: string): Promise<PushToken[]> {
    return await db
      .select()
      .from(pushTokens)
      .where(eq(pushTokens.userId, userId));
  }

  async countUserPushTokens(userId: string): Promise<number> {
    const [result] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(pushTokens)
      .where(eq(pushTokens.userId, userId));
    return result?.count ?? 0;
  }

  async deletePushToken(userId: string, token: string): Promise<void> {
    await db
      .delete(pushTokens)
      .where(and(eq(pushTokens.userId, userId), eq(pushTokens.token, token)));
  }

  async getGroupPushTokens(groupId: string): Promise<PushToken[]> {
    // Single JOIN query instead of two round-trips
    const rows = await db
      .select({ token: pushTokens })
      .from(pushTokens)
      .innerJoin(groupMembers, eq(pushTokens.userId, groupMembers.userId))
      .where(eq(groupMembers.groupId, groupId));
    return rows.map(r => r.token);
  }

  // Broadcast operations
  async createBroadcast(broadcast: InsertBroadcast): Promise<Broadcast> {
    const [newBroadcast] = await db.insert(broadcasts).values(broadcast).returning();
    return newBroadcast;
  }

  // Daily challenge operations
  async getDailyChallengeCompletion(
    userId: string, challengeDate: string,
  ): Promise<DailyChallengeCompletion | undefined> {
    const [completion] = await db
      .select()
      .from(dailyChallengeCompletions)
      .where(and(
        eq(dailyChallengeCompletions.userId, userId),
        eq(dailyChallengeCompletions.challengeDate, challengeDate),
      ));
    return completion;
  }

  async completeDailyChallenge(completion: InsertDailyChallengeCompletion): Promise<DailyChallengeCompletion> {
    const [newCompletion] = await db.insert(dailyChallengeCompletions).values(completion).returning();
    return newCompletion;
  }

  // Reminder operations
  async updateUserReminder(userId: string, hour: number, minute: number): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ reminderHour: hour, reminderMinute: minute, updatedAt: new Date() })
      .where(and(eq(users.id, userId), isNull(users.deletedAt)))
      .returning();
    return user;
  }

  // Legacy wall
  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(and(eq(users.username, username), isNull(users.deletedAt)));
    return user;
  }

  async getUserLongestStreak(userId: string): Promise<number> {
    const userGroupIds = await db
      .select({ groupId: groupMembers.groupId })
      .from(groupMembers)
      .where(eq(groupMembers.userId, userId));
    if (userGroupIds.length === 0) return 0;
    const [result] = await db
      .select({ maxStreak: sql<number>`COALESCE(MAX(${groups.longestStreak}), 0)::int` })
      .from(groups)
      .where(inArray(groups.id, userGroupIds.map(g => g.groupId)));
    return result?.maxStreak ?? 0;
  }

  async getUserBestDay(userId: string): Promise<{ date: string; count: number } | undefined> {
    const rows = await db
      .select({
        date: sql<string>`DATE(${deuceEntries.loggedAt} AT TIME ZONE 'UTC')`,
        count: sql<number>`COUNT(*)::int`,
      })
      .from(deuceEntries)
      .where(eq(deuceEntries.userId, userId))
      .groupBy(sql`DATE(${deuceEntries.loggedAt} AT TIME ZONE 'UTC')`)
      .orderBy(desc(sql<number>`COUNT(*)::int`))
      .limit(1);
    return rows.length > 0 ? rows[0] : undefined;
  }

  // Theme operations
  async updateUserTheme(userId: string, theme: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ theme, updatedAt: new Date() })
      .where(and(eq(users.id, userId), isNull(users.deletedAt)))
      .returning();
    return user;
  }

  // Subscription operations
  async updateUserSubscription(userId: string, subscription: string, expiresAt: Date): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ subscription, subscriptionExpiresAt: expiresAt, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async getUserSubscription(userId: string): Promise<{
    subscription: string; subscriptionExpiresAt: Date | null;
    streakInsuranceUsed: boolean;
  }> {
    const [user] = await db
      .select({
        subscription: users.subscription,
        subscriptionExpiresAt: users.subscriptionExpiresAt,
        streakInsuranceUsed: users.streakInsuranceUsed,
      })
      .from(users)
      .where(and(eq(users.id, userId), isNull(users.deletedAt)));
    return user ?? { subscription: "free", subscriptionExpiresAt: null, streakInsuranceUsed: false };
  }

  async useStreakInsurance(userId: string): Promise<void> {
    await db
      .update(users)
      .set({ streakInsuranceUsed: true, updatedAt: new Date() })
      .where(eq(users.id, userId));
  }

  async resetStreakInsurance(userId: string): Promise<void> {
    await db
      .update(users)
      .set({ streakInsuranceUsed: false, updatedAt: new Date() })
      .where(eq(users.id, userId));
  }

  async resetAllStreakInsurance(): Promise<number> {
    const result = await db
      .update(users)
      .set({ streakInsuranceUsed: false, updatedAt: new Date() })
      .where(eq(users.streakInsuranceUsed, true))
      .returning({ id: users.id });
    return result.length;
  }

  // Premium analytics
  async getPremiumAnalytics(userId: string): Promise<{
    totalDeuces: number;
    avgPerWeek: number;
    longestStreak: number;
    currentStreak: number;
    bestDay: { day: string; count: number };
    groupRankings: { groupId: string; groupName: string; rank: number; total: number }[];
    avgBristolScore: number | null;
    mostUsedLocation: string | null;
  }> {
    // Parallelize all independent queries — reduces latency from sum-of-all to max-of-all
    const [
      [totalResult],
      [firstEntry],
      userGroupIds,
      bestDayRows,
      [bristolResult],
      locationRows,
    ] = await Promise.all([
      db.select({ total: sql<number>`COUNT(*)::int` })
        .from(deuceEntries).where(eq(deuceEntries.userId, userId)),
      db.select({ earliest: sql<Date>`MIN(${deuceEntries.loggedAt})` })
        .from(deuceEntries).where(eq(deuceEntries.userId, userId)),
      db.select({ groupId: groupMembers.groupId })
        .from(groupMembers).where(eq(groupMembers.userId, userId)),
      db.select({
          dow: sql<number>`EXTRACT(DOW FROM ${deuceEntries.loggedAt})::int`,
          cnt: sql<number>`COUNT(*)::int`,
        })
        .from(deuceEntries).where(eq(deuceEntries.userId, userId))
        .groupBy(sql`EXTRACT(DOW FROM ${deuceEntries.loggedAt})`)
        .orderBy(desc(sql<number>`COUNT(*)::int`)).limit(1),
      db.select({ avg: sql<number>`ROUND(AVG(${deuceEntries.bristolScore})::numeric, 1)::float` })
        .from(deuceEntries)
        .where(and(eq(deuceEntries.userId, userId), sql`${deuceEntries.bristolScore} IS NOT NULL`)),
      db.select({ location: deuceEntries.location, cnt: sql<number>`COUNT(*)::int` })
        .from(deuceEntries).where(eq(deuceEntries.userId, userId))
        .groupBy(deuceEntries.location).orderBy(desc(sql<number>`COUNT(*)::int`)).limit(1),
    ]);

    const totalDeuces = totalResult?.total ?? 0;
    const weeks = firstEntry?.earliest
      ? Math.max(1, (Date.now() - new Date(firstEntry.earliest).getTime()) / (7 * 24 * 60 * 60 * 1000))
      : 1;
    const avgPerWeek = Math.round((totalDeuces / weeks) * 10) / 10;

    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const bestDay = bestDayRows.length > 0
      ? { day: dayNames[bestDayRows[0].dow] ?? "Unknown", count: bestDayRows[0].cnt }
      : { day: "N/A", count: 0 };
    const avgBristolScore = bristolResult?.avg ?? null;
    const mostUsedLocation = locationRows.length > 0 ? locationRows[0].location : null;

    // Streak + group rankings depend on userGroupIds — run in parallel after first batch
    let longestStreak = 0;
    let currentStreak = 0;
    const groupRankings: { groupId: string; groupName: string; rank: number; total: number }[] = [];
    if (userGroupIds.length > 0) {
      const gids = userGroupIds.map(g => g.groupId);
      const [[streakResult], rankingRows] = await Promise.all([
        db.select({
            maxLongest: sql<number>`COALESCE(MAX(${groups.longestStreak}), 0)::int`,
            maxCurrent: sql<number>`COALESCE(MAX(${groups.currentStreak}), 0)::int`,
          })
          .from(groups).where(inArray(groups.id, gids)),
        db.execute(sql`
          WITH member_counts AS (
            SELECT
              gm.group_id,
              gm.user_id,
              COUNT(de.id)::int AS cnt,
              RANK() OVER (PARTITION BY gm.group_id ORDER BY COUNT(de.id) DESC) AS rnk,
              COUNT(*) OVER (PARTITION BY gm.group_id) AS total_members
            FROM group_members gm
            LEFT JOIN deuce_entries de ON de.user_id = gm.user_id AND de.group_id = gm.group_id
            WHERE gm.group_id IN (${sql.join(gids.map(id => sql`${id}`), sql`, `)})
            GROUP BY gm.group_id, gm.user_id
          )
          SELECT
            mc.group_id AS "groupId",
            g.name AS "groupName",
            mc.rnk::int AS rank,
            mc.total_members::int AS total
          FROM member_counts mc
          INNER JOIN groups g ON g.id = mc.group_id
          WHERE mc.user_id = ${userId}
        `),
      ]);
      longestStreak = streakResult?.maxLongest ?? 0;
      currentStreak = streakResult?.maxCurrent ?? 0;
      for (const row of rankingRows.rows as { groupId: string; groupName: string; rank: number; total: number }[]) {
        groupRankings.push(row);
      }
    }

    return {
      totalDeuces, avgPerWeek, longestStreak, currentStreak,
      bestDay, groupRankings, avgBristolScore, mostUsedLocation,
    };
  }

  // Weekly report
  async getWeeklyReport(userId: string): Promise<{
    totalDeuces: number;
    peakDay: { date: string; count: number };
    mostActiveSquad: { name: string; count: number };
    longestStreak: number;
    funniestEntry: { thought: string; reactions: number } | null;
    totalReactionsReceived: number;
    weekOf: string;
    dailyCounts: { date: string; count: number }[];
  }> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setUTCDate(sevenDaysAgo.getUTCDate() - 7);
    const weekOf = sevenDaysAgo.toISOString().slice(0, 10);

    // Parallelize all 7 independent queries — runs in one round-trip instead of 7
    const [
      [totalResult],
      peakDayRows,
      squadRows,
      userGroupIds,
      funnyRows,
      [reactionsResult],
      dailyRows,
    ] = await Promise.all([
      // 1. Total deuces
      db.select({ total: sql<number>`COUNT(*)::int` })
        .from(deuceEntries)
        .where(and(eq(deuceEntries.userId, userId), gte(deuceEntries.loggedAt, sevenDaysAgo))),
      // 2. Peak day
      db.select({
          date: sql<string>`DATE(${deuceEntries.loggedAt} AT TIME ZONE 'UTC')`,
          count: sql<number>`COUNT(*)::int`,
        })
        .from(deuceEntries)
        .where(and(eq(deuceEntries.userId, userId), gte(deuceEntries.loggedAt, sevenDaysAgo)))
        .groupBy(sql`DATE(${deuceEntries.loggedAt} AT TIME ZONE 'UTC')`)
        .orderBy(desc(sql<number>`COUNT(*)::int`)).limit(1),
      // 3. Most active squad
      db.select({ name: groups.name, count: sql<number>`COUNT(*)::int` })
        .from(deuceEntries)
        .innerJoin(groups, eq(deuceEntries.groupId, groups.id))
        .where(and(eq(deuceEntries.userId, userId), gte(deuceEntries.loggedAt, sevenDaysAgo)))
        .groupBy(groups.name).orderBy(desc(sql<number>`COUNT(*)::int`)).limit(1),
      // 4. User group IDs (for streak lookup)
      db.select({ groupId: groupMembers.groupId })
        .from(groupMembers).where(eq(groupMembers.userId, userId)),
      // 5. Funniest entry
      db.select({
          thought: deuceEntries.thoughts,
          reactionCount: sql<number>`COUNT(${reactions.id})::int`,
        })
        .from(deuceEntries)
        .innerJoin(reactions, eq(deuceEntries.id, reactions.entryId))
        .where(and(eq(deuceEntries.userId, userId), gte(deuceEntries.loggedAt, sevenDaysAgo)))
        .groupBy(deuceEntries.id, deuceEntries.thoughts)
        .orderBy(desc(sql<number>`COUNT(${reactions.id})::int`)).limit(1),
      // 6. Total reactions received
      db.select({ total: sql<number>`COUNT(*)::int` })
        .from(reactions)
        .innerJoin(deuceEntries, eq(reactions.entryId, deuceEntries.id))
        .where(and(eq(deuceEntries.userId, userId), gte(deuceEntries.loggedAt, sevenDaysAgo))),
      // 7. Daily counts
      db.select({
          date: sql<string>`DATE(${deuceEntries.loggedAt} AT TIME ZONE 'UTC')`,
          count: sql<number>`COUNT(*)::int`,
        })
        .from(deuceEntries)
        .where(and(eq(deuceEntries.userId, userId), gte(deuceEntries.loggedAt, sevenDaysAgo)))
        .groupBy(sql`DATE(${deuceEntries.loggedAt} AT TIME ZONE 'UTC')`)
        .orderBy(sql`DATE(${deuceEntries.loggedAt} AT TIME ZONE 'UTC')`),
    ]);

    const totalDeuces = totalResult?.total ?? 0;
    const peakDay = peakDayRows.length > 0
      ? { date: peakDayRows[0].date, count: peakDayRows[0].count }
      : { date: weekOf, count: 0 };
    const mostActiveSquad = squadRows.length > 0
      ? { name: squadRows[0].name, count: squadRows[0].count }
      : { name: "None", count: 0 };
    const funniestEntry = funnyRows.length > 0
      ? { thought: funnyRows[0].thought, reactions: funnyRows[0].reactionCount }
      : null;
    const totalReactionsReceived = reactionsResult?.total ?? 0;

    // Streak lookup depends on userGroupIds — one extra query if user has groups
    let longestStreak = 0;
    if (userGroupIds.length > 0) {
      const [streakResult] = await db
        .select({ maxStreak: sql<number>`MAX(${groups.longestStreak})::int` })
        .from(groups)
        .where(inArray(groups.id, userGroupIds.map(g => g.groupId)));
      longestStreak = streakResult?.maxStreak ?? 0;
    }

    // Build a full 7-day array (fill zeros for missing days)
    const dailyMap = new Map(dailyRows.map(r => [r.date, r.count]));
    const dailyCounts = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(sevenDaysAgo);
      d.setUTCDate(d.getUTCDate() + i);
      const dateStr = d.toISOString().slice(0, 10);
      return { date: dateStr, count: dailyMap.get(dateStr) ?? 0 };
    });

    return {
      totalDeuces,
      peakDay,
      mostActiveSquad,
      longestStreak,
      funniestEntry,
      totalReactionsReceived,
      weekOf,
      dailyCounts,
    };
  }

  // Weekly Throne Report — group-level weekly summary
  async getGroupWeeklyReport(groupId: string): Promise<{
    groupId: string;
    groupName: string;
    weekOf: string;
    weekEnding: string;
    groupStats: {
      currentStreak: number;
      longestStreak: number;
      totalDeucesThisWeek: number;
    };
    members: Array<{
      userId: string;
      username: string | null;
      profileImageUrl: string | null;
      deucesThisWeek: number;
      streakStatus: 'active' | 'at_risk' | 'inactive';
    }>;
    mvp: {
      userId: string;
      username: string | null;
      profileImageUrl: string | null;
      deuceCount: number;
    } | null;
    funnyStats: {
      longestGap: { userId: string; username: string | null; gapDays: number } | null;
      mostReactionsReceived: { userId: string; username: string | null; reactionCount: number } | null;
      funniestEntry: { userId: string; username: string | null; thought: string; reactions: number } | null;
    };
  }> {
    const today = getTodayStorageUTC();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setUTCDate(sevenDaysAgo.getUTCDate() - 6); // inclusive 7-day window
    sevenDaysAgo.setUTCHours(0, 0, 0, 0);
    const weekOf = sevenDaysAgo.toISOString().slice(0, 10);
    const weekEnding = today;

    // 1. Group metadata + streak
    const [group] = await db
      .select({ name: groups.name, currentStreak: groups.currentStreak, longestStreak: groups.longestStreak })
      .from(groups)
      .where(eq(groups.id, groupId));
    if (!group) throw new Error('Group not found');

    // 2. Member list
    const memberRows = await db
      .select({
        userId: groupMembers.userId,
        username: users.username,
        firstName: users.firstName,
        profileImageUrl: users.profileImageUrl,
      })
      .from(groupMembers)
      .innerJoin(users, eq(groupMembers.userId, users.id))
      .where(and(eq(groupMembers.groupId, groupId), isNull(users.deletedAt)));

    // 3. Deuces per member this week
    const weeklyEntryCounts = await db
      .select({
        userId: deuceEntries.userId,
        count: sql<number>`COUNT(*)::int`,
      })
      .from(deuceEntries)
      .where(and(eq(deuceEntries.groupId, groupId), gte(deuceEntries.loggedAt, sevenDaysAgo)))
      .groupBy(deuceEntries.userId);

    const countByUser = new Map(weeklyEntryCounts.map(r => [r.userId, r.count]));

    // 4. Who logged today (for streak status)
    const loggedToday = await db
      .select({ userId: deuceEntries.userId })
      .from(deuceEntries)
      .where(and(eq(deuceEntries.groupId, groupId), sql`DATE(${deuceEntries.loggedAt} AT TIME ZONE 'UTC') = ${today}`))
      .groupBy(deuceEntries.userId);
    const loggedTodaySet = new Set(loggedToday.map(r => r.userId));

    // 5. Total group deuces this week
    const totalDeucesThisWeek = weeklyEntryCounts.reduce((sum, r) => sum + r.count, 0);

    // 6. Build member objects
    const members = memberRows.map(m => {
      const count = countByUser.get(m.userId) ?? 0;
      const hasLoggedToday = loggedTodaySet.has(m.userId);
      const streakStatus: 'active' | 'at_risk' | 'inactive' = hasLoggedToday
        ? 'active'
        : count > 0 ? 'at_risk' : 'inactive';
      return {
        userId: m.userId,
        username: m.username ?? m.firstName,
        profileImageUrl: m.profileImageUrl,
        deucesThisWeek: count,
        streakStatus,
      };
    });

    // 7. MVP — member with most deuces this week
    const sortedByCount = [...members].sort((a, b) => b.deucesThisWeek - a.deucesThisWeek);
    const mvpMember = sortedByCount[0] && sortedByCount[0].deucesThisWeek > 0 ? sortedByCount[0] : null;
    const mvp = mvpMember
      ? {
          userId: mvpMember.userId,
          username: mvpMember.username,
          profileImageUrl: mvpMember.profileImageUrl,
          deuceCount: mvpMember.deucesThisWeek,
        }
      : null;

    // 8. Funny stats

    // 8a. Longest gap — find the member with the most days since last entry (within the week)
    const lastEntryRows = await db
      .select({
        userId: deuceEntries.userId,
        lastLog: sql<string>`MAX(DATE(${deuceEntries.loggedAt} AT TIME ZONE 'UTC'))`,
      })
      .from(deuceEntries)
      .where(and(eq(deuceEntries.groupId, groupId), gte(deuceEntries.loggedAt, sevenDaysAgo)))
      .groupBy(deuceEntries.userId);

    const lastEntryMap = new Map(lastEntryRows.map(r => [r.userId, r.lastLog]));

    let longestGap: { userId: string; username: string | null; gapDays: number } | null = null;
    for (const m of memberRows) {
      const lastLog = lastEntryMap.get(m.userId);
      if (lastLog) {
        const gapMs = new Date(today).getTime() - new Date(lastLog).getTime();
        const gapDays = Math.floor(gapMs / (1000 * 60 * 60 * 24));
        if (!longestGap || gapDays > longestGap.gapDays) {
          longestGap = { userId: m.userId, username: m.username ?? m.firstName, gapDays };
        }
      }
    }

    // 8b. Most reactions received this week
    const reactionRows = await db
      .select({
        userId: deuceEntries.userId,
        reactionCount: sql<number>`COUNT(${reactions.id})::int`,
      })
      .from(deuceEntries)
      .innerJoin(reactions, eq(deuceEntries.id, reactions.entryId))
      .where(and(eq(deuceEntries.groupId, groupId), gte(deuceEntries.loggedAt, sevenDaysAgo)))
      .groupBy(deuceEntries.userId)
      .orderBy(desc(sql<number>`COUNT(${reactions.id})::int`))
      .limit(1);

    let mostReactionsReceived: { userId: string; username: string | null; reactionCount: number } | null = null;
    if (reactionRows.length > 0 && reactionRows[0].reactionCount > 0) {
      const m = memberRows.find(m => m.userId === reactionRows[0].userId);
      mostReactionsReceived = {
        userId: reactionRows[0].userId,
        username: m?.username ?? m?.firstName ?? null,
        reactionCount: reactionRows[0].reactionCount,
      };
    }

    // 8c. Funniest entry — most reacted entry with a thought
    const funniestRows = await db
      .select({
        entryId: deuceEntries.id,
        userId: deuceEntries.userId,
        thought: deuceEntries.thoughts,
        reactionCount: sql<number>`COUNT(${reactions.id})::int`,
      })
      .from(deuceEntries)
      .innerJoin(reactions, eq(deuceEntries.id, reactions.entryId))
      .where(and(
        eq(deuceEntries.groupId, groupId),
        gte(deuceEntries.loggedAt, sevenDaysAgo),
        sql`${deuceEntries.thoughts} != ''`,
      ))
      .groupBy(deuceEntries.id, deuceEntries.userId, deuceEntries.thoughts)
      .orderBy(desc(sql<number>`COUNT(${reactions.id})::int`))
      .limit(1);

    let funniestEntry: { userId: string; username: string | null; thought: string; reactions: number } | null = null;
    if (funniestRows.length > 0 && funniestRows[0].reactionCount > 0) {
      const m = memberRows.find(m => m.userId === funniestRows[0].userId);
      funniestEntry = {
        userId: funniestRows[0].userId,
        username: m?.username ?? m?.firstName ?? null,
        thought: funniestRows[0].thought,
        reactions: funniestRows[0].reactionCount,
      };
    }

    return {
      groupId,
      groupName: group.name,
      weekOf,
      weekEnding,
      groupStats: {
        currentStreak: group.currentStreak,
        longestStreak: group.longestStreak,
        totalDeucesThisWeek,
      },
      members,
      mvp,
      funnyStats: { longestGap, mostReactionsReceived, funniestEntry },
    };
  }

  // Group invite preview — rich data for OG/landing pages
  async getGroupInvitePreview(inviteCode: string): Promise<{
    name: string;
    description: string | null;
    memberCount: number;
    memberNames: string[];
    deuceCount: number;
    currentStreak: number;
    longestStreak: number;
  } | null> {
    const invite = await this.getInviteById(inviteCode);
    if (!invite || invite.expiresAt < new Date()) return null;

    const group = await this.getGroupById(invite.groupId);
    if (!group) return null;

    const memberRows = await db
      .select({ username: users.username, firstName: users.firstName })
      .from(groupMembers)
      .innerJoin(users, eq(groupMembers.userId, users.id))
      .where(and(eq(groupMembers.groupId, invite.groupId), isNull(users.deletedAt)))
      .limit(10);

    const memberNames = memberRows.map(m => m.username ?? m.firstName ?? 'Member').filter(Boolean);
    // Query actual member count separately — memberRows is limited to 10 for display
    const memberCount = await this.getGroupMemberCount(invite.groupId);

    const [countRow] = await db
      .select({ total: sql<number>`COUNT(*)::int` })
      .from(deuceEntries)
      .where(eq(deuceEntries.groupId, invite.groupId));

    return {
      name: group.name,
      description: group.description ?? null,
      memberCount,
      memberNames,
      deuceCount: countRow?.total ?? 0,
      currentStreak: group.currentStreak,
      longestStreak: group.longestStreak,
    };
  }

  // Badges — tiered badge catalog for a user
  async getUserBadges(userId: string): Promise<Array<{
    id: string;
    name: string;
    description: string;
    emoji: string;
    tier: 'free' | 'premium';
    unlocked: boolean;
    unlockedAt?: Date | null;
  }>> {
    const user = await this.getUser(userId);
    if (!user) return [];

    const isPremium = user.subscription === 'premium'
      && user.subscriptionExpiresAt
      && new Date(user.subscriptionExpiresAt) > new Date();
    const totalLogs = user.deuceCount ?? 0;
    const userGroupIds = await db
      .select({ groupId: groupMembers.groupId })
      .from(groupMembers)
      .where(eq(groupMembers.userId, userId));
    const squadCount = userGroupIds.length;

    let longestStreak = 0;
    if (userGroupIds.length > 0) {
      const [sr] = await db
        .select({ max: sql<number>`COALESCE(MAX(${groups.longestStreak}), 0)::int` })
        .from(groups)
        .where(inArray(groups.id, userGroupIds.map(g => g.groupId)));
      longestStreak = sr?.max ?? 0;
    }

    const badgeCatalog: Array<{
      id: string; name: string; description: string; emoji: string;
      tier: 'free' | 'premium'; condition: boolean; unlockedAt?: Date | null;
    }> = [
      // Free badges
      {
        id: 'first_flush', name: 'First Flush',
        description: 'Logged your first deuce', emoji: '🚽',
        tier: 'free', condition: totalLogs >= 1,
      },
      {
        id: 'ten_club', name: 'Ten Club',
        description: 'Logged 10 deuces', emoji: '🔟',
        tier: 'free', condition: totalLogs >= 10,
      },
      {
        id: 'half_century', name: 'Half Century',
        description: 'Logged 50 deuces', emoji: '5️⃣0️⃣',
        tier: 'free', condition: totalLogs >= 50,
      },
      {
        id: 'centurion', name: 'Centurion',
        description: 'Logged 100 deuces', emoji: '💯',
        tier: 'free', condition: totalLogs >= 100,
      },
      {
        id: 'squad_up', name: 'Squad Up',
        description: 'Joined your first squad', emoji: '👥',
        tier: 'free', condition: squadCount >= 1,
      },
      {
        id: 'social_butterfly', name: 'Social Butterfly',
        description: 'Member of 3+ squads', emoji: '🦋',
        tier: 'free', condition: squadCount >= 3,
      },
      // Premium badges
      {
        id: 'gold_throne', name: 'Gold Throne',
        description: 'Premium subscriber', emoji: '👑',
        tier: 'premium', condition: !!isPremium,
      },
      {
        id: 'streak_king', name: 'Streak King',
        description: 'Maintained a 7-day group streak', emoji: '🔥',
        tier: 'premium', condition: longestStreak >= 7,
      },
      {
        id: 'streak_legend', name: 'Streak Legend',
        description: 'Maintained a 30-day group streak', emoji: '🏆',
        tier: 'premium', condition: longestStreak >= 30,
      },
      {
        id: 'legend_tier', name: 'Legend',
        description: 'Logged 500 deuces', emoji: '🌟',
        tier: 'premium', condition: totalLogs >= 500,
      },
    ];

    return badgeCatalog.map(b => ({
      id: b.id,
      name: b.name,
      description: b.description,
      emoji: b.emoji,
      tier: b.tier,
      unlocked: b.tier === 'premium' ? (!!isPremium && b.condition) : b.condition,
      unlockedAt: b.condition ? user.createdAt : null,
    }));
  }

  // Squad spy mode — find the modal (most common) hour each member logs
  async getGroupMemberTypicalHours(groupId: string): Promise<{ username: string; typicalHour: number | null }[]> {
    // Single query: get members + their most common logging hour + total count
    // Uses a window function to rank hours by frequency per user
    const rows = await db.execute(sql`
      WITH member_hours AS (
        SELECT
          gm.user_id,
          COALESCE(u.username, u.first_name, 'Unknown') AS display_name,
          EXTRACT(HOUR FROM de.logged_at)::int AS hour,
          COUNT(*)::int AS cnt,
          ROW_NUMBER() OVER (PARTITION BY gm.user_id ORDER BY COUNT(*) DESC) AS rn
        FROM group_members gm
        INNER JOIN users u ON gm.user_id = u.id
        LEFT JOIN deuce_entries de ON de.user_id = gm.user_id
        WHERE gm.group_id = ${groupId} AND u.deleted_at IS NULL
        GROUP BY gm.user_id, u.username, u.first_name, EXTRACT(HOUR FROM de.logged_at)
      ),
      member_totals AS (
        SELECT user_id, SUM(cnt)::int AS total_logs
        FROM member_hours
        GROUP BY user_id
      )
      SELECT
        mh.display_name AS username,
        CASE WHEN mt.total_logs >= 3 THEN mh.hour ELSE NULL END AS typical_hour
      FROM member_hours mh
      INNER JOIN member_totals mt ON mh.user_id = mt.user_id
      WHERE mh.rn = 1
      UNION ALL
      SELECT
        COALESCE(u.username, u.first_name, 'Unknown') AS username,
        NULL AS typical_hour
      FROM group_members gm
      INNER JOIN users u ON gm.user_id = u.id
      LEFT JOIN deuce_entries de ON de.user_id = gm.user_id
      WHERE gm.group_id = ${groupId} AND u.deleted_at IS NULL AND de.id IS NULL
      GROUP BY gm.user_id, u.username, u.first_name
    `);

    return (rows.rows as { username: string; typical_hour: number | null }[]).map(r => ({
      username: r.username,
      typicalHour: r.typical_hour,
    }));
  }

  // Referral operations
  async getUserByReferralCode(code: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(and(eq(users.referralCode, code), isNull(users.deletedAt)));
    return user;
  }

  async applyReferral(refereeId: string, referrerId: string): Promise<Referral> {
    // Wrap all three mutations in a transaction — if any step fails, all roll back.
    // The DB-level unique constraint on referrals(refereeId) acts as a final safety
    // net against concurrent requests: if two requests race past the application-level
    // referredBy check simultaneously, only one INSERT will succeed.
    try {
      return await db.transaction(async (tx) => {
        // Set referredBy on referee
        await tx
          .update(users)
          .set({ referredBy: referrerId, updatedAt: new Date() })
          .where(eq(users.id, refereeId));

        // Increment referrer's referralCount
        await tx
          .update(users)
          .set({ referralCount: sql`${users.referralCount} + 1`, updatedAt: new Date() })
          .where(eq(users.id, referrerId));

        // Insert referral row — unique constraint uq_referrals_referee guards against
        // duplicate inserts from concurrent requests for the same referee
        const [referral] = await tx
          .insert(referrals)
          .values({ referrerId, refereeId })
          .returning();
        return referral;
      });
    } catch (err: unknown) {
      const pgErr = err as { code?: string; constraint?: string };
      if (pgErr?.code === '23505' && pgErr?.constraint === 'uq_referrals_referee') {
        throw new Error('REFERRAL_ALREADY_APPLIED');
      }
      throw err;
    }
  }

  async getReferralStats(userId: string): Promise<{
    referralCount: number;
    referrals: { username: string | null; joinedAt: Date | null }[];
  }> {
    const [user] = await db
      .select({ referralCount: users.referralCount })
      .from(users)
      .where(eq(users.id, userId));

    const rows = await db
      .select({
        username: users.username,
        joinedAt: referrals.createdAt,
      })
      .from(referrals)
      .innerJoin(users, eq(referrals.refereeId, users.id))
      .where(and(eq(referrals.referrerId, userId), isNull(users.deletedAt)))
      .orderBy(desc(referrals.createdAt));

    return {
      referralCount: user?.referralCount ?? 0,
      referrals: rows,
    };
  }

  // Referral dashboard
  async getReferralDashboardStats(userId: string): Promise<{
    totalReferrals: number; premiumConversions: number;
    pendingConversions: number;
  }> {
    const [result] = await db
      .select({
        totalReferrals: sql<number>`COUNT(*)::int`,
        premiumConversions: sql<number>`COUNT(${referrals.convertedToPremiumAt})::int`,
      })
      .from(referrals)
      .where(eq(referrals.referrerId, userId));

    const total = result?.totalReferrals ?? 0;
    const converted = result?.premiumConversions ?? 0;
    return { totalReferrals: total, premiumConversions: converted, pendingConversions: total - converted };
  }

  async getReferralLeaderboard(): Promise<{
    username: string | null; profileImageUrl: string | null;
    referralCount: number; premiumConversionCount: number;
  }[]> {
    const rows = await db
      .select({
        username: users.username,
        profileImageUrl: users.profileImageUrl,
        referralCount: sql<number>`COUNT(*)::int`,
        premiumConversionCount: sql<number>`COUNT(${referrals.convertedToPremiumAt})::int`,
      })
      .from(referrals)
      .innerJoin(users, eq(referrals.referrerId, users.id))
      .where(isNull(users.deletedAt))
      .groupBy(users.id, users.username, users.profileImageUrl)
      .orderBy(desc(sql<number>`COUNT(*)::int`))
      .limit(10);
    return rows;
  }

  async getUserDailyLogCount(userId: string, dateUTC: string): Promise<number> {
    const startOfDay = new Date(`${dateUTC}T00:00:00.000Z`);
    const endOfDay = new Date(`${dateUTC}T23:59:59.999Z`);
    const [result] = await db
      .select({ count: count(deuceEntries.id) })
      .from(deuceEntries)
      .where(
        and(
          eq(deuceEntries.userId, userId),
          gte(deuceEntries.createdAt, startOfDay),
          lte(deuceEntries.createdAt, endOfDay)
        )
      );
    return result?.count ?? 0;
  }

  // Admin stats
  async getAdminStats(): Promise<{
    totalUsers: number;
    premiumUsers: number;
    dauToday: number;
    totalLogsToday: number;
    totalLogsAllTime: number;
    activeGroups: number;
    avgStreakLength: number;
  }> {
    const today = new Date().toISOString().slice(0, 10);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setUTCDate(sevenDaysAgo.getUTCDate() - 7);

    const [
      [totalUsersRow], [premiumUsersRow], [dauRow],
      [logsToday], [logsAll], [activeGroupsRow], [avgStreakRow],
    ] = await Promise.all([
      db.select({ count: sql<number>`COUNT(*)::int` }).from(users).where(isNull(users.deletedAt)),
      db.select({ count: sql<number>`COUNT(*)::int` }).from(users)
        .where(and(
          eq(users.subscription, 'premium'),
          sql`${users.subscriptionExpiresAt} > NOW()`,
          isNull(users.deletedAt),
        )),
      db.select({ count: sql<number>`COUNT(DISTINCT ${deuceEntries.userId})::int` }).from(deuceEntries)
        .where(sql`DATE(${deuceEntries.loggedAt} AT TIME ZONE 'UTC') = ${today}`),
      db.select({ count: sql<number>`COUNT(*)::int` }).from(deuceEntries)
        .where(sql`DATE(${deuceEntries.loggedAt} AT TIME ZONE 'UTC') = ${today}`),
      db.select({ count: sql<number>`COUNT(*)::int` }).from(deuceEntries),
      db.select({ count: sql<number>`COUNT(DISTINCT ${deuceEntries.groupId})::int` }).from(deuceEntries)
        .where(gte(deuceEntries.loggedAt, sevenDaysAgo)),
      db.select({ avg: sql<number>`COALESCE(AVG(${groups.currentStreak}), 0)` }).from(groups),
    ]);

    return {
      totalUsers: totalUsersRow?.count ?? 0,
      premiumUsers: premiumUsersRow?.count ?? 0,
      dauToday: dauRow?.count ?? 0,
      totalLogsToday: logsToday?.count ?? 0,
      totalLogsAllTime: logsAll?.count ?? 0,
      activeGroups: activeGroupsRow?.count ?? 0,
      avgStreakLength: Math.round((avgStreakRow?.avg ?? 0) * 10) / 10,
    };
  }

  // Share card
  async getShareCardData(userId: string): Promise<{
    username: string | null;
    currentStreak: number;
    longestStreak: number;
    totalLogs: number;
    memberSince: Date | null;
    squadCount: number;
  }> {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");

    // Get streak data across user's groups
    const userGroupIds = await db
      .select({ groupId: groupMembers.groupId })
      .from(groupMembers)
      .where(eq(groupMembers.userId, userId));

    let currentStreak = 0;
    let longestStreak = 0;
    if (userGroupIds.length > 0) {
      const gids = userGroupIds.map(g => g.groupId);
      const [streakResult] = await db
        .select({
          maxCurrent: sql<number>`COALESCE(MAX(${groups.currentStreak}), 0)::int`,
          maxLongest: sql<number>`COALESCE(MAX(${groups.longestStreak}), 0)::int`,
        })
        .from(groups)
        .where(inArray(groups.id, gids));
      currentStreak = streakResult?.maxCurrent ?? 0;
      longestStreak = streakResult?.maxLongest ?? 0;
    }

    return {
      username: user.username,
      currentStreak,
      longestStreak,
      totalLogs: user.deuceCount ?? 0,
      memberSince: user.createdAt ?? null,
      squadCount: userGroupIds.length,
    };
  }

  async getGroupLeaderboard(groupId: string): Promise<{
    userId: string;
    username: string | null;
    profileImageUrl: string | null;
    weekly: { totalDeuces: number; reactionsReceived: number };
    monthly: { totalDeuces: number; reactionsReceived: number };
    allTime: { totalDeuces: number; reactionsReceived: number; currentStreak: number };
    isMvp: boolean;
  }[]> {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setUTCDate(now.getUTCDate() - now.getUTCDay()); // Sunday
    weekStart.setUTCHours(0, 0, 0, 0);

    const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));

    // Get all active members
    const members = await db
      .select({
        userId: groupMembers.userId,
        username: users.username,
        firstName: users.firstName,
        profileImageUrl: users.profileImageUrl,
      })
      .from(groupMembers)
      .innerJoin(users, eq(groupMembers.userId, users.id))
      .where(and(eq(groupMembers.groupId, groupId), isNull(users.deletedAt)));

    if (members.length === 0) return [];

    const userIds = members.map(m => m.userId);

    // All-time deuce counts per member in this group
    const allTimeCounts = await db
      .select({
        userId: deuceEntries.userId,
        count: sql<number>`COUNT(*)::int`,
      })
      .from(deuceEntries)
      .where(and(eq(deuceEntries.groupId, groupId), inArray(deuceEntries.userId, userIds)))
      .groupBy(deuceEntries.userId);

    // Weekly deuce counts
    const weeklyCounts = await db
      .select({
        userId: deuceEntries.userId,
        count: sql<number>`COUNT(*)::int`,
      })
      .from(deuceEntries)
      .where(and(
        eq(deuceEntries.groupId, groupId),
        inArray(deuceEntries.userId, userIds),
        gte(deuceEntries.loggedAt, weekStart)
      ))
      .groupBy(deuceEntries.userId);

    // Monthly deuce counts
    const monthlyCounts = await db
      .select({
        userId: deuceEntries.userId,
        count: sql<number>`COUNT(*)::int`,
      })
      .from(deuceEntries)
      .where(and(
        eq(deuceEntries.groupId, groupId),
        inArray(deuceEntries.userId, userIds),
        gte(deuceEntries.loggedAt, monthStart)
      ))
      .groupBy(deuceEntries.userId);

    // Reactions received all-time (reactions on this user's entries in this group)
    const allTimeReactions = await db
      .select({
        userId: deuceEntries.userId,
        count: sql<number>`COUNT(${reactions.id})::int`,
      })
      .from(deuceEntries)
      .innerJoin(reactions, eq(reactions.entryId, deuceEntries.id))
      .where(and(eq(deuceEntries.groupId, groupId), inArray(deuceEntries.userId, userIds)))
      .groupBy(deuceEntries.userId);

    // Reactions received this week
    const weeklyReactions = await db
      .select({
        userId: deuceEntries.userId,
        count: sql<number>`COUNT(${reactions.id})::int`,
      })
      .from(deuceEntries)
      .innerJoin(reactions, eq(reactions.entryId, deuceEntries.id))
      .where(and(
        eq(deuceEntries.groupId, groupId),
        inArray(deuceEntries.userId, userIds),
        gte(deuceEntries.loggedAt, weekStart)
      ))
      .groupBy(deuceEntries.userId);

    // Reactions received this month
    const monthlyReactions = await db
      .select({
        userId: deuceEntries.userId,
        count: sql<number>`COUNT(${reactions.id})::int`,
      })
      .from(deuceEntries)
      .innerJoin(reactions, eq(reactions.entryId, deuceEntries.id))
      .where(and(
        eq(deuceEntries.groupId, groupId),
        inArray(deuceEntries.userId, userIds),
        gte(deuceEntries.loggedAt, monthStart)
      ))
      .groupBy(deuceEntries.userId);

    // Current streak per member — batched single query instead of N+1 loop.
    // Uses a gap-and-islands approach: assign each day a row_number and subtract
    // from the date to detect consecutive runs. Counts the run containing today
    // or yesterday (grace period).
    const today = new Date().toISOString().slice(0, 10);
    const streakMap = new Map<string, number>();
    if (userIds.length > 0) {
      const streakRows = await db.execute(sql`
        WITH distinct_days AS (
          SELECT
            user_id,
            DATE(logged_at AT TIME ZONE 'UTC') AS log_date
          FROM deuce_entries
          WHERE group_id = ${groupId}
            AND user_id IN (${sql.join(userIds.map(id => sql`${id}`), sql`, `)})
          GROUP BY user_id, DATE(logged_at AT TIME ZONE 'UTC')
        ),
        numbered AS (
          SELECT
            user_id,
            log_date,
            ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY log_date DESC) AS rn
          FROM distinct_days
        ),
        groups_cte AS (
          SELECT
            user_id,
            log_date,
            (log_date + (rn - 1) * INTERVAL '1 day')::date AS grp
          FROM numbered
        ),
        runs AS (
          SELECT user_id, grp, COUNT(*)::int AS run_len, MAX(log_date) AS run_end
          FROM groups_cte
          GROUP BY user_id, grp
        )
        SELECT r.user_id, r.run_len AS streak
        FROM runs r
        WHERE r.run_end >= (CURRENT_DATE AT TIME ZONE 'UTC' - INTERVAL '1 day')::date
          AND r.grp = (
            SELECT grp FROM groups_cte
            WHERE user_id = r.user_id
              AND log_date = r.run_end
          )
      `);
      for (const row of streakRows.rows as { user_id: string; streak: number }[]) {
        streakMap.set(row.user_id, row.streak);
      }
    }

    // Build lookup maps
    const allTimeMap = new Map(allTimeCounts.map(r => [r.userId, r.count]));
    const weeklyMap = new Map(weeklyCounts.map(r => [r.userId, r.count]));
    const monthlyMap = new Map(monthlyCounts.map(r => [r.userId, r.count]));
    const allTimeRxMap = new Map(allTimeReactions.map(r => [r.userId, r.count]));
    const weeklyRxMap = new Map(weeklyReactions.map(r => [r.userId, r.count]));
    const monthlyRxMap = new Map(monthlyReactions.map(r => [r.userId, r.count]));

    const rows = members.map(m => ({
      userId: m.userId,
      username: m.username ?? m.firstName ?? null,
      profileImageUrl: m.profileImageUrl,
      weekly: {
        totalDeuces: weeklyMap.get(m.userId) ?? 0,
        reactionsReceived: weeklyRxMap.get(m.userId) ?? 0,
      },
      monthly: {
        totalDeuces: monthlyMap.get(m.userId) ?? 0,
        reactionsReceived: monthlyRxMap.get(m.userId) ?? 0,
      },
      allTime: {
        totalDeuces: allTimeMap.get(m.userId) ?? 0,
        reactionsReceived: allTimeRxMap.get(m.userId) ?? 0,
        currentStreak: streakMap.get(m.userId) ?? 0,
      },
      isMvp: false,
    }));

    // MVP = member with highest weekly deuce count (ties broken by reactions)
    if (rows.length > 0) {
      let mvpIdx = 0;
      for (let i = 1; i < rows.length; i++) {
        const curr = rows[i];
        const best = rows[mvpIdx];
        if (
          curr.weekly.totalDeuces > best.weekly.totalDeuces ||
          (curr.weekly.totalDeuces === best.weekly.totalDeuces &&
            curr.weekly.reactionsReceived > best.weekly.reactionsReceived)
        ) {
          mvpIdx = i;
        }
      }
      // Only award MVP if they have at least 1 deuce this week
      if (rows[mvpIdx].weekly.totalDeuces > 0) {
        rows[mvpIdx].isMvp = true;
      }
    }

    return rows.sort((a, b) => b.weekly.totalDeuces - a.weekly.totalDeuces);
  }

  // --- Bingo operations ---

  async getBingoCard(userId: string, month: string): Promise<BingoCard | undefined> {
    const [card] = await db
      .select()
      .from(bingoCards)
      .where(and(eq(bingoCards.userId, userId), eq(bingoCards.month, month)));
    return card;
  }

  async deleteBingoCard(cardId: string): Promise<void> {
    await db.delete(bingoCards).where(eq(bingoCards.id, cardId));
  }

  async createBingoCard(data: InsertBingoCard): Promise<BingoCard> {
    // Use onConflictDoNothing so a race condition between two concurrent requests
    // for the same user+month doesn't create duplicate cards — the unique constraint
    // uq_bingo_cards_user_month ensures at most one card per user per month.
    const [card] = await db
      .insert(bingoCards)
      .values(data)
      .onConflictDoNothing({ target: [bingoCards.userId, bingoCards.month] })
      .returning();

    // If the insert was a no-op (card already existed), fetch the existing one
    if (!card) {
      const [existing] = await db
        .select()
        .from(bingoCards)
        .where(and(eq(bingoCards.userId, data.userId), eq(bingoCards.month, data.month)));
      return existing;
    }

    return card;
  }

  async updateBingoProgress(cardId: string, completedSquares: number[]): Promise<BingoCard> {
    const [card] = await db
      .update(bingoCards)
      .set({ completedSquares })
      .where(eq(bingoCards.id, cardId))
      .returning();
    return card;
  }

  async checkAndUpdateBingoProgress(
    userId: string, month: string,
  ): Promise<{ completedSquares: number[]; hasBlackout: boolean }> {
    const card = await this.getBingoCard(userId, month);
    if (!card) return { completedSquares: [], hasBlackout: false };

    const [year, mon] = month.split('-').map(Number);
    // Use Date.UTC to ensure month boundaries are computed in UTC, consistent with
    // how loggedAt is stored and queried throughout the codebase
    const monthStart = new Date(Date.UTC(year, mon - 1, 1));
    const monthEnd = new Date(Date.UTC(year, mon, 1));

    // Fetch all user entries for this month
    const entries = await db
      .select()
      .from(deuceEntries)
      .where(and(
        eq(deuceEntries.userId, userId),
        gte(deuceEntries.loggedAt, monthStart),
        lt(deuceEntries.loggedAt, monthEnd),
      ));

    // Fetch user info
    const user = await this.getUser(userId);

    // Fetch user groups
    const userGroupsRaw = await db
      .select({ id: groups.id, currentStreak: groups.currentStreak })
      .from(groupMembers)
      .innerJoin(groups, eq(groups.id, groupMembers.groupId))
      .where(eq(groupMembers.userId, userId));

    // Fetch reaction counts for user's entries this month
    const entryIds = entries.map(e => e.id);
    const reactionCounts = new Map<string, number>();
    if (entryIds.length > 0) {
      const reactionRows = await db
        .select({ entryId: reactions.entryId, cnt: count() })
        .from(reactions)
        .where(inArray(reactions.entryId, entryIds))
        .groupBy(reactions.entryId);
      for (const r of reactionRows) reactionCounts.set(r.entryId, Number(r.cnt));
    }

    const squares = card.squares as BingoSquare[];
    const prevCompleted = new Set<number>((card.completedSquares as number[]) || []);
    const newCompleted = new Set<number>(prevCompleted);

    for (let i = 0; i < squares.length; i++) {
      if (prevCompleted.has(i)) continue; // already completed, never un-complete
      const square = squares[i];
      const achieved = evaluateBingoCondition(
        square.condition_type, square.condition_value,
        entries, userGroupsRaw, user, reactionCounts,
      );
      if (achieved) newCompleted.add(i);
    }

    const completedSquares = Array.from(newCompleted).sort((a, b) => a - b);
    const hasBlackout = completedSquares.length === 25;

    await this.updateBingoProgress(card.id, completedSquares);

    // Record blackout completion if just achieved
    if (hasBlackout && prevCompleted.size < 25) {
      const existing = await db
        .select()
        .from(bingoCompletions)
        .where(and(eq(bingoCompletions.userId, userId), eq(bingoCompletions.cardId, card.id)));
      if (existing.length === 0) {
        await db.insert(bingoCompletions).values({ userId, cardId: card.id });
      }
    }

    return { completedSquares, hasBlackout };
  }

  async getBingoLeaderboard(
    groupIds: string[], month: string,
  ): Promise<{
    userId: string; username: string | null;
    profileImageUrl: string | null; completedCount: number;
  }[]> {
    if (groupIds.length === 0) return [];

    // Get all member IDs in these groups (one query)
    const members = await db
      .selectDistinct({ userId: groupMembers.userId })
      .from(groupMembers)
      .where(inArray(groupMembers.groupId, groupIds));

    const memberIds = members.map(m => m.userId);
    if (memberIds.length === 0) return [];

    // Fetch bingo cards + user info in a single JOIN query (two fewer round-trips than before)
    const rows = await db
      .select({
        userId: bingoCards.userId,
        username: users.username,
        profileImageUrl: users.profileImageUrl,
        completedSquares: bingoCards.completedSquares,
      })
      .from(bingoCards)
      .innerJoin(users, and(eq(bingoCards.userId, users.id), isNull(users.deletedAt)))
      .where(and(inArray(bingoCards.userId, memberIds), eq(bingoCards.month, month)));

    return rows
      .map(row => ({
        userId: row.userId,
        username: row.username ?? null,
        profileImageUrl: row.profileImageUrl ?? null,
        completedCount: ((row.completedSquares as number[]) || []).length,
      }))
      .sort((a, b) => b.completedCount - a.completedCount);
  }

  async softDeleteUser(userId: string): Promise<void> {
    // Cascade: remove group memberships, push tokens, reactions, and anonymize entries for GDPR
    // Wrapped in a transaction to ensure all-or-nothing consistency
    await db.transaction(async (tx) => {
      // Group ownership: for each group this user created, transfer ownership to the
      // oldest remaining member. If the user is the sole member, delete the group outright
      // (cascade will remove groupMembers/entries/invites for that group automatically).
      const ownedGroups = await tx
        .select({ id: groups.id })
        .from(groups)
        .where(eq(groups.createdBy, userId));

      for (const group of ownedGroups) {
        // Find oldest remaining member who is NOT the user being deleted
        const [nextOwner] = await tx
          .select({ userId: groupMembers.userId })
          .from(groupMembers)
          .where(and(eq(groupMembers.groupId, group.id), sql`${groupMembers.userId} != ${userId}`))
          .orderBy(groupMembers.joinedAt)
          .limit(1);

        if (nextOwner) {
          // Transfer ownership to next oldest member
          await tx
            .update(groups)
            .set({ createdBy: nextOwner.userId, updatedAt: new Date() })
            .where(eq(groups.id, group.id));
        } else {
          // No other members — delete the orphaned group (cascade handles members/entries/invites)
          await tx.delete(groups).where(eq(groups.id, group.id));
        }
      }

      await tx
        .delete(groupMembers)
        .where(eq(groupMembers.userId, userId));

      // Remove invites created by this user so they can't be used after deletion
      await tx
        .delete(invites)
        .where(eq(invites.createdBy, userId));

      await tx
        .delete(pushTokens)
        .where(eq(pushTokens.userId, userId));

      await tx
        .delete(reactions)
        .where(eq(reactions.userId, userId));

      // GDPR cascade: remove referral records — these link two users and must not outlive either
      await tx
        .delete(referrals)
        .where(or(eq(referrals.referrerId, userId), eq(referrals.refereeId, userId)));

      // GDPR cascade: remove challenge completion records
      await tx
        .delete(challengeCompletions)
        .where(eq(challengeCompletions.userId, userId));

      // GDPR cascade: remove bingo completions before cards (FK dependency)
      await tx
        .delete(bingoCompletions)
        .where(eq(bingoCompletions.userId, userId));

      // GDPR cascade: remove bingo cards
      await tx
        .delete(bingoCards)
        .where(eq(bingoCards.userId, userId));

      // GDPR cascade: remove passport stamps (location data is PII)
      await tx
        .delete(passportStamps)
        .where(eq(passportStamps.userId, userId));

      // GDPR cascade: anonymize all entries — clear personal content (thoughts, photo, location)
      await tx
        .update(deuceEntries)
        .set({ thoughts: "", location: "deleted", photoUrl: null })
        .where(eq(deuceEntries.userId, userId));

      await tx
        .update(users)
        .set({
          email: null,
          firstName: null,
          lastName: null,
          username: `deleted_${userId.slice(0, 8)}`,
          profileImageUrl: null,
          deletedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));
    });
  }

  // --- Passport Stamps ---

  async upsertPassportStamp(
    userId: string,
    city: string,
    country: string,
    region: string | null,
    countryCode: string | null,
    latitude: string,
    longitude: string,
  ): Promise<PassportStamp> {
    // Try to find existing stamp for this user+city+country
    const [existing] = await db
      .select()
      .from(passportStamps)
      .where(
        and(
          eq(passportStamps.userId, userId),
          eq(passportStamps.city, city),
          eq(passportStamps.country, country),
        ),
      );

    if (existing) {
      const [updated] = await db
        .update(passportStamps)
        .set({
          entryCount: existing.entryCount + 1,
          lastVisitAt: new Date(),
        })
        .where(eq(passportStamps.id, existing.id))
        .returning();
      return updated;
    }

    const [stamp] = await db
      .insert(passportStamps)
      .values({
        userId,
        city,
        country,
        region,
        countryCode,
        latitude,
        longitude,
        entryCount: 1,
        firstVisitAt: new Date(),
        lastVisitAt: new Date(),
      })
      .returning();
    return stamp;
  }

  async getPassportStamps(userId: string): Promise<PassportStamp[]> {
    return db
      .select()
      .from(passportStamps)
      .where(eq(passportStamps.userId, userId))
      .orderBy(desc(passportStamps.lastVisitAt));
  }

  async getPassportStats(userId: string): Promise<{
    totalCities: number;
    totalCountries: number;
    totalStampedDeuces: number;
  }> {
    const [result] = await db
      .select({
        totalCities: count(),
        totalCountries: sql<number>`COUNT(DISTINCT ${passportStamps.country})`,
        totalStampedDeuces: sql<number>`COALESCE(SUM(${passportStamps.entryCount}), 0)`,
      })
      .from(passportStamps)
      .where(eq(passportStamps.userId, userId));

    return {
      totalCities: result?.totalCities ?? 0,
      totalCountries: Number(result?.totalCountries ?? 0),
      totalStampedDeuces: Number(result?.totalStampedDeuces ?? 0),
    };
  }

  async deletePassportStamps(userId: string): Promise<void> {
    await db
      .delete(passportStamps)
      .where(eq(passportStamps.userId, userId));
  }

  // --- Deuce King Challenge methods ---

  async getCurrentKing(groupId: string): Promise<(DeuceKing & { user: User | undefined }) | null> {
    const now = new Date();
    const [king] = await db
      .select()
      .from(deuceKings)
      .where(
        and(
          eq(deuceKings.groupId, groupId),
          lte(deuceKings.periodStart, now),
          gt(deuceKings.periodEnd, now),
        ),
      )
      .orderBy(desc(deuceKings.periodStart))
      .limit(1);

    if (!king) return null;
    const [user] = await db.select().from(users).where(eq(users.id, king.userId)).limit(1);
    return { ...king, user };
  }

  async getActiveChallenge(groupId: string): Promise<(Challenge & { completionCount: number }) | null> {
    const now = new Date();
    const [challenge] = await db
      .select()
      .from(challenges)
      .where(
        and(
          eq(challenges.groupId, groupId),
          lte(challenges.periodStart, now),
          gt(challenges.periodEnd, now),
        ),
      )
      .orderBy(desc(challenges.periodStart))
      .limit(1);

    if (!challenge) return null;

    const [{ completionCount }] = await db
      .select({ completionCount: count() })
      .from(challengeCompletions)
      .where(eq(challengeCompletions.challengeId, challenge.id));

    return { ...challenge, completionCount: completionCount ?? 0 };
  }

  async getChallengeWithMemberProgress(groupId: string): Promise<{
    challenge: Challenge | null;
    completions: ChallengeCompletion[];
    memberCount: number;
  }> {
    const now = new Date();
    const [challenge] = await db
      .select()
      .from(challenges)
      .where(
        and(
          eq(challenges.groupId, groupId),
          lte(challenges.periodStart, now),
          gt(challenges.periodEnd, now),
        ),
      )
      .orderBy(desc(challenges.periodStart))
      .limit(1);

    if (!challenge) {
      const [{ memberCount }] = await db
        .select({ memberCount: count() })
        .from(groupMembers)
        .where(eq(groupMembers.groupId, groupId));
      return { challenge: null, completions: [], memberCount: memberCount ?? 0 };
    }

    const completions = await db
      .select()
      .from(challengeCompletions)
      .where(eq(challengeCompletions.challengeId, challenge.id));

    const [{ memberCount }] = await db
      .select({ memberCount: count() })
      .from(groupMembers)
      .where(eq(groupMembers.groupId, groupId));

    return { challenge, completions, memberCount: memberCount ?? 0 };
  }

  async createChallenge(data: InsertChallenge): Promise<Challenge> {
    const [challenge] = await db.insert(challenges).values(data).returning();
    return challenge;
  }

  async getChallenge(challengeId: number): Promise<Challenge | null> {
    const [challenge] = await db
      .select()
      .from(challenges)
      .where(eq(challenges.id, challengeId))
      .limit(1);
    return challenge ?? null;
  }

  async getChallengeHistory(groupId: string, limit = 10): Promise<{
    king: DeuceKing & { user: User | undefined };
    challenge: Challenge | null;
    completionCount: number;
  }[]> {
    const now = new Date();
    const pastKings = await db
      .select()
      .from(deuceKings)
      .where(
        and(
          eq(deuceKings.groupId, groupId),
          lt(deuceKings.periodEnd, now),
        ),
      )
      .orderBy(desc(deuceKings.periodStart))
      .limit(limit);

    const result = [];
    for (const king of pastKings) {
      const [user] = await db.select().from(users).where(eq(users.id, king.userId)).limit(1);
      const [challenge] = await db
        .select()
        .from(challenges)
        .where(
          and(
            eq(challenges.groupId, groupId),
            eq(challenges.deuceKingId, king.id),
          ),
        )
        .limit(1);

      const completionCount = challenge
        ? (await db
            .select({ c: count() })
            .from(challengeCompletions)
            .where(eq(challengeCompletions.challengeId, challenge.id)))[0]?.c ?? 0
        : 0;

      result.push({ king: { ...king, user }, challenge: challenge ?? null, completionCount });
    }
    return result;
  }

  async createDeuceKing(data: InsertDeuceKing): Promise<DeuceKing> {
    const [king] = await db.insert(deuceKings).values(data).returning();
    return king;
  }

  async getLatestKingForGroup(groupId: string): Promise<DeuceKing | null> {
    const [king] = await db
      .select()
      .from(deuceKings)
      .where(eq(deuceKings.groupId, groupId))
      .orderBy(desc(deuceKings.periodStart))
      .limit(1);
    return king ?? null;
  }

  async getGroupLogCountsForPeriod(
    groupId: string,
    periodStart: Date,
    periodEnd: Date,
  ): Promise<{ userId: string; logCount: number; firstLogAt: Date | null }[]> {
    const rows = await db
      .select({
        userId: deuceEntries.userId,
        logCount: count(),
        firstLogAt: sql<Date>`MIN(${deuceEntries.loggedAt})`,
      })
      .from(deuceEntries)
      .where(
        and(
          eq(deuceEntries.groupId, groupId),
          gte(deuceEntries.loggedAt, periodStart),
          lt(deuceEntries.loggedAt, periodEnd),
        ),
      )
      .groupBy(deuceEntries.userId);

    return rows.map((r) => ({
      userId: r.userId,
      logCount: r.logCount,
      firstLogAt: r.firstLogAt,
    }));
  }

  async getUserStreakInGroup(userId: string, groupId: string): Promise<number> {
    // Count consecutive days with at least one log up to now
    const entries = await db
      .select({ loggedAt: deuceEntries.loggedAt })
      .from(deuceEntries)
      .where(and(eq(deuceEntries.userId, userId), eq(deuceEntries.groupId, groupId)))
      .orderBy(desc(deuceEntries.loggedAt));

    if (entries.length === 0) return 0;

    const days = new Set(entries.map((e) => e.loggedAt.toISOString().slice(0, 10)));
    const sortedDays = Array.from(days).sort().reverse();

    let streak = 0;
    let prev: string | null = null;
    for (const day of sortedDays) {
      if (prev === null) {
        streak = 1;
        prev = day;
        continue;
      }
      const d1 = new Date(prev);
      const d2 = new Date(day);
      const diff = Math.round((d1.getTime() - d2.getTime()) / 86400000);
      if (diff === 1) {
        streak++;
        prev = day;
      } else {
        break;
      }
    }
    return streak;
  }

  async getAllGroupIds(): Promise<string[]> {
    const rows = await db.select({ id: groups.id }).from(groups);
    return rows.map((r) => r.id);
  }

  async addChallengeCompletion(challengeId: number, userId: string): Promise<ChallengeCompletion | null> {
    try {
      const [completion] = await db
        .insert(challengeCompletions)
        .values({ challengeId, userId })
        .returning();
      return completion;
    } catch {
      return null; // unique constraint violation = already completed
    }
  }

  async getUserChallengeCompletion(challengeId: number, userId: string): Promise<ChallengeCompletion | null> {
    const [completion] = await db
      .select()
      .from(challengeCompletions)
      .where(
        and(
          eq(challengeCompletions.challengeId, challengeId),
          eq(challengeCompletions.userId, userId),
        ),
      )
      .limit(1);
    return completion ?? null;
  }

  async getExistingChallengeForKing(deuceKingId: number): Promise<Challenge | null> {
    const [challenge] = await db
      .select()
      .from(challenges)
      .where(eq(challenges.deuceKingId, deuceKingId))
      .limit(1);
    return challenge ?? null;
  }

  // --- Battle Shits ---

  async createBattleMatch(match: InsertBattleMatch): Promise<BattleMatch> {
    const [created] = await db.insert(battleMatches).values(match).returning();
    return created;
  }

  async getBattleMatch(matchId: string): Promise<BattleMatch | null> {
    const [match] = await db.select().from(battleMatches).where(eq(battleMatches.id, matchId)).limit(1);
    return match ?? null;
  }

  async getUserActiveMatches(userId: string): Promise<BattleMatch[]> {
    return db
      .select()
      .from(battleMatches)
      .where(
        and(
          or(eq(battleMatches.challengerId, userId), eq(battleMatches.opponentId, userId)),
          inArray(battleMatches.status, ["pending", "placement", "active"]),
        ),
      )
      .orderBy(desc(battleMatches.createdAt));
  }

  async getGroupMatches(groupId: string, limit: number): Promise<BattleMatch[]> {
    return db
      .select()
      .from(battleMatches)
      .where(eq(battleMatches.groupId, groupId))
      .orderBy(desc(battleMatches.createdAt))
      .limit(limit);
  }

  async updateBattleMatchStatus(matchId: string, status: string, winnerId?: string): Promise<void> {
    await db
      .update(battleMatches)
      .set({ status, ...(winnerId ? { winnerId } : {}) })
      .where(eq(battleMatches.id, matchId));
  }

  async placeShips(
    matchId: string,
    userId: string,
    ships: { shipType: string; cells: { col: number; row: number }[] }[],
  ): Promise<void> {
    const values = ships.map((s) => ({
      matchId,
      userId,
      shipType: s.shipType,
      cells: s.cells,
    }));
    await db.insert(battleShips).values(values).onConflictDoNothing();
  }

  async getShips(matchId: string, userId: string): Promise<BattleShip[]> {
    return db
      .select()
      .from(battleShips)
      .where(and(eq(battleShips.matchId, matchId), eq(battleShips.userId, userId)));
  }

  async createAttack(
    matchId: string,
    attackerId: string,
    col: number,
    row: number,
    isHit: boolean,
  ): Promise<BattleAttack> {
    const [attack] = await db
      .insert(battleAttacks)
      .values({ matchId, attackerId, col, row, isHit })
      .returning();
    return attack;
  }

  async getAttacks(matchId: string): Promise<BattleAttack[]> {
    return db.select().from(battleAttacks).where(eq(battleAttacks.matchId, matchId));
  }

  async getAttacksByUser(matchId: string, userId: string): Promise<BattleAttack[]> {
    return db
      .select()
      .from(battleAttacks)
      .where(and(eq(battleAttacks.matchId, matchId), eq(battleAttacks.attackerId, userId)));
  }

  async markShipSunk(shipId: number): Promise<void> {
    await db.update(battleShips).set({ isSunk: true }).where(eq(battleShips.id, shipId));
  }

  async createBattleToken(
    matchId: string,
    userId: string,
    deuceEntryId: string,
    tokenType: string,
  ): Promise<void> {
    await db
      .insert(battleTokens)
      .values({ matchId, userId, deuceEntryId, tokenType })
      .onConflictDoNothing();
  }

  async getTokenBalance(matchId: string, userId: string): Promise<{ earned: number; spent: number }> {
    const tokens = await db
      .select()
      .from(battleTokens)
      .where(and(eq(battleTokens.matchId, matchId), eq(battleTokens.userId, userId)));
    const earned = tokens.length;
    // Spent = number of attacks fired by this user
    const attacks = await this.getAttacksByUser(matchId, userId);
    return { earned, spent: attacks.length };
  }

  async earnPowerup(matchId: string, userId: string, type: string): Promise<void> {
    await db
      .insert(battlePowerups)
      .values({ matchId, userId, powerupType: type })
      .onConflictDoNothing();
  }

  async usePowerup(
    matchId: string,
    userId: string,
    type: string,
    revealedCell?: { col: number; row: number },
  ): Promise<void> {
    await db
      .update(battlePowerups)
      .set({ usedAt: new Date(), revealedCell: revealedCell ?? null })
      .where(
        and(
          eq(battlePowerups.matchId, matchId),
          eq(battlePowerups.userId, userId),
          eq(battlePowerups.powerupType, type),
        ),
      );
  }

  async getPowerups(matchId: string, userId: string): Promise<BattlePowerup[]> {
    return db
      .select()
      .from(battlePowerups)
      .where(and(eq(battlePowerups.matchId, matchId), eq(battlePowerups.userId, userId)));
  }

  async awardBadge(
    userId: string,
    badgeType: string,
    matchId?: string,
    expiresAt?: Date,
  ): Promise<void> {
    await db.insert(battleBadges).values({
      userId,
      badgeType,
      matchId: matchId ?? null,
      expiresAt: expiresAt ?? null,
    });
  }

  async getUserBattleBadges(userId: string): Promise<BattleBadge[]> {
    return db.select().from(battleBadges).where(eq(battleBadges.userId, userId));
  }

  async getBattleLeaderboard(
    groupId: string,
    seasonStart: Date,
  ): Promise<{ userId: string; username: string | null; profileImageUrl: string | null; wins: number }[]> {
    const rows = await db
      .select({
        userId: battleMatches.winnerId,
        wins: count(),
      })
      .from(battleMatches)
      .where(
        and(
          eq(battleMatches.groupId, groupId),
          eq(battleMatches.status, "completed"),
          gte(battleMatches.createdAt, seasonStart),
        ),
      )
      .groupBy(battleMatches.winnerId);

    // Enrich with user info
    const results = [];
    for (const r of rows) {
      if (!r.userId) continue;
      const [user] = await db
        .select({ username: users.username, profileImageUrl: users.profileImageUrl })
        .from(users)
        .where(eq(users.id, r.userId))
        .limit(1);
      results.push({
        userId: r.userId,
        username: user?.username ?? null,
        profileImageUrl: user?.profileImageUrl ?? null,
        wins: r.wins,
      });
    }
    return results.sort((a, b) => b.wins - a.wins);
  }

  async getBattleStats(
    userId: string,
  ): Promise<{ wins: number; losses: number; totalMatches: number; hitRate: number; tokensEarned: number }> {
    const matches = await db
      .select()
      .from(battleMatches)
      .where(
        and(
          or(eq(battleMatches.challengerId, userId), eq(battleMatches.opponentId, userId)),
          eq(battleMatches.status, "completed"),
        ),
      );

    const wins = matches.filter((m) => m.winnerId === userId).length;
    const losses = matches.length - wins;

    const allAttacks = await db
      .select()
      .from(battleAttacks)
      .where(eq(battleAttacks.attackerId, userId));

    const hits = allAttacks.filter((a) => a.isHit).length;
    const hitRate = allAttacks.length > 0 ? hits / allAttacks.length : 0;

    const tokens = await db
      .select({ c: count() })
      .from(battleTokens)
      .where(eq(battleTokens.userId, userId));

    return {
      wins,
      losses,
      totalMatches: matches.length,
      hitRate,
      tokensEarned: tokens[0]?.c ?? 0,
    };
  }
}

export const storage = new DatabaseStorage();
