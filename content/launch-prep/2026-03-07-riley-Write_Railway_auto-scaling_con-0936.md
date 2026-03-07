# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-07T09:36:17.130822

## Railway Auto-Scaling Configuration Guide

This guide outlines how to configure auto-scaling for your applications deployed on Railway, allowing your application to dynamically adjust resources based on demand, optimizing performance and cost.

**Understanding Railway Auto-Scaling**

Railway's auto-scaling is a managed service that monitors your application's metrics (like CPU, memory, request latency) and automatically adjusts the number of instances running it. It leverages a combination of:

* **Metrics Monitoring:**  Railway collects metrics from your running application.
* **Scaling Policies:** You define rules that trigger scaling up or down based on these metrics.
* **Worker Instances:** Railway manages the underlying infrastructure and spins up/down instances based on your policies.

**Steps to Configure Auto-Scaling**

**1. Choose Your Metric:**

* **CPU Utilization:**  Most common and recommended for web applications.  Adjusting CPU usage is often the most effective way to handle fluctuating traffic.
* **Memory Utilization:**  Useful for applications with high memory requirements.
* **Request Latency:** Ideal for identifying performance bottlenecks. Scaling up can alleviate latency issues.
* **Queue Depth:** Useful for applications with asynchronous tasks (e.g., message queues) - scaling up adds more worker processes.
* **Custom Metrics:** Railway allows you to integrate with your own metrics systems (e.g., Prometheus, Datadog) for more granular control.

**2. Create a Scaling Policy:**

Railway offers two types of scaling policies:

* **Threshold-Based Scaling:**  Scales based on reaching a defined threshold.
    * **Threshold:**  The value that triggers scaling. (e.g., 80% CPU utilization)
    * **Scale Up:**  Number of additional instances to add.
    * **Scale Down:** Number of instances to remove.
    * **Cooldown Period:** A time window after a scaling event to prevent rapid fluctuations.  (e.g., 5 minutes)
* **Rate-Based Scaling:** Scales based on a rate of change of the metric. (e.g., CPU utilization increasing by 5% per minute) -  This is generally more sophisticated and requires careful configuration.

**How to Create a Scaling Policy in the Railway UI:**

1. **Navigate to Your App:**  Select your application from your Railway dashboard.
2. **Go to Scaling:** In the application's settings, find the "Scaling" section.
3. **Create a Policy:** Click "Add Policy"
4. **Configure:**
   * **Policy Type:** Choose "Threshold" or "Rate".
   * **Metric:** Select the metric you want to monitor.
   * **Threshold (for Threshold-Based):**  Enter the desired threshold percentage.
   * **Scale Up/Down:** Specify the number of instances to add/remove when the threshold is met.
   * **Cooldown Period:** Set the cooldown period in minutes.
   * **Save Policy:**  Give your policy a descriptive name.

**Example Threshold-Based Policy:**

* **Policy Name:** "High CPU Scaling"
* **Metric:** "CPU Utilization"
* **Threshold:** 80%
* **Scale Up:** 1
* **Scale Down:** 1
* **Cooldown Period:** 5 minutes

**3.  Test and Refine Your Policy:**

* **Simulate Traffic:** Use load testing tools (e.g., Locust, JMeter) to mimic user traffic and observe how your application responds.
* **Monitor the Scaling:**  The Railway UI provides real-time metrics and shows when scaling events occur.
* **Adjust Settings:** Based on your observations, tweak the threshold, scale up/down values, and cooldown period until you achieve the desired performance and cost balance.

**4. Advanced Configuration & Considerations:**
