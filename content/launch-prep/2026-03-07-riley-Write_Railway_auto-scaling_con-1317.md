# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-07T13:17:35.418247

## Railway Auto-Scaling Configuration Guide

This guide outlines how to configure auto-scaling for your Railway applications, allowing them to automatically adjust resources based on demand, optimizing performance and cost.

**1. Understanding Railway's Auto-Scaling**

* **Dynamic Scaling:** Railway utilizes dynamic scaling, meaning it automatically adjusts your application's resources in real-time based on metrics like CPU usage, memory consumption, and request latency.
* **Scaling Groups:** Railway organizes auto-scaling by "Scaling Groups."  A Scaling Group contains one or more application instances that will be dynamically scaled.
* **Metrics:** Railway monitors key metrics to trigger scaling events. These commonly include:
    * **CPU Utilization:**  Percentage of CPU used by the application.
    * **Memory Utilization:** Percentage of RAM used by the application.
    * **Request Latency:** The time it takes for your application to respond to requests.
    * **Queue Length (if applicable):**  The number of messages waiting in a queue.
* **Scaling Policies:**  You define how Railway responds to these metrics, setting thresholds and scaling directions (scale-up or scale-down).

**2. Configuring Auto-Scaling in Railway**

There are a few ways to configure auto-scaling for your applications on Railway:

**a) Through the Railway UI (Recommended)**

This is the simplest and most user-friendly method:

1. **Navigate to your App:** Go to the Railway dashboard and select your application.
2. **Go to the "Scaling" Tab:** Click on the "Scaling" tab within your application's settings.
3. **Create a Scaling Group:**
    * **Name:** Give your Scaling Group a descriptive name.
    * **Application:** Select the application you want to scale.
    * **Scaling Policy:**  This is the core of your auto-scaling configuration.
        * **Minimum Instances:** The smallest number of instances the Scaling Group will always maintain.
        * **Maximum Instances:** The largest number of instances the Scaling Group will ever reach.
        * **CPU Utilization Threshold:** The CPU percentage at which Railway will start scaling up. (e.g., 70%)
        * **Memory Utilization Threshold:** The Memory percentage at which Railway will start scaling up. (e.g., 80%)
        * **Request Latency Threshold:** The maximum acceptable latency in milliseconds.  (e.g., 500ms)
        * **Scale-Up Policy:**  How Railway should scale up when a threshold is exceeded:
            * **Immediate:**  Instantly adds new instances.
            * **Delay:**  Adds instances after a specified delay (e.g., 15 seconds).
        * **Scale-Down Policy:** How Railway should scale down when a threshold is below:
            * **Immediate:** Immediately removes instances.
            * **Delay:** Removes instances after a specified delay.
4. **Save:** Click "Save" to apply your scaling configuration.

**b) Using the Railway CLI**

The CLI offers more granular control and is suitable for scripting and automation:

```bash
# Create a scaling group
railway scale create --app <app-name> --name <scaling-group-name> \
  --min 1 --max 3 --cpu-threshold 70 --memory-threshold 80 --latency-threshold 500 \
  --scale-up-delay 15 --scale-down-delay 30

#  Example:
# railway scale create --app my-app --name my-app-scaling --min 1 --max 3 --cpu-threshold 70 --memory-threshold 80 --latency-threshold 500 --scale-up-delay 15 --scale
