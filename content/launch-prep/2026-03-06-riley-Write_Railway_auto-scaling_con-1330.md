# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-06T13:30:15.989231

## Railway Auto-Scaling Configuration Guide

This guide outlines how to configure auto-scaling for your applications running on Railway, allowing your service to automatically adjust resources based on demand. Auto-scaling is crucial for maintaining performance and cost-efficiency, especially for services experiencing fluctuating traffic.

**1. Understanding Railway's Auto-Scaling Capabilities**

* **Horizontal Scaling:** Railway supports horizontal scaling by automatically adding or removing instances of your application. This is the most common and recommended approach.
* **Metrics Triggered Scaling:** Scaling is triggered by specific metrics, allowing for granular control over resource allocation.
* **Automatic Rolling Deployments:**  Railway automatically handles rolling deployments while scaling, minimizing downtime.
* **Managed Scaling:** Railway manages the infrastructure behind the scenes, eliminating the need for you to manually provision or manage servers.


**2. Configuring Auto-Scaling via the Railway UI**

This is the simplest and recommended method.

* **Navigate to Your Service:**  Log into your Railway account and select the service you want to auto-scale.
* **Go to the "Scaling" Tab:**  Within your service's dashboard, click on the "Scaling" tab.
* **Enable Auto-Scaling:** Toggle the "Auto-Scale" switch to the "On" position.
* **Configure Scaling Rules:**  This is the core of your auto-scaling setup:
    * **Metric:** Choose the metric that will trigger scaling. Common choices include:
        * **Requests per Second (RPS):**  Good for web applications and APIs.
        * **CPU Utilization:** Suitable for compute-intensive workloads.
        * **Memory Utilization:** Useful for applications with high memory needs.
        * **Response Time:**  Can be helpful for identifying bottlenecks and scaling proactively.
    * **Lower Threshold:** The value below which Railway will *add* instances.  (e.g., 100 RPS)
    * **Upper Threshold:** The value above which Railway will *add* instances.  (e.g., 500 RPS)
    * **Scale Increment:** The number of new instances to add when the lower threshold is crossed. (e.g., 1 instance)
    * **Scale Duration:**  How long Railway will maintain the increased capacity before checking the metrics again. (e.g., 1 minute)  This prevents flapping.
* **Save Changes:** Click the "Save" button to apply your auto-scaling configuration.

**3. Advanced Configuration & Considerations**

* **Custom Metrics (Advanced):**  Railway supports integration with custom metrics providers. This allows you to use metrics from your application or external monitoring systems.  Refer to Railway’s documentation for details on custom metrics.
* **Cool-Down Period:** Railway has a cool-down period to prevent excessive scaling based on transient spikes. This is automatically configured, but you can review it in the settings.
* **Scaling Limits:** Railway imposes limits on the maximum number of instances an application can scale to.  You can request increases through your support channel.
* **Service Limits:**  Keep in mind Railway service limits that may influence scaling options.
* **Container Health Checks:** Railway automatically monitors the health of your application containers. Unhealthy containers trigger scaling events. Ensure your application healthchecks are accurate and responsive.
* **Cost Optimization:**  Carefully tune your scaling rules to avoid unnecessary resource consumption and cost.

**4. Example Configurations**

* **Simple Web App (RPS-Based):**
    * **Metric:** Requests per Second (RPS)
    * **Lower Threshold:** 100 RPS
    * **Upper Threshold:** 500 RPS
    * **Scale Increment:** 1 instance
    * **Scale Duration:** 1 minute
* **Compute-Intensive Service (CPU Utilization-Based
