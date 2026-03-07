# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-04T08:19:25.168172

## Railway Auto-Scaling Configuration Guide: Optimizing Your Applications

Railway provides a powerful and relatively straightforward way to automatically scale your applications based on demand. This guide outlines the key aspects of configuring auto-scaling for your Railway applications, covering the necessary steps and considerations.

**1. Understanding Railway's Auto-Scaling**

* **Horizontal Scaling:** Railway primarily supports horizontal scaling – adding more instances of your application to handle increased load.
* **Metric-Based Scaling:** Scaling is triggered by metrics like CPU utilization, memory usage, and network I/O. You define thresholds that trigger scaling events.
* **Built-in & Custom:** Railway offers both built-in scaling configurations and the ability to define custom scaling rules.
* **Cost Optimization:** Auto-scaling is a core mechanism for optimizing costs by only running the number of instances needed at any given time.


**2. Configuring Auto-Scaling – The Railway UI**

This is the most common and recommended method for setting up auto-scaling.

* **Navigate to Your App:** In the Railway UI, select the application you want to scale.
* **Go to “Scaling”:** In the left-hand navigation, click on "Scaling".
* **Select Scaling Strategy:** Choose one of the following:
    * **Automatic (Recommended):** Railway automatically detects and uses CPU and memory utilization to scale your application.  You'll primarily manage the scaling thresholds.
    * **Manual:** You manually control the number of instances. Useful for testing or if you have very specific scaling requirements.
* **Configure Scaling Thresholds:**  This is where you define when to scale up and down.
    * **CPU Utilization:** Set the percentage of CPU utilization that triggers a scale-up event. (e.g., 70% - scale up) and a scale-down event. (e.g., 40% - scale down)
    * **Memory Usage:** Set the percentage of memory utilization.
    * **Network I/O:** (Optional, for applications with high network traffic) - Set thresholds for network usage.
    * **Cool Down Period:** This is *crucial*.  Set a delay (in seconds or minutes) *after* a scale-up or scale-down event. This prevents rapid scaling in response to short bursts of traffic, improving stability and cost-effectiveness. A common starting point is 60-300 seconds.
* **Save Changes:**  Railway will automatically start implementing your scaling configuration.

**3. Configuring Auto-Scaling – Railway CLI**

The CLI offers more granular control and is useful for automation.

* **Install Railway CLI:** If you haven't already, install the Railway CLI following the instructions on the Railway website: [https://railway.app/docs/cli](https://railway.app/docs/cli)
* **Set Configuration:**
   ```bash
   railway scale --cpu-threshold <threshold_percentage> --memory-threshold <threshold_percentage> --cool-down <cool_down_duration>
   ```
   * Replace `<threshold_percentage>` with the desired CPU and memory utilization thresholds (e.g., `70`).
   * Replace `<cool_down_duration>` with the cool-down period in seconds or minutes (e.g., `60`).

**4. Advanced Configuration & Considerations**

* **Minimum and Maximum Instances:** While Railway generally uses dynamic scaling, you can set a minimum and maximum number of instances to ensure a certain level of service. This is configured within the “Scaling” section of your app’s settings.
* **Scaling Policies (Future Feature):** Railway is actively developing scaling policies that allow you to define more complex scaling rules based on various metrics and events (e.g., scaling up during peak hours). Keep an
