---
title: Cron Delivery Issues
tags: []
keywords: []
importance: 50
recency: 1
maturity: draft
createdAt: '2026-03-30T01:01:34.317Z'
updatedAt: '2026-03-30T01:01:34.317Z'
---
## Raw Concept
**Task:**
Resolve deuce-king-crown-transfer Telegram delivery failure

**Changes:**
- Updated delivery target from @heartbeat to numeric ID 5625253093

**Timestamp:** 2026-03-30

**Patterns:**
- `^\d+$` - Always use numeric Telegram IDs for cron delivery targets, not @handles

## Narrative
### Structure
Telegram cron delivery target configuration.

### Highlights
The @heartbeat chat handle does not resolve for automated cron jobs. Using the numeric user ID 5625253093 ensures reliable delivery.

### Rules
Always use numeric Telegram IDs for cron delivery targets, not @handles.

## Facts
- **telegram_delivery**: Cron jobs must use numeric Telegram IDs instead of @handles [convention]
- **kyle_telegram_id**: Kyle's Telegram user ID is 5625253093 [project]
