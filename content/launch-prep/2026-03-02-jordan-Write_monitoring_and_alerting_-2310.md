# Write monitoring and alerting setup guide: what metrics to t
Agent: jordan
Generated: 2026-03-02T23:10:08.470064

## Monitoring & Alerting Setup Guide: Social App

This guide outlines a robust monitoring and alerting setup for a social app, focusing on key performance indicators (KPIs) and recommended alert thresholds. It aims to proactively identify issues and minimize impact on users.

**I. Goals & Scope:**

* **Proactive Issue Detection:** Catch problems before they significantly impact user experience.
* **Performance Optimization:** Identify bottlenecks and areas for performance tuning.
* **Resource Management:**  Ensure adequate resources are allocated to support app demand.
* **Rapid Recovery:**  Quickly identify and address incidents for faster resolution.

**II. Metrics to Track:**

We’ll categorize metrics into several key areas:

**A. Application Performance (User Experience):**

* **Latency (P50, P95, P99):**
    * **What it is:**  Time taken for key operations (e.g., user login, post creation, feed loading).  P50 is the 50th percentile, P95 is the 95th, and P99 is the 99th.
    * **Why track it:** Directly reflects user experience. High latency leads to frustration and churn.
    * **Sources:** Application Performance Monitoring (APM) tools (e.g., New Relic, Datadog, Dynatrace), custom logging.
* **Error Rate:**
    * **What it is:** Percentage of requests that result in an error.
    * **Why track it:** Indicates problems with code, dependencies, or infrastructure.
    * **Sources:** APM tools, application logs.
* **API Response Time:**  Similar to latency, but specifically for API endpoints.

**B. Backend Infrastructure:**

* **Database Connections:**
    * **What it is:** Number of active database connections.
    * **Why track it:** High numbers can indicate inefficient queries, connection pooling issues, or application code not releasing connections properly.
    * **Sources:** Database monitoring tools (e.g., pgAdmin, MySQL Enterprise Monitor, Cloud SQL Insights).
* **Memory Usage (Server & Application):**
    * **What it is:** Total memory used by servers and the application.
    * **Why track it:**  Memory leaks, excessive caching, or insufficient memory allocation can lead to crashes or performance degradation.
    * **Sources:** System monitoring tools (e.g., Prometheus, Grafana, Cloud Monitoring), APM tools.
* **CPU Usage (Server):**
    * **What it is:** Percentage of CPU resources used by the server.
    * **Why track it:** High CPU usage indicates computationally intensive tasks or inefficient code.
    * **Sources:** System monitoring tools.
* **Disk I/O:**  Read/Write operations on disk.  Identifies issues with slow storage.
* **Network I/O:**  Network traffic in and out of the server.  Helps detect network bottlenecks.


**C. Business Metrics (Less granular, but important for strategic insights):**

* **Active Users (DAU/WAU/MAU):** Daily/Weekly/Monthly Active Users – a key indicator of app adoption.
* **Post Creation Rate:**  Number of posts created per day/week/month.
* **Engagement Metrics (Likes, Shares, Comments):**  Track engagement to understand content performance and user activity.  These can be more volatile.



**III. Monitoring Tools & Setup:**

* **Centralized Logging:** ELK stack (Elasticsearch, Logstash, Kibana), Splunk, Sumo Logic.  Collect and analyze logs from all components.
* **Time-Series Database:** Prometheus, InfluxDB.  Store and query metrics like latency, error rates, and resource utilization.
* **APM
