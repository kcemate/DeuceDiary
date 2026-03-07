# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-04T11:20:53.976959

## Railway Auto-Scaling Configuration Guide

This guide outlines how to effectively configure auto-scaling for your applications deployed on Railway. Auto-scaling automatically adjusts your application’s resources (CPU, Memory, etc.) based on demand, ensuring optimal performance and cost-efficiency.

**1. Understanding Railway's Auto-Scaling**

* **Automatic Scaling:** Railway automatically scales your apps based on metrics like CPU utilization, memory usage, network I/O, and requests per second.
* **Resource Limits:** You initially set minimum and maximum resource limits for your app. Railway adjusts the scale within this range.
* **Scaling Triggers:**  Scaling happens automatically based on predefined thresholds. You can adjust these thresholds to fine-tune your scaling behavior.
* **Scaling Types:** Railway offers two primary scaling types:
    * **Metric Scaling:** Scales based on real-time metrics. This is the most common and recommended approach.
    * **Scheduled Scaling:** Scales based on a pre-defined schedule (e.g., scaling up during peak hours).  Less common but useful for predictable workloads.


**2. Configuring Auto-Scaling within Railway**

You configure auto-scaling through the Railway Dashboard:

1. **Navigate to your App:** Select your application from the Railway Dashboard.
2. **Go to the "Resources" tab:** This tab controls the resource limits and scaling settings.
3. **Scale Settings:** You’ll find three core sections:

    * **Minimum:** The smallest number of resources your application should always have.  Set this to the absolute minimum you need for typical usage.  Too low a minimum can lead to slow response times during spikes.
    * **Maximum:** The largest number of resources your application can use.  Set this high enough to accommodate peak loads, but be mindful of your budget.
    * **Scaling Strategy:** Choose your scaling strategy:
        * **Metric Scaling:** (Recommended)  Railway monitors metrics and automatically adjusts resources.
        * **Scheduled Scaling:**  Defines a schedule for scaling up and down.  Requires more configuration and understanding.



**3. Configuring Metric Scaling (Most Common)**

1. **Select "Metric Scaling":** In the "Scale Settings" section, choose "Metric Scaling".
2. **Choose a Metric:** Select the metric you want to use for scaling. Railway supports the following:
    * **CPU Utilization:** The most common and usually best choice.
    * **Memory Utilization:** Useful if memory bottlenecks are a concern.
    * **Network I/O:** Useful for applications that are heavily network-bound.
    * **Requests per Second (RPS):**  Good for applications that respond to web requests.
3. **Set Thresholds:**  This is *crucial* for effective auto-scaling.
    * **Low Threshold:** The resource utilization level that triggers scaling *up*.  A lower threshold means faster scaling.  Start with a conservative value (e.g., 50% CPU, 70% Memory) and adjust based on monitoring.
    * **High Threshold:** The resource utilization level that triggers scaling *down*.  A higher threshold means slower scaling.  A reasonable value (e.g., 80% CPU, 90% Memory) is a good starting point.  Don't set it too high, or your application will be constantly overloaded.
4. **Scaling Interval:**  How frequently Railway checks the metrics and adjusts resources (e.g., every 60 seconds, every 300 seconds).  Shorter intervals lead to faster scaling but can increase resource consumption.  300 seconds (5 minutes) is a good starting point.
5. **Cool-down Period:**  How long Railway waits after a scaling event before considering another one (e.g., 60
