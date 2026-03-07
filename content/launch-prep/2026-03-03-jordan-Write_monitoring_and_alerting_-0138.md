# Write monitoring and alerting setup guide: what metrics to t
Agent: jordan
Generated: 2026-03-03T01:38:33.008489

## Monitoring & Alerting Setup Guide: Social App

This guide outlines a comprehensive monitoring and alerting setup for a social app, focusing on key performance indicators (KPIs) to ensure stability, performance, and user experience.

**I. Goals & Objectives:**

* **Proactive Issue Detection:** Identify and address issues *before* they impact users.
* **Performance Optimization:**  Understand bottlenecks and areas for improvement.
* **Capacity Planning:**  Predict resource needs based on usage patterns.
* **Rapid Recovery:**  Quickly identify and resolve incidents to minimize downtime.

**II. Metrics to Track:**

We'll categorize metrics for a layered monitoring approach:

**A. Application Performance:**

* **Latency (P50, P95, P99):**
    * **Definition:** Measures the time taken for a specific request to complete.  P50 is the 50th percentile (median), P95 is the 95th percentile, and P99 is the 99th percentile.
    * **Why Track:** Critical for user experience. High latency leads to slow loading times, frustration, and lost users.
    * **Target:** Track across key endpoints:
        * User Login
        * Post Creation
        * Feed Loading
        * Commenting
        * Search
* **Error Rate:**
    * **Definition:** Percentage of requests that result in errors.
    * **Why Track:** Indicates problems with code, dependencies, or infrastructure.
    * **Target:** Monitor for specific error types (e.g., 500 errors, 404 errors, client-side JavaScript errors).  Focus on critical errors impacting core functionality.
* **Request Throughput (RPS - Requests Per Second):**
    * **Definition:** Number of requests handled per second.
    * **Why Track:**  Gauge traffic volume and identify peak load periods.
* **Response Time Distribution:** (Beyond P50/P95/P99) - Visualize the overall distribution of response times to identify outliers and unusual patterns.


**B. Database Performance:**

* **DB Connection Pool Usage:**
    * **Definition:** Number of active connections to the database.
    * **Why Track:**  High utilization can lead to connection exhaustion and slow performance.  Low utilization might indicate inefficient queries.
    * **Target:**  Monitor utilization across all database instances.  Watch for sustained high usage (>80%) or periods of consistently low utilization (<20%).
* **Query Latency (Average, P95, P99):**
    * **Definition:**  Time taken to execute specific database queries.
    * **Why Track:** Identifies slow-running queries that are impacting overall performance.  Prioritize optimization efforts.
* **Slow Query Log Analysis:**  Regularly review the slow query log for problematic queries.
* **Database Resource Utilization (CPU, Memory, Disk I/O):**  Monitor database server health.

**C. Infrastructure & Server Metrics:**

* **Memory Usage (Server & Application):**
    * **Definition:** Amount of RAM being used.
    * **Why Track:**  Memory leaks or excessive memory usage can lead to crashes and performance degradation.
    * **Target:** Watch for approaching 80-90% utilization.
* **CPU Usage (Server & Application):**
    * **Definition:** Percentage of CPU being utilized.
    * **Why Track:**  High CPU usage indicates processing bottlenecks.
    * **Target:**  High sustained CPU usage (>80%) warrants investigation.
* **Disk I/O (Server):**
    * **Definition:** Read/Write operations to disk.
    * **Why Track:**  Slow disk I/O can bottleneck database performance and application
