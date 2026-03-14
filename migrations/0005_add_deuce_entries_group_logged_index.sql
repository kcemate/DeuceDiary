-- Add composite index on (group_id, logged_at) for deuce_entries
-- Speeds up group feed queries (getGroupEntries), group entry counts,
-- and streak log status checks that filter by group_id + order by logged_at
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_deuce_entries_group_logged
  ON deuce_entries (group_id, logged_at DESC);
