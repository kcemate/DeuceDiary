# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-05T00:24:52.021018

## Railway Auto-Scaling Configuration Guide

This guide outlines how to configure auto-scaling for your applications running on Railway, allowing your service to dynamically adjust resources based on demand.  Effective auto-scaling ensures optimal performance, reduces costs, and provides a better user experience.

**1. Understanding Railway Auto-Scaling**

* **Automatic Scaling:** Railway leverages Kubernetes as its core orchestration system, allowing it to automatically scale your applications based on resource utilization.
* **Metrics:** Railway monitors key metrics like CPU, memory, and network I/O for your services.
* **Scaling Policies:** You define policies that dictate how Railway responds to these metrics. These policies are the heart of your auto-scaling strategy.
* **Horizontal Pod Autoscaler (HPA):** Railway utilizes the HPA to scale the number of pods running your application based on the defined scaling policies.
* **Cost Optimization:** Auto-scaling inherently reduces costs by scaling down during periods of low demand.


**2. Configuring Auto-Scaling Policies**

Railway provides several ways to configure your auto-scaling policies:

**A. Using the Railway UI (Recommended for Beginners)**

1. **Navigate to your Service:**  In the Railway UI, go to your service and select the "Scaling" tab.
2. **Enable Auto-Scaling:** Toggle the "Auto-Scaling" switch to "On."
3. **Select Scaling Policy:** Choose one of the pre-defined scaling policies:
    * **Performance:** Based on CPU utilization - ideal for most applications.
    * **Memory:** Based on memory utilization - suitable for memory-intensive applications.
    * **Custom:**  Allows you to define a custom scaling policy based on other metrics.
4. **Configure Parameters:**
    * **Minimum Replicas:**  The minimum number of pods Railway will always maintain. (Recommended: 1)
    * **Maximum Replicas:**  The maximum number of pods Railway will scale to.
    * **Scale Down Threshold:**  The percentage of CPU/Memory utilization that triggers scaling down. (e.g., 70% for CPU)
    * **Scale Up Threshold:**  The percentage of CPU/Memory utilization that triggers scaling up. (e.g., 80% for CPU)
    * **Cooldown Period:**  The duration (in seconds) during which Railway will not trigger another scaling event after a previous scaling action. (This prevents rapid, fluctuating scaling.)
5. **Save Changes:** Click "Save" to apply your configuration.

**B. Using CLI (For Advanced Users)**

* **`railway scale --policy <policy-name>`:** This command enables auto-scaling for your service and applies the default scaling policy.
* **`railway scale --policy <policy-name> --min <min-replicas> --max <max-replicas> --scale-down-threshold <threshold>`:** This command allows you to customize the scaling policy, minimum replicas, maximum replicas, and the scale down threshold.

**Example (CLI):**

```bash
railway scale --policy performance --min 1 --max 5 --scale-down-threshold 70
```

This example enables auto-scaling with the "performance" policy, sets the minimum and maximum replicas to 1 and 5, and defines the scale down threshold to 70% for CPU utilization.



**3. Choosing the Right Scaling Policy**

* **Performance:** Suitable for general-purpose applications, web servers, and APIs. It's a good starting point.
* **Memory:**  Better for applications with high memory usage, like databases or caching layers.
* **Custom:** Provides the most flexibility.  You can use other metrics (like network I/O, request latency, etc.) and implement complex scaling rules.  This
