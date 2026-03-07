# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-07T12:14:12.405502

## Railway Auto-Scaling Configuration Guide

This guide outlines how to configure auto-scaling for your applications deployed on Railway, ensuring your application can handle varying traffic loads and maintain optimal performance.

**1. Understanding Railway Auto-Scaling**

Railway utilizes a combination of metrics and scaling policies to automatically adjust the resources allocated to your services. Here's the breakdown:

* **Metric-Based Scaling:** Railway monitors various metrics provided by your service, such as:
    * **CPU Utilization:** Percentage of CPU being used.
    * **Memory Utilization:** Percentage of RAM being used.
    * **Request Latency:** Time taken to process requests.
    * **Queue Length:**  Number of requests waiting to be processed (for queues).
* **Scaling Policies:** These define how Railway responds to changes in the monitored metrics. Railway offers three types of scaling policies:
    * **Threshold-Based Scaling:** Scale based on reaching a defined threshold (e.g., "Scale up if CPU utilization exceeds 70%"). This is the most common and recommended type.
    * **Rate-Based Scaling:** Scale based on the rate of change in the metric (e.g., "Scale up if CPU utilization increases by 10% over 5 minutes"). Useful for reacting to sudden spikes.
    * **Scheduled Scaling:** Scale based on a predefined schedule (e.g., "Scale up during peak hours from 9 AM to 5 PM").


**2. Configuring Auto-Scaling in the Railway Dashboard**

Here's how to configure auto-scaling for your service:

1. **Navigate to Your Service:**  Go to the Railway dashboard and select the service you want to configure.

2. **Go to the "Scaling" Tab:** Within your service's settings, you'll find a “Scaling” tab.

3. **Add a Scaling Policy:** Click the “Add Scaling Policy” button. You'll be presented with the following options:

   * **Policy Name:** Give your policy a descriptive name (e.g., "CPU High Scaling").
   * **Metric:** Select the metric you want to monitor (CPU, Memory, Request Latency, Queue Length).
   * **Unit:** Choose the appropriate unit for the metric (Percentage, Milliseconds, etc.).
   * **Threshold:** Define the threshold value. This is the point at which scaling will occur.  
      * **For Threshold-Based:**  Specify the threshold percentage.
      * **For Rate-Based:**  Define the rate of change (e.g., “10%”, “5 requests/second”).
   * **Scaling Action:**  Choose what should happen when the threshold is reached:
       * **Scale Up:** Increase the number of replicas.
       * **Scale Down:** Decrease the number of replicas.
       * **Scale None:** No scaling action.
   * **Cooldown Period:** (Important!)  This determines how long Railway waits *after* a scaling action is completed before considering another scaling action. This prevents rapid scaling up and down due to minor fluctuations. Recommended starting point: 60 seconds. Adjust as needed based on your application's behavior.
   * **Target:** (Optional) Specify a precise target number of replicas.  If not specified, Railway will adjust based on the scaling policy and the configured threshold.

4. **Save the Policy:** Once you've configured the scaling policy, save it.

5. **Monitor and Adjust:** Railway will continuously monitor your service and automatically adjust the resources.  Regularly review the scaling logs and adjust your scaling policies as your application's needs evolve.



**3. Best Practices for Auto-Scaling**

* **Start with a Baseline:** Initially, configure a conservative scaling policy. Don’t set extremely aggressive thresholds.
* **Monitor Scaling Logs
