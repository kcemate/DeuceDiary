# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-03T14:57:37.843392

## Railway Auto-Scaling Configuration Guide

This guide outlines how to configure auto-scaling for your applications on Railway, allowing your services to dynamically adjust resources based on demand, optimizing cost and performance.

**1. Understanding Railway's Auto-Scaling**

* **Dynamic Scaling:** Railway automatically adjusts the resources (CPU, memory, and sometimes network bandwidth) allocated to your services based on observed traffic and resource utilization.
* **Minimum and Maximum Resources:** You define a minimum and maximum resource limit for each service.  Railway will never reduce resources below the minimum and won't increase them above the maximum (unless configured otherwise).
* **Metrics-Driven:** Auto-scaling relies on metrics collected from your service. Railway automatically monitors key metrics like CPU usage, memory usage, request latency, and error rates.
* **Cost Optimization:** By scaling up during peak times and scaling down during quiet periods, you can minimize your Railway bill.
* **Rolling Deployments:**  Railway's rolling deployments automatically scale out new instances of your service alongside existing ones, minimizing downtime.

**2. Configuring Auto-Scaling for Your Service**

There are two primary ways to configure auto-scaling on Railway:

**A. Via the Railway UI (Recommended for most users):**

1. **Navigate to Your Service:** In the Railway dashboard, select the service you want to configure.
2. **Go to the “Scaling” Tab:**  Within the service details, you'll find a “Scaling” tab.
3. **Set Minimum and Maximum Resources:**
    * **Minimum:** The smallest number of resources Railway will maintain for your service (e.g., 1 CPU core, 1GB memory). This ensures a baseline level of performance.
    * **Maximum:** The largest number of resources Railway will allow your service to use (e.g., 4 CPU cores, 4GB memory). This sets an upper limit to control costs.
4. **Scaling Behavior (Optional):**
   * **Scale Up:**  Defines how Railway responds to increased resource utilization. Options include:
     * **Automatic (Default):** Railway automatically scales up when resource utilization exceeds a certain threshold.
     * **Manual:** You manually trigger scaling events via the Railway UI.
   * **Scale Down:** Defines how Railway responds to decreased resource utilization. Options include:
     * **Automatic (Default):**  Railway automatically scales down when resource utilization falls below a certain threshold.
     * **Manual:** You manually trigger scaling events.
5. **Set Scaling Thresholds:**  These thresholds determine *when* Railway scales up or down.
   * **CPU Utilization:** The percentage of CPU usage that triggers scaling. (e.g., 70% for scaling up, 50% for scaling down).
   * **Memory Utilization:** The percentage of memory usage that triggers scaling.
   * **Request Latency:**  The average latency of requests that triggers scaling. (Use this for services where response time is critical).
   * **Error Rate:** The percentage of requests resulting in errors that triggers scaling.
6. **Save Changes:** Click the “Save” button to apply your auto-scaling configuration.

**B. Using the Railway CLI (For advanced users and automation):**

1. **Install the Railway CLI:** Follow the instructions on the Railway website to install the CLI.
2. **Configure your CLI:** Authenticate with your Railway account.
3. **Use the `railway scale` command:**

   ```bash
   railway scale <service_name> --min <min_resources> --max <max_resources> --cpu-util <cpu_threshold> --memory-util <memory_threshold> --latency <latency_threshold> --error-rate <error_rate_threshold>
   ```
