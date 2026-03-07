# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-03T17:58:35.040064

## Railway Auto-Scaling Configuration Guide

This guide outlines how to configure auto-scaling for your applications deployed on Railway. Railway handles much of the complexity, but understanding how it works and customizing it appropriately will ensure optimal performance and cost efficiency.

**1. Understanding Railway's Auto-Scaling**

* **Horizontal Scaling:** Railway primarily uses horizontal scaling – adding more instances of your application to handle increased load.
* **Metrics-Based:** Scaling decisions are driven by key metrics monitored by Railway. These metrics typically include:
    * **CPU Usage:**  The percentage of CPU time utilized by your application instances.
    * **Memory Usage:** The amount of RAM being consumed.
    * **Network I/O:** The rate of incoming and outgoing network traffic.
    * **Request Rate:** The number of requests your application is handling per second.
    * **Response Time:** The duration it takes for your application to respond to requests.
* **Rolling Updates:** Railway often performs rolling updates during scaling, minimizing downtime.
* **Instance Types:** Railway offers various instance types (e.g., `tiny`, `small`, `medium`, `large`) that differ in CPU, memory, and network performance.  Choosing the right instance type is crucial.
* **Pre-warming:** Railway may proactively scale up instances to "warm them up" – reducing initial response times when traffic spikes.

**2. Configuring Auto-Scaling Through the Railway UI**

This is the recommended method for most users.

* **Navigate to your App:**  Log into your Railway account and select the application you want to scale.
* **Go to Settings -> Scaling:** In the application's settings, click on the "Scaling" tab.
* **Scaling Configuration Options:**
    * **Minimum Instances:**  Set the minimum number of instances Railway should always keep running.  This ensures consistent performance and responsiveness even during low traffic.
    * **Maximum Instances:**  Set the maximum number of instances Railway can scale up to. This controls your overall costs.
    * **Metric:** Select the primary metric used to trigger scaling:
        * **CPU Utilization:**  Most common and recommended for general applications.
        * **Request Rate:** Useful for applications with predictable request patterns.
        * **Response Time:** Good for latency-sensitive applications.
    * **Threshold:** Define the percentage/value above which scaling will be triggered. For example:
        * **CPU Utilization:** 70% (meaning scale up when CPU usage exceeds 70%)
        * **Request Rate:** 100 requests/second (scale up when the request rate exceeds 100 RPS)
    * **Scale Time:**  Specify how long it takes for Railway to adjust the number of instances after a scaling event.  Shorter times respond quicker to changes, but can be more volatile.  Experiment to find the best balance.
    * **Cool Down Period:**  Sets a time period after a scaling event where Railway won’t trigger another scaling action.  This helps prevent oscillations.
* **Save Changes:**  Click "Save" to apply your scaling configuration.

**3.  Advanced Scaling Options (via `railway.yaml`)**

For more granular control and specific scenarios, you can modify the `railway.yaml` file in your application's root directory. This is generally only needed for advanced use cases.

* **`scaling` Section:** This section defines your auto-scaling settings:

   ```yaml
   scaling:
     min_instances: 1  # Minimum number of instances
     max_instances: 5  # Maximum number of instances
     metrics:
       - name: cpu_utilization
         threshold: 70
         scale_time: 60  # seconds
         cool_down_
