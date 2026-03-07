# Write a Railway auto-scaling configuration guide for a Node.
Agent: riley
Generated: 2026-03-02T20:33:08.572488

## Railway Auto-Scaling Configuration Guide for a Node.js App (Expecting Launch Traffic Spikes)

This guide outlines how to configure auto-scaling for a Node.js application deployed on Railway, specifically geared towards handling launch traffic spikes. We'll cover scaling triggers, minimum and maximum instances, and health checks to ensure your app remains responsive and available during periods of high demand.

**Understanding the Goal:**

The aim is to automatically adjust the number of instances of your Node.js application to accommodate fluctuating traffic. During a launch spike, we want to rapidly scale up to handle the increased load, and then scale back down when the traffic subsides.

**1. Prerequisites:**

* **Railway Account:** You'll need an active Railway account.
* **Node.js Application Deployed:** Your Node.js application must be successfully deployed and running on Railway.
* **Service Monitoring:** Railway recommends using Prometheus and Grafana for monitoring. This guide assumes you've configured these.

**2. Scaling Triggers (Crucial!)**

Railway offers several scaling triggers to automate the scaling process. Here’s a breakdown with recommended settings:

* **CPU Utilization:**  **Highly Recommended.** This is the most common and effective trigger for Node.js applications.
    * **Threshold:** 70-80%  (This allows for headroom and avoids excessive scaling based on momentary spikes)
    * **Scale Up:**  Add 1 instance every X minutes (e.g., 5-10 minutes - tune this based on your app’s behavior)
    * **Scale Down:**  Remove 1 instance every Y minutes (e.g., 15-30 minutes - longer than scale up to avoid unnecessary churn)
* **Request Latency:** **Recommended.**  If your app has latency issues under load, this is crucial.
    * **Threshold:** 50-100ms (Adjust based on your application's tolerance for latency)
    * **Scale Up:**  Add 1 instance every X minutes (same as CPU utilization)
    * **Scale Down:**  Remove 1 instance every Y minutes (same as CPU utilization)
* **Request Count:**  **Useful but requires careful tuning.** Can lead to rapid scaling and potential resource waste if set too aggressively.
    * **Threshold:** 100-500 requests per minute (Adjust based on expected normal traffic)
    * **Scale Up:** Add 1 instance every X minutes (e.g., 10-20 minutes - be cautious)
    * **Scale Down:** Remove 1 instance every Y minutes (e.g., 30-60 minutes - be cautious)
* **Memory Utilization:**  Less critical for most Node.js apps, but can be useful if memory leaks are a concern.
    * **Threshold:** 80-90% (Consider only if you’ve identified memory usage issues)

**3. Minimum and Maximum Instances**

* **Minimum Instances:** **3-5** – This provides redundancy and ensures you can handle a baseline level of traffic.  A lower number (1-2) might be acceptable for very lightweight apps.
* **Maximum Instances:** **10-20** –  Determine this based on your anticipated peak load and the resources available on Railway.  Don’t set it too high, as it can become expensive.  Start lower and monitor.

**4. Health Checks**

Railway utilizes probes to monitor the health of your instances.  Configure the following:

* **HTTP Probe:**
    * **Path:** `/healthz` (or a similar endpoint designed specifically to check application health – see below)
    * **Interval:** 30-60 seconds (Adjust based on your app’s responsiveness
