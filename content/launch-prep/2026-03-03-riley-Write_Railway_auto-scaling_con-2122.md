# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-03T21:22:21.049050

## Railway Auto-Scaling Configuration Guide

This guide outlines how to configure auto-scaling for your applications on Railway, allowing your services to dynamically adjust resources based on demand, optimizing costs and ensuring performance.

**1. Understanding Railway's Auto-Scaling Capabilities**

* **Automatic Scaling:** Railway automatically scales your services based on metrics like CPU usage, memory usage, and request latency.
* **Horizontal Scaling:** Railway primarily focuses on horizontal scaling – adding more instances of your service to handle increased load.
* **Base Instances:** You define a minimum number of instances (the “base”) that will always be running, providing a baseline level of performance.
* **Scale Limits:** You set maximum limits for the number of instances Railway can scale up to.
* **Metrics-Driven:** Scaling decisions are based on specific metrics you configure.
* **Cost-Aware:** Railway strives to scale efficiently to minimize costs, scaling down during periods of low traffic.

**2. Configuring Auto-Scaling**

There are two main ways to configure auto-scaling on Railway:

**a) Through the Railway UI (Recommended for Beginners)**

1. **Select Your Service:** In the Railway UI, navigate to the service you want to scale.
2. **Go to the “Scaling” Tab:** You'll find the “Scaling” tab within the service's settings.
3. **Set Scaling Parameters:**
   * **Base Instances:** Enter the minimum number of instances you want to keep running. This is generally a good starting point, often 1.
   * **Scale Limits:** Set the upper and lower bounds for the number of instances. Think about your expected peak load.  A common starting point might be:
      * **Maximum:**  5 - 10 instances (depending on your service's needs)
      * **Minimum:** 1 instance
   * **Scaling Metrics:** This is *crucial*.  Choose the metrics Railway will monitor to trigger scaling:
      * **CPU Utilization:**  Scaling up if CPU usage exceeds a threshold.
      * **Memory Utilization:** Scaling up if memory usage exceeds a threshold.
      * **Request Latency:** Scaling up if the average request latency exceeds a threshold (ideal for latency-sensitive applications).
   * **Scale Thresholds:** Define the percentage thresholds that trigger scaling actions. For example:
      * **CPU Utilization:**  80% - 95% might trigger scaling up.
      * **Request Latency:**  500ms - 1s might trigger scaling up.
   * **Cooldown Period:** Set the duration (in seconds) after a scaling event to prevent rapid, unnecessary scaling.  A cooldown period of 60-120 seconds is usually a good starting point.
4. **Save Changes:** Click “Save” to apply the scaling configuration.

**b) Using Railway CLI (For Advanced Users & Automation)**

The Railway CLI allows you to define scaling configurations in your infrastructure-as-code.

1. **Install Railway CLI:**  If you haven't already, install the Railway CLI.
2. **Use the `railway scale` command:**
   ```bash
   railway scale <service-name> --base <base-instances> --max <max-instances> --min <min-instances> --metrics <metric1>,<metric2> --thresholds <threshold1:threshold2> --cooldown <cooldown-seconds>
   ```
   * Replace `<service-name>`, `<base-instances>`, `<max-instances>`, `<min-instances>`, `<metric1>`, `<metric2>`, `<threshold1:threshold2>`, and `<cooldown-seconds>` with your desired values.

   **Example:**
   ```bash
   railway scale my-app --base 1 --max
