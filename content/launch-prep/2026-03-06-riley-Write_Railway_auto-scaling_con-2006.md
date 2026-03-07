# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-06T20:06:29.293835

## Railway Auto-Scaling Configuration Guide

This guide outlines how to configure auto-scaling for your applications deployed on Railway. Railway's auto-scaling capabilities allow your application to dynamically adjust its resources based on demand, optimizing performance and cost.

**1. Understanding Railway Auto-Scaling**

* **Horizontal Scaling:** Railway primarily supports horizontal scaling – adding more instances of your application.
* **Metrics-Based:** Auto-scaling is triggered by metrics, primarily CPU utilization and Memory usage. You can also monitor other metrics like network traffic or queue lengths.
* **Configurable Thresholds:** You define minimum and maximum number of instances.  Railway will automatically scale up when usage exceeds the minimum and scale down when it falls below the maximum.
* **Rolling Updates:** Railway ensures a smooth experience during scaling, using rolling updates to minimize downtime.
* **Cost Optimization:** By scaling down during periods of low activity, you can significantly reduce your operational costs.

**2. Configuration Methods**

Railway offers several ways to configure auto-scaling:

**a) Via Railway Dashboard (Simple & Recommended):**

This is the easiest and most common method for most applications.

* **Navigate to your application in the Railway Dashboard.**
* **Go to the “Scaling” tab.**
* **Enable Scaling:** Toggle the “Enable Scaling” switch to ‘On’.
* **Set Scaling Parameters:**
    * **Minimum Instances:**  The minimum number of instances Railway will maintain. Start with a number that covers your expected baseline traffic.  A good starting point is often 1.
    * **Maximum Instances:** The maximum number of instances Railway will scale to. This determines your overall capacity.  Consider your anticipated peak load.
    * **Metric:** Select ‘CPU Utilization’ or ‘Memory Usage’ – both are supported.
    * **Thresholds:**
        * **High Threshold:**  The percentage of CPU or memory utilization that triggers scaling up. (e.g., 70% for CPU)
        * **Low Threshold:** The percentage of CPU or memory utilization that triggers scaling down. (e.g., 30% for CPU)
    * **Cooldown Period:**  The time (in seconds) Railway will wait after a scale event before triggering another one.  This prevents rapid fluctuations.  A typical range is 60-300 seconds.
* **Save Changes:** Click the "Save" button.

**b) Using the Railway CLI:**

This method offers more control and is suitable for advanced users or automated deployments.

* **Install the Railway CLI:**  Follow the instructions at [https://railway.app/docs/cli](https://railway.app/docs/cli)
* **Configure your Railway CLI:** Ensure you're authenticated and connected to your Railway account.
* **Run the `railway scale` command:**

   ```bash
   railway scale <app-name> --min <min-instances> --max <max-instances> --metric <metric> --high <high-threshold> --low <low-threshold> --cooldown <cooldown-period>
   ```

   * Replace `<app-name>` with the name of your Railway application.
   * Replace `<min-instances>`, `<max-instances>`, `<high-threshold>`, `<low-threshold>`, `<cooldown-period>` with your desired values.
   *  `<metric>` can be `cpu` or `memory`.

   **Example:**

   ```bash
   railway scale my-app --min 1 --max 3 --metric cpu --high 70 --low 30 --cooldown 120
   ```

**c) Configuring a Custom Autoscaler (Advanced - Using External Tools):**

Railway supports integrating with external autoscaling solutions like Kubernetes or
