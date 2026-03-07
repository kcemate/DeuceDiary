# Write monitoring and alerting setup guide.
Agent: jordan
Generated: 2026-03-03T21:55:50.893012

## Monitoring and Alerting Setup Guide

This guide outlines the steps involved in setting up a robust monitoring and alerting system. It covers planning, choosing tools, configuring monitoring, and defining effective alerts.

**Phase 1: Planning & Requirements Gathering**

1. **Identify Key Systems & Services:**
   * **What needs to be monitored?**  Start with critical systems like servers, databases, applications, networking equipment, cloud services (AWS, Azure, GCP), and websites.
   * **What metrics are important?** Determine what data you need to track. Examples:
      * **Server Health:** CPU usage, memory usage, disk I/O, uptime, error rates.
      * **Application Performance:** Response times, request rates, error rates, transaction volume.
      * **Database Health:** Query performance, connection counts, slow queries, available space.
      * **Network Performance:** Latency, packet loss, bandwidth utilization.
      * **Cloud Services:** Instance health, storage usage, API request success/failure.
   * **Establish Service Level Objectives (SLOs):** Define acceptable performance levels for each service. This will dictate your alert thresholds. (e.g., "Response time for API X must be under 200ms 99% of the time").

2. **Define Alerting Priorities:**
   * **Critical Alerts:** Require immediate action - outages, data loss, security breaches. These get the highest priority.
   * **Warning Alerts:** Indicate potential issues that need investigation - performance degradation, unusual activity.
   * **Informational Alerts:**  Useful for general awareness - resource utilization, scheduled maintenance.

3. **Determine Alerting Channels:**
   * **Email:**  Simple and widely used, but can be overwhelming.
   * **SMS:**  Good for critical alerts requiring immediate attention.
   * **Slack/Teams:**  Integrates with collaboration platforms, allowing for targeted notifications and context.
   * **PagerDuty/Opsgenie:**  On-call management tools for escalating alerts and routing to the right people.


**Phase 2: Tool Selection**

There are many monitoring and alerting tools available. Choose based on your budget, technical expertise, and needs.

* **Open Source:**
    * **Prometheus:** Powerful time-series database and monitoring system. Excellent for Kubernetes environments.
    * **Grafana:** Data visualization and dashboarding platform that integrates well with Prometheus and other monitoring tools.
    * **Zabbix:** Comprehensive monitoring solution covering various aspects of infrastructure and applications.
    * **Nagios:**  Classic monitoring system, still popular and highly customizable.
* **Commercial:**
    * **Datadog:** Cloud-based monitoring platform with extensive integrations.
    * **New Relic:** Application performance monitoring (APM) platform.
    * **Dynatrace:** AI-powered monitoring and observability platform.
    * **AWS CloudWatch, Azure Monitor, Google Cloud Monitoring:**  Native monitoring solutions for respective cloud providers.

**Phase 3: Configuration & Implementation**

1. **Install and Configure the Chosen Tool:**  Follow the documentation for your selected tool. This usually involves installing agents on monitored systems.

2. **Define Monitoring Rules (Metrics):**
   * **Configure Data Collection:**  Set up the tool to collect the metrics you identified in Phase 1. This typically involves installing agents or configuring the tool to access data from your systems.
   * **Aggregation & Calculations:** Some tools allow you to create custom metrics based on collected data (e.g., calculating average response time from multiple requests).

3. **Create Dashboards:**
    * **Visualize Data:**  Build dashboards to visualize key metrics and track trends over time. This provides a visual overview of system health.

4. **Set Up Alerting Rules (
