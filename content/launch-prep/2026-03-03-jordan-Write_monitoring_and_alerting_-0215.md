# Write monitoring and alerting setup guide: what metrics to t
Agent: jordan
Generated: 2026-03-03T02:15:41.251798

## Monitoring & Alerting Setup Guide: Social App

This guide outlines a robust monitoring and alerting setup for a social app, focusing on key metrics to identify performance bottlenecks and potential issues. It includes recommended metrics, thresholds, and alerting strategies.

**I. Goals & Principles:**

* **Proactive Problem Detection:** Identify issues *before* they impact users.
* **Actionable Alerts:** Alerts should provide context and direction for troubleshooting.
* **Scalability:**  The monitoring system should scale with the growth of the app.
* **Granularity:** Collect data at a level that allows for detailed analysis and root cause identification.
* **Right-Sized Alerts:** Avoid alert fatigue by setting reasonable thresholds.


**II. Metrics to Track:**

We'll categorize metrics for clarity and impact.

**A. Performance Metrics (User Experience Focused):**

* **Latency (P50, P95, P99):**  This is *critical*. Measure response times for key user actions like:
    * **Feed Loading:** Time to load a user's feed. (P95 & P99 are most important)
    * **Post Creation:** Time to create a new post.
    * **Post Interaction (Likes, Comments):** Time to like or comment on a post.
    * **Search:** Time to execute a search query.
    * **API Calls (General):**  Time to response from core APIs.
    * **Tools:**  Prometheus, Grafana, New Relic, Datadog can automatically collect these.
* **Error Rate:** Percentage of requests that result in errors.  Break this down by:
    * **HTTP Status Codes:** 4xx (Client Errors), 5xx (Server Errors) – Track separately. 5xx are *critical* and need immediate attention.
    * **Application Errors:**  Errors logged within your application code.
    * **Database Errors:** Errors originating from the database layer.

**B. Backend Infrastructure Metrics:**

* **Database Connections:** Number of active database connections. High values indicate potential connection leaks or excessive concurrency.
    * **Key Metric:**  Average active connections.  Monitor trends.
* **Memory Usage (Server & DB):** Track overall memory consumption.
    * **Server:** Total RAM usage, Swap Usage.
    * **Database:** Database buffer pool size, cached data size.
* **CPU Utilization (Server):** Overall CPU usage. Identify CPU-bound bottlenecks.
* **Disk I/O:** Disk read/write operations.  High I/O can indicate storage issues.
* **Network I/O:** Network bandwidth usage. Could signal problems with API calls or data transfer.
* **Queue Lengths (If Using Queues):** Length of queues for asynchronous tasks (e.g., image processing, notifications). Long queues indicate processing bottlenecks.

**C. Application Specific Metrics (May Vary Based on Your App's Features):**

* **User Activity:** Number of active users (daily/monthly/hourly), new user registrations.
* **Feature Usage:**  Tracking usage of key features to identify areas needing improvement or optimization. (e.g., Stories viewed, Groups joined).
* **Notification Delivery Rate:**  Percentage of notifications successfully delivered to users.


**III. Alerting Strategy & Thresholds:**

| Metric             | Alert Level     | Threshold              | Alert Message Example                               | Severity |
|---------------------|-----------------|------------------------|----------------------------------------------------|----------|
| Feed Load P99 Latency | Critical        | > 500ms                | "Feed loading latency P99 exceeds 500ms - investigating!" | Critical |
| Feed Load P95 Latency | Warning         | > 200ms
