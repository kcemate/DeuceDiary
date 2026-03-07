# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-05T20:38:55.095784

## Railway Auto-Scaling Configuration Guide - Scaling Your Applications

This guide outlines how to configure auto-scaling for your applications deployed on Railway, allowing your services to dynamically adjust resources based on demand.  This will ensure optimal performance and cost efficiency, especially as your user base grows.

**1. Understanding Railway Auto-Scaling**

* **Automatic Scaling:** Railway automatically monitors your application's CPU, memory, and network usage. Based on predefined metrics and thresholds, it adds or removes instances to maintain desired performance levels.
* **Two Primary Scaling Methods:**
    * **CPU-Based Scaling:**  Scales based on overall CPU utilization across all instances.  This is the simplest and most common method.
    * **Memory-Based Scaling:** Scales based on total memory consumption.  This can be more cost-effective if your application is memory-bound.
* **Scaling Groups:** Railway organizes instances into scaling groups. You can define scaling groups with specific configurations, including scaling policies.
* **Monitoring & Metrics:** Railway provides detailed metrics through the Railway UI and the Railway CLI, enabling you to observe scaling activity and fine-tune your configuration.


**2. Configuring Auto-Scaling in the Railway UI**

This is the easiest way to set up auto-scaling.

* **Navigate to Your App:** Open your application in the Railway UI.
* **Go to Scaling:** Click the "Scaling" tab.
* **Enable Auto-Scaling:** Toggle the "Enable Auto-Scaling" switch to `ON`.
* **Choose Scaling Metric:** Select `CPU` or `Memory` as the scaling metric.
* **Set Thresholds:**  This is the crucial step. You’ll define:
    * **Min Instances:** The minimum number of instances Railway will always keep running.  This ensures responsiveness even during low traffic. (e.g., 1)
    * **Max Instances:** The maximum number of instances Railway will scale to.  Set this high enough to handle peak loads, but consider cost implications. (e.g., 10, 20, or higher based on your estimates)
    * **Scaling Interval:**  How often Railway checks metrics to trigger scaling actions (default: 60 seconds).  Shorter intervals mean faster scaling, but can increase load.
    * **Scale Up/Down Targets:** Specify the percentage increase or decrease in instances you want to trigger when the metric reaches the upper or lower threshold respectively.  (e.g., Scale up by 50%, Scale down by 25%)
* **Save Changes:** Click "Save" to apply the configuration.

**Example UI Configuration:**

| Setting          | Value       | Description                               |
|------------------|-------------|-------------------------------------------|
| Enable Auto-Scaling | ON          | Enable automatic scaling.                 |
| Scaling Metric    | CPU         | Scale based on CPU utilization.           |
| Min Instances     | 1           | Minimum number of instances.                |
| Max Instances     | 10          | Maximum number of instances.                |
| Scaling Interval  | 60          | Check metrics every 60 seconds.             |
| Scale Up Target   | 50%         | Increase by 50% when CPU reaches threshold. |
| Scale Down Target | 25%         | Decrease by 25% when CPU is low.         |



**3. Configuring Auto-Scaling using the Railway CLI**

The CLI offers more control and automation.

* **Install the Railway CLI:** If you haven't already, follow the installation instructions at [https://railway.app/docs/cli](https://railway.app/docs/cli)
* **Login:**  `railway login`
* **Navigate to Your App:** `railway apps
