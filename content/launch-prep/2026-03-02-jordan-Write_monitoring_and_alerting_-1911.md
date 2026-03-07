# Write monitoring and alerting setup guide: what metrics to t
Agent: jordan
Generated: 2026-03-02T19:11:29.460986

## Monitoring & Alerting Setup Guide: Social App

This guide outlines a comprehensive monitoring and alerting setup for a social app, focusing on key metrics and recommended thresholds. This is a starting point and should be tailored based on your app's specific architecture, usage patterns, and service level objectives (SLOs).

**I. Monitoring Scope & Tools**

* **Monitoring Tools:** Choose a suitable platform. Popular options include:
    * **Prometheus & Grafana:** Open-source, powerful, great for time-series data.
    * **Datadog:** SaaS, easy setup, provides a wide range of integrations.
    * **New Relic:**  Comprehensive observability platform.
    * **Elastic Stack (ELK):**  Log aggregation and analysis.
* **Instrumentation:** You'll need to instrument your application to expose metrics. This can be done through:
    * **Application Performance Monitoring (APM):**  Tools like New Relic, Datadog APM, or open-source alternatives like Jaeger/Zipkin track request latency, error rates, and transaction traces.
    * **Libraries & SDKs:**  Utilize libraries specific to your language (e.g., Micrometer for Java, StatsD for Python) to expose key metrics.
    * **Metrics Exporters:**  Send metrics to your monitoring system using a lightweight exporter.

**II. Key Metrics to Track**

| Metric Category | Metric Name           | Description                               | Units      | Importance |
|------------------|-----------------------|-------------------------------------------|------------|------------|
| **Latency**       | p50 Latency          | 50th percentile request latency          | ms         | High       |
|                  | p95 Latency          | 95th percentile request latency          | ms         | High       |
|                  | p99 Latency          | 99th percentile request latency          | ms         | Medium     |
| **Error Rate**     | Error Rate            | Percentage of requests resulting in errors | %          | High       |
|                  | HTTP Status Codes     | Breakdown of HTTP status codes (2xx, 4xx, 5xx) | Count/Total | Medium     |
| **Database**      | DB Connections       | Number of active database connections      | Count      | High       |
|                  | DB Query Latency     | Average latency of database queries       | ms         | Medium     |
|                  | DB Connection Pool Usage | Percentage of connections in the pool         | %          | Low        |
| **Memory**        | Total Memory Usage   | Total amount of memory used by the app     | GB/MB      | Medium     |
|                  | Heap Memory Usage    | Memory used by the Java/Python heap       | GB/MB      | Medium     |
|                  | Garbage Collection Time | Time spent in garbage collection          | ms         | Low        |
| **System**        | CPU Usage            | CPU usage of the application server        | %          | Medium     |
|                  | Network I/O           | Network bandwidth usage                   | MB/s       | Low        |
| **User Activity** | Active Users          | Number of currently active users          | Count      | High       |
| **Queue Health** | Queue Length (e.g., message queues) | Length of messages in a queue       | Count      | Medium     |


**III. Alerting Thresholds - Suggested Values**

| Metric Category | Metric Name           | Threshold (Alert Trigger) | Threshold (Critical Alert) | Severity |
|------------------|-----------------------|---------------------------|----------------------------|----------|
| **Latency**       | p95 Latency          | 500ms                      | 1000ms                     | Warning
