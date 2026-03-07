# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-06T16:32:22.032798

## Railway Auto-Scaling Configuration Guide

This guide outlines how to configure auto-scaling for your applications running on Railway, allowing your services to dynamically adjust their resources based on demand.  Railway simplifies the process significantly, but understanding the key concepts and settings will help you optimize your application's performance and costs.

**1. Understanding Auto-Scaling on Railway**

* **Automatic Scaling:** Railway leverages Kubernetes under the hood to provide automatic scaling. You tell Railway how to measure traffic and determine the appropriate number of pods for your service.
* **Metrics:** Railway utilizes metrics to detect changes in traffic. These commonly include:
    * **Requests Per Second (RPS):**  Most common for web applications.
    * **CPU Utilization:**  Useful for resource-intensive applications.
    * **Memory Utilization:**  Relevant for memory-heavy applications.
    * **Database Connections:**  Important for applications relying on databases.
* **Scaling Rules:** You define rules that trigger scaling up or down based on these metrics.
* **Reserved Resources:** You can set minimum and maximum number of instances for your service, preventing it from scaling down too far or up excessively.
* **Cooldown Periods:** Railway has cooldown periods to prevent rapid scaling up and down reactions to short-lived traffic spikes.


**2. Configuration Steps within Railway**

There are two primary ways to configure auto-scaling:

**A. Through the Railway UI (Recommended for Beginners):**

1. **Select Your Service:** Navigate to your service in the Railway UI.
2. **Navigate to Configuration:** Click on "Configuration" in the left-hand navigation.
3. **Scaling Tab:** Select the "Scaling" tab.
4. **Metrics Selection:** Choose the metric you want to monitor for scaling (e.g., “Requests Per Second”).
5. **Configure Scaling Rules:**
   * **Minimum Instances:** The smallest number of pods Railway will maintain.
   * **Maximum Instances:** The largest number of pods Railway will allow.
   * **Scaling Interval:** How often Railway checks the metrics (e.g., every 10 seconds).
   * **Scale Up Threshold:** The value of the metric that triggers a scale-up event.
   * **Scale Down Threshold:** The value of the metric that triggers a scale-down event.
   * **Cooldown Period:** The duration Railway waits after a scaling event before considering another one.
6. **Save Changes:** Click "Save" to apply your configuration.

**B. Using the Railway CLI (For Advanced Users & Automation):**

The Railway CLI offers more granular control.

1. **Install & Authenticate:** Ensure you have the Railway CLI installed and authenticated.
2. **Update Configuration:** Use the `railway scale` command:

   ```bash
   railway scale <service_name> --min <min_instances> --max <max_instances> --interval <interval_seconds> --scale_up_threshold <scale_up_threshold> --scale_down_threshold <scale_down_threshold> --cooldown <cooldown_seconds>
   ```

   * Replace `<service_name>` with your service's name.
   * Replace the other values with your desired settings.

   **Example:**

   ```bash
   railway scale my-app --min 1 --max 5 --interval 60 --scale_up_threshold 100 --scale_down_threshold 50 --cooldown 300
   ```

**3. Key Configuration Parameters Explained**

| Parameter          | Description                               | Default Value | Recommended Values                               |
|--------------------|-------------------------------------------|---------------|-------------------------------------------------|
| **Minimum Instances** | The minimum number of pods to maintain.    | 1             |
