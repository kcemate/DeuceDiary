# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-03T22:53:08.226927

## Railway Auto-Scaling Configuration Guide - Achieving Optimal Performance

This guide outlines how to configure auto-scaling for your applications on Railway, ensuring optimal performance and cost efficiency. We'll cover key concepts, configuration options, and best practices.

**1. Understanding Railway Auto-Scaling**

Railway leverages Kubernetes (K8s) as its underlying orchestration system, and K8s has robust auto-scaling capabilities. Railway abstracts much of this complexity, offering a simplified interface. Here's what you need to know:

* **Horizontal Pod Autoscaling (HPA):**  This is the core mechanism. HPA automatically scales the number of pods running your application based on resource utilization (CPU, Memory, or Custom Metrics).
* **Railway UI:** The primary way to configure HPA. It presents a user-friendly interface for setting scaling parameters.
* **K8s Resources:** Auto-scaling relies on K8s' built-in resource management and scaling mechanisms.
* **Cost Optimization:** Auto-scaling directly impacts your Railway bill by adjusting the resources allocated to your services.


**2. Configuring HPA in the Railway UI**

Here's a step-by-step guide:

* **Navigate to your Service:**  In the Railway UI, select your service.
* **Go to the "Scaling" Tab:** You'll find this tab on the service's overview page.
* **Enable Auto-Scaling:**  Toggle the "Auto-Scale" switch to "On."
* **Define Scaling Parameters:**  This is where you control how Railway scales your service:

    * **Metric:** Choose the metric you want HPA to monitor:
        * **CPU:** Most common and often the best starting point.
        * **Memory:** Useful for applications with high memory usage.
        * **Custom Metrics:**  Allows you to scale based on application-specific metrics like queue length, request latency, or number of active users. (Requires additional setup, explained below)

    * **Minimum Replicas:** The minimum number of pods that should always be running.  Set this low enough to avoid unnecessary costs, but high enough to handle a baseline load.  A good starting point is often 1 or 2.

    * **Maximum Replicas:** The maximum number of pods that can be running.  Set this according to your expected peak load.  It’s crucial to avoid excessive scaling that could lead to increased costs.

    * **Scaling Thresholds:**  Define the target values for your chosen metric. These thresholds trigger scaling actions:
        * **Above Threshold:**  If the metric exceeds this value, Railway will increase the number of pods.
        * **Below Threshold:** If the metric falls below this value, Railway will decrease the number of pods.

    * **Scale Every:**  Specifies how frequently HPA checks the metrics and adjusts the number of pods (e.g., every 30 seconds, 5 minutes, 1 hour).  Shorter intervals provide more responsive scaling but can increase resource usage.


**3.  Advanced Configuration & Custom Metrics**

* **Custom Metrics:**  If your application has specific metrics that are a better indicator of load than CPU or Memory, you can use custom metrics.  This typically involves:
    * **Instrumentation:**  Adding code to your application to expose the custom metrics in a format K8s understands (usually HTTP endpoints serving JSON data).
    * **Railway Configuration:**  In the Railway UI, select "Custom Metrics" as the Metric.  Provide the URL to the endpoint that serves the custom metric data. Railway will automatically discover and use this metric.
* **Resource Limits & Requests:**  While HPA automatically adjusts the number of pods, setting appropriate CPU and memory *requests* and *limits* is still essential for K8s
