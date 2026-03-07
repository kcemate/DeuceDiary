# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-04T03:47:26.155237

## Railway Auto-Scaling Configuration Guide

This guide outlines how to configure auto-scaling for your applications on Railway, ensuring optimal performance and cost efficiency. Railway provides automatic scaling based on resource utilization, simplifying your deployment and maintenance.

**1. Understanding Railway's Auto-Scaling**

* **Dynamic Scaling:** Railway automatically adjusts the number of instances of your app based on incoming traffic.
* **Resource Metrics:** Railway monitors key resource metrics like CPU utilization, memory usage, network traffic, and request latency.
* **Scaling Triggers:**  When a metric exceeds a configurable threshold, Railway adds more instances. When the metric drops below another configurable threshold, Railway removes instances.
* **Auto-Restarts:** Railway automatically restarts instances that fail, contributing to higher availability.
* **Cost Optimization:** Scaling down during low-traffic periods helps minimize your Railway costs.


**2. Configuration Steps - Web Applications (Most Common)**

This section focuses on auto-scaling for typical web applications deployed via Railway's built-in runners.

**Step 1: Setting up Resource Limits (Crucial)**

* **Railway UI:** Navigate to your Railway app.
* **Runners Tab:** Select the "Runners" tab.  You’ll see a list of your running instances.
* **Edit Runner:** Click the "..." (More Options) button next to the runner you want to configure.
* **Resource Limits:** This is the *most important* step. You need to define limits for:
    * **CPU:** Set a maximum CPU usage. (e.g., 80% of available CPU)
    * **Memory:** Set a maximum memory usage. (e.g., 4GB)
    * **Network:**  Set a maximum network bandwidth. (Useful for applications with high bandwidth needs)
* **Save Changes:**  Save the updated resource limits.  Railway will begin monitoring your application against these limits.

**Step 2: Configuring Scaling Policies (Thresholds)**

* **Railway UI:**  Navigate to your Railway app.
* **Runners Tab:** Select the "Runners" tab.
* **Edit Runner:** Click the "..." (More Options) button next to the runner you want to configure.
* **Scaling Policy:** You'll find the "Scaling Policy" section. This controls when Railway adds or removes instances.
    * **Add New Instance Trigger:**  Define a condition for adding new instances.  You can typically use:
        * **CPU Utilization:**  "Add instance when CPU utilization exceeds [Percentage]%" (e.g., 80%)
        * **Memory Utilization:** "Add instance when Memory utilization exceeds [Percentage]%" (e.g., 90%)
        * **Request Latency:** "Add instance when Request latency exceeds [Milliseconds]" (e.g., 500ms)
    * **Remove Instance Trigger:** Define a condition for removing instances. You can typically use:
        * **CPU Utilization:** "Remove instance when CPU utilization falls below [Percentage]%" (e.g., 30%)
        * **Memory Utilization:** "Remove instance when Memory utilization falls below [Percentage]%" (e.g., 20%)
        * **Request Latency:** "Remove instance when Request latency falls below [Milliseconds]" (e.g., 200ms)
* **Scaling Delay:** Set a delay (in seconds) between changes. This helps avoid rapid scaling up and down and reduces unnecessary overhead. (e.g., 30 seconds)
* **Save Changes:** Save the updated scaling policy.

**Step 3: Monitoring and Fine-tuning**

* **Railway Dashboard:** The Railway UI provides real-time monitoring of your application's resources.
* **Logs:** Examine your application'
