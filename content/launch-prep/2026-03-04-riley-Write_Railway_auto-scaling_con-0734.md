# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-04T07:34:06.405541

## Railway Auto-Scaling Configuration Guide

This guide outlines how to configure auto-scaling for your applications running on Railway. Auto-scaling automatically adjusts your application's resources (CPU, memory, etc.) based on demand, ensuring optimal performance and cost-efficiency.

**1. Understanding Railway's Auto-Scaling**

* **Dynamic Scaling:** Railway uses dynamic scaling, meaning resources are adjusted in real-time based on metrics.
* **Metrics:** Railway monitors your application’s performance using metrics like:
    * **CPU Usage:**  Percentage of CPU being utilized.
    * **Memory Usage:** Amount of memory being utilized.
    * **Request Latency:** Time taken to respond to requests.
    * **Queue Length:** Number of requests waiting to be processed.
* **Scaling Policies:** You define *scaling policies* that trigger adjustments based on these metrics.  Railway then executes these policies to add or remove resources.
* **Granularity:** You can configure scaling policies to scale at different levels (e.g., per container, per service).


**2. Setting Up Auto-Scaling - Key Steps**

**a)  Define your Service & Container:**

* Ensure your application is deployed as a Railway Service with at least one container.
* Verify your container's configuration (CPU, memory limits). This sets a baseline for scaling.


**b) Choose a Scaling Policy Type:**

Railway offers a few options, each with different levels of control:

* **Manual Scaling:** You directly adjust the CPU and Memory limits for your service.  Railway will then scale up or down based on the traffic demand. This is simple for initial testing.
* **Metric-Based Scaling (Recommended):** This is the most powerful and flexible approach.  You configure policies based on specific metrics.
* **Scheduled Scaling:**  Allows you to scale based on a predefined schedule (e.g., increase resources during business hours).  Useful for predictable traffic patterns.


**c) Configure a Metric-Based Scaling Policy (Most Common):**

1. **Navigate to your Service:** Go to your Railway dashboard and select your service.
2. **Go to "Scaling":**  In the service menu, select “Scaling”.
3. **Add a Scaling Policy:** Click “Add Policy”
4. **Choose a Metric:** Select the metric you want to use for scaling (e.g., CPU Usage).
5. **Set Scaling Parameters:**
   * **Thresholds:** Define the upper and lower thresholds for the chosen metric. For example:
      * **High Threshold:**  If CPU usage exceeds this value (e.g., 80%) - scale *up*.
      * **Low Threshold:** If CPU usage falls below this value (e.g., 20%) - scale *down*.
   * **Scale Units:** How much to increase or decrease resources when scaling up or down. (e.g., 1 CPU core, 2GB of memory).  This is how much Railway will add or remove to the container.
   * **Cooldown Period:**  A delay (in seconds) after a scale-up or scale-down event before another one can trigger. This prevents rapid, unnecessary scaling. (e.g., 60 seconds -  prevents frequent scaling when demand fluctuates rapidly).
6. **Save the Policy:** Click "Save Policy".

**d) Configure Scheduled Scaling (Optional):**

1. **Navigate to your Service:** Go to your Railway dashboard and select your service.
2. **Go to "Scaling":** In the service menu, select “Scaling”.
3. **Add a Scaling Policy:** Click “Add Policy”.
4. **Choose "Schedule":**  Select "Schedule" as the policy type.
5. **Define Schedule:**  Set the days
