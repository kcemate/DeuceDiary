# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-03T11:33:31.276275

## Railway Auto-Scaling Configuration Guide

This guide outlines how to configure auto-scaling for your applications deployed on Railway. Auto-scaling automatically adjusts the resources allocated to your application based on demand, ensuring optimal performance and cost efficiency.

**1. Understanding Railway's Auto-Scaling:**

* **Dynamic Scaling:** Railway utilizes dynamic scaling, meaning it continuously monitors your application's resource usage and automatically scales up or down in real-time.
* **Horizontal Scaling:** Primarily, Railway focuses on horizontal scaling - adding or removing instances of your application to handle increased or decreased load.
* **Metrics-Based Scaling:**  Scaling decisions are based on a combination of metrics, primarily:
    * **CPU Utilization:**  High CPU usage is a key trigger for scaling up.
    * **Memory Utilization:**  Similar to CPU, high memory usage can trigger scaling.
    * **Request Rate (HTTP/API):**  A sudden increase in requests is a strong indicator of increased load and should trigger scaling.
    * **Database Connections:**  High database connection counts can indicate problems.
* **Rolling Scales:** Railway employs rolling scales, meaning it scales gradually to avoid sudden surges in resources, which can lead to instability.

**2. Prerequisites:**

* **Railway Account:** You need an active Railway account.
* **Deployed Application:** Your application must be successfully deployed on Railway.
* **Health Checks:**  Crucially, your application *must* have a configured health check. Railway uses this to monitor the application’s availability and restart unhealthy instances automatically.  This is **essential** for effective auto-scaling.

**3. Configuring Auto-Scaling in the Railway UI:**

This is the primary method for managing auto-scaling.

1. **Navigate to Your App:** Go to your Railway dashboard and select the application you want to configure.
2. **Go to the "Scaling" Tab:** Within your app’s settings, click on the "Scaling" tab.
3. **Scaling Controls:** You'll find several scaling controls:
   * **Minimum Instances:** The minimum number of instances Railway will maintain for your application. Setting this too low can lead to performance issues during peak times.
   * **Maximum Instances:** The maximum number of instances Railway will scale up to. Be mindful of your budget and infrastructure limits.
   * **Scaling Thresholds:**  These are critical settings. Railway provides recommended thresholds based on the application's characteristics.
      * **CPU Threshold:**  The CPU utilization percentage that triggers scaling.  Recommended values are typically between 60% and 80%.  Start with 70% and adjust based on monitoring.
      * **Memory Threshold:**  The memory utilization percentage that triggers scaling.  Again, recommended values are typically between 60% and 80%. Start with 70%.
      * **Request Rate Threshold:** The rate of incoming requests that triggers scaling. This is highly application-specific.  Start with 100 requests per second and adjust based on observed load.
   * **Scaling Duration (Seconds):**  The time (in seconds) that Railway takes to scale up or down after a threshold is triggered. A shorter duration provides quicker responses to changes in load but can be noisier.  Start with 60 seconds and adjust.
   * **Rolling Scale:**  Enable or disable rolling scales.  Rolling scales provide more gradual scaling, reducing the risk of instability.  Generally, you should leave this enabled.
4. **Save Changes:**  Click "Save" to apply your scaling configuration.

**4. Monitoring & Adjustments:**

* **Railway Dashboard:** The Railway dashboard provides real-time metrics on your application’s CPU, memory, and request rate.  Pay attention to these metrics to understand your application's load patterns.
* **Logs
