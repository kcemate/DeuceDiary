# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-04T05:18:04.672652

## Railway Auto-Scaling Configuration Guide: Getting the Right Resources for Your App

Railway offers powerful auto-scaling capabilities that automatically adjust the resources allocated to your application based on demand, optimizing cost and performance. This guide will walk you through configuring auto-scaling for your Railway services, covering key aspects and best practices.

**1. Understanding Railway's Auto-Scaling**

* **Dynamic Scaling:** Railway's auto-scaling is primarily *dynamic*. This means it reacts to real-time metrics like CPU usage, memory usage, and request latency.
* **Per-Service Scaling:**  Auto-scaling is configured on a per-service basis – for each instance of your app you deploy on Railway.
* **Horizontal Scaling:** Railway focuses on *horizontal scaling*, adding or removing instances of your service to handle increased or decreased traffic.
* **Prometheus & Grafana Integration:** Railway leverages Prometheus and Grafana for metrics collection and visualization, providing the foundation for its auto-scaling logic.
* **Railway Scale-Out & Scale-In Actions:** You can trigger scaling actions manually using the Railway UI or through the CLI/API.

**2. Configuring Auto-Scaling in the Railway UI**

This is the simplest way to set up auto-scaling:

1. **Navigate to your Service:**  Go to your service within the Railway UI.
2. **Go to the "Scaling" Tab:**  Find the "Scaling" tab within your service's configuration.
3. **Enable Auto-Scaling:** Toggle the "Auto-Scale" switch to “On”.
4. **Configure Scaling Rules:**
   * **Minimum Instances:** Set the *minimum* number of instances you want Railway to always keep running. This ensures your application is responsive even during low traffic.
   * **Maximum Instances:** Define the *maximum* number of instances Railway will scale up to.  Consider your application’s peak load capacity and budget.
   * **Metric:**  Choose the metric used to trigger scaling:
       * **CPU Usage:**  Scale based on CPU utilization percentage. (Most common)
       * **Memory Usage:** Scale based on memory utilization percentage.
       * **Request Latency:** Scale based on the average request latency. (Useful for latency-sensitive apps)
   * **Thresholds:** Define the percentage thresholds that trigger scaling.  For example:
       * **Scale Out (Up):**  If CPU usage exceeds 70%, add an instance.
       * **Scale In (Down):** If CPU usage falls below 30%, remove an instance.
   * **Cooldown:**  Set a "cool-down" period (in seconds) after a scaling event to prevent rapid oscillations.  A longer cooldown prevents bouncing between instances.  (e.g., 60 seconds)
5. **Save Changes:** Click "Save" to apply the scaling configuration.

**3. Configuring Auto-Scaling via the Railway CLI**

The CLI provides more granular control and automation:

```bash
railway scale <service-name> --min <min-instances> --max <max-instances> --metric <metric-name> --threshold <threshold-percentage> --cooldown <cooldown-seconds>
```

* **`<service-name>`:** The name of your Railway service.
* **`--min <min-instances>`:** Minimum number of instances.
* **`--max <max-instances>`:** Maximum number of instances.
* **`--metric <metric-name>`:**  CPU, Memory, or Request Latency.
* **`--threshold <threshold-percentage>`:** The percentage threshold for scaling.
* **`--cooldown <cooldown-seconds>`:**  Cooldown period in seconds.

**Example:**

```bash
railway scale my-app
