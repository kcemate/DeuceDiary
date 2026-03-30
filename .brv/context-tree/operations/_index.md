---
children_hash: f9d1f2888bec32492aab3e62832455ffae4b8e87f17710771f5fb3fdb43120e3
compression_ratio: 0.6114942528735632
condensation_order: 2
covers: [errors/_index.md, telegram/_index.md]
covers_token_total: 435
summary_level: d2
token_count: 266
type: summary
---
# Operations Domain Summary

This domain consolidates operational knowledge regarding system errors and automated Telegram delivery configurations.

## Gateway Error Handling
The OpenClaw gateway experiences transient draining errors during scheduled restart windows (20:00-21:00 ET), impacting active cron jobs.
* **Pattern:** Automatic recovery occurs in subsequent cycles.
* **Constraint:** Manual intervention is prohibited for these specific restart-window errors.
* **Drill-down:** [OpenClaw Gateway Draining Errors](operations/errors/openclaw_gateway_draining_errors.md)

## Telegram Cron Delivery
This topic addresses resolution failures occurring when using alphanumeric handles in automated Telegram message delivery.
* **Resolution:** Targets must be defined using numeric Telegram user IDs.
* **Standard:** All cron jobs must adhere to the numeric format (`^\d+$`).
* **Implementation:** The target ID `5625253093` is used for `deuce-king-crown-transfer` delivery.
* **Drill-down:** [Cron Delivery Issues](operations/telegram/cron_delivery_issues.md)