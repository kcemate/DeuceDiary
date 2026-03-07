# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-06T06:32:28.299654

## Railway Auto-Scaling Configuration Guide

This guide outlines how to configure auto-scaling for your applications on Railway, allowing your services to automatically adjust resources based on demand.  This ensures optimal performance and cost-efficiency, preventing bottlenecks during peak times and reducing unnecessary spending during periods of low activity.

**1. Understanding Railway Auto-Scaling**

* **Automatic Scaling:** Railway’s auto-scaling system monitors the resource utilization of your application services (specifically, the CPU and Memory metrics).
* **Scaling Triggers:**  Scaling events are triggered based on pre-defined thresholds.
* **Scaling Actions:** Railway automatically adjusts the number of instances of your services, increasing or decreasing them as needed.
* **Cool-down Period:** After a scale-out event, there's a cool-down period (default 30 minutes) before Railway attempts another scale-out. This prevents rapid, unnecessary scaling.
* **Scaling Limits:** Railway enforces limits on the maximum number of instances a service can have. This is configurable and helps prevent runaway scaling and associated costs.

**2. Configuration Steps**

**a) Service Configuration (Within Railway UI):**

1. **Navigate to your Service:** In the Railway UI, select the service you want to configure for auto-scaling.
2. **Go to the "Scaling" Tab:** Within the service's settings, locate and click on the "Scaling" tab.
3. **Enable Auto-Scaling:** Toggle the "Auto-Scale" switch to the "On" position.

**b) Configure Scaling Parameters:**

* **Minimum Instances:** (Mandatory)  The minimum number of instances Railway will maintain for your service, regardless of traffic. This ensures availability and allows for initial processing.  *Start with 1-2 for lightweight services.*
* **Maximum Instances:** (Mandatory) The maximum number of instances Railway will allow your service to scale up to. *Set this based on your anticipated peak traffic and budget. Don’t set it too high to avoid unexpected costs.*
* **Scale-Up Threshold:**  The CPU utilization percentage that triggers a scale-out event. The default is 70%.  *Adjust this based on your application's requirements. Lower values result in more frequent scaling, while higher values result in less frequent scaling.*
* **Scale-Down Threshold:** The CPU utilization percentage that triggers a scale-down event. The default is 50%. *Adjust this to allow for fluctuations in traffic. A higher value can prevent unnecessary scale-downs.*
* **Cool-Down Duration:** The duration (in minutes) after a scale-out event before Railway attempts another scale-out. The default is 30 minutes. *This can be adjusted to suit your application's needs.*

**c) Advanced Scaling Options (Optional):**

* **Scale-Out Delay:** Delay before scaling up after a scale-out event.  Useful for services needing time to warm up.  (Default: 1 minute)
* **Scale-Down Delay:** Delay before scaling down after a scale-down event.  (Default: 1 minute)
* **Custom Metrics:**  While primarily CPU and Memory focused, Railway supports integrating with external monitoring systems (e.g., Prometheus, Datadog) to use custom metrics for scaling decisions.  This is an advanced feature requiring more setup.

**3. Monitoring & Adjusting Auto-Scaling**

* **Railway Dashboard:** The Railway Dashboard provides real-time insights into your service's resource utilization, scaling events, and costs.  Monitor these metrics regularly.
* **Scaling Events:**  Railway logs scaling events in the service's logs. Review these logs to understand why scaling occurred.
* **Adjust Parameters:**  Based on your monitoring, adjust the scaling parameters (thresholds, minimum/maximum instances, cool-
