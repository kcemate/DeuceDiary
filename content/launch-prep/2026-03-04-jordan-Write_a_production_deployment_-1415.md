# Write a production deployment runbook for Deuce Diary on Rai
Agent: jordan
Generated: 2026-03-04T14:15:14.442852

## Deuce Diary Production Deployment Runbook - Railway

**Version:** 1.0
**Date:** October 26, 2023
**Author:** Gemini AI

**Objective:** This runbook outlines the steps to deploy a production version of Deuce Diary to Railway.

**Prerequisites:**

*   **Railway Account:** A paid Railway account is required.
*   **Railway CLI:** Installed and configured on your local machine. (Instructions: [https://railway.io/docs/guides/cli](https://railway.io/docs/guides/cli))
*   **SSH Access:** Established to your Railway service.
*   **Git Repository:** Deuce Diary code committed to a Git repository (e.g., GitHub, GitLab, Bitbucket).
*   **Railway Service Created:**  A Railway service should be created and configured to host Deuce Diary. This runbook assumes a service named "deuce-diary" exists.
*   **Database Connection Details:**  Know the credentials for your database (PostgreSQL in this case).

**Estimated Time:** 30-60 minutes

**Steps:**

**1. Update Code (Pre-Deployment)**

*   **Pull Latest Changes:**
    ```bash
    git pull origin main  # Or your production branch name
    ```
*   **Run Tests:**
    ```bash
    pytest  # Or your testing command
    ```
    Ensure all tests pass.  If not, investigate and fix the issues before proceeding.
*   **Linting & Formatting:**
    ```bash
    black .  # Or your preferred code formatter
    flake8 .  # Or your preferred linter
    ```
    Fix any linting or formatting issues.

**2. Deploy to Railway**

*   **Pull the Latest Branch:**  Make sure you're on the correct branch.
    ```bash
    git checkout main  # Or your production branch name
    ```
*   **Deploy using Railway CLI:**
    ```bash
    railway up --repo <YOUR_REPOSITORY_URL> --service-name deuce-diary --dockerfile .
    ```
    *   Replace `<YOUR_REPOSITORY_URL>` with the URL of your Git repository.
    *   `--service-name deuce-diary` specifies the name of the Railway service.
    *   `--dockerfile .` tells Railway to use the Dockerfile in the current directory as the build context.

    **Alternatively, deploy using the Railway UI:**
    1.  Navigate to your Railway service ("deuce-diary") in the Railway web interface.
    2.  Click the "Deploy" button.
    3.  Select your Git repository and the branch to deploy.
    4.  Click "Deploy".

**3.  Post-Deployment Configuration & Checks**

*   **Verify Deployment:**  The Railway CLI will provide you with the service URL after deployment. Note it down.
*   **Check Service Logs:**  Navigate to your Railway service and click "Logs" to monitor the application's logs for errors.
    ```bash
    railway logs deuce-diary  # Using CLI
    ```
*   **Database Connection:**
    *   Ensure the database connection string in your environment variables is correct. (See section 4).
    *   Verify the database is running.
*   **Environment Variables:**  Confirm that all required environment variables are set correctly. (See section 4).

**4. Environment Variables (Critical)**

The following environment variables are required for Deuce Diary to function correctly:

| Variable Name      | Description                               | Default Value (Example) |
|--------------------|-------------------------------------------|--------------------------|
| DATABASE
