# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-03T08:10:16.978937

## Railway Auto-Scaling Configuration Guide

This guide outlines how to configure auto-scaling for your applications deployed on Railway. Railway offers a seamless experience for scaling your applications based on demand, minimizing costs and ensuring optimal performance.

**1. Understanding Railway's Auto-Scaling**

* **Automatic Scaling:** Railway automatically adjusts the number of containers running your application based on real-time metrics like CPU usage, memory usage, and incoming requests.
* **Horizontal Pod Autoscaling (HPA):** Railway uses HPA within your containers to trigger scaling events. You can configure HPA to react to specific metrics.
* **Scaling Triggers:** Railway considers these triggers:
    * **Resource Usage (CPU, Memory):**  The most common trigger. Railway will scale up or down based on sustained high usage.
    * **Incoming Requests (Requests per Second - RPS):**  Railway can scale based on the number of requests hitting your application.
    * **Custom Metrics (Prometheus, Datadog):**  Advanced users can integrate custom metrics to trigger scaling based on application-specific events.
* **Warm-Up & Cooling-Down:**  Railway implements a warm-up period after scaling up to allow your application to initialize properly, and a cooling-down period after scaling down to ensure stability.

**2. Configuring Auto-Scaling Through the Railway UI**

This is the recommended and easiest way to configure auto-scaling.

1. **Navigate to Your App:** Go to your Railway app in the Railway UI.
2. **Go to "Scaling" Tab:** In the left-hand navigation, select "Scaling".
3. **Automatic Scaling Toggle:**  Toggle the "Automatic Scaling" switch to **On**. This will enable Railway’s auto-scaling capabilities.
4. **Scaling Parameters:**  Configure the following parameters:
   * **CPU Threshold:** The percentage of CPU utilization that triggers a scaling event. (Default: 70%)
   * **Memory Threshold:** The percentage of memory utilization that triggers a scaling event. (Default: 70%)
   * **RPS Threshold:** The requests per second (RPS) that triggers a scaling event. (Default: 100 RPS)
   * **Warm-up Duration (Seconds):** How long the system should wait after scaling up to allow your application to initialize. (Default: 60 seconds)
   * **Cooling-down Duration (Seconds):** How long the system should wait after scaling down to ensure stability. (Default: 30 seconds)

5. **Save Changes:**  Click "Save Changes" to apply your configuration.

**3.  Fine-Tuning Auto-Scaling (Advanced)**

While the UI offers straightforward controls, you can fine-tune auto-scaling for more complex applications.

* **Container Resource Limits:**
   *  **Memory Limits:**  Define the maximum amount of memory a container can use.  This provides a baseline for Railway to monitor.  Don't over-restrict – allow for growth.
   * **CPU Limits:**  Define the maximum amount of CPU a container can use.  Similar to memory, set realistic limits.
* **HPA Configuration (via Kubernetes Custom Resources):**  For precise control, you can directly modify the Kubernetes HPA configuration. This requires a deeper understanding of Kubernetes and HPA.
   * **Steps:**
      1.  **Access Kubernetes:**  Navigate to "Kubernetes" in the Railway UI.
      2.  **Edit HPA:** Find your application's HPA configuration (usually named something like `hpa-your-app`) and click "Edit".
      3.  **Modify Parameters:** Adjust parameters like:
          * `targetCPUUtilizationPercentage`: CPU utilization target.
          * `targetRequestCount`: RPS
