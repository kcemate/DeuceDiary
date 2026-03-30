---
children_hash: 1b9a188f6e665927f390d051139d8a7bd4edfbfddbbc56f36073d9dffb37a6e5
compression_ratio: 0.3742384682332463
condensation_order: 3
covers: [development/_index.md, monetization/_index.md, operations/_index.md]
covers_token_total: 1149
summary_level: d3
token_count: 430
type: summary
---
# Structural Summary: System Knowledge (Level D3)

## 1. Development: Ratchet Execution Framework
The Ratchet framework manages linting and formatting within the `autoresearch/runner.sh` workflow.
* **Architectural Shift:** Replaced brittle, column-based regex patterns with robust, single-pass parsing to ensure execution stability.
* **Standardization:** Future linting tasks must utilize AST-based or single-pass parsing to prevent regex-related fragility.
* **Drill-down:** [ratchet_sweep_improvements.md]

## 2. Monetization: Squads Strategy
The domain has moved to a "Free Core, Premium Enhancements" model to optimize user growth.
* **Lifecycle Liberalization:** Removed premium requirements for core squad management, including invite creation and multi-member joins.
* **Gating Decommissioning:** Abolished the 3-squad creation limit for free accounts. Premium gating is now reserved for advanced value-add features: Squad Spy, Weekly Throne Reports, Bingo, and Analytics.
* **Key References:** [context.md], [squads/context.md], and [squads/squads_monetization_policy.md].

## 3. Operations: Error and Delivery Management
This domain tracks system-level constraints and messaging configurations.
* **Gateway Error Handling:** OpenClaw gateway experiences transient draining errors during scheduled restart windows (20:00-21:00 ET). Manual intervention is strictly prohibited; errors recover automatically in subsequent cycles. Reference: [openclaw_gateway_draining_errors.md].
* **Telegram Cron Delivery:** Automated delivery requires numeric Telegram user IDs (regex: `^\d+$`) to avoid resolution failures. Example target ID: `5625253093` for `deuce-king-crown-transfer`. Reference: [cron_delivery_issues.md].