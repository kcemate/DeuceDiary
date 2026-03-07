# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-03T10:25:39.722128

## Railway Auto-Scaling Configuration Guide

This guide outlines how to effectively configure auto-scaling for your applications deployed on Railway. Railway offers a robust auto-scaling solution that automatically adjusts the resources allocated to your services based on demand, optimizing cost and ensuring performance.

**1. Understanding Railway's Auto-Scaling**

* **Automatic Scaling:** Railway automatically adjusts the number of instances of your services based on metrics like CPU utilization, memory usage, and request latency.
* **Minimum & Maximum Instances:** You define a minimum and maximum number of instances for each service. Railway will maintain the service within this range.
* **Scaling Events:** Scaling events are triggered by increases or decreases in demand. Railway monitors these events and scales accordingly.
* **Cost Optimization:** By scaling up and down dynamically, you minimize wasted resources and optimize your costs.
* **Metrics Used:** Railway primarily uses CPU utilization, memory usage, and request latency to determine scaling events.  Other metrics like database connections or queue sizes can be configured (see section 3).

**2. Configuring Auto-Scaling in Railway**

There are two primary ways to configure auto-scaling:

**a) Through the Railway UI:** (Recommended for most users)

1. **Navigate to Your Service:** In the Railway dashboard, select the service you want to configure.
2. **Go to the "Scaling" Tab:**  Click on the "Scaling" tab within your service's settings.
3. **Configure Minimum and Maximum Instances:**
   * **Minimum Instances:**  Set the minimum number of instances you want Railway to always keep running.  A higher minimum reduces cold start latency but increases costs.
   * **Maximum Instances:** Set the maximum number of instances Railway can scale up to.  Consider your expected peak traffic and budget.
4. **Click "Save Changes":** Railway will immediately begin adjusting the number of instances.
5. **Monitor Scaling:** You can track the scaling activity in the "Scaling" tab and in the service's metrics dashboard.


**b) Using the Railway CLI:** (For automation and advanced users)

* **`railway scale <service_name> --min <min_instances> --max <max_instances>`:**  This command scales your service.
   * `<service_name>`: The name of the service you want to scale.
   * `<min_instances>`: The minimum number of instances.
   * `<max_instances>`: The maximum number of instances.

   Example: `railway scale my-api --min 1 --max 5`

* **`railway metrics`:**  Use this command to monitor the metrics that trigger scaling events.



**3. Advanced Scaling Configuration (Custom Metrics & Scaling Policies)**

Railway offers more granular control through custom metrics and scaling policies.

* **Custom Metrics:** You can define custom metrics that trigger scaling events. This is useful for services that rely on metrics other than CPU/memory, such as:
    * **Database Connections:**  Scale up when the number of active database connections exceeds a threshold.
    * **Queue Length:** Scale up when the length of a message queue exceeds a threshold.
    * **Custom Application Metrics:**  Implement a mechanism to expose application-specific metrics to Railway.  This often involves instrumentation within your application code.
    * **How to Configure:**
      * Navigate to your service in the Railway UI.
      * Go to the “Scaling” tab.
      *  Select "Custom Metrics"
      *  Add the metric name and a scaling policy.

* **Scaling Policies (Advanced):**  Customize how Railway reacts to scaling events.
   * **Linear:** Scale up or down proportionally with the change in the metric.
   * **Exponential:** Scale up or down exponentially, allowing for faster response to changes
