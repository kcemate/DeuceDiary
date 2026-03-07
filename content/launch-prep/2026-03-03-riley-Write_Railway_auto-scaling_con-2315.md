# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-03T23:15:41.851962

## Railway Auto-Scaling Configuration Guide

This guide outlines how to configure auto-scaling for your applications on Railway, allowing your service to automatically adjust resources based on demand, optimizing performance and cost.

**Understanding Railway Auto-Scaling**

Railway’s auto-scaling relies primarily on **Horizontal Pod Autoscaling (HPA)** configured within your application's Kubernetes deployment.  Railway provides several layers to simplify this process:

* **Automatic HPA Setup:** Railway automatically detects the need for HPA based on metrics like CPU utilization or request latency and attempts to configure it.
* **Metrics Collection:** Railway collects relevant metrics from your applications to drive scaling decisions.  This includes CPU, memory, request latency, and more.
* **Pre-configured Scaling Policies:** Railway offers pre-configured scaling policies that you can customize.
* **Manual Control (Optional):** You can override Railway's automatic scaling decisions through the Railway UI.

**Key Concepts**

* **Kubernetes Deployment:** Your application code is deployed as a Kubernetes Deployment. HPA operates on these deployments.
* **Metrics:**  Railway collects metrics from your application. Common metrics used for scaling include:
    * **CPU Utilization:** The percentage of CPU resources being used.
    * **Memory Utilization:** The percentage of memory being used.
    * **Request Latency:** The time taken to process requests.  This is a crucial metric for scaling based on load.
    * **Requests per Second (RPS):**  A measure of incoming traffic.
* **HPA (Horizontal Pod Autoscaler):**  A Kubernetes resource that automatically scales the number of pods in a deployment based on configured metrics and target values.
* **Scaling Policies:**  Rules defined in the HPA that dictate when and how many pods to scale.  Railway provides pre-configured policies but you can create your own.


**Steps to Configure Auto-Scaling on Railway**

**1. Application Deployment:**

* **Deploy Your App:**  Deploy your application to Railway using your preferred method (Railway CLI, Web UI, GitHub integration, etc.).  Ensure your application is running within a Kubernetes environment.
* **Verify Deployment:**  Use the Railway UI to inspect your deployment and confirm it's running properly.

**2.  Railway Automatic HPA Detection (Initial Setup)**

* **Let Railway Work:**  Initially, let Railway attempt to auto-detect and configure HPA for your deployment. It will monitor your application's metrics.
* **Monitor in the UI:**  In the Railway UI, navigate to your application's dashboard. You should see a section indicating that HPA is being monitored and configured.

**3.  Customize Scaling Policies (Recommended)**

* **Navigate to HPA Configuration:**  Within your application's dashboard, find the "Scaling Policies" section.
* **Choose a Pre-configured Policy:** Railway offers several pre-configured policies, like:
    * **CPU-Based:** Scales based on CPU utilization.
    * **Request Latency-Based:** Scales based on request latency.
    * **RPS-Based:** Scales based on requests per second.
* **Adjust Parameters:** For each pre-configured policy, you can adjust the following:
    * **Metric:** The metric used for scaling (CPU, latency, RPS, etc.).
    * **Target Value:** The desired value of the metric (e.g., CPU utilization of 70%).
    * **Scale Up/Down:** The number of pods to add or remove when the target value is exceeded or not met.
    * **Cooldown Period:** The time (in seconds) that the autoscaler waits after a scaling event before considering another scaling action. This prevents rapid, unnecessary scaling.
* **Save the Policy:**  Save your changes to apply the new scaling policy.

**
