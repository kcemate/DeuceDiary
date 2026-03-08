# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-07T15:50:08.824166

## Railway Auto-Scaling Configuration Guide: Scaling Your Applications Effortlessly

This guide outlines how to configure auto-scaling for your applications deployed on Railway, allowing your platform to dynamically adjust resources based on demand, ensuring optimal performance and cost efficiency.

**1. Understanding Railway's Auto-Scaling Capabilities**

Railway utilizes a combination of strategies to handle auto-scaling:

* **Horizontal Pod Autoscaling (HPA) with Kubernetes:** This is the core of Railway's scaling. Railway automatically scales the number of Pods running your application based on metrics like CPU usage, memory usage, and custom metrics.
* **Cloud Provider Scaling (AWS, Google Cloud, Azure):** Railway leverages the auto-scaling features of the underlying cloud provider (AWS, Google Cloud, or Azure) to automatically scale the underlying compute instances (EC2, GCE, VMs) running your application.
* **Rate Limiting (Optional):** Railway can enforce rate limits to prevent sudden spikes in traffic from overwhelming your application.


**2. Prerequisites**

* **Railway Account:** You need an active Railway account.
* **Application Deployed:**  Your application must be successfully deployed to Railway.
* **Kubernetes Configuration (yaml):** You’ll need a Kubernetes deployment YAML file defining your application. Railway expects this to be configured correctly for HPA to work effectively.
* **Understanding of Metrics:** You need to understand which metrics are relevant to your application and how they’re being monitored.


**3. Configuring Auto-Scaling – Key Steps**

**Step 1: Configure Kubernetes Deployment YAML**

This is the most crucial step. Railway relies on this YAML file to determine how your application is structured and how to scale it. Here's what to consider:

* **CPU and Memory Requests & Limits:**  This is *essential*. Railway uses these to determine when to scale.  
    * **Requests:**  The minimum amount of CPU and memory your Pod needs to function.
    * **Limits:** The maximum amount of CPU and memory your Pod can use.
    * **Setting Realistic Values:**  Start with reasonable requests and limits based on your application's typical usage.  Monitor and adjust as needed.
* **Readiness and Liveness Probes:** Configure probes to ensure only healthy Pods are scaled. Improperly configured probes can lead to unnecessary scaling or the inability to scale up when needed.
* **Resource Names (Namespaces & Pods):**  Use meaningful names for your namespaces and Pods.

**Example YAML Snippet (Illustrative):**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
  labels:
    app: my-app
spec:
  replicas: 1  # Starting with one replica
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
            cpu: "500m"  # 0.5 CPU cores
            memory: "512Mi" # 512 MB of RAM
          limits:
            cpu: "1"   # 1 CPU core
            memory: "1Gi" # 1 GB of RAM
        readinessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 10
          periodSeconds: 10
        livenessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5
