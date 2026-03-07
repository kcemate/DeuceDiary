# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-07T00:28:44.081675

## Railway Auto-Scaling Configuration Guide

This guide outlines how to configure auto-scaling for your applications deployed on Railway. Auto-scaling automatically adjusts the resources allocated to your application based on demand, optimizing cost and performance.

**1. Understanding Railway Auto-Scaling**

* **Dynamic Scaling:** Railway offers dynamic scaling, meaning your application's resources are automatically increased or decreased based on real-time traffic.
* **Metrics-Driven:** Scaling decisions are based on metrics collected by Railway, primarily CPU usage, memory usage, and network traffic.
* **Horizontal Scaling:** Railway primarily utilizes horizontal scaling, meaning it adds more instances of your application to handle increased load.
* **Rolling Updates:** Railway automatically rolls out changes during scaling, minimizing downtime.


**2. Prerequisites**

* **Railway Account & App:** You need a Railway account and a deployed application within an app.
* **Application Health Checks:** Ensure your application has a properly configured health check endpoint. Railway uses this to determine if an instance is healthy and ready to serve requests.  This is *crucial* for auto-scaling to work correctly.
* **Resource Limits (Optional, but Recommended):**  While auto-scaling can adapt, setting limits on CPU, memory, and network bandwidth can improve stability and predictability.

**3. Configuring Auto-Scaling in Railway**

There are several ways to configure auto-scaling:

**a) Automatic Scaling (Recommended):**

* **Railway's Default Behavior:** By default, Railway’s dynamic scaling is enabled for all apps.
* **Monitoring & Adjustments:** Railway automatically monitors your app's metrics.  If the metrics indicate high utilization, Railway will scale up your app by adding more instances.  Conversely, if utilization drops, Railway will scale down.
* **Fine-Tuning:** While Railway handles the majority of the scaling, you can still fine-tune some aspects:
    * **Minimum Instances:** This sets the *minimum* number of instances that will always be running.  This is important for ensuring rapid response times during peak periods.
    * **Maximum Instances:** This sets the *maximum* number of instances that Railway will allow your application to scale to.
    * **Scaling Thresholds:** You can configure thresholds for CPU and memory usage that trigger scaling events.  These are accessed through the Railway UI.

**b) Manual Scaling (Advanced):**

* **Railway UI:** Navigate to your app in the Railway UI.
* **Scaling Tab:** Go to the "Scaling" tab.
* **Manual Scale:** You can manually increase or decrease the number of instances.  Railway will then monitor and adjust the scaling in response to changes in traffic.

**c) Configuration via `railway.yaml` (Advanced, for more granular control):**

* **Scaling Settings:** You can directly configure scaling settings within your `railway.yaml` file. This provides the most control but also requires a deeper understanding of the system.
* **Key Settings:**
    * `scale_min`: Minimum number of instances.
    * `scale_max`: Maximum number of instances.
    * `scale_triggers`: Defines the metrics and thresholds that trigger scaling events.


**4.  Key Metrics Railway Monitors**

* **CPU Utilization:** The percentage of CPU time being used.  High CPU utilization typically indicates increased load.
* **Memory Utilization:** The percentage of RAM being used.  High memory utilization can lead to slower performance and out-of-memory errors.
* **Network Traffic:** The amount of data being transmitted through the network.  Increased network traffic usually indicates increased user activity.
* **Request Latency:**  The time it takes for your application to respond to requests.  This is a crucial indicator of performance.

**5. Best Practices for Auto-Scaling**

* **Define Clear
