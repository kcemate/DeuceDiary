# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-06T14:36:26.561197

## Railway Auto-Scaling Configuration Guide

This guide outlines how to configure auto-scaling for your applications running on Railway. Auto-scaling allows your applications to dynamically adjust their resources based on demand, optimizing performance and cost. This document covers different approaches and best practices.

**1. Understanding Railway Auto-Scaling**

Railway offers several levels of auto-scaling:

* **Automatic Scaling (Recommended):** Railway automatically scales your services based on metrics like CPU utilization, memory usage, and network I/O. This is the easiest and most effective method for most applications.
* **Manual Scaling:** You can manually adjust the number of replicas within your service definition. This offers more control but requires more proactive monitoring and management.
* **Scheduled Scaling:** Trigger scaling based on pre-defined schedules (e.g., scale up during peak hours).

**2. Automatic Scaling Configuration (The Easiest Approach)**

This is the recommended method for most Railway applications.

**Steps:**

1. **Service Definition:** Ensure your service definition includes the necessary components for auto-scaling to work. This includes:
   * **Resource Allocation:** Specify the desired CPU, memory, and network limits for each instance. Railway uses these limits to determine scaling actions.
   * **Container Image:** Your application must be packaged in a Docker container.
   * **Health Checks:** Define a health check endpoint that Railway uses to monitor the status of your instances. This is crucial for detecting unhealthy instances and triggering scaling.
   * **Environment Variables:** Properly configured environment variables are essential for your application to function correctly.

2. **Railway Service Settings:**
   * **Scale Limit:** In the Railway service dashboard, you'll find a "Scale Limit" setting.  This determines the maximum number of replicas Railway will scale to.
   * **Scaling Policy:** Railway uses a default scaling policy that automatically adjusts the number of replicas based on CPU utilization.  However, you can customize this policy.

3. **Customizing the Scaling Policy (Optional but Recommended):**
   * **CPU Threshold:**  Adjust the CPU utilization threshold that triggers scaling up or down.  A lower threshold will result in more frequent scaling.
   * **Memory Threshold:**  Similarly, set a memory threshold.
   * **Scaling Interval:**  Control how often Railway checks the metrics and adjusts the number of replicas. Shorter intervals lead to faster scaling but can also increase costs.
   * **Cooldown Period:**  After a scaling event, Railway will wait a cooldown period before making another adjustment.  This prevents rapid oscillation.
   * **Target Utilization:** Define the desired average CPU or memory utilization.  Railway will aim to maintain this level.


**Example (Scaling based on CPU Utilization):**

* **Scale Limit:** 3
* **CPU Threshold:** 70%
* **Scaling Interval:** 1 minute
* **Cooldown Period:** 30 seconds

This configuration will scale the service up to 3 replicas if the average CPU utilization exceeds 70%, and scale down if the utilization falls below 30%. The cooldown period prevents rapid scaling.

**3. Manual Scaling (More Control, More Responsibility)**

* **Scale via Dashboard:** Within the Railway service dashboard, you can manually adjust the replica count.
* **Scale via CLI:** Use the Railway CLI to scale your service:
  `railway scale --replicas <number> <service_name>`
  Example: `railway scale --replicas 5 my-service`

* **Important Considerations:**
    * **Monitoring:**  When manually scaling, you are responsible for monitoring your application’s performance and resource usage.
    * **Cooldowns:**  Be mindful of Railway's cooldown periods when scaling manually.

**4. Scheduled Scaling (For Predictable Demand)**

* **Railway Scheduler:** Railway’
