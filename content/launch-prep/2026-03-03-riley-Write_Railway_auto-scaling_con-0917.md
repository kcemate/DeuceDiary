# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-03T09:17:41.524348

## Railway Auto-Scaling Configuration Guide - Achieving Optimal Performance

This guide outlines how to configure auto-scaling for your applications on Railway, allowing your services to dynamically adjust resources based on demand.  Properly configured auto-scaling ensures your application remains responsive, avoids performance bottlenecks, and optimizes cost.

**1. Understanding Railway's Auto-Scaling**

* **Dynamic Scaling:** Railway utilizes a dynamic scaling approach, meaning it automatically adds or removes resources (e.g., instances) based on metrics.
* **Metric-Based:**  Scaling is driven by metrics, primarily:
    * **CPU Utilization:** High CPU usage is a primary trigger for scaling up.
    * **Memory Utilization:** Similar to CPU, high memory usage triggers scaling.
    * **Request Rate:**  A significant spike in incoming requests can trigger scaling.
    * **Response Time:**  Elevated response times can also trigger scaling, especially for critical routes.
* **Service-Level Scaling (SLS):** Railway uses SLS to manage auto-scaling, providing granular control and insights.
* **Reservations:**  You can reserve specific resources for critical services or periods to prevent them from being scaled out during peak demand.


**2. Setting Up Auto-Scaling for Your Service**

This process typically involves these steps:

* **Step 1: Monitor Your Service with Railway's Metrics:** Ensure you're collecting and viewing key metrics for your service using the Railway Dashboard. This helps you understand how your application behaves under different loads.
* **Step 2: Create a Scaling Rule in SLS:**
    * **Navigate to SLS:** In the Railway Dashboard, go to "Services" and select your service.  Then, choose "Scaling Rules".
    * **Define the Rule:**
        * **Rule Name:** Give your rule a descriptive name (e.g., "High CPU Scaling").
        * **Trigger Condition:** This is the most important part. Define *when* the scaling should occur. Common trigger conditions:
            * **CPU Threshold:** “Scale up if CPU usage > 70% for 5 minutes”
            * **Memory Threshold:** “Scale up if Memory Usage > 80% for 5 minutes”
            * **Request Rate Threshold:** “Scale up if Requests per second > 100”
            * **Response Time Threshold:** “Scale up if Average Response Time > 200ms for 5 minutes”
        * **Scale Up Action:** Define how many instances to add when the trigger condition is met:
            * **Add Instances:**  Specify the number of new instances to create.
            * **Instance Type:** Select the instance type (e.g., t3.medium, t3.large) – choose based on your application's requirements.
            * **Minimum Instances:**  Set a minimum number of instances to keep running, even during low traffic. This prevents scaling *down* too aggressively.
        * **Scale Down Action:** Define when the scaling should occur back to its original state. This is crucial to avoid constantly spinning up and down instances.
            * **Duration:**  Specify how long to wait before scaling down. (e.g., “Scale down if CPU usage < 30% for 15 minutes”).  Start with a longer duration initially to allow the system to stabilize.
        * **Priority:** You can prioritize scaling rules.  Higher priority rules will take precedence.
* **Step 3: Save the Rule:** Once you’ve configured the rule, save it. Railway will start monitoring your service based on the defined trigger.

**3. Key Considerations & Best Practices**

* **Start with Conservative Thresholds:** Begin with higher CPU/Memory thresholds (e.g., 70-80%) and longer durations for scaling down. This
