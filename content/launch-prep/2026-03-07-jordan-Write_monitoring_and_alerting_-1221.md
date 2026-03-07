# Write monitoring and alerting setup guide.
Agent: jordan
Generated: 2026-03-07T12:21:07.584418

## Monitoring and Alerting Setup Guide

This guide outlines the steps involved in setting up a robust monitoring and alerting system. It focuses on a common approach, but you’ll need to adapt it to your specific environment and requirements.

**Phase 1: Planning & Requirements**

1. **Identify Critical Services & Metrics:**
   * **What needs to be monitored?** Start with your most critical applications, servers, databases, and services.
   * **What metrics are important?** Examples:
     * **Servers:** CPU usage, memory usage, disk I/O, network traffic, uptime.
     * **Databases:** Query performance, connection counts, slow queries, disk space, replication lag.
     * **Applications:** Response times, error rates, throughput, queue lengths.
     * **Infrastructure:** Network latency, DNS resolution time, firewall rules.
   * **Define Service Level Objectives (SLOs):**  Establish target values for each metric (e.g., CPU < 70%, Response time < 200ms). These will drive your alerting thresholds.

2. **Choose Your Monitoring Tools:**
   * **Open Source:**
     * **Prometheus:** A popular time-series database and monitoring system.
     * **Grafana:** A data visualization and dashboarding tool, often used with Prometheus.
     * **Zabbix:** Comprehensive monitoring solution for servers, networks, and applications.
     * **Nagios:**  A well-established monitoring system with a large community.
   * **Commercial:**
     * **Datadog:**  Cloud-based monitoring and analytics.
     * **New Relic:** Application Performance Monitoring (APM) and infrastructure monitoring.
     * **Dynatrace:** AI-powered monitoring and automation.
     * **SolarWinds:** A wide range of network management and monitoring solutions.

3. **Define Alerting Strategy:**
   * **Alert Levels:** Define severity levels (e.g., Info, Warning, Critical) and associated thresholds.
   * **Alert Channels:**  How will alerts be delivered? (e.g., Email, Slack, PagerDuty, SMS)
   * **Routing and Escalation:**  Who gets notified for each alert level, and in what order?

**Phase 2: Implementation - Example using Prometheus & Grafana**

This example showcases a common approach using Prometheus for data collection and Grafana for visualization and alerting.

1. **Install Prometheus:**
   * Follow the official documentation for installation: [https://prometheus.io/docs/installation/](https://prometheus.io/docs/installation/)
   * Configure the `prometheus.yml` file to scrape metrics from your target systems.

2. **Configure Exporters:**
   * **Node Exporter:** Scrapes system metrics from each server.
   * **MySQL Exporter:** Scrapes database metrics from MySQL servers.
   * **Your Application Exporter:**  You'll likely need to develop or use a pre-built exporter to gather application-specific metrics.

3. **Install Grafana:**
   * Follow the official documentation for installation: [https://grafana.com/docs/installation/](https://grafana.com/docs/installation/)

4. **Create Grafana Dashboards:**
   * Design dashboards to visualize your critical metrics.
   * Use Prometheus as a data source within Grafana.

5. **Configure Alerting Rules in Grafana:**
   * **Prometheus Queries:** Utilize Prometheus queries within Grafana to define alerting thresholds.
   * **Alert Notification Channels:**  Configure Grafana to send alerts via Email, Slack, or other supported channels.

**Example Alert Rule in Grafana:**

```
// Prometheus Query
j1_cpu_usage_seconds_total
