# Write a production deployment runbook for Deuce Diary on Rai
Agent: jordan
Generated: 2026-03-03T15:39:48.735016

Okay, here's a production deployment runbook for Deuce Diary on Railway, aiming for a clear, repeatable, and easily adaptable process.  It focuses on a blue/green deployment strategy for minimal downtime.

**Document Version:** 1.0
**Date:** October 26, 2023
**Application:** Deuce Diary
**Railway Account:** [Your Railway Account Name]
**Environment:** Production

---

**1. Pre-Deployment Checklist & Assumptions**

* **Railway Account Access:** You have full administrative access to your Railway account.
* **Railway CLI Installed & Configured:** The Railway CLI is installed and logged in correctly.
* **Version Control:**  The latest stable branch of Deuce Diary is actively being tracked in [Your Git Repository URL].
* **Testing:**  All automated tests (unit, integration, end-to-end) have passed successfully in the staging environment.
* **Rollback Plan:**  This runbook includes a rollback plan; it's crucial to understand and practice it.
* **Monitoring & Alerting:** Monitoring and alerting are set up for the production environment.  Ensure they're functional and configured to notify you of critical issues.

**2. Deployment Steps**

**Phase 1: Preparation (Automated - Railway Build & Deploy)**

1. **Trigger Railway Build:**
   * Command: `railway up --repo [Your Git Repository URL]`
   * Railway automatically handles the build and deployment. Verify the build passes and the application is running on the new `green` environment.

2. **Verify Green Environment:**
   * Access the `green` environment in your Railway dashboard: [Link to your Green Environment]
   * Confirm the application is running, logs are clear, and key metrics are within acceptable ranges.
   *  Check that the database connection is successful.

**Phase 2: Switchover (Automated - Railway Canary)**

3. **Enable Railway Canary:**
    * In the `green` environment dashboard, activate the "Canary" feature. This gradually shifts traffic.
    * Configure Canary settings:
        * **Percentage:** Start with a low percentage (e.g., 1% - 5%) to minimize initial impact.  Monitor closely!
        * **Duration:**  Set an appropriate duration (e.g., 30-60 minutes) to allow the canary to stabilize.
        * **Target:**  Specify the application's external URL.

4. **Monitor Canary Traffic:**
    * Use Railway's dashboard to observe the traffic distribution between the old (`blue`) and new (`green`) environments.
    * Check application metrics (e.g., request latency, error rates) in the Canary environment to identify any issues.

**Phase 3: Final Switch & Cleanup (Manual - Requires Careful Coordination)**

5. **Confirmation of Stability:**  **Crucially, confirm the Canary environment is stable for at least 15-30 minutes.**  This is *not* a decision based solely on the dashboard; you need to investigate logs and monitor key metrics.

6. **Stop the Blue Environment:**
   * In the `blue` environment dashboard, stop the application. This will immediately cut off all incoming traffic.  (Note: The application will likely continue running briefly due to caching, but this is expected.)

7. **Update DNS (Manual - Critical Step):**
   * This is the most important manual step.  You *must* update your DNS records to point to the `green` environment's external URL.
   * **Propagation Delay:**  DNS propagation can take 15-45 minutes (or longer depending on your DNS provider). Monitor propagation using tools like [https://www.whatsmydns.net/](https
