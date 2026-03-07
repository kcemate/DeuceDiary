# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-04T09:50:12.648781

## Railway Auto-Scaling Configuration Guide

This guide outlines how to configure auto-scaling for your applications running on Railway, maximizing resource utilization and ensuring performance under varying loads.

**1. Understanding Railway's Auto-Scaling Capabilities**

Railway leverages Kubernetes as its underlying orchestration layer, providing built-in auto-scaling capabilities. Here’s what you need to know:

* **Horizontal Pod Autoscaler (HPA):** This is the core of Railway's auto-scaling. It automatically scales the number of pods (containers) running your application based on observed resource utilization (CPU, Memory, etc.).
* **Metrics:** HPA relies on metrics collected by Prometheus and its agents. Railway automatically installs and manages these agents on your services.
* **Scaling Rules:** You define the rules that trigger scaling actions. These rules specify:
    * **Metric:** Which metric to monitor (CPU, Memory, Custom Metrics).
    * **Target Value:** The desired value for the metric.
    * **Minimum & Maximum Replicas:** The minimum and maximum number of pods allowed.
* **Slow Start:**  HPA incorporates a 'slow start' period, allowing it to gradually scale up to avoid erratic behavior in response to transient spikes.
* **Resource Requests & Limits:**  Setting appropriate resource requests and limits is *crucial* for effective auto-scaling.

**2. Configuring Auto-Scaling Steps**

**Step 1: Deploy Your Application**

* Deploy your application to Railway as usual. This typically involves pushing your code to a Git repository and defining the desired service configuration.

**Step 2:  Verify Metrics Collection**

* Railway automatically installs the Prometheus agent on your service.
* **Check Prometheus UI:** Go to the Prometheus UI (accessible from your Railway dashboard) to confirm that metrics are being collected for your application.  You should see metrics related to your application’s CPU usage, memory usage, and potentially network traffic.

**Step 3:  Define the HPA**

There are several ways to configure the HPA:

* **Railway UI (Recommended for Simplicity):**
    * Navigate to your service in the Railway dashboard.
    * Go to the “Scaling” tab.
    * Click "Add HPA."
    *  You'll be presented with a form to configure the HPA:
        * **Metric:** Choose `CPU` or `Memory` (or potentially custom metrics if configured).
        * **Target Value:** Set the desired CPU or memory utilization percentage (e.g., 70% for CPU, 80% for Memory). Start with conservative values.
        * **Minimum Replicas:** The minimum number of pods to keep running (e.g., 1).
        * **Maximum Replicas:** The maximum number of pods to scale to (e.g., 10).
        * **Slow Start:** Toggle the ‘slow start’ feature. Typically, leave it enabled.
* **Kubernetes Manifest (For Advanced Users):**
    * You can define an HPA manifest (YAML) directly within your service’s configuration. This provides more control but requires understanding of Kubernetes HPA concepts. Railway will automatically apply this manifest.

**Example HPA YAML (for CPU):**

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
