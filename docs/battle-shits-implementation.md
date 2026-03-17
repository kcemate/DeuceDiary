# Battle Shits — Implementation Spec (tk_bww2)

## Overview
1v1 Battleship-style game inside DeuceDiary. Players place ships on a weekly time grid, earn attacks by logging real drops, fire at opponent's grid. Drives daily engagement.

## Database Schema (shared/schema.ts)

### Table: `battle_matches`
```sql
CREATE TABLE IF NOT EXISTS battle_matches (
  id varchar PRIMARY KEY NOT NULL,
  group_id varchar NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  challenger_id varchar NOT NULL REFERENCES users(id),
  opponent_id varchar NOT NULL REFERENCES users(id),
  match_type varchar(10) NOT NULL DEFAULT 'standard',  -- 'standard' | 'quick'
  status varchar(20) NOT NULL DEFAULT 'pending',        -- 'pending' | 'placement' | 'active' | 'completed' | 'forfeited' | 'voided'
  winner_id varchar REFERENCES users(id),
  week_start timestamp NOT NULL,                         -- Monday 00:00 UTC for standard, current day for quick
  week_end timestamp NOT NULL,                           -- Sunday 23:59 UTC for standard, +72h for quick
  placement_deadline timestamp NOT NULL,                 -- 24h after creation
  created_at timestamptz NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_battle_matches_group ON battle_matches(group_id);
CREATE INDEX IF NOT EXISTS idx_battle_matches_status ON battle_matches(status);
CREATE INDEX IF NOT EXISTS idx_battle_matches_players ON battle_matches(challenger_id, opponent_id);
```

### Table: `battle_ships`
```sql
CREATE TABLE IF NOT EXISTS battle_ships (
  id serial PRIMARY KEY NOT NULL,
  match_id varchar NOT NULL REFERENCES battle_matches(id) ON DELETE CASCADE,
  user_id varchar NOT NULL REFERENCES users(id),
  ship_type varchar(15) NOT NULL,                        -- 'floater' (2) | 'log' (3) | 'battleshit' (4)
  cells jsonb NOT NULL,                                   -- e.g. [{"col":0,"row":1},{"col":1,"row":1}]
  is_sunk boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  UNIQUE(match_id, user_id, ship_type)
);
CREATE INDEX IF NOT EXISTS idx_battle_ships_match ON battle_ships(match_id);
```

### Table: `battle_attacks`
```sql
CREATE TABLE IF NOT EXISTS battle_attacks (
  id serial PRIMARY KEY NOT NULL,
  match_id varchar NOT NULL REFERENCES battle_matches(id) ON DELETE CASCADE,
  attacker_id varchar NOT NULL REFERENCES users(id),
  col integer NOT NULL,                                   -- 0-6 (Mon-Sun) for standard, 0-2 for quick
  row integer NOT NULL,                                   -- 0-2 (Morning/Afternoon/Night)
  is_hit boolean NOT NULL,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  UNIQUE(match_id, attacker_id, col, row)
);
CREATE INDEX IF NOT EXISTS idx_battle_attacks_match ON battle_attacks(match_id);
```

### Table: `battle_tokens`
```sql
CREATE TABLE IF NOT EXISTS battle_tokens (
  id serial PRIMARY KEY NOT NULL,
  match_id varchar NOT NULL REFERENCES battle_matches(id) ON DELETE CASCADE,
  user_id varchar NOT NULL REFERENCES users(id),
  deuce_entry_id varchar NOT NULL REFERENCES deuce_entries(id),
  token_type varchar(15) NOT NULL DEFAULT 'standard',     -- 'standard' | 'double_flush'
  created_at timestamptz NOT NULL DEFAULT NOW(),
  UNIQUE(match_id, deuce_entry_id)
);
CREATE INDEX IF NOT EXISTS idx_battle_tokens_match_user ON battle_tokens(match_id, user_id);
```

### Table: `battle_powerups`
```sql
CREATE TABLE IF NOT EXISTS battle_powerups (
  id serial PRIMARY KEY NOT NULL,
  match_id varchar NOT NULL REFERENCES battle_matches(id) ON DELETE CASCADE,
  user_id varchar NOT NULL REFERENCES users(id),
  powerup_type varchar(15) NOT NULL,                      -- 'sonar_ping' | 'ghost_wipe'
  used_at timestamptz,
  earned_at timestamptz NOT NULL DEFAULT NOW(),
  revealed_cell jsonb,                                     -- for sonar_ping: {"col":X,"row":Y}
  UNIQUE(match_id, user_id, powerup_type)
);
```

### Table: `battle_badges`
```sql
CREATE TABLE IF NOT EXISTS battle_badges (
  id serial PRIMARY KEY NOT NULL,
  user_id varchar NOT NULL REFERENCES users(id),
  badge_type varchar(30) NOT NULL,                        -- 'battle_winner' | 'admiral' | 'abandon_ship'
  match_id varchar REFERENCES battle_matches(id),
  expires_at timestamp,                                    -- null = permanent
  created_at timestamptz NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_battle_badges_user ON battle_badges(user_id);
```

## Grid Constants

```typescript
// Standard match: 7 cols (Mon-Sun) x 3 rows (Morning/Afternoon/Night) = 21 cells
export const STANDARD_GRID = { cols: 7, rows: 3 };
// Quick match: 3 cols (Today/Tomorrow/DayAfter) x 3 rows = 9 cells
export const QUICK_GRID = { cols: 3, rows: 3 };

export const SHIPS = {
  standard: [
    { type: 'floater', size: 2, emoji: '🚤' },
    { type: 'log', size: 3, emoji: '🥖' },
    { type: 'battleshit', size: 4, emoji: '💣' },
  ],
  quick: [
    { type: 'floater', size: 2, emoji: '🚤' },
    { type: 'log', size: 3, emoji: '🥖' },
  ],
} as const;

export const TIME_SLOTS = ['Morning', 'Afternoon', 'Night'] as const;
export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;
```

## API Endpoints (server/routes.ts or server/routes/battle.ts)

### Match Management
- `POST /api/battle/challenge` — Create match (body: { groupId, opponentId, matchType })
- `GET /api/battle/matches` — List user's active/recent matches
- `GET /api/battle/match/:matchId` — Get match state (grids, attacks, tokens, powerups)
- `POST /api/battle/match/:matchId/forfeit` — Forfeit a match

### Ship Placement
- `POST /api/battle/match/:matchId/place` — Place ships (body: { ships: [{ type, cells }] })
  - Validate: adjacent cells, within grid bounds, no overlap, correct ship sizes
  - Validate: placement deadline not passed
  - When both players have placed → transition status to 'active'

### Attacks
- `POST /api/battle/match/:matchId/attack` — Fire at cell (body: { col, row })
  - Validate: user has available tokens (earned - spent)
  - Validate: cell not already attacked
  - Validate: match is 'active'
  - Check hit/miss against opponent's ships
  - If all cells of a ship are hit → mark is_sunk = true
  - If all ships sunk → match completed, set winner
  - Return: { hit, sunk, shipType?, gameOver, winner? }

### Tokens
- Token generation is automatic: when a deuce_entry is created during an active match, create a battle_token
- Double Flush: if 2+ entries on same calendar day → bonus token (token_type = 'double_flush')
- `GET /api/battle/match/:matchId/tokens` — Get token balance

### Power-ups
- `POST /api/battle/match/:matchId/powerup` — Use a powerup (body: { type: 'sonar_ping' | 'ghost_wipe' })
  - Sonar Ping: earned on 3-day logging streak during match. Once per game. Reveals random unrevealed opponent cell.
  - Ghost Wipe: available once per game from start. Blocks opponent's next attack.
- Streak detection: check deuce_entries for 3 consecutive calendar days during match period

### Anti-Stall (cron job or checked on each request)
- Wednesday midnight check: if player has 0 attacks_fired → send push notification
- Friday midnight check: still 0 → auto-forfeit, award 'abandon_ship' badge
- Both inactive → void match

### Matchmaking
- `POST /api/battle/matchmake` — Random opponent from shared squads
  - Query groupMembers for all shared groups
  - Exclude users in 2 active matches
  - Random pick → create match

### Leaderboard
- `GET /api/battle/leaderboard/:groupId` — Season wins leaderboard
- `GET /api/battle/stats/:userId` — Personal battle stats (wins, losses, hit rate, etc.)

## Storage Methods (server/storage.ts)

Add to IStorage interface and DatabaseStorage class:
```
// Battle Shits
createBattleMatch(match): Promise<BattleMatch>
getBattleMatch(matchId): Promise<BattleMatch | null>
getUserActiveMatches(userId): Promise<BattleMatch[]>
getGroupMatches(groupId, limit): Promise<BattleMatch[]>
updateBattleMatchStatus(matchId, status, winnerId?): Promise<void>

placeShips(matchId, userId, ships): Promise<void>
getShips(matchId, userId): Promise<BattleShip[]>

createAttack(matchId, attackerId, col, row, isHit): Promise<BattleAttack>
getAttacks(matchId): Promise<BattleAttack[]>
getAttacksByUser(matchId, userId): Promise<BattleAttack[]>

createBattleToken(matchId, userId, deuceEntryId, tokenType): Promise<void>
getTokenBalance(matchId, userId): Promise<{ earned: number, spent: number }>

earnPowerup(matchId, userId, type): Promise<void>
usePowerup(matchId, userId, type, revealedCell?): Promise<void>
getPowerups(matchId, userId): Promise<BattlePowerup[]>

awardBadge(userId, badgeType, matchId?, expiresAt?): Promise<void>
getUserBadges(userId): Promise<BattleBadge[]>
getBattleLeaderboard(groupId, seasonStart): Promise<LeaderboardEntry[]>
getBattleStats(userId): Promise<BattleStats>
```

## Token Hook
When a deuce is logged (existing POST /api/deuces endpoint), ALSO check if user has active battle matches. If yes, create a battle_token for each active match. If 2+ deuces today → create double_flush bonus token.

## Client Components (client/src/pages/)

### battle-lobby.tsx
- List active matches, pending challenges
- "Challenge a Friend" button → pick squad member
- "Random Opponent" button
- Quick Match / Standard Match toggle
- Match cards with status, opponent, score preview

### battle-match.tsx
- Two grids side by side (mobile: tabbed - "Your Grid" / "Enemy Grid")
- Ship placement phase: drag & drop ships, tap to rotate
- Attack phase: tap enemy grid cell to fire
- Real-time updates (existing WebSocket infra)
- Token counter, power-up buttons
- Hit/miss animations
- Victory/defeat screen

### battle-leaderboard.tsx
- Season rankings per squad
- Personal stats: win rate, total wins, current streak, badges

## Key Validation Rules
1. Ships must be adjacent in same row or same column (no diagonal, no gaps)
2. Ships can't overlap
3. Ships must fit within grid bounds
4. Can't attack same cell twice
5. Can't attack without tokens
6. Can't challenge someone in 2 active matches
7. Max 1 standard + 1 quick match simultaneously per user
8. Drops logged before match start don't generate tokens
9. Only server-timestamped drops generate tokens (no backdating)
10. Player leaving squad mid-match = forfeit

## db-migrate.ts additions
Add all CREATE TABLE IF NOT EXISTS + CREATE INDEX IF NOT EXISTS statements for the 6 new tables. Follow existing pattern in the migrations array.

## Testing
Add to existing test suite:
- Ship placement validation (adjacency, bounds, overlap)
- Attack resolution (hit/miss/sink detection)
- Token generation on deuce logging
- Double flush bonus logic
- Power-up earning and usage
- Anti-stall forfeit logic
- Matchmaking constraints
- Match lifecycle (pending → placement → active → completed)
- Edge cases: forfeit, void, player leaves squad
