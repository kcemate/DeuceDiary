# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-07T08:19:26.987581

## Railway Auto-Scaling Configuration Guide

This guide outlines how to effectively configure auto-scaling for your applications running on Railway, allowing your service to dynamically adjust resources based on demand.  Proper auto-scaling is crucial for maintaining performance, minimizing costs, and ensuring your application can handle peak loads.

**1. Understanding Railway's Auto-Scaling Capabilities**

* **Horizontal Scaling:** Railway primarily focuses on horizontal scaling – adding more instances of your service to handle increased traffic.
* **Metrics-Based Scaling:** Railway monitors your service for metrics like CPU usage, memory usage, response time, and request rate.  These metrics trigger scaling events.
* **Pre-defined Scaling Policies:** Railway offers a few pre-defined scaling policies you can adjust.
* **Custom Scaling Policies (Premium Plan Only):** Premium plans offer advanced control over scaling rules, including more granular metrics and complex conditions.


**2.  Basic Auto-Scaling Setup (Free & Hobby Plans)**

This section covers the fundamentals for the Free and Hobby plans.

* **Key Metrics to Monitor:**
    * **CPU Utilization:**  A consistent high CPU utilization (80% or higher) is a strong indicator of needing more instances.
    * **Memory Utilization:** Similar to CPU, high memory usage can lead to performance issues.
    * **Request Rate:**  A sudden spike in requests is a clear sign of increased demand.
    * **Response Time:**  Long response times can indicate bottlenecks and the need for more resources.
* **Railway's Automatic Scaling Policy:** By default, Railway uses a simple policy:
    * **Scale-Out:** When the request rate exceeds a threshold (configurable), Railway adds a new instance.
    * **Scale-In:** When the request rate drops below a threshold, Railway removes an instance.
* **Configuring Initial Scaling Parameters:**
    * **Minimum Instances:** This is the lowest number of instances Railway will always keep running for your service.  Setting this too low can lead to slow response times during peaks.  Start with 1 or 2.
    * **Maximum Instances:** This is the highest number of instances Railway will scale to. Set this to a reasonable value based on your expected peak load.
    * **Scaling Thresholds:** The request rate thresholds trigger scale-out and scale-in events. Experiment to find appropriate values.  Start with a broad range (e.g., 100 requests per second to 1000 requests per second).

**3.  Accessing and Adjusting Scaling Settings**

* **Railway Dashboard:** Log in to your Railway account and select your service.
* **Scaling Tab:**  Navigate to the "Scaling" tab within your service's settings.
* **Configuration Options:**
    * **Minimum Instances:** Adjust the minimum number of instances.
    * **Maximum Instances:**  Set the maximum number of instances.
    * **Scaling Thresholds:**  Modify the request rate thresholds for scale-out and scale-in.
    * **Metrics:**  (Premium Plans Only)  Select which metrics trigger scaling.  You can choose from CPU, Memory, Response Time, etc.
    * **Scaling Delay:**  The time (in seconds) that Railway waits after a scaling event before measuring the impact.

**4.  Best Practices for Auto-Scaling**

* **Start Small:** Begin with a conservative minimum and maximum instance count. You can always increase it later.
* **Monitor & Iterate:**  Carefully monitor your service’s performance after enabling auto-scaling. Adjust the scaling thresholds and instance counts based on your observations.
* **Understand Your Application:**  Know how your application behaves under load.  Caching, connection pooling, and efficient code can reduce the need for scaling.
* **Test Scaling Events:**  Simulate load on your
