# Write a production deployment runbook for Deuce Diary on Rai
Agent: jordan
Generated: 2026-03-04T07:53:33.038973

## Deuce Diary Production Deployment Runbook - Railway

**Version:** 1.0
**Date:** October 26, 2023
**Purpose:**  This runbook outlines the steps to deploy a new version of Deuce Diary to the production Railway environment.  It's designed to be followed precisely to minimize downtime and ensure a smooth rollout.

**Assumptions:**

*   You have a Railway account with appropriate permissions (at least Editor).
*   You have deployed and thoroughly tested the latest version of Deuce Diary locally.
*   You are familiar with the Railway CLI and concepts like environments, services, and tasks.
*   You’ve activated the Railway CLI and configured it with your account.


**I. Pre-Deployment Checks & Preparation:**

1.  **Verify Code Changes:**
    *   Ensure the changes in the latest commit are thoroughly tested and approved.
    *   Review the commit message for deployment instructions (if any).
2.  **Check Railway Environment:**
    *   **Access Production Environment:** `railway up <env_name>`  (Replace `<env_name>` with the name of your Deuce Diary Railway environment – usually “deuce-diary-prod”).
    *   **Verify Service Status:**  Ensure all services (Web App, Database, Redis, etc.) in the environment are running and healthy. Use `railway services` to list and check their status.  Pay close attention to logs for any errors.
3.  **Retrieve Latest Code:**
    *   **Fetch Branch:** `git fetch origin`
    *   **Checkout Latest Commit:** `git checkout <branch_name>` (e.g., `git checkout main`)

**II. Deployment Steps:**

1.  **Update Web App Service:**
    *   **Navigate to the Web App Service:**  In the Railway UI, go to the "Web App" service for Deuce Diary.
    *   **Trigger a New Deployment:** Click the "Deploy" button.  Railway will automatically pull the latest code from your Git repository.
    *   **Specify Build/Run Tasks (If Applicable):** If your Deuce Diary project uses build or run tasks defined in a `railway.yml` file or in the Railway CLI, ensure they are correctly configured.  This step is crucial for Docker image builds and deployments.
    *   **Monitor Deployment:**  The UI will display the progress of the deployment.

2.  **Database Migrations (Important!)**:
    *   **Run Migrations:** After the Web App is deployed, manually trigger database migrations. This is critical for applying any schema changes.
        *   **Using Railway CLI:** `railway task run migrate` (This assumes a task named "migrate" exists in your project)
        *   **Manually:** If no task is defined, navigate to your Web App service in the Railway UI and select "Run Task". Choose the "migrate" task (or equivalent) and execute it.

3.  **Redis Cache Refresh (Optional, but Recommended for Data Consistency):**
    *   **Refresh Redis:** To ensure data consistency and clear any stale cached data, consider refreshing the Redis cache.
        *   **Using Railway CLI:** `railway task run redis-flushall` (Again, assumes a task named "redis-flushall").  Be aware this will temporarily disrupt any services relying on Redis.
        *   **Manually:**  Within the Railway UI, select the Redis service and click "Run Task". Choose the "redis-flushall" task.

4. **Monitor and Verify:**
   * **Check Web App Status:** Verify that the Web App is running correctly and accessible at the expected URL.
   * **Test Functionality:** Thoroughly test
