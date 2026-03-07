# Write monitoring and alerting setup guide: what metrics to t
Agent: jordan
Generated: 2026-03-02T22:32:56.580997

## Monitoring and Alerting Setup Guide for a Social App

This guide outlines a recommended monitoring and alerting setup for a social application, focusing on key metrics and appropriate thresholds. It’s designed to provide proactive visibility into the app’s health and performance, allowing for timely intervention before impacting users.

**I. Goals & Principles:**

* **Proactive Detection:** Identify issues *before* users experience problems.
* **Actionable Insights:** Metrics should directly lead to understanding and resolving the root cause.
* **Scalability:** The monitoring system should scale with the app's growth.
* **Prioritization:** Focus on metrics that significantly impact user experience and business goals.

**II. Metrics to Track:**

Here’s a breakdown of critical metrics, categorized for clarity:

**A. Performance Metrics (User Experience Focused):**

* **Latency (P50, P95, P99):**
    * **Definition:** Time taken to complete key user actions (e.g., loading a feed, posting an update, sending a message).
    * **Why Track:** Directly reflects user experience. High latency leads to frustration and churn.
    * **Tools:** Prometheus, Grafana, New Relic, Datadog
    * **Granularity:** Track latency for various events:
        * Feed Loading
        * Post Creation
        * Message Sending
        * Search Queries
* **Error Rate:**
    * **Definition:** Percentage of requests that result in an error (HTTP status codes 500+, 400+).
    * **Why Track:** Indicates underlying problems - code bugs, service outages, database issues.
    * **Tools:** Application Performance Monitoring (APM) tools (New Relic, Datadog) automatically track.
    * **Granularity:**  Break down errors by type (e.g., database error, network error, API error) for deeper analysis.

**B. Backend Infrastructure Metrics:**

* **Database Connections:**
    * **Definition:** Number of active connections to the database.
    * **Why Track:** High numbers can indicate inefficient queries, connection pooling issues, or a sudden surge in users.
    * **Tools:**  Database monitoring tools (e.g., pgAdmin for PostgreSQL, MySQL Workbench), Application Performance Monitoring (APM) tools.
    * **Thresholds:**  Watch for sudden spikes above a baseline based on normal usage.
* **Memory Usage (Server & Application):**
    * **Definition:** Total memory consumed by the application servers and relevant services.
    * **Why Track:** Memory leaks or insufficient memory allocation can lead to crashes, performance degradation, and instability.
    * **Tools:** Prometheus, Grafana, New Relic, Datadog
    * **Thresholds:** Set alerts based on percent increase from baseline, or specific memory usage targets.
* **CPU Usage (Server & Application):**
    * **Definition:** Percentage of CPU utilized by the application servers and relevant services.
    * **Why Track:** High CPU usage can indicate inefficient code, resource contention, or excessive background processes.
    * **Tools:** Prometheus, Grafana, New Relic, Datadog
    * **Thresholds:**  Similar to memory – alert on sustained increases above a baseline.
* **Network I/O (Server & Application):**
    * **Definition:**  Incoming and outgoing network traffic.
    * **Why Track:**  High network I/O can be a symptom of performance issues or a denial-of-service attack.
    * **Tools:**  Prometheus, Grafana, New Relic, Datadog
    * **Thresholds:**  Set alerts for unusual spikes in network traffic.

**C. Service-Specific Metrics (Example - if you have separate backend services):
