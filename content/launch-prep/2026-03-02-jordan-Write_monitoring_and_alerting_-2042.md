# Write monitoring and alerting setup guide: what metrics to t
Agent: jordan
Generated: 2026-03-02T20:42:09.643286

## Monitoring & Alerting Setup Guide: Social App

This guide outlines a comprehensive monitoring and alerting setup for a social app, covering key metrics and recommended thresholds.  The goal is to proactively identify and address performance bottlenecks, errors, and resource issues, ensuring a smooth user experience.

**I. Goals & Key Considerations:**

* **User Experience:** Prioritize metrics directly impacting user experience - latency, error rates.
* **Scalability:** Design for future growth - monitor resource utilization to identify scaling needs.
* **Root Cause Analysis:** Collect enough data for effective troubleshooting – correlated metrics are key.
* **Service Level Objectives (SLOs):** Define target latency, error rates based on business requirements (e.g., 99.9% uptime).
* **Alert Fatigue:**  Set thresholds carefully to avoid excessive alerts and ensure operators focus on critical issues.

**II. Metrics to Track:**

We'll categorize metrics for clarity and actionable insights:

**A. Performance Metrics (User Experience Focused):**

* **Latency (P50, P95, P99):**
    * **Definition:** Time taken for key operations like:
        * User Login
        * Post Creation
        * Feed Loading
        * Search Queries
        * Commenting
    * **Measurement:**  Use application performance monitoring (APM) tools like New Relic, Datadog, AppDynamics, or Prometheus + Grafana.
    * **Importance:**  Directly reflects user experience.  High P99 latency is critical.
* **Error Rate:**
    * **Definition:** Percentage of requests resulting in errors.
    * **Measurement:** Track HTTP status codes (4xx, 5xx), application-specific error logs.
    * **Importance:**  Indicates instability and potential bugs. Segment by error type for root cause analysis.

**B. Backend Infrastructure Metrics:**

* **Database Connections:**
    * **Definition:** Number of active connections to the database.
    * **Measurement:** Database monitoring tools (e.g., Percona Monitoring and Management, pgAdmin) or APM integrations.
    * **Importance:** High values can indicate inefficient queries, resource contention, or excessive load.
* **Memory Usage:**
    * **Definition:** Total and utilized memory across all application servers.  Track per component (JVM, Web Servers, etc.).
    * **Measurement:** System monitoring tools (Prometheus, Grafana, CloudWatch).
    * **Importance:**  Memory leaks, insufficient memory allocation can lead to crashes and performance degradation.
* **CPU Usage:**
    * **Definition:**  CPU utilization of application servers.
    * **Measurement:** System monitoring tools.
    * **Importance:**  High CPU usage can signal inefficient code, excessive computations, or resource bottlenecks.
* **Disk I/O:**
    * **Definition:**  Disk read/write operations.
    * **Measurement:** System monitoring tools.
    * **Importance:**  Slow disk I/O can bottleneck database performance and application speed.
* **Network I/O:**
    * **Definition:**  Network traffic in and out of servers.
    * **Measurement:** System monitoring tools.
    * **Importance:**  High network I/O can indicate problems like slow database queries, excessive data transfer, or network congestion.

**C. Service-Specific Metrics:**

* **Queue Length (if using message queues - Kafka, RabbitMQ):**  Indicates backlog and potential delays in processing tasks.
* **Cache Hit Rate:** Measures the effectiveness of your caching strategy.
* **Third-Party API Latency:** (If relying on external APIs) -  Track response times for external service calls.


**III. Alerting Setup & Thresholds:**

| Metric              | Threshold (Example)
