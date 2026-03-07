# Write monitoring and alerting setup guide: what metrics to t
Agent: jordan
Generated: 2026-03-02T18:35:12.281100

## Monitoring & Alerting Setup Guide: Social App

This guide outlines a robust monitoring and alerting setup for a social app, focusing on key performance indicators (KPIs) and recommended thresholds. It's designed to be a starting point and should be tailored to your specific application, user base, and infrastructure.

**I. Goals & Objectives:**

* **Proactive Issue Detection:** Identify and resolve problems before they significantly impact users.
* **Performance Optimization:** Understand bottlenecks and areas for improvement.
* **Capacity Planning:**  Predict future resource needs based on usage patterns.
* **Root Cause Analysis:**  Quickly identify the cause of issues when they occur.

**II. Metrics to Track:**

We'll categorize metrics for clarity and actionability.

**A. User Experience (Crucial):**

* **Latency (p50, p95, p99):**
    * **Definition:** Time taken for key user actions (e.g., loading a feed, posting a message, searching).
    * **Dimensions:** Break down by:
        * Endpoint (e.g., `/feed`, `/post/create`)
        * User Segment (e.g., active users, new users)
        * Geographic Location (if applicable)
    * **Tools:** Prometheus, Grafana, Datadog, New Relic
* **Error Rate:**
    * **Definition:** Percentage of requests resulting in errors (e.g., 500, 400 status codes).
    * **Dimensions:**  Track by endpoint, error type, user segment.  Categorize errors (e.g., network errors, server errors, validation errors).
    * **Tools:**  Same as latency - crucial for identifying and prioritizing issues.


**B. Backend Performance:**

* **DB Connections:**
    * **Definition:** Number of active database connections.
    * **Importance:** Indicates potential resource contention (CPU, memory). High numbers can cause slowdowns and failures.
    * **Tools:**  Database monitoring tools (e.g., pg_stats for PostgreSQL, MySQL Workbench), Prometheus with database exporters.
* **Memory Usage:**
    * **Definition:** Total memory consumption by the application and its components (e.g., JVM heap, Node.js process memory).
    * **Importance:**  High memory usage can lead to garbage collection pauses and performance degradation.
    * **Tools:**  Prometheus, Grafana, New Relic, Datadog.
* **CPU Usage:**
    * **Definition:** CPU utilization of application servers and database servers.
    * **Importance:**  High CPU usage signals potential bottlenecks.
    * **Tools:** Prometheus, Grafana, New Relic, Datadog.
* **Request Rate:**  (Number of requests per second)
    * **Definition:** The speed at which the system is handling requests.
    * **Importance:** Helps understand traffic patterns and scale appropriately.
    * **Tools:**  Load Balancers, Application Performance Monitoring (APM) tools.


**C.  Infrastructure (Support Level - Important for Root Cause):**

* **Network Latency (Round Trip Time - RTT):** Between key services.
* **Server Uptime:** (Percentage of time servers are operational)
* **Disk I/O:** (Read/Write activity on servers)

**III. Alerting Thresholds (Recommendations - Adjust Based on Testing & Baseline):**

| Metric               | Warning Threshold | Critical Threshold |
|-----------------------|--------------------|--------------------|
| **Latency (p95)**      | 500ms               | 1000ms              |
| **Latency (p99)**      | 1000ms              | 2000ms
