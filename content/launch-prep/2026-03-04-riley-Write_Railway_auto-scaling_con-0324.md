# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-04T03:24:41.588598

## Railway Auto-Scaling Configuration Guide

This guide outlines how to configure auto-scaling for your applications on Railway, allowing your service to automatically adjust resources based on demand, optimizing cost and performance.

**Understanding Railway Auto-Scaling**

Railway leverages Kubernetes under the hood. Its auto-scaling capabilities are based on Kubernetes Horizontal Pod Autoscaler (HPA), enabling it to automatically scale your deployments based on metrics like CPU utilization, memory usage, or custom metrics.

**1. Prerequisites:**

* **Railway Account:** You'll need an active Railway account.
* **Deployed Application:** Your application needs to be deployed to Railway.
* **Metric Source:** You need to define a metric source for the HPA to monitor. Railway provides several built-in sources, or you can integrate with external monitoring services.

**2. Configuring Auto-Scaling:**

There are several ways to configure auto-scaling on Railway:

**a) Using the Railway UI (Recommended for Beginners):**

1. **Navigate to your Service:** In the Railway UI, go to your deployed service.
2. **Go to the "Scaling" Tab:** Select the “Scaling” tab within your service’s overview.
3. **Select Scaling Method:**
   * **Metric-Based Scaling (HPA):** This is the most common method. Choose this option and configure the following:
      * **Metric:** Select the metric you want to use for scaling (e.g., CPU, Memory, Custom Metrics).
      * **Target Utilization:** Set the desired utilization percentage (e.g., 70% CPU). This defines the upper limit of CPU usage before scaling up.
      * **Scale Interval:**  How often Railway checks the metric and adjusts the scaling (e.g., every 30 seconds).
      * **Minimum Instances:** The smallest number of instances you want to maintain, even if there's low traffic.
      * **Maximum Instances:** The maximum number of instances you want to scale to.
4. **Save Changes:** Click “Save” to apply the scaling configuration.

**b) Using Railway CLI (For Advanced Users & Automation):**

1. **Install Railway CLI:**  Ensure you have the Railway CLI installed and configured.
2. **Scale Command:** Use the `rail scale` command with the appropriate flags:

   ```bash
   rail scale --metric cpu --target 70 --min 1 --max 10
   ```

   * `--metric`: Specifies the metric to use (e.g., `cpu`, `memory`, `custom`).
   * `--target`: Sets the target utilization percentage.
   * `--min`: Sets the minimum number of instances.
   * `--max`: Sets the maximum number of instances.
   * `--interval`:  Specifies the scale interval in seconds (e.g., `--interval 30`).  Railway uses a default interval if not specified.


**c)  Using Custom Metrics (Advanced):**

For more granular control, you can use custom metrics. This requires you to expose a metric endpoint on your application.

1. **Implement Metric Endpoint:** Modify your application to expose an endpoint that returns a metric (e.g., number of requests, queue depth). This endpoint should be served by a service that is part of your deployment.
2. **Configure Railway to Monitor the Endpoint:**  In the Railway UI, configure the "Scaling" tab to monitor this custom metric endpoint using the "Custom Metrics" option.  You'll need to specify the URL of the endpoint.

**3.  Choosing the Right Metrics:**

* **CPU Utilization:** A good general indicator of workload.
* **Memory Usage:**  Useful if your application is memory-intensive.
* **Request Rate:**  Suitable for applications with predictable traffic patterns.
