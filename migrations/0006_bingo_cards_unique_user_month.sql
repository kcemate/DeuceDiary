-- Add unique constraint on bingo_cards(user_id, month) to prevent duplicate
-- bingo cards for the same user in the same month (e.g. from race conditions
-- on concurrent GET /api/bingo/current requests).
--
-- Before adding the constraint, remove any existing duplicates by keeping only
-- the oldest card (lowest created_at) per (user_id, month) pair.
DELETE FROM bingo_cards
WHERE id NOT IN (
  SELECT DISTINCT ON (user_id, month) id
  FROM bingo_cards
  ORDER BY user_id, month, created_at ASC NULLS LAST
);

ALTER TABLE bingo_cards
  ADD CONSTRAINT uq_bingo_cards_user_month UNIQUE (user_id, month);
