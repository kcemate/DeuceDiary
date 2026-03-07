# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-07T02:13:05.791562

## Railway Auto-Scaling Configuration Guide - Achieving Optimal Performance & Cost Efficiency

This guide outlines how to effectively configure auto-scaling for your applications deployed on Railway, helping you maintain optimal performance and minimize costs. Railway's auto-scaling is tightly integrated with its infrastructure and offers a streamlined approach to dynamic scaling.

**1. Understanding Railway's Auto-Scaling**

* **Dynamic Scaling:** Railway automatically adjusts the number of instances of your services based on real-time demand.
* **Metrics-Based:** Scaling decisions are driven by metrics like CPU utilization, memory usage, network I/O, and request latency.
* **Integration with Kubernetes:** Railway uses Kubernetes as its core orchestration engine, leveraging its auto-scaling capabilities.
* **Simple Configuration:** Railway simplifies the setup with intuitive settings within your service configuration.

**2. Configuration Options & Best Practices**

Here’s a breakdown of the key configuration aspects and recommendations:

**2.1. Service Configuration (Railway UI)**

* **Locate your Service:** Navigate to your service in the Railway UI.
* **Scaling Tab:**  Click on the "Scaling" tab. This is the central hub for configuring auto-scaling.
* **Scaling Type:** Choose your preferred scaling type:
    * **CPU-Based Scaling:**  The most common option.  Railway will scale based on the average CPU utilization across your instances.
    * **Memory-Based Scaling:**  Scale based on average memory usage.  Useful for memory-intensive applications.
    * **Custom Metrics:** (Advanced - Requires Kubernetes Monitoring) -  Allows you to use custom metrics from your application or monitoring system (e.g., queue depth, error rate) to trigger scaling.  More complex to set up but offers the most granular control.

**2.2. Scaling Parameters - Key Settings**

* **Minimum Instances:** The absolute minimum number of instances Railway will maintain for your service.  Consider the basic request load and startup time.  Setting this too low can lead to performance issues during spikes.
* **Maximum Instances:** The maximum number of instances Railway will scale up to.  This is crucial for controlling costs.  Don't scale to an unsustainable level.
* **Scaling Interval:**  How frequently Railway checks the metrics and adjusts the number of instances.  Default is 60 seconds.  Shorter intervals lead to quicker responses, but can increase operational overhead.  Generally, 60-120 seconds is a good starting point.
* **Scale Up Threshold:** The CPU or Memory utilization percentage that triggers a scaling-up event. (e.g., 70% CPU utilization).
* **Scale Down Threshold:** The CPU or Memory utilization percentage that triggers a scaling-down event. (e.g., 30% CPU utilization).
* **Cooldown Period:**  The duration (in seconds) that instances must remain below the scale-down threshold before Railway attempts to scale down again. This prevents rapid scaling fluctuations due to short bursts of load. (e.g., 60 seconds).

**3. Recommended Scaling Strategies**

* **Start Small, Monitor & Adjust:**  Begin with a low minimum and maximum number of instances.  Monitor your service's performance and scale gradually.
* **Understand Your Application's Behavior:**  Analyze your application's typical load patterns. Are there predictable peak times? Does it exhibit sudden bursts?
* **Baseline Performance:** Establish a baseline understanding of your service’s performance under normal load. This will help you determine appropriate scaling thresholds.
* **Test Scaling Changes:** Use load testing tools to simulate traffic increases and observe how your service scales.
* **Cost Optimization:**  Monitor your Railway bills and adjust the maximum instances to balance performance with cost.

**4. Advanced Considerations & Kubernetes Integration (For Custom Metrics)**

* **
