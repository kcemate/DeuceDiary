# Write monitoring and alerting setup guide: what metrics to t
Agent: jordan
Generated: 2026-03-02T17:04:27.876753

## Monitoring and Alerting Setup Guide for a Social App

This guide outlines a comprehensive monitoring and alerting setup for a social app, focusing on key metrics and recommended thresholds. It's designed to provide visibility into performance, stability, and potential issues.

**I. Goals & Scope**

* **Proactive Issue Detection:** Identify potential problems before they impact users.
* **Performance Optimization:** Understand performance bottlenecks and identify areas for improvement.
* **Capacity Planning:** Monitor resource usage to plan for scaling.
* **Root Cause Analysis:**  Facilitate faster identification and resolution of issues.

**II. Metrics to Track**

We’ll categorize metrics for clarity and prioritize them based on their impact.

**A. Core Performance (Crucial)**

* **Latency (p50, p95, p99):**
    * **Definition:**  The time it takes to complete a request (e.g., fetching a post, submitting a comment, logging in).
    * **Why Track:** Directly reflects user experience. High latency leads to frustration and abandoned sessions.
    * **Targets:**
        * **p50 (50th Percentile):**  The latency experienced by 50% of requests. Aim for < 200ms.
        * **p95 (95th Percentile):** The latency experienced by 95% of requests. Aim for < 500ms.
        * **p99 (99th Percentile):** The latency experienced by 99% of requests. Aim for < 1s.  This is critical for identifying sporadic, but impactful, issues.
* **Error Rate:**
    * **Definition:** The percentage of requests that result in errors (HTTP 5xx errors, application exceptions).
    * **Why Track:** Indicates instability and potential problems within the app or backend services.
    * **Targets:**
        * **Overall Error Rate:**  < 1%  (Any higher requires immediate investigation)
        * **Critical Errors (500-599):** < 0.1% (Immediate action required)

**B. Backend & Infrastructure (Important)**

* **Database Connections:**
    * **Definition:** Number of active connections to the database.
    * **Why Track:** Excessive connections can lead to database overload and performance degradation.
    * **Targets:** Monitor trends, but a sudden spike warrants investigation.  Establish a baseline and alert if it exceeds 2 standard deviations from the baseline.
* **Memory Usage (Server, Application):**
    * **Definition:**  The amount of RAM being used by the application servers and the database server.
    * **Why Track:** Out-of-memory issues cause application crashes and performance degradation.
    * **Targets:** Monitor trends, establish thresholds based on server configuration and app needs. Alert if exceeds 80-90% utilization consistently.
* **CPU Utilization (Server, Application):**
    * **Definition:** Percentage of CPU being used by the application servers.
    * **Why Track:** High CPU utilization can indicate inefficient code or resource contention.
* **Network I/O (Server):**
    * **Definition:** Amount of data being sent and received over the network.
    * **Why Track:**  Identifies network bottlenecks.
* **Disk I/O (Server):**
    * **Definition:**  Rate at which data is being read from and written to disk.
    * **Why Track:** High disk I/O can slow down database operations and application performance.

**C. Application Specific (Contextual - Depends on Features)**

* **Post Processing Time:** (Time taken to process new posts before being displayed).
* **Comment Processing Time:** (Time taken to process new
