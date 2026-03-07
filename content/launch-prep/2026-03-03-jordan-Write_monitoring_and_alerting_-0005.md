# Write monitoring and alerting setup guide: what metrics to t
Agent: jordan
Generated: 2026-03-03T00:05:48.978427

## Monitoring & Alerting Setup Guide: Social App

This guide outlines a comprehensive monitoring and alerting strategy for a social app, focusing on key metrics to ensure performance, stability, and user experience.

**I. Goals & Objectives:**

* **Proactive Issue Detection:**  Identify and address performance issues *before* they impact users.
* **Root Cause Analysis:**  Quickly pinpoint the source of problems for faster resolution.
* **Performance Optimization:**  Monitor trends to identify areas for optimization and scaling.
* **System Health & Stability:**  Ensure critical infrastructure components are operating within expected parameters.


**II. Metrics to Track:**

We’ll categorize metrics for clarity and prioritization.

**A. User Experience (High Priority)**

* **Latency (P50, P95, P99):**
    * **Definition:**  The time it takes to respond to a user request (e.g., loading a feed, submitting a post, searching).
    * **Granularity:** Track latency per endpoint (API calls) and overall app latency.
    * **Tools:**  Application Performance Monitoring (APM) tools like Datadog, New Relic, Dynatrace, or Prometheus + Grafana.
* **Error Rate:**
    * **Definition:** Percentage of requests resulting in errors (4xx, 5xx).
    * **Granularity:** Track error rate by endpoint, error code, and request type.
    * **Tools:** APM tools, logging aggregation (e.g., ELK stack, Splunk).

**B. Backend Performance (Medium Priority)**

* **Database Connections:**
    * **Definition:** Number of active connections to the database.  High values can indicate a bottleneck.
    * **Granularity:** Track by database server, query type (if possible).
    * **Tools:** Database monitoring tools (e.g., Percona Monitoring and Management - PMM) or metrics exposed by your database system (Prometheus).
* **CPU Usage:**
    * **Definition:**  Percentage of CPU resources used by application servers.
    * **Granularity:**  Per server, per application process.
    * **Tools:** System monitoring tools like Prometheus, Grafana, or cloud provider monitoring.
* **Memory Usage:**
    * **Definition:** Amount of memory used by application servers.
    * **Granularity:** Per server, per application process.
    * **Tools:** Same as CPU usage.
* **Response Time of Key Services:**  (e.g., Feed Generation Service, Search Service) - Track latency specifically for core features.

**C. Infrastructure (Low Priority - Critical Issues)**

* **Disk I/O:** (Read/Write) - High I/O can indicate storage problems.
* **Network Traffic:** Ingress/Egress bandwidth.
* **Server Uptime:**  Percentage of time servers are operational.
* **Container Health (If using containers):** Health check status of containers.


**III. Alerting Setup:**

| Metric             | Threshold (Example) | Severity | Alert Trigger | Action                                   |
|----------------------|----------------------|----------|----------------|-------------------------------------------|
| **Latency P99 > 500ms** | 500ms                 | Critical | Immediate      | PagerDuty escalation, run root cause analysis |
| **Error Rate > 5%**     | 5%                    | Warning  | 15 minutes    | Investigate, deploy rollback if necessary   |
| **DB Connections > 80%**| 80%                    | Warning  | 15 minutes    | Investigate, scale database if necessary    |
| **CPU Usage > 80%**     | 80%                    | Warning
