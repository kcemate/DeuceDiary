# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-03T07:25:26.279662

## Railway Auto-Scaling Configuration Guide - Maximizing Performance & Cost Efficiency

This guide outlines how to configure auto-scaling for your applications deployed on Railway, optimizing for performance and minimizing costs. Railway's auto-scaling leverages Kubernetes, allowing you to dynamically adjust your application's resources based on demand.

**1. Understanding Railway's Auto-Scaling Capabilities**

* **Kubernetes-Based:** Railway utilizes Kubernetes as its orchestration layer, providing the foundation for auto-scaling.
* **Horizontal Pod Autoscaler (HPA):** This is the core mechanism. HPA automatically scales the number of pods (your application containers) running based on observed CPU or memory usage.
* **Metrics:** Railway automatically collects resource metrics from your applications. This data is used by the HPA.
* **Predefined & Custom Metrics:** You can utilize both predefined metrics (CPU, Memory) and potentially custom metrics based on your application's specific needs.
* **Cool-down Periods:** HPA includes cool-down periods to prevent rapid scaling oscillations and ensure stability.


**2. Configuration Steps - Setting Up Auto-Scaling**

**Step 1: Deployment Configuration**

* **Resource Requests & Limits:**  This is *critical* for HPA to work effectively.  When you define your deployment in Railway, **always** specify `resources` for each container:
    * **`requests`:** The minimum amount of CPU and memory the pod *requires* to function. This is the baseline for scaling.
    * **`limits`:** The maximum amount of CPU and memory the pod can *use*. This prevents runaway processes from consuming all resources and impacting other applications.

   ```yaml
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: my-app
   spec:
     replicas: 1  # Initial number of pods
     selector:
       matchLabels:
         app: my-app
     template:
       metadata:
         labels:
           app: my-app
       spec:
         containers:
         - name: my-app-container
           image: your-docker-image:latest
           resources:
             requests:
               cpu: "100m"   # 0.1 CPU core (adjust based on needs)
               memory: "128Mi"  # 128MB RAM (adjust based on needs)
             limits:
               cpu: "500m"   # 0.5 CPU core (adjust based on needs)
               memory: "512Mi"  # 512MB RAM (adjust based on needs)
   ```
   * **Important:** Start with modest `requests` and `limits`.  Monitor the application's behavior and adjust these values based on real usage.

**Step 2:  Define the HPA**

You can configure the HPA using Railway's web UI, or using YAML definitions. The YAML approach offers more control and repeatability.

* **Railway Web UI (Simplest):**
    1. Navigate to your app's page on Railway.
    2. Select "Scale" from the left navigation.
    3. Choose "Horizontal Autoscaling."
    4. Configure:
        * **Metric:** Select "CPU" or "Memory" (or a custom metric if defined).
        * **Target CPU/Memory Utilization:**  Set the percentage of CPU/Memory you want to target (e.g., 70% for CPU, 80% for Memory). This is your *scale target*.
        * **Min Replicas:** The minimum number of pods the HPA will always maintain.
        * **Max Replicas:** The maximum number of pods the HPA will
