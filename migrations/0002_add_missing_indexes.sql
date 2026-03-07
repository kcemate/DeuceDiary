-- Add missing database indexes for query performance
-- Critical: deuceEntries sorting and user timeline queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_deuce_entries_created_at" ON "deuce_entries" ("created_at");--> statement-breakpoint
CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_deuce_entries_user_created" ON "deuce_entries" ("user_id", "created_at");--> statement-breakpoint

-- High: group streak filtering
CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_groups_current_streak" ON "groups" ("current_streak");--> statement-breakpoint

-- Medium: reverse FK lookups (groupMembers by groupId)
CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_group_members_group" ON "group_members" ("group_id");--> statement-breakpoint

-- Medium: invites by group
CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_invites_group" ON "invites" ("group_id");--> statement-breakpoint

-- Medium: streak alerts by group
CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_streak_alerts_group" ON "streak_alerts" ("group_id");--> statement-breakpoint

-- Medium: reactions by user (cleanup/deletion queries)
CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_reactions_user" ON "reactions" ("user_id");--> statement-breakpoint

-- Medium: broadcasts by group
CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_broadcasts_group" ON "broadcasts" ("group_id");--> statement-breakpoint

-- Medium: daily challenge completion lookups
CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_daily_challenge_user_date" ON "daily_challenge_completions" ("user_id", "challenge_date");--> statement-breakpoint

-- Medium: analytics event queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_analytics_events_user" ON "analytics_events" ("user_id");--> statement-breakpoint
CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_analytics_events_event" ON "analytics_events" ("event");--> statement-breakpoint

-- Medium: referral lookups
CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_referrals_referrer" ON "referrals" ("referrer_id");--> statement-breakpoint
CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_referrals_referee" ON "referrals" ("referee_id");
