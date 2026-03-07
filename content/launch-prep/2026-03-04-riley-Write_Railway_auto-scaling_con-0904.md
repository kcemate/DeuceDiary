# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-04T09:04:42.526957

## Railway Auto-Scaling Configuration Guide

This guide outlines how to configure auto-scaling for your applications deployed on Railway. Railway's auto-scaling intelligently adjusts your app's resources based on demand, ensuring optimal performance and cost-efficiency.

**1. Understanding Railway's Auto-Scaling**

* **Dynamic Scaling:** Railway automatically scales your application's resources (CPU, Memory, Network) based on incoming traffic and resource utilization.
* **Horizontal Scaling:** Primarily, Railway focuses on horizontal scaling – adding more instances of your application to handle increased load.
* **Automatic Resource Allocation:** Railway manages the underlying infrastructure, handling scaling and resource allocation behind the scenes.
* **Cost Optimization:** Scaling up during peak demand and scaling down during quieter periods helps optimize your spending.


**2. Configuration Options & Settings**

Railway provides several settings to influence auto-scaling. These settings are managed through your app’s configuration in the Railway dashboard. Here’s a breakdown:

* **Minimum Instances:** (Required) Sets the minimum number of instances that Railway will always maintain for your application. This ensures you have a base level of capacity.  *Starting with 1 is generally recommended.*
* **Maximum Instances:** (Required) Defines the maximum number of instances Railway will scale up to.  *Carefully consider your application's peak load and potential costs.*
* **CPU Utilization Target:** (Recommended) Sets the target CPU utilization percentage. Railway will try to maintain this average across all instances.  *A common starting point is 70-80%, but adjust based on your app's workload.*
* **Memory Utilization Target:** (Recommended) Sets the target memory utilization percentage.  Railway will aim to keep the average memory usage within this range. *Like CPU, start with 70-80% and refine based on monitoring.*
* **Scaling Interval:** (Recommended) The frequency (in seconds) at which Railway checks for scaling opportunities.  *The default is 60 seconds. Shorter intervals (e.g., 30 seconds) can react faster to demand changes, but might also increase operational costs slightly.*
* **Cool-down Period:** (Optional) A delay (in seconds) after a scaling event before Railway attempts another scaling operation.  This helps prevent rapid, unnecessary scaling fluctuations. *A good starting point is 300 seconds (5 minutes).*
* **Health Checks:** (Crucial) Railway uses health checks to monitor the status of your instances. It automatically restarts unhealthy instances and will trigger scaling actions if unhealthy instances become prevalent. You can configure custom health checks to better reflect your application's health.
* **Resource Limits:** (Optional - advanced)  You can set specific CPU and memory limits per instance to control the maximum resources each instance can consume. Useful for resource-constrained environments.


**3. Setting Up Auto-Scaling in the Railway Dashboard**

1. **Navigate to your App:**  Log into your Railway account and select your application.
2. **Go to the Configuration Tab:**  Click on the "Configuration" tab within your app's dashboard.
3. **Find the Auto-Scaling Section:**  Locate the "Auto-Scaling" section.
4. **Enter Your Settings:**
   *  Set your `Minimum Instances`, `Maximum Instances`, and `CPU Utilization Target`.
   *  Choose your desired `Scaling Interval` and `Cool-down Period`.
   *  Configure your `Health Checks` – these are *essential* for effective scaling.
5. **Save Changes:**  Click the “Save” button to apply your auto-scaling configuration.

**4. Monitoring and Tuning**

* **Railway Dashboard Metrics:**  Regularly monitor your app’s performance metrics (CPU, Memory, Network) in the Railway dashboard.
* **Railway Logs:**
