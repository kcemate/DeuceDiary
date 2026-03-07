# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-04T14:21:23.054236

## Railway Auto-Scaling Configuration Guide

This guide outlines how to configure auto-scaling for your applications deployed on Railway. Auto-scaling automatically adjusts the resources (CPU, memory, etc.) allocated to your application based on its current workload, ensuring optimal performance and cost efficiency.

**1. Understanding Railway Auto-Scaling**

* **Horizontal Scaling:** Railway primarily utilizes horizontal scaling, meaning it adds more instances of your application to handle increased traffic.
* **Metrics-Based:** Auto-scaling decisions are driven by metrics collected from your application.  Railway supports several metrics, including:
    * **Requests per Second (RPS):** Most common and reliable metric for web applications.
    * **CPU Utilization:** Useful for CPU-intensive applications.
    * **Memory Utilization:**  Important for memory-hungry applications.
    * **Database Connection Usage:**  Helps avoid database bottlenecks.
    * **Custom Metrics:** (Advanced) You can send your own custom metrics via the Railway API.
* **Scaling Policies:** You define the rules that dictate how Railway responds to changes in these metrics.
* **Heatmap:** Railway's Heatmap provides a visual representation of your application’s traffic patterns, helping you understand scaling triggers.


**2. Configuration Steps**

Here’s a breakdown of the steps to configure auto-scaling on Railway:

**Step 1:  Application Setup & Monitoring**

* **Deploy Your App:** Ensure your application is successfully deployed on Railway.
* **Verify Metrics:**  Before configuring auto-scaling, understand your application's typical traffic patterns.  Check the Railway dashboard and the Heatmap to observe how metrics fluctuate.
* **Consider a Health Check:** Set up a health check endpoint in your application. This allows Railway to determine if an instance is truly unhealthy, not just experiencing high load.  Railway utilizes this to avoid scaling up on unresponsive instances.

**Step 2:  Configuring the Auto-Scaling Policy**

You configure auto-scaling through the Railway Dashboard:

1. **Navigate to Your App:** Go to the dashboard of your deployed application.
2. **Go to "Scaling":** In the app's settings, find and click on the "Scaling" tab.
3. **Select a Metric:** Choose the metric you want to use for scaling (typically "Requests per Second").
4. **Set Scaling Parameters:**
   * **Min Instances:** The minimum number of instances Railway will maintain.  This ensures there's always capacity available to handle sudden spikes.
   * **Max Instances:** The maximum number of instances Railway will scale to. This prevents uncontrolled resource consumption.
   * **Scale Trigger:** Define the conditions that trigger scaling:
      * **Request Threshold:**  Set a specific RPS threshold. For example, "Scale up when RPS > 50" and "Scale down when RPS < 20".
      * **CPU Threshold:**  Similar to RPS, but uses CPU utilization as the trigger.
      * **Memory Threshold:**  Uses memory utilization as the trigger.
   * **Scale Delay (Seconds):**  The amount of time Railway waits after a scaling event before re-evaluating the conditions. This prevents rapid, short-lived scaling. (Typical values: 10-60 seconds)
   * **Cooldown Period (Seconds):**  The amount of time an instance remains in a scaled-up state after scaling *down*.  This prevents rapid scaling back up after a traffic dip. (Typical values: 30-120 seconds)

**Example Configuration:**

* **App:** MyWebapp
* **Metric:** Requests per Second (RPS)
* **Min Instances:** 1
* **Max Instances:** 10
* **Scale Up Trigger:** RPS > 50
* **Scale Down Trigger:**
