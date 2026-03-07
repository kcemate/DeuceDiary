# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-03T07:47:54.560861

## Railway Auto-Scaling Configuration Guide

This guide outlines how to configure auto-scaling for your applications hosted on Railway. Auto-scaling dynamically adjusts the number of instances running your application based on demand, ensuring optimal performance and cost efficiency.

**1. Understanding Railway's Auto-Scaling Capabilities**

* **Metrics-Based Scaling:** Railway uses a combination of metrics to determine scaling events. Key metrics include:
    * **CPU Utilization:** High CPU usage is a primary trigger for scaling up.
    * **Memory Utilization:** Similar to CPU, high memory usage can trigger scaling.
    * **Request Rate:** Increased incoming requests often indicate increased demand.
    * **Queue Length (for Worker Processes):** If your app utilizes worker processes, queue length will be a key metric.
* **Horizontal Scaling:** Railway primarily supports horizontal scaling - adding more instances of your application.
* **Rolling Updates:** Railway automatically manages rolling updates during scaling, minimizing downtime.
* **Predictive Scaling (Premium Tier):**  With Railway Premium, you can leverage predictive scaling based on historical traffic patterns for even more proactive scaling.

**2. Configuring Auto-Scaling via the Railway UI**

This is the most common and easiest method.

* **Navigate to Your App:** Go to the Railway dashboard and select the application you want to scale.
* **Go to the "Scaling" Tab:** In the left-hand navigation, click on the "Scaling" tab.
* **Scaling Parameters:** Here you’ll find the following settings:
    * **Minimum Instances:** The smallest number of instances Railway will keep running. Setting this too low can lead to slow response times during spikes.
    * **Maximum Instances:** The largest number of instances Railway will scale up to. Be mindful of your budget and resources.
    * **Scaling Sensitivity (CPU):**  This determines how sensitive Railway is to CPU usage.  Lower values trigger scaling more aggressively. (Ranges from 0 - 100)
    * **Scaling Sensitivity (Memory):** Similar to CPU, this controls sensitivity to memory usage. (Ranges from 0 - 100)
    * **Scaling Sensitivity (Requests):** How responsive Railway is to an increase in request rate. (Ranges from 0 - 100)
    * **Cool-down Period:** The time (in seconds) after a scaling event before another scaling event can occur. This prevents constant up-and-down scaling. (Ranges from 30 - 300 seconds)
* **Save Changes:**  Click “Save” to apply your scaling configuration.

**3. Configuring Auto-Scaling via the Railway CLI**

The CLI offers more control and automation options.

* **Install the Railway CLI:** Follow the instructions at [https://railway.app/docs/cli](https://railway.app/docs/cli)
* **Configure your CLI:** Authenticate with your Railway account using `railway up login`.
* **Set Scaling Parameters:** Use the `railway apps scale` command:

   ```bash
   railway apps scale <app-name> --min <min-instances> --max <max-instances> --cpu-sensitivity <sensitivity> --memory-sensitivity <sensitivity> --request-sensitivity <sensitivity> --cool-down <seconds>
   ```

   * Replace `<app-name>` with the name of your Railway app.
   * Replace `<min-instances>`, `<max-instances>`, and `<seconds>` with the desired values.
   * `<sensitivity>` values are between 0 and 100.

   **Example:**

   ```bash
   railway apps scale my-app --min 1 --max 5 --cpu-sensitivity 60 --memory-sensitivity 60 --request-sensitivity 80
