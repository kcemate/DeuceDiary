# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-04T01:54:12.450765

## Railway Auto-Scaling Configuration Guide

This guide outlines how to configure automatic scaling for your Railway applications to optimize resource usage and maintain performance during varying traffic loads. Railway provides several options for auto-scaling, catering to different needs and application architectures.

**1. Understanding Railway's Scaling Options**

Railway offers the following methods for auto-scaling:

* **Horizontal Pod Autoscaling (HPA) with Kubernetes:** This is the most powerful and flexible method. It leverages Kubernetes' HPA feature to automatically adjust the number of Pod replicas based on metrics like CPU utilization, memory usage, or custom metrics.
* **Serverless Functions Scaling (Automatic Scaling):** Railway automatically scales serverless functions based on incoming requests, eliminating the need for manual configuration.
* **Container Scaling (Limited):**  Railway offers limited scaling capabilities for container deployments, primarily through container placement strategies.  This is less sophisticated than HPA.
* **Custom Scaling Scripts (Advanced):** You can write custom scripts to monitor your application and trigger scaling events, giving you granular control.

**2. Horizontal Pod Autoscaling (HPA) - Recommended for Most Applications**

This is the most robust approach for scaling your applications.

**a) Prerequisites:**

* **Your application must be deployed as a Kubernetes application on Railway.**  This typically involves using a Dockerfile and deploying your application as a Pod.
* **You need to understand your application's resource usage patterns.**  Monitor CPU, memory, and other relevant metrics to determine appropriate scaling targets.

**b) Configuring HPA on Railway:**

1. **Define Metrics:** HPA relies on metrics to determine when to scale. Common metrics include:
   * **CPU Utilization:**  Adjusts based on CPU usage.
   * **Memory Utilization:** Adjusts based on memory usage.
   * **Custom Metrics:**  You can expose custom metrics from your application to HPA, allowing you to scale based on application-specific indicators (e.g., queue length, request latency).

2. **Create an HPA Configuration File (YAML):**  This file defines the scaling rules.  Here's a basic example:

   ```yaml
   apiVersion: autoscaling/v2
   kind: HorizontalPodAutoscaler
   metadata:
     name: my-app-hpa
   spec:
     scaleTargetRef:
       apiVersion: apps/v1
       kind: Deployment
       name: my-app-deployment  # Replace with your deployment name
     minReplicas: 1
     maxReplicas: 10
     metrics:
       - type: Resource
         resource:
           name: cpu
           target:
             type: Utilization
             averageUtilization: 50  # Scale up when CPU utilization exceeds 50%
   ```

   * **`scaleTargetRef`:**  Specifies the Kubernetes object that HPA will manage (usually a Deployment or StatefulSet).
   * **`minReplicas`:** The minimum number of Pods to keep running.
   * **`maxReplicas`:** The maximum number of Pods that HPA will scale up to.
   * **`metrics`:** Defines the scaling criteria. The example uses CPU utilization.  You can add more metrics for memory, custom metrics, or other resources.

3. **Apply the HPA Configuration to Railway:**

   *  Use the `railway scale` command: `railway scale my-app-hpa`  (Replace `my-app-hpa` with the name of your HPA configuration file).
   * Railway handles the deployment of the HPA to your cluster.

**c) Monitoring HPA:**

* **Railway Dashboard:**  The Railway dashboard displays the state of your HPA and the
