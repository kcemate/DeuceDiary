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
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, count, sql, inArray, gte, lt, isNull } from "drizzle-orm";

/** Internal helper — today as YYYY-MM-DD in UTC */
function getTodayStorageUTC(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Evaluate a single bingo square condition against user data */
function evaluateBingoCondition(
  conditionType: string,
  conditionValue: number,
  entries: { loggedAt: Date; bristolScore: number | null; thoughts: string; photoUrl: string | null; location: string }[],
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
    case 'photo_count': {
      const c = entries.filter(e => e.photoUrl !== null).length;
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
  addGroupMember(member: InsertGroupMember): Promise<GroupMember>;
  getGroupMembers(groupId: string): Promise<(GroupMember & { user: User & { personalRecord?: { date: string; count: number } } })[]>;
  isUserInGroup(userId: string, groupId: string): Promise<boolean>;
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
  
  // Location operations
  getLocations(): Promise<Location[]>;
  getLocationsForUser(userId: string): Promise<Location[]>;
  createLocation(location: InsertLocation): Promise<Location>;
  getLocationByName(name: string): Promise<Location | undefined>;
  
  // Personal records
  getUserPersonalRecord(userId: string): Promise<{ date: string; count: number } | undefined>;
  
  // Reaction operations
  addReaction(reaction: InsertReaction): Promise<Reaction>;
  removeReaction(userId: string, entryId: string, emoji: string): Promise<void>;
  getEntryReactions(entryId: string): Promise<(Reaction & { user: User })[]>;

  // Feed operations
  getFeedEntries(groupIds: string[], limit: number, offset?: number): Promise<(DeuceEntry & { user: Pick<User, 'id' | 'username' | 'profileImageUrl'>; reactions: Reaction[] })[]>;

  // Streak operations
  getGroupStreak(groupId: string): Promise<{ currentStreak: number; longestStreak: number; lastStreakDate: string | null }>;
  getGroupStreaksBatch(groupIds: string[]): Promise<Map<string, { currentStreak: number; longestStreak: number; lastStreakDate: string | null }>>;
  updateGroupStreak(groupId: string, currentStreak: number, longestStreak: number, lastStreakDate: string): Promise<void>;
  getMembersLogStatusToday(groupId: string, todayUTC: string): Promise<{ userId: string; username: string | null; firstName: string | null; profileImageUrl: string | null; hasLogged: boolean }[]>;

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
  getUserSubscription(userId: string): Promise<{ subscription: string; subscriptionExpiresAt: Date | null; streakInsuranceUsed: boolean }>;
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
  getReferralStats(userId: string): Promise<{ referralCount: number; referrals: { username: string | null; joinedAt: Date | null }[] }>;

  // Referral dashboard
  getReferralDashboardStats(userId: string): Promise<{ totalReferrals: number; premiumConversions: number; pendingConversions: number }>;
  getReferralLeaderboard(): Promise<{ username: string | null; profileImageUrl: string | null; referralCount: number; premiumConversionCount: number }[]>;

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

  // Bingo operations
  getBingoCard(userId: string, month: string): Promise<BingoCard | undefined>;
  createBingoCard(data: InsertBingoCard): Promise<BingoCard>;
  updateBingoProgress(cardId: string, completedSquares: number[]): Promise<BingoCard>;
  checkAndUpdateBingoProgress(userId: string, month: string): Promise<{ completedSquares: number[]; hasBlackout: boolean }>;
  getBingoLeaderboard(groupIds: string[], month: string): Promise<{ userId: string; username: string | null; profileImageUrl: string | null; completedCount: number }[]>;
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
      .where(eq(users.id, userId))
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
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Group operations
  async createGroup(group: InsertGroup): Promise<Group> {
    const [newGroup] = await db.insert(groups).values(group).returning();
    
    // Add creator as admin
    await db.insert(groupMembers).values({
      groupId: newGroup.id,
      userId: group.createdBy,
      role: "admin",
    });
    
    return newGroup;
  }

  async getUserGroups(userId: string): Promise<(Group & { memberCount: number; entryCount: number; lastActivity?: Date })[]> {
    try {
      console.log("Getting groups for user:", userId);
      
      // First, get all groups the user is a member of
      const userGroupMemberships = await db
        .select({
          groupId: groupMembers.groupId,
        })
        .from(groupMembers)
        .where(eq(groupMembers.userId, userId));
      
      console.log("User group memberships:", userGroupMemberships);
      
      if (userGroupMemberships.length === 0) {
        return [];
      }
      
      const groupIds = userGroupMemberships.map(m => m.groupId);
      
      // Get group details with counts
      const userGroups = await db
        .select({
          group: groups,
          memberCount: sql<number>`COUNT(DISTINCT ${groupMembers.id})`,
          entryCount: sql<number>`COUNT(DISTINCT ${deuceEntries.id})`,
          lastActivity: sql<Date>`MAX(${deuceEntries.createdAt})`,
        })
        .from(groups)
        .leftJoin(groupMembers, eq(groups.id, groupMembers.groupId))
        .leftJoin(deuceEntries, eq(groups.id, deuceEntries.groupId))
        .where(inArray(groups.id, groupIds))
        .groupBy(groups.id)
        .orderBy(desc(sql`MAX(${deuceEntries.createdAt})`));

      console.log("User groups with counts:", userGroups);

      return userGroups.map(row => ({
        ...row.group,
        memberCount: Number(row.memberCount),
        entryCount: Number(row.entryCount),
        lastActivity: row.lastActivity,
      }));
    } catch (error) {
      console.error("Error in getUserGroups:", error);
      throw error;
    }
  }

  async getGroupById(groupId: string): Promise<Group | undefined> {
    const [group] = await db.select().from(groups).where(eq(groups.id, groupId));
    return group;
  }

  async addGroupMember(member: InsertGroupMember): Promise<GroupMember> {
    const [newMember] = await db.insert(groupMembers).values(member).returning();
    return newMember;
  }

  async getGroupMembers(groupId: string): Promise<(GroupMember & { user: User & { personalRecord?: { date: string; count: number } } })[]> {
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

    // Batch personal records for all member userIds in one query
    const userIds = rows.map((r) => r.member.userId);
    const records = await db
      .select({
        userId: deuceEntries.userId,
        date: sql<string>`DATE(${deuceEntries.createdAt})`,
        count: sql<number>`COUNT(*)::int`,
      })
      .from(deuceEntries)
      .where(inArray(deuceEntries.userId, userIds))
      .groupBy(deuceEntries.userId, sql`DATE(${deuceEntries.createdAt})`)
      .orderBy(deuceEntries.userId, desc(sql<number>`COUNT(*)::int`));

    // Keep only the top record per user (first occurrence due to ORDER BY)
    const personalRecordMap = new Map<string, { date: string; count: number }>();
    for (const r of records) {
      if (!personalRecordMap.has(r.userId)) {
        personalRecordMap.set(r.userId, { date: r.date, count: r.count });
      }
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
    const result = await db
      .select({
        date: sql<string>`DATE(${deuceEntries.createdAt})`,
        count: count(deuceEntries.id),
      })
      .from(deuceEntries)
      .where(eq(deuceEntries.userId, userId))
      .groupBy(sql`DATE(${deuceEntries.createdAt})`)
      .orderBy(desc(sql`DATE(${deuceEntries.createdAt})`));

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

  async getGroupPreview(groupId: string): Promise<{ name: string; memberCount: number; deuceCount: number } | undefined> {
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

  async getLocationByName(name: string): Promise<Location | undefined> {
    const [location] = await db.select().from(locations).where(eq(locations.name, name));
    return location;
  }

  // Personal records
  async getUserPersonalRecord(userId: string): Promise<{ date: string; count: number } | undefined> {
    const result = await db
      .select({
        date: sql<string>`DATE(${deuceEntries.createdAt})`,
        count: sql<number>`COUNT(*)::int`,
      })
      .from(deuceEntries)
      .where(eq(deuceEntries.userId, userId))
      .groupBy(sql`DATE(${deuceEntries.createdAt})`)
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
    const entryReactions = await db
      .select()
      .from(reactions)
      .leftJoin(users, eq(reactions.userId, users.id))
      .where(and(eq(reactions.entryId, entryId), isNull(users.deletedAt)))
      .orderBy(reactions.createdAt);

    return entryReactions.map(row => ({
      ...row.reactions,
      user: row.users!,
    }));
  }

  // Feed operations
  async getFeedEntries(groupIds: string[], limit: number, offset = 0): Promise<(DeuceEntry & { user: Pick<User, 'id' | 'username' | 'profileImageUrl'>; reactions: Reaction[] })[]> {
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
  async getGroupStreak(groupId: string): Promise<{ currentStreak: number; longestStreak: number; lastStreakDate: string | null }> {
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

  async getGroupStreaksBatch(groupIds: string[]): Promise<Map<string, { currentStreak: number; longestStreak: number; lastStreakDate: string | null }>> {
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
      result.set(row.id, { currentStreak: row.currentStreak, longestStreak: row.longestStreak, lastStreakDate: row.lastStreakDate });
    }
    return result;
  }

  async updateGroupStreak(groupId: string, currentStreak: number, longestStreak: number, lastStreakDate: string): Promise<void> {
    await db
      .update(groups)
      .set({ currentStreak, longestStreak, lastStreakDate, updatedAt: new Date() })
      .where(eq(groups.id, groupId));
  }

  async getMembersLogStatusToday(groupId: string, todayUTC: string): Promise<{ userId: string; username: string | null; firstName: string | null; email: string | null; profileImageUrl: string | null; hasLogged: boolean }[]> {
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
    const members = await db
      .select({ userId: groupMembers.userId })
      .from(groupMembers)
      .where(eq(groupMembers.groupId, groupId));
    if (members.length === 0) return [];
    const memberIds = members.map(m => m.userId);
    return await db
      .select()
      .from(pushTokens)
      .where(inArray(pushTokens.userId, memberIds));
  }

  // Broadcast operations
  async createBroadcast(broadcast: InsertBroadcast): Promise<Broadcast> {
    const [newBroadcast] = await db.insert(broadcasts).values(broadcast).returning();
    return newBroadcast;
  }

  // Daily challenge operations
  async getDailyChallengeCompletion(userId: string, challengeDate: string): Promise<DailyChallengeCompletion | undefined> {
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
      .where(eq(users.id, userId))
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
        date: sql<string>`DATE(${deuceEntries.loggedAt})`,
        count: sql<number>`COUNT(*)::int`,
      })
      .from(deuceEntries)
      .where(eq(deuceEntries.userId, userId))
      .groupBy(sql`DATE(${deuceEntries.loggedAt})`)
      .orderBy(desc(sql<number>`COUNT(*)::int`))
      .limit(1);
    return rows.length > 0 ? rows[0] : undefined;
  }

  // Theme operations
  async updateUserTheme(userId: string, theme: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ theme, updatedAt: new Date() })
      .where(eq(users.id, userId))
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

  async getUserSubscription(userId: string): Promise<{ subscription: string; subscriptionExpiresAt: Date | null; streakInsuranceUsed: boolean }> {
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
  }> {
    // Total deuces (all time, deduplicated — count distinct loggedAt timestamps)
    const [totalResult] = await db
      .select({ total: sql<number>`COUNT(*)::int` })
      .from(deuceEntries)
      .where(eq(deuceEntries.userId, userId));
    const totalDeuces = totalResult?.total ?? 0;

    // Avg per week: total / weeks since first entry (min 1 week)
    const [firstEntry] = await db
      .select({ earliest: sql<Date>`MIN(${deuceEntries.createdAt})` })
      .from(deuceEntries)
      .where(eq(deuceEntries.userId, userId));
    const weeks = firstEntry?.earliest
      ? Math.max(1, (Date.now() - new Date(firstEntry.earliest).getTime()) / (7 * 24 * 60 * 60 * 1000))
      : 1;
    const avgPerWeek = Math.round((totalDeuces / weeks) * 10) / 10;

    // Longest streak & current streak across user's groups
    const userGroupIds = await db
      .select({ groupId: groupMembers.groupId })
      .from(groupMembers)
      .where(eq(groupMembers.userId, userId));
    let longestStreak = 0;
    let currentStreak = 0;
    if (userGroupIds.length > 0) {
      const gids = userGroupIds.map(g => g.groupId);
      const [streakResult] = await db
        .select({
          maxLongest: sql<number>`COALESCE(MAX(${groups.longestStreak}), 0)::int`,
          maxCurrent: sql<number>`COALESCE(MAX(${groups.currentStreak}), 0)::int`,
        })
        .from(groups)
        .where(inArray(groups.id, gids));
      longestStreak = streakResult?.maxLongest ?? 0;
      currentStreak = streakResult?.maxCurrent ?? 0;
    }

    // Best day of the week (0=Sunday … 6=Saturday)
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const bestDayRows = await db
      .select({
        dow: sql<number>`EXTRACT(DOW FROM ${deuceEntries.loggedAt})::int`,
        cnt: sql<number>`COUNT(*)::int`,
      })
      .from(deuceEntries)
      .where(eq(deuceEntries.userId, userId))
      .groupBy(sql`EXTRACT(DOW FROM ${deuceEntries.loggedAt})`)
      .orderBy(desc(sql<number>`COUNT(*)::int`))
      .limit(1);
    const bestDay = bestDayRows.length > 0
      ? { day: dayNames[bestDayRows[0].dow] ?? "Unknown", count: bestDayRows[0].cnt }
      : { day: "N/A", count: 0 };

    // Group rankings — user's rank in each group by deuce count (single query)
    const groupRankings: { groupId: string; groupName: string; rank: number; total: number }[] = [];
    if (userGroupIds.length > 0) {
      const gids = userGroupIds.map(g => g.groupId);
      const rankingRows = await db.execute(sql`
        WITH member_counts AS (
          SELECT
            gm.group_id,
            gm.user_id,
            COUNT(de.id)::int AS cnt,
            RANK() OVER (PARTITION BY gm.group_id ORDER BY COUNT(de.id) DESC) AS rnk,
            COUNT(*) OVER (PARTITION BY gm.group_id) AS total_members
          FROM group_members gm
          LEFT JOIN deuce_entries de ON de.user_id = gm.user_id AND de.group_id = gm.group_id
          WHERE gm.group_id = ANY(${gids})
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
      `);
      for (const row of rankingRows.rows as { groupId: string; groupName: string; rank: number; total: number }[]) {
        groupRankings.push(row);
      }
    }

    // Avg Bristol score (all time, exclude nulls)
    const [bristolResult] = await db
      .select({ avg: sql<number>`ROUND(AVG(${deuceEntries.bristolScore})::numeric, 1)::float` })
      .from(deuceEntries)
      .where(and(eq(deuceEntries.userId, userId), sql`${deuceEntries.bristolScore} IS NOT NULL`));
    const avgBristolScore = bristolResult?.avg ?? null;

    // Most used location
    const locationRows = await db
      .select({ location: deuceEntries.location, cnt: sql<number>`COUNT(*)::int` })
      .from(deuceEntries)
      .where(eq(deuceEntries.userId, userId))
      .groupBy(deuceEntries.location)
      .orderBy(desc(sql<number>`COUNT(*)::int`))
      .limit(1);
    const mostUsedLocation = locationRows.length > 0 ? locationRows[0].location : null;

    return { totalDeuces, avgPerWeek, longestStreak, currentStreak, bestDay, groupRankings, avgBristolScore, mostUsedLocation };
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
  }> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setUTCDate(sevenDaysAgo.getUTCDate() - 7);
    const weekOf = sevenDaysAgo.toISOString().slice(0, 10);

    // 1. Total deuces in last 7 days
    const [totalResult] = await db
      .select({ total: sql<number>`COUNT(*)::int` })
      .from(deuceEntries)
      .where(and(eq(deuceEntries.userId, userId), gte(deuceEntries.createdAt, sevenDaysAgo)));
    const totalDeuces = totalResult?.total ?? 0;

    // 2. Peak day (day with most deuces)
    const peakDayRows = await db
      .select({
        date: sql<string>`DATE(${deuceEntries.createdAt})`,
        count: sql<number>`COUNT(*)::int`,
      })
      .from(deuceEntries)
      .where(and(eq(deuceEntries.userId, userId), gte(deuceEntries.createdAt, sevenDaysAgo)))
      .groupBy(sql`DATE(${deuceEntries.createdAt})`)
      .orderBy(desc(sql<number>`COUNT(*)::int`))
      .limit(1);
    const peakDay = peakDayRows.length > 0
      ? { date: peakDayRows[0].date, count: peakDayRows[0].count }
      : { date: weekOf, count: 0 };

    // 3. Most active squad (group with most deuces this week)
    const squadRows = await db
      .select({
        name: groups.name,
        count: sql<number>`COUNT(*)::int`,
      })
      .from(deuceEntries)
      .innerJoin(groups, eq(deuceEntries.groupId, groups.id))
      .where(and(eq(deuceEntries.userId, userId), gte(deuceEntries.createdAt, sevenDaysAgo)))
      .groupBy(groups.name)
      .orderBy(desc(sql<number>`COUNT(*)::int`))
      .limit(1);
    const mostActiveSquad = squadRows.length > 0
      ? { name: squadRows[0].name, count: squadRows[0].count }
      : { name: "None", count: 0 };

    // 4. Longest streak across user's groups
    const userGroupIds = await db
      .select({ groupId: groupMembers.groupId })
      .from(groupMembers)
      .where(eq(groupMembers.userId, userId));
    let longestStreak = 0;
    if (userGroupIds.length > 0) {
      const [streakResult] = await db
        .select({ maxStreak: sql<number>`MAX(${groups.longestStreak})::int` })
        .from(groups)
        .where(inArray(groups.id, userGroupIds.map(g => g.groupId)));
      longestStreak = streakResult?.maxStreak ?? 0;
    }

    // 5. Funniest entry (most reacted entry this week)
    const funnyRows = await db
      .select({
        thought: deuceEntries.thoughts,
        reactionCount: sql<number>`COUNT(${reactions.id})::int`,
      })
      .from(deuceEntries)
      .innerJoin(reactions, eq(deuceEntries.id, reactions.entryId))
      .where(and(eq(deuceEntries.userId, userId), gte(deuceEntries.createdAt, sevenDaysAgo)))
      .groupBy(deuceEntries.id, deuceEntries.thoughts)
      .orderBy(desc(sql<number>`COUNT(${reactions.id})::int`))
      .limit(1);
    const funniestEntry = funnyRows.length > 0
      ? { thought: funnyRows[0].thought, reactions: funnyRows[0].reactionCount }
      : null;

    // 6. Total reactions received this week
    const [reactionsResult] = await db
      .select({ total: sql<number>`COUNT(*)::int` })
      .from(reactions)
      .innerJoin(deuceEntries, eq(reactions.entryId, deuceEntries.id))
      .where(and(eq(deuceEntries.userId, userId), gte(deuceEntries.createdAt, sevenDaysAgo)));
    const totalReactionsReceived = reactionsResult?.total ?? 0;

    return {
      totalDeuces,
      peakDay,
      mostActiveSquad,
      longestStreak,
      funniestEntry,
      totalReactionsReceived,
      weekOf,
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
      ? { userId: mvpMember.userId, username: mvpMember.username, profileImageUrl: mvpMember.profileImageUrl, deuceCount: mvpMember.deucesThisWeek }
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
    const memberCount = memberRows.length;

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

    const isPremium = user.subscription === 'premium' && user.subscriptionExpiresAt && new Date(user.subscriptionExpiresAt) > new Date();
    const totalLogs = user.deuceCount ?? 0;
    const userGroupIds = await db.select({ groupId: groupMembers.groupId }).from(groupMembers).where(eq(groupMembers.userId, userId));
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
      { id: 'first_flush', name: 'First Flush', description: 'Logged your first deuce', emoji: '🚽', tier: 'free', condition: totalLogs >= 1 },
      { id: 'ten_club', name: 'Ten Club', description: 'Logged 10 deuces', emoji: '🔟', tier: 'free', condition: totalLogs >= 10 },
      { id: 'half_century', name: 'Half Century', description: 'Logged 50 deuces', emoji: '5️⃣0️⃣', tier: 'free', condition: totalLogs >= 50 },
      { id: 'centurion', name: 'Centurion', description: 'Logged 100 deuces', emoji: '💯', tier: 'free', condition: totalLogs >= 100 },
      { id: 'squad_up', name: 'Squad Up', description: 'Joined your first squad', emoji: '👥', tier: 'free', condition: squadCount >= 1 },
      { id: 'social_butterfly', name: 'Social Butterfly', description: 'Member of 3+ squads', emoji: '🦋', tier: 'free', condition: squadCount >= 3 },
      // Premium badges
      { id: 'gold_throne', name: 'Gold Throne', description: 'Premium subscriber', emoji: '👑', tier: 'premium', condition: !!isPremium },
      { id: 'streak_king', name: 'Streak King', description: 'Maintained a 7-day group streak', emoji: '🔥', tier: 'premium', condition: longestStreak >= 7 },
      { id: 'streak_legend', name: 'Streak Legend', description: 'Maintained a 30-day group streak', emoji: '🏆', tier: 'premium', condition: longestStreak >= 30 },
      { id: 'legend_tier', name: 'Legend', description: 'Logged 500 deuces', emoji: '🌟', tier: 'premium', condition: totalLogs >= 500 },
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
    // Set referredBy on referee
    await db
      .update(users)
      .set({ referredBy: referrerId, updatedAt: new Date() })
      .where(eq(users.id, refereeId));

    // Increment referrer's referralCount
    await db
      .update(users)
      .set({ referralCount: sql`${users.referralCount} + 1`, updatedAt: new Date() })
      .where(eq(users.id, referrerId));

    // Insert referral row
    const [referral] = await db
      .insert(referrals)
      .values({ referrerId, refereeId })
      .returning();
    return referral;
  }

  async getReferralStats(userId: string): Promise<{ referralCount: number; referrals: { username: string | null; joinedAt: Date | null }[] }> {
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
  async getReferralDashboardStats(userId: string): Promise<{ totalReferrals: number; premiumConversions: number; pendingConversions: number }> {
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

  async getReferralLeaderboard(): Promise<{ username: string | null; profileImageUrl: string | null; referralCount: number; premiumConversionCount: number }[]> {
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
          sql`${deuceEntries.createdAt} <= ${endOfDay}`
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

    const [[totalUsersRow], [premiumUsersRow], [dauRow], [logsToday], [logsAll], [activeGroupsRow], [avgStreakRow]] = await Promise.all([
      db.select({ count: sql<number>`COUNT(*)::int` }).from(users).where(isNull(users.deletedAt)),
      db.select({ count: sql<number>`COUNT(*)::int` }).from(users)
        .where(and(eq(users.subscription, 'premium'), sql`${users.subscriptionExpiresAt} > NOW()`, isNull(users.deletedAt))),
      db.select({ count: sql<number>`COUNT(DISTINCT ${deuceEntries.userId})::int` }).from(deuceEntries)
        .where(sql`DATE(${deuceEntries.loggedAt} AT TIME ZONE 'UTC') = ${today}`),
      db.select({ count: sql<number>`COUNT(*)::int` }).from(deuceEntries)
        .where(sql`DATE(${deuceEntries.loggedAt} AT TIME ZONE 'UTC') = ${today}`),
      db.select({ count: sql<number>`COUNT(*)::int` }).from(deuceEntries),
      db.select({ count: sql<number>`COUNT(DISTINCT ${deuceEntries.groupId})::int` }).from(deuceEntries)
        .where(gte(deuceEntries.createdAt, sevenDaysAgo)),
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

    // Current streak per member: count consecutive days (most recent streak)
    const today = new Date().toISOString().slice(0, 10);
    const streakMap = new Map<string, number>();
    for (const userId of userIds) {
      // Get distinct logged dates for this user in this group, sorted desc
      const dateLogs = await db
        .select({
          date: sql<string>`DATE(${deuceEntries.loggedAt} AT TIME ZONE 'UTC')`,
        })
        .from(deuceEntries)
        .where(and(eq(deuceEntries.groupId, groupId), eq(deuceEntries.userId, userId)))
        .groupBy(sql`DATE(${deuceEntries.loggedAt} AT TIME ZONE 'UTC')`)
        .orderBy(desc(sql`DATE(${deuceEntries.loggedAt} AT TIME ZONE 'UTC')`));

      let streak = 0;
      let expected = today;
      for (const row of dateLogs) {
        if (row.date === expected) {
          streak++;
          const d = new Date(expected + 'T00:00:00Z');
          d.setUTCDate(d.getUTCDate() - 1);
          expected = d.toISOString().slice(0, 10);
        } else {
          break;
        }
      }
      streakMap.set(userId, streak);
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

  async createBingoCard(data: InsertBingoCard): Promise<BingoCard> {
    const [card] = await db.insert(bingoCards).values(data).returning();
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

  async checkAndUpdateBingoProgress(userId: string, month: string): Promise<{ completedSquares: number[]; hasBlackout: boolean }> {
    const card = await this.getBingoCard(userId, month);
    if (!card) return { completedSquares: [], hasBlackout: false };

    const [year, mon] = month.split('-').map(Number);
    const monthStart = new Date(year, mon - 1, 1);
    const monthEnd = new Date(year, mon, 1);

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
      const achieved = evaluateBingoCondition(square.condition_type, square.condition_value, entries, userGroupsRaw, user, reactionCounts);
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

  async getBingoLeaderboard(groupIds: string[], month: string): Promise<{ userId: string; username: string | null; profileImageUrl: string | null; completedCount: number }[]> {
    if (groupIds.length === 0) return [];

    // Get all user IDs in these groups
    const members = await db
      .selectDistinct({ userId: groupMembers.userId })
      .from(groupMembers)
      .where(inArray(groupMembers.groupId, groupIds));

    const memberIds = members.map(m => m.userId);
    if (memberIds.length === 0) return [];

    // Get bingo cards for this month
    const cards = await db
      .select()
      .from(bingoCards)
      .where(and(
        inArray(bingoCards.userId, memberIds),
        eq(bingoCards.month, month),
      ));

    // Get user info
    const userRows = await db
      .select({ id: users.id, username: users.username, profileImageUrl: users.profileImageUrl })
      .from(users)
      .where(inArray(users.id, memberIds));

    const userMap = new Map(userRows.map(u => [u.id, u]));

    const result = cards.map(card => ({
      userId: card.userId,
      username: userMap.get(card.userId)?.username ?? null,
      profileImageUrl: userMap.get(card.userId)?.profileImageUrl ?? null,
      completedCount: ((card.completedSquares as number[]) || []).length,
    }));

    return result.sort((a, b) => b.completedCount - a.completedCount);
  }

  async softDeleteUser(userId: string): Promise<void> {
    // Cascade: remove group memberships, push tokens, reactions, and anonymize entries for GDPR
    // Wrapped in a transaction to ensure all-or-nothing consistency
    await db.transaction(async (tx) => {
      await tx
        .delete(groupMembers)
        .where(eq(groupMembers.userId, userId));

      await tx
        .delete(pushTokens)
        .where(eq(pushTokens.userId, userId));

      await tx
        .delete(reactions)
        .where(eq(reactions.userId, userId));

      await tx
        .update(deuceEntries)
        .set({ thoughts: "", location: "deleted" })
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
}

export const storage = new DatabaseStorage();
