# Write a production deployment runbook for Deuce Diary (Expre
Agent: jordan
Generated: 2026-03-02T21:44:20.653250

## Deuce Diary Production Deployment Runbook - Railway

**Objective:** This runbook outlines the steps required to deploy the Deuce Diary application to production on Railway.

**Assumptions:**

*   You have a Railway account and a Railway project named "deuce-diary".
*   You have the necessary permissions to push code and manage Railway services within the project.
*   You are familiar with Express.js and the Deuce Diary codebase.
*   You have configured a Railway Secrets for sensitive information like database credentials.


**I. Pre-Deploy Checks (Mandatory)**

Before initiating deployment, these checks must be completed to ensure a smooth process:

1.  **Code Review & PR:** Ensure the latest code changes have been reviewed and merged into the main branch (typically `main` or `develop`). Verify the PR is closed.
2.  **Test Suite Execution:** Run the entire test suite locally (`npm test` or equivalent).  All tests must pass.
3.  **Linting & Formatting:** Ensure the code passes linting and formatting checks (e.g., using ESLint and Prettier).
4.  **Railway Service Status:** Confirm that all existing Railway services (Frontend, Backend, Database) are running and healthy.
5.  **Environment Variables:** Double-check that all required environment variables are configured correctly in Railway Secrets (e.g., database URL, API keys, etc.). Verify values match the production environment.
6.  **Database Backup (Optional but Highly Recommended):**  Create a database backup before any code changes are applied.  This allows for a quick rollback if something goes wrong.

**II. Deployment Command (Railway CLI)**

This section describes the commands to be used for deployment.

1.  **Login to Railway:**
    ```bash
    railway login
    ```
    Authenticate with your Railway account credentials.
2.  **Navigate to Project:**
    ```bash
    cd deuce-diary
    ```
3.  **Push Code:**
    ```bash
    railway push
    ```
    This command pushes the latest code from your Git repository to Railway.  Railway will automatically trigger deployments of all services associated with the project.
    *   **Note:** Railway will handle scaling and configuring services based on your project’s setup.

**III. Post-Deploy Verification**

After the deployment is complete, verify the application is running correctly.

1.  **Railway Dashboard:**
    *   Monitor the deployment status in the Railway Dashboard. It will show the status of each service.
2.  **Backend Status:**
    *   Check the Backend service in the Railway Dashboard to ensure it’s running and responding to requests.  Look for any errors in the logs.
3.  **Frontend Status:**
    *   Check the Frontend service in the Railway Dashboard to ensure it’s running and displaying the application correctly.
4.  **Database Connection:**
    *   Confirm that the database is connected and accessible. You can often verify this through the Railway dashboard or by running basic database queries.
5.  **Basic Functionality Test:**
    *   Manually navigate to the application in a browser (e.g., `https://deuce-diary.railway.app`) and perform basic functions like:
        *   Login
        *   Create a new diary entry
        *   View diary entries
6.  **Logging Review:** Inspect the backend logs for any errors or warnings that might indicate a problem.

**IV. Rollback Procedure**

If a deployment introduces critical issues, a rollback is necessary.

1.  **Identify the Problem:** Clearly identify the issue and its impact on the application.
2.  **Railway Rollback (Recommended):** The easiest and most reliable rollback
