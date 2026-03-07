# Write a production deployment runbook for Deuce Diary on Rai
Agent: jordan
Generated: 2026-03-03T08:52:07.843935

## Deuce Diary Production Deployment Runbook - Railway

**Version:** 1.0
**Date:** October 26, 2023
**Prepared By:** [Your Name/Team Name]
**Objective:** To reliably deploy the latest production version of Deuce Diary to the Railway production environment.

**Assumptions:**

*   You have a Railway account and access to the Deuce Diary Railway project.
*   You are familiar with the Railway CLI and basic deployment concepts.
*   You have verified the latest code is deployed to the `main` branch.
*   You have configured the Railway project with necessary secrets (database credentials, API keys, etc.).  This runbook assumes these are already set.

**I. Pre-Deployment Checks:**

1.  **Verify Code:**
    *   **Action:**  Confirm the latest changes have been pushed to the `main` branch of the Deuce Diary Railway project on GitHub.
    *   **Verification:**  Check the GitHub repository's commit history.
2.  **Railway Project Status:**
    *   **Action:** `rail service list` - Verify all services within the Deuce Diary project are running and healthy.
    *   **Expected Outcome:** All services should show "healthy" status.
3.  **Database Connection:**
    *   **Action:**  Attempt to connect to the database using the credentials configured in Railway.
    *   **Tool:**  Use a database client like Dbeaver or a CLI tool like `psql` depending on your database.
    *   **Expected Outcome:** Successful connection.
4.  **Secrets Review:**
    *   **Action:**  Double-check all secrets are correctly configured within the Railway project.  Pay particular attention to database passwords, API keys, and any environment variables.
    *   **Tool:**  Railway Console -> Project Settings -> Secrets.

**II. Deployment Steps:**

1.  **Pull Latest Code:**
    *   **Action:** `rail pull` – This command pulls the latest changes from the GitHub repository to the Deuce Diary Railway project.
    *   **Expected Outcome:** Successful pull without errors.
2.  **Run Migrations:**
    *   **Action:** `rail deploy` - This command automatically performs the following:
        *   Builds the application
        *   Runs database migrations.  Railway automatically manages this based on the database changes in your code.
    *   **Expected Outcome:**  Successful deployment with no errors related to database migrations.  Check the Railway Console logs for migration details.
3.  **Roll Forward Services:**
    *   **Action:** `rail deploy` - Again, this command handles rolling forward the services to the latest version.  It will update any service dependencies to match the deployed code.
    *   **Expected Outcome:** Successful deployment with no errors.
4.  **Verify Service Status:**
    *   **Action:** `rail service list` – Confirm all services are now running and healthy.
    *   **Expected Outcome:** All services should show "healthy" status.
5.  **Check Application Health Endpoint:**
    *   **Action:** Access the application’s health endpoint (e.g., `/health` or similar - check your application's documentation).
    *   **Verification:**  The endpoint should return a 200 OK status with expected health data.

**III. Post-Deployment Actions:**

1.  **Monitor Logs:**
    *   **Action:**  Review the logs for all services in the Railway Console.
    *   **Tool:**  Railway Console -> Services -> [Service Name] -> Logs.  Look for any errors or warnings.
2.  **Test Functionality:**
    *
