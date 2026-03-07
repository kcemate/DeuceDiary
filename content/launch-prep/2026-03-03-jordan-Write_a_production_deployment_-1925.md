# Write a production deployment runbook for Deuce Diary on Rai
Agent: jordan
Generated: 2026-03-03T19:25:59.792423

## Deuce Diary Production Deployment Runbook - Railway

**Version:** 1.0
**Date:** October 26, 2023
**Purpose:** This document outlines the steps required to deploy a new version of Deuce Diary to the production Railway environment.  It's designed for a single, well-documented deployer.

**Prerequisites:**

*   **Railway Account & Project:** You must have an active Railway account and the “DeuceDiary” project set up.
*   **Railway CLI Installed & Authenticated:** Ensure the Railway CLI (`railway up`) is installed and logged in.
*   **Deuce Diary Code:** The latest version of the Deuce Diary source code must be committed to your chosen Git repository (e.g., GitHub).
*   **Production Database Access:** Credentials for the production PostgreSQL database (host, username, password, database name) must be readily available.
*   **Understanding of Railway Concepts:** Familiarity with Railway services, deployment stages, and environment variables is assumed.


**Step-by-Step Deployment:**

**1. Preparation (5-10 mins)**

*   **Review Changes:** Carefully review the changes in the new code branch.  Ensure there are no breaking changes or significant security vulnerabilities.
*   **Database Migration Check:**  Confirm that the latest database migrations have been completed and tested locally.
*   **Environment Variable Verification:** Double-check that all necessary environment variables are correctly defined in the Railway project settings.  Key variables include:
    *   `DATABASE_URL` (PostgreSQL connection string)
    *   `RAILWAY_API_KEY` (Railway API key)
    *   `REDIS_URL` (Redis connection string - if used)
    *   `SENDGRID_API_KEY` (SendGrid API Key - if used)
    *   Any other environment variables specific to your Deuce Diary configuration.
*   **Staging Deployment:** **Crucially, always deploy to Staging first!** This runbook focuses on production deployment *after* successful Staging deployment.



**2.  Deployment to Production (15-30 mins)**

1.  **Checkout the Latest Code:**  From your terminal, checkout the latest code from the production branch of your Git repository.

    ```bash
    git checkout main # Or the relevant production branch name
    ```

2.  **Deploy to Railway Production:**  Use the Railway CLI to deploy to the production environment. This command automatically handles the build, deployment, and scaling of your application.

    ```bash
    railway up --repo <your_repository_url> --branch main --production
    ```

    *   Replace `<your_repository_url>` with the URL of your Deuce Diary repository (e.g., `https://github.com/yourusername/deuce-diary.git`).
    *   `--branch main` specifies the branch to deploy. Adjust if using a different branch.
    *   `--production` designates the target environment as production.

3. **Monitor Deployment:**  The `railway up` command will output detailed logs.  Pay close attention to the logs for any errors or warnings.  The Railway dashboard will also show the deployment progress.

**3. Post-Deployment Verification (10-15 mins)**

1.  **Application Accessibility:** Open the Deuce Diary application in your browser.  Verify that the application is running correctly.

2.  **Basic Functionality Test:**  Perform basic tests to ensure core features are working:
    *   Login (if applicable)
    *   Create a new diary entry
    *   View existing diary entries

3.  **Database Connection Check:**  Verify that the application is successfully connecting to
