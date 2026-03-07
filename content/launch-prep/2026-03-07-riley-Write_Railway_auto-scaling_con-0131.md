# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-07T01:31:46.179284

## Railway Auto-Scaling Configuration Guide - A Comprehensive Overview

Railway’s auto-scaling feature allows your services to automatically adjust their resources based on demand, optimizing costs and ensuring responsiveness. This guide outlines how to configure auto-scaling for your Railway services, covering the key aspects and best practices.

**1. Understanding Railway's Auto-Scaling**

* **Metrics-Based Scaling:** Railway uses metrics collected from your service (CPU usage, memory usage, request latency, etc.) to determine when to scale up or down.
* **Multiple Scaling Policies:** You can configure multiple scaling policies for a single service, allowing for sophisticated scaling logic.
* **Event-Driven Scaling:** Scaling events are triggered automatically based on the configured metrics and policies.
* **Cost Optimization:**  By scaling down during periods of low demand, you can significantly reduce your overall costs.
* **Rolling Deployments:** Auto-scaling works seamlessly with Railway's rolling deployment strategy.


**2. Key Concepts & Settings**

* **Service Level (SL) Units:** The core unit used for scaling.  This represents a desired level of performance (e.g., 1 SLU means 1 CPU core). You’ll usually increase or decrease the number of SLUs.
* **Scaling Policy:** Defines *when* and *how* your service scales. It consists of:
    * **Metric:** The metric to monitor (e.g., CPU Usage, Memory Usage).
    * **Threshold:** The value at which scaling is triggered (e.g., CPU usage exceeding 70%).
    * **Scale Action:** The action to take when the threshold is reached (e.g., increase SLUs by 1, decrease SLUs by 1).
    * **Cooldown:** The time (in seconds) after a scaling action to prevent rapid oscillations.
* **Scaling Group:**  A collection of scaling policies applied to a single service.
* **Autoscaling Enabled:** Must be explicitly enabled for a service to participate in auto-scaling.


**3. Configuring Auto-Scaling – Step-by-Step**

1. **Navigate to Your Service:**  In the Railway dashboard, select the service you want to auto-scale.

2. **Access Auto-Scaling Settings:**  Within the service’s settings, locate the "Auto-Scaling" tab.

3. **Enable Auto-Scaling:**  Toggle the "Auto-Scaling" switch to "Enabled."

4. **Create a Scaling Policy:**
   * Click "Add Policy."
   * **Metric:** Choose the metric you want to monitor.  Railway supports common metrics like:
      * **CPU Usage:** Indicates the percentage of CPU time consumed.
      * **Memory Usage:** Indicates the amount of RAM being used.
      * **Request Latency:** Measures the time it takes for a service to respond to a request.  (Use with caution – can be noisy)
   * **Threshold:** Set a desired threshold for the chosen metric. Experiment to find a suitable value. Start with a conservative value and adjust based on performance.
   * **Scale Action:** Choose the action to take:
      * **Scale Up:** Increases the number of SLUs.
      * **Scale Down:** Decreases the number of SLUs.
   * **Cooldown:** Specify the cooldown period after a scaling action. A longer cooldown prevents frequent oscillations, while a shorter cooldown allows for quicker response to changes.  (Default is 60 seconds).
   * **Save Policy:**  Save the scaling policy.

5. **Create a Scaling Group (Optional, but Recommended):**  Scaling groups allow you to manage multiple scaling policies.
   * Add multiple policies to the same scaling group.
   *  You can define different scaling policies for different conditions (e.g., scale up during
