# Write monitoring and alerting setup guide: what metrics to t
Agent: jordan
Generated: 2026-03-03T00:24:23.328717

## Monitoring and Alerting Setup Guide for a Social App

This guide outlines a comprehensive monitoring and alerting strategy for a social app, focusing on key metrics and recommended thresholds.  It's designed to be adaptable – you’ll need to tailor it specifically to your app’s features, traffic patterns, and acceptable performance levels.

**I. Goals & Principles**

* **Proactive Problem Detection:**  Identify issues *before* they impact users.
* **Actionable Alerts:** Alerts should provide enough context to quickly understand and resolve the problem.
* **Right Level of Noise:** Avoid alert fatigue with appropriate thresholds.
* **Continuous Improvement:** Regularly review and adjust monitoring based on observed behavior and new features.

**II. Metrics to Track**

We'll categorize metrics for clarity and prioritization:

**A. User Experience (UX) Metrics - Critical**

* **Latency (P50, P95, P99):**
    * **Definition:** The time it takes for a request to be processed by the app. P50 is the 50th percentile, meaning 50% of requests take less time.  P95 and P99 represent the 95th and 99th percentiles, capturing longer tail latency.
    * **Why Track:** Directly affects user experience, impacting engagement and perceived performance.
    * **Tools:** Application Performance Monitoring (APM) solutions (New Relic, Datadog, Dynatrace, AppDynamics), synthetic monitoring tools.
* **Error Rate:**
    * **Definition:** Percentage of requests resulting in errors (e.g., 500, 400, exceptions).
    * **Why Track:** Indicates issues with code, dependencies, or infrastructure.  Break down errors by type (e.g., network errors, database errors) for better troubleshooting.
    * **Tools:** APM, Log aggregation tools (Elasticsearch, Splunk)

**B. Backend Performance & Resource Utilization - Critical**

* **DB Connections:**
    * **Definition:** Number of active connections to the database.
    * **Why Track:** High connection counts can indicate inefficient queries, scaling issues, or a surge in users.
    * **Tools:** Database monitoring tools (e.g., pg_stat_statements for PostgreSQL), APM.
* **Memory Utilization (App Server & Database):**
    * **Definition:** Percentage of RAM used by application servers and the database.
    * **Why Track:** Excessive memory usage leads to slowdowns and potential crashes.
    * **Tools:** OS-level monitoring tools (top, htop), APM, database monitoring tools.
* **CPU Utilization (App Server & Database):**
    * **Definition:** Percentage of CPU used by application servers and the database.
    * **Why Track:** High CPU usage indicates inefficient code, overloaded servers, or resource contention.
    * **Tools:** OS-level monitoring tools (top, htop), APM.
* **Request Throughput (Requests per Second - RPS):**
    * **Definition:** The number of requests your application is handling per second.
    * **Why Track:** Helps understand your app’s capacity and identify bottlenecks.
    * **Tools:** APM, Load testing tools

**C. Infrastructure Metrics - Important**

* **Network Latency (Ping, DNS Resolution):**  Measure the time it takes to communicate between different components.
* **Server Uptime:**  Percentage of time servers are operational.
* **Disk I/O:**  Monitor disk read/write performance, critical for database and log storage.

**D. Feature-Specific Metrics (Important based on App Functionality)**

* **Post Creation Latency:** Specifically for social media apps, track the time to create a
