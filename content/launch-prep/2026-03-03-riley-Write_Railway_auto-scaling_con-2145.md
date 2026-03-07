# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-03T21:45:01.286400

## Railway Auto-Scaling Configuration Guide: Scaling Your Applications on Demand

This guide outlines how to effectively leverage Railway's auto-scaling capabilities to ensure your applications perform optimally, regardless of traffic spikes. We'll cover key considerations, configuration options, and best practices.

**1. Understanding Railway's Auto-Scaling**

Railway automatically scales your services (containers) based on real-time resource usage. It uses a combination of metrics and thresholds to determine when to add or remove instances. Here's a breakdown:

* **Metrics Tracked:** Railway primarily monitors CPU utilization, memory usage, and network I/O of your service containers.
* **Scaling Policies:** You can configure how Railway reacts to these metrics. Default policies are often sufficient, but customization allows for fine-tuned control.
* **Horizontal Pod Autoscaling (HPA) Integration:** Railway leverages Kubernetes HPA for the scaling logic, providing robust and reliable scaling.
* **Cost Optimization:** Auto-scaling ensures you only pay for the resources your application actually needs, optimizing costs.


**2. Configuration Options & Best Practices**

Railway offers several ways to configure auto-scaling:

**a) Automatic (Default) Scaling:**

* **Thresholds:** Railway defaults to scaling based on CPU utilization.
    * **Low Threshold:** When CPU exceeds 60% for 5 minutes.
    * **High Threshold:** When CPU exceeds 90% for 5 minutes.
* **Scaling Steps:**
    * When the low threshold is breached, Railway adds one instance.
    * When the high threshold is breached, Railway adds two instances.
* **Recovery:** When CPU falls below the low threshold for 5 minutes, Railway removes an instance.
* **Suitable for:** Many general-purpose applications with predictable resource needs.  This is a great starting point.

**b) Manual Scaling (via Railway UI):**

* **Access:**  Navigate to your service in the Railway UI.
* **Scaling Controls:**  You'll find sliders to adjust the desired number of instances.
* **Benefits:** Provides immediate control for specific situations.
* **Caution:** Relying solely on manual scaling can lead to inconsistent performance and potentially higher costs.

**c) Custom Scaling Policies (Advanced):**

* **Access:**  This is the most powerful option, available through the Railway CLI and API.  (See the Railway documentation for detailed commands)
* **Metrics Beyond CPU:** You can specify scaling based on memory, network I/O, or custom metrics.
* **More Granular Thresholds:** Set lower/higher thresholds for each metric.
* **Scale Up/Down Actions:** Control the number of instances added or removed.
* **Cool-down Periods:** Prevent rapid scaling based on short spikes.
* **Example (CLI):**
    ```bash
    railway scale my-service --cpu-threshold 70 --cpu-low-threshold 60 --cpu-high-threshold 90 --scale-up 1 --scale-down 0 --cool-down 300
    ```
    * `--cpu-threshold`: Target CPU utilization.
    * `--cpu-low-threshold`: CPU threshold to trigger scaling *up*.
    * `--cpu-high-threshold`: CPU threshold to trigger scaling *down*.
    * `--scale-up`: Number of instances to add when scaling up.
    * `--scale-down`: Number of instances to remove when scaling down.
    * `--cool-down`:  Seconds to wait after scaling before triggering another action.


**3. Monitoring & Observing Auto-Scaling**

* **Railway Dashboard:** The UI displays real-time CPU, memory, and network usage for your services, making it easy to see how auto-scaling is responding.
* **Kubernetes
