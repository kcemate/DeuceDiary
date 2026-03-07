# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-03T22:30:29.240461

## Railway Auto-Scaling Configuration Guide

This guide outlines how to configure auto-scaling for your applications deployed on Railway, allowing your application to dynamically adjust its resources based on demand, optimizing cost and performance.

**Understanding Railway Auto-Scaling**

Railway provides automatic scaling for most application types, leveraging Kubernetes and its Horizontal Pod Autoscaler (HPA). This means Railway monitors your application's resource utilization and automatically adjusts the number of pods running to handle fluctuating traffic.  

**1. Prerequisites:**

* **Railway Account:** You need an active Railway account.
* **Application Deployed:** You must have already deployed your application to Railway.
* **Resource Monitoring Metrics Enabled:** Ensure that metrics like CPU, Memory, and Network I/O are being collected by your application.  Railway uses Prometheus to collect these metrics.
* **Deployment Configuration:** You have a suitable deployment configuration set up for your application (e.g., Docker image, environment variables).

**2. Key Concepts:**

* **Horizontal Pod Autoscaler (HPA):** This Kubernetes component automatically scales the number of pods in a deployment based on configured metrics.
* **Metrics:** The HPA relies on metrics to determine when scaling is needed. Common metrics include:
    * **CPU Utilization:** Percentage of CPU resources being used.
    * **Memory Utilization:** Percentage of memory resources being used.
    * **Custom Metrics:** You can define custom metrics that directly reflect your application's performance (e.g., queue length, request latency).
* **Scaling Limits:**  These define the minimum and maximum number of pods the HPA can scale to.
* **Target Utilization:** This sets the desired percentage of CPU or memory utilization that the HPA should maintain.

**3. Configuring Auto-Scaling on Railway:**

Railway typically handles HPA configuration automatically. However, you can fine-tune it:

**a) Automatic Configuration (Recommended):**

* Railway will automatically configure an HPA for your deployments based on default settings.  This is usually sufficient for many applications.
* **Monitoring:**  Railway continuously monitors your application's metrics.
* **Scaling:**  Railway automatically scales your application up or down based on the configured scaling limits and target utilization.

**b) Manual Configuration (Advanced - for specific use cases):**

This is more involved and requires editing your Railway deployment’s YAML configuration.

* **Edit Deployment YAML:**  Navigate to your deployment in the Railway dashboard and select "Edit."
* **Add/Modify HPA Configuration:** In the YAML editor, look for the `autoscaling` section. If it doesn't exist, add it.
* **Example HPA Configuration:**

```yaml
autoscaling:
  enabled: true
  minReplicas: 1  # Minimum number of pods
  maxReplicas: 10 # Maximum number of pods
  targetUtilization: 70 # Desired CPU utilization (percentage)
  metrics:
    - type: cpu
      resource:
        target: 70
    - type: memory
      resource:
        target: 80
```

**Explanation of YAML Fields:**

* `enabled: true`: Enables auto-scaling for the deployment.
* `minReplicas`: The minimum number of pods that will always be running.
* `maxReplicas`: The maximum number of pods that the HPA can scale up to.
* `targetUtilization`: The desired percentage of CPU or memory utilization that the HPA should aim to maintain.
* `metrics`: Defines the metrics used by the HPA.
    * `type`: The type of metric (e.g., `cpu`, `memory`, `custom`).
    * `resource`:  Defines the target value for the metric (e.g., `
