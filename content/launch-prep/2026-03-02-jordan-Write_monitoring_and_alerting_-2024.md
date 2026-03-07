# Write monitoring and alerting setup guide: what metrics to t
Agent: jordan
Generated: 2026-03-02T20:24:01.286522

## Monitoring and Alerting Setup Guide: Social App

This guide outlines a monitoring and alerting strategy for a social app, focusing on key metrics to ensure performance, stability, and scalability.  It covers metric selection, recommended thresholds, and suggested alerting tooling.

**I. Goals & Considerations:**

* **Proactive Problem Detection:** Identify issues *before* they impact users.
* **Performance Optimization:**  Understand how user activity and system load affect performance.
* **Capacity Planning:**  Predict resource needs based on usage patterns.
* **Root Cause Analysis:**  Quickly diagnose and resolve problems.

**II. Metrics to Track:**

We'll categorize metrics for clarity:

**A. User Experience (Performance):**

* **Latency (P50, P95, P99):**
    * **Definition:** Time taken for key user actions – e.g., posting a message, loading a feed, fetching a profile.
    * **Why Track:** Directly reflects user experience. High latency leads to frustration and churn.
    * **Tools:** Synthetic monitoring (e.g., Pingdom, UptimeRobot, k6), Real User Monitoring (RUM) tools (e.g., New Relic Browser, Datadog RUM).
* **Request Rate:** Number of requests received per unit of time (e.g., requests per second).
    * **Why Track:**  Indicates load and potential bottlenecks.
* **Session Duration:**  Average length of user sessions.
    * **Why Track:**  Higher session duration generally correlates with positive user engagement.
* **Feed Load Time:** Time to fully load a user's feed. (Crucial for a social app)


**B. System Health & Infrastructure:**

* **Error Rate:** Percentage of requests resulting in errors.
    * **Definition:** (Number of Errors / Total Requests) * 100
    * **Why Track:** Indicates potential code issues, infrastructure problems, or third-party service failures.
* **DB Connections:** Number of active connections to the database.
    * **Why Track:**  Excessive connections can lead to database overload and performance degradation.
* **DB Query Performance (Average & P95):**  Average and 95th percentile time taken for database queries.
    * **Why Track:**  Slow queries are a common performance bottleneck.
* **Memory Usage (Server & Application):** Total RAM used by the application servers and database servers.
    * **Why Track:**  Memory leaks or excessive resource consumption can lead to crashes and slowdowns.
* **CPU Usage (Server & Application):** CPU utilization of the application servers and database servers.
    * **Why Track:** High CPU usage indicates processing overload.
* **Disk I/O:** Read/Write operations to disk. (Important if using persistent storage)
* **Network Latency (Inbound/Outbound):**  Latency between your servers and external services (e.g., CDN, APIs).


**C. Application Specific Metrics (Examples - Adapt to Your App):**

* **Number of Active Users (DAU/WAU/MAU):**  Daily, Weekly, Monthly Active Users.
    * **Why Track:**  Fundamental indicator of user engagement.
* **Post Creation Rate:** Number of posts created per unit of time.
* **Image Upload Success Rate:**  Percentage of successful image uploads. (Essential for visual social apps)
* **API Request Latency (for internal APIs):** Latency for communication between microservices.



**III. Alert Thresholds & Severity Levels:**

| Metric             | P50 Threshold (Warning) | P95 Threshold (Error) | P99 Threshold (Critical) | Severity   |
|----------------------|-------------------------|-----------------------
