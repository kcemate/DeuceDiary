# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-03T08:32:43.893672

## Railway Auto-Scaling Configuration Guide

This guide outlines how to configure auto-scaling for your applications deployed on Railway.  Railway's auto-scaling features, powered by Kubernetes, allow your applications to dynamically adjust their resources based on demand, ensuring optimal performance and cost efficiency.

**1. Understanding Railway Auto-Scaling**

* **Kubernetes-Based:** Railway leverages Kubernetes to manage your deployments, providing the foundation for its auto-scaling capabilities.
* **Horizontal Pod Autoscaler (HPA):**  Railway's HPA automatically scales the number of pods running your application based on metrics.
* **Metrics Supported:** Railway supports scaling based on CPU, Memory, and Custom Metrics.
* **Pre-Configured Metrics:** Railway automatically collects CPU and Memory usage for your applications.
* **Custom Metrics:** Allows you to specify additional metrics for scaling (e.g., queue length, database connection pool size) – this requires setup within your application.

**2. Configuring Auto-Scaling on Railway**

There are several ways to configure auto-scaling:

**A. Using the Railway UI (Recommended for Simplicity)**

1. **Navigate to your App:** Go to the Railway dashboard and select your application.
2. **Go to "Scaling":** In your app’s overview, click on the “Scaling” tab.
3. **Enable Auto-Scaling:** Toggle the "Auto-Scaling" switch to "On."
4. **Set Scaling Parameters:**
   * **Minimum Replicas:**  The minimum number of pods Railway will maintain.  A good starting point is often 1.
   * **Maximum Replicas:** The maximum number of pods Railway will scale to. Be mindful of your infrastructure limits (e.g., number of allowed instances).
   * **Metric:** Choose the metric you want to use for scaling (CPU, Memory, or Custom).
   * **Scale Thresholds:**  Define the thresholds for scaling up and down.
      * **Lower Threshold (Critical):**  The value at which scaling *down* starts.  Set this conservatively to avoid unnecessary scaling.
      * **Upper Threshold (Relaxed):** The value at which scaling *up* starts. Set this generously to react to increasing demand.
5. **Save Changes:** Click "Save" to apply the configuration.

**B. Using Railway CLI**

The Railway CLI provides more granular control.

1. **Install Railway CLI:**  If you haven’t already, install the Railway CLI.
2. **Authenticate:**  Login to your Railway account via the CLI: `railway login`
3. **Enable Auto-Scaling:**  Use the following command:
   ```bash
   railway scale --auto <app-name> --min <min-replicas> --max <max-replicas> --metric <metric> --lower <lower-threshold> --upper <upper-threshold>
   ```
   * Replace `<app-name>` with the name of your Railway app.
   * Replace `<min-replicas>` with the desired minimum number of replicas.
   * Replace `<max-replicas>` with the desired maximum number of replicas.
   * Replace `<metric>` with ‘cpu’, ‘memory’, or the name of your custom metric.
   * Replace `<lower-threshold>` with the lower scaling threshold.
   * Replace `<upper-threshold>` with the upper scaling threshold.

   Example:
   ```bash
   railway scale --auto my-app --min 1 --max 5 --metric cpu --lower 70 --upper 90
   ```

**3. Custom Metrics Configuration (Advanced)**

If you want to scale based on metrics *within* your application, you need to:

1. **Instrument your Application:**
