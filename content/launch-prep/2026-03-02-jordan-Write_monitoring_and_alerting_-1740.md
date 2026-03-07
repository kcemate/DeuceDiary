# Write monitoring and alerting setup guide: what metrics to t
Agent: jordan
Generated: 2026-03-02T17:40:35.397850

## Monitoring & Alerting Setup Guide for a Social App

This guide outlines a robust monitoring and alerting setup for a social app, focusing on key metrics and recommended thresholds. It's designed to identify potential issues early and ensure a smooth user experience.

**I. Goals & Scope:**

* **Objective:** Proactively identify and address performance degradation, errors, and resource bottlenecks within the social app.
* **Scope:** This guide covers the following aspects:
    * Key metrics to track
    * Monitoring tools & technologies
    * Alerting thresholds & escalation
    * Reporting & analysis

**II. Key Metrics to Track:**

We categorize metrics for clarity and actionable insights:

**A. User Experience Metrics (Crucial for User Satisfaction):**

* **Latency (p50, p95, p99):**
    * **p50 (50th Percentile):**  The time it takes 50% of requests to complete.  *Focus:  Overall responsiveness.*
    * **p95 (95th Percentile):** The time it takes 95% of requests to complete. *Focus:  Identify outlier performance issues -  bottlenecks impacting a large number of users.*
    * **p99 (99th Percentile):** The time it takes 99% of requests to complete. *Focus:  Rare, but critical issues –  potential for significant user impact or service disruption.*
    * **Granularity:** Track latency by key operations (e.g., loading feed, posting content, searching, user login).
* **Error Rate:**
    * **Overall Error Rate:** Percentage of requests resulting in errors (HTTP 5xx, application-level errors).
    * **Specific Error Rates:** Breakdown by error type (e.g., database connection errors, authentication failures, API errors).
* **Request Throughput:** Number of requests per second (RPS) – Helps identify scaling issues.

**B. Backend Infrastructure Metrics (Health & Stability):**

* **Database Connections:** Number of active database connections. *Focus:  High connection count can indicate inefficient queries or database bottlenecks.*
* **Memory Usage (Server & Application):**  Monitor total RAM usage and individual process memory. *Focus: Out-of-memory errors, application performance degradation.*
* **CPU Usage (Server & Application):** Total CPU usage and per-process CPU usage. *Focus: High CPU can indicate inefficient code, excessive processing, or high request load.*
* **Disk I/O:** Disk read/write operations. *Focus:  Slow disk I/O can impact database performance and overall application speed.*
* **Network I/O:** Network traffic in/out. *Focus: High network traffic can indicate inefficient data transfer or denial-of-service attacks.*
* **JVM Metrics (if using Java):** Heap usage, garbage collection times, etc. – Helps diagnose JVM related performance issues.


**C. Application Specific Metrics (Social App Functionality):**

* **Post Creation Rate:** Number of posts created per unit time.
* **Like/Comment Rate:** Number of likes and comments per unit time.
* **Search Query Volume:** Number of search queries submitted.
* **User Engagement Metrics:** Active users, session duration, etc. (Integrate with analytics tools for richer insights).

**III. Monitoring Tools & Technologies:**

* **Prometheus:** Excellent for time-series data collection and alerting. Integrates well with Kubernetes and many social app frameworks.
* **Grafana:** Powerful visualization tool for creating dashboards from Prometheus data.
* **ELK Stack (Elasticsearch, Logstash, Kibana):** For log aggregation, analysis, and visualization. Crucial for debugging and identifying root causes.
* **New Relic / Dat
