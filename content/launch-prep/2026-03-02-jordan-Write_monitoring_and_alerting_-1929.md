# Write monitoring and alerting setup guide: what metrics to t
Agent: jordan
Generated: 2026-03-02T19:29:36.138361

## Monitoring & Alerting Setup Guide: Social App

This guide outlines a comprehensive monitoring and alerting strategy for a social app, focusing on key metrics and recommended thresholds. The goal is to proactively identify and address performance and stability issues before they impact users.

**I. Monitoring Scope & Tools**

* **Tools:**  Choose a monitoring platform based on your team's skills and budget. Popular options include:
    * **Prometheus + Grafana:** Open-source, flexible, and powerful.
    * **Datadog:** SaaS, easy to set up and use, excellent visualization.
    * **New Relic:**  Comprehensive, strong APM capabilities.
    * **Dynatrace:** AI-powered monitoring, good for complex environments.
* **Instrumentation:**  Implement metrics collection across your entire stack - frontend (web/mobile apps), backend services (API, processing), and databases.  Utilize libraries and agents within your app to automatically report data.
* **Logging:** Integrate with a centralized logging solution (e.g., ELK stack, Splunk) for troubleshooting and detailed analysis.


**II. Key Metrics to Track**

We’ll categorize metrics for clarity:

**A. Frontend (Web/Mobile App)**

* **Latency (P50/P95/P99):**  Crucial for user experience.
    * **P50 (Percentile 50):** The median response time – a good indicator of average performance.
    * **P95:** 95% of requests are faster than this. Critical for identifying bottlenecks.
    * **P99:** 99% of requests are faster than this.  Highlights extreme outliers and can signal serious problems.
    * **Location:** Track latency geographically to identify regional issues.
* **Error Rate:** Number of failed requests.
    * **HTTP Status Codes:** Track 5xx (server errors), 4xx (client errors), and 2xx (success) codes.
* **Page Load Time:** Time to fully load a page – related to latency.
* **Session Duration:**  Average time users spend in the app.
* **JavaScript Errors:** Track errors in client-side JavaScript for debugging.
* **Network Requests:** Number of requests made by the app – potentially indicative of excessive or inefficient calls.
* **User Actions (Optional):**  Track key user flows (e.g., post creation, comment activity) to correlate with performance.


**B. Backend (API/Services)**

* **Request Latency (P50/P95/P99):** Similar to frontend latency, but measured from the API endpoint.
* **Throughput (Requests per Second - RPS):**  Measure the number of requests handled by the API.  Helps with scaling.
* **Error Rate:** Same as frontend, but focused on API endpoints.
* **Service CPU Usage:**  Indicates resource constraints.
* **Service Memory Usage:**  Another critical indicator of resource pressure.
* **Queue Lengths (if using message queues):** Monitor queue depth for services relying on queues.
* **Dependency Latency (External Services):**  Track the latency of calls to external services (e.g., payment gateways, social media APIs).


**C. Database**

* **DB Connections:** Number of active database connections.  High numbers can indicate connection leaks or resource contention.
* **Query Latency (P50/P95/P99):**  Measure the time it takes to execute database queries.  Identify slow queries.
* **Database CPU Usage:** Indicates database server load.
* **Database Memory Usage:**  Monitor memory consumption.
* **Database Disk I/O:** Tracks disk read/write activity, indicating potential bottlenecks
