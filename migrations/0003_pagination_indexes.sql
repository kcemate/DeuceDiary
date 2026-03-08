-- Add composite index for feed/group entry pagination queries (logged_at DESC ordering + group filter)
CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_deuce_entries_group_logged_at" ON "deuce_entries" ("group_id", "logged_at" DESC);--> statement-breakpoint

-- Ensure reactions(entry_id) index exists for batch reaction lookups
CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_reactions_entry_id" ON "reactions" ("entry_id");
