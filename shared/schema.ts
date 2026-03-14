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
  numeric,
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
  referralCode: text("referral_code").unique(),
  referredBy: text("referred_by"),
  referralCount: integer("referral_count").default(0),
  timezone: varchar("timezone", { length: 64 }).default("UTC").notNull(),
  deletedAt: timestamp("deleted_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const groups = pgTable("groups", {
  id: varchar("id").primaryKey().notNull(),
  name: varchar("name").notNull(),
  description: text("description"),
  createdBy: varchar("created_by").notNull().references(() => users.id),
  timezone: varchar("timezone", { length: 64 }).default("UTC").notNull(),
  currentStreak: integer("current_streak").default(0).notNull(),
  longestStreak: integer("longest_streak").default(0).notNull(),
  lastStreakDate: varchar("last_streak_date"), // ISO date string YYYY-MM-DD
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_groups_current_streak").on(table.currentStreak),
]);

export const groupMembers = pgTable("group_members", {
  id: serial("id").primaryKey(),
  groupId: varchar("group_id").notNull().references(() => groups.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  role: varchar("role").notNull().default("member"), // "admin" or "member"
  joinedAt: timestamp("joined_at").defaultNow(),
}, (table) => [
  unique("uq_group_members_user_group").on(table.userId, table.groupId),
  index("idx_group_members_group").on(table.groupId),
]);

export const deuceEntries = pgTable("deuce_entries", {
  id: varchar("id").primaryKey().notNull(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  groupId: varchar("group_id").notNull().references(() => groups.id, { onDelete: "cascade" }),
  location: varchar("location").notNull(),
  thoughts: text("thoughts").notNull(),
  ghost: boolean("ghost").default(false).notNull(),
  bristolScore: integer("bristol_score"),
  photoUrl: text("photo_url"),
  latitude: numeric("latitude"),
  longitude: numeric("longitude"),
  loggedAt: timestamp("logged_at").notNull(),
  lastLoggedAt: timestamp("last_logged_at"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_deuce_entries_user_group").on(table.userId, table.groupId),
  index("idx_deuce_entries_logged_at").on(table.loggedAt),
  index("idx_deuce_entries_created_at").on(table.createdAt),
  index("idx_deuce_entries_user_created").on(table.userId, table.createdAt),
  index("idx_deuce_entries_group_logged").on(table.groupId, table.loggedAt),
]);

export const invites = pgTable("invites", {
  id: varchar("id").primaryKey().notNull(),
  groupId: varchar("group_id").notNull().references(() => groups.id, { onDelete: "cascade" }),
  createdBy: varchar("created_by").notNull().references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_invites_group").on(table.groupId),
]);

export const locations = pgTable("locations", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  isDefault: boolean("is_default").default(false).notNull(),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const streakAlerts = pgTable("streak_alerts", {
  id: serial("id").primaryKey(),
  groupId: varchar("group_id").notNull().references(() => groups.id, { onDelete: "cascade" }),
  triggeredAt: timestamp("triggered_at").defaultNow().notNull(),
  streakLength: integer("streak_length").notNull(),
  missingMembers: text("missing_members").notNull(), // JSON array of names
  notified: boolean("notified").default(false).notNull(),
}, (table) => [
  index("idx_streak_alerts_group").on(table.groupId),
]);

export const pushTokens = pgTable("push_tokens", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull(),
  platform: varchar("platform", { length: 10 }).notNull(), // 'ios' | 'android'
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_push_tokens_user").on(table.userId),
  unique("uq_push_tokens_token").on(table.token),
]);

export const reactions = pgTable("reactions", {
  id: serial("id").primaryKey(),
  entryId: varchar("entry_id").notNull().references(() => deuceEntries.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  emoji: varchar("emoji", { length: 10 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  uniqueUserEntryEmoji: unique().on(table.entryId, table.userId, table.emoji),
  entryIdIdx: index("idx_reactions_entry").on(table.entryId),
  userIdIdx: index("idx_reactions_user").on(table.userId),
}));

export const broadcasts = pgTable("broadcasts", {
  id: serial("id").primaryKey(),
  groupId: varchar("group_id").notNull().references(() => groups.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  milestone: text("milestone").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_broadcasts_group").on(table.groupId),
]);

export const dailyChallengeCompletions = pgTable("daily_challenge_completions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  challengeDate: varchar("challenge_date", { length: 10 }).notNull(), // YYYY-MM-DD
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_daily_challenge_user_date").on(table.userId, table.challengeDate),
]);

export const analyticsEvents = pgTable("analytics_events", {
  id: serial("id").primaryKey(),
  userId: text("user_id"),
  event: text("event").notNull(),
  properties: text("properties"),  // JSON string
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_analytics_events_user").on(table.userId),
  index("idx_analytics_events_event").on(table.event),
]);

export const referrals = pgTable("referrals", {
  id: serial("id").primaryKey(),
  referrerId: varchar("referrer_id").notNull().references(() => users.id),
  refereeId: varchar("referee_id").notNull().references(() => users.id),
  discountApplied: boolean("discount_applied").default(false).notNull(),
  convertedToPremiumAt: timestamp("converted_to_premium_at"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_referrals_referrer").on(table.referrerId),
  index("idx_referrals_referee").on(table.refereeId),
]);

// Bingo types
export interface BingoSquare {
  id: number;
  title: string;
  description: string;
  condition_type: string;
  condition_value: number;
  completed: boolean;
}

export const bingoCards = pgTable("bingo_cards", {
  id: varchar("id").primaryKey().notNull(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  groupId: varchar("group_id").references(() => groups.id, { onDelete: "set null" }),
  month: varchar("month", { length: 7 }).notNull(), // YYYY-MM
  squares: jsonb("squares").notNull().$type<BingoSquare[]>(),
  completedSquares: jsonb("completed_squares").notNull().default([]).$type<number[]>(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_bingo_cards_user_month").on(table.userId, table.month),
]);

export const bingoCompletions = pgTable("bingo_completions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  cardId: varchar("card_id").notNull().references(() => bingoCards.id, { onDelete: "cascade" }),
  completedAt: timestamp("completed_at").defaultNow(),
}, (table) => [
  index("idx_bingo_completions_user").on(table.userId),
  index("idx_bingo_completions_card").on(table.cardId),
]);

export const passportStamps = pgTable("passport_stamps", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  city: varchar("city", { length: 200 }).notNull(),
  region: varchar("region", { length: 200 }),
  country: varchar("country", { length: 200 }).notNull(),
  countryCode: varchar("country_code", { length: 10 }),
  latitude: numeric("latitude").notNull(),
  longitude: numeric("longitude").notNull(),
  entryCount: integer("entry_count").default(1).notNull(),
  firstVisitAt: timestamp("first_visit_at").defaultNow(),
  lastVisitAt: timestamp("last_visit_at").defaultNow(),
}, (table) => [
  index("idx_passport_stamps_user").on(table.userId),
  unique("uq_passport_stamps_user_city_country").on(table.userId, table.city, table.country),
]);

// --- Deuce King Challenge tables ---
export const deuceKings = pgTable("deuce_kings", {
  id: serial("id").primaryKey(),
  groupId: varchar("group_id").notNull().references(() => groups.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  periodStart: timestamp("period_start", { withTimezone: true }).notNull(),
  periodEnd: timestamp("period_end", { withTimezone: true }).notNull(),
  logCount: integer("log_count").notNull(),
  consecutiveWins: integer("consecutive_wins").notNull().default(1),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("idx_deuce_kings_group_period").on(table.groupId, table.periodStart),
]);

export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  groupId: varchar("group_id").notNull().references(() => groups.id),
  kingId: varchar("king_id").notNull().references(() => users.id),
  deuceKingId: integer("deuce_king_id").notNull().references(() => deuceKings.id),
  title: varchar("title", { length: 140 }).notNull(),
  templateKey: varchar("template_key", { length: 50 }),
  periodStart: timestamp("period_start", { withTimezone: true }).notNull(),
  periodEnd: timestamp("period_end", { withTimezone: true }).notNull(),
  isAutoSelected: boolean("is_auto_selected").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("idx_challenges_group_period").on(table.groupId, table.periodStart),
]);

export const challengeCompletions = pgTable("challenge_completions", {
  id: serial("id").primaryKey(),
  challengeId: integer("challenge_id").notNull().references(() => challenges.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  completedAt: timestamp("completed_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  uniqueUserChallenge: unique().on(table.challengeId, table.userId),
  challengeIdx: index("idx_challenge_completions_challenge").on(table.challengeId),
}));

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  groupMemberships: many(groupMembers),
  createdGroups: many(groups),
  deuceEntries: many(deuceEntries),
  createdInvites: many(invites),
  createdLocations: many(locations),
  reactions: many(reactions),
  pushTokens: many(pushTokens),
  passportStamps: many(passportStamps),
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

export const referralsRelations = relations(referrals, ({ one }) => ({
  referrer: one(users, {
    fields: [referrals.referrerId],
    references: [users.id],
  }),
  referee: one(users, {
    fields: [referrals.refereeId],
    references: [users.id],
  }),
}));

export const bingoCardsRelations = relations(bingoCards, ({ one, many }) => ({
  user: one(users, { fields: [bingoCards.userId], references: [users.id] }),
  group: one(groups, { fields: [bingoCards.groupId], references: [groups.id] }),
  completions: many(bingoCompletions),
}));

export const bingoCompletionsRelations = relations(bingoCompletions, ({ one }) => ({
  user: one(users, { fields: [bingoCompletions.userId], references: [users.id] }),
  card: one(bingoCards, { fields: [bingoCompletions.cardId], references: [bingoCards.id] }),
}));

export const passportStampsRelations = relations(passportStamps, ({ one }) => ({
  user: one(users, { fields: [passportStamps.userId], references: [users.id] }),
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
export type Referral = typeof referrals.$inferSelect;
export type InsertReferral = typeof referrals.$inferInsert;
export type BingoCard = typeof bingoCards.$inferSelect;
export type InsertBingoCard = typeof bingoCards.$inferInsert;
export type BingoCompletion = typeof bingoCompletions.$inferSelect;
export type InsertBingoCompletion = typeof bingoCompletions.$inferInsert;
export type PassportStamp = typeof passportStamps.$inferSelect;
export type InsertPassportStamp = typeof passportStamps.$inferInsert;
export type DeuceKing = typeof deuceKings.$inferSelect;
export type InsertDeuceKing = typeof deuceKings.$inferInsert;
export type Challenge = typeof challenges.$inferSelect;
export type InsertChallenge = typeof challenges.$inferInsert;
export type ChallengeCompletion = typeof challengeCompletions.$inferSelect;
export type InsertChallengeCompletion = typeof challengeCompletions.$inferInsert;

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
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
});

export type InsertGroupRequest = z.infer<typeof insertGroupSchema>;
export type InsertDeuceEntryRequest = z.infer<typeof insertDeuceEntrySchema>;
export type InsertLocationRequest = z.infer<typeof insertLocationSchema>;
export type InsertInviteRequest = z.infer<typeof insertInviteSchema>;
export type InsertReactionRequest = z.infer<typeof insertReactionSchema>;
export type UpdateUserRequest = z.infer<typeof updateUserSchema>;
