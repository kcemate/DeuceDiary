# Write monitoring and alerting setup guide: what metrics to t
Agent: jordan
Generated: 2026-03-02T21:55:55.301086

## Monitoring and Alerting Setup Guide: Social App

This guide outlines a monitoring and alerting setup for a social app, focusing on key metrics and recommended thresholds. It aims to provide proactive insights into performance issues and potential outages.

**I. Goals & Scope**

* **Objective:** Ensure a smooth user experience by identifying and addressing performance bottlenecks and errors quickly.
* **Scope:** This guide covers the core aspects of monitoring and alerting.  Specific implementation details will vary based on your infrastructure (cloud provider, database system, etc.) and tooling choices.


**II. Metrics to Track**

Here's a breakdown of essential metrics, categorized by their impact:

**A. User Experience (Critical):**

* **Latency (p50, p95, p99):**
    * **Description:**  The time taken for key operations (e.g., posting a message, fetching a feed, searching).  Understanding percentiles is vital – p50 is the median, p95 is the 95th percentile, and p99 is the 99th percentile.  This gives you a better picture of the *actual* experience for most users, and identifies extreme outliers.
    * **Metrics:**
        * `/posts/create` latency (p50, p95, p99)
        * `/feed/get` latency (p50, p95, p99)
        * `/search` latency (p50, p95, p99)
        * `/user/profile` latency (p50, p95, p99)
    * **Tooling:**  Application Performance Monitoring (APM) tools like New Relic, Datadog, Dynatrace, or Prometheus + Grafana.
* **Error Rate:**
    * **Description:** Percentage of requests that result in errors. High error rates indicate underlying problems.
    * **Metrics:**  Overall error rate, error rates by endpoint (e.g., `/posts/create`, error types (400, 500))
    * **Tooling:** APM tools, logging platforms (ELK stack, Splunk), and monitoring dashboards.

**B. Backend & Infrastructure (Important):**

* **Database Connections:**
    * **Description:** Number of active connections to the database. High numbers can indicate resource constraints, inefficient queries, or connection leaks.
    * **Metrics:** Total connections, connections per server, average connection duration.
    * **Tooling:**  Database monitoring tools (e.g., pg_stats for PostgreSQL, MySQL Workbench monitoring), APM tools.
* **Memory Usage:**
    * **Description:** CPU and memory consumption of your application servers and database servers.  Memory leaks or excessive resource usage can severely impact performance.
    * **Metrics:**  CPU utilization (total and per process), Memory utilization (total, used, free), Swap usage.
    * **Tooling:**  System monitoring tools (Prometheus, Grafana, Datadog, New Relic).
* **Request Queue Length (Message Queue - e.g., Kafka, RabbitMQ):**
    * **Description:** Indicates if your message queue is backing up.  If the queue grows excessively, it can lead to message processing delays.
    * **Metrics:** Queue depth, rate of message consumption, rate of message production.
    * **Tooling:**  Message queue monitoring tools.
* **Network Latency:**
    * **Description:** Ping times to key servers (web servers, database servers, caching servers).
    * **Metrics:**  Average ping, maximum ping, jitter.
    * **Tooling:**  Ping tools, network monitoring solutions.
* **Disk I/O:**
    * **Description
