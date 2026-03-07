# Write monitoring and alerting setup guide: what metrics to t
Agent: jordan
Generated: 2026-03-02T23:28:40.146081

## Monitoring and Alerting Setup Guide: Social App

This guide outlines a comprehensive monitoring and alerting setup for a social app, focusing on key metrics and recommended thresholds. It aims to provide proactive insights into performance and stability, enabling quick issue resolution and preventing user impact.

**I. Goals & Scope**

* **Proactive Issue Detection:**  Identify and address performance bottlenecks before they impact users.
* **Root Cause Analysis:** Provide data to quickly pinpoint the source of issues.
* **Capacity Planning:** Track trends to understand growth and anticipate scaling needs.
* **Service Level Objectives (SLOs) Alignment:**  Ensure system performance meets defined goals for key features.

**II. Metrics to Track**

We’ll categorize metrics for clarity and focus.  Tools like Prometheus, Grafana, Datadog, New Relic, or similar can be used to collect and visualize these.

**A. Application Performance:**

* **Latency (p50, p95, p99):**
    * **Definition:**  The time taken to complete key API requests (e.g., user login, post creation, feed retrieval).
    * **Why Track:**  Directly impacts user experience.  p99 latency is particularly important as it represents the worst-case user experience.
    * **Target:**  This depends on your app's functionality and expected user experience.  A good starting point:
        * **p50:** < 500ms - Good User Experience
        * **p95:** < 1.5s - Acceptable for most use cases
        * **p99:** < 5s -  Critical; should be actively addressed.
* **Error Rate:**
    * **Definition:** Percentage of requests that result in errors (e.g., 500, 400 errors).
    * **Why Track:** Indicates problems with application logic, external dependencies, or infrastructure.
    * **Target:**  < 1% - Generally considered good.  Higher rates require immediate investigation.  Segment by error type (e.g., HTTP 500, Database errors) for better analysis.
* **Request Throughput:**
    * **Definition:** Number of requests processed per unit of time (e.g., requests per second – RPS).
    * **Why Track:** Helps identify scaling issues and understand system load.
* **API Response Time:**
    * **Definition:** Time taken for an API to respond to a request.  Important for performance and debugging API calls.

**B. Database Performance:**

* **DB Connection Pool Utilization:**
    * **Definition:** Percentage of available connections in the connection pool.
    * **Why Track:** High utilization indicates the application may be waiting for connections and suggests potential bottlenecks or the need for more connections.
    * **Target:**  < 80% –  Leave headroom for concurrent requests.
* **Query Latency (p95/p99):**
    * **Definition:** Time taken to execute database queries.
    * **Why Track:** Slow queries are a frequent cause of application performance problems.
    * **Target:**  Similar to application latency -  p95 < 200ms, p99 < 500ms.
* **DB Active Connections:**
    * **Definition:** Number of currently open database connections.
    * **Why Track:**  Helps understand overall database load and potential connection issues.
* **Slow Query Logs:**  Enable and monitor slow query logs to identify problematic queries.

**C. Infrastructure Metrics:**

* **CPU Utilization (Server/Container):**
    * **Definition:** Percentage of CPU used by the application servers.
    * **Why Track:**  High CPU can indicate resource constraints or inefficient
