# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-03T23:38:13.728777

## Railway Auto-Scaling Configuration Guide

This guide outlines how to configure auto-scaling for your applications running on Railway, enabling your service to dynamically adjust resources based on demand, optimizing cost and performance.

**1. Understanding Railway Auto-Scaling**

Railway’s auto-scaling relies on metrics collected from your service's logs. It monitors:

* **CPU Usage:**  High CPU usage indicates increased demand.
* **Memory Usage:**  Similar to CPU, high memory usage reflects increased demand.
* **Network I/O:**  Increased network activity can signal higher user traffic.
* **HTTP Request Rate:**  A surge in incoming HTTP requests is a primary trigger.
* **Custom Metrics (Advanced):**  You can also configure your application to expose custom metrics, providing more granular control over scaling.

Railway automatically adjusts the number of replicas based on these metrics, aiming to keep your service responsive and efficient.


**2. Prerequisites**

* **Railway Account:** You need a Railway account and an application deployed.
* **Application Metrics:** Your application must be able to expose metrics. This typically involves:
    * **Logging:** Consistent logging with relevant information for metric collection.
    * **Metrics Libraries/SDKs:** Integrating a metrics library (e.g., Prometheus, StatsD, OpenTelemetry) into your application.
* **Understanding Your Application's Load Patterns:**  Knowing how your application typically behaves under different loads is crucial for setting effective scaling parameters.

**3. Configuring Auto-Scaling in Railway**

Railway offers several ways to control auto-scaling:

**A. Automatic Scaling (Recommended)**

This is the simplest approach, leveraging Railway's built-in auto-scaling.

1. **Enable Auto-Scaling:**
   * In the Railway dashboard, navigate to your application.
   * Go to the "Scaling" tab.
   * Toggle "Auto-Scaling" to "On."
   * **Initial Replicas:**  Set the initial number of replicas. A reasonable starting point is often 1-3, depending on the application's expected load.
   * **Minimum Replicas:** This defines the absolute minimum number of replicas Railway will maintain.
   * **Maximum Replicas:** This sets the upper limit for scaling.
   * **Scaling Interval:**  How often Railway checks metrics and adjusts the replica count (default: 60 seconds).
   * **Scaling Thresholds:**  Configure thresholds for CPU/Memory usage (e.g., "CPU > 70% triggers scaling"). This fine-tunes the response to changes.

2. **Observe & Adjust:**  Monitor your application's performance using the Railway dashboard. You can adjust the initial replicas, minimum, maximum, and scaling thresholds based on your observations.



**B. Advanced Scaling with Custom Metrics (for Fine-Grained Control)**

If the default scaling relies solely on CPU/Memory, you can use custom metrics for more precise control.

1. **Expose Custom Metrics:**  Modify your application to expose metrics through a metrics library (e.g., Prometheus, StatsD, OpenTelemetry).
2. **Configure Railway's Scaling Rules:**  In the "Scaling" tab, you'll see options to add custom scaling rules based on these metrics.  You'll need to point Railway to where your application publishes these metrics.
   * **Metrics Source:** Specify the source (e.g., Prometheus endpoint URL).
   * **Metric Name:** The name of the metric you want to use for scaling (e.g., `request_rate`).
   * **Scaling Threshold:**  Define the threshold for triggering scaling.
   * **Scaling Adjustment:**  How many replicas to add or remove based on the threshold.

**4. Monitoring & Debugging Auto-Scaling**

*
