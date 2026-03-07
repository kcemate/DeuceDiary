# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-04T07:56:43.959167

## Railway Auto-Scaling Configuration Guide

This guide outlines how to configure auto-scaling for your applications on Railway, allowing your services to automatically adjust their resources based on demand, optimizing cost and performance.

**Understanding Railway Auto-Scaling**

Railway leverages Kubernetes for orchestration and provides built-in auto-scaling capabilities for many service types.  This guide covers the general principles and focuses on the most common scenarios.

**1. Prerequisites:**

* **Railway Account:** You need an active Railway account.
* **Deployed Service:** You must have a service already deployed on Railway.
* **Kubernetes Resources:** Railway uses Kubernetes to manage your applications. Understanding basic Kubernetes concepts like Pods, Deployments, and Services is beneficial.

**2.  Automatic Scaling - Railway’s Default Behavior**

* **Horizontal Pod Autoscaler (HPA):** Railway automatically utilizes HPA for most deployed services.  This means it monitors metrics like CPU utilization, memory usage, or custom metrics you configure, and dynamically adjusts the number of Pods running your application.
* **Metric Monitoring:** Railway automatically collects metrics from your deployed services, providing the foundation for HPA to function.
* **Scaling Policies:** Railway provides default scaling policies that you can customize.

**3. Configuring Auto-Scaling – Key Settings**

You can adjust auto-scaling settings within the Railway UI:

* **Navigate to your Service:** In the Railway UI, go to your service and click on "Settings".
* **Scaling Tab:** Select the "Scaling" tab.
* **Scaling Mode:**
    * **Automatic (Recommended):** Railway’s HPA automatically manages scaling. You can still fine-tune the settings.
    * **Manual:** You manually adjust the number of replicas (Pods) running your service.  Use this only if you have a specific scaling strategy.

**4. Fine-Tuning Scaling Policies**

Within the "Scaling" tab, you'll find several configurable parameters:

* **Minimum Replicas:**  The minimum number of Pods Railway will always keep running. Setting this too low can lead to frequent scaling up and down.
* **Maximum Replicas:** The maximum number of Pods Railway will scale up to. Avoid setting this too high to prevent excessive resource consumption.
* **Scaling Metric:**  Choose which metric to use for scaling:
    * **CPU Utilization:**  Scaling based on CPU usage.
    * **Memory Utilization:** Scaling based on memory usage.
    * **Custom Metrics:** (Advanced) Allows you to configure custom metrics for scaling. This is often used for metrics like request latency or queue depth. You'll need to configure an exporter for your metrics.
* **Scaling Thresholds:** (For each metric)
    * **Below:**  The value below which scaling will *decrease* replicas.
    * **Above:** The value above which scaling will *increase* replicas.
* **Cooldown Period:** The time (in seconds) that the HPA waits after scaling before considering another change.  This prevents excessive scaling fluctuations.

**Example: Scaling based on CPU Utilization**

Let’s say you have a web application.  You might configure:

* **Minimum Replicas:** 1
* **Maximum Replicas:** 10
* **Scaling Metric:** CPU Utilization
* **Below:** 60%
* **Above:** 90%
* **Cooldown Period:** 60 seconds

This configuration means:  If your application's CPU utilization goes below 60%, Railway will automatically scale down to 1 Pod. If it goes above 90%, Railway will scale up to 10 Pods. The HPA will wait 60 seconds between scaling events.

**5.  Custom Metrics and Exporters**

* **Custom Metrics:**
