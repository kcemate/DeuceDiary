ALTER TABLE "deuce_entries" ADD COLUMN "bristol_score" integer;--> statement-breakpoint
ALTER TABLE "deuce_entries" ADD COLUMN "photo_url" text;--> statement-breakpoint
ALTER TABLE "deuce_entries" ADD COLUMN "last_logged_at" timestamp;--> statement-breakpoint
ALTER TABLE "groups" ADD COLUMN "timezone" varchar(64) DEFAULT 'UTC' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "timezone" varchar(64) DEFAULT 'UTC' NOT NULL;--> statement-breakpoint
CREATE INDEX "idx_analytics_events_user" ON "analytics_events" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_analytics_events_event" ON "analytics_events" USING btree ("event");--> statement-breakpoint
CREATE INDEX "idx_broadcasts_group" ON "broadcasts" USING btree ("group_id");--> statement-breakpoint
CREATE INDEX "idx_daily_challenge_user_date" ON "daily_challenge_completions" USING btree ("user_id","challenge_date");--> statement-breakpoint
CREATE INDEX "idx_deuce_entries_user_group" ON "deuce_entries" USING btree ("user_id","group_id");--> statement-breakpoint
CREATE INDEX "idx_deuce_entries_logged_at" ON "deuce_entries" USING btree ("logged_at");--> statement-breakpoint
CREATE INDEX "idx_deuce_entries_created_at" ON "deuce_entries" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_deuce_entries_user_created" ON "deuce_entries" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_group_members_user_group" ON "group_members" USING btree ("user_id","group_id");--> statement-breakpoint
CREATE INDEX "idx_group_members_group" ON "group_members" USING btree ("group_id");--> statement-breakpoint
CREATE INDEX "idx_groups_current_streak" ON "groups" USING btree ("current_streak");--> statement-breakpoint
CREATE INDEX "idx_invites_group" ON "invites" USING btree ("group_id");--> statement-breakpoint
CREATE INDEX "idx_push_tokens_user" ON "push_tokens" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_reactions_entry" ON "reactions" USING btree ("entry_id");--> statement-breakpoint
CREATE INDEX "idx_reactions_user" ON "reactions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_referrals_referrer" ON "referrals" USING btree ("referrer_id");--> statement-breakpoint
CREATE INDEX "idx_referrals_referee" ON "referrals" USING btree ("referee_id");--> statement-breakpoint
CREATE INDEX "idx_streak_alerts_group" ON "streak_alerts" USING btree ("group_id");