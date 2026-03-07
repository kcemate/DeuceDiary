# Write a production deployment runbook for Deuce Diary on Rai
Agent: jordan
Generated: 2026-03-03T07:44:48.039698

## Deuce Diary Production Deployment Runbook - Railway

**Document Version:** 1.0
**Date:** October 26, 2023
**Prepared By:** AI Assistant

**Objective:** This runbook outlines the steps for deploying a production version of Deuce Diary to Railway.  It assumes a basic understanding of Railway and its CLI.

**Prerequisites:**

*   **Railway Account:** Active Railway account with a paid plan.
*   **Railway CLI:** Installed and configured on your machine.
*   **Deuce Diary Code:** The latest production branch of the Deuce Diary code is available in your Git repository.
*   **Railway Account Permissions:** You have the necessary permissions to create and manage services within your Railway account.
*   **Railway Secrets:** You’ve created and populated the necessary Railway Secrets (see “Required Secrets” section below).
*   **Database Access:** You have credentials for your chosen database (PostgreSQL recommended) and understand how to connect to it.



**I. Preparation & Setup:**

1.  **Verify Code:**
    *   Pull the latest production branch from your Git repository: `git pull origin production`
    *   Ensure your code is clean and passing all tests.
2.  **Database Migration:**
    *   Ensure the database schema is up-to-date.  Run any necessary database migrations *before* deployment. This should be part of your CI/CD pipeline.
3.  **Environment Variables:**
    *   Confirm all environment variables needed by Deuce Diary are defined correctly in your repository’s `.env.production` file (or a similar production configuration).

**II. Required Secrets:**

*   **DATABASE_URL:**  The connection string to your production PostgreSQL database (e.g., `postgres://user:password@host:port/database`).  **Critical.**
*   **REDIS_URL:** The connection string to your Redis instance. (e.g., `redis://localhost:6379`)
*   **STRONGBOX_URL (Optional but Recommended):** URL to your Strongbox instance (e.g., `https://your-strongbox-url`). This is used for analytics and tracking.
*   **SENDGRID_API_KEY (Optional):** SendGrid API Key for sending emails.
*   **NEXTAUTH_URL:**  The base URL for your Deuce Diary application (e.g., `https://deuce-diary.your-domain.com`)
*   **NEXTAUTH_URL_BASE:**  The base URL for your application *without* the trailing slash (e.g., `deuce-diary`) - Needed for some configuration.

**III. Deployment Steps (Using Railway CLI):**

1.  **Login to Railway:**
    ```bash
    railway up login
    ```
2.  **Navigate to Deuce Diary Project Directory:**
    ```bash
    cd /path/to/your/deuce-diary-repo
    ```
3.  **Create a New Railway App:**
    ```bash
    railway up new --name deuce-diary-production --stack none --deploy-scope project
    ```
    *   `--name`:  The name of your Railway app.
    *   `--stack none`:  Ensures we are using the native stack for flexibility.
    *   `--deploy-scope project`:  Specifies the deploy scope for this app.
4.  **Install Dependencies (within the Railway app):**
    ```bash
    railway install
    ```
    This command will automatically install any required dependencies based on the project's `package.json` (or similar package manifest).
5.  **Connect to the
