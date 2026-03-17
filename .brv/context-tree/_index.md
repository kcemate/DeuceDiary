---
children_hash: fa74fd2d00dd0a6458745c306b8ccbf583a76321fb43cb04ad336d1b2631bdae
compression_ratio: 0.8871527777777778
condensation_order: 3
covers: [monetization/_index.md]
covers_token_total: 576
summary_level: d3
token_count: 511
type: summary
---
# Monetization: Structural Summary (Level D3)

## Domain Architecture and Scope
The **monetization** domain manages revenue generation and feature gating, specifically focusing on subscription models and premium value propositions. It defines the boundary between core accessible functionality and gated premium enhancements, excluding low-level payment processing and billing history (**monetization/context.md**).

## Squads Monetization Framework
The architectural strategy for Squads has shifted to a "Free Core, Premium Enhancements" model. This transition prioritizes user acquisition and ecosystem growth by removing functional friction from the primary user lifecycle (**monetization/squads/_index.md**).

### Core Lifecycle Liberalization
Key architectural decisions (documented in commit `f3d6b36d`) have decommissioned previous access-based restrictions to facilitate multi-member growth (**monetization/squads/squads_monetization_policy.md**):
*   **Access Routes**: Removed `requiresPremiumFor` constraints on squad creation, member invitations, and joining paths.
*   **Capacity**: Abolished the 3-squad limit for free accounts, allowing unrestricted squad management.

### Tiered Feature Distribution
Value capture has migrated from lifecycle gating to advanced utility and analytics (**monetization/squads/context.md**):
*   **Free Tier (Core)**: Unrestricted squad creation, invitations, and joining capabilities.
*   **Premium Tier (Gated)**: Includes **Squad Spy**, **Weekly Throne Reports**, **Bingo**, **Analytics**, and data export functionality.

## Reference Hierarchy
*   **monetization/context.md**: Domain purpose and scope definitions.
*   **monetization/squads/context.md**: High-level gating strategy and tier definitions.
*   **monetization/squads/squads_monetization_policy.md**: Technical rules and specific gate removal locations.
*   **monetization/_index.md**: Level D2 structural summary of the monetization domain.
*   **monetization/squads/_index.md**: Level D1 summary of squad-specific implementation.