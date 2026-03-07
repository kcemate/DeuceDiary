# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-03T17:35:57.265864

## Railway Auto-Scaling Configuration Guide

This guide outlines how to configure auto-scaling for your applications on Railway, enabling your services to automatically adjust resources based on demand. This leads to cost optimization, improved performance, and a smoother user experience.

**1. Understanding Railway Auto-Scaling**

* **Horizontal Scaling:** Railway primarily focuses on horizontal scaling – adding more instances of your application to handle increased load.
* **Dynamic Scaling:** Railway monitors your application's resource usage (CPU, memory, network I/O) and automatically adds or removes instances as needed.
* **Scaling Policies:** You define the rules for scaling, including the maximum and minimum number of instances, the metrics used for monitoring, and the conditions that trigger scaling.
* **Automatic Retries:** Railway automatically handles retries for failed requests, preventing cascading errors during scaling events.

**2. Prerequisites**

* **Railway Account:** You need an active Railway account.
* **Application Deployed:** Your application needs to be successfully deployed on Railway.
* **Metrics Enabled:**  Ensure your application is emitting relevant metrics to Railway’s monitoring system.  Railway supports various metrics sources including Prometheus, StatsD, and custom metrics.
* **Basic Understanding of Scaling Concepts:**  Familiarize yourself with concepts like CPU utilization, memory usage, request latency, and throughput.

**3. Configuring Auto-Scaling via Railway's UI**

This is the recommended and simplest method for most users.

**Step 1: Navigate to your App's Configuration:**

1.  Log in to the Railway dashboard: [https://railway.app/](https://railway.app/)
2.  Select your application from the list.
3.  Click on the "Configuration" tab.

**Step 2: Access the Auto-Scaling Settings:**

1.  Within the Configuration tab, locate the "Auto-scaling" section.  This section might be labeled “Scaling” or “Resource Scaling”.
2.  Click "Edit Auto-scaling Settings" (or similar).

**Step 3: Define Your Scaling Policy:**

The UI presents a table with configurable parameters:

* **Metric:** Select the metric you want to use for scaling. Common choices include:
    * **CPU Utilization:** The percentage of CPU resources being used.  This is often a good default.
    * **Memory Utilization:** The percentage of memory being used.
    * **Network I/O:** The amount of network data being transferred.
    * **Requests Per Second (RPS):** Useful for applications with predictable request patterns.
* **Target Utilization:**  Specify the desired utilization level.  For example:
    * **CPU Utilization: 70%** – This means Railway will add or remove instances to keep your application's CPU usage at or below 70%.
* **Minimum Instances:** Set the minimum number of instances your application should always have.  This prevents the application from being overloaded during periods of low traffic.  A good starting point is usually 1.
* **Maximum Instances:** Set the maximum number of instances your application can scale to. This helps control costs.
* **Scaling Delay (Seconds):**  This determines how long Railway waits after a scaling event before evaluating the metric again.  A shorter delay makes scaling more responsive, but a longer delay can reduce unnecessary scaling events.  Start with 60 seconds and adjust based on your application’s responsiveness.
* **Scaling Threshold (Percentage):**  This determines how much the metric needs to change before a scaling event is triggered.  For example, if you set a threshold of 10%, Railway will scale if CPU utilization goes above 80% or below 70%.

**Step 4: Save Your Changes:**

1.  Click "Save" or "Update
