# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-03T09:40:17.712180

## Railway Auto-Scaling Configuration Guide: Optimizing Your Applications

Railway offers robust auto-scaling capabilities to ensure your applications handle fluctuating workloads efficiently. This guide outlines how to configure auto-scaling for your services, maximizing performance and minimizing costs.

**1. Understanding Railway's Auto-Scaling**

* **Horizontal Scaling:** Railway automatically adjusts the number of instances of your service based on metrics like CPU usage, memory usage, and network traffic.
* **Metric-Based Scaling:** Scaling decisions are driven by metrics collected by the Railway monitoring system.
* **Scheduled Scaling:**  Allows you to scale up or down at specific times, ideal for predictable traffic patterns.
* **Dynamic Scaling:** Scales instantly in response to real-time traffic spikes.
* **Cost Optimization:**  Scaling up allows you to utilize resources more effectively, leading to cost savings compared to consistently running at full capacity.

**2. Key Configuration Options & Best Practices**

**2.1. Service Configuration (within the Service Definition)**

* **`auto_scale: true`:**  This is the primary flag to enable auto-scaling within your Railway service definition.  Without this, auto-scaling won't be active.
* **`min_replicas: 1`:**  Sets the minimum number of instances that will always be running. This prevents the service from scaling down to zero.  A good starting point is often 1, especially for services that need to be always available.
* **`max_replicas: 64`:** (Default) Defines the maximum number of instances Railway will scale the service up to.  This value depends on your service's resources and expected load.  Carefully consider this; excessive scaling can lead to cost overruns.
* **`metrics:`:**  This is where you define *which* metrics drive the auto-scaling decisions.  Crucially important.  Railway offers various metric types.
    * **CPU:**  Most common and generally reliable.
    * **Memory:** Useful for services with memory-intensive operations.
    * **Network Traffic (in/out):**  Good for applications with heavy network activity.
    * **Request Latency:**  Especially important for services where response time is critical.
    * **Custom Metrics:** Railway supports custom metrics you can expose, allowing you to tailor scaling to your specific needs.

**2.2. Scaling Policies (Within the Service Definition)**

* **`scale_on:`:** Specifies the metric to trigger scaling. Examples: `cpu`, `memory`, `network_in`.
* **`scale_down:`:**  Specifies the metric to trigger scaling down. This is important for preventing runaway costs. Examples: `cpu`, `memory`, `network_in`.
* **`scale_target:`:** Defines the target value for the chosen metric.  This is the *goal* Railway attempts to maintain.
    * **`target: 80`:**  Example - Scale to maintain 80% CPU utilization.
    * **`target: 2000`:**  Example - Scale to maintain 2000 requests per second (for latency scaling).
* **`scale_up_duration: 60`:** (seconds) How long it takes to scale up after a scaling event. A shorter duration leads to quicker responses but can increase costs.
* **`scale_down_duration: 300`:** (seconds) How long it takes to scale down after a scaling event. This provides stability and prevents drastic fluctuations.
* **`scale_up_grace_period: 30`:**  (seconds)  Allows the service to gracefully handle new requests before scaling up. Prevents immediate impact on performance.
* **`scale_down_grace_period: 60
