# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-03T13:26:55.615610

## Railway Auto-Scaling Configuration Guide

This guide outlines how to configure auto-scaling for your applications deployed on Railway. Auto-scaling automatically adjusts the number of instances running your application based on demand, ensuring optimal performance and cost efficiency.

**1. Understanding Railway's Auto-Scaling**

* **Dynamic Scaling:** Railway utilizes a dynamic scaling model. This means it automatically scales your application up or down based on metrics like CPU usage, memory usage, and network traffic.
* **Scaling Groups:**  Railway manages scaling groups, which are collections of instances that run your application.
* **Metrics:** Railway monitors various metrics to determine scaling decisions. Key metrics include:
    * **CPU Utilization:** Percentage of CPU time being used.
    * **Memory Utilization:** Percentage of RAM being used.
    * **Network Traffic:** Incoming and outgoing network data.
    * **Response Time:**  How long it takes for your application to respond to requests.
    * **Queue Length (for Queue-Based Services):**  Number of messages waiting in queues.
* **Scaling Policies:** You define scaling policies that tell Railway *how* to scale. Railway then automatically executes these policies based on the monitored metrics.
* **Cooldown Periods:**  After a scaling event, Railway applies a cooldown period to prevent constant oscillations and ensure stability.

**2. Configuring Auto-Scaling Policies**

Railway offers several ways to configure auto-scaling policies:

**a) Railway UI - Quick & Simple:**

* **Go to your App's Scaling Settings:**  Navigate to your app within the Railway UI and click the "Scaling" tab.
* **Choose a Policy:**
    * **Automatic (Recommended):** Railway automatically determines the best scaling policy based on your application's monitoring.  This is the default and usually works very well.
    * **Custom:**  Allows you to define specific scaling rules using thresholds and adjustments. This offers more control but requires careful configuration to avoid instability.
* **Adjust Thresholds & Limits (Custom Policies Only):**
    * **Minimum Instances:** The smallest number of instances Railway will maintain.  Crucial for handling initial requests and ensuring availability.
    * **Maximum Instances:** The largest number of instances Railway will scale to.  This prevents runaway costs.
    * **CPU Threshold:** The percentage of CPU utilization that triggers a scaling event (e.g., increase if above 70%, decrease if below 30%).
    * **Memory Threshold:**  Similar to CPU, defines memory utilization thresholds.
    * **Cooldown Period:**  The duration (in seconds/minutes) after a scaling event before Railway can make another scaling decision.  Longer cooldown periods promote stability.

**b)  Railway CLI - Advanced Control:**

* **Install Railway CLI:** Ensure you have the Railway CLI installed and authenticated.
* **Set Scaling Policy:**
   ```bash
   railway scale --policy <policy_name> <app_name>
   ```
   * Replace `<policy_name>` with the desired policy (e.g., "automatic", "custom").
   * Replace `<app_name>` with the name of your Railway app.

**c)  Railway API - Programmatic Scaling:**

* Utilize the Railway API to manage scaling policies programmatically, allowing for integration with CI/CD pipelines and automated monitoring.  (Refer to Railway's API documentation for details).



**3.  Best Practices for Auto-Scaling**

* **Start with Automatic:** Begin with the "Automatic" scaling policy. It's often the most effective and requires minimal configuration.
* **Set Realistic Limits:**  Determine appropriate `Minimum` and `Maximum` instance counts based on your application's expected traffic patterns.
* **Monitor Key Metrics:**  Regularly observe the metrics Railway is using to make scaling decisions
