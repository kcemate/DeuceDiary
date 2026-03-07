# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-04T04:55:21.902502

## Railway Auto-Scaling Configuration Guide

This guide outlines how to configure automatic scaling for your applications on Railway, allowing your services to dynamically adjust resources based on demand, optimizing performance and cost.

**Understanding Railway Auto-Scaling**

Railway provides built-in auto-scaling for many services, particularly:

* **Containers (Docker):**  This is the most common and recommended method for scaling applications.
* **Serverless Functions (Node.js, Python, Go):**  Railway automatically scales based on invocation frequency.
* **Databases (PostgreSQL, MongoDB):**  Limited auto-scaling is available, focusing on read replicas and scaling based on connection counts.

**Key Concepts:**

* **Metrics:**  Railway monitors key metrics like CPU utilization, memory usage, network traffic, and request latency to determine scaling needs.
* **Thresholds:** You define acceptable thresholds for these metrics.  When a threshold is crossed, Railway takes action.
* **Scaling Policies:** These policies dictate what happens when a threshold is breached – adding or removing resources.
* **Scaling Groups:**  Railway manages scaling groups containing your deployed applications, allowing you to apply scaling policies consistently.
* **Cooldown Periods:**  After a scale-up or scale-down event, Railway waits a cooldown period before triggering another action to prevent rapid oscillation.

**Configuration Steps - Container Auto-Scaling (Most Common)**

This section focuses on the most common method – scaling containerized applications.

**1. Prerequisites:**

* **Railway Account:** You need a Railway account and a workspace.
* **Docker Image:** You have a Docker image built and pushed to a registry (e.g., Docker Hub, Railway Registry).
* **Application Configuration:** Your application is configured to handle multiple requests efficiently.

**2. Deploy Your Application:**

* **Using the Railway CLI:**
   ```bash
   rail deploy --image <your_docker_image> --name <your_app_name> --memory 1Gi --cpu 1
   ```
   * `--image`: The Docker image name.
   * `--name`: A unique name for your application.
   * `--memory`: The memory allocated to the container.  Increase this as needed.
   * `--cpu`: The CPU cores allocated to the container.
* **Using the Railway UI:**
   * Navigate to your workspace and click "Deploy" -> "From Image."
   * Select your Docker image and configure the deployment settings.

**3. Configure Auto-Scaling in the Railway UI:**

   * **Navigate to your App:** Go to your deployed application within the Railway UI.
   * **Go to Scaling:** Click on the "Scaling" tab.
   * **Enable Auto-Scaling:** Toggle the "Enable Auto-Scaling" switch to ON.
   * **Set Scaling Parameters:**
      * **CPU Threshold:**  The CPU utilization percentage that triggers a scale-up. (e.g., 70%)
      * **Memory Threshold:** The memory utilization percentage that triggers a scale-up. (e.g., 80%)
      * **Scale-Up Limit:** The maximum number of instances to scale to.  Consider your application's concurrency limits.
      * **Scale-Down Limit:** The minimum number of instances to maintain. Prevents rapid scaling down.
      * **Cooldown Period:** The time (in seconds) Railway waits after a scale-up or scale-down event before triggering another action.  (e.g., 60 seconds)
   * **Save Changes:** Click "Save" to apply the auto-scaling configuration.

**4. Monitoring and Adjusting:**

* **Scaling Events:**  The Railway UI will show you real-time scaling events as they occur.
* **Performance Metrics:**  Regularly monitor your
