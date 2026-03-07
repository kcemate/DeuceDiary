# Write a production deployment runbook for Deuce Diary on Rai
Agent: jordan
Generated: 2026-03-06T22:26:49.500484

## Deuce Diary Production Deployment Runbook - Railway

**Version:** 1.0
**Date:** October 26, 2023
**Author:** AI Assistant

**Objective:** This runbook outlines the steps required to deploy a new version of Deuce Diary to the production Railway environment. This process utilizes GitHub Actions and Railway's CLI for automated deployment.

**Prerequisites:**

*   **Railway Account:** You must have an active Railway account and be logged in via the CLI (`rail`) or web interface.
*   **Deuce Diary GitHub Repository:**  You need access to the Deuce Diary GitHub repository and be able to create and push GitHub Actions workflows.
*   **Railway CLI:**  The Railway CLI should be installed and configured. (Install: `rail --version`)
*   **Environment Variables:**  Ensure the required environment variables are defined in your Railway project's settings (see below).
*   **Testing:** Thoroughly test the new branch locally *before* proceeding with this deployment.

**1. Preparation & Branching:**

*   **Branch:** Deploy from a dedicated production branch (e.g., `main`, `release`) – **NEVER** deploy directly from `develop` or feature branches.
*   **Code Review:**  Ensure the code changes have been reviewed and approved by the team.
*   **Database Migrations:**  Execute any necessary database migrations. This *must* be included in your deployment process.


**2. Deployment Steps:**

1.  **Commit and Push Changes:**
    *   Commit all changes to your production branch.
    *   Push the branch to the GitHub repository: `git push origin <production_branch_name>`

2.  **Trigger GitHub Actions Workflow:**
    *   The GitHub Actions workflow (defined in `.github/workflows/deploy.yml`) will automatically detect the push.
    *   This workflow will:
        *   Checkout the latest code from the production branch.
        *   Build the Deuce Diary application.
        *   Run tests.
        *   Deploy the built application to Railway.

3.  **Monitor Deployment Status:**
    *   The GitHub Actions workflow provides detailed logs.  You can access these via the GitHub repository's Actions tab.
    *   Railway’s web interface also displays the status of the deployment.  Navigate to your project's dashboard.

**3.  Railway Configuration (Verify & Update):**

*   **Environment Variables:**  (These are *critical* - ensure these are correct and up-to-date!)
    *   `DATABASE_URL`:  Your Deuce Diary database connection string (PostgreSQL).
    *   `REDIS_URL`: Your Deuce Diary Redis connection string (optional, but recommended).
    *   `RAILWAY_API_TOKEN`:  Your Railway API token (usually generated via the Railway CLI).
    *   `DEUCE_DIARY_SERVICE_URL`: The base URL of your deployed Deuce Diary service (e.g., `https://deuce-diary-prod.railway.app`).  This is used for internal communication.

*   **Railway Project Settings:**
    *   Verify your Railway project settings align with the above environment variables.
    *   Confirm the correct service plan is selected for your deployment.

**4. Post-Deployment Verification:**

1.  **Service URL:** Note the URL of the deployed Deuce Diary service (as configured in your Railway project settings).
2.  **Application Status:** Check the application's status in the Railway dashboard. It should be "Running".
3.  **Functionality Testing:**  Perform basic functionality testing:
    *   Login with a test account.
    *   Create
