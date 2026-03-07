# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-04T06:03:24.196632

## Railway Auto-Scaling Configuration Guide

This guide outlines how to configure auto-scaling for your applications deployed on Railway, enabling your service to automatically adjust its resources based on demand.  Railway’s auto-scaling is a powerful feature that can significantly improve performance, reduce costs, and ensure your application remains responsive even during traffic spikes.

**1. Understanding Railway's Auto-Scaling**

* **Horizontal Scaling:** Railway's auto-scaling focuses on horizontal scaling – adding more instances of your application instead of increasing the resources on a single instance.
* **Metric-Driven:**  It leverages metrics like CPU utilization, memory usage, and request latency to determine when to scale up or down.
* **Flexible Configuration:** You can configure various scaling parameters to fine-tune the behavior to your application's specific needs.
* **Automatic Rollbacks:** Railway handles rolling back to previous versions if scaling issues arise.

**2. Prerequisites**

* **A Running Railway App:** You need an application already deployed on Railway.
* **Railway CLI Installed & Authenticated:** You’ll be using the Railway CLI to manage your app's configuration.
* **Monitoring Enabled:** Ensure you have basic monitoring enabled for your app. Railway’s default monitoring is sufficient for initial setup, but you can enhance it.

**3. Configuring Auto-Scaling via the Railway CLI**

This is the primary way to configure auto-scaling.

**Step 1: Access Auto-Scaling Settings**

Run the following command to open the auto-scaling settings for your app:

```bash
railway scale <app-name>
```

Replace `<app-name>` with the name of your Railway app.

**Step 2:  Scaling Parameters – Understanding the Options**

The CLI will guide you through several key parameters:

* **Minimum Instances:** The minimum number of instances Railway will always keep running. This ensures there's always capacity for requests.
* **Maximum Instances:**  The maximum number of instances Railway will scale up to.  Setting a reasonable maximum helps control costs.
* **Scale Trigger:** This defines when Railway will automatically scale up or down:
    * **CPU Utilization:** Scales based on the average CPU usage across all instances.
    * **Memory Utilization:** Scales based on the average memory usage.
    * **Request Latency:**  Scales based on the average response time of incoming requests.
* **Scale Thresholds:** These determine the *sensitivity* of the scaling.
    * **Low Threshold:** The point at which scaling *up* will be triggered.
    * **High Threshold:** The point at which scaling *down* will be triggered.
* **Cooldown Period:**  The amount of time (in seconds) Railway will wait after a scaling event before considering another one.  This prevents rapid, unnecessary scaling.
* **Instance Type:**  The type of Railway instance to use (e.g., `railway.io/cloud-amd-s4-1`, `railway.io/cloud-gpu-g5-xl`).  Choosing the right instance type impacts cost and performance.

**Step 3:  Setting the Parameters**

The CLI will prompt you to enter values for each of the above parameters.  Here’s a suggested starting point and considerations:

* **Minimum Instances:**  Start with 1 or 2.  If your app is frequently busy even during low traffic, increase this to 3 or 4.
* **Maximum Instances:**  Based on your anticipated peak load and budget, choose a reasonable number.  Start with 10-20 and monitor.
* **Scale Trigger:** Choose the trigger that best reflects your application’s behavior.  For many web applications, `Request Latency` is a good starting point.
* **Scale Thresholds:**
