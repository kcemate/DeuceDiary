# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-04T15:19:35.622171

## Railway Auto-Scaling Configuration Guide

This guide outlines how to configure auto-scaling for your applications deployed on Railway, helping you optimize resource usage, handle fluctuating traffic, and maintain performance.

**1. Understanding Railway's Auto-Scaling Capabilities**

* **Horizontal Scaling:** Railway primarily offers horizontal scaling – adding more instances of your application to handle increased load.
* **Metrics-Based Scaling:** Scaling is triggered by monitoring key metrics like CPU utilization, memory usage, network I/O, and sometimes custom metrics.
* **Rolling Updates:** Railway handles rolling updates seamlessly during scaling operations, minimizing downtime.
* **Team Scaling:**  Railway’s Team Scaling feature allows you to automatically scale your application based on usage patterns over a longer time window, offering smoother scaling than immediate metric-based scaling.


**2. Choosing the Right Scaling Strategy**

Before configuring, consider:

* **Application Architecture:** Stateless applications (e.g., API servers, web servers) are much easier to scale than stateful ones (e.g., databases, message queues).
* **Traffic Patterns:** Understand your application's traffic patterns – peak times, daily trends, and potential spikes.
* **Resource Requirements:** Know the typical CPU, memory, and network resources your application needs.

**3. Configuring Auto-Scaling on Railway**

Railway offers several ways to configure auto-scaling:

**a) Metric-Based Auto-Scaling (For Stateful Applications & Complex Scaling Needs)**

1. **Enable Metric Monitoring:**
   - Ensure your application is configured to expose metrics to Railway’s monitoring system. This typically involves:
     - Using a monitoring agent (e.g., Prometheus, Datadog, New Relic)
     -  Exposing metrics through a standard format like Prometheus's exposition format.
   -  Verify that your metrics are being collected and displayed in the Railway dashboard.

2. **Configure Scaling Policies:**
   - Navigate to your application's configuration in the Railway dashboard.
   -  Go to the "Scaling" tab.
   -  Define scaling policies based on the metrics you’re monitoring.  Here’s a breakdown of common settings:
     * **Metric:** Select the metric you want to use for scaling (e.g., CPU utilization, memory usage).
     * **Threshold:**  Set the percentage threshold that triggers scaling. For example, if CPU utilization exceeds 70%, scale up.
     * **Scale Up:** Define the number of new instances to add.
     * **Scale Down:** Define the number of instances to remove.
     * **Cooldown Period:**  This prevents rapid scaling responses to brief fluctuations. It's the time (in seconds) between scaling up and scaling down actions.

**b) Team Scaling (Recommended for Most Applications)**

1. **Enable Team Scaling:**
    - In your Railway application's configuration, select the "Team Scaling" option.

2. **Configure Scaling Parameters:**
   - **Scaling Window:** Specify the time window (e.g., 1 hour, 24 hours) over which usage is measured.
   - **Scale Up Threshold:**  Set the target resource utilization (e.g., CPU, memory) you want to maintain.
   - **Scale Down Threshold:**  Set a lower target resource utilization for when the application is under load.
   - **Minimum and Maximum Instances:** Define the minimum and maximum number of instances your application can have. This prevents runaway scaling.
   - **Scale Up and Scale Down Periods:** Configure the duration for which each scaling action will be in effect.

**4. Monitoring and Adjusting Auto-Scaling**

* **Railway Dashboard:** The Railway dashboard provides real-time insights into your application’s performance and scaling activity.  Pay close attention to:
    * **Resource Utilization
