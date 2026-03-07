# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-03T17:13:13.676507

## Railway Auto-Scaling Configuration Guide

This guide outlines how to configure automatic scaling for your Railway applications to ensure optimal performance and cost efficiency. Railway leverages Kubernetes to achieve this, and this guide focuses on leveraging Kubernetes' built-in features.

**Understanding Auto-Scaling**

Auto-scaling automatically adjusts the number of instances running your application based on demand.  When traffic increases, Railway spins up more instances to handle the load.  When traffic decreases, it scales down to reduce costs.  Railway provides several mechanisms for achieving this, primarily leveraging Kubernetes Horizontal Pod Autoscaler (HPA).

**1. Prerequisites**

* **Railway Account:** You’ll need an active Railway account.
* **Application Deployed:** Your application should already be deployed to Railway.
* **Metrics Available:** Your application needs to expose metrics that HPA can utilize to determine load. This commonly includes:
    * **CPU Utilization:**  The most common and readily available metric.
    * **Memory Utilization:** Useful for memory-intensive applications.
    * **Request Latency:**  Helps HPA understand how busy your service is.
    * **Custom Metrics:** You can expose custom metrics using Prometheus or other monitoring solutions, which offers the most granular control.


**2. Configuring the Horizontal Pod Autoscaler (HPA)**

Railway automatically provisions and configures HPA for your apps if you use the standard deployment strategy. However, you can refine the configuration for more precise control.

**a) Utilizing the Railway UI:**

This is the easiest method for most users:

1. **Navigate to your App:**  Within the Railway UI, select your application.
2. **Go to the "Scaling" Tab:**  This tab provides a simplified interface for managing HPA.
3. **Enable Auto-Scaling:** Toggle the "Auto-Scaling" switch to ON.
4. **Set Target Utilization:** This is the core setting.  Choose a percentage target for CPU utilization (e.g., 70% or 80%). Railway will attempt to keep your average CPU usage at this target.
5. **Set Minimum and Maximum Instances:**
   * **Minimum:**  The minimum number of instances Railway will always keep running.  Setting this too low can lead to increased cold starts.
   * **Maximum:**  The maximum number of instances Railway will scale up to.  Consider your application’s resource constraints and peak load scenarios.
6. **Save Changes:** Click the "Save" button to apply your configuration.

**b)  Manually Configuring HPA via YAML (Advanced Users):**

For fine-grained control and integration with other tools, you can manage HPA directly using YAML files.

1. **Create a `hpa.yaml` file:**  This file will define the HPA configuration.  Here's a basic example:

   ```yaml
   apiVersion: autoscaling/v2
   kind: HorizontalPodAutoscaler
   metadata:
     name: my-app-hpa
   spec:
     scaleTargetRef:
       apiVersion: apps/v1
       kind: Deployment
       name: my-app-deployment # Replace with your deployment name
     minReplicas: 1
     maxReplicas: 10
     metrics:
       - type: Resource
         resource:
           name: cpu
           target:
             type: Utilization
             averageUtilization: 70
   ```

   * **`scaleTargetRef`:** Specifies the Deployment to scale.  Replace `my-app-deployment` with the actual name of your deployment.
   * **`minReplicas`:** The minimum number of replicas to maintain.
   * **`maxReplicas`:** The maximum number of replicas to scale to.
