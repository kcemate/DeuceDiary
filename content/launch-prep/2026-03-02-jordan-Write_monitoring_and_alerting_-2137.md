# Write monitoring and alerting setup guide: what metrics to t
Agent: jordan
Generated: 2026-03-02T21:37:25.656098

## Monitoring & Alerting Setup Guide: Social App

This guide outlines a robust monitoring and alerting system for a social app, focusing on key metrics to ensure performance, stability, and identify potential issues quickly.

**I. Goals:**

* **Proactive Problem Detection:** Identify issues *before* they impact users.
* **Root Cause Analysis:** Provide data needed to quickly diagnose and resolve problems.
* **Performance Optimization:** Use metrics to understand performance bottlenecks and guide optimization efforts.
* **Service Level Agreement (SLA) Adherence:**  Ensure key metrics meet defined SLAs.

**II. Monitoring Tools & Architecture:**

* **Centralized Monitoring Platform:**  Prometheus, Datadog, New Relic, Grafana Cloud – Choose one based on your team's familiarity and budget.  Prometheus + Grafana is a popular open-source option.
* **Agents:**  Install agents on all servers, containers, and database servers. These agents will collect metrics and send them to the monitoring platform.
* **Logging Agent:**  Elasticsearch/Kibana (ELK stack), Splunk, or similar – for collecting and analyzing logs.
* **Service Mesh (Optional):**  Istio, Linkerd –  Provides advanced metrics and tracing for microservices.


**III. Metrics to Track:**

Here's a breakdown of critical metrics, categorized by impact:

**A. Performance (User Experience):**

* **Latency (P50, P95, P99):**  This is the *most* important metric.
    * **Definition:**  Time taken to complete key user actions (e.g., posting, loading a feed, searching, sending a message).
    * **Granularity:** Measure latency per endpoint/API call and overall application latency.
    * **Tools:** Prometheus, Datadog, New Relic -  Utilize tracing capabilities to pinpoint where latency is occurring.
    * **Alert Thresholds:**
        * **P95 > 500ms:** Warning - Investigate potential server overload, database bottlenecks.
        * **P99 > 1s:** Critical - Immediate investigation needed; likely a major issue.
* **Request Throughput (Requests per Second - RPS):** Tracks the number of requests handled by your application.
    * **Why Track:** Helps identify scaling issues or sudden spikes in traffic.
    * **Thresholds:** Dependent on your expected traffic patterns.  Set alerts for deviations beyond +/- 20% of the average.

**B. Application Health & Errors:**

* **Error Rate:** Percentage of requests that result in errors (HTTP 500, 400, etc.).
    * **Definition:**  Count of errors / Total number of requests.
    * **Granularity:** Track error rates at the application level, service level, and endpoint level.
    * **Alert Thresholds:**
        * **> 1%:** Warning - Indicates a problem with application logic or infrastructure.
        * **> 5%:** Critical - Requires immediate attention and rollback if possible.
* **Application Crash Rate:**  Frequency of application crashes.
    * **Tools:**  Crash reporting services like Sentry or New Relic.
* **Custom Errors:**  Track specific application errors relevant to your social app's functionality (e.g., "Failed to fetch user data").

**C. Backend & Infrastructure:**

* **Database Connections:** Number of active connections to your database.
    * **Why Track:** High numbers can indicate inefficient queries, slow applications, or connection pool exhaustion.
    * **Alert Thresholds:**
        * **> 80% of Max Connections:** Warning - Database is heavily loaded, investigate slow queries.
        * **Max Connections Reached:** Critical - Immediate investigation
