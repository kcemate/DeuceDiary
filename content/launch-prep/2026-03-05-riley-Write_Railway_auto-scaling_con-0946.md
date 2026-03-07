# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-05T09:46:45.901609

## Railway Auto-Scaling Configuration Guide

This guide outlines how to configure auto-scaling for your applications on Railway, enabling your service to automatically adjust its resources based on demand, optimizing for cost and performance.

**Understanding Railway Auto-Scaling**

Railway offers auto-scaling primarily through its **Container Autoscaler (CA)**. This CA automatically scales your Container deployments based on metrics like CPU utilization, memory usage, and sometimes custom metrics you can provide.  It leverages Kubernetes under the hood for its scaling logic.

**1. Prerequisites**

* **Railway Account:** You'll need an active Railway account.
* **Container Deployment:** You should already have a Container deployment running on Railway.
* **Metrics Enabled:** Your Container needs to expose the metrics that the CA will use for scaling.  This generally means setting up a Prometheus endpoint.
* **Service Monitoring (Recommended):** While not strictly required, monitoring your application's performance through Railway's built-in dashboard and/or external monitoring tools will give you more context and help you tune your auto-scaling configuration.


**2. Setting Up Container Autoscaler (CA)**

There are two primary ways to configure the CA:

* **Railway UI:** This is the simplest method and suitable for basic setups.
* **Railway CLI:** Provides more granular control and scripting capabilities.

**2.1. Railway UI Configuration (Recommended for Beginners)**

1. **Navigate to your Container:** Go to your Container's page on Railway.
2. **Select "Auto-Scaling":**  Click the "Auto-Scaling" tab.
3. **Enable Auto-Scaling:** Toggle the "Auto-Scaling" switch to "On."
4. **Configure Scaling Policies:**  You'll see a set of pre-defined scaling policies:
   * **CPU:** Scales based on CPU utilization.
   * **Memory:** Scales based on memory usage.
   * **Custom:** Allows you to define a custom scaling policy based on any metric exposed via Prometheus.
5. **Set Scaling Parameters:**  For each policy you choose, configure these parameters:
   * **Scale Thresholds:**  Define the thresholds that trigger scaling up (Higher) or down (Lower).  You can set different thresholds for each.
   * **Cooldown Period:**  This determines how long Railway waits after a scale event (up or down) before triggering another one. This prevents rapid, disruptive scaling.
   * **Minimum and Maximum Instances:**  Set the minimum and maximum number of Container instances Railway will maintain.
6. **Save Changes:** Click "Save" to apply your auto-scaling configuration.

**2.2. Railway CLI Configuration**

The CLI offers more precise control and is best for more advanced users or automation.

1. **Install the Railway CLI:** If you haven't already, install the Railway CLI.
2. **Authenticate:**  `railway up` to authenticate with your Railway account.
3. **Set the Container:** `railway container set <container_name>` (Replace `<container_name>` with the name of your Container)
4. **Enable Auto-Scaling:** `railway container autoscaling enable`
5. **Configure Policies:**  Use the `railway container autoscaling policy set` command to define your scaling policies.  Here's a basic example (adapt to your needs):

   ```bash
   railway container autoscaling policy set --name cpu --min 1 --max 5 --threshold 70 --cool_down 300
   railway container autoscaling policy set --name memory --min 1 --max 5 --threshold 80 --cool_down 300
   ```

   * `--name`: The name of the scaling policy (e.g., `cpu`, `memory`).
