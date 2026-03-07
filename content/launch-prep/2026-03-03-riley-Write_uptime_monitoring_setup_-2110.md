# Write uptime monitoring setup guide.
Agent: riley
Generated: 2026-03-03T21:10:49.591093

## Uptime Monitoring Setup Guide: Keeping Your Services Alive

This guide walks you through setting up basic uptime monitoring using popular tools. We'll cover a few options, ranging from free and simple to more robust and feature-rich.

**Understanding Uptime Monitoring**

Uptime monitoring involves regularly checking if a service (website, server, application) is accessible and functioning correctly. If a service goes down, the monitoring tool will alert you, allowing you to quickly address the issue and minimize downtime.

**1. Choosing a Monitoring Tool**

Here are some popular options:

* **UptimeRobot:** (Free & Paid Plans) - Excellent free tier, simple interface, supports HTTP/HTTPS, and offers various alert methods.
* **Pingdom:** (Paid) - More advanced features like page speed monitoring, detailed reports, and custom URLs.
* **StatusCake:** (Free & Paid Plans) -  Offers a generous free tier and supports various monitoring types, including uptime, page speed, and more.
* **Nagios:** (Open Source) - Powerful and highly customizable, but has a steeper learning curve.  Best for experienced administrators.
* **Zabbix:** (Open Source) - Similar to Nagios, a mature and feature-rich solution.
* **CircleCI Uptime:** (Free) - Simple, focused on uptime monitoring of your CI/CD pipelines.


**This guide will primarily focus on UptimeRobot due to its ease of use and good free tier.**

**2. Setting Up UptimeRobot**

**Step 1: Sign Up**

* Go to [https://uptimerobot.com/](https://uptimerobot.com/) and create a free account.

**Step 2: Add a New Monitor**

* Once logged in, click on "Add Machine."

**Step 3: Configure the Monitor**

* **Service URL:** Enter the URL of the service you want to monitor.  (e.g., `https://www.example.com`)
* **Check Interval:** Choose how often UptimeRobot will check the URL.  Recommended: 1-5 minutes. (Shorter intervals mean faster detection of downtime, but can increase the load on the target server).
* **Monitor Name:** Give your monitor a descriptive name (e.g., "My Website Uptime").
* **HTTP Method:** Select the appropriate HTTP method:
    * **GET:**  Used for retrieving the website's content. (Most common)
    * **POST:** Used for submitting data to the server.
* **Port:** Leave this at the default (80 for HTTP, 443 for HTTPS).
* **Authentication:** (Optional) If the website requires authentication, you can configure basic authentication.
* **Alert Time Before Downtime:**  Choose how many minutes *before* a service goes down you want to receive an alert. (e.g., 5 minutes allows you to address the issue while it’s still relatively easy to resolve).
* **Alert Notifications:** Choose how you want to be notified:
    * **Email:** Sends alerts to the email address associated with your account.
    * **SMS:** Sends alerts via text message (requires a paid plan).
    * **Push:** Sends alerts to the UptimeRobot mobile app.

**Step 4: Save the Monitor**

* Click the "Create Monitor" button.

**3. Verification and Testing**

* **Simulate Downtime:**  After creating the monitor, deliberately take the website offline (e.g., turn off the server, delete the website files – *be careful not to cause permanent damage*).
* **Verify Alert:**  Check your email, SMS, or the UptimeRobot app to confirm you receive an alert when the website goes down.
