# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-03T19:06:29.912145

## Railway Auto-Scaling Configuration Guide

This guide outlines how to configure auto-scaling for your applications running on Railway, allowing your application to automatically adjust its resources based on demand.  Railway provides a streamlined approach to auto-scaling, abstracting much of the complexity for you.  This guide focuses on leveraging Railway's built-in auto-scaling features and best practices.

**1. Understanding Railway's Auto-Scaling**

* **Dynamic Scaling:** Railway’s auto-scaling is *dynamic*. This means it reacts to changes in traffic in real-time, scaling up or down as needed.
* **Metric-Driven:**  Railway automatically scales based on configured metrics.  It primarily uses the following:
    * **Requests Per Second (RPS):** The most common and effective metric for most web applications.
    * **CPU Usage:** Can be used, but generally less reliable than RPS for web applications.
    * **Memory Usage:**  Also possible, but less common than RPS.
* **Horizontal Scaling:** Railway focuses on scaling horizontally by adding more instances of your application.
* **Warm-Up Time:** Railway incorporates a warm-up period after scaling to allow your application to fully initialize and handle requests efficiently.

**2. Configuring Auto-Scaling in the Railway UI**

This is the recommended and simplest method for auto-scaling your Railway apps.

1. **Select Your App:**  Navigate to your Railway app in the Railway UI.
2. **Go to the "Scaling" Tab:**  Click on the "Scaling" tab within your app's settings.
3. **Scale Up/Down Controls:** You'll see buttons labeled "Scale Up" and "Scale Down".
4. **Configure Scaling Thresholds:** This is the core of auto-scaling:
   * **Minimum Instances:**  The smallest number of instances Railway will keep running.  This ensures consistent availability.  Consider setting this to the number of instances needed for your basic load.
   * **Maximum Instances:** The largest number of instances Railway will scale up to.  Determine this based on your expected peak load and your budget.
   * **Scaling Interval:**  How frequently Railway checks the metrics for scaling decisions (default: 60 seconds).  Shorter intervals lead to quicker scaling but may increase resource usage.  Consider 30-60 seconds for most applications.
   * **Metric to Scale On:** Choose the metric to monitor: `Requests Per Second (RPS)`.
   * **RPS Thresholds:**
      * **Scale Up Threshold:** The RPS value that triggers scaling up. (Default: 100 RPS) - Start with a low value like 50-100.
      * **Scale Down Threshold:** The RPS value that triggers scaling down. (Default: 20 RPS) -  A higher value than the scale up threshold allows for gradual scaling back down.
5. **Save Changes:**  Click "Save" to apply your auto-scaling configuration.

**3.  Advanced Scaling Options (Via Configuration File - YAML)**

Railway allows you to fine-tune auto-scaling through a configuration file. This is useful for more complex scenarios.

1. **Navigate to "Configuration":** In your app's settings, go to the "Configuration" tab.
2. **Select "Scaling Configuration":**  Choose "Scaling Configuration" from the options.
3. **Upload your YAML File:**  Railway expects a YAML file with the following structure:

   ```yaml
   # Example scaling configuration
   min_instances: 1
   max_instances: 10
   scale_interval: 30  # in seconds
   scale_on_metric: "requests_per_second"
   scale_up_threshold: 1
