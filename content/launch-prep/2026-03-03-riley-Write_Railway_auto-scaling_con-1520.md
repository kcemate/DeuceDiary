# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-03T15:20:14.758120

## Railway Auto-Scaling Configuration Guide

This guide outlines how to configure automatic scaling for your applications deployed on Railway. Railway offers built-in auto-scaling capabilities, but understanding how to fine-tune them is crucial for optimal performance and cost efficiency.

**1. Understanding Railway's Auto-Scaling Basics**

* **Horizontal Scaling:** Railway primarily leverages horizontal scaling, meaning it automatically adds or removes instances of your application based on demand.
* **Metrics Used:** Railway monitors your application using metrics like:
    * **Requests Per Second (RPS):** This is the most critical metric. Railway’s auto-scaling primarily reacts to changes in RPS.
    * **Memory Usage:** Railway monitors CPU and memory usage to prevent your instances from crashing.
    * **CPU Utilization:**  High CPU utilization can indicate bottlenecks or increased demand.
* **Scaling Policies:** Railway uses these policies to determine when to scale:
    * **Rate:** Scales based on the number of requests per second.
    * **Memory:** Scales based on memory usage.
    * **CPU:** Scales based on CPU utilization.
* **Scaling Triggers:**  These determine *when* scaling occurs:
    * **Thresholds:**  You define minimum and maximum RPS, memory, or CPU usage thresholds.  When the actual value crosses a threshold, scaling is initiated.
    * **Time Window:**  Defines the time interval for the trigger.
* **Scaling Actions:** These define *what* happens when a trigger is reached:
    * **Scale Out:** Adds more instances.
    * **Scale In:** Removes instances.

**2. Configuring Auto-Scaling in the Railway Dashboard**

Here’s how to configure auto-scaling through the Railway Dashboard:

1. **Navigate to your Application:**  Find your application within the Railway Dashboard.
2. **Go to the 'Settings' Tab:** Click on the "Settings" tab.
3. **Select 'Scaling':** Within the Settings tab, you’ll find the "Scaling" section.
4. **Choose Scaling Policy:**  Select the scaling policy you want to use.  The most common is "Rate" for reacting to request volume.
5. **Configure Scaling Policy Parameters:**
   * **Minimum Instances:** The minimum number of instances Railway will keep running, even if there are no requests.  Setting this too low can lead to cold starts.
   * **Maximum Instances:** The maximum number of instances Railway will scale up to.  Consider your budget and application’s capacity.
   * **Rate Thresholds:**
      * **Threshold:** The number of requests per second that triggers scaling.
      * **Scale Out Threshold:**  The number of requests per second required to trigger scaling *out*.
      * **Scale In Threshold:**  The number of requests per second required to trigger scaling *in*.
   * **Memory Thresholds (Optional):** Configure memory thresholds similarly to the rate thresholds.
   * **CPU Thresholds (Optional):** Configure CPU thresholds similarly to the rate thresholds.
   * **Time Window:** The duration of time the threshold is monitored (e.g., 1 minute, 5 minutes).  Shorter windows provide quicker scaling but can be more sensitive to transient spikes.

**3. Example Configuration (Rate Scaling)**

Let's say you have a simple API and want to auto-scale based on request volume:

* **Scaling Policy:** Rate
* **Minimum Instances:** 1
* **Maximum Instances:** 5
* **Scale Out Threshold:** 50 RPS (Requests Per Second)
* **Scale In Threshold:** 25 RPS (Requests Per Second)
* **Time Window:** 1 minute

This configuration will:

* Maintain at least 1 instance running.
* Scale up to a maximum
