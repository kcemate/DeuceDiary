# Write monitoring and alerting setup guide: what metrics to t
Agent: jordan
Generated: 2026-03-02T21:18:51.225126

## Monitoring and Alerting Setup Guide for a Social App

This guide outlines a comprehensive monitoring and alerting setup for a social app, focusing on key metrics and recommended thresholds. It’s designed to be adaptable – you’ll need to tailor it to your specific application architecture, traffic patterns, and business needs.

**I. Goals:**

* **Early Problem Detection:** Identify and resolve issues *before* they impact users.
* **Performance Optimization:** Understand how the application performs under different loads.
* **Capacity Planning:**  Predict future resource needs based on usage trends.
* **Root Cause Analysis:**  Quickly pinpoint the source of problems during incidents.


**II. Monitoring Tools (Examples):**

* **Prometheus:** Time-series database and monitoring system – excellent for dynamic metrics.
* **Grafana:** Visualization dashboard for Prometheus and other data sources.
* **ELK Stack (Elasticsearch, Logstash, Kibana):**  Log aggregation, analysis, and visualization.
* **Datadog/New Relic/Dynatrace:**  Commercial APM (Application Performance Monitoring) solutions – offer more advanced features.
* **CloudWatch (AWS), Azure Monitor, Google Cloud Monitoring:** Native monitoring services for respective cloud providers.

**III. Key Metrics to Track:**

| Metric Category        | Metric Name                | Description                               | Collection Frequency | Unit |
|------------------------|-----------------------------|-------------------------------------------|-----------------------|------|
| **Application Latency** | P50 Latency                 | 50th percentile response time             | 1 minute               | ms   |
|                        | P95 Latency                 | 95th percentile response time            | 1 minute               | ms   |
|                        | P99 Latency                 | 99th percentile response time            | 1 minute               | ms   |
| **Error Rates**        | HTTP Error Rate             | Number of HTTP errors (4xx, 5xx)          | 1 minute               | %    |
|                        | Application Error Rate      | Number of application-specific errors      | 1 minute               | Count|
| **Database**           | DB Connections               | Number of active database connections      | 1 minute               | Count|
|                        | Query Latency (Avg/P95/P99)  | Average, 95th, and 99th query response time | 1 minute               | ms   |
| **Infrastructure**     | CPU Utilization (All Servers) | Percentage of CPU used                     | 1 minute               | %    |
|                        | Memory Utilization (All Servers)| Percentage of memory used                   | 1 minute               | %    |
|                        | Disk I/O                     | Disk read/write operations                  | 1 minute               | MB/s |
| **Network**            | Request Latency (Network)     | Latency measured on the network            | 1 minute               | ms   |
| **Social App Specific**| Active Users                | Number of currently active users           | 1 minute               | Count|
|                        | Story Views/Likes/Comments   | Engagement Metrics (dependent on features)| 1 minute               | Count|
| **Queue Sizes (if applicable)**| Message Queue Length         | Number of messages in the queue            | 1 minute               | Count|


**IV. Alerting Thresholds:**

| Metric Category        | Metric Name                | Threshold (Warning) | Threshold (Critical) | Severity | Action                               |
|------------------------|-----------------------------|---------------------|----------------------|----------|-------------------------------------|
| **Application Latency** | P99 Latency                 | 500ms                | 1000ms               | High     | Notify on-
