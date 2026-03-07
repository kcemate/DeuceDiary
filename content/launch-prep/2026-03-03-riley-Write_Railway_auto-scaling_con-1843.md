# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-03T18:43:50.570985

## Railway Auto-Scaling Configuration Guide

This guide outlines how to configure auto-scaling for your applications deployed on Railway.  Railway's auto-scaling leverages Kubernetes to dynamically adjust your application's resources based on demand, optimizing cost and performance.

**1. Understanding Railway's Auto-Scaling**

* **Kubernetes as the Foundation:** Railway uses Kubernetes as its core orchestration system. Auto-scaling is directly tied to Kubernetes' Horizontal Pod Autoscaler (HPA).
* **Metrics:** Railway automatically collects metrics from your application, primarily using Prometheus and Grafana. These metrics are then used to trigger scaling events. Key metrics include:
    * **CPU Utilization:**  The most commonly used metric.
    * **Memory Utilization:** Important for memory-intensive applications.
    * **Requests per Second (RPS):** Measures traffic load.
    * **Custom Metrics:** You can expose custom metrics from your application for more granular scaling.
* **Scaling Policies:** You can define how Railway reacts to these metrics.  You can choose between:
    * **Target Utilization:** Set a percentage of CPU or memory usage to maintain. Railway will adjust the number of pods to keep within this target.
    * **Target RPS:**  Scales the number of pods based on incoming requests per second.
* **Automatic vs. Manual Control:**  You can choose to let Railway manage scaling automatically, or you can manually adjust the scaling parameters from the Railway dashboard.

**2. Setting Up Auto-Scaling in Railway**

**A. Enabling Auto-Scaling:**

* **Default Behavior:** By default, Railway enables auto-scaling for most applications. However, you can disable it in your application’s settings.
* **Check Status:** Go to your application's details page in the Railway dashboard. Look for the "Scaling" section. It will show if auto-scaling is enabled and the current scaling configuration.

**B. Configuring Scaling Policies:**

1. **Navigate to Scaling Settings:** Within your application's detail page, click on the “Scaling” tab.

2. **Choose Scaling Method:** Select your preferred scaling method:
   * **Target Utilization:**
     * **Threshold:** Set the percentage of CPU or memory utilization you want to maintain.  For example, 70% CPU utilization.
     * **Minimum Replicas:** The minimum number of pods Railway will keep running, even if traffic is low.  This prevents excessive scaling down.
     * **Maximum Replicas:** The maximum number of pods Railway will scale up to.
   * **Target RPS:**
     * **Threshold:**  The desired requests per second to maintain.
     * **Minimum Replicas:** (Same as Target Utilization)
     * **Maximum Replicas:** (Same as Target Utilization)

3. **Save Changes:**  Railway automatically applies your scaling settings.


**3. Advanced Scaling Configurations & Considerations**

* **Custom Metrics:**
    * **Exposing Metrics:**  Your application needs to expose metrics in a format that Prometheus can understand (e.g., Prometheus exposition, StatsD, etc.).  Railway provides integrations to popular monitoring tools.
    * **Custom Scaling:** You can configure HPA to scale based on these custom metrics.  This allows you to scale your application based on factors specific to your application, like queue length or database latency.
* **Horizontal Pod Autoscaler (HPA) Tuning:**
    * **Initial Delay:** The time (in seconds) before the HPA starts to scale up or down after a metric change.  Adjust this to avoid excessive scaling oscillations.
    * **Scale-Down Delay:** The time (in seconds) before the HPA starts to scale down after a metric change. Similar to Initial Delay, this prevents over-reactions.
* **Scaling Events:**
    *
