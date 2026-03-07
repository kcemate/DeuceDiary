# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-03T14:34:51.446339

## Railway Auto-Scaling Configuration Guide

This guide outlines how to configure auto-scaling for your applications on Railway, allowing your services to dynamically adjust resources based on demand, ensuring optimal performance and cost-efficiency.

**Understanding Railway's Auto-Scaling**

Railway’s auto-scaling relies on:

* **Metrics Monitoring:** Railway monitors your application's metrics (CPU usage, memory usage, network I/O, etc.) via integration with Prometheus.
* **Scaling Policies:** You define policies that determine when and how your application scales up or down. These policies are configured via the Railway UI and YAML files.
* **Horizontal Pod Autoscaler (HPA):**  Railway utilizes the HPA, a Kubernetes feature, to automatically adjust the number of Pods running your application.
* **Cost Optimization:** By scaling down during low-traffic periods, you can significantly reduce your Railway costs.

**Steps to Configure Auto-Scaling:**

**1. Ensure Your Application Supports HPA:**

* **Kubernetes-Based Applications:** Most modern applications deployed on Railway using Docker containers and Kubernetes will naturally support HPA.
* **Static Websites:**  While simpler, static websites can benefit from minimal scaling. Consider a serverless solution (like Railway's Static Files) for truly automatic scaling of traffic.
* **Applications Without Kubernetes:**  Railway supports direct deployments without Kubernetes. However, HPA won’t be directly applicable. You’ll need to consider alternative scaling strategies (e.g., using a serverless function that scales automatically based on traffic).

**2.  Install Prometheus (If Not Already Done):**

* Railway automatically installs Prometheus to monitor your services.  You can verify this by navigating to your project in the Railway UI. If it's missing, you'll need to add it as a dependency within your project's `railway.yml` file.

**3. Configure Scaling Policies (Railway UI):**

   This is the primary way to define your auto-scaling behavior.

   * **Navigate to your Project:** In the Railway UI, select your project.
   * **Go to “Scalability”:**  Click on the “Scalability” tab.
   * **Select Your Service:** Choose the service you want to scale.
   * **Configure Scaling Policies:**
      * **Scale Up:**  Define the conditions under which your application should scale up. You can set the following:
         * **Metric:**  Choose the metric to monitor (e.g., CPU Utilization, Memory Utilization, Request Latency).
         * **Threshold:**  The value the metric must exceed before scaling up occurs. (e.g., CPU utilization > 70%).
         * **Interval:**  How frequently Railway checks the metric.
         * **Minimum Instances:** The minimum number of instances your application should always have.
         * **Maximum Instances:** The maximum number of instances your application can scale to.
      * **Scale Down:** Define conditions under which your application should scale down. Similar options as Scale Up are available.
      * **Cooldown:**  Sets a period after a scaling event to prevent rapid scaling.  This helps stabilize your application and prevents oscillations. (e.g., 30 seconds - 5 minutes)


**4.  YAML Configuration (Advanced - for Fine-grained Control):**

   For more complex scaling scenarios, you can manually create and edit YAML files for your service.  This offers more control over the HPA configuration.

   * **`railway.yml` (or equivalent) -  For HPA Configuration:**
      Within your `railway.yml` file (or the equivalent file used to define your service), you can define specific HPA settings:

      ```yaml
      autoscaling:
        enabled: true
        minReplicas:
