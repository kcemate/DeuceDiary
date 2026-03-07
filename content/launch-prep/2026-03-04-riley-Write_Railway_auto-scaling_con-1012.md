# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-04T10:12:53.352001

## Railway Auto-Scaling Configuration Guide

This guide outlines how to configure auto-scaling for your applications deployed on Railway, maximizing resource utilization and ensuring your application remains responsive under fluctuating traffic.

**Understanding Railway’s Auto-Scaling**

Railway leverages Kubernetes under the hood to provide a managed auto-scaling solution. It automatically scales your deployments based on metrics like CPU usage, memory usage, and network traffic.  Railway’s auto-scaling is generally quite intelligent and works well out-of-the-box, but understanding how to tune it for optimal performance is key.

**1. Key Concepts & Metrics**

* **Scaling Policies:** These are rules that dictate how Railway reacts to changes in metrics.  Railway provides a set of pre-defined scaling policies, and you can customize them.
* **Metrics:** Railway monitors your application using metrics from Prometheus. Key metrics include:
    * **CPU Usage:** Represents the percentage of CPU being utilized.
    * **Memory Usage:** Represents the amount of RAM being used.
    * **Network Traffic:** Measures the amount of data being sent and received.
    * **Request Rate:** Number of requests received per second.
    * **Error Rate:** Percentage of requests resulting in errors.
* **Horizontal Pod Autoscaler (HPA):**  This is the underlying Kubernetes component that performs the scaling. Railway manages the HPA settings for you.
* **Minimum Instances:** The minimum number of instances of your application that Railway will always keep running.
* **Maximum Instances:** The maximum number of instances Railway will scale your application to.
* **Scale-Down Threshold:** The metric value that triggers a scaling event.  Lower values lead to more responsive scaling.
* **Scale-Up Threshold:** The metric value that triggers a scaling event.  Higher values lead to more aggressive scaling.

**2. Configuring Auto-Scaling on Railway**

There are several ways to configure auto-scaling on Railway:

**a) Through the Railway UI (Recommended)**

This is the easiest and most common way to configure auto-scaling.

1. **Navigate to your App:** Select your application from your Railway dashboard.
2. **Go to "Scaling":** In the app's settings, click on the "Scaling" tab.
3. **Adjust Parameters:** You’ll see a set of configurable options:
   * **Minimum Instances:**  Set the minimum number of instances you want to always run. A good starting point is 1, but if your app has dependencies that require multiple instances, increase it.
   * **Maximum Instances:**  Set the maximum number of instances your app can scale to. This prevents runaway scaling and potential cost overruns. Consider the resources available in your Railway plan.
   * **Scale-Down Threshold:**  This is a crucial setting.  A lower threshold (e.g., 70% CPU) will cause Railway to scale down more aggressively when load decreases. A higher threshold (e.g., 90% CPU) will result in slower scaling down.
   * **Scale-Up Threshold:**  Similar to Scale-Down Threshold, this determines when Railway will increase the number of instances.
   * **Metric:**  Choose the metric you want Railway to use for scaling.  CPU and Request Rate are commonly used.
   * **Cooldown:**  This specifies how long Railway waits after a scaling event (up or down) before considering another scaling decision. A longer cooldown prevents rapid, oscillating scaling.

4. **Save Changes:**  Railway automatically applies the changes.  It may take a few minutes for the changes to take effect.

**b) Using the Railway CLI (Advanced)**

The CLI allows for more granular control and automation.

1. **Install the Railway CLI:**  Follow the instructions on the Railway website: [https://railway.app
