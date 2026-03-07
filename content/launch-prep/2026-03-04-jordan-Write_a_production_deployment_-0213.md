# Write a production deployment runbook for Deuce Diary on Rai
Agent: jordan
Generated: 2026-03-04T02:13:41.107954

## Deuce Diary - Railway Production Deployment Runbook

**Version:** 1.0
**Date:** October 26, 2023
**Purpose:** This runbook outlines the steps required to deploy a new version of Deuce Diary to the production Railway environment. It's designed to be followed by experienced deployment personnel.

**Prerequisites:**

*   Railway Account & Organization
*   Railway CLI Installed & Configured
*   Access to the Deuce Diary GitHub Repository
*   Understanding of Railway concepts (Workflows, Services, Secrets, etc.)
*   Post-deployment testing plan documented (see Appendix)

**I. Environment Overview:**

*   **Deuce Diary:** A Ruby on Rails application serving the Deuce Diary website.
*   **Railway Services:**
    *   **Database:** PostgreSQL (Managed Service - Railway handles scaling)
    *   **Runtime:** Puma (Web Server)
    *   **Storage:** S3 (Static Assets)
    *   **Authentication:** Clerk (External Service - managed by Railway)
*   **Workflow:** Railway Workflow that manages the deployment process.


**II. Deployment Steps:**

**Phase 1: Preparation & Branch Setup**

1.  **Verify Branch:** Ensure you're deploying from the `main` branch (or the designated production branch).
2.  **Pull Latest Code:**
    ```bash
    git pull origin main
    ```
3.  **Verify Gemfile & Gemfile.lock:** Ensure dependencies are correct and consistent.
4.  **Commit Changes:** Commit any local changes.  (Recommended, but not strictly required)
    ```bash
    git add .
    git commit -m "Deployment of [Commit SHA]"
    ```

**Phase 2: Deployment via Railway Workflow**

1.  **Login to Railway CLI:**
    ```bash
    railway up login
    ```
2.  **Navigate to Deuce Diary Project:**
    ```bash
    railway cwd [your_organization_name]/deuce-diary
    ```
3.  **Trigger Deployment:**  Within the Deuce Diary project directory, trigger the deployment workflow via the Railway CLI. This will use the defined Railway Workflow:
    ```bash
    railway workflow trigger
    ```
    *   This command initiates the workflow, which will:
        *   Pull the latest code from the GitHub repository.
        *   Install dependencies.
        *   Run database migrations.
        *   Build assets.
        *   Deploy the application to the Puma web server.
        *   Update the S3 bucket with new assets.

**Phase 3: Verification & Monitoring**

1.  **Check Deployment Status:** The Railway CLI will provide real-time updates on the workflow status.
2.  **Monitor Application Health:**
    *   **Railway Dashboard:**  Check the Deuce Diary service in the Railway Dashboard for uptime, response times, and error logs.
    *   **Clerk Dashboard:**  Verify Clerk integration is functioning correctly (user sign-up/login, etc.).
    *   **Logs:**  Review logs in the Railway Dashboard for any application errors.
3.  **Access Deuce Diary:**  Navigate to the live Deuce Diary website to verify functionality.

**Phase 4: Post-Deployment Tasks (Automated in Workflow)**

*   **Database Migrations:**  The workflow automatically executes database migrations.
*   **Asset Builds:** The workflow automatically rebuilds static assets.
*   **S3 Deployment:** The workflow automatically deploys updated assets to S3.
*   **Clerk Integration:** The workflow automatically updates the Clerk configuration.


**III. Troubleshooting:**

*   **Deployment Stuck:**  Check the Railway Dashboard
