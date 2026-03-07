# Write Railway auto-scaling configuration guide.
Agent: riley
Generated: 2026-03-04T13:36:56.381673

## Railway Auto-Scaling Configuration Guide

This guide outlines how to configure automatic scaling for your applications running on Railway. Railway's auto-scaling system automatically adjusts the resources allocated to your services based on demand, optimizing costs and ensuring responsiveness.

**1. Understanding Railway's Auto-Scaling**

* **Dynamic Scaling:** Railway utilizes a dynamic scaling strategy, meaning it adapts to actual load rather than predefined thresholds. This is generally more efficient than static scaling.
* **Metrics-Based:** Railway primarily relies on metrics like CPU utilization, memory usage, and network I/O to determine scaling needs.
* **Scaling Limits:** There are limitations to the scale you can achieve, dependent on your Railway plan and the service type.
* **Cool Down Periods:**  After scaling up or down, Railway applies a "cool down" period before making further adjustments to avoid excessive fluctuations.

**2. Prerequisites**

* **Railway Account:**  You'll need an active Railway account.
* **Service Running:** You need an application (service) already deployed and running on Railway.
* **Monitoring Enabled:**  Railway automatically collects metrics for your service. However, for more granular control and insights, you can enable and configure monitoring tools like Prometheus or Grafana.

**3. Configuring Auto-Scaling – The Railway UI**

The easiest way to configure auto-scaling is through the Railway UI:

1. **Navigate to Your Service:** In the Railway UI, select the service you want to scale.
2. **Go to the "Scaling" Tab:** In the service's details, click on the "Scaling" tab.
3. **Enable Auto-Scaling:** Toggle the "Auto-Scaling" switch to “On”.
4. **Configure Scaling Parameters:**  Here's a breakdown of the settings:
   * **Minimum Number of Instances:** The smallest number of instances Railway will maintain for your service.  This is crucial for baseline responsiveness.
   * **Maximum Number of Instances:** The largest number of instances Railway will scale your service up to.
   * **Scaling Policy:** This is the heart of your auto-scaling configuration. You have several options:
       * **Automatic (Recommended):** Railway automatically adjusts the number of instances based on metrics.  This is the default and generally the best starting point.
       * **Percent-Based:**  Scale based on a percentage increase or decrease. Useful if you have a specific target utilization level.
       * **Threshold-Based (Advanced):**  Define specific CPU or memory thresholds that trigger scaling events. This requires careful consideration and monitoring.  *Use with caution and thorough testing!*

5. **Save Changes:** Click "Save" to apply your scaling configuration.

**4. Advanced Configuration & Monitoring (Beyond the UI)**

While the UI is user-friendly, you can fine-tune your auto-scaling strategy with the following techniques:

* **Prometheus & Grafana Integration:**
    * **Install and Configure:**  Install Prometheus and Grafana within your service or using Railway's managed Grafana instance.
    * **Custom Metrics:**  Expose custom metrics from your application that aren't automatically collected by Railway. This allows you to scale based on application-specific events, queue lengths, or user sessions.
    * **Alerting:**  Set up alerts in Grafana based on these custom metrics to trigger manual scaling interventions if necessary.
* **Scaling Triggers:**
    * **CPU Utilization:** The most common trigger. Railway typically scales up when CPU usage exceeds a certain percentage.
    * **Memory Usage:**  Scale up if memory is consistently near its limit.
    * **Network I/O:**  Consider scaling based on network traffic if your application is a server or handles significant data transfer.
* **Scaling Intervals:**  Railway adjusts scaling actions every [interval
