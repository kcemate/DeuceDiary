# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-03T20:14:30.656271

## Railway Auto-Scaling Configuration Guide: A Comprehensive Overview

Railway provides a powerful and seamless way to automatically scale your applications based on demand, optimizing resource utilization and ensuring performance. This guide walks you through configuring auto-scaling for your Railway projects, covering key considerations and best practices.

**1. Understanding Railway Auto-Scaling**

* **Automatic Scaling:** Railway dynamically adjusts the number of running instances of your application based on metrics like CPU utilization, memory usage, and request latency.
* **Scaling Policies:**  You define these policies, telling Railway how to react to changes in these metrics.
* **Metric Sources:**  Railway monitors metrics from your application and the underlying infrastructure.
* **Cost Optimization:** Scaling helps to avoid over-provisioning and reduces your overall costs.
* **No Complex Infrastructure Management:** Railway handles the underlying scaling logic, allowing you to focus on building your application.


**2. Configuring Auto-Scaling Policies**

Railway offers several ways to configure scaling policies:

* **Railway UI (Recommended):** The most user-friendly approach.
    * Navigate to your project in the Railway UI.
    * Go to **Settings > Autoscaling**.
    *  You'll see a visual editor for defining your scaling policy.
    *  **Key Configuration Options:**
        * **Metric:** Select the metric you want to base your scaling on (CPU, Memory, Request Latency, or Custom Metrics).
        * **Thresholds:**  Define the upper and lower bounds for the metric. For example:
            * **High Threshold:** When CPU usage exceeds X%, scale up.
            * **Low Threshold:** When CPU usage falls below Y%, scale down.
        * **Scale Up/Down Actions:** Specify how many new instances to add or remove when the threshold is breached.
        * **Cooldown Period:** A time period after scaling an action (up or down) to prevent rapid fluctuations. This helps stabilize the system.
        * **Scaling Targets:** You can also set a target number of instances to maintain.
* **CLI (Command Line Interface):** For automation and scripting.
    * Railway CLI commands for Autoscaling are `railway scale` and `railway autoscaling create`.
    *  This allows you to define scaling policies in YAML or JSON format and apply them programmatically.
* **Custom Metrics:**  Railway allows you to expose custom metrics from your application.  This gives you ultimate control over scaling based on application-specific events.  (More advanced – involves setting up a metric server within your application).


**3.  Scaling Policies - Examples**

Here are some examples of scaling policies you might define:

* **Example 1: CPU-Based Scaling**
    * **Metric:** CPU Utilization
    * **High Threshold:** 80%
    * **Low Threshold:** 30%
    * **Scale Up:** Add 1 instance
    * **Scale Down:** Remove 1 instance
    * **Cooldown Period:** 60 seconds

* **Example 2: Request Latency Scaling**
    * **Metric:** Request Latency (95th percentile)
    * **High Threshold:** 500ms
    * **Low Threshold:** 200ms
    * **Scale Up:** Add 1 instance
    * **Scale Down:** Remove 1 instance
    * **Cooldown Period:** 300 seconds

* **Example 3: Target Instance Count**
    * **Metric:** (Doesn’t matter, just to trigger scaling) – CPU Utilization
    * **High Threshold:** 70%
    * **Low Threshold:** 20%
    * **Scale Up/Down:** Add/Remove 2 instances
    * **Cooldown Period:** 90 seconds
    * **Target Instance Count
