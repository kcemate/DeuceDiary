# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-04T04:32:44.024710

## Railway Auto-Scaling Configuration Guide: Scaling Your Applications with Ease

Railway offers excellent auto-scaling capabilities, allowing your applications to dynamically adjust to fluctuating traffic and resource demands. This guide will walk you through configuring auto-scaling for your Railway applications, covering key aspects and best practices.

**1. Understanding Railway's Auto-Scaling**

* **Dynamic Scaling:** Railway automatically adjusts the number of instances of your services based on CPU usage, memory usage, and network traffic.
* **Metric-Based:** Scaling is driven by metrics collected by Railway's monitoring system.
* **Horizontal Scaling:** Railway primarily scales horizontally, adding more instances of your services.
* **Scaling Policies:** You define how aggressively Railway should scale based on your needs.
* **Service Dependencies:**  Railway intelligently considers dependencies between your services when scaling.

**2. Enabling Auto-Scaling for Your Services**

* **Service Level Plans (SLPs):** Auto-scaling is directly tied to Railway’s SLPs. You *must* be on an SLP that supports auto-scaling to use this feature. The following SLPs offer auto-scaling:
    * **Growth:** Offers the most aggressive auto-scaling, ideal for applications with highly variable traffic.
    * **Standard:**  Provides a moderate scaling response, suitable for many applications.
    * **Basic:**  Has limited auto-scaling capabilities and is designed for low-traffic applications.
* **Service Configuration:**
    1. **Navigate to your Service:**  Within the Railway UI, go to your service.
    2. **Access the Configuration Tab:** Click on the "Configuration" tab.
    3. **Scaling Settings:** You'll find the "Scaling" section.
    4. **Enable Auto-Scaling:** Toggle the "Auto-Scaling" switch to 'On'.
    5. **Choose an SLP:** Select the appropriate SLP from the dropdown.

**3. Configuring Scaling Policies -  Key Settings**

* **Minimum Instances:**  The absolute minimum number of instances Railway will always maintain for your service. This ensures a baseline level of performance and availability. *Crucially important for uptime.*
* **Maximum Instances:**  The maximum number of instances Railway will scale to. Setting this prevents uncontrolled scaling and potential costs.
* **Scale Thresholds:** This is the heart of auto-scaling.  You define how aggressively Railway responds to changes in metrics.  Railway offers two thresholds:
    * **Warm Threshold:** The CPU usage/memory usage that triggers scaling *up*.
    * **Cold Threshold:** The CPU usage/memory usage that triggers scaling *down*.
* **Scale Time:** The duration (in seconds) that Railway takes to scale up or down after reaching a threshold. A shorter time offers quicker responses but can increase instability. A longer time provides smoother scaling.  Generally, 30-60 seconds is a good starting point.
* **Resource Units (RU) per Instance:**  This determines the amount of resources each instance consumes. Railway automatically optimizes this based on your SLP.

**4. Monitoring and Adjusting Scaling Policies**

* **Railway Metrics Dashboard:**  Regularly monitor your service's metrics in the Railway dashboard (CPU, Memory, Network Traffic).
* **Scaling Events:**  Railway logs scaling events in the service's logs. These logs are crucial for understanding how your auto-scaling is working.
* **Fine-tuning:** Based on monitoring, adjust the scaling thresholds and scale time to optimize your application's performance and cost.
* **Testing:**  Simulate traffic spikes to test your auto-scaling configuration and ensure it's responding effectively.

**5. Best Practices for Auto-Scaling**

* **Start Small:** Begin with a conservative Minimum Instances value. You can always increase it later.
* **Realistic Threshold
