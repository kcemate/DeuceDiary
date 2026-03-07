# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-04T00:46:03.925882

## Railway Auto-Scaling Configuration Guide

This guide outlines how to configure auto-scaling for your applications deployed on Railway, enabling your application to dynamically adjust its resources based on demand, improving performance and cost efficiency.

**Understanding Railway Auto-Scaling**

Railway utilizes Kubernetes under the hood for orchestration.  Its auto-scaling feature leverages Kubernetes' Horizontal Pod Autoscaler (HPA) to automatically scale your application's pods. Here's a breakdown:

* **HPA:**  Kubernetes' HPA monitors resource usage (CPU, memory) of your pods and automatically adjusts the number of replicas to maintain target metrics.
* **Railway's Integration:** Railway simplifies this process by providing a UI and configuration options to tailor HPA behavior and trigger scaling events.
* **Three Key Components:**
    * **Metric Source:**  The data used to determine scaling.  Railway primarily uses CPU utilization.
    * **Target:** The desired CPU utilization level you want to maintain.
    * **Scale Limit:** The maximum and minimum number of pods Railway will scale to.

**Configuration Options & Best Practices**

Here's how to configure auto-scaling effectively on Railway:

**1.  Railway UI Configuration (Recommended for Simple Use Cases)**

   * **Navigate to Your App:** Go to your application's dashboard on Railway.
   * **Scaling Section:** Locate the "Scaling" tab.
   * **Enable Auto-Scaling:**  Toggle the "Auto-Scaling" switch to the "On" position.
   * **Configure Metrics:**
       * **Metric:**  Choose "CPU Utilization." This is the default and generally the most reliable metric for web applications.
       * **Target:**  Set your desired CPU utilization target (e.g., 70%, 80%).  Lower values result in more aggressive scaling.
       * **Scale Limits:**  Set the `Min` and `Max` number of replicas. This defines the range of pods Railway will scale to.
       * **Cooldown:**  This period (in seconds) determines how long Railway waits after scaling up or down before considering another change.  A longer cooldown reduces unnecessary scaling, while a shorter cooldown responds more quickly to changes in demand.  Defaults are generally reasonable, but adjust based on your application's responsiveness.
   * **Save:** Click "Save Changes" to apply your settings.

**2.  YAML Configuration (Advanced - For Fine-Grained Control)**

   You can also manage HPA configuration through YAML files. This is recommended for more complex scaling requirements.

   * **Create a `hpa.yaml` file:**  This file defines your HPA object.
   * **Example `hpa.yaml`:**

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
               averageUtilization: 70
       behavior:
         scaleUp:
           stabilizationWindowSeconds: 60 # Adjust based on response time needs
           scaleUpSlowdown: 0.5 # Delay scaling up if response time is slow
         scaleDown:
           stabilizationWindowSeconds: 60
           scaleDownSlowdown: 0.5
     ```

   * **Deploy through Railway UI:**
      *  Go to your app's dashboard.
      *  Select
