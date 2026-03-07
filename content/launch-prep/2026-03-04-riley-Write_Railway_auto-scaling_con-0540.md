# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-04T05:40:44.786588

## Railway Auto-Scaling Configuration Guide - A Comprehensive Overview

Railway simplifies deploying and managing your applications, and its auto-scaling capabilities are a crucial part of that. This guide outlines how to configure auto-scaling for your Railway apps, covering the key considerations and settings.

**1. Understanding Railway Auto-Scaling**

* **Horizontal Scaling:** Railway automatically adds or removes compute instances based on real-time demand, ensuring your application remains responsive even during traffic spikes.
* **Metrics-Driven:** Auto-scaling relies on metrics collected from your app, primarily CPU usage, memory usage, and request latency.
* **Resource Limits:** You define upper and lower bounds for resource usage. Railway monitors these limits and adjusts the number of instances accordingly.
* **Different Scaling Types:** Railway offers two primary scaling types:
    * **Rule-Based Scaling:**  Define scaling rules based on specific metrics and thresholds. This is the most common and flexible approach.
    * **Scheduled Scaling:**  Automatically scale based on a pre-defined schedule (e.g., increase during peak hours).  Less common but useful for predictable traffic patterns.


**2. Configuring Auto-Scaling - Rule-Based Scaling (Recommended)**

This is the most powerful and flexible way to scale your Railway apps.

**Steps:**

1. **Navigate to Your App's Dashboard:**  Log in to Railway and select your application.
2. **Go to the “Scaling” Tab:** This tab is located on the left-hand side of the app's dashboard.
3. **Create a New Scaling Rule:** Click the “Add Rule” button.
4. **Rule Configuration:**
   * **Name:** Give your rule a descriptive name.
   * **Metric:** Choose the metric you want to monitor. Common choices include:
      * **CPU Usage:** Tracks the percentage of CPU being used by the instance.
      * **Memory Usage:** Tracks the percentage of memory being used by the instance.
      * **Request Latency:** Measures the time it takes to process a request.
   * **Thresholds:** Configure the upper and lower bounds for the metric:
      * **Lower Bound:**  The minimum value the metric must fall below before Railway will scale *down*. (e.g., 50% CPU usage)
      * **Upper Bound:** The maximum value the metric must reach before Railway will scale *up*. (e.g., 90% CPU usage)
   * **Scale Action:** Choose what to do when the metric reaches the thresholds:
       * **Scale Up:** Adds a new compute instance to the app.
       * **Scale Down:** Removes a compute instance from the app.
   * **Cooldown Period:** This is the time (in seconds) that Railway waits *after* a scaling action before considering another one. This prevents constant fluctuations caused by minor traffic changes. (e.g., 60 seconds)
   * **Scope:** This determines which instances the rule applies to.  Typically you'll want it to apply to all instances of your app.
   * **Rollout:** (Optional) Allows you to gradually roll out the scaling rule to a percentage of your instances. Useful for testing and monitoring the impact before applying it fully.


**Example Rule Configuration:**

| Setting           | Value        |
|--------------------|--------------|
| Name               | CPU Scaling  |
| Metric             | CPU Usage    |
| Lower Bound        | 50%          |
| Upper Bound        | 90%          |
| Scale Up           | Add Instance |
| Scale Down         | Remove Instance |
| Cooldown Period    | 60           |
| Scope              | All Instances |

**3. Scheduled Scaling**

* **Use Case:**  Ideal for applications with predictable traffic
