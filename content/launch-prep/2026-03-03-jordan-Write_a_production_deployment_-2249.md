# Write a production deployment runbook for Deuce Diary on Rai
Agent: jordan
Generated: 2026-03-03T22:49:53.431954

## Deuce Diary Production Deployment Runbook - Railway

**Last Updated:** October 26, 2023
**Version:** 1.0
**Purpose:** This document outlines the steps required to deploy a new version of Deuce Diary to the production Railway environment.

**Prerequisites:**

* **Railway Account:** You must have an active Railway account with billing enabled.
* **Railway CLI:**  The Railway CLI must be installed and configured on your machine.
* **SSH Access:** You'll need SSH access to your Railway project's server.
* **Git Repository:** The Deuce Diary application must be hosted in a Git repository (e.g., GitHub, GitLab, Bitbucket).
* **Railway Secrets:**  The necessary Railway secrets (database connection details, API keys, etc.) must be correctly configured.

**I. Preparation (Before Deployment)**

1. **Staging Deployment:** *Crucially,* deploy the new version to the staging environment first. This allows for final testing and verification of the deployment process.
   *  Ensure the staging environment is functioning correctly.
   *  Verify that all integrations are working as expected.
   *  Test all critical user workflows.
2. **Review Changes:** Carefully review the changes in the new version.  Pay close attention to:
    * **Database Migrations:** Have any database migrations been applied?
    * **Configuration Changes:**  Are there any configuration changes that affect production?
    * **Security Updates:**  Are any security vulnerabilities addressed?
3. **Update Deployment Branch:**  Confirm the deployment branch (typically `main` or `production`) is up-to-date with the latest changes.

**II. Deployment Steps**

1. **Navigate to Railway Project:**
   ```bash
   railway up
   ```
   This will automatically create or connect to your Railway project.  If prompted for credentials, use your Railway CLI credentials.

2. **Update Railway Secrets:**
   *  Navigate to the "Secrets" tab in your Railway project dashboard.
   *  Add or update any necessary secrets based on the new version’s requirements.  This includes:
      * **Database Credentials:** Connection strings for your PostgreSQL database.
      * **API Keys:**  Keys for any external services (e.g., email providers, third-party APIs).
      * **Environment Variables:**  Any other environment variables required by the application.
   * **Double-check:** Verify that all secrets are correct and secure.

3. **Pull Latest Code:**
   *  SSH into your Railway project's server.  (You can find the SSH URL in the Railway dashboard.)
   *  Pull the latest code from the deployment branch:
      ```bash
      git pull origin <deployment_branch>
      ```
      (e.g., `git pull origin main`)

4. **Run Database Migrations:**
   *  Execute the database migration commands specific to your Deuce Diary application.  These might look like:
      ```bash
      # Example - Adapt to your application's migration commands
      rake db:migrate
      ```
   *  **Verify Migrations:** After running migrations, check the database to ensure they were applied successfully.

5. **Install Dependencies (if needed):**
   * If the deployment includes new dependencies, install them:
      ```bash
      # Example - Adapt to your application's dependency management
      bundle install
      ```

6. **Run Application Commands (if needed):**
    * Some applications require specific commands to be run after deployment, such as restarting the application server or clearing caches.  Refer to the Deuce Diary documentation for specific commands.  Example:
       ```bash
       # Example - Adapt to your application'
