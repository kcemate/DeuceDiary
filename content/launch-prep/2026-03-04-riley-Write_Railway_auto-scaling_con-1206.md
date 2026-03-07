# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-04T12:06:13.913576

## Railway Auto-Scaling Configuration Guide

This guide outlines how to configure auto-scaling for your applications running on Railway. Railway provides robust scaling capabilities, allowing your applications to automatically adjust their resources based on demand.  This ensures optimal performance and cost efficiency.

**1. Understanding Railway’s Scaling Features**

* **Horizontal Scaling:** Railway primarily utilizes horizontal scaling – adding more instances of your application to handle increased load.
* **Metrics-Based Scaling:** Railway monitors key metrics like CPU usage, memory usage, network I/O, and custom metrics provided by your application.  You define scaling rules based on these metrics.
* **Automatic Scaling:**  Railway automatically spins up or scales down instances based on these rules without manual intervention.
* **Rolling Updates:** Railway supports rolling updates, which allow you to deploy new versions of your application without downtime.  Scaling often happens in conjunction with rolling updates.

**2. Setting Up Scaling Rules – `scaling.yaml`**

The core of Railway's auto-scaling is the `scaling.yaml` file. This file resides within the root directory of your application and contains the rules that drive scaling decisions.

Here's a breakdown of the key sections and options:

**a) `default` (Global Scaling Rules):**

These rules apply to all instances of your application if no more specific rules are defined.

```yaml
default:
  # Threshold for scaling up (e.g., CPU utilization > 70%)
  cpu_threshold: 70
  # Scaling interval (in seconds) - how often Railway checks the metrics.
  interval: 60
  # Scaling amount (number of instances to add or remove)
  scale_amount: 1
  # Minimum number of instances to maintain (prevents runaway scaling)
  min_instances: 1
  # Maximum number of instances to scale to (limits cost)
  max_instances: 10
  # Metric to use for scaling -  can be CPU, memory, or a custom metric.
  metric: cpu
```

**b) `instances` (Instance-Specific Scaling Rules):**

You can create instance-specific rules to tailor scaling based on different environments (e.g., production vs. staging).

```yaml
instances:
  production:
    cpu_threshold: 80 # Higher threshold for production
    scale_amount: 2  # Scale by 2 instances
    min_instances: 2
    max_instances: 20
    metric: cpu
  staging:
    cpu_threshold: 50 # Lower threshold for staging
    scale_amount: 0.5 # Scale by 0.5 instances (half an instance)
    min_instances: 1
    max_instances: 5
    metric: cpu
```

**3.  Key YAML Options Explained**

* **`cpu_threshold`:**  The CPU utilization percentage that triggers a scaling event.
* **`interval`:** How often Railway checks the metrics. Lower intervals mean faster scaling but potentially more load on your application.  A good starting point is 60 seconds.
* **`scale_amount`:** The number of instances to add or remove when the threshold is reached.  Consider using fractions (e.g., 0.5) for fine-grained scaling.
* **`min_instances`:** The minimum number of instances to keep running, even if traffic is low. This prevents excessive scaling and cost.
* **`max_instances`:** The maximum number of instances Railway will allow your application to scale to. This is crucial for cost control.
* **`metric`:** The metric to use for scaling. Supported metrics:
    * `cpu`: CPU utilization
    *
