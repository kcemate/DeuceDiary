# Write monitoring and alerting setup guide: what metrics to t
Agent: jordan
Generated: 2026-03-02T19:47:41.688634

## Monitoring and Alerting Setup Guide for a Social App

This guide outlines a comprehensive monitoring and alerting setup for a social app, focusing on key metrics and recommended alert thresholds. It aims to provide proactive insights into performance issues and prevent major disruptions.

**I. Goals & Scope:**

* **Proactive Issue Detection:** Identify performance degradation before it impacts users.
* **Root Cause Analysis:** Gather data to quickly diagnose and resolve problems.
* **Service Level Agreement (SLA) Monitoring:**  Track adherence to performance targets.
* **Capacity Planning:** Understand resource usage trends to anticipate future needs.

**II. Metrics to Track:**

We’ll categorize metrics for clarity and prioritize based on impact:

**A. Performance (User Experience):**

* **Latency (p50, p95, p99):** This is *crucial* for social apps. Measures the response time for key actions like:
    * **Feed Loading:** Time to load the user’s newsfeed. (p99 - most critical, representing severe slowness)
    * **Post Creation:** Time to create a new post. (p95 - impact on creator satisfaction)
    * **Search:** Time to return search results. (p99 - critical for usability)
    * **Commenting/Liking/Sharing:**  Time to complete these actions. (p95)
* **Request Rate:** Number of requests handled per second.  Helps identify bottlenecks under load.
* **Throughput:**  The amount of data processed per unit of time (e.g., requests per second, messages per second).

**B. Application Health & Errors:**

* **Error Rate:** Percentage of requests resulting in errors.  Breakdown by error type is vital:
    * **HTTP 500 Errors:** Server-side errors.
    * **HTTP 4xx Errors:** Client-side errors (e.g., invalid input).
    * **Database Errors:** Errors returned from the database.
* **Application Crashes:** Number of application instances crashing.
* **Queue Length (if applicable):** If using message queues for asynchronous tasks, monitor queue length for bottlenecks.


**C. Backend Infrastructure:**

* **DB Connections:** Number of active database connections.  High values indicate potential slow queries or connection pooling issues.
    * **Max Connections:**  Maximum number of database connections the system can handle.
    * **Connection Pool Usage:**  Rate of connections being used from the pool.
* **Memory Usage:**  Total and per-process memory usage.
    * **CPU Usage:** Percentage of CPU being used.
    * **Swap Usage:** Indicates memory pressure – a major warning sign.
* **Disk I/O:** Disk read/write operations per second.  High values can indicate database or file system bottlenecks.
* **Network I/O:**  Network traffic in and out of the server.
* **Server CPU Utilization:**  Percentage of CPU being used.
* **Server Response Time:** Measure the time taken to respond to requests from the application.
* **JVM Heap Usage (if using Java):** Monitors the allocated and used heap space.



**D. User Activity (Optional - for understanding usage patterns):**

* **Daily/Monthly Active Users (DAU/MAU):** Provides context for overall traffic.
* **Session Duration:** Average time users spend in the app.
* **Features Used:** Track frequency of use of key features to identify potential issues or trends.


**III. Tools & Technologies:**

* **Monitoring Platforms:**
    * **Prometheus + Grafana:** Open-source, highly flexible and popular.
    * **Datadog:** SaaS solution with powerful integrations.
    * **New Relic:**  APM (Application Performance
