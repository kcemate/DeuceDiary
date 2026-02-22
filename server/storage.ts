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
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, count, sql, inArray, gte } from "drizzle-orm";

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
  getGroupEntries(groupId: string): Promise<(DeuceEntry & { user: User })[]>;
  getUserDeucesByDate(userId: string): Promise<{ date: string; count: number }[]>;
  getEntryById(entryId: string): Promise<DeuceEntry | undefined>;
  
  // Invite operations
  createInvite(invite: InsertInvite): Promise<Invite>;
  getInviteById(inviteId: string): Promise<Invite | undefined>;
  deleteInvite(inviteId: string): Promise<void>;
  cleanupExpiredInvites(): Promise<void>;
  
  // Location operations
  getLocations(): Promise<Location[]>;
  createLocation(location: InsertLocation): Promise<Location>;
  getLocationByName(name: string): Promise<Location | undefined>;
  
  // Personal records
  getUserPersonalRecord(userId: string): Promise<{ date: string; count: number } | undefined>;
  
  // Reaction operations
  addReaction(reaction: InsertReaction): Promise<Reaction>;
  removeReaction(userId: string, entryId: string, emoji: string): Promise<void>;
  getEntryReactions(entryId: string): Promise<(Reaction & { user: User })[]>;

  // Feed operations
  getFeedEntries(groupIds: string[], limit: number): Promise<(DeuceEntry & { user: Pick<User, 'id' | 'username' | 'profileImageUrl'>; reactions: Reaction[] })[]>;

  // Streak operations
  getGroupStreak(groupId: string): Promise<{ currentStreak: number; longestStreak: number; lastStreakDate: string | null }>;
  updateGroupStreak(groupId: string, currentStreak: number, longestStreak: number, lastStreakDate: string): Promise<void>;
  getMembersLogStatusToday(groupId: string, todayUTC: string): Promise<{ userId: string; username: string | null; firstName: string | null; profileImageUrl: string | null; hasLogged: boolean }[]>;

  // Streak alert operations
  getAllGroupsWithActiveStreaks(minStreak: number): Promise<Group[]>;
  createStreakAlert(alert: InsertStreakAlert): Promise<StreakAlert>;

  // Group preview (for invite landing — no auth needed)
  getGroupMemberCount(groupId: string): Promise<number>;
  getGroupDeuceCount(groupId: string): Promise<number>;

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

  // Squad spy mode — modal log hour per member
  getGroupMemberTypicalHours(groupId: string): Promise<{ username: string; typicalHour: number | null }[]>;

  // Referral operations
  getUserByReferralCode(code: string): Promise<User | undefined>;
  applyReferral(refereeId: string, referrerId: string): Promise<Referral>;
  getReferralStats(userId: string): Promise<{ referralCount: number; referrals: { username: string | null; joinedAt: Date | null }[] }>;

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
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
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
    console.log("Getting group members for group:", groupId);
    
    // First, get all group members
    const allMembers = await db
      .select()
      .from(groupMembers)
      .where(eq(groupMembers.groupId, groupId))
      .orderBy(desc(groupMembers.joinedAt));

    console.log("All group members:", allMembers);

    // Then get users for each member with their personal records
    const membersWithUsers = [];
    for (const member of allMembers) {
      const user = await this.getUser(member.userId);
      if (user) {
        // Get personal record (best day) for this user
        const personalRecord = await this.getUserPersonalRecord(member.userId);
        
        membersWithUsers.push({
          ...member,
          user: {
            ...user,
            personalRecord,
          },
        });
      } else {
        console.warn("User not found for member:", member.userId);
      }
    }

    console.log("Members with users:", membersWithUsers);
    
    return membersWithUsers;
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

  async getGroupEntries(groupId: string): Promise<(DeuceEntry & { user: User })[]> {
    const entries = await db
      .select({
        entry: deuceEntries,
        user: users,
      })
      .from(deuceEntries)
      .innerJoin(users, eq(deuceEntries.userId, users.id))
      .where(eq(deuceEntries.groupId, groupId))
      .orderBy(desc(deuceEntries.createdAt));

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

  // Location operations
  async getLocations(): Promise<Location[]> {
    return await db.select().from(locations).orderBy(locations.isDefault, locations.name);
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
      .where(eq(reactions.entryId, entryId))
      .orderBy(reactions.createdAt);

    return entryReactions.map(row => ({
      ...row.reactions,
      user: row.users!,
    }));
  }

  // Feed operations
  async getFeedEntries(groupIds: string[], limit: number): Promise<(DeuceEntry & { user: Pick<User, 'id' | 'username' | 'profileImageUrl'>; reactions: Reaction[] })[]> {
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
      .where(inArray(deuceEntries.groupId, groupIds))
      .orderBy(desc(deuceEntries.createdAt))
      .limit(limit);

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

  async updateGroupStreak(groupId: string, currentStreak: number, longestStreak: number, lastStreakDate: string): Promise<void> {
    await db
      .update(groups)
      .set({ currentStreak, longestStreak, lastStreakDate, updatedAt: new Date() })
      .where(eq(groups.id, groupId));
  }

  async getMembersLogStatusToday(groupId: string, todayUTC: string): Promise<{ userId: string; username: string | null; firstName: string | null; profileImageUrl: string | null; hasLogged: boolean }[]> {
    // Get all members of the group
    const members = await db
      .select({
        userId: groupMembers.userId,
        username: users.username,
        firstName: users.firstName,
        profileImageUrl: users.profileImageUrl,
      })
      .from(groupMembers)
      .innerJoin(users, eq(groupMembers.userId, users.id))
      .where(eq(groupMembers.groupId, groupId));

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
    const [user] = await db.select().from(users).where(eq(users.username, username));
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
      .where(eq(users.id, userId));
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

    // Group rankings — user's rank in each group by deuce count
    const groupRankings: { groupId: string; groupName: string; rank: number; total: number }[] = [];
    if (userGroupIds.length > 0) {
      for (const { groupId } of userGroupIds) {
        const group = await this.getGroupById(groupId);
        if (!group) continue;

        const rankRows = await db
          .select({
            memberId: groupMembers.userId,
            cnt: sql<number>`COUNT(${deuceEntries.id})::int`,
          })
          .from(groupMembers)
          .leftJoin(
            deuceEntries,
            and(
              eq(deuceEntries.userId, groupMembers.userId),
              eq(deuceEntries.groupId, groupMembers.groupId),
            ),
          )
          .where(eq(groupMembers.groupId, groupId))
          .groupBy(groupMembers.userId)
          .orderBy(desc(sql<number>`COUNT(${deuceEntries.id})::int`));

        const total = rankRows.length;
        const rank = rankRows.findIndex(r => r.memberId === userId) + 1;
        groupRankings.push({ groupId, groupName: group.name, rank: rank || total, total });
      }
    }

    return { totalDeuces, avgPerWeek, longestStreak, currentStreak, bestDay, groupRankings };
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

  // Squad spy mode — find the modal (most common) hour each member logs
  async getGroupMemberTypicalHours(groupId: string): Promise<{ username: string; typicalHour: number | null }[]> {
    // Get all members
    const members = await db
      .select({
        userId: groupMembers.userId,
        username: users.username,
        firstName: users.firstName,
      })
      .from(groupMembers)
      .innerJoin(users, eq(groupMembers.userId, users.id))
      .where(eq(groupMembers.groupId, groupId));

    const results: { username: string; typicalHour: number | null }[] = [];

    for (const member of members) {
      const displayName = member.username || member.firstName || "Unknown";

      // Count logs per hour for this user across all their entries
      const hourRows = await db
        .select({
          hour: sql<number>`EXTRACT(HOUR FROM ${deuceEntries.loggedAt})::int`,
          cnt: sql<number>`COUNT(*)::int`,
        })
        .from(deuceEntries)
        .where(eq(deuceEntries.userId, member.userId))
        .groupBy(sql`EXTRACT(HOUR FROM ${deuceEntries.loggedAt})`)
        .orderBy(desc(sql<number>`COUNT(*)::int`))
        .limit(1);

      // If user has < 3 total logs, return null
      const [totalResult] = await db
        .select({ total: sql<number>`COUNT(*)::int` })
        .from(deuceEntries)
        .where(eq(deuceEntries.userId, member.userId));
      const totalLogs = totalResult?.total ?? 0;

      if (totalLogs < 3 || hourRows.length === 0) {
        results.push({ username: displayName, typicalHour: null });
      } else {
        results.push({ username: displayName, typicalHour: hourRows[0].hour });
      }
    }

    return results;
  }

  // Referral operations
  async getUserByReferralCode(code: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.referralCode, code));
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
      .where(eq(referrals.referrerId, userId))
      .orderBy(desc(referrals.createdAt));

    return {
      referralCount: user?.referralCount ?? 0,
      referrals: rows,
    };
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
      db.select({ count: sql<number>`COUNT(*)::int` }).from(users),
      db.select({ count: sql<number>`COUNT(*)::int` }).from(users)
        .where(and(eq(users.subscription, 'premium'), sql`${users.subscriptionExpiresAt} > NOW()`)),
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
}

export const storage = new DatabaseStorage();
