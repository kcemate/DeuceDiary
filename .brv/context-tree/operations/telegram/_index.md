---
children_hash: 5725d3923851c48d2541c746fd23101d9540b76adfb61bfd1eba3dc1a2b6ee0d
compression_ratio: 0.7238493723849372
condensation_order: 1
covers: [cron_delivery_issues.md]
covers_token_total: 239
summary_level: d1
token_count: 173
type: summary
---
# Operations: Telegram Cron Delivery

### Overview
This domain manages configurations for automated Telegram message delivery, specifically addressing resolution failures in cron-based systems.

### Key Knowledge: Cron Delivery Issues
- **Problem**: Telegram `@handles` (e.g., `@heartbeat`) fail to resolve in automated cron job environments.
- **Solution**: Shifted delivery targets from chat handles to numeric Telegram user IDs.
- **Implementation**: The target ID `5625253093` (Kyle) is used for `deuce-king-crown-transfer` delivery.
- **Convention**: All cron-based Telegram targets must use the numeric ID format (`^\d+$`) rather than alphanumeric handles to ensure reliable resolution.