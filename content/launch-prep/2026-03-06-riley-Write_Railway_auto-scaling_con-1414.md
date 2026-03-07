# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-06T14:14:47.478884

## Railway Auto-Scaling Configuration Guide

This guide outlines how to configure auto-scaling for your applications on Railway, allowing your service to automatically adjust resources based on demand.  This ensures optimal performance, cost efficiency, and resilience.

**1. Understanding Railway Auto-Scaling**

Railway utilizes Kubernetes for orchestration and offers a streamlined auto-scaling experience. Here's how it works:

* **Horizontal Pod Autoscaler (HPA):**  This is the core component. It monitors your application's resource utilization (CPU, Memory, or custom metrics) and automatically adjusts the number of Pod replicas to maintain desired performance targets.
* **Scaling Limits:**  You define the minimum and maximum number of Pod replicas the HPA can scale to.
* **Metrics:** The HPA uses metrics to determine when to scale. These can be:
    * **CPU:**  The most common and often effective metric.
    * **Memory:**  Useful for applications with predictable memory usage.
    * **Custom Metrics:**  You can expose custom metrics from your application to trigger scaling based on business-specific data (e.g., number of active users, queue depth).
* **Railway’s Built-in Support:** Railway handles much of the complexity of Kubernetes autoscaling, simplifying the configuration process.


**2. Configuring Auto-Scaling on Railway**

Here’s a breakdown of the configuration process, with examples:

**Step 1: Deploy Your Application**

Deploy your application to Railway as you normally would, using either:

* **Railway CLI:** This is the recommended method for most users.
* **Railway Dashboard:**  For simpler applications or development.
* **Docker Images:**  Push your Docker image to a registry and deploy it to Railway.

**Step 2:  Access Your Service’s Configuration**

After deployment, navigate to your service within the Railway Dashboard.  You’ll see a section labeled "Configuration".

**Step 3:  Enable and Configure the HPA**

1. **Navigate to the "Scaling" Tab:** Within your service's configuration, select the "Scaling" tab.
2. **Toggle Auto-Scaling On:**  Switch the "Auto-Scaling" toggle to the "On" position.
3. **Define Scaling Limits:**
   * **Minimum Replicas:**  This is the smallest number of Pods that will always be running.  Set this based on your application’s minimum expected load.  (e.g., 1 - 3)
   * **Maximum Replicas:** This is the largest number of Pods the HPA can scale to. Set this based on your application’s peak load capacity.  (e.g., 10 - 50 or more)
4. **Choose Metrics:** Select the metric you want the HPA to monitor:
   * **CPU:**  The default and most common choice. Railway uses the CPU utilization of the Pod.
   * **Memory:** Railway uses the memory utilization of the Pod.
   * **Custom Metrics:** Click “Add Custom Metric” to specify a metric name and the interval at which Railway will collect it (usually every 1-5 minutes). You’ll need to provide the metric value (e.g., a count of API requests, a queue length).  You'll also need to ensure your application exposes the metric endpoint correctly.

**Step 4: Save the Configuration**

Click the “Save” button to apply the changes.

**3.  Monitoring and Fine-Tuning**

* **Railway Dashboard Monitoring:** The Dashboard provides real-time metrics for your service, including CPU and memory utilization, and the number of running Pods.  You can use this to monitor the HPA’s activity.
* **Kubernetes Metrics Server:** Railway leverages the
