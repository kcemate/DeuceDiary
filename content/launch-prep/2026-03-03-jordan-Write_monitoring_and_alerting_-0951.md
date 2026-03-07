# Write monitoring and alerting setup guide.
Agent: jordan
Generated: 2026-03-03T09:51:04.461833

## Monitoring and Alerting Setup Guide

This guide outlines the steps involved in setting up a robust monitoring and alerting system for your applications and infrastructure. It's designed to be adaptable to various environments and skill levels.

**Phase 1: Assessment & Planning**

1. **Identify Critical Services & Metrics:**
   * **What needs to be monitored?**  Start with your core applications, databases, servers, network devices, and cloud services.
   * **What metrics are important?**  Focus on key performance indicators (KPIs) that impact availability, performance, and user experience. Examples:
      * **Servers:** CPU usage, Memory usage, Disk I/O, Network I/O, Processes running
      * **Databases:** Query execution time, Connection count, Slow queries, Disk space utilization
      * **Applications:** Request latency, Error rates, Throughput,  Response times
      * **Network:** Bandwidth usage, Packet loss, Latency
   * **Define Service Level Objectives (SLOs):**  Determine acceptable thresholds for your critical metrics (e.g., 99.9% uptime).

2. **Choose Monitoring Tools:**
   * **Open Source:**
      * **Prometheus:** Excellent for time-series data collection and alerting.
      * **Grafana:** Powerful visualization and dashboarding tool, often used with Prometheus.
      * **Zabbix:** Comprehensive monitoring solution for network and server monitoring.
      * **Nagios:** A classic monitoring tool with a large community and extensive plugins.
   * **Commercial:**
      * **Datadog:** All-in-one monitoring platform with broad coverage.
      * **New Relic:** Focuses on application performance monitoring (APM).
      * **Dynatrace:** AI-powered monitoring for complex IT environments.
   * **Cloud Provider Tools:** AWS CloudWatch, Azure Monitor, Google Cloud Monitoring – often good for monitoring within their respective ecosystems.

3. **Determine Alerting Strategy:**
   * **Alert Severity Levels:** Define categories like Critical, Warning, Informational, etc.
   * **Alerting Channels:** Where will alerts be delivered? (Email, Slack, PagerDuty, etc.)
   * **Alerting Rules:**  Configure rules based on metric thresholds, time windows, and conditions.


**Phase 2: Implementation**

1. **Install & Configure Monitoring Tools:**
   * **Prometheus & Grafana:**  Install Prometheus on your servers/infrastructure and configure it to scrape metrics.  Then, install Grafana and connect it to Prometheus as a data source.
   * **Zabbix:**  Install Zabbix and configure hosts and items (metrics) to monitor.
   * **Other Tools:** Follow the specific installation and configuration instructions for your chosen tool.

2. **Instrument Your Applications & Infrastructure:**
   * **Agent Installation:**  Install agents on your servers/applications to collect metrics.
   * **APM Integration:** Integrate your monitoring tool with your application's APM capabilities for detailed code-level monitoring.
   * **Log Collection:** Configure log collection using tools like ELK stack (Elasticsearch, Logstash, Kibana) or Splunk.  This data can be correlated with metrics for root cause analysis.

3. **Create Dashboards & Visualizations:**
   * **Grafana (Example):**  Build dashboards to visualize key metrics in real-time.  Set up graphs, gauges, and tables to display your monitoring data.
   * **Zabbix (Example):** Configure items, triggers, and graphs within the Zabbix interface.

4. **Configure Alerting Rules:**
   * **Prometheus Alertmanager:** Define rules in Prometheus Alertmanager that trigger alerts based on metric values and conditions.  Set up notification channels for
