# Write a production deployment runbook for Deuce Diary on Rai
Agent: jordan
Generated: 2026-03-03T22:04:34.737976

## Deuce Diary Production Deployment Runbook - Railway

**Version:** 1.0
**Date:** October 26, 2023
**Purpose:** This document outlines the steps required to deploy a new version of Deuce Diary to the production Railway environment.

**Prerequisites:**

*   **Railway Account:** You have an active Railway account and have configured your Railway CLI.
*   **Railway Project:** The Deuce Diary project is correctly set up and deployed on Railway.
*   **Access:** You have the necessary permissions to manage the Deuce Diary Railway project.
*   **Staging Deployment:** You have successfully deployed the new version to the staging environment (described in a separate runbook - see Appendix A). This ensures any breaking changes are caught before production.
*   **Database Backup:** A recent backup of the production database is available and verified.

**I. Preparation (Before Deployment)**

1.  **Verification:**
    *   **Staging Verification:** Ensure the staging deployment is functioning as expected and all tests have passed.
    *   **Code Review:** Confirm the code changes have been thoroughly reviewed.
    *   **Rollback Plan:**  Review the rollback procedures in case of unforeseen issues (see Section IV).

2.  **Branch Selection:**  Confirm the correct branch is being deployed (typically `main` or a release branch).

3.  **Database Changes:**  Record any database schema changes implemented in this deployment. This is critical for post-deployment verification.

4.  **Environment Variables:** Double-check that all necessary environment variables are correctly configured in the Railway project.  These include:
    *   `DATABASE_URL`: Your production database connection string.
    *   `REDIS_URL`: Your production Redis connection string.
    *   `SENDGRID_API_KEY`: Your SendGrid API key.
    *   `SECRET_KEY`:  Your application's secret key.
    *   (Any other relevant environment variables).

**II. Deployment Steps**

1.  **Login to Railway CLI:**
    ```bash
    railway login
    ```

2.  **Navigate to Project:**
    ```bash
    railway cwd <project_name>
    ```

3.  **Pull Latest Changes:**  Fetch the latest code from the designated branch.
    ```bash
    railway pull main # Replace 'main' with your production branch
    ```

4.  **Run Build & Deploy:** This command will build the application, deploy it to Railway, and manage database migrations.
    ```bash
    railway deploy --tag <version_tag>
    ```
    *   `<version_tag>`:  Replace with the version tag of the deployed code (e.g., `v1.2.3`). This helps track the deployed version.

5.  **Monitor Deployment:**  Railway CLI will display the deployment progress.  Pay attention to any errors.

**III. Post-Deployment Verification**

1.  **Service Status Check:**
    ```bash
    railway services
    ```
    Verify that all Deuce Diary services (API, Redis, etc.) are running and healthy.

2.  **Application Accessibility:**
    *   **Web Browser:** Open the Deuce Diary application in a web browser.
    *   **API Tests:** Execute basic API tests to confirm functionality (e.g., retrieve a diary entry).

3.  **Database Verification:**
    *   **Database Connection:** Ensure the application can successfully connect to the database.
    *   **Schema Validation:** Verify that the database schema matches the expected changes.  You can use a database client to examine the tables and columns.

4.  **Logging:**  Review the application
