# Write a production deployment runbook for Deuce Diary on Rai
Agent: jordan
Generated: 2026-03-04T03:44:11.353882

## Deuce Diary Production Deployment Runbook - Railway

**Last Updated:** October 26, 2023

**Version:** 1.0

**Purpose:** This runbook outlines the steps required to deploy a new version of Deuce Diary to the production Railway environment. This process assumes you've built a production-ready release of the application.

**Assumptions:**

*   You have a Railway account and have properly configured your Railway CLI (Command Line Interface).
*   You have the necessary permissions to manage services within your Railway project.
*   You’ve successfully deployed the application to a Railway staging environment for testing.
*   You understand the deployment strategy (Rolling deployments with Canary Testing).

**Tools Required:**

*   Railway CLI
*   Git (for pulling the latest code)
*   SSH Client (for debugging, if needed)

**I. Pre-Deployment Checklist:**

*   [ ] **Code Review:** Confirm the latest code from the main branch has been thoroughly reviewed.
*   [ ] **Test Results:** Verify all unit, integration, and end-to-end tests pass in the staging environment.
*   [ ] **Canary Testing:**  The canary deployment is running successfully and showing no errors. Monitor key metrics (CPU, Memory, Response Time) closely.
*   [ ] **Database Backups:**  A recent backup of the production database is available and verified. This is critical for rollback scenarios.
*   [ ] **Monitoring:**  Ensure monitoring (e.g., Railway Dashboard, Prometheus, Grafana) is properly configured and alerting is set up.
*   [ ] **Rollback Plan:**  Understand the steps for reverting to the previous deployment version in case of issues.


**II. Deployment Steps:**

1.  **Pull Latest Code:**
    ```bash
    git pull origin main
    ```
    *   This ensures you're deploying the most recent code.  Consider a short `git reset --hard` if you've made local changes that should be committed.

2.  **Stop Current Service:**
    ```bash
    railway service stop deuce-diary
    ```
    *   This gracefully stops the existing Deuce Diary service. Railway handles the proper shutdown sequence.

3. **Deploy the New Version (Rolling Deployment):**
   Railway automatically handles rolling deployments when you trigger a deployment event. We will trigger this manually.

    *  Navigate to the Deuce Diary service in the Railway Dashboard.
    *  Click the "Deploy" button.  Railway will handle the deployment process, including:
        *   Pulling the new code.
        *   Updating the service's container image.
        *   Scaling the service appropriately.
        *   Performing health checks.

4. **Monitor Deployment:**
    *   Closely monitor the service’s status in the Railway Dashboard. Verify that the deployment is proceeding without errors.
    *   Check the logs in the Railway Dashboard for any errors.

5.  **Verify Canary Deployment:**
    *  Ensure the canary deployment is still active and functioning correctly.  Pay close attention to metrics for any deviation from the baseline.

6. **Switch Over Traffic (Manual):**
    *   Once the canary deployment is stable, manually switch traffic to the new version.
    *   In the Railway Dashboard, toggle the traffic split to 100% to the "new" deployment.  This effectively replaces the old version.

7. **Post-Deployment Verification:**
    *   **Functional Testing:** Perform manual and automated tests to confirm the new version is working as expected.  Focus on critical user flows.
    *   **Performance Monitoring:** Continuously monitor key performance metrics (CPU, Memory, Response Time, Error Rates)
