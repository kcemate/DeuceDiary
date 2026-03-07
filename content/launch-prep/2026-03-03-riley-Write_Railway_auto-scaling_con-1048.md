# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-03T10:48:09.190874

## Railway Auto-Scaling Configuration Guide

This guide outlines how to configure auto-scaling for your applications on Railway, allowing your service to automatically adjust resources based on demand.  It covers key concepts, configuration methods, and best practices.

**1. Understanding Railway Auto-Scaling**

* **Dynamic Scaling:** Railway employs dynamic scaling, meaning it constantly monitors your application's resource usage and automatically scales your instances up or down.
* **Horizontal Scaling:**  Railway primarily uses horizontal scaling, meaning it adds or removes instances of your application to handle load.
* **Metric-Based Scaling:**  Auto-scaling is driven by metrics like CPU utilization, memory usage, and potentially custom metrics you define.
* **Configurable Thresholds:** You control the sensitivity of the scaling by setting minimum and maximum resource levels.
* **Cost Optimization:** Auto-scaling inherently helps optimize costs by only using resources when needed.


**2. Configuration Methods**

Railway offers a few ways to configure auto-scaling. The best method depends on the complexity of your application and desired level of control.

**a) Automatic Scaling (Recommended for Most Use Cases):**

* **How it Works:** Railway analyzes your application’s performance automatically and dynamically adjusts instance count.
* **Configuration:**  No explicit configuration is needed for basic automatic scaling. Railway will attempt to scale based on default thresholds and application characteristics.
* **Monitoring & Adjustment:** Use the Railway dashboard to monitor your application's metrics and manually adjust scaling thresholds if necessary.
* **Suitable for:**  Most applications with fluctuating workloads, where predictable scaling isn't essential.

**b) Scale Based on Metrics (More Control):**

* **How it Works:** You define specific metrics that trigger scaling events.
* **Configuration:**
    1. **Create a Scaling Rule:**  Within your Railway service's settings, navigate to "Scaling Rules".
    2. **Select a Metric:** Choose from supported metrics:
        * **CPU Utilization:** The percentage of CPU being used by the instance.
        * **Memory Usage:**  The amount of memory being used.
        * **Request Count:** Number of requests handled per second/minute.
        * **Custom Metrics (with Monitoring Agent):**  If you have a monitoring agent deployed, you can use custom metrics.
    3. **Set Thresholds:**
        * **Lower Threshold:** The trigger level for scaling *down*.  When this threshold is crossed, Railway will decrease the number of instances.
        * **Upper Threshold:** The trigger level for scaling *up*. When this threshold is crossed, Railway will increase the number of instances.
    4. **Set Scaling Steps:**
        * **Step Size:** The number of instances to add or remove during a scaling event.  (e.g., "Add 1 instance").
        * **Cooldown Period:** The time (in seconds) Railway waits after a scaling event before attempting another one.  This prevents rapid, disruptive scaling.
* **Suitable for:** Applications with predictable or highly variable workloads, where you want more control over the scaling behavior.



**c) Advanced Scaling with Monitoring Agent & Custom Metrics (Maximum Control):**

* **How it Works:** You deploy a monitoring agent to your application and configure it to collect custom metrics. Railway then uses these metrics to trigger scaling events.
* **Configuration:**
    1. **Deploy a Monitoring Agent:** Railway provides a pre-built agent image.
    2. **Configure the Agent:**  The agent collects metrics (e.g., queue depth, database connection pool usage) using your application's logging or metrics libraries.
    3. **Create Scaling Rules:** Similar to step 2 in "Scale Based on Metrics," but uses the custom metrics provided by the agent.
* **Suitable for:** Complex applications where you need very specific
