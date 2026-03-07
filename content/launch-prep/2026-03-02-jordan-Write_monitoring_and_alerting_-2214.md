# Write monitoring and alerting setup guide: what metrics to t
Agent: jordan
Generated: 2026-03-02T22:14:25.760699

## Monitoring and Alerting Setup Guide for a Social App

This guide outlines a comprehensive monitoring and alerting setup for a social app, focusing on key performance indicators (KPIs) and recommended thresholds.  It's designed to be adaptable to your specific app and infrastructure.

**I. Goals & Objectives:**

* **Early Problem Detection:** Identify issues *before* they significantly impact user experience.
* **Performance Optimization:**  Understand how the app behaves under different loads and identify bottlenecks.
* **Proactive Maintenance:**  Predictive alerts based on trends allow for proactive maintenance and capacity planning.
* **Root Cause Analysis:**  Collected metrics facilitate faster diagnosis of issues.

**II. Metrics to Track:**

We'll categorize metrics for clarity.

**A. User Experience (Critical)**

* **Latency (P50, P95, P99):**  Time taken to complete key user actions.
    * **P50:** 50th percentile – represents the typical user experience.
    * **P95:** 95th percentile – Identifies the maximum acceptable latency for most users.
    * **P99:** 99th percentile –  The latency experienced by only a small percentage of users; a critical threshold to monitor for severe issues.
    * **Key Actions:**  Login, Posting, Commenting, Loading Feed, Searching, Image Upload/Download.
    * **Tooling:**  Application Performance Monitoring (APM) solutions like New Relic, Datadog, Dynatrace, or open-source options like Prometheus + Grafana.
* **Error Rate:** Percentage of requests resulting in errors.
    * **Error Types:** 500 errors (server errors), 400 errors (client errors), timeouts, etc.  Categorize for detailed analysis.
    * **Tooling:**  APM tools automatically track error rates.


**B. Backend Performance & Resource Usage**

* **DB Connections:** Number of active connections to the database.  High numbers can indicate slow queries or application issues.
    * **Thresholds:**  Above 90% utilization – requires investigation.
    * **Tooling:**  Database monitoring tools (e.g., pg_stats for PostgreSQL, MySQL Enterprise Monitor).  APM tools often integrate database monitoring.
* **Memory Usage (App Servers & DB Servers):** Total and per-process memory usage.
    * **Thresholds:** 80% Utilization - indicates potential memory pressure.  90% - Trigger warning. 95% - Immediate action.
    * **Tooling:**  Operating System Monitoring (e.g., top, htop), APM tools.
* **CPU Utilization (App Servers & DB Servers):**  Percentage of CPU being used.
    * **Thresholds:** 70-80% -  Requires investigation, potential bottleneck. 90%+ - Immediate investigation.
    * **Tooling:**  Operating System Monitoring.
* **Network I/O:**  Incoming and outgoing network traffic.
    * **Thresholds:**  Sudden spikes – investigate potential DDoS attacks or excessive data transfer.
    * **Tooling:**  Operating System Monitoring, Network Monitoring tools.
* **Queue Length (Message Queues - e.g., RabbitMQ, Kafka):** Number of messages waiting to be processed. High queues often point to slow worker processes.
    * **Thresholds:** > 100 - Trigger warning.  > 500 - Requires investigation.
    * **Tooling:**  Queue monitoring tools.


**C. Infrastructure & Service Health**

* **Uptime:** Overall system availability.
* **Response Time of External Services:** Latency of calls to third-party services (e.g., CDN,
