# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-04T06:48:43.612104

## Railway Auto-Scaling Configuration Guide

This guide outlines how to configure automatic scaling for your Railway services to ensure optimal performance and cost efficiency.  Railway's built-in auto-scaling features simplify this process, but understanding the key parameters and how they interact is crucial for success.

**1. Understanding Railway Auto-Scaling**

* **Automatic Scaling:** Railway automatically adjusts the number of replicas of your services based on observed traffic and resource utilization. It leverages metrics like CPU usage, memory consumption, and network traffic to determine when to scale up or down.
* **Scale-Out:**  Increasing the number of replicas to handle more requests.
* **Scale-In:** Reducing the number of replicas to save costs during periods of low traffic.
* **Dynamic Scaling:** Railway dynamically adjusts replica counts in near real-time.
* **Resource Limits:**  You can set minimum and maximum replica counts to prevent runaway scaling or under-provisioning.
* **Scaling Triggers:**  Railway uses metrics to trigger scaling actions.  You can influence these triggers through configurations.

**2. Configuration Methods**

Railway offers several ways to configure auto-scaling:

**a) Railway Dashboard (Simplest - Recommended for most users)**

* **Automatic Scaling Enabled by Default:** Railway enables automatic scaling for most services by default.
* **Adjusting Minimum & Maximum Replicas:**
    1. Navigate to your service in the Railway dashboard.
    2. Go to the "Scaling" tab.
    3.  **Minimum Replicas:** Set the lowest number of replicas your service needs to remain online.  A good starting point is often 1.
    4.  **Maximum Replicas:** Set the highest number of replicas your service can handle. Consider your budget and anticipated peak load.  Start conservatively and monitor.
* **Scale-Out Threshold:**  This determines the metric (CPU, Memory, or Network) that triggers a scale-out.
* **Scale-In Threshold:**  This determines the metric that triggers a scale-in.
* **Scaling Grace Period:**  (Default: 30 seconds)  The amount of time Railway waits after a scaling event to allow the service to stabilize before triggering another scaling action.  Adjusting this can improve stability.

**b) Service Configuration Files (Advanced - Fine-Grained Control)**

*  You can configure scaling through your service's `config.yml` or similar configuration file.  This gives you more control over the scaling triggers and metrics.
* **Scaling Sections:** Add a `scaling` section to your configuration file.  Example:

```yaml
service:
  name: my-app
  image: docker.io/my-org/my-app:latest
scaling:
  min_replicas: 1
  max_replicas: 5
  scale_out_threshold: cpu
  scale_in_threshold: cpu
  grace_period: 30
```

* **Supported Metrics:**  The supported metrics vary depending on the service type and the underlying infrastructure.  Common metrics are `cpu`, `memory`, `network`, and `request_count`.
* **Custom Metrics:** In certain scenarios (e.g., custom container metrics), you can potentially configure scaling based on those metrics.  Contact Railway support for assistance.

**3. Key Considerations & Best Practices**

* **Start Small & Monitor:**  Begin with conservative minimum and maximum replica counts.  Monitor your service's performance and scaling activity closely using Railway's dashboard and service logs.
* **Understand Your Traffic Patterns:**  Analyze your application's traffic patterns to anticipate peak loads. This will help you set realistic maximum replica counts.
* **Test Scale-Out & Scale-In:**  Simulate peak traffic loads to verify that your
