# Write monitoring and alerting setup guide: what metrics to t
Agent: jordan
Generated: 2026-03-03T00:42:58.166693

## Monitoring and Alerting Setup Guide: Social App

This guide outlines a monitoring and alerting strategy for a social app, focusing on key metrics and recommended alert thresholds. It’s designed to be adaptable to your specific app’s features and traffic patterns.

**I. Goals & Scope**

* **Proactive Issue Detection:** Quickly identify and resolve performance problems before they significantly impact users.
* **Capacity Planning:**  Understand resource utilization trends to plan for scaling.
* **Root Cause Analysis:**  Gain insights into the reasons behind issues to prevent recurrence.
* **Service Level Agreement (SLA) Adherence:**  Monitor performance against defined SLAs.


**II. Metrics to Track**

We'll categorize metrics for clarity:

**A. Performance Metrics (User Experience Focused)**

* **Latency (P50, P95, P99):**  Measure the time it takes to complete key user actions.
    * **P50 (50th Percentile):**  The time taken for 50% of requests to complete. – *Good indicator of average user experience.*
    * **P95 (95th Percentile):**  The time taken for 95% of requests to complete. – *Highlights potential bottlenecks impacting a significant portion of users.*
    * **P99 (99th Percentile):** The time taken for 99% of requests to complete. – *Signals critical issues - rarely experienced but represents the worst-case scenario for a large user base.*
    * **Target Ranges:**
        * **P50:** < 200ms (highly desirable), < 500ms (acceptable)
        * **P95:** < 800ms (highly desirable), < 1500ms (acceptable)
        * **P99:** < 2500ms (highly desirable), < 5000ms (acceptable)
* **Request Throughput:** Requests per second (RPS). Track overall system load.
* **Error Rate:** Percentage of requests resulting in errors (HTTP 5xx codes, application-specific errors).
    * **Overall Error Rate:** Should be as close to 0% as possible.
    * **Specific Error Rate:** Monitor error rates for specific endpoints or features.


**B. Backend/Infrastructure Metrics**

* **Database Connections:** Number of active database connections. High numbers can indicate inefficient queries or connection pool exhaustion.
    * **Threshold:**  Monitor for spikes above average usage, investigate correlations with increased request rates.
* **Memory Usage (Server & Database):** Total memory used, used memory, free memory.  Monitor memory leaks and potential out-of-memory errors.
    * **Threshold:**  Warn when approaching 80-90% of total memory usage.  Critical alert at 95%+.
* **CPU Usage (Server):**  Percentage of CPU used by the application server.  High CPU can indicate inefficient code, a surge in traffic, or a bottleneck.
    * **Threshold:** Warn at 70-80% - investigate. Critical at 90%+.
* **Disk I/O:** Disk read/write operations per second.  High I/O can indicate slow database queries or issues with storage performance.
* **Network I/O:** Network traffic in/out.  Identify potential network bottlenecks.

**C. Application-Specific Metrics (Highly Dependent on Your App)**

* **Active Users:** Number of users currently active.
* **Post Creation Rate:** Rate at which users are creating posts.
* **Message Sending Rate:** Rate at which users are sending messages.
* **API Call Rate:** Track calls to key APIs (e.g., user authentication, image uploads
