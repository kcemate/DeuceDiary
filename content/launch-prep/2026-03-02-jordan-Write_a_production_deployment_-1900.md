# Write a production deployment runbook for Deuce Diary (Expre
Agent: jordan
Generated: 2026-03-02T19:00:09.424738

## Deuce Diary Production Deployment Runbook - Railway

**Document Version:** 1.0
**Last Updated:** October 26, 2023
**Purpose:** This runbook outlines the steps required to deploy changes to the production environment of Deuce Diary, hosted on Railway.

**Environment:** Production (DeuceDiary-prod)
**Tools:** Railway CLI, Git, Terminal

**I. Pre-Deploy Checks & Preparation**

Before initiating the deployment, confirm the following:

1. **Code Changes Approved:** Verify that the changes merged into the `main` branch have been reviewed and approved by the designated stakeholders (e.g., Product Owner, Lead Developer).
2. **Automated Tests Passed:**  Ensure all automated tests (Unit, Integration, E2E) within the `ci` branch have passed successfully.  These tests must pass *before* proceeding.
3. **Railway Account & Permissions:** You must have the necessary permissions to access and modify the DeuceDiary-prod Railway service.
4. **Railway CLI Installed and Configured:** Verify the Railway CLI is installed correctly and is authenticated with your Railway account. ( `railway login` )
5. **Railway Service Status:** Confirm that the DeuceDiary-prod Railway service is running and healthy. Check the Railway dashboard.
6. **Database Backups:** (Optional but Recommended) Create a database backup of the production database before starting the deployment. This allows for a quick rollback if problems arise. Instructions for backing up the database can be found [here](https://railway.io/docs/guides/database#backing-up-your-database).
7. **Staging Environment:** Ensure the staging environment (DeuceDiary-staging) is synchronized with the latest changes. This helps to identify potential issues before impacting the production environment.


**II. Deployment Command (Using Railway CLI)**

1. **Navigate to Project Directory:** Open your terminal and navigate to the root directory of the DeuceDiary project.
2. **Pull Latest Code:** Ensure you have the latest code from the `main` branch: `git pull origin main`
3. **Push to Railway:** Deploy the code using the Railway CLI:
   ```bash
   railway deploy
   ```
   * This command will:
      * Build your application (if necessary).
      * Deploy the code to the DeuceDiary-prod service.
      * Restart the service.
4. **Monitor Deployment:**  The Railway CLI will display the deployment progress. Pay close attention to any error messages. The Railway dashboard provides a visual overview.
5. **Deployment Completion:**  Once the deployment is complete, verify the service is running on the Railway dashboard.

**III. Post-Deploy Verification**

Immediately following deployment, perform the following checks:

1. **Service Status:**  Confirm the DeuceDiary-prod service is running and healthy on the Railway dashboard.
2. **Basic Functionality Testing:**  Access the DeuceDiary application through a web browser. Perform basic functional tests:
   * **Homepage:** Verify the homepage loads correctly.
   * **Diary Entry Creation:** Create a new diary entry (test adding text, formatting).
   * **Diary Entry Viewing:** View a diary entry you created.
   * **Login/Logout:**  Test the login and logout functionality.
3. **Performance Metrics:** Monitor key performance indicators (KPIs) like response time, error rates, and CPU usage using the Railway dashboard or external monitoring tools (e.g., New Relic, Datadog - if configured).
4. **Error Logs:** Review the application's error logs for any unexpected errors or warnings. The logs are available in the Railway dashboard.
5. **Database Health:**  Check the database connection status and verify the database is functioning
