-- Add unique constraint on referrals(referee_id) to prevent a user from
-- being referred more than once. The application already checks users.referred_by
-- before inserting, but concurrent requests can race past that check.
-- This DB-level constraint is the final safety net.
--
-- First remove any existing duplicates, keeping the oldest row per referee.
DELETE FROM referrals
WHERE id NOT IN (
  SELECT DISTINCT ON (referee_id) id
  FROM referrals
  ORDER BY referee_id, created_at ASC NULLS LAST
);

ALTER TABLE referrals
  ADD CONSTRAINT uq_referrals_referee UNIQUE (referee_id);
