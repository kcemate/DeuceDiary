# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-04T11:43:29.136654

## Railway Auto-Scaling Configuration Guide

This guide outlines how to configure automatic scaling for your Railway applications, ensuring they can handle varying workloads and remain responsive. Railway's auto-scaling utilizes the Horizontal Pod Autoscaler (HPA) and the Kubernetes Scheduler to dynamically adjust your application's resources.

**1. Understanding the Basics**

* **Horizontal Pod Autoscaler (HPA):**  The core component for auto-scaling. It monitors metrics (CPU, memory, custom metrics) and automatically scales the number of pods in your deployment based on those metrics.
* **Kubernetes Scheduler:** Railway's Kubernetes cluster automatically schedules your pods based on resource requests and available capacity. The HPA integrates with the Scheduler to intelligently place new pods.
* **Railway Metrics:** Railway provides a built-in metrics system for your application, making it easy to use for HPA.
* **Resource Requests & Limits:** You need to define *resource requests* for your pods. These are the minimum resources a pod *needs* to operate. The Scheduler uses these requests to determine where to place pods.  You can also set *resource limits*, which represent the maximum resources a pod can consume.  It's crucial for cost optimization and stability.

**2. Configuring Your Application for Auto-Scaling**

* **Define Resource Requests & Limits:** This is the most critical step.  
    * **CPU:**  Start with a reasonable CPU request based on your application’s typical workload.  Err on the side of slightly over-requesting initially to avoid throttling.
    * **Memory:**  Similarly, estimate the memory your application needs.  Monitor memory usage during peak periods and adjust requests accordingly.
    * **Example (YAML):**
      ```yaml
      apiVersion: apps/v1
      kind: Deployment
      metadata:
        name: my-app
      spec:
        replicas: 1  # Initial number of replicas
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
              image: your-image:latest
              resources:
                requests:
                  cpu: "500m"  # 0.5 CPU core
                  memory: "512Mi" # 512MB
                limits:
                  cpu: "1000m" # 1 CPU core
                  memory: "1Gi"  # 1 GB
      ```

* **Expose Metrics for HPA:**  Railway automatically collects standard metrics like CPU and memory. However, for more granular control and custom scaling, you should expose your application's metrics using a metrics server or a monitoring solution like Prometheus.

    * **Prometheus:** The most common choice.  You'll need to install Prometheus and configure it to scrape metrics from your application. Railway simplifies this process, offering pre-configured Prometheus deployments.
    * **Railway Metrics:**  Railway's built-in metrics are sufficient for basic scaling based on CPU and memory.

* **Deploy a HPA:** You'll create a HPA that tells Kubernetes *how* to scale based on your chosen metrics.
    * **Example (YAML):**
      ```yaml
      apiVersion: autoscaling/v2
      kind: HorizontalPodAutoscaler
      metadata:
        name: my-app-hpa
      spec:
        scaleTargetRef:
          apiVersion: apps/v1
          kind: Deployment
          name: my-app
        minReplicas: 1
        maxReplicas: 10  # Maximum number of replicas
        metrics:
        - type: Resource
