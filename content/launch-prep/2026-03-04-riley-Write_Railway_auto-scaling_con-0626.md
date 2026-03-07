# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-04T06:26:00.893776

## Railway Auto-Scaling Configuration Guide: Scaling Your Applications

Railway simplifies scaling your applications through its built-in auto-scaling capabilities. This guide outlines how to configure auto-scaling to ensure your applications can handle fluctuating traffic and maintain optimal performance.

**1. Understanding Railway Auto-Scaling**

* **Automatic Scaling:** Railway monitors your application's resource consumption (CPU, memory, network) and automatically adjusts the number of instances running your application to meet demand.
* **Horizontal Scaling:** Railway primarily focuses on horizontal scaling – adding or removing instances of your application.
* **Scaling Triggers:** Railway uses a combination of metrics to trigger scaling actions:
    * **CPU Utilization:** Exceeding a configured threshold.
    * **Memory Utilization:** Exceeding a configured threshold.
    * **Requests per Second (RPS):** A surge in incoming requests can trigger scaling.
* **Cool-down Periods:** After a scaling event, Railway employs cool-down periods to prevent rapid, unnecessary scaling.
* **Concurrency Limits:** Setting concurrency limits helps control the number of concurrent requests handled by a single instance, which is crucial for resource management.

**2. Configuration Methods**

Railway offers several ways to configure auto-scaling:

**A. Via the Railway Console (Simple & Recommended)**

This is the easiest and most common method:

1. **Select Your Service:** In the Railway console, navigate to your application service.
2. **Go to the "Scaling" Tab:** Click on the "Scaling" tab.
3. **Configure Scaling Parameters:**
   * **Minimum Instances:** The minimum number of instances Railway will always keep running.  Set this to avoid cold starts.  Generally, a minimum of 1 is recommended.
   * **Maximum Instances:** The maximum number of instances Railway will scale to. Set this based on your anticipated peak load.
   * **CPU Utilization Threshold:** The percentage of CPU utilization that triggers scaling.  (Default: 70%)
   * **Memory Utilization Threshold:** The percentage of memory utilization that triggers scaling. (Default: 70%)
   * **RPS Scaling Trigger (Optional):** Enable this to scale based on requests per second.  Set the threshold to trigger scaling.
   * **Concurrency Limits (Crucial):**  Set a concurrency limit (maximum number of concurrent requests) for your application.  This is *highly* recommended.  A good starting point is 100, and adjust based on your application's architecture.
4. **Save Changes:** Click "Save" to apply the scaling configuration.

**B. Using Railway CLI (Advanced)**

The CLI provides more control and scripting capabilities:

1. **Install Railway CLI:** If you haven't already, install the Railway CLI.
2. **Set Concurrency Limits:**  Use the `railway config concurrency` command to set concurrency limits.
   ```bash
   railway config concurrency <your_app_id> <number_of_concurrency_units>
   ```
   Example: `railway config concurrency my-app 100`
3. **Configure Scaling (using the `railway services` command):**  This process is more involved and typically involves creating a service manifest file (`railway.json`). Refer to the official Railway CLI documentation for detailed instructions.

**C. Service Manifests (Most Control - Advanced)**

Service manifests provide the most granular control over your application's configuration, including auto-scaling. You'll need to manually define the scaling parameters within the manifest.  This is typically used for advanced deployments and complex scenarios.

**3. Best Practices & Considerations**

* **Start Small & Monitor:** Begin with conservative scaling thresholds and monitor your application’s performance closely.
* **Concurrency Limits are Essential:** Don’t
