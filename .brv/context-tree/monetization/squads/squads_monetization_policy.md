---
title: Squads Monetization Policy
tags: []
keywords: []
importance: 50
recency: 1
maturity: draft
createdAt: '2026-03-17T10:34:25.023Z'
updatedAt: '2026-03-17T10:34:25.023Z'
---
## Raw Concept
**Task:**
Document squads monetization decision and feature gating

**Changes:**
- Removed premium gate from invite creation (requiresPremiumFor)
- Removed premium gate from multi-member join route
- Removed 3-squad creation cap for free users

**Files:**
- Commit f3d6b36d

**Flow:**
Core squad features -> Free; Enhancements (Analytics, Reports, etc.) -> Premium

**Timestamp:** 2026-03-17

## Narrative
### Structure
Monetization strategy for Squads feature set.

### Highlights
Full squad lifecycle (create, invite, join) is now free. Premium subscription focuses on value-add enhancements rather than core functionality access.

### Rules
Rule 1: Squad creation has no limits for free users
Rule 2: Invites do not require premium
Rule 3: Multi-member joining is free

## Facts
- **squad_monetization_policy**: All core squad features (creation, invites, joining) are free with no limits. [project]
- **premium_gate_removal**: Premium gates were removed from invite creation, multi-member join route, and the 3-squad creation cap. [project]
- **premium_features**: Premium value is derived from enhancements like analytics, squad spy, weekly throne reports, bingo, and export. [project]
