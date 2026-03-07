# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-03T08:55:17.951029

## Railway Auto-Scaling Configuration Guide

This guide outlines how to configure automatic scaling for your applications on Railway, maximizing resource utilization and ensuring optimal performance based on demand.  Railway handles a significant portion of the scaling process automatically, but understanding its capabilities and how to influence it will lead to a more efficient and cost-effective deployment.

**1. Understanding Railway's Auto-Scaling Capabilities**

* **Horizontal Pod Autoscaling (HPA):** Railway leverages Kubernetes' HPA functionality. This means Railway automatically scales the number of Pods running your application based on metrics like CPU usage, memory usage, or custom metrics.
* **Automatic Scaling Limits:** Railway provides default scaling limits based on the chosen plan and service tier. You can adjust these limits to better fit your application's needs.
* **Cool-Down Periods:** Scaling decisions aren’t instantaneous. HPA employs cool-down periods to prevent rapid scaling oscillations caused by fluctuating traffic.
* **Metrics Used:** Railway primarily uses CPU and Memory usage to trigger scaling events.  You can configure custom metrics via Custom Metrics (covered below).

**2. Configuration Steps - The Railway UI**

The easiest way to configure auto-scaling is through the Railway UI:

1. **Select Your Service:** Navigate to your application’s service within the Railway UI.
2. **Access the Settings:** Click on "Settings" within the service.
3. **Scaling Tab:** Click on the "Scaling" tab.
4. **Scaling Limits:**
   * **Minimum Instances:**  Set the minimum number of instances your application should always run. This prevents unnecessary costs when the application is idle.
   * **Maximum Instances:**  Set the maximum number of instances Railway will scale to.  This protects you from overspending.
   * **Scaling Limit:** This is the key metric Railway uses to trigger scaling.  Typically, you’ll want to set this to CPU usage.  Consider your application’s normal and peak CPU usage when setting this value.

**3. Configuring Custom Metrics (Advanced)**

Beyond CPU and Memory, you can use custom metrics to fine-tune auto-scaling:

* **What are Custom Metrics?**  These are application-specific metrics that provide a more nuanced view of your application’s health and load. Examples include request latency, queue depth, or custom business metrics.
* **How to Add:**
    1. Go to "Settings" > "Scaling" in your service.
    2. Click "Add Custom Metric."
    3. **Metric Name:**  Provide a descriptive name for the metric.
    4. **Unit:** Choose the appropriate unit (e.g., seconds for latency, items for queue depth).
    5. **Threshold:**  Set a target value for the metric.  When this value is exceeded, scaling is triggered.
    6. **Scaling Adjustment:**  Determine how much scaling (increasing or decreasing) should occur for each unit change in the metric.  For example, if you set a threshold of 100ms latency and an adjustment of 1, a latency of 100ms will trigger a scaling *up* event, potentially adding an instance.
* **Important Considerations:** Custom metrics require your application to expose the metric data via HTTP endpoints. Railway uses the metrics library to scrape this data.

**4. Scaling Policies and Cooling Periods**

* **Railway's Cooling Periods:** Railway automatically applies a cooling period to scaling decisions, reducing the frequency of scaling events.  The default cooling period is 60 seconds.
* **Advanced Cooling Periods (Coming Soon):** Railway is working on providing more granular control over cooling periods, but this feature isn't yet fully available.

**5. Monitoring and Troubleshooting**

* **Railway Dashboard:** The Railway dashboard provides real-time insights into your service’s
