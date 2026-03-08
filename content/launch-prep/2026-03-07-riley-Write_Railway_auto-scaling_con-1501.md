# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-07T15:01:53.001528

## Railway Auto-Scaling Configuration Guide

This guide outlines how to configure automatic scaling for your Railway applications to ensure optimal performance and cost efficiency. Railway's auto-scaling capabilities leverage Kubernetes to dynamically adjust the number of pods running your application based on resource utilization.

**1. Understanding Railway's Auto-Scaling**

* **Built-in Auto-Scaling:** Railway automatically scales applications based on resource metrics like CPU, memory, and network I/O.
* **Horizontal Pod Autoscaling (HPA):** This is the core technology used. Railway utilizes HPA to scale your application’s pods.
* **Metrics:** Railway monitors these metrics for scaling:
    * **CPU Utilization:**  The percentage of CPU time used by your application.
    * **Memory Utilization:** The percentage of RAM used by your application.
    * **Network I/O:** The amount of data sent and received by your application.
* **Scaling Limits:** You define minimum and maximum pod counts that Railway will automatically scale between.
* **Cooldown Periods:**  After a scaling event, there’s a cooldown period to prevent rapid fluctuations and ensure stability.

**2. Configuring Auto-Scaling in Railway**

There are primarily two ways to control auto-scaling:

**A. Through the Railway UI:** (Recommended for Beginners)

1. **Navigate to Your App:** Go to your Railway application within the Railway UI.
2. **Go to the "Scaling" Tab:** Click on the "Scaling" tab in your app's dashboard.
3. **Set Scaling Limits:**  You'll see fields for:
    * **Minimum Pods:** The lowest number of pods Railway will run. (Recommended: At least 1)
    * **Maximum Pods:** The highest number of pods Railway will run.  (Consider your application's peak load and resources.)
4. **Save Changes:** Click the "Save" button to apply the new scaling limits.
5. **Monitor:**  The UI will display real-time metrics and show when scaling events are occurring.

**B. Using the Railway CLI:** (For Advanced Users & Automation)

1. **Set Scaling Limits:** Use the `railway scale` command.

   ```bash
   railway scale --min 1 --max 5 --cpu 50 --memory 1024
   ```

   * `--min`:  Minimum number of pods (e.g., 1)
   * `--max`: Maximum number of pods (e.g., 5)
   * `--cpu`: Minimum CPU utilization percentage (e.g., 50%) – *Optional, but recommended*
   * `--memory`: Minimum memory utilization percentage (e.g., 1024) – *Optional, but recommended*

**3. Advanced Configuration & Considerations**

* **Custom Metrics (Advanced):** While Railway primarily uses CPU, memory, and network I/O, you *can* integrate your application with external monitoring systems (like Prometheus or Datadog) to feed custom metrics to HPA. This allows for more granular scaling based on your specific application needs. (Requires more configuration and integration).
* **Cooldown Periods:** Railway has default cooldown periods after scaling events. You can't directly adjust these settings through the UI or CLI. However, understanding how cooldown works is important. Scaling events happen in discrete intervals.
* **Resource Requests and Limits:**  Crucially important!
    * **Requests:**  Tell Kubernetes how much CPU and memory each pod *needs*.  Set these correctly.  Insufficient requests will lead to scaling issues.
    * **Limits:**  Define the maximum amount of CPU and memory a pod can use.  Set limits to prevent a single pod from consuming all resources and impacting other pods.
* **Pod Disruption
