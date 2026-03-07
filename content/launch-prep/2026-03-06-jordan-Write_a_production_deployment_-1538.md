# Write a production deployment runbook for Deuce Diary on Rai
Agent: jordan
Generated: 2026-03-06T15:38:03.153863

## Deuce Diary Production Deployment Runbook - Railway

**Version:** 1.0
**Date:** October 26, 2023
**Author:** [Your Name/Team Name]

**Purpose:** This document outlines the steps required to deploy a production version of Deuce Diary to Railway. It assumes a basic familiarity with Railway and the Deuce Diary codebase.

**Prerequisites:**

*   Railway Account & Project:  You must have a Railway account and a Railway project created for Deuce Diary.
*   Railway CLI: The Railway Command Line Interface (CLI) must be installed and configured.
*   Git Repository: Deuce Diary code must be accessible through a Git repository (e.g., GitHub, GitLab).
*   Railway Secrets:  You'll need to have configured necessary secrets in Railway (e.g., database connection strings, API keys).
*   Production Database Access:  Access to your production database (PostgreSQL) is required for schema migrations.


**1. Preparation & Branching**

*   **Branch:**  Ensure you’re deploying from the `production` branch. This branch should be regularly merged from `develop` (or equivalent) after thorough testing.
*   **Code Review:** Perform a final code review to ensure no critical changes have been missed.
*   **Linting & Testing:** Run all automated linting and testing scripts.  Ensure all tests pass before proceeding.
*   **Database Migrations:**  Before deployment, run the necessary database migrations to ensure the database schema is updated to support the latest code changes. This should be done *locally* to avoid potential issues on production.


**2. Deployment Steps**

**Step 1: Deploy Frontend (React)**

1.  **Connect to Railway:**  Open your terminal and connect to your Railway CLI:
    ```bash
    railway up
    ```
2.  **Navigate to Project Directory:**  Change your current directory to the root of your Deuce Diary project.
3.  **Deploy Frontend:**  Run the following command to deploy the React frontend to Railway. Replace `<branch_name>` with the name of your production branch:
    ```bash
    railway deploy --repo <git_repository_url> --branch <branch_name> --tag production
    ```
    *   **Explanation:**
        *   `railway deploy`:  The primary Railway command for deployment.
        *   `--repo <git_repository_url>`: Specifies the URL of your Git repository.
        *   `--branch <branch_name>`:  Specifies the branch to deploy from.
        *   `--tag production`:  Adds a production tag to the deployed artifact.
4.  **Verify Deployment:**  Railway will display the deployment URL for the frontend. Note this URL – you'll need it in the next step.

**Step 2: Deploy Backend (Python/Flask)**

1.  **Navigate to Backend Directory:**  Change your current directory to the root of your Deuce Diary backend project.
2.  **Deploy Backend:**  Run the following command to deploy the Flask backend to Railway. Replace `<branch_name>` with the name of your production branch:
    ```bash
    railway deploy --repo <git_repository_url> --branch <branch_name> --tag production
    ```
    *   **Explanation:** Same as Step 1.
3.  **Verify Deployment:**  Railway will display the deployment URL for the backend. Note this URL – you'll need it in the next step.

**Step 3: Configure Database Connection (If Necessary)**

*   **Railway Secrets:** This step assumes you've already configured your database connection details as Railway secrets. If not, you'
