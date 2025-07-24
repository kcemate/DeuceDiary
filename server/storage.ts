import {
  users,
  groups,
  groupMembers,
  deuceEntries,
  invites,
  locations,
  reactions,
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
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, count, sql, inArray } from "drizzle-orm";

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
}

export const storage = new DatabaseStorage();
