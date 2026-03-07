# Write monitoring and alerting setup guide.
Agent: jordan
Generated: 2026-03-03T08:43:28.723796

## Monitoring and Alerting Setup Guide

This guide outlines a comprehensive approach to setting up monitoring and alerting for your systems and applications. It’s designed to be adaptable across different environments and scales, focusing on best practices for effective detection and response.

**Phase 1: Assessment & Planning**

1. **Identify Critical Services & Metrics:**
   * **Business Impact:** Determine which services are critical to your business operations. What happens if they go down?
   * **Key Metrics:** For each critical service, define key performance indicators (KPIs). Examples:
      * **Servers:** CPU Usage, Memory Usage, Disk I/O, Network Traffic, Load Average
      * **Databases:** Query Response Time, Connection Count, Slow Queries, Replication Lag
      * **Applications:** Request Latency, Error Rates, Throughput, Active Users
      * **Infrastructure:** Uptime, DNS Resolution Time, Network Connectivity
   * **Granularity:** Decide on the appropriate level of detail. Too much data can overwhelm you; too little can miss critical issues.

2. **Define Alerting Thresholds:**
   * **Baseline:** Establish a baseline for your metrics during normal operation.
   * **Critical/Warning/Informational:** Categorize alerts based on severity:
      * **Critical:** Immediately impacts service availability or significant performance degradation.  Requires immediate attention.
      * **Warning:**  Indicates potential issues that should be investigated.
      * **Informational:**  Provides useful context or trends that don’t necessarily require immediate action.
   * **Dynamic Thresholds:** Consider using dynamic thresholds (e.g., based on historical data) to adjust to seasonal variations or expected load changes.

3. **Choose Monitoring & Alerting Tools:**
   * **Options:**
      * **Open Source:** Prometheus, Grafana, Zabbix, Nagios, Icinga
      * **Commercial:** Datadog, New Relic, Dynatrace, SolarWinds
   * **Considerations:**
      * **Scalability:**  Can it handle your current and future needs?
      * **Integration:**  Does it integrate with your existing infrastructure and tools?
      * **Cost:**  Factor in licensing fees, support costs, and potential operational overhead.


**Phase 2: Implementation & Configuration**

1. **Install & Configure Monitoring Tools:**
   * Follow the installation instructions for your chosen tool.
   * Configure basic connectivity to your systems and applications.

2. **Add Data Sources & Metrics:**
   * **Prometheus:** Configure service discovery, scrape metrics from endpoints using exporters.
   * **Zabbix:** Add hosts and services, configure templates with appropriate checks.
   * **Other Tools:** Use the native features for adding data sources (e.g., using agents, APIs).

3. **Create Dashboards:**
   * **Visualization:**  Build dashboards to provide a visual overview of your key metrics.
   * **Correlation:**  Connect related metrics to understand dependencies and root causes.

4. **Configure Alerts:**
   * **Define Alert Rules:** Based on your thresholds, create alert rules in your chosen tool.
   * **Severity Levels:**  Assign appropriate severity levels to each rule.
   * **Testing:** Thoroughly test the alert rules to ensure they trigger correctly and don't generate false positives.

5. **Alert Routing & Notification:**
   * **Channels:** Configure how alerts are delivered (e.g., email, Slack, PagerDuty, SMS).
   * **Routing Rules:**  Define rules to route alerts to the correct on-call teams or individuals.
   * **Escalation Policies:**  Establish escalation policies for alerts that remain unresolved for a specific period.


**Phase 3: Operation & Maintenance**

1. **Regular Monitoring &
