# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-07T15:25:10.658545

## Railway Auto-Scaling Configuration Guide

This guide outlines how to configure auto-scaling for your applications deployed on Railway. Railway's auto-scaling feature intelligently adjusts your application’s resources based on demand, optimizing cost and ensuring performance.

**1. Understanding Railway's Auto-Scaling**

* **Dynamic Scaling:** Railway automatically scales your app's instances based on metrics like CPU usage, memory usage, and request latency.
* **Metrics Used:** Railway primarily uses the following metrics for scaling:
    * **CPU Usage:**  The percentage of CPU time utilized by your application.
    * **Memory Usage:** The amount of RAM consumed by your application.
    * **Request Latency:**  The time it takes for your application to respond to incoming requests.
* **Scaling Policies:** Railway employs a scaling policy that defines how quickly and how far instances can scale up and down.
* **Service Level Agreements (SLAs):** Railway provides SLAs based on your plan, which defines the automatic scaling limits and response times.


**2. Configuring Auto-Scaling**

There are several ways to configure auto-scaling:

**a) Automatic Scaling (Recommended - Railway Managed)**

This is the easiest and most common approach. Railway automatically manages the scaling process based on the metrics you configure.

1. **Go to your App on Railway:** Navigate to your application dashboard within the Railway UI.
2. **Access the "Scale" Tab:**  Within your app's settings, find the "Scale" tab.
3. **Configure Scaling Parameters:**
   * **CPU Threshold:**  Set the percentage of CPU utilization that triggers scaling.  A good starting point is 70-80%.
   * **Memory Threshold:**  Set the percentage of memory utilization that triggers scaling. A good starting point is 80-90%.
   * **Latency Threshold:** Set the maximum acceptable latency for requests (e.g., 500ms).  This is particularly important for applications with tight response time requirements.
   * **Scale Up Limit:**  Defines how many additional instances can be added when scaling up.
   * **Scale Down Limit:** Defines how many instances can be removed when scaling down.  (Important to avoid abrupt service disruption)
   * **Cooldown Period:** The amount of time (in seconds) that instances must remain at their current scale before further scaling can occur. This prevents the system from oscillating wildly.

4. **Save Changes:**  Railway automatically applies the configured scaling parameters.

**b) Manual Scaling (Advanced - Requires Understanding)**

You can manually scale your app's instances, but this isn’t recommended for long-term stability.  It's mainly useful for testing or specific scenarios.

1. **Access the "Scale" Tab:**  As above.
2. **Trigger Scale:** Use the "Scale Up" or "Scale Down" buttons to manually adjust the number of instances.
3. **Monitor:** Closely monitor your application's performance to avoid over-scaling or under-scaling.


**3. Monitoring & Fine-Tuning**

* **Railway Dashboard:**  The Railway dashboard provides real-time metrics and insights into your application's performance, allowing you to observe the auto-scaling activity.
* **Logs:** Examine application logs for errors or performance bottlenecks that might be influencing the scaling behavior.
* **Adjust Thresholds:** Regularly review the scaling parameters and adjust them based on your application's actual usage patterns and performance characteristics.  Start conservatively and gradually increase thresholds.
* **Experiment:** Use the manual scaling feature to experiment with different scaling policies and understand how they impact your application's performance and cost.


**4.  Best Practices**

* **Start with Conservative Settings:** Begin with more generous scaling thresholds to ensure your application can handle unexpected spikes in
