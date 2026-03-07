# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-04T08:42:02.119232

## Railway Auto-Scaling Configuration Guide

This guide outlines how to configure auto-scaling for your applications deployed on Railway. Railway provides several features to automatically adjust your application’s resources based on demand, ensuring optimal performance and cost efficiency.

**1. Understanding Railway's Auto-Scaling Features**

Railway’s auto-scaling primarily utilizes two mechanisms:

* **Horizontal Pod Autoscaling (HPA):**  This is the core component. Railway integrates with Kubernetes HPA to automatically scale the number of pods running your application based on metrics like CPU utilization, memory usage, or custom metrics.
* **Railway's Scaling Rules (Optional):** Railway offers pre-defined scaling rules that can trigger scaling actions based on specific metrics and time schedules. These are simpler than HPA but less flexible.


**2. Setting Up Horizontal Pod Autoscaling (HPA)**

This is the most powerful and recommended method for auto-scaling.

**a) Prerequisites:**

* **Your application must be deployed as a Kubernetes application on Railway.**
* **Your application needs to expose metrics.** This is *crucial*. HPA relies on metrics to understand load.
* **Your application must be containerized (Docker).**

**b) Configuring Metrics in Railway:**

* **Railway Metrics:** Railway automatically collects basic metrics like CPU usage, memory usage, and network traffic from your application.  You can view these in the Railway dashboard.
* **Custom Metrics:** For more granular control, you should expose custom metrics from your application.
    * **Prometheus & Grafana Integration:** This is the most common and recommended approach.
        * Railway provides a pre-configured Prometheus server.
        * Your application needs to be configured to push metrics to Prometheus using a compatible exporter (e.g., Node Exporter, cAdvisor).
        * Grafana dashboards are provided for visualizing these metrics.

**c) Creating the HPA on Railway:**

1. **Navigate to your application's page on Railway.**
2. **Go to "Scaling" -> "Horizontal Pod Autoscaling".**
3. **Specify the following:**
   * **Application Name:**  The name of your Railway application.
   * **Metric:** Select the metric you want HPA to use for scaling (e.g., `cpu_usage`, `memory_usage`).
   * **Target Value (Minimum):** The minimum number of pods Railway should maintain.
   * **Target Value (Maximum):** The maximum number of pods Railway should scale to.
   * **Scaling Interval:** The frequency (in seconds) at which Railway checks the metric and adjusts the number of pods.  (Default: 60 seconds)
   * **Cooldown Period:** The time (in seconds) it takes for HPA to react to a change in the metric. This prevents rapid scaling based on short spikes. (Default: 30 seconds)

4. **Save the configuration.** Railway will start deploying and scaling your application based on the HPA.

**3. Using Railway's Scaling Rules (Simpler, Less Flexible)**

* **Purpose:**  Provides predefined scaling options based on simple metrics and schedules. Useful for basic auto-scaling needs.
* **Location:** Accessible within the "Scaling" section of your Railway application page.
* **Options:**
    * **CPU Scaling:** Scale based on CPU usage.
    * **Memory Scaling:** Scale based on memory usage.
    * **Scheduled Scaling:** Define scaling actions based on a time schedule (e.g., scale up during business hours).

**4. Monitoring & Adjustment**

* **Railway Dashboard:** The dashboard provides real-time insights into your application's resource utilization and scaling activity.
* **Prometheus & Grafana:**  Use these tools for detailed monitoring and analysis of your application's performance and
