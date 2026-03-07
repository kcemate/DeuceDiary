# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-04T02:39:29.055231

## Railway Auto-Scaling Configuration Guide

This guide outlines how to configure auto-scaling for your applications deployed on Railway, allowing your application to dynamically adjust resources based on demand. Effective auto-scaling can improve performance, reduce costs, and ensure your application remains responsive under load.

**1. Understanding Railway's Auto-Scaling Capabilities**

* **Horizontal Pod Autoscaling (HPA):** Railway primarily utilizes HPA, which allows Kubernetes to automatically scale the number of pods running your application based on metrics like CPU utilization, memory usage, or custom metrics.
* **Scaling Triggers:** HPA relies on scaling triggers. These define *when* to scale up or down.  Common triggers include:
    * **CPU Utilization:** Scale when CPU usage exceeds a defined threshold.
    * **Memory Utilization:** Scale when memory usage exceeds a defined threshold.
    * **Custom Metrics:** Scale based on application-specific metrics (e.g., number of active users, queue length). This requires deploying a metric server to collect these metrics.
* **Cooldown Periods:** HPA includes cooldown periods after scaling actions to prevent rapid, unnecessary scaling.
* **Railway’s Built-in Metrics:** Railway automatically collects CPU and memory metrics for your containers.


**2. Steps to Configure Auto-Scaling**

**Step 1: Deploy Your Application**

* Deploy your application to Railway as you normally would, ensuring it’s running within a Kubernetes Pod.
* Verify your application is functioning correctly.

**Step 2: Configure Your Application for Metrics (Recommended)**

* **For Custom Metrics:** If you need to scale based on something other than CPU/Memory, you'll need a metric server. Here are a few options:
    * **Prometheus:** (Recommended)  Prometheus is a popular open-source monitoring and alerting system.  Railway provides a managed Prometheus service you can use. You’ll need to configure your application to expose Prometheus metrics.
    * **Datadog:** Railway integrates with Datadog. You can use Datadog's monitoring features and auto-scaling capabilities.
    * **Other Metrics Servers:** You can deploy other metrics server solutions within your Railway project if required.

**Step 3:  Create a Horizontal Pod Autoscaling (HPA) Definition**

This is the core of the auto-scaling configuration.  You'll define how the number of pods should change based on the chosen triggers.  There are several ways to do this:

* **Using the Railway UI (Recommended for Beginners):**
    1. Navigate to your Railway project.
    2. Go to "Scale" under the "Infrastructure" tab.
    3. Select your application’s container.
    4. Choose "Scale Up"
    5. Configure the following:
        * **Metric:** Select CPU Utilization or Memory Utilization.
        * **Threshold:**  Set the desired CPU or Memory utilization percentage to trigger scaling. (e.g., CPU Utilization > 70%)
        * **Minimum:** The minimum number of pods to keep running.
        * **Maximum:** The maximum number of pods to scale up to.
        * **Cooldown:**  Set the cooldown period (in seconds) after scaling actions.
* **Using YAML (For Advanced Users):**
    1. Create a YAML file (e.g., `hpa.yaml`) with the following structure:

   ```yaml
   apiVersion: autoscaling/v2
   kind: HorizontalPodAutoscaler
   metadata:
     name: <your-app-hpa>
   spec:
     scaleTargetRef:
       apiVersion: apps/v1
       kind: Deployment
       name: <your-app-deployment> # Replace with your application's deployment name
     minReplicas:
