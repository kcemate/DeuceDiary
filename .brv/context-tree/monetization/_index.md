---
children_hash: 3ece3e686f4b4f33374b3d64147159938a53df2b9802283ede356c279581e8c1
compression_ratio: 0.9605263157894737
condensation_order: 2
covers: [context.md, squads/_index.md]
covers_token_total: 532
summary_level: d2
token_count: 511
type: summary
---
# Monetization: Squads Structural Summary (Level D2)

## Domain Purpose and Scope
The **monetization** domain governs strategies for revenue generation, feature gating, and premium value propositions. It specifically manages subscription models and gating logic while excluding technical payment processing and billing history (**context.md**).

## Squads Monetization Strategy
The architectural approach for Squads has transitioned to a "Free Core, Premium Enhancements" model. This strategy prioritizes user growth by removing friction from the primary lifecycle—creation, invitation, and joining—ensuring these core loops are accessible to all users without functional gating (**squads/_index.md**).

### Key Architectural Decisions & Policy Shifts
*   **Lifecycle Liberalization**: Primary squad management routes are exempt from premium requirements to facilitate multi-member growth.
*   **Gating Decommissioning**: Significant restrictions have been abolished (documented in commit `f3d6b36d`):
    *   **Invite/Join Routes**: Removed `requiresPremiumFor` restrictions on invite creation and multi-member join paths.
    *   **Capacity Limits**: Abolished the 3-squad creation cap for free accounts.
*   **Value Capture Migration**: Monetization has shifted from access-based restrictions to value-add enhancements and advanced reporting tools.

### Feature Distribution Model
*   **Free Tier (Core)**: Includes unrestricted squad creation, member invitations, and joining capabilities.
*   **Premium Tier (Enhancements)**: Gated features include **Squad Spy**, **Weekly Throne Reports**, **Bingo**, **Analytics**, and data export functionality.

## Reference Entries
*   **monetization/context.md**: Domain-level purpose and scope definitions.
*   **monetization/squads/context.md**: High-level strategy for squad gating.
*   **monetization/squads/squads_monetization_policy.md**: Detailed technical rules and specific gate removal locations.
*   **monetization/squads/_index.md**: Level D1 summary of squad monetization implementation.