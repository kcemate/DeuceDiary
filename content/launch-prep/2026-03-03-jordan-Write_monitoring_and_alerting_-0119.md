# Write monitoring and alerting setup guide: what metrics to t
Agent: jordan
Generated: 2026-03-03T01:19:59.699050

## Monitoring and Alerting Setup Guide for a Social App

This guide outlines a comprehensive monitoring and alerting setup for a social app, focusing on key metrics to identify and address performance and stability issues.

**I. Goals & Principles:**

* **Proactive Issue Detection:**  Catch problems *before* they impact users.
* **Actionable Insights:**  Alerts should provide enough information to quickly diagnose and resolve the issue.
* **Prioritization:**  Focus alerts on the most impactful metrics for your user experience.
* **Reduce Noise:**  Avoid overwhelming teams with alerts that are not critical.
* **Continuous Improvement:** Regularly review and refine your monitoring setup based on data and operational experience.


**II. Metrics to Track:**

We’ll categorize metrics for clarity and prioritize based on their impact.

**A. Performance Metrics (User Experience Focus)**

| Metric           | Description                               | Measurement Units | Importance |
|------------------|-------------------------------------------|--------------------|------------|
| **Latency (p50/p95/p99)** | Time taken for key actions (e.g., post creation, feed loading, search). | ms/s               | **High**    |
|  - p50 (Percentile 50):  Median latency - Most users experience this. |
|  - p95 (Percentile 95):  95% of requests are under this. |
|  - p99 (Percentile 99):  99% of requests are under this. |
| **Error Rate**     | Percentage of requests resulting in errors. | %                  | **High**    |
|  - HTTP 500/502/503/504 errors | Server-side errors |
|  - Client-side errors (JavaScript errors) | UI errors |
| **API Response Time**| Time taken for API calls | ms/s | Medium |
| **Feed Load Time** | Time taken to load the user's feed | ms/s | High |



**B. System & Infrastructure Metrics (Stability Focus)**

| Metric            | Description                                  | Measurement Units | Importance |
|--------------------|----------------------------------------------|--------------------|------------|
| **DB Connections**  | Number of active database connections.         | Count              | **High**    |  (High numbers suggest connection pool issues)
| **CPU Usage**       | Percentage of CPU being used.                | %                  | **Medium**   | (Spikes can indicate resource bottlenecks)
| **Memory Usage**    | Percentage of memory being used.              | %                  | **Medium**   | (High usage can lead to swapping and performance degradation)
| **Disk I/O**       | Disk read/write activity.                     | MB/s               | **Low/Medium**| (High I/O can indicate inefficient queries or storage issues)
| **Network I/O**    | Network bandwidth usage.                    | MB/s               | **Low**       | (Detecting network congestion)
| **Queue Lengths (e.g., Message Queues - Kafka, RabbitMQ)** | Number of pending messages in a queue | Count              | **Medium**   | (Indicates potential message processing issues)



**C. Application Specific Metrics (Custom Metrics)**

| Metric                  | Description                                     | Measurement Units | Importance |
|-------------------------|-------------------------------------------------|--------------------|------------|
| **User Activity (e.g., Posts Created, Likes, Comments)** | Number of user actions.       | Count/Minute     | **Medium**   |
| **Session Duration**      | Average time users spend in the app per session. | Minutes            | **Low/Medium**|
|
