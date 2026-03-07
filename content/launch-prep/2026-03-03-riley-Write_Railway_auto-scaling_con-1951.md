# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-03T19:51:48.964719

## Railway Auto-Scaling Configuration Guide

This guide outlines how to effectively configure auto-scaling for your applications on Railway, leveraging its built-in features and best practices. Auto-scaling allows your application to dynamically adjust its resources based on demand, ensuring optimal performance, cost efficiency, and resilience.

**1. Understanding Railway’s Auto-Scaling**

* **Automatic Scaling:** Railway automatically adjusts the number of worker instances running your service based on real-time metrics like CPU usage, memory usage, and request latency.
* **Metrics-Based Scaling:** Railway monitors these metrics to determine when scaling is needed.  You can tailor the sensitivity and thresholds for these metrics.
* **Concurrency Limits:**  Crucially, Railway allows you to set concurrency limits – the maximum number of concurrent requests a single worker instance can handle.  This is *essential* for managing resource usage and preventing throttling.
* **No Manual Intervention (Mostly):** Railway aims to handle scaling transparently. However, understanding your application's needs and configuring concurrency limits are key to successful auto-scaling.


**2. Configuring Auto-Scaling - Key Steps**

**a) Worker Instance Configuration (Within your Service)**

* **Concurrency Limits:** This is the *most* important setting!  Within your service's configuration (typically in your service's `.railwaylink.json` file or through the Railway UI), set the `concurrency_limit` value. This dictates the maximum number of concurrent requests a single worker instance can handle.  
    * **Starting Point:** Begin with a conservative value based on your application’s capabilities.  A good starting point for many applications is 10-20.
    * **Monitoring:**  *Monitor* your worker instance's CPU and memory usage *while* it's under load.  Increase the concurrency limit gradually, observing performance and resource consumption.
    * **Overcommitting is Dangerous:**  Setting a concurrency limit too high can lead to excessive resource contention and performance degradation.
* **Instance Size:** Choose an appropriate instance size for your service. Railway offers various tiers (Bronze, Silver, Gold, Platinum) which offer different compute and memory capabilities.
* **Startup Time:**  Optimize your application’s startup time.  Long startup times can increase the time it takes for Railway to add new instances when demand increases.

**b) Railway UI Configuration**

* **Service Settings > Scaling:** Navigate to your service’s settings within the Railway UI and find the "Scaling" section.
* **Metrics:**
    * **CPU Utilization:**  Set the `cpu_threshold` (e.g., 70-80%) and `cpu_scale_up` and `cpu_scale_down` intervals. This determines when Railway will scale based on CPU usage.
    * **Memory Utilization:**  Similarly, configure memory thresholds and intervals.
    * **Latency:** (Advanced) Railway can monitor request latency.  Consider setting latency thresholds for scale-up if your application is latency-sensitive.
* **Scaling Behavior:**
    * **Scale-Up:**  How quickly Railway adds new instances when demand increases.  Start with a slower scale-up for stability.
    * **Scale-Down:**  How quickly Railway reduces the number of instances when demand decreases.  A quicker scale-down can save costs.
* **Concurrency Limit (Override):**  You can *override* the concurrency limit defined in your `.railwaylink.json` file from the UI, but this is *strongly discouraged*. It's best to manage concurrency limits within your service's configuration.



**3. Monitoring & Tuning**

* **Railway Dashboard:**  Use the Railway dashboard to monitor your service's performance metrics (CPU, memory, latency, requests per second).
* **Worker Logs:**  Inspect worker
