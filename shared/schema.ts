import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
  unique,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  username: varchar("username").unique(),
  profileImageUrl: varchar("profile_image_url"),
  deuceCount: integer("deuce_count").default(0),
  subscription: varchar("subscription", { length: 10 }).default("free").notNull(), // 'free' | 'premium'
  subscriptionExpiresAt: timestamp("subscription_expires_at"),
  streakInsuranceUsed: boolean("streak_insurance_used").default(false).notNull(),
  theme: text("theme").default("default").notNull(),
  reminderHour: integer("reminder_hour"),
  reminderMinute: integer("reminder_minute"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const groups = pgTable("groups", {
  id: varchar("id").primaryKey().notNull(),
  name: varchar("name").notNull(),
  description: text("description"),
  createdBy: varchar("created_by").notNull().references(() => users.id),
  currentStreak: integer("current_streak").default(0).notNull(),
  longestStreak: integer("longest_streak").default(0).notNull(),
  lastStreakDate: varchar("last_streak_date"), // ISO date string YYYY-MM-DD
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const groupMembers = pgTable("group_members", {
  id: serial("id").primaryKey(),
  groupId: varchar("group_id").notNull().references(() => groups.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  role: varchar("role").notNull().default("member"), // "admin" or "member"
  joinedAt: timestamp("joined_at").defaultNow(),
});

export const deuceEntries = pgTable("deuce_entries", {
  id: varchar("id").primaryKey().notNull(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  groupId: varchar("group_id").notNull().references(() => groups.id, { onDelete: "cascade" }),
  location: varchar("location").notNull(),
  thoughts: text("thoughts").notNull(),
  ghost: boolean("ghost").default(false).notNull(),
  loggedAt: timestamp("logged_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const invites = pgTable("invites", {
  id: varchar("id").primaryKey().notNull(),
  groupId: varchar("group_id").notNull().references(() => groups.id, { onDelete: "cascade" }),
  createdBy: varchar("created_by").notNull().references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const locations = pgTable("locations", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  isDefault: boolean("is_default").default(false),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const streakAlerts = pgTable("streak_alerts", {
  id: serial("id").primaryKey(),
  groupId: varchar("group_id").notNull().references(() => groups.id, { onDelete: "cascade" }),
  triggeredAt: timestamp("triggered_at").defaultNow(),
  streakLength: integer("streak_length").notNull(),
  missingMembers: text("missing_members").notNull(), // JSON array of names
  notified: boolean("notified").default(false),
});

export const pushTokens = pgTable("push_tokens", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull(),
  platform: varchar("platform", { length: 10 }).notNull(), // 'ios' | 'android'
  createdAt: timestamp("created_at").defaultNow(),
});

export const reactions = pgTable("reactions", {
  id: serial("id").primaryKey(),
  entryId: varchar("entry_id").notNull().references(() => deuceEntries.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  emoji: varchar("emoji", { length: 10 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  uniqueUserEntryEmoji: unique().on(table.entryId, table.userId, table.emoji),
}));

export const broadcasts = pgTable("broadcasts", {
  id: serial("id").primaryKey(),
  groupId: varchar("group_id").notNull().references(() => groups.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  milestone: text("milestone").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const dailyChallengeCompletions = pgTable("daily_challenge_completions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  challengeDate: varchar("challenge_date", { length: 10 }).notNull(), // YYYY-MM-DD
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  groupMemberships: many(groupMembers),
  createdGroups: many(groups),
  deuceEntries: many(deuceEntries),
  createdInvites: many(invites),
  createdLocations: many(locations),
  reactions: many(reactions),
  pushTokens: many(pushTokens),
}));

export const groupsRelations = relations(groups, ({ one, many }) => ({
  creator: one(users, {
    fields: [groups.createdBy],
    references: [users.id],
  }),
  members: many(groupMembers),
  entries: many(deuceEntries),
  invites: many(invites),
  streakAlerts: many(streakAlerts),
}));

export const streakAlertsRelations = relations(streakAlerts, ({ one }) => ({
  group: one(groups, {
    fields: [streakAlerts.groupId],
    references: [groups.id],
  }),
}));

export const groupMembersRelations = relations(groupMembers, ({ one }) => ({
  group: one(groups, {
    fields: [groupMembers.groupId],
    references: [groups.id],
  }),
  user: one(users, {
    fields: [groupMembers.userId],
    references: [users.id],
  }),
}));

export const deuceEntriesRelations = relations(deuceEntries, ({ one, many }) => ({
  user: one(users, {
    fields: [deuceEntries.userId],
    references: [users.id],
  }),
  group: one(groups, {
    fields: [deuceEntries.groupId],
    references: [groups.id],
  }),
  reactions: many(reactions),
}));

export const invitesRelations = relations(invites, ({ one }) => ({
  group: one(groups, {
    fields: [invites.groupId],
    references: [groups.id],
  }),
  creator: one(users, {
    fields: [invites.createdBy],
    references: [users.id],
  }),
}));

export const locationsRelations = relations(locations, ({ one }) => ({
  creator: one(users, {
    fields: [locations.createdBy],
    references: [users.id],
  }),
}));

export const pushTokensRelations = relations(pushTokens, ({ one }) => ({
  user: one(users, {
    fields: [pushTokens.userId],
    references: [users.id],
  }),
}));

export const reactionsRelations = relations(reactions, ({ one }) => ({
  entry: one(deuceEntries, {
    fields: [reactions.entryId],
    references: [deuceEntries.id],
  }),
  user: one(users, {
    fields: [reactions.userId],
    references: [users.id],
  }),
}));

export const broadcastsRelations = relations(broadcasts, ({ one }) => ({
  group: one(groups, {
    fields: [broadcasts.groupId],
    references: [groups.id],
  }),
  user: one(users, {
    fields: [broadcasts.userId],
    references: [users.id],
  }),
}));

export const dailyChallengeCompletionsRelations = relations(dailyChallengeCompletions, ({ one }) => ({
  user: one(users, {
    fields: [dailyChallengeCompletions.userId],
    references: [users.id],
  }),
}));

// Schema types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Group = typeof groups.$inferSelect;
export type InsertGroup = typeof groups.$inferInsert;
export type GroupMember = typeof groupMembers.$inferSelect;
export type InsertGroupMember = typeof groupMembers.$inferInsert;
export type DeuceEntry = typeof deuceEntries.$inferSelect;
export type InsertDeuceEntry = typeof deuceEntries.$inferInsert;
export type Invite = typeof invites.$inferSelect;
export type InsertInvite = typeof invites.$inferInsert;
export type Location = typeof locations.$inferSelect;
export type InsertLocation = typeof locations.$inferInsert;
export type Reaction = typeof reactions.$inferSelect;
export type InsertReaction = typeof reactions.$inferInsert;
export type StreakAlert = typeof streakAlerts.$inferSelect;
export type InsertStreakAlert = typeof streakAlerts.$inferInsert;
export type PushToken = typeof pushTokens.$inferSelect;
export type InsertPushToken = typeof pushTokens.$inferInsert;
export type Broadcast = typeof broadcasts.$inferSelect;
export type InsertBroadcast = typeof broadcasts.$inferInsert;
export type DailyChallengeCompletion = typeof dailyChallengeCompletions.$inferSelect;
export type InsertDailyChallengeCompletion = typeof dailyChallengeCompletions.$inferInsert;

// Zod schemas
export const insertGroupSchema = createInsertSchema(groups).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDeuceEntrySchema = createInsertSchema(deuceEntries).omit({
  id: true,
  createdAt: true,
});

export const insertLocationSchema = createInsertSchema(locations).omit({
  id: true,
  createdAt: true,
});

export const insertInviteSchema = createInsertSchema(invites).omit({
  id: true,
  createdAt: true,
});

export const insertReactionSchema = createInsertSchema(reactions).omit({
  id: true,
  createdAt: true,
});

export const updateUserSchema = z.object({
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_ ]+$/, "Username can only contain letters, numbers, underscores, and spaces"),
});

export type InsertGroupRequest = z.infer<typeof insertGroupSchema>;
export type InsertDeuceEntryRequest = z.infer<typeof insertDeuceEntrySchema>;
export type InsertLocationRequest = z.infer<typeof insertLocationSchema>;
export type InsertInviteRequest = z.infer<typeof insertInviteSchema>;
export type InsertReactionRequest = z.infer<typeof insertReactionSchema>;
export type UpdateUserRequest = z.infer<typeof updateUserSchema>;
