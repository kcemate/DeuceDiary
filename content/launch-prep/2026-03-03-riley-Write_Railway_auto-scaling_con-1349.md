# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-03T13:49:39.099464

## Railway Auto-Scaling Configuration Guide: Scaling Your Applications Automatically

This guide outlines how to configure auto-scaling for your applications deployed on Railway, allowing your services to dynamically adjust resources based on demand. Railway simplifies auto-scaling significantly with its integrated features and intuitive interface.

**1. Understanding Railway's Auto-Scaling**

* **Automatic Scaling:** Railway monitors your application's performance (CPU, memory, network I/O) and automatically scales up or down the number of replicas based on defined thresholds.
* **Horizontal Scaling:** Railway primarily focuses on horizontal scaling – adding more instances of your service – to handle increased load.
* **Service Level Objectives (SLOs):**  Railway uses SLOs to determine when scaling should occur. These SLOs represent acceptable performance metrics (e.g., latency, error rate).
* **Cost Optimization:** Auto-scaling helps optimize costs by only consuming resources when needed.

**2. Prerequisites**

* **Deployed Application:** You need an application already deployed on Railway.
* **Railway Account:**  You'll need a Railway account with appropriate permissions to manage your application.
* **Understanding Your Application:**  Knowing how your application behaves under load (CPU usage, memory consumption, response times) is crucial for effective auto-scaling.


**3. Configuring Auto-Scaling Through the Railway UI**

This is the recommended and easiest way to set up auto-scaling.

* **Navigate to your Service:**  In the Railway UI, go to your deployed application service.
* **Go to the "Scaling" Tab:** Click the "Scaling" tab within your service's settings.
* **Enable Auto-Scaling:** Toggle the "Auto-Scale" switch to "On."
* **Configure Scaling Parameters:** This is where you define how Railway should scale your application:
    * **Minimum Replicas:** The smallest number of instances Railway will keep running, even if there's no traffic. (Typically, set this to 1 for single-instance applications).
    * **Maximum Replicas:** The maximum number of instances Railway will allow your application to run.  Be mindful of your budget and resources.
    * **Scaling Interval:** How often Railway checks your application's performance (e.g., every 15 seconds, 5 minutes).  Shorter intervals mean quicker responses to load changes, but can also lead to unnecessary scaling.
    * **Scaling Thresholds:** This is the core of auto-scaling. Configure these thresholds to trigger scaling events.
        * **CPU Utilization:**  The percentage of CPU usage that triggers scaling.
        * **Memory Utilization:** The percentage of memory usage that triggers scaling.
        * **Request Latency:** The maximum acceptable latency for requests (e.g., 200ms).
        * **Error Rate:** The maximum acceptable percentage of failed requests (e.g., 1%).
    * **Scale-Out Policy:** Defines how Railway scales *up* (adds replicas).
    * **Scale-In Policy:** Defines how Railway scales *down* (removes replicas).
* **Save Changes:**  Click "Save" to apply your auto-scaling configuration.

**Example Configuration:**

| Parameter          | Value          |
|--------------------|----------------|
| Minimum Replicas  | 1              |
| Maximum Replicas  | 10             |
| Scaling Interval    | 60 seconds     |
| CPU Utilization    | 70%            |
| Memory Utilization | 80%            |
| Request Latency    | 300ms          |
| Error Rate          | 2%             |


**4. Monitoring Auto-Scaling**

* **Scaling Tab:**  The "Scaling" tab in your service's settings shows real-time
