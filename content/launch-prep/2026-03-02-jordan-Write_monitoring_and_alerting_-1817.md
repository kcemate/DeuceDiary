# Write monitoring and alerting setup guide: what metrics to t
Agent: jordan
Generated: 2026-03-02T18:17:02.347434

## Monitoring & Alerting Setup Guide: Social App

This guide outlines a comprehensive monitoring and alerting setup for a social app, focusing on key metrics for identifying and addressing performance issues and potential outages.

**I. Goals & Philosophy**

* **Proactive Identification:** Detect issues *before* they impact users.
* **Granular Insight:** Understand performance at different levels – frontend, backend, database.
* **Actionable Alerts:** Alerts should be specific and provide context for immediate investigation.
* **Focus on User Experience:** Prioritize metrics directly correlated with user satisfaction.

**II. Metric Categories & Tracking**

We'll break down the metrics into several categories:

**1. Performance (User-Centric)**

* **Latency (P50, P95, P99):**
    * **Definition:**  The time taken for a specific operation (e.g., loading a post, submitting a comment, searching) to complete.
    * **Metrics:**
        * **P50 (Percentile 50):**  The time below which 50% of requests fall.  Good baseline for typical performance.
        * **P95:**  The time below which 95% of requests fall.  Indicates the upper limit of acceptable response times for a significant portion of users. *Critical.*
        * **P99:** The time below which 99% of requests fall. Represents the worst-case performance experienced by a small percentage of users. *Very Important - often triggers escalation.*
    * **Tools:** Application Performance Monitoring (APM) tools (New Relic, Datadog, AppDynamics, Dynatrace) are *essential* for accurate latency measurement.
* **Error Rate:**
    * **Definition:** The percentage of requests that result in errors.
    * **Metrics:** Overall error rate, error rate by endpoint/API, and error rate broken down by error type (e.g., 400, 500).
    * **Tools:** APM tools, Logging aggregators (Splunk, ELK stack)

**2. Backend & Infrastructure**

* **DB Connections:**
    * **Definition:** The number of active database connections.
    * **Metrics:** Total connections, active connections, connection pool utilization.
    * **Why it's important:**  High connection counts can indicate inefficient queries, slow loading, or a bottleneck.
    * **Tools:** Database monitoring tools (e.g., pg_stats for PostgreSQL, MySQL Workbench).
* **Memory Usage (Server & Application):**
    * **Definition:** The amount of RAM being used by the servers and the application process.
    * **Metrics:** Total RAM, used RAM, free RAM, memory utilization percentage.
    * **Why it’s important:** Memory exhaustion leads to crashes and performance degradation.
    * **Tools:** System monitoring tools (Prometheus + Grafana, Datadog).
* **CPU Utilization:**
    * **Definition:** The percentage of CPU being used by the servers.
    * **Metrics:** Overall CPU, CPU per process/service.
    * **Why it’s important:**  High CPU usage can indicate inefficient code, resource contention, or excessive load.
    * **Tools:** System monitoring tools (Prometheus + Grafana, Datadog).
* **Network I/O:**
    * **Definition:** The amount of data being sent and received over the network.
    * **Metrics:** Bytes in, bytes out, packets in, packets out.
    * **Why it’s important:**  Network bottlenecks can cause latency issues.
    * **Tools:** System monitoring tools (Prometheus + Grafana, Datadog).
* **Request Queue Length (Message Queues
