# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-04T13:14:20.338853

## Railway Auto-Scaling Configuration Guide

This guide outlines how to configure auto-scaling for your applications deployed on Railway, allowing your application to automatically adjust its resources based on demand. Railway offers a robust and relatively simple auto-scaling solution, focusing on ease of use and cost optimization.

**1. Understanding Railway's Auto-Scaling:**

* **Dynamic Scaling:** Railway automatically scales your services up or down based on metrics like CPU utilization, memory usage, and network traffic.
* **Horizontal Scaling:** Primarily uses horizontal scaling, meaning adding or removing instances of your service.
* **Threshold-Based:** Scaling is triggered when a service reaches a specified resource utilization threshold.
* **Rollback:** Railway automatically rolls back to the previous configuration if an auto-scale operation fails.
* **Cost Optimization:** Auto-scaling helps prevent over-provisioning, leading to lower costs.

**2. Configuration Steps in the Railway UI:**

1. **Select Your Service:** Navigate to your service within the Railway UI.

2. **Access the “Scaling” Tab:**  Click on the "Scaling" tab within your service's settings. You'll find this typically in the main settings panel.

3. **Enable Auto-Scaling:** Toggle the "Auto-scale" switch to "Enabled."

4. **Configure Scaling Parameters:** This is the core of the configuration. You'll see the following options:

   * **Minimum Instances:** The smallest number of instances Railway will maintain for your service.  This ensures a baseline level of availability.  Start with a value that suits your application's typical load.  **Recommendation:** Start with 1 instance.
   * **Maximum Instances:** The largest number of instances Railway will allow your service to scale up to.  This is a crucial setting as it impacts your cost.  **Recommendation:** Start with 10-20 instances and adjust based on performance.
   * **Scaling Interval:**  How frequently Railway checks the service’s resource utilization. The default is 1 minute.  Shorter intervals mean more frequent adjustments, which can impact cost (due to the overhead of scaling) and potentially increase latency slightly.  **Recommendation:**  Start with the default (1 minute) and adjust if necessary.
   * **Metric:**  The metric Railway uses to determine scaling.  Common options include:
      * **CPU Utilization:** The most common and generally best option for many applications.
      * **Memory Utilization:** Useful for applications with memory-intensive workloads.
      * **Network Traffic:**  Useful for applications that are heavily network-dependent.  Consider this if CPU/Memory utilization isn't the best indicator.
   * **Scale Threshold (CPU/Memory):** The percentage of the selected metric that triggers scaling. For example, if you set the metric to CPU utilization and the threshold to 70%, the service will scale up when CPU utilization reaches 70% and scale down when it drops below 70%.  **Recommendation:**  Start with 70% or 80% – this provides a buffer.
   * **Cooldown Period:** (Optional) This specifies how long Railway waits after a scale-up or scale-down event before considering another scaling action.  This prevents rapid, unnecessary scaling due to temporary spikes. **Recommendation:** Start with 300 seconds (5 minutes) and adjust based on your application’s responsiveness.

5. **Save Changes:** Click "Save" to apply your configuration.

**3. Monitoring & Adjustments:**

* **Railway Dashboard:**  The Railway dashboard provides real-time visualizations of your service’s resource utilization (CPU, memory, network).
* **Scaling Events:** Railway logs all scaling events in your service's logs. Review these logs to understand why scaling is occurring and if the configuration is appropriate.
*
