# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-04T12:51:40.260163

## Railway Auto-Scaling Configuration Guide

This guide outlines how to configure auto-scaling for your applications deployed on Railway. Auto-scaling automatically adjusts your application’s resources (CPU, memory, etc.) based on demand, ensuring optimal performance and cost efficiency.

**1. Understanding Railway's Auto-Scaling**

* **Dynamic Scaling:** Railway employs dynamic scaling, meaning it continuously monitors your application’s load and adjusts resources in real-time.
* **Horizontal Scaling:** Railway primarily uses horizontal scaling - adding more instances of your application to handle increased load.
* **Metrics Used:** Railway utilizes various metrics to determine scaling decisions:
    * **Requests/Second:** The rate at which your application is receiving HTTP requests.
    * **CPU Utilization:** The percentage of CPU resources being used by your application.
    * **Memory Utilization:** The percentage of memory resources being used by your application.
    * **Queue Length (for worker processes):**  The number of items waiting in queues for processing.
* **No Configuration Needed (mostly):** Railway’s auto-scaling is generally configured automatically. However, understanding the underlying metrics and available settings allows you to fine-tune the behavior.


**2. Railway's Built-in Auto-Scaling**

* **Default Settings:** Railway ships with sensible default auto-scaling settings. These are often sufficient for many applications.
* **Automatic Scaling:** By default, Railway automatically scales your application based on the metrics mentioned above. You don’t need to manually set any thresholds.
* **Scaling Window:** Railway employs a scaling window, meaning changes aren't instantaneous. Scaling typically happens over a short period (e.g., 30 seconds) to avoid performance spikes.

**3. Fine-Tuning Auto-Scaling (Advanced Options)**

While the default auto-scaling is powerful, you can fine-tune it for specific applications. Here's how:

* **Accessing Scaling Settings:**
    * Log into your Railway dashboard.
    * Navigate to your application.
    * Select the "Resources" tab.
    * You'll find the “Scaling” section.

* **Key Configuration Options:**
    * **Max Instances:**  The maximum number of instances Railway will create for your application. This prevents runaway scaling.  **Start conservatively and increase gradually.**
    * **Min Instances:** The minimum number of instances Railway will maintain. This ensures there’s always a baseline level of capacity. **Setting this too low can increase cold start times.**
    * **Scaling Window (Duration):** (Default: 30 seconds).  This determines the duration it takes for scaling events to complete. Shorter windows mean more responsive scaling, but can increase the risk of over-scaling.
    * **Cool Down (Duration):** (Default: 60 seconds). This determines how long Railway waits after a scaling event before considering scaling again. Useful to prevent rapid fluctuations based on transient spikes.
    * **Instance Types (Resource Selection):** Railway automatically selects an instance type based on your application’s requirements.  However, you can override this selection, choosing a more appropriate instance type for your workload (e.g., a GPU instance for machine learning). This selection directly affects scaling costs.

* **Metric Thresholds (Coming Soon - Roadmap Item):**  Railway is currently developing the ability to define custom metric thresholds for scaling.  This will allow you to tailor scaling behavior based on specific application needs.


**4. Monitoring & Troubleshooting Auto-Scaling**

* **Railway Dashboard:** The Railway dashboard provides real-time metrics and scaling activity for your application.
* **Logs:** Examine your application's logs for errors or performance issues that might be triggering scaling events.
* **Metrics Explorer:**  Explore the raw metrics available through the Metrics Explorer to gain deeper insights.
