# Write monitoring and alerting setup guide: what metrics to t
Agent: jordan
Generated: 2026-03-02T17:22:29.349996

## Monitoring and Alerting Setup Guide: Social App

This guide outlines a comprehensive monitoring and alerting strategy for a social app, focusing on key metrics and recommended thresholds. It's designed to provide proactive insights into application performance and potential issues, allowing for rapid resolution.

**I. Goals & Scope**

* **Goal:**  Maintain a high-quality user experience by proactively identifying and addressing performance bottlenecks and errors.
* **Scope:** This guide covers monitoring of the core application and its supporting infrastructure. It focuses on metrics vital for a social app's performance - user experience, data access, and resource utilization.

**II. Metrics to Track**

We’ll break down metrics into categories:

**A. User Experience (Application Performance)**

* **Latency (P50, P95, P99):**  Response time for key user actions. This is *critical* for a social app.
    * **P50:** 50th percentile response time - Represents the performance experienced by the median user.
    * **P95:** 95th percentile response time - Indicates the response time experienced by 95% of users. This highlights potential issues impacting a significant portion of users.
    * **P99:** 99th percentile response time -  Identifies exceptionally long response times. Critical for diagnosing outliers and rare failure scenarios.
    * **What to track:**
        * API endpoints for post creation, feed loading, user search, friend requests, message sending, etc.
* **Error Rate:**  Percentage of requests resulting in errors (e.g., 5xx, 4xx).
    * **What to track:**  Separate error rates for different API endpoints.

**B. Database Performance**

* **DB Connections:** Number of active database connections. High numbers can indicate inefficient queries or excessive users.
* **Query Latency:** Average and percentile latencies of database queries. Identifying slow queries is crucial.
* **Database CPU & Memory Usage:**  Resource utilization of the database server.
* **Slow Query Log:** Enable and actively analyze the slow query log to pinpoint poorly performing queries.
* **DB Queue Length:**  If you have a message queueing system (e.g., RabbitMQ) for database operations, monitor the queue length.

**C. Application Resources**

* **Memory Usage:**  Total memory usage, used memory, and free memory for the application servers.  High memory usage can lead to performance degradation and crashes.
* **CPU Usage:**  Total CPU usage, user CPU usage, and system CPU usage for application servers.
* **Network I/O:**  Input/Output operations per second (IOPS) on the network interface. Can indicate network congestion or high traffic.
* **Disk I/O:** Disk read/write operations per second.  Slow disk I/O can be a bottleneck, especially with large media uploads/downloads.


**D. Service Health**

* **Uptime:** Percentage of time the application is available.
* **Request Rate:**  Number of requests per second.  Useful for identifying sudden spikes in traffic.
* **Queue Length (Message Queues):**  Length of queues used for asynchronous tasks (e.g., image processing, sending notifications).

**III. Alerting Thresholds (Example - Adjust based on your app’s specifics & SLOs)**

| Metric              | Threshold (P95) | Severity | Alert Trigger       | Action                               |
|-----------------------|-----------------|----------|-----------------------|--------------------------------------|
| **Latency (P95)**     | 200ms            | Warning  | Triggered at 300ms    | Investigate, check recent deployments|
|                      | 500ms            | Critical | Triggered
