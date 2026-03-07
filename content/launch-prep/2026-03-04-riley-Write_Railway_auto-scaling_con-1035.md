# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-04T10:35:41.038778

## Railway Auto-Scaling Configuration Guide

This guide outlines how to configure auto-scaling for your applications on Railway.  Railway automatically manages scaling based on demand, but understanding the configuration options and monitoring metrics can help you optimize performance and cost.

**1. Understanding Railway's Auto-Scaling**

* **Automatic Scaling:** Railway automatically scales your services based on CPU utilization, memory usage, and network traffic. It intelligently adjusts the number of instances running your application.
* **Horizontal Scaling:** Railway primarily utilizes horizontal scaling, meaning it adds more instances of your application to handle increased load.
* **Metrics-Based Scaling:**  Scaling decisions are driven by real-time metrics collected by Railway's monitoring system.
* **Cool-Down Periods:**  Railway incorporates cool-down periods after scaling events to prevent excessive oscillations and maintain stability.

**2. Configuration Options & Settings**

Railway provides several settings to influence the auto-scaling behavior. These are available through your Service settings:

* **Minimum Instances:**  The minimum number of instances that Railway will always maintain. This ensures you always have a baseline level of capacity.  **Important:** Don't set this too low, as it can lead to high costs if your app consistently needs more resources.
* **Maximum Instances:**  The maximum number of instances that Railway will scale up to. This sets an upper limit on your costs and ensures your application doesn't consume excessive resources.
* **Scale-up Interval:** The frequency (in seconds) at which Railway checks for scaling opportunities. The default is 60 seconds.  Lowering this value can lead to faster scaling but also increased overhead.
* **Scale-down Interval:** The frequency (in seconds) at which Railway checks for scaling opportunities. The default is 60 seconds.  Similar to scale-up, adjusting this impacts responsiveness.
* **Metrics to Scale On:**  This is the *most crucial* setting. You choose what triggers scaling actions.  Available options include:
    * **CPU Utilization:**  Scales up when CPU usage exceeds a threshold.  Generally a good starting point for many applications.
    * **Memory Utilization:** Scales up when memory usage exceeds a threshold. Useful for memory-intensive applications.
    * **Network Traffic:**  Scales up based on incoming/outgoing network traffic. Suitable for applications with significant network I/O.
    * **Custom Metrics:**  (Advanced)  You can send custom metrics from your application to Railway for scaling.  This requires integration with Railway's metrics system.
* **Scale Thresholds:**  Once you select a metric, you define the thresholds.  You can set separate thresholds for scaling *up* and *down*.  Example:
    * **CPU Scale-Up Threshold:** 70%
    * **CPU Scale-Down Threshold:** 50%
* **Scaling Policy Type:** (Rolling out) You can choose between 'Linear' and 'Exponential' scaling policies.
    * **Linear:** Scales instances linearly, adding one instance at a time.
    * **Exponential:** Scales instances exponentially, adding multiple instances at a time for faster scaling.



**3. Setting Up Auto-Scaling – Step-by-Step**

1. **Navigate to your Service:** In the Railway dashboard, select the service you want to configure.
2. **Access Service Settings:** Click on the "Settings" tab of your service.
3. **Go to "Scaling" Section:** Find the "Scaling" section within the settings.
4. **Configure Settings:**
    *  Set **Minimum Instances** based on your expected minimum load.
    *  Set **Maximum Instances** based on your budget and anticipated peak load.
    *  Adjust **Scale-up Interval** and **Scale-down Interval** to find the right balance between responsiveness and
