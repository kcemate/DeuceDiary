# Write monitoring and alerting setup guide: what metrics to t
Agent: jordan
Generated: 2026-03-03T01:01:29.396720

## Monitoring and Alerting Setup Guide: Social App

This guide outlines a comprehensive monitoring and alerting setup for a social app, focusing on key performance indicators (KPIs) and recommended alert thresholds. It's designed to be adaptable to your specific app's features and user base.

**I. Goals & Principles:**

* **Proactive Problem Detection:** Catch issues before they significantly impact users.
* **Real-Time Visibility:** Understand current system health in real-time.
* **Reduced MTTR (Mean Time To Resolution):** Faster alerts lead to quicker fixes.
* **Actionable Insights:** Alerts should provide enough context to quickly identify the cause.
* **Avoid Alert Fatigue:**  Thresholds should be carefully chosen to minimize false positives.

**II. Metrics to Track:**

We’ll categorize metrics for easier management:

**A. User Experience (Frontend):**

* **Latency (P50, P95, P99):**  Response time for critical user actions (e.g., posting, loading feed, searching, image uploads).  This is *crucial* for a social app.
    * **P50:** 50% of requests should be faster than this. (e.g., 200ms) -  Focuses on common performance.
    * **P95:** 95% of requests should be faster than this. (e.g., 500ms) -  Indicates potential bottlenecks.
    * **P99:** 99% of requests should be faster than this. (e.g., 1s) – Highlights extreme outliers, often the cause of major problems.
* **Error Rate:**  Percentage of requests resulting in errors (4xx or 5xx status codes). Broken down by error type (e.g., network errors, server errors, client errors).
* **Page Load Time:**  Total time taken to load a key page (e.g., News Feed, Profile).
* **App Crash Rate:** Frequency of app crashes across different platforms (iOS, Android).

**B. Backend & API:**

* **Request Rate:** Number of requests per second (RPS) to key API endpoints.
* **API Response Time:** Time taken to process a request at the API level.
* **Queue Length:** Length of message queues (e.g., Kafka, RabbitMQ) if used for asynchronous processing.
* **Background Task Execution Time:** Duration of background jobs (e.g., image processing, notification sending).
* **HTTP Status Code Breakdown:** Detailed breakdown of HTTP status codes – important for analyzing API performance.

**C. Database:**

* **DB Connections:** Number of active database connections. High values can indicate inefficient queries or connection leaks.
* **DB Query Latency:** Average and percentile latency of database queries.
* **DB Slow Queries:** List of queries exceeding a defined threshold (e.g., 1 second).  This *must* be monitored and investigated regularly.
* **DB CPU Utilization:** CPU usage of the database server.
* **DB Memory Utilization:** Memory usage of the database server.
* **DB Disk I/O:** Disk read/write activity – a sign of potential performance issues.

**D. Infrastructure:**

* **Memory Usage:** Total memory usage of all application servers.
* **CPU Utilization:** CPU usage of application servers.
* **Disk I/O:** Disk read/write activity on application servers.
* **Network Latency:** Latency between different servers and external services.
* **Server Uptime:**  Percentage of time servers are operational.
* **Error Rates (OS Level):** System-level error rates (e.g., kernel errors, process errors).


**III. Alerting Thresholds (Recommendations
