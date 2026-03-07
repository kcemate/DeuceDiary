# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-03T20:59:38.553517

## Railway Auto-Scaling Configuration Guide: Scaling Your Applications with Ease

Railway offers a robust and easy-to-use auto-scaling system, allowing your applications to dynamically adjust resources based on demand. This guide outlines how to configure auto-scaling effectively for your Railway applications, covering key concepts, steps, and best practices.

**1. Understanding Railway Auto-Scaling**

* **Horizontal Scaling:** Railway primarily uses horizontal scaling – adding more instances of your application to handle increased load.
* **Metrics-Based Scaling:** Auto-scaling decisions are driven by metrics collected from your application. Common metrics include:
    * **Requests per Second (RPS):**  A key indicator of incoming traffic.
    * **CPU Utilization:**  Indicates the processing load on your application instances.
    * **Memory Utilization:** Measures the amount of memory being used.
    * **Response Time:** Can signal bottlenecks or performance issues.
* **Scaling Policies:**  You define rules (scaling policies) that trigger scaling actions based on these metrics.
* **Scale Limits:**  You set upper and lower limits for the number of instances your application can scale to, preventing runaway costs and ensuring stability.
* **Warm-Up Period:** Railway initially waits a warm-up period (default 30 seconds) to allow your application to start up fully before initiating scaling.



**2. Configuration Steps - Using the Railway UI**

The Railway UI offers a straightforward way to configure auto-scaling.

1. **Navigate to Your App:** In the Railway UI, select the application you want to scale.

2. **Go to the “Scaling” Tab:**  Click on the "Scaling" tab within your application’s settings.

3. **Configure Scaling Policies:**
   * **Add a Policy:** Click the “Add Policy” button.
   * **Policy Type:** Choose the appropriate policy type:
      * **CPU Scaling:** Scales based on CPU utilization.
      * **Requests Scaling:** Scales based on incoming requests.
      * **Memory Scaling:** Scales based on memory utilization.
      * **Custom Metrics Scaling:**  (Advanced)  Allows you to integrate with external monitoring systems and scale based on custom metrics.
   * **Metric:** Select the metric you want to monitor (e.g., CPU Utilization).
   * **Threshold:** Set the threshold value that triggers scaling.  This is the percentage of utilization that will cause Railway to add or remove instances.  **Start with small increments (1-5%)** and fine-tune based on monitoring.
   * **Scaling Window:** Defines the time window in which scaling actions are evaluated.  Defaults to 60 seconds.
   * **Scale Up/Down:**  Set the number of instances to add or remove when the threshold is breached.
   * **Cooldown:**  A cooldown period after a scaling action to prevent rapid, unnecessary scaling. This helps stabilize the system.  (Defaults to 60 seconds).
   * **Save Policy:** Save the scaling policy.

4. **Set Scale Limits:**
    * **Minimum Instances:** The minimum number of instances Railway will always keep running for your application.  This is crucial for handling sudden spikes in traffic.
    * **Maximum Instances:** The maximum number of instances your application can scale to.  This is important for managing costs and preventing excessive resource consumption.

5. **Test and Refine:**
   * **Simulate Traffic:** Use tools like `curl`, `ab` (Apache Benchmark), or a load testing tool to simulate traffic and observe the scaling behavior.
   * **Monitor:** Utilize the Railway dashboard and your chosen monitoring tools to track resource utilization, response times, and scaling events.
   * **Adjust:**  Based on your observations, adjust the thresholds, scaling windows, and scale limits to optimize performance and cost.
