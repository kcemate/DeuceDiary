# Write a production deployment runbook for Deuce Diary on Rai
Agent: jordan
Generated: 2026-03-03T08:07:11.499544

## Deuce Diary Production Deployment Runbook - Railway

**Version:** 1.0
**Date:** October 26, 2023
**Prepared by:** [Your Name/Team Name]

**Goal:** This runbook outlines the steps to deploy a new version of Deuce Diary to the production environment on Railway.  It assumes familiarity with Railway's UI and CLI.

**Prerequisites:**

* **Railway Account:**  You must have an active Railway account with sufficient funds.
* **Railway CLI:** The Railway CLI must be installed and configured. (`railway up` should work)
* **Deuce Diary Source Code:** You should have the latest production version of Deuce Diary source code.
* **Railway Project:**  A Railway project named "deuce-diary" exists and is configured. (This runbook assumes this exists.  Create it beforehand if needed - see Railway documentation.)
* **Permissions:** You have the necessary permissions within the Railway project to deploy services.


**I. Preparation & Verification (Before Deployment)**

1. **Code Review & Testing:**
   * **Completed Code Review:** Confirm the latest code has passed all code reviews.
   * **Automated Tests:** Run all automated tests (unit, integration, end-to-end) to ensure functionality and avoid regressions.
   * **Manual Testing (Critical):** Perform thorough manual testing of the production-like environment to catch any issues missed by automated tests. Focus on core functionality, performance, and any critical user flows.
2. **Database Migrations:**
   * **Review Changes:** Carefully review all database migration scripts.
   * **Run Migrations:**  Execute the migrations using the database migration tool. Ensure all migrations are applied in the correct order.  This typically involves running `railway db migrate` within the service's shell.
3. **Configuration Updates:**
   * **Environment Variables:** Double-check that the environment variables for production are correctly configured in Railway. These are critical for database URLs, API keys, and any other sensitive settings.
   * **Railway Config:** Verify any specific configurations defined within Railway's Config panel.
4. **Rollback Plan:**  Document the steps to revert to the previous version in case of critical issues. This includes identifying the specific service and the rollback process (e.g., using Railway's rollbacks).



**II. Deployment Steps (Using Railway CLI)**

1. **Stop Existing Service:** (Important to ensure a clean deployment)
   ```bash
   railway stop deuce-diary-web
   ```
   * Replace `deuce-diary-web` with the actual service name of your web application.

2. **Push New Code:**
   ```bash
   railway pull deuce-diary --branch main
   ```
   * Replace `main` with the actual branch name you're deploying from. This command automatically pulls the latest code into the service.

3. **Build (If Necessary):**
    * If your application requires a build step (e.g., compiling TypeScript, bundling assets), execute the build command *within the service's shell*:
    ```bash
    railway build deuce-diary-web
    ```

4. **Restart Service:**
   ```bash
   railway start deuce-diary-web
   ```
   * This command restarts the service with the newly deployed code. Railway automatically handles the deployment process, including setting up the service and configuring its environment.

5. **Verification:**
   * **Service Status:** Check the status of the service in the Railway UI or using the CLI: `railway service status deuce-diary-web`
   * **Logs:** Examine the service's logs for any errors or warnings: `railway logs
