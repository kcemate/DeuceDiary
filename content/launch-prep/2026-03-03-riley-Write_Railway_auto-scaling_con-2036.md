# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-03T20:36:58.598823

## Railway Auto-Scaling Configuration Guide: Scaling Your Applications with Ease

Railway's auto-scaling capabilities allow your applications to dynamically adjust resources based on demand, optimizing costs and ensuring performance. This guide outlines the key aspects of setting up and managing auto-scaling for your Railway applications.

**1. Understanding Railway's Auto-Scaling Mechanism**

* **Horizontal Scaling:** Railway primarily utilizes horizontal scaling, adding or removing containers to your application deployment based on metrics.
* **Metrics-Driven:** Auto-scaling is triggered by monitoring metrics such as:
    * **CPU Usage:**  The percentage of CPU utilized by your application.
    * **Memory Usage:** The amount of memory consumed by your application.
    * **Request Latency:**  The time taken to respond to incoming requests.
    * **Queue Length:** The number of messages in a queue (for asynchronous processes).
* **Scaling Groups:** You'll manage scaling based on "Scaling Groups," which define the number of containers to run for a particular application version.
* **Scaling Policies:** These determine *when* and *how* Railway adjusts the number of containers in a scaling group, based on the defined metrics and thresholds.

**2. Configuring Auto-Scaling - Key Settings**

You configure auto-scaling through the Railway dashboard:

* **Navigate to your Application:**  Select your application from the Railway dashboard.
* **Go to "Scaling":**  Within your application's settings, you'll find the "Scaling" section.
* **Scaling Groups:** You'll see a list of scaling groups associated with your application.

**Here's what you'll find within each scaling group:**

* **Version:** The specific version of your application this scaling group serves.
* **Minimum Instances:** The minimum number of containers that should *always* be running. This ensures availability during low traffic.  Start with a value that provides basic functionality (e.g., 1 or 2).
* **Maximum Instances:** The maximum number of containers the scaling group can scale up to.  Set this based on anticipated peak load and resource constraints.
* **Scaling Policy:** This is the core of your auto-scaling configuration.  Let's break down the options:
    * **Metric:** Select the metric you want to base scaling on (CPU, Memory, Latency, Queue Length).
    * **Threshold:** The value that triggers scaling.  For example, if you're using CPU, a threshold of 80% means scaling will occur when CPU usage exceeds 80%.
    * **Scaling Step:** How much the number of instances changes with each scaling event.  This can be a fixed number of containers (e.g., +1 or -1) or a percentage (e.g., +10%).
    * **Cooldown Period:**  The duration (in seconds) after a scaling event before another scaling event can occur. This prevents rapid oscillations and allows your application to stabilize.

**3. Example Scaling Policy Configurations**

Here are a few example configurations to get you started:

* **Low Traffic (CPU Based):**
    * Version: `latest`
    * Minimum Instances: 1
    * Maximum Instances: 3
    * Scaling Policy:
        * Metric: CPU
        * Threshold: 70%
        * Scaling Step: +1
        * Cooldown Period: 60 seconds
* **Medium Traffic (Latency Based):**
    * Version: `v1.2`
    * Minimum Instances: 2
    * Maximum Instances: 10
    * Scaling Policy:
        * Metric: Latency
        * Threshold: 500ms
        * Scaling Step: +2
        * Cooldown Period: 30 seconds
*
