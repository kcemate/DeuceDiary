# Write monitoring and alerting setup guide: what metrics to t
Agent: jordan
Generated: 2026-03-02T23:47:13.680261

## Monitoring and Alerting Setup Guide: Social App

This guide outlines a comprehensive monitoring and alerting strategy for a social app, focusing on key metrics to ensure performance, stability, and user experience.

**I. Goals & Objectives**

* **Proactive Issue Detection:** Identify and address potential problems before they impact users.
* **Performance Optimization:** Understand performance bottlenecks and identify areas for improvement.
* **System Stability:** Ensure the application remains stable under load and prevents outages.
* **Real-time Insights:** Gain a quick understanding of the app's health and behavior.

**II. Metrics to Track**

We’ll categorize metrics for clarity and prioritization:

**A. Performance Metrics (User Experience Focused)**

* **Latency (p50, p95, p99):**
    * **Definition:** Time taken to complete key user actions (e.g., loading a post, sending a message, searching).
    * **Why Track:** Directly impacts user experience. High latency leads to frustration and abandonment.
    * **Granularity:** Track latency for specific user journeys (e.g., Post Creation, Message Sending, Feed Loading).
    * **Tools:** Prometheus + Grafana, New Relic, Datadog, or application-specific monitoring.
* **Error Rate:**
    * **Definition:** Percentage of requests resulting in errors.
    * **Why Track:** Indicates underlying problems and potential failures.
    * **Granularity:** Break down by error type (500, 400, client-side errors).
    * **Tools:** Application logging, error tracking services (Sentry, Rollbar), monitoring dashboards.

**B. Backend Infrastructure Metrics**

* **DB Connections:**
    * **Definition:** Number of active database connections.
    * **Why Track:** High connection counts can indicate inefficient queries, connection pool issues, or excessive load.
    * **Tools:** Database monitoring tools (e.g., Percona Monitoring & Management, Datadog DB monitoring)
* **Memory Usage (Server & App):**
    * **Definition:** Total memory consumption of application servers and the application itself.
    * **Why Track:** Memory leaks or excessive memory consumption lead to performance degradation and crashes.
    * **Tools:**  Prometheus + Grafana, System monitoring tools (e.g., Nagios, Zabbix).
* **CPU Usage (Server):**
    * **Definition:** CPU utilization of application servers.
    * **Why Track:** High CPU usage indicates processing bottlenecks or inefficient code.
    * **Tools:** Same as Memory Usage.
* **Network I/O:**
    * **Definition:**  Bytes sent and received by the servers.
    * **Why Track:** High network I/O can indicate a bottleneck in data transfer or excessive requests.
    * **Tools:** System monitoring tools, Network monitoring tools.
* **Request Rate:**
    * **Definition:** Number of requests processed per second.
    * **Why Track:** Provides an overall sense of load on the backend.
    * **Tools:** Application performance monitoring (APM) tools.

**C. Application Specific Metrics (Highly Recommended)**

* **Feed Load Time:** Specifically monitor the time it takes to load the main feed.
* **Search Latency:** Track the time taken for searches, particularly for popular queries.
* **Message Delivery Rate:**  (If applicable) Percentage of messages successfully delivered.
* **Notification Delivery Rate:** (If applicable) Percentage of notifications successfully delivered.


**III. Alerting Strategy & Thresholds**

| Metric               | Alert Level | Threshold                               | Severity | Trigger Condition                               | Action                                                                    |
|-----------------------|-------------|------------------------------------------|---------|-----------------------------------------------|--------------------------------------------------------------------------|
