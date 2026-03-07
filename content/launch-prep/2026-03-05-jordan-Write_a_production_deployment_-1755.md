# Write a production deployment runbook for Deuce Diary on Rai
Agent: jordan
Generated: 2026-03-05T17:55:07.378482

## Deuce Diary Production Deployment Runbook - Railway

**Document Version:** 1.0
**Date:** October 26, 2023
**Author:** AI Assistant

**Objective:**  This runbook outlines the steps required to deploy a new version of Deuce Diary to the production environment on Railway. This process assumes a fully functional and tested staging environment has been deployed.

**Prerequisites:**

*   Railway Account & Project:  You must have an active Railway account and the Deuce Diary project set up with a deployed staging environment.
*   SSH Access:  You need SSH access to the Railway service instances for Deuce Diary. (Provided in Railway dashboard)
*   Railway CLI:  The Railway CLI should be installed and configured on your machine.  `railway up` should be working correctly.
*   Git & Git commands: Familiarity with Git and basic Git commands is required.
*   Deployment Credentials:  Ensure you have the necessary credentials (API keys, etc.) for all Railway services used by Deuce Diary.

**I.  Preparation & Verification:**

1.  **Verify Staging Deployment:**  Confirm your staging environment is functioning as expected.  This includes:
    *   Database connectivity and data integrity.
    *   API endpoints are accessible and returning the correct responses.
    *   UI is rendering correctly.
2.  **Code Review:**  Thoroughly review the changes in the new version of Deuce Diary.
3.  **Testing:**  Execute all relevant tests (unit, integration, end-to-end) against your staging environment.
4.  **Database Backup:**  **CRITICAL:**  Back up your production database *before* starting the deployment.  Railway provides tools for this; consult the Railway documentation.
5.  **Deployment Notes:**  Document any specific deployment considerations for this version. (e.g., configuration changes, breaking changes).

**II. Deployment Steps:**

1.  **Pull Latest Staging Code:**
    ```bash
    git pull origin main  # Or the relevant branch name
    ```
2.  **Update Railway Services:**
    *   **Identify Services:** Note down the names of the Railway services used by Deuce Diary (e.g., Postgres DB, Redis, Frontend service, etc.)
    *   **Update Service Versions:**  Use the Railway CLI to update the versions of these services to match the staging environment. This will automatically deploy the services with the correct configurations.
        ```bash
        railway services pull --from staging
        ```
        This command will retrieve the service configurations from your staging environment.
3. **Trigger Deployment (If Necessary):**
   *  If the update of the Railway Services did not trigger a new deployment (e.g., due to immutable infrastructure), manually trigger the deployment of the Frontend service. This ensures the UI is refreshed.
      ```bash
      railway services deploy frontend
      ```
4. **Database Migration (If Required):**
    *   **Check for Migrations:**  Verify if any database migrations are required in the new version.
    *   **Run Migrations:** Use the appropriate commands to run the migrations against your production database. (These commands are specific to your Deuce Diary setup, so refer to your documentation or the deployment notes).  A common example (adjust to your DB):
        ```bash
        railway shell
        psql -d deuce_diary -U <your_user> -c "migrate"
        ```
5. **Restart Services:**
    *   **Restart Frontend:** This will ensure the updated UI is loaded.
        ```bash
        railway services restart frontend
        ```
    *   **Restart Other Services:** Restart any other services that are
