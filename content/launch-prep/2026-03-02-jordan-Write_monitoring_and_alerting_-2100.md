# Write monitoring and alerting setup guide: what metrics to t
Agent: jordan
Generated: 2026-03-02T21:00:23.759295

## Monitoring and Alerting Setup Guide: Social App

This guide outlines a comprehensive monitoring and alerting setup for a social app, focusing on key performance indicators (KPIs) and recommended thresholds. It’s designed to proactively identify and address issues impacting user experience and app stability.

**I. Goals & Scope**

* **Goal:**  Minimize user-facing issues, quickly identify and resolve performance bottlenecks, and ensure app stability.
* **Scope:** This guide covers monitoring the backend services supporting a social app, including:
    * API Servers
    * Database Servers
    * Cache Servers
    * Message Queues (e.g., Kafka, RabbitMQ)
    * Any other relevant backend components

**II. Metrics to Track**

We’ll categorize metrics for clarity and prioritization:

**A. User Experience (Frontend Focused - Ideally Monitored with Synthetic Monitoring)**

* **Latency (P50, P95, P99):** This is *critical* for a social app.
    * **P50:** 50th percentile - The time it takes 50% of requests to complete. Represents a reasonable baseline.
    * **P95:** 95th percentile - The time it takes 95% of requests to complete.  Indicates the tail end of performance - potential issues affecting a significant portion of users.
    * **P99:** 99th percentile - The time it takes 99% of requests to complete.  Extreme tail – indicates rare but impactful problems.
    * **Granularity:** Track latency per endpoint (e.g., `/users/profile`, `/posts/feed`, `/comments`) to pinpoint problem areas.
* **Error Rate:**  The percentage of requests that result in errors (5xx codes - Server Errors, 4xx codes - Client Errors).
    * **Granularity:** Track error rates per endpoint and by HTTP status code.

**B. Backend Performance & Resource Utilization**

* **Database Connections:**  Number of active database connections. High values indicate potential connection pool exhaustion or inefficient queries.
    * **Threshold:** Alert when exceeds 90% of max connections for a sustained period (e.g., 5 minutes).
* **Memory Usage (per Service):**  Monitor RAM usage for each backend service (API, DB, Cache).
    * **Threshold:** Alert when exceeds 80% of service's allocated RAM for a sustained period (e.g., 15 minutes).  Investigate memory leaks.
* **CPU Usage (per Service):**  Monitor CPU utilization for each backend service.
    * **Threshold:**  Alert when consistently above 80% for a sustained period (e.g., 15 minutes) - indicates performance bottlenecks.
* **Disk I/O (per Service):** Monitor disk read/write rates - could indicate slow queries, data corruption, or other issues.
    * **Threshold:**  Alert when consistently high disk I/O for a sustained period (e.g., 15 minutes).
* **Network I/O (per Service):** Monitor network in/out traffic – high traffic could be indicative of scaling issues.
    * **Threshold:**  Alert when significantly exceeding expected network traffic for a sustained period.

**C. System Health**

* **JVM Heap Usage (for Java Services):** Monitor the percentage of heap used to identify potential memory issues.
* **Process Status:**  Ensure all services are running and healthy.
* **Disk Space (on Servers):**  Monitor disk usage – potential for running out of space.
* **Log Volume:**  An increase in log volume can often indicate a problem.

**III. Alerting Thresholds (Example - Adjust based on your app’s specific characteristics
