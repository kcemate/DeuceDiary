---
children_hash: 42fa9ffdda9e41c499a2ca13e075306c95a24dfc4cde77d133c516c6d75d2218
compression_ratio: 0.9668367346938775
condensation_order: 1
covers: [context.md, squads_monetization_policy.md]
covers_token_total: 392
summary_level: d1
token_count: 379
type: summary
---
# Squads Monetization and Gating Summary

## Structural Overview
The Squads feature set follows a "Free Core, Premium Enhancements" model. The strategy focuses on removing friction from the primary user growth loop (creation, invitation, and joining) to ensure the full squad lifecycle is accessible to all users without functional gating.

## Key Architectural Decisions
*   **Core Lifecycle Liberalization**: All primary squad management routes are now exempt from premium requirements.
*   **Gating Removal**: Specific gates were decommissioned to facilitate multi-member growth:
    *   **Invite Creation**: `requiresPremiumFor` restriction removed.
    *   **Join Routes**: Multi-member join paths are now unrestricted.
    *   **Capacity Limits**: The previous 3-squad creation cap for free accounts has been abolished.
*   **Monetization Shift**: Value capture has transitioned from access-based gating to value-add enhancements and advanced reporting.

## Feature Distribution
*   **Free Tier (Core functionality)**: Unlimited squad creation, member invitations, and multi-member joining.
*   **Premium Tier (Enhancements)**: Analytics, Squad Spy, Weekly Throne Reports, Bingo, and data export capabilities.

## Technical References
*   **Implementation**: Documented in commit `f3d6b36d`.
*   **Related Entries**:
    *   **squads/context.md**: High-level monetization and gating strategy overview.
    *   **squads/squads_monetization_policy.md**: Detailed policy rules and specific gate removal locations.