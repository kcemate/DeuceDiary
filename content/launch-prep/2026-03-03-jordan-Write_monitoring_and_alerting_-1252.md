# Write monitoring and alerting setup guide.
Agent: jordan
Generated: 2026-03-03T12:52:27.365767

## Monitoring & Alerting Setup Guide: A Comprehensive Overview

This guide outlines the steps to establish a robust monitoring and alerting system. It’s designed to be adaptable to various environments and needs. We’ll cover key considerations, tools, and best practices.

**Phase 1: Planning & Requirements Gathering**

1. **Identify Critical Systems & Services:**
   - **What needs monitoring?** Start with your most important applications, servers, databases, networks, and cloud services.
   - **Prioritize:** Rank systems based on business impact, potential downtime, and complexity.
   - **Document:** Create a list of all systems, their locations (on-premise, cloud), and dependencies.

2. **Define Key Performance Indicators (KPIs) & Metrics:**
   - **What to track?** For each system, identify the crucial metrics to monitor. Examples:
     * **Servers:** CPU usage, memory usage, disk I/O, network traffic, uptime, service status
     * **Databases:** Query latency, connection count, slow queries, disk space, replication lag
     * **Applications:** Response time, error rate, request volume, queue length, transaction success rate
     * **Networks:** Bandwidth usage, packet loss, latency, DNS resolution time
     - **Business-Related:**  Number of transactions, active users, revenue generated (if applicable)

3. **Determine Alerting Thresholds:**
   - **What triggers an alert?**  Set specific thresholds for each metric that will trigger an alert. This requires understanding your normal operating patterns.
   - **Use Percentiles:** Utilize percentiles (e.g., 95th percentile for response time) to detect outliers and avoid false positives.
   - **Establish Different Severity Levels:**  Define alert severity levels (e.g., Critical, Warning, Info) based on the potential impact of the issue.

4. **Define Alerting Channels & Routing:**
   - **How to notify?**  Choose your alerting channels:
     * **Email:**  Suitable for low-priority alerts and general notifications.
     * **SMS:** For critical alerts requiring immediate attention.
     * **Slack/Microsoft Teams:**  Collaborative notification and escalation.
     * **PagerDuty/OpsGenie:**  On-call scheduling and escalation management.
   - **Routing:** Establish clear routing rules to ensure alerts reach the correct teams or individuals.


**Phase 2: Tool Selection & Setup**

Here are popular tools categorized by their strengths:

* **Open Source:**
    * **Prometheus:**  Time-series database & monitoring system – excellent for collecting metrics from applications and infrastructure. (Requires Grafana for visualization)
    * **Grafana:**  Data visualization and dashboarding tool – seamlessly integrates with Prometheus and other data sources.
    * **Nagios/Icinga:** Classic monitoring systems, good for infrastructure monitoring.
    * **Zabbix:**  Comprehensive monitoring platform, good for network and server monitoring.

* **Cloud-Based (SaaS):**
    * **Datadog:**  Comprehensive monitoring platform with agent-based and agentless monitoring, log management, and more.
    * **New Relic:** Application Performance Monitoring (APM) and infrastructure monitoring.
    * **Dynatrace:** AI-powered monitoring platform with automatic root cause analysis.
    * **AWS CloudWatch:**  Monitoring service for AWS resources.
    * **Azure Monitor:**  Monitoring service for Azure resources.
    * **Google Cloud Monitoring:** Monitoring service for Google Cloud resources.

**Example Setup (Prometheus + Grafana):**

1. **Install Prometheus:**  Follow the official documentation for your operating system.
2. **Install Grafana:**  Follow the official documentation.
3. **Install Prometheus
