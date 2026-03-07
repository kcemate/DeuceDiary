# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-06T13:53:08.078939

## Railway Auto-Scaling Configuration Guide: Scaling Your Applications Seamlessly

Railway’s auto-scaling capabilities allow your applications to dynamically adjust resources based on demand, ensuring optimal performance and cost efficiency. This guide outlines how to configure auto-scaling for your applications on Railway.

**1. Understanding Railway's Auto-Scaling**

* **Horizontal Pod Autoscaling (HPA):** Railway leverages HPA from Kubernetes to automatically scale your application’s pods.
* **Metrics-Based Scaling:** HPA scales based on metrics collected from your application, primarily CPU utilization and memory usage.
* **Time-Based Scaling:** You can define scaling rules based on specific times of day or days of the week, regardless of traffic.
* **Scaling Events:**  Railway automatically triggers scaling events when it detects significant changes in your application's resource usage.
* **Cost Optimization:**  Auto-scaling helps you avoid over-provisioning, minimizing your Railway bill.

**2. Enabling Auto-Scaling**

Auto-scaling is enabled by default for most Railway applications. However, you need to ensure your application is configured correctly to provide metrics that HPA can use.

* **Container Images:**  Ensure your container image is properly set up to expose metrics.
* **Metrics Collection:**  This is the most crucial step! Your application *must* expose metrics in a format HPA can understand.

**3. Configuring Metrics Collection - The Key to Success**

This is where you'll spend most of your time. Railway uses Prometheus as its metrics collection system.  Here's how to get Prometheus scraping your application:

* **Install Prometheus Agent:** Railway automatically installs a Prometheus Agent on each Service. This agent collects metrics from your services.
* **Expose Metrics via an HTTP Endpoint:** Your application *must* expose its metrics via an HTTP endpoint that Prometheus can scrape.  This is typically done by running a metric server within your container.
    * **Prometheus Server:** Railway's agent automatically runs a Prometheus server that collects metrics.
    * **OpenTelemetry (Recommended):** Utilizing OpenTelemetry is the best practice for exporting metrics from your application. It offers standardized instrumentation and supports various backends including Prometheus.
    * **Existing Metrics Servers:** If you're already running a metrics server (like Node Exporter, Datadog Agent, etc.), ensure it’s configured to expose metrics on port 9090 and accessible from the Prometheus Agent.

**4. Defining Auto-Scaling Rules (HPA Configuration)**

You can define HPA rules to control how your application scales.  There are a few ways to do this:

* **Railway UI (Simple Configuration):**
    * Go to your Service's "Scaling" tab.
    * **Minimum Replicas:**  Sets the minimum number of pods that will always be running.
    * **Maximum Replicas:**  Sets the maximum number of pods that will be running.
    * **Scale Metric:** Select "CPU" or "Memory".
    * **Scale Thresholds:**  Define the thresholds for scaling up (e.g., CPU > 70%) and scaling down (e.g., CPU < 30%).
    * **Cooldown Period:** Sets how long it takes for the scaling to revert after a change.
* **Kubernetes Manifest (Advanced Configuration - YAML):**
    * You can directly edit your application's Kubernetes manifest to include HPA definitions.  This gives you full control over the scaling rules.  Here's an example YAML snippet:

    ```yaml
    apiVersion: apps/v1
    kind: HorizontalPodAutoscaler
    metadata:
      name: my-app-hpa
      namespace: my-app-namespace
    spec:
      scaleTargetRef:
        apiVersion:
