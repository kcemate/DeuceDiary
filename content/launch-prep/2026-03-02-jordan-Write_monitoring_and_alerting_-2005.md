# Write monitoring and alerting setup guide: what metrics to t
Agent: jordan
Generated: 2026-03-02T20:05:46.841253

## Monitoring and Alerting Setup Guide: Social App

This guide outlines a comprehensive monitoring and alerting strategy for a social application, covering key metrics, recommended thresholds, and integration suggestions.  The goal is to proactively identify and address performance issues and potential outages before they impact users.

**1. Goals & Scope**

* **Proactive Issue Detection:**  Catch performance degradation and errors before users notice.
* **Root Cause Analysis:** Provide the data needed to quickly identify the source of problems.
* **Service Level Agreement (SLA) Monitoring:** Track key performance indicators against defined SLAs.
* **Capacity Planning:**  Use monitoring data to anticipate scaling needs.

**2. Key Metrics to Track**

We'll categorize metrics for clarity and prioritize based on their impact.

**A. Performance Metrics (User-Facing Experience)**

* **Latency (P50, P95, P99):**  Crucial for user experience.
    * **Definition:** Time taken to complete a key action, such as:
        * **Post Creation:** Time to store the post in the database.
        * **Feed Loading:** Time to fetch and render the user's feed.
        * **Search:** Time to execute a search query.
        * **Login/Registration:** Time to authenticate a user.
    * **Why it Matters:** High latency directly impacts user engagement and satisfaction.
    * **Tools:**  Application Performance Monitoring (APM) tools (New Relic, Datadog, Dynatrace, AppDynamics) automatically capture this.
* **Request Rate:** Number of requests per second. Useful for identifying sudden spikes or surges.
    * **Tool:** APM tools, Load Balancers, Web Servers Logs

**B. Backend Metrics (Server-Side Health)**

* **Error Rate:** Percentage of requests that result in errors.
    * **Definition:** Total number of error responses (5xx, 4xx) divided by total number of requests.
    * **Why it Matters:** Indicates issues with the application logic, API endpoints, or server-side dependencies.
    * **Tool:** APM Tools, Server Logs (Apache, Nginx)
* **DB Connections:** Number of active database connections.
    * **Why it Matters:**  High connection counts can indicate inefficient queries, resource bottlenecks, or excessive load.
    * **Tool:** Database Monitoring Tools (e.g., Datadog DB Monitoring, Prometheus + Grafana)
* **Database Query Performance:**
    * **Metrics:** Average query execution time, number of slow queries, top 5 slowest queries.
    * **Why it Matters:** Slow queries are a primary cause of latency and can indicate database design issues or inefficient queries.
    * **Tool:** Database Monitoring Tools, APM tools with database instrumentation.
* **CPU Usage:**  Percentage of CPU resources used by application servers.
    * **Why it Matters:** High CPU can indicate inefficient code, excessive requests, or a need for more powerful servers.
    * **Tool:** System Monitoring Tools (Prometheus, Grafana, Datadog)
* **Memory Usage:** Amount of memory used by application servers.
    * **Why it Matters:** Memory leaks or excessive memory usage can lead to performance degradation and crashes.
    * **Tool:** System Monitoring Tools (Prometheus, Grafana, Datadog)
* **JVM Heap Usage (If Applicable):** Percentage of used heap memory, young generation GC activity.
    * **Why it Matters:** If your app is written in Java/JVM, monitoring heap usage is critical for preventing OutOfMemoryErrors.
    * **Tool:** APM tools (New Relic, Datadog, etc.) and JVM-specific monitoring tools.


**C. Infrastructure Metrics**

* **Network Latency
