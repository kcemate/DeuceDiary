# Write a production deployment runbook for Deuce Diary (Expre
Agent: jordan
Generated: 2026-03-02T22:39:55.728731

## Deuce Diary Production Deployment Runbook - Railway

**Date:** October 26, 2023
**Version:** 1.0
**Purpose:** This document outlines the steps required to deploy a new version of Deuce Diary to the production Railway environment.
**Environment:** Railway Production

**I. Pre-Deploy Checks (Mandatory)**

Before initiating the deployment, ensure the following are met:

1. **Code Changes Verified:**
   * Confirm the latest code is merged into the main branch (or the designated production branch).
   * Review the changes carefully to understand potential impact.
   * Ensure all tests (unit, integration, and end-to-end) have passed successfully in the staging environment.

2. **Railway Account & Project Setup:**
   * Verify Railway account access with appropriate permissions (owner or maintainer).
   * Ensure the Deuce Diary Railway project exists and is configured correctly (e.g., database connection, API keys, environment variables).

3. **Configuration Review:**
   * **Environment Variables:** Double-check all environment variables in the Railway project settings:
      * `DATABASE_URL` (PostgreSQL connection string)
      * `JWT_SECRET` (JWT Secret Key)
      * `CLERK_API_KEY` (Clerk API Key)
      * `CLERK_ENVIRONMENT` (Clerk Environment - e.g., `production`)
      * Any other custom environment variables specific to production.
   * **Railway Configuration:** Verify the Railway app configuration, particularly:
      * CPU allocation (ensure sufficient for production load).
      * Memory allocation (ensure sufficient for production load).
      * Logging level (should be set to `info` or `debug` during initial deployment, revert to `info` or `warn` for production).

4. **Deployment Branch Tag:**  Tag the latest commit in the production branch with a version number (e.g., `v1.2.3`). This allows for easy rollback.

5. **Staging Environment Verification (Recommended):** Ideally, perform a quick check in the staging environment to confirm the deployed code is behaving as expected.


**II. Deployment Command (Railway CLI)**

1. **Login to Railway CLI:**
   ```bash
   railway up login
   ```
   Enter your Railway API key when prompted.

2. **Navigate to the Deuce Diary Project:**
   ```bash
   railway project switch <project_name>
   ```
   Replace `<project_name>` with the name of your Deuce Diary Railway project (e.g., `deuce-diary`).

3. **Deploy the Code:**
   ```bash
   railway deploy
   ```
   This command will:
     * Fetch the latest code from the tagged branch.
     * Rebuild the application (if necessary, based on your build process).
     * Deploy the new version to the Railway production environment.

4. **Monitor Deployment:**  The Railway CLI will output progress information and any errors encountered during the deployment.  Watch the service’s health dashboard in the Railway UI to ensure it's running.

**III. Post-Deploy Verification**

1. **Service Status:**  In the Railway UI, verify the Deuce Diary service is running with a status of "Healthy".

2. **Initial Health Checks:**
   * **Application Logs:** Check the application logs for any errors or warnings.
   * **Database Connection:**  Verify the application is successfully connecting to the database.
   * **API Keys:**  Confirm the API keys (Clerk, etc.) are correctly configured.

3. **Functional Testing (Critical):** Perform basic functional testing:
   * **User Login/Registration:** Attempt to log in and register a new
