# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-03T06:18:00.152967

## Railway Auto-Scaling Configuration Guide

This guide outlines how to configure auto-scaling for your applications deployed on Railway.  Railway’s built-in autoscaling helps ensure your application can handle fluctuating traffic and maintain performance without manual intervention.

**1. Understanding Railway Autoscaling**

* **Dynamic Scaling:** Railway utilizes a dynamic scaling approach. This means it automatically adjusts the number of instances of your application based on real-time metrics.
* **Key Metrics:** Railway scales based on a combination of metrics, including:
    * **Request Count:**  The number of requests your application is receiving.
    * **CPU Utilization:** The percentage of CPU being used by your application instances.
    * **Memory Utilization:** The percentage of RAM being used by your application instances.
    * **Custom Metrics (Advanced):**  You can integrate custom metrics into the scaling logic for even more granular control.
* **Scaling Strategies:** Railway employs a "scale-out" strategy, meaning it adds more instances when demand increases and removes them when demand decreases.
* **Cooldown Periods:**  After a scaling event, Railway applies a cooldown period (typically 5-15 minutes) to prevent rapid oscillations.

**2.  Basic Autoscaling Configuration**

Railway automatically scales most applications based on the metrics above.  However, you can influence the behavior with the following:

* **Application Configuration:**
    * **Scaling Boundaries:**  Railway defaults to reasonable scaling boundaries for each application type (Web, Worker, etc.).  These are typically determined by the chosen instance type.
    * **Scale-out Threshold:**  This is the minimum request count that triggers a scale-out event. (Default: 10 requests)
    * **Scale-in Threshold:**  This is the minimum request count that triggers a scale-in event. (Default: 0 requests)
    * **CPU and Memory Utilization Thresholds:**  Railway uses these thresholds to determine when to scale instances.  (Default values are generally suitable)

**3.  Adjusting Autoscaling Behavior (Advanced - Railway Pro Required)**

* **Railway Pro unlocks advanced scaling options, including:**
    * **Custom Scaling Policies:**  Define complex scaling logic based on multiple metrics, time-based triggers, and even external systems.
    * **Dynamic Instance Type Selection:** Railway can automatically select the optimal instance type based on your application's needs and cost.
    * **Predictive Scaling:** Utilize historical data to anticipate demand fluctuations and proactively scale your application.
* **Creating Custom Scaling Policies (Railway Pro):**
    * Navigate to your application's settings in the Railway dashboard.
    * Go to the “Scaling” section.
    * Click “Create Custom Scaling Policy”.
    * **Policy Builder:** Use the visual policy builder to define your logic. Key options:
        * **Trigger:**  Define the conditions that trigger a scale-out or scale-in event (e.g., CPU > 80%, Request Count > 50, Time of Day).
        * **Action:**  Specify the action to take (e.g., Add Instance, Remove Instance).
        * **Cooldown:**  Set the cooldown period after scaling events.
        * **Metric Weighting:**  Adjust the relative importance of different metrics in the scaling calculation.

**4. Monitoring Autoscaling**

* **Railway Dashboard:** The Railway dashboard continuously monitors your application’s scaling activity.
* **Metrics Tab:**  View real-time metrics like request count, CPU utilization, and memory utilization.
* **Scaling Events Log:**  Track all scaling events, including when instances were added or removed, and the metrics that triggered them. (Available in Railway Pro)
* **Logs:** Examine your application's logs for performance issues that might be affecting scaling.


**5. Best
