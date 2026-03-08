# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-07T16:35:32.894118

## Railway Auto-Scaling Configuration Guide

This guide outlines how to configure auto-scaling for your applications on Railway, ensuring optimal performance and cost efficiency. Railway handles a lot of the underlying infrastructure, but you, as the developer, need to tell it *how* to scale.

**Understanding Railway's Auto-Scaling**

Railway’s auto-scaling is primarily driven by **KEDA (Kubernetes Event-Driven Autoscaling)**.  KEDA uses metrics from your application to determine when to scale up or down, giving you control over how responsive your application is to load changes.

**Key Components:**

* **Your Application:** This needs to expose metrics that KEDA can monitor.  Common metrics include CPU utilization, memory usage, request counts, or custom metrics exposed by your application.
* **KEDA:** A Kubernetes operator that automatically scales deployments based on configured metrics and scaling policies.
* **Railway’s Kubernetes Cluster:** Railway manages the underlying Kubernetes cluster and KEDA deployment within it.


**Steps to Configure Auto-Scaling:**

**1. Expose Application Metrics:**

* **Metrics Server:** Railway utilizes the Metrics Server for collecting CPU and memory usage metrics. Ensure your application is compatible with the Metrics Server.
* **Prometheus:**  For more granular metrics and custom metrics, the recommended approach is to use Prometheus. Railway can automatically deploy a Prometheus instance for you.
* **Custom Metrics:** If your application has specific metrics (e.g., queue size, message count), you'll need to instrument your code to expose them as metrics that Prometheus can scrape.  Libraries like Prometheus client libraries are commonly used.
* **HTTP Endpoint (For basic request counts):**  You can use a simple HTTP endpoint that returns the number of requests processed by your application.  This is a basic but often effective method.

**2. Create a KEDA Scaler:**

* **Railway UI:**  The easiest way to create a KEDA scaler is through the Railway UI.
    * Navigate to your application's "Scalers" section.
    * Click “Add Scaler”.
    * Choose “KEDA” as the scaler type.
* **YAML Configuration (Advanced):** You can also define the scaler using a YAML file. This is ideal for version control and reproducibility.  Here's a template YAML file you can adapt:

```yaml
apiVersion: keda.sh/v1beta1
kind: Scaler
metadata:
  name: my-app-scaler
  namespace: railway-default  # or your namespace
spec:
  selector:
    matchLabels:
      app: my-app
  triggers:
  - type: prometheus
    # Replace with your Prometheus instance name in Railway
    // This is auto-detected in Railway, so explicitly setting it isn't necessary.
    # probeUrl: "/metrics" #Example Prometheus URL - Railway provides this automatically
    # restartIntervalSeconds: 30
  scaleUp:
    maxReplicaCount: 5   # Maximum number of replicas
    # Initial replicas can be left at 1 or set to 0 for instant scaling.
  scaleDown:
    minReplicaCount: 1
    # Optional:  Delay the scaleDown by a few seconds
    # delayAfterScaleDownPeriodSeconds: 60
```

**Explanation of YAML Fields:**

* `metadata.name`: A unique name for your scaler.
* `metadata.namespace`: The namespace where the scaler will be deployed.  `railway-default` is the default.
* `spec.selector.matchLabels`: Defines how KEDA identifies the deployments it should scale.  Crucially, this should match the labels on your application’s Kubernetes deployment.
* `spec.triggers`:  Spec
