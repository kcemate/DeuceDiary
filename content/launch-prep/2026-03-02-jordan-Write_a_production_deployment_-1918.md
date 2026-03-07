# Write a production deployment runbook for Deuce Diary (Expre
Agent: jordan
Generated: 2026-03-02T19:18:16.409207

## Deuce Diary Production Deployment Runbook - Railway

**Objective:** This runbook details the steps required to deploy the latest version of the Deuce Diary application to its production Railway environment.

**Environment:** Production Railway Environment - Specific Railway Project: `deuce-diary`

**Assumptions:**
* You have a Railway account with appropriate permissions to deploy to the `deuce-diary` project.
* You are familiar with the Railway UI and CLI.
* You have the necessary access credentials for the Railway project.
* The Railway project is configured with a dedicated database (e.g., PostgreSQL).
* You’ve tested the latest changes locally.

**I. Pre-Deploy Checks (Must be completed before starting deployment)**

1. **Code Changes Verified:**
   * **Task:** Confirm that the latest code on the primary branch (e.g., `main` or `production`) has been successfully merged into the latest Railway deployment branch.
   * **Tool:**  Git Status in the Railway UI or `git status` command.
   * **Result:**  No conflicting commits should exist on the deployment branch.

2. **Database Changes Verified:**
   * **Task:** Review the database migration scripts for the current deployment. Ensure they are compatible with the existing production database schema.
   * **Tool:** Review the migration script files in the codebase.
   * **Result:** No breaking changes should be introduced to the database schema.  Consider a dry run of the migrations if feasible.

3. **Test Environment Verification (Highly Recommended):**
   * **Task:**  Deploy the changes to a staging/test Railway environment that mirrors the production configuration.
   * **Tool:**  Railway UI.
   * **Result:** All critical functionality in the staging environment is working as expected. Any regression tests should pass.


**II. Deployment Command (Executed via Railway CLI)**

1. **Login to Railway CLI:**
   ```bash
   railway up login
   ```
   * Enter your Railway API token.

2. **Navigate to the Project:**
   ```bash
   railway project push deuce-diary
   ```
   * This command automatically handles the following:
     * **Build:**  Railway will execute the `build` command defined in your `package.json` (or equivalent).  Ensure your `build` command correctly packages your Express app.
     * **Deploy:** Railway will deploy the built application to the Railway environment.
     * **Database Migrations:** Railway automatically executes the migrations you've configured.  *Verify that migration commands are correctly configured in your package.json and are being executed.*
     * **Environment Variables:** Railway will update the environment variables based on the configuration defined in your Railway project.

3. **Monitor Deployment:**
   * Use the Railway UI or CLI to track the deployment progress. Look for successful build and deployment events.
   *  `railway project logs` -  Check the logs for any errors during deployment.


**III. Post-Deploy Verification**

1. **Application Health Check:**
   * **Task:** Access the application through its deployed URL (provided by Railway).
   * **Tool:** Browser, Postman, or Curl.
   * **Result:** The application is responsive and displays correctly.

2. **Basic Functionality Testing:**
   * **Task:** Perform essential tests, such as:
     * User login/registration
     * Reading diary entries
     * Adding new diary entries
     * (If applicable) Testing API endpoints.
   * **Tool:** Manual testing, Postman.
   * **Result:** Core functionality is working as expected.

3. **Performance Monitoring (Initial):**
   * **Task:** Use Railway’s built-in monitoring tools to check CPU usage
