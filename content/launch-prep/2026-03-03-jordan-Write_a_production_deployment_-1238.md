# Write a production deployment runbook for Deuce Diary on Rai
Agent: jordan
Generated: 2026-03-03T12:38:27.185884

## Deuce Diary Production Deployment Runbook - Railway

**Last Updated:** October 26, 2023

**Version:** 1.0

**Purpose:** This runbook outlines the steps required to deploy a new version of Deuce Diary to the production Railway environment. This process ensures a smooth and reliable transition while minimizing downtime.

**Prerequisites:**

*   **Railway Account:**  You must have an active Railway account with sufficient funds to cover deployment costs.
*   **Railway CLI:** The Railway Command Line Interface (CLI) must be installed and configured with your Railway account.
*   **SSH Access:** You need SSH access to your Deuce Diary Railway Service instance.
*   **Deployment Branch:** The deployment process assumes you're deploying from the `main` or `production` branch.
*   **Production Database Access:** You'll need credentials to your production PostgreSQL database (credentials should be stored securely, ideally through Railway Secrets).

**I. Pre-Deployment Checks & Preparation:**

1.  **Verify Current State:**
    *   **Status:** Ensure the current production Deuce Diary service is running and healthy.  Use `rail status` to check.
    *   **Logs:** Review the service's logs for any recent errors or warnings. This can identify potential conflicts with the new deployment.
    *   **Database:**  Confirm the production database is accessible and in sync.
2.  **Build the Deployment Package:**
    *   **Git Pull:** Ensure your local Deuce Diary repository is up-to-date with the latest changes from the production branch: `git pull origin main` (or `git pull origin production`)
    *   **Build:** Build the deployment package for Railway.  This will likely involve generating a Docker image. Use your existing build process (e.g., `rail build`). *Note: This step might already be automated in your CI/CD pipeline.*
3.  **Verify Build Integrity:**
    *   **Image Tag:**  Confirm the Docker image tag in your Railway service is correct and matches the deployed version.
    *   **Image Size:**  Check the size of the Docker image to ensure it's reasonable.

**II. Deployment Steps:**

1.  **Shutdown Current Service:**
    *   `rail shutdown` - This gracefully shuts down the current Deuce Diary service instance. *Important: This avoids data loss and ensures a clean transition.*
2.  **Deploy New Image:**
    *   `rail deploy` - This command will pull the new Docker image and deploy it to your Railway service. Railway automatically handles scaling and routing.
3.  **Database Schema Migration:**
    *   **SSH Access:** Connect to your Deuce Diary Railway Service instance via SSH.
    *   **Execute Migration:**  Run the appropriate database migration command to update the production database schema.  This will likely involve running a PostgreSQL migration script. *Example:* `psql -d your_database_name -U your_user -c "migrate"` (Replace placeholders with your actual database credentials).
4.  **Restart Service:**
    *   `rail restart` - This restarts the Deuce Diary service, running the newly deployed Docker image.
5.  **Verify Deployment:**
    *   **Status:** Use `rail status` to confirm the service is running and healthy.
    *   **Logs:** Review the service's logs to ensure the deployment was successful and there are no errors.
    *   **Website Access:**  Open your Deuce Diary website in a browser to verify functionality.
    *   **Database Connection:** Verify the service can connect to the production database.

**III. Post-Deployment Actions:**

1.  **Monitoring:**  Set up monitoring (e.g., Railway
