# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-03T14:12:10.582734

## Railway Auto-Scaling Configuration Guide

This guide outlines how to configure automatic scaling for your Railway applications, ensuring they handle varying loads efficiently and cost-effectively. Railway provides a robust scaling system based on metrics, allowing you to define thresholds and scaling rules.

**1. Understanding Railway's Auto-Scaling**

* **Metrics-Driven:** Railway’s auto-scaling relies on monitoring key metrics of your application, such as CPU utilization, memory usage, request latency, and network traffic.
* **Scaling Groups:** You create "Scaling Groups" that define the scaling rules. These groups specify which application to scale, the metrics to monitor, and the actions to take when thresholds are reached.
* **Horizontal Scaling:** Railway primarily supports *horizontal* scaling – adding more instances of your application to handle increased load.
* **Cooldown Periods:** Railway includes cooldown periods to prevent rapid scaling up and down based on short-term fluctuations.

**2. Creating a Scaling Group**

Here's how to create a scaling group in the Railway UI:

1. **Navigate to your Application:** Go to your application’s page in the Railway UI.
2. **Click "Scale":**  You'll find a "Scale" button on the application overview.
3. **Create a New Scaling Group:** Click the "Create Scaling Group" button.
4. **Configure the Scaling Group:**  The configuration panel is divided into key sections:

   * **Name:** Give your scaling group a descriptive name (e.g., "High CPU Scaling").
   * **Application:** Select the Railway application you want to scale.
   * **Metric:** Choose the metric to monitor.  Common choices include:
     * **CPU Utilization:**  The percentage of CPU being used by the application.
     * **Memory Utilization:** The percentage of memory being used by the application.
     * **Request Latency:** The average time it takes to respond to incoming requests.
     * **Network Traffic:**  The amount of data being sent or received by the application.
   * **Thresholds:**  This is crucial. Configure the thresholds that trigger scaling. Railway provides pre-defined thresholds and allows you to customize them:
     * **High Threshold:** The value above which scaling will occur. (e.g., CPU utilization > 70%)
     * **Low Threshold:** The value below which scaling will cease. (e.g., CPU utilization < 30%)
     * **Scale Up:** How many new instances should be added when the High Threshold is exceeded.
     * **Scale Down:** How many instances should be removed when the Low Threshold is reached.
   * **Cooldown Period:** The duration (in seconds) that scaling is paused after a scaling event, preventing constant fluctuations.  (Defaults to 60 seconds)
   * **Scaling Type:**  Select "Horizontal" for adding instances.
   * **Advanced Settings (Optional):**
     * **Minimum Instances:** The minimum number of instances Railway should always maintain for your application.
     * **Maximum Instances:** The maximum number of instances Railway can scale your application up to.  (Important for cost control)
     * **Auto-Repair:** Automatically attempts to restart failing instances.

**3. Example Scaling Group Configuration**

Let's say you have a web application and you want to scale up during peak hours and down during off-peak hours:

* **Name:** "Web App Scaling"
* **Application:** Your Web Application
* **Metric:** CPU Utilization
* **High Threshold:** 80%
* **Low Threshold:** 50%
* **Scale Up:** 2
* **Scale Down:** 1
* **Cooldown Period:** 120 seconds
* **Minimum Instances:** 1
* **Maximum Instances:** 1
