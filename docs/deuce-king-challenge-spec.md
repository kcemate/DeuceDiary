# Deuce King Challenge — Feature Spec

**Status:** Queued for build  
**Author:** Giovanni  
**Date:** 2026-03-10  
**Priority:** P1 — high engagement, strong retention loop

---

## Overview

The player with the most logs in their group over a period earns the **Deuce King 👑** title and the power to set a challenge for the next period.

## Core Mechanics

### 1. Deuce King Selection
- **Cadence:** Weekly (Mon 00:00 → Sun 23:59 UTC), configurable per group
- **Criteria:** Most logs in the group during the period
- **Tiebreaker:** Longest active streak → earliest first log of the period
- **Crown transfer:** Announced in group feed at period rollover
- **Repeat kings:** Can win consecutive weeks (earns "Dynasty" badge after 3 in a row)

### 2. Challenge Setting
- When crowned, the King gets a prompt to set the next period's challenge
- **Options:**
  - Free text challenge (moderated — max 140 chars)
  - Template picker (curated list, see below)
- **Deadline:** 24 hours to set a challenge, otherwise a random template is auto-selected
- **Limit:** One challenge per period per group

### 3. Challenge Templates (starter set)
| Template | Description |
|---|---|
| 🏃 Streak Warrior | Maintain a 5+ day streak this week |
| 📍 Explorer | Log from 3 different locations |
| 🌅 Early Bird | Log before 8 AM at least 3 times |
| 🌙 Night Owl | Log after 10 PM at least 3 times |
| 📊 Consistency King | Log every single day this week |
| 💬 Social Butterfly | React to 5 different group members' logs |
| 🔥 Double Down | Log 2+ times in a single day, 3 different days |

### 4. Challenge Participation
- All group members see the active challenge on the squad page
- Progress bar shows individual completion status
- Completing a challenge = **Challenge Champion** badge for that period
- Non-binding — no penalty for not completing, pure upside

### 5. Rewards & Badges
| Badge | Condition |
|---|---|
| 👑 Deuce King | Won the most logs in a period |
| 🏆 Challenge Champion | Completed the King's challenge |
| 👑👑👑 Dynasty | Won Deuce King 3 consecutive periods |
| 🎯 Challenge Architect | Set 5+ challenges as King |

---

## Data Model

### New Tables

```sql
-- Deuce King history
CREATE TABLE deuce_kings (
  id SERIAL PRIMARY KEY,
  group_id INTEGER NOT NULL REFERENCES groups(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  log_count INTEGER NOT NULL,
  consecutive_wins INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Challenges set by Kings
CREATE TABLE challenges (
  id SERIAL PRIMARY KEY,
  group_id INTEGER NOT NULL REFERENCES groups(id),
  king_id INTEGER NOT NULL REFERENCES users(id),
  deuce_king_id INTEGER NOT NULL REFERENCES deuce_kings(id),
  title VARCHAR(140) NOT NULL,
  template_key VARCHAR(50), -- NULL if custom
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  is_auto_selected BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Challenge completion tracking
CREATE TABLE challenge_completions (
  id SERIAL PRIMARY KEY,
  challenge_id INTEGER NOT NULL REFERENCES challenges(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(challenge_id, user_id)
);
```

### Indexes
```sql
CREATE INDEX idx_deuce_kings_group_period ON deuce_kings(group_id, period_start);
CREATE INDEX idx_challenges_group_period ON challenges(group_id, period_start);
CREATE INDEX idx_challenge_completions_challenge ON challenge_completions(challenge_id);
```

---

## API Endpoints

| Method | Route | Description |
|---|---|---|
| GET | `/api/groups/:id/king` | Current Deuce King + active challenge |
| POST | `/api/groups/:id/challenge` | King sets a challenge (king auth required) |
| GET | `/api/groups/:id/challenge` | Active challenge + member progress |
| GET | `/api/groups/:id/challenge/history` | Past challenges and winners |
| POST | `/api/internal/crown-transfer` | Cron: calculate kings, transfer crowns |

---

## UI Components

### Squad Page
- **Crown Banner** — shows current King with 👑, their log count, and days remaining
- **Active Challenge Card** — challenge text, progress bar, completion count
- **Challenge History** — collapsible past challenges with champions

### King's Challenge Setter (modal)
- Template grid (tap to select) OR free text input
- Preview of how it'll appear to the group
- "Set Challenge" CTA

### Feed Integration
- Crown transfer announcement in group feed
- Challenge completion celebrations
- "X completed the challenge!" notifications

---

## Cron Job

**`crown-transfer`** — runs at period rollover (weekly: Monday 00:00 UTC)
1. For each group: count logs per user for the ended period
2. Determine winner (tiebreaker logic)
3. Insert `deuce_kings` row, update `consecutive_wins`
4. If previous king had a challenge with no completions, still archive it
5. Notify new king via push notification
6. Post crown transfer to group feed
7. If king doesn't set challenge within 24h → auto-select template (separate cron check)

---

## Premium Considerations
- **Free tier:** Deuce King + template challenges fully free (drives engagement)
- **Premium:** Custom free-text challenges (templates only for free)
- This keeps the core loop free while giving premium users creative control

---

## Success Metrics
- % of groups with active challenges
- Challenge completion rate
- Retention lift in groups with active King vs without
- Crown defense rate (repeat kings)
