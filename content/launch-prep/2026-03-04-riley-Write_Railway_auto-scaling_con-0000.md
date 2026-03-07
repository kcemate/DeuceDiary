# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-04T00:00:47.706023

## Railway Auto-Scaling Configuration Guide

This guide outlines how to configure auto-scaling for your applications deployed on Railway, leveraging the platform's built-in capabilities and best practices. Auto-scaling ensures your application handles fluctuating traffic efficiently, maximizing performance and minimizing costs.

**1. Understanding Railway's Auto-Scaling**

* **Automatic Scaling:** Railway automatically adjusts the number of instances of your app based on real-time traffic.
* **Multiple Scaling Policies:** You have control over how scaling is triggered, using configurable metrics and thresholds.
* **Cost Optimization:**  Scaling down during periods of low activity helps you reduce unnecessary resource consumption and costs.
* **Built-in Metrics:** Railway monitors standard metrics like CPU usage, memory usage, and network traffic to trigger scaling events.
* **Scaling Granularity:** Railway typically scales in increments of 1 instance per process, offering a balance between responsiveness and cost-effectiveness.

**2. Key Configuration Settings**

Here's a breakdown of the settings you'll typically adjust within the Railway dashboard for auto-scaling:

* **Scaling Trigger:** This determines when scaling occurs.  Railway offers the following options:
    * **CPU Usage:** Scale based on the average CPU utilization of the application.  This is the most common and recommended trigger.
    * **Memory Usage:** Scale based on the average memory utilization of the application.
    * **Network Traffic:** Scale based on the average network traffic entering the application. (Suitable for I/O intensive applications)
* **Scaling Thresholds:** These define the tolerance levels for each metric.
    * **Minimum Threshold:**  The percentage of CPU, memory, or network traffic below which scaling is *not* triggered. (e.g., 50% CPU – scaling won’t happen until CPU usage exceeds 50%)
    * **Maximum Threshold:** The percentage of CPU, memory, or network traffic above which scaling is triggered. (e.g., 90% CPU – scaling will trigger when CPU usage exceeds 90%)
* **Scale Increment:** The number of new instances added or removed upon triggering a scaling event. Railway typically defaults to 1 per process, which is often optimal.  Adjusting this can impact response times, especially during large scale events.
* **Cooldown Period:** This prevents rapid scaling fluctuations. It dictates the time (in seconds) after a scaling event before Railway can trigger another scaling event of the same type.  A good starting point is 60 seconds.
* **Health Checks:**  Railway uses health checks to monitor the health of your application instances. Configure these to ensure scaling only happens for healthy instances.

**3. Configuring Auto-Scaling in the Railway Dashboard**

1. **Navigate to your App:**  In the Railway dashboard, select the application you want to configure.
2. **Go to 'Scaling':** Click on the "Scaling" tab within your application settings.
3. **Choose a Scaling Trigger:**  Select the metric you want to use for scaling (CPU, Memory, or Network).
4. **Set Thresholds:**  Enter the Minimum and Maximum Threshold percentages as desired.
5. **Adjust Increment:**  Modify the Scale Increment if needed (start with 1).
6. **Configure Cooldown:** Set the Cooldown Period (start with 60 seconds).
7. **Check Health Checks:**  Verify your application's health check configuration is correct.
8. **Save Changes:** Click "Save" to apply your auto-scaling settings.


**4. Monitoring and Adjustments**

* **Scaling Dashboard:** Railway provides a dedicated scaling dashboard showing the current state of your application's scaling activity (number of instances, scaling events, metrics).
* **Logs:**  Review the application logs to identify potential scaling issues or bottlenecks.
* **Experiment
