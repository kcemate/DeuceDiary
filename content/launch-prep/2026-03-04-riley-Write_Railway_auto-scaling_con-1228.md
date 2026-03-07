# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-04T12:28:56.289277

## Railway Auto-Scaling Configuration Guide

This guide outlines how to configure auto-scaling for your applications deployed on Railway, leveraging its built-in scaling capabilities. Railway makes scaling your apps incredibly straightforward, abstracting away much of the complexity of infrastructure management.

**1. Understanding Railway's Auto-Scaling**

* **Dynamic Scaling:** Railway automatically adjusts the number of instances running your application based on demand.
* **Metrics-Based:** Scaling decisions are driven by metrics like CPU usage, memory usage, network I/O, and request latency.
* **Automatic Rollbacks:**  Railway automatically rolls back deployments if scaling causes issues, ensuring application stability.
* **Cost Optimization:** Scaling up during peak times and scaling down during off-peak times helps optimize your costs.

**2. Prerequisites**

* **A Railway Account:** You'll need an active Railway account.
* **A Deployed Application:** Your application must be successfully deployed on Railway.
* **Resource Monitoring Enabled:**  Railway needs to be able to collect metrics from your application.  This is typically enabled by default, but ensure it is.

**3. Configuration Options**

Railway offers several ways to configure auto-scaling, ranging from simple to advanced:

**a) Basic Auto-Scaling (Recommended for most users)**

This is the easiest way to get started. Railway automatically scales your application based on defined thresholds.

1. **Navigate to Your App on Railway:**  Go to the Railway dashboard and select your application.
2. **Go to the "Scaling" Tab:**  Click on the "Scaling" tab within your application's settings.
3. **Enable Auto-Scaling:** Toggle the "Auto-Scaling" switch to "On".
4. **Configure Thresholds:**  Railway presents you with pre-configured threshold ranges based on typical application behavior.
    * **CPU:**  Defines the upper and lower CPU usage limits.
    * **Memory:** Defines the upper and lower memory usage limits.
    * **Network I/O:**  Defines the upper and lower network I/O limits.
    * **Latency:** Defines the upper and lower request latency limits (important for responsiveness).
5. **Set Scaling Intervals:**  Specify how often Railway checks these metrics for scaling decisions (e.g., every 30 seconds, 1 minute). Shorter intervals mean faster scaling but potentially more frequent adjustments.
6. **Save:** Click "Save" to apply the configuration.

**b) Advanced Auto-Scaling (For fine-grained control)**

This option gives you more control over scaling behavior, but requires a deeper understanding of your application’s requirements.

1. **Same Steps as Basic Auto-Scaling (up to step 3)**
2. **Customize Thresholds:** Instead of using the pre-configured ranges, you can manually set your own minimum and maximum values for each metric.
3. **Scaling Policies (Optional):**  You can define scaling policies beyond just thresholds:
    * **Scale Up:** When a metric exceeds its upper threshold, add a new instance.
    * **Scale Down:** When a metric falls below its lower threshold, remove an instance.
4. **Scaling Strategy (Optional):**
    * **Linear:**  Adds or removes instances in increments.
    * **Exponential:** Adds or removes instances exponentially, allowing for quicker scaling response.
5. **Save:** Click "Save" to apply the configuration.



**4. Key Considerations & Best Practices**

* **Initial State:** Railway will start with a single instance.  Scaling will occur based on demand.
* **Warm-up Period:** Give your application time to warm up before expecting full performance.  Railway’s metrics focus on sustained load.
* **Monitor Scaling Events:**  The "Scaling" tab on Railway displays real-
