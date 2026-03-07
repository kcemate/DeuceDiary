# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-04T10:58:17.267807

## Railway Auto-Scaling Configuration Guide

This guide outlines how to configure auto-scaling for your applications running on Railway, ensuring your services maintain optimal performance and cost-efficiency as demand fluctuates.

**Understanding Railway Auto-Scaling**

Railway automatically scales your services based on metrics you choose to monitor.  It's designed to be relatively hands-off, but understanding the configuration options will help you fine-tune the scaling behavior and maximize its effectiveness.

**1. Key Concepts**

* **Metrics:** Railway monitors your service's performance using various metrics. The most common and recommended are:
    * **Requests:**  The number of incoming HTTP requests. This is often the best indicator for scaling web applications.
    * **CPU Usage:**  The percentage of CPU being utilized by your service. Useful for services with CPU-intensive tasks.
    * **Memory Usage:** The amount of RAM being consumed by your service. Essential for memory-bound applications.
    * **Network I/O:**  The amount of data being sent and received by your service. Useful for services with significant network traffic.
* **Scaling Triggers:** These are the thresholds that determine when Railway should scale your service. You can configure scaling triggers for:
    * **Minimum Size:**  The smallest number of instances Railway will maintain.  This ensures a baseline level of performance and responsiveness.
    * **Maximum Size:** The largest number of instances Railway will allow. This controls costs and prevents resource exhaustion.
    * **Scale Interval:** The frequency (in seconds) at which Railway checks the metrics and adjusts the number of instances. Shorter intervals lead to more responsive scaling.
* **Cool Down:**  Railway has a cool-down period after a scaling event to prevent rapid, unnecessary scaling actions.

**2. Configuring Auto-Scaling**

You can configure auto-scaling through the Railway Dashboard:

**Step-by-Step:**

1. **Navigate to Your Service:**  In the Railway Dashboard, select the service you want to configure.
2. **Go to the "Scaling" Tab:** Click on the "Scaling" tab within your service's settings.
3. **Set Scaling Triggers:** This is the core of your configuration.  You'll see the following options:
    * **Minimum Size:** Enter the desired minimum number of instances for your service (e.g., 1, 2, 3).  Start with a low value to reduce costs during periods of low traffic.
    * **Maximum Size:** Enter the maximum number of instances Railway is allowed to create (e.g., 10, 20, 50). Be mindful of your application's resource requirements and your budget.
    * **Scale Interval:**  Choose the interval at which Railway will check metrics for scaling (e.g., 60, 120, 300 seconds).  A shorter interval provides faster response to changes in demand, but may increase costs.
4. **Select Metrics:**  Choose the metrics you want to trigger scaling.  For web applications, **Requests** is highly recommended. For CPU-intensive tasks, consider **CPU Usage**.
5. **Configure Cool Down:**  The cool-down period determines how long Railway waits after a scaling event before considering another scaling action.  A longer cool-down period is generally recommended to reduce unnecessary scaling.  Railway defaults to a 300 second cool-down.
6. **Save Changes:** Click "Save" to apply your configuration.


**3. Example Configurations**

* **Simple Web Application (Low Traffic):**
    * Minimum Size: 1
    * Maximum Size: 3
    * Scale Interval: 60 seconds
    * Metrics: Requests
    * Cool Down: 300 seconds
* **High
