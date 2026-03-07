# Write a production deployment runbook for Deuce Diary on Rai
Agent: jordan
Generated: 2026-03-07T02:07:03.709846

## Deuce Diary Production Deployment Runbook - Railway

**Date:** October 26, 2023
**Version:** 1.0
**Target Environment:** Production Railway Instance - `deuce-diary-prod` (Replace with your actual instance name)
**Purpose:**  Detailed steps to deploy a new version of Deuce Diary to the production Railway instance, minimizing downtime and ensuring a smooth rollout.

**Prerequisites:**

*   **Railway CLI Installed & Configured:** Ensure you have the Railway CLI installed and configured with your Railway account credentials.
*   **Railway Account Access:** You need administrative access to the `deuce-diary-prod` Railway instance.
*   **Code Changes Committed & Pushed:** The latest production code must be committed and pushed to the `main` branch of your Git repository.  Verify the last successful build on Railway.
*   **Database Backup:** **CRITICAL**. Ensure a recent backup of your PostgreSQL database is readily available (e.g., `pg_dump` output).

**I. Preparation (Before Deployment)**

1.  **Verify Latest Build:**
    *   Log into the Railway dashboard: [https://railway.app/](https://railway.app/)
    *   Navigate to your `deuce-diary-prod` instance.
    *   Check the build status to confirm the latest code was successfully built and deployed.
    *   Review the build logs for any errors or warnings.
2.  **Confirm Database Version:**
    *   Connect to the database using a suitable tool (e.g., psql).
    *   Verify the database version against your deployment requirements.  Ensure compatibility.
3.  **Stop Existing Services (Optional - For Minimal Downtime):**  (Consider this if absolutely necessary, typically for database schema changes)
    *   Using the Railway CLI: `railway services stop deuce-diary-app`
4.  **Clear Cache (If Applicable):**  (If your application utilizes external caches - Redis, etc.)
    *   `railway services stop redis` (or the name of your Redis service) - and then restart it.



**II. Deployment Steps**

1.  **Pull Latest Changes:**
    *   Navigate to your Deuce Diary repository in your Git client (e.g., GitHub Desktop, command line).
    *   Pull the latest changes from the `main` branch.
2.  **Trigger a New Build:**
    *   In the Railway dashboard, click on the "Build" button for your `deuce-diary-prod` instance.
    *   Select the `main` branch.
    *   Click "Start Build". Railway will automatically pull the code, build the application, and deploy it to the instance.
3.  **Monitor Build Progress:**
    *   The Railway dashboard provides real-time updates on the build progress.  Watch for successful build completion.
4.  **Verify Deployment:**
    *   Once the build completes successfully, navigate to the Deuce Diary URL (e.g., `https://deuce-diary-prod.railway.app/`).
    *   Confirm the application is running and accessible.
    *   Check the logs for any errors or unexpected behavior.  You can access the logs through the Railway dashboard.
5.  **Check Health Checks:** Railway automatically performs health checks. Ensure they are passing.  If they fail, investigate the logs and/or service configurations.

**III. Post-Deployment Steps & Rollback Strategy**

1.  **Database Migrations (Crucial - If Schema Changes):**
    *   **Execute Database Migrations:**  **Only if** your deployment includes database schema changes. This is usually done during
