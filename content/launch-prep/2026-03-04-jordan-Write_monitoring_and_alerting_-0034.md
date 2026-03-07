# Write monitoring and alerting setup guide.
Agent: jordan
Generated: 2026-03-04T00:34:08.865236

## Monitoring and Alerting Setup Guide

This guide outlines a comprehensive approach to setting up monitoring and alerting for your applications and infrastructure. It covers key considerations, tools, and best practices, aiming for a robust and effective system.

**Phase 1: Planning & Requirements**

1. **Identify Critical Services & KPIs:**
   * **List all applications and infrastructure:** Servers, databases, network devices, cloud services, etc.
   * **Define Key Performance Indicators (KPIs):** What needs to be monitored? Examples:
      * **Servers:** CPU utilization, memory usage, disk I/O, network traffic, response time.
      * **Databases:** Query latency, connection counts, slow queries, replication lag, disk space.
      * **Network:** Bandwidth usage, packet loss, latency, DNS resolution time.
      * **Applications:** Request volume, error rates, response times, user sessions.
   * **Prioritize:** Focus on services most critical to your business or with the biggest potential impact if they fail.

2. **Define Alerting Thresholds:**
   * **Determine acceptable ranges:** Based on historical data, Service Level Objectives (SLOs), and business impact.  Don’t set alerts too sensitive – false positives are overwhelming.
   * **Severity Levels:** Establish a clear hierarchy for alerts:
      * **Critical:** Requires immediate attention – service down, severe performance degradation.
      * **Warning:** Indicates a potential issue – nearing threshold, trends suggest problems.
      * **Info:**  Useful for tracking and diagnostics, not necessarily requiring immediate action.

3. **Communication Channels:**
   * **How will alerts be delivered?**  Email, Slack, PagerDuty, SMS?  Consider your team's availability and preferred methods.
   * **Routing:**  Establish clear ownership and escalation paths for different severity levels.


**Phase 2: Tool Selection**

Choose tools based on your budget, infrastructure, and technical expertise. Here are popular options:

* **Monitoring Tools:**
    * **Prometheus:** Open-source, powerful for time-series data and alerting. (Great for Kubernetes environments)
    * **Grafana:**  Excellent visualization tool, often paired with Prometheus for dashboards.
    * **Datadog:**  Cloud-based, comprehensive monitoring solution with agent support.
    * **New Relic:** Application Performance Monitoring (APM) with strong alerting capabilities.
    * **Nagios:**  Mature, open-source monitoring tool with a wide range of plugins.
    * **Zabbix:**  Another open-source option, known for its scalability.

* **Alerting Tools:**
    * **Alertmanager (Prometheus):**  Manages alerts from Prometheus.
    * **PagerDuty:** Incident management platform with robust alerting and on-call scheduling.
    * **Opsgenie:** Similar to PagerDuty, focusing on incident response.
    * **Slack/Microsoft Teams:**  Can be integrated with monitoring tools for channel-based alerting.

**Phase 3: Implementation & Configuration**

1. **Install & Configure Agents:** Install agents on your servers and applications to collect metrics.  Configure agents to report to your monitoring tool.

2. **Define Dashboards:** Create dashboards to visualize key KPIs in real-time. This allows for proactive monitoring and trend analysis.

3. **Create Alert Rules:** Configure rules within your monitoring tool based on your defined thresholds.  These rules should trigger alerts when a KPI exceeds or falls below a specified value.

4. **Configure Alert Routing:**  Set up alert routing to the appropriate communication channels based on severity.

5. **Integrate with On-Call Scheduling (PagerDuty, Opsgenie):**  Connect your monitoring tool to an on-call scheduling system to ensure the right people are
