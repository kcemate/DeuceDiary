# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-04T01:08:47.312323

## Railway Auto-Scaling Configuration Guide

This guide outlines how to effectively use Railway's auto-scaling features to ensure your applications stay performant and cost-optimized, even under fluctuating traffic.

**1. Understanding Railway's Auto-Scaling**

Railway leverages Kubernetes, so its auto-scaling is based on Kubernetes Horizontal Pod Autoscaler (HPA). Here's what you need to know:

* **HPA Basics:** HPA automatically scales the number of pods in your deployment based on CPU or Memory utilization.
* **Railway's Integration:** Railway simplifies the HPA setup. It automatically detects your deployments and suggests HPA configurations based on metrics.
* **Target Metrics:**  You can choose to scale based on CPU, Memory, or a custom metric.
* **Scaling Boundaries:**  You can define minimum and maximum pod counts to prevent extreme fluctuations.
* **Cooldown Periods:** HPA has cooldown periods after scaling events to avoid rapid oscillations.
* **Cost Optimization:**  Scaling down during low traffic periods significantly reduces your bill.


**2. Setting Up Auto-Scaling on Railway**

There are several ways to configure auto-scaling:

**a) Automatic Suggestions (Recommended):**

* **Railway's Dashboard:**  When you deploy a new application, Railway will automatically detect the deployment and offer a suggested HPA configuration. This is typically based on CPU and memory usage.
* **Accept/Reject Suggestions:**  You can accept the suggestion, adjust the parameters, or reject it entirely.  Railway will then create and manage the HPA for you.
* **Monitoring:** Railway provides a dashboard view of your HPA and its scaling activity.

**b) Manual Configuration (For Advanced Users):**

* **Railway UI:** Navigate to your deployment, go to the "Scaling" tab.
* **HPA Settings:**  Here, you can:
    * **Choose Metric:** Select CPU, Memory, or Custom Metric.
    * **Minimum Replicas:** The minimum number of pods Railway will maintain.
    * **Maximum Replicas:** The maximum number of pods Railway will allow.
    * **Target Utilization:**  The percentage of CPU or Memory you want to maintain on average (e.g., 70% for CPU).
    * **Cooldown Period:** The duration (in seconds) after a scaling event before the HPA can scale again.


**3.  Key Configuration Parameters & Best Practices**

* **Minimum Replicas:**  Start with a reasonable minimum. A common starting point is 1 for stateless applications, but consider your application's dependencies.
* **Maximum Replicas:**  Set a realistic maximum, considering your budget and expected peak load. Don't over-scale unnecessarily.
* **Target Utilization:** This is *crucial*.
    * **CPU:** Generally, a target of 70-80% for CPU is a good starting point. However, this depends on your application's architecture. Long-running, consistently busy applications might benefit from a higher target.
    * **Memory:** Memory targets are often simpler – focus on preventing out-of-memory errors. Start with 60-80% and monitor carefully.
* **Cooldown Period:**  A shorter cooldown period makes scaling more responsive, but can also lead to more frequent oscillations.  A longer cooldown period provides stability but can delay response to traffic changes. Start with 60 seconds and adjust based on your application's behavior.
* **Custom Metrics:** If your application has specific metrics (e.g., requests per second, queue length), you can use these as scaling targets. However, this requires integration with a metrics exporter (e.g., Prometheus) that Railway can access.

**4. Monitoring & Tuning**

* **Railway's Dashboard:**  Regularly
