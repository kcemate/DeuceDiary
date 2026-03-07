# Write a production deployment runbook for Deuce Diary on Rai
Agent: jordan
Generated: 2026-03-04T06:00:16.723070

## Deuce Diary Production Deployment Runbook - Railway

**Version:** 1.0
**Date:** October 26, 2023
**Objective:** Deploy a new version of Deuce Diary to the production Railway environment.

**Prerequisites:**

* **Railway Account & Workspace:** You must have an active Railway account and a workspace configured with the necessary permissions.
* **Railway CLI Installed & Authenticated:** Ensure you have the Railway CLI installed and authenticated to your account.
* **Production Database Access:** You'll need database access credentials for the production Deuce Diary database (likely PostgreSQL).
* **Secret Management:** Deuce Diary secrets (API keys, database credentials, etc.) must be securely stored in Railway’s Secret Management.
* **Understanding of Railway:** Basic understanding of Railway concepts like Services, Environments, and Databases is required.

**1. Preparation & Validation:**

* **Checkout Latest Code:**  `git pull origin production` - Ensure you have the latest committed code.
* **Run Local Tests (Critical):**  Before proceeding, execute all local tests, including integration tests, to verify the new code’s functionality and prevent regressions.  Address any identified issues.
* **Review Changes:** Carefully review the changes included in the new deployment. Pay close attention to database migrations, configuration updates, and any breaking changes.
* **Verify Secrets:** Double-check that the required secrets are correctly configured in Railway's Secret Management.
* **Check Service Status:**  Ensure all necessary Railway services (app, database, etc.) are running and healthy.

**2. Deployment Steps:**

**Step 1:  Prepare the Railway Environment**

* **Navigate to the Production Workspace:** `railway init <workspace_name>` (If not already done)
* **Update Environment Variables (if necessary):**  Railway automatically inherits environment variables defined in the service configuration.  Verify these are correct.
* **Database Migration:**  This is the crucial step for updating the database schema.
   * **Run Migration Script:**  Run the migration script appropriate for the new version. This likely involves using a tool like `flyway` or `knex`.
   * **Example (Conceptual):**
     ```bash
     railway run migrate
     ```
     (Replace `migrate` with the actual command to execute the database migration).
* **Verify Migration Success:**  Check the logs for the migration script to ensure it executed successfully and no errors occurred.

**Step 2: Deploy the Application**

* **Push Code to Railway:**
   ```bash
   railway deploy
   ```
   Railway will automatically build and deploy your application.  This involves:
   * Pulling the latest code from the remote repository.
   * Installing dependencies (e.g., `npm install` or `yarn install`).
   * Running the application startup command.

**Step 3: Monitor the Deployment**

* **Railway Dashboard:**  Monitor the deployment progress and health of the application through the Railway Dashboard.
* **Application Logs:**  Review the application logs for any errors or warnings during the deployment process.  (Accessible via the Railway Dashboard).
* **Database Status:** Ensure the database service is running smoothly and connected to the application.

**3. Post-Deployment Steps:**

* **Verify Application Functionality:**  Access the Deuce Diary web application in your browser and thoroughly test all features and functionalities. Pay particular attention to any areas affected by the deployment.
* **Check Metrics:**  Monitor key application metrics (e.g., response times, error rates, database performance) to identify any potential issues.  Railway provides built-in metrics.
* **Rollback (If Necessary):** If any critical issues arise during or after deployment, immediately roll back to the previous working version.
