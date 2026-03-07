# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-04T00:23:20.166402

## Railway Auto-Scaling Configuration Guide

This guide outlines how to configure auto-scaling for your applications running on Railway, enabling your service to dynamically adjust its resources based on demand.  Railway handles the underlying infrastructure, but you, as the developer, need to configure scaling rules to optimize performance and cost.

**1. Understanding Railway’s Auto-Scaling Capabilities**

* **Horizontal Pod Autoscaling (HPA):** Railway utilizes Kubernetes HPA, which is the core mechanism for scaling your applications. HPA monitors metrics like CPU utilization, memory usage, and custom metrics, and automatically adjusts the number of pods in your deployment.
* **Metrics Supported:** Railway primarily relies on Kubernetes metrics for HPA. This includes:
    * **CPU Utilization:**  The percentage of CPU resources used by your application.  A common starting point for scaling.
    * **Memory Utilization:**  The percentage of memory resources used by your application.  Critical for stability and performance.
    * **Request Rate:** (If you configure a custom metric) The number of requests your application is handling per second.
    * **Latency:** (If you configure a custom metric)  The time it takes for your application to respond to a request.
* **Railway UI & CLI:** You'll primarily manage HPA through the Railway UI. The CLI is also available for scripting and automation.

**2. Configuring Auto-Scaling via the Railway UI**

1. **Navigate to Your Service:**  Log in to Railway and select your service from your dashboard.
2. **Go to the "Scaling" Tab:** Within your service's settings, locate and click on the "Scaling" tab.
3. **Select the Deployment:** Choose the deployment you want to scale from the dropdown.
4. **Configure Scaling Rules:** This is the core of the configuration.  You'll see the following options:

   * **Scale Based On:**  Choose the metric you want to use for scaling (CPU, Memory, Request Rate, or Custom).
   * **Minimum Replicas:**  The minimum number of pods that should always be running.  This ensures you have a baseline capacity.  (Recommended: Start with at least 1 for basic availability.)
   * **Maximum Replicas:**  The maximum number of pods Railway will allow your application to scale to.  (Careful consideration needed; don’t set this excessively high to avoid cost issues.)
   * **Scaling Thresholds:** These are the key values that drive the scaling process.
      * **CPU Threshold:** (If scaling on CPU) The percentage of CPU utilization that triggers scaling. For example, 70% will scale up when CPU usage exceeds 70% and scale down when it drops below 30%.
      * **Memory Threshold:** (If scaling on Memory) The percentage of memory utilization.  Similar logic to CPU.
      * **Request Rate Threshold:** (If scaling on Request Rate) The number of requests per second that triggers scaling.
      * **Custom Metric Threshold:** (If using a custom metric) Define the value of your custom metric that triggers scaling.
   * **Cooldown Period:**  This setting prevents rapid scaling up and down. It determines how long Railway waits after a scaling event before considering another scaling action.  A shorter cooldown period means faster scaling responses, but can also lead to instability. A typical starting point is 60 seconds.
   * **Metric Collection Interval:**  The frequency with which Railway collects metrics.  Defaults to 15 seconds – adjust only if necessary. (Higher intervals mean less frequent scaling checks, potentially impacting responsiveness.)

5. **Save Your Configuration:**  Click the "Save" button to apply your changes.

**3. Setting up a Custom Metric (Recommended for Advanced Scaling)**

Scaling based solely on CPU and memory can be
