# Write monitoring and alerting setup guide: what metrics to t
Agent: jordan
Generated: 2026-03-02T17:58:49.493218

## Monitoring and Alerting Setup Guide: Social App

This guide outlines a comprehensive monitoring and alerting setup for a social app, focusing on key metrics and recommended thresholds. The goal is to proactively identify and address performance bottlenecks and potential issues before they impact users.

**I. Goals & Objectives:**

* **Proactive Issue Detection:** Identify performance degradation and errors before they become user-facing problems.
* **Root Cause Analysis:** Provide data to quickly understand the source of issues.
* **Performance Optimization:** Track key metrics to guide optimization efforts.
* **Service Level Agreement (SLA) Monitoring:** Ensure the app meets agreed-upon performance targets.

**II. Metrics to Track:**

Here's a breakdown of recommended metrics, categorized by impact:

**A. Performance Metrics (Critical):**

* **Latency (P50, P95, P99):**
    * **Definition:** Time taken to complete specific requests (e.g., fetching a user profile, posting a message, loading a feed).
    * **Why Track:**  Directly impacts user experience. High latency is a top priority.
    * **Granularity:** Track latency by:
        * Endpoint (API calls)
        * User Segment (e.g., new users vs. existing users)
        * Geographic Region (if applicable - CDN impact)
* **Error Rate:**
    * **Definition:** Percentage of requests resulting in errors (e.g., 500, 400 status codes).
    * **Why Track:** Indicates issues with backend logic, external services, or infrastructure.
    * **Granularity:** Track by endpoint and error code.  Distinguish between transient and persistent errors.
* **Request Throughput (Requests per Second - RPS):**
    * **Definition:**  Number of requests handled per second.
    * **Why Track:**  Indicates capacity and potential bottlenecks during peak loads.  Useful for scaling decisions.

**B. Backend Metrics (Important):**

* **Database Connections:**
    * **Definition:** Number of active database connections.
    * **Why Track:**  High connection counts can lead to performance degradation and resource exhaustion.
    * **Granularity:** Monitor per database server/instance.
* **CPU Utilization:**
    * **Definition:** Percentage of CPU used by servers.
    * **Why Track:**  High CPU usage indicates processing limitations.
* **Memory Utilization:**
    * **Definition:** Percentage of memory used by servers.
    * **Why Track:**  High memory usage can lead to swapping and performance issues.
* **Disk I/O:**
    * **Definition:** Disk read/write operations.
    * **Why Track:** High I/O can bottleneck database performance and other processes.
* **JVM Heap Usage (if applicable):**  Percentage of memory used by the Java Virtual Machine.
* **Cache Hit Ratio:** (For caching layers) - Measures the efficiency of your caching strategy.

**C. Infrastructure Metrics (Monitoring):**

* **Network Latency (Ping):**  Measure latency between key servers.
* **Server Uptime:**  Ensure server availability.
* **CDN Hit Rate:** (If using CDN) - Percentage of requests served from the CDN.

**D. Business Metrics (Strategic):**

* **Daily Active Users (DAU):** Track user engagement trends.
* **Monthly Active Users (MAU):**  Track overall user base growth.
* **Post Creation Rate:**  Measure activity levels.
* **Content Engagement (Likes, Comments, Shares):**  Gauge content effectiveness.


**III. Alerting Thresholds (Recommended Ranges - Adjust Based on Your App):**

| Metric                   | P99 Threshold | P95 Threshold | P90 Threshold |
