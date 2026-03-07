# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-03T16:05:35.120934

## Railway Auto-Scaling Configuration Guide - Achieving Optimal Performance & Cost Efficiency

This guide outlines how to configure auto-scaling for your applications deployed on Railway, focusing on maximizing performance and minimizing costs. Railway's built-in auto-scaling features, combined with best practices, can dynamically adjust your service resources based on demand.

**1. Understanding Railway’s Auto-Scaling Capabilities**

* **Horizontal Pod Autoscaling (HPA):** Railway leverages Kubernetes’ HPA, allowing you to scale your services based on CPU, Memory, and custom metrics. This is the primary method for auto-scaling.
* **Dynamic Resource Allocation (DRA):** DRA automatically adjusts the size of your worker instances based on the demands of your applications.  This is a proactive approach to scaling, anticipating resource needs.
* **Metrics:** Railway collects a wide range of metrics from your applications, providing the data needed for HPA and DRA to function effectively.  Key metrics include CPU utilization, memory usage, network I/O, and request rates.

**2. Setting Up HPA (Horizontal Pod Autoscaling)**

* **Accessing Kubernetes:** Railway provides a managed Kubernetes cluster. You’ll primarily manage scaling through Kubernetes deployments.
* **Defining HPA Objects:**
    * **Create a `HorizontalPodAutoscaler` (HPA) object.** This object specifies the target deployment, the metrics to monitor, and the desired scaling behavior.
    * **YAML Example:**

    ```yaml
    apiVersion: autoscaling/v2
    kind: HorizontalPodAutoscaler
    metadata:
      name: my-app-hpa
      namespace: my-namespace  # Replace with your namespace
    spec:
      scaleTargetRef:
        apiVersion: apps/v1
        kind: Deployment
        name: my-app-deployment # Replace with your deployment name
      minReplicas: 1  # Minimum number of pods
      maxReplicas: 10 # Maximum number of pods
      metrics:
      - type: Resource
        resource:
          name: cpu
          target:
            type: Utilization
            averageUtilization: 70  # Scale up when CPU utilization reaches 70%
      - type: Object
        object:
          name: requests-per-second #  Replace with your metric name (e.g., requests-per-second)
          resource:
            name: requests-per-second
            target:
              type: Average
              value: 100 #  Scale up when requests-per-second average is 100
    ```
* **Deployment Namespaces:** Ensure your HPA and Deployment are within the same namespace.
* **Labels & Selectors:** Correctly label your Deployment and use these labels in the HPA object to ensure accurate targeting.

**3. Configuring Dynamic Resource Allocation (DRA)**

* **Enable DRA:**  DRA is enabled by default for new Railway projects. You don't need to manually configure it. Railway automatically analyzes your application's resource usage patterns.
* **Observe DRA Metrics:**  Monitor the DRA metrics (CPU, Memory, Network I/O) within the Railway dashboard. These metrics provide insights into the effectiveness of DRA.
* **Fine-tuning (Advanced):**  While DRA is generally effective, you can manually adjust resource allocation limits within your Deployment's YAML, influencing how DRA operates. However, excessive manual tweaking can hinder DRA's ability to learn and adapt.

**4. Optimizing Metrics for Auto-Scaling**

* **Choose Relevant Metrics:** Don’t just rely on CPU.  Consider metrics that truly reflect your application's load:
    * **CPU Utilization:**  Good for general workload scaling.
    * **Memory Utilization:** Crucial for memory
