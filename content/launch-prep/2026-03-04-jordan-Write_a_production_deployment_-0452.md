# Write a production deployment runbook for Deuce Diary on Rai
Agent: jordan
Generated: 2026-03-04T04:52:10.371324

## Deuce Diary Production Deployment Runbook - Railway

**Version:** 1.0
**Date:** October 26, 2023
**Prepared By:** [Your Name/Team Name]

**Purpose:** This runbook outlines the steps required to deploy a production version of Deuce Diary to Railway. This is a manual deployment process and should be followed carefully.  Automated deployments are planned for the future, but this provides a reliable fallback.

**Prerequisites:**

*   Railway Account with appropriate permissions.
*   Access to the Deuce Diary repository (GitHub).
*   Railway CLI installed and configured.
*   Understanding of Railway concepts (Services, Versions, Environments).
*   SSH key configured for Railway CLI.
*   Basic familiarity with the Deuce Diary codebase and deployment process.


**I. Pre-Deployment Checks & Preparation:**

1.  **Code Synchronization:**
    *   Ensure the latest production branch (`main` or `master`) of the Deuce Diary repository is synchronized with your local machine.
    *   Run `git pull origin main` (or `master`).

2.  **Build & Test (Local - Highly Recommended):**
    *   Run the following commands locally to build and test the application.  This is critical to catch any issues before deployment.
        *   `pip install -r requirements.txt`
        *   `python manage.py migrate`
        *   `python manage.py test` (Run all tests)
        *   `python manage.py runserver` (For quick testing – *Do NOT use in production*)

3. **Railway Environment Configuration:**
    *   **Environment Name:** `deuce-diary-production` (This is the name of the Railway environment you'll create.)
    *   **Services:**  You’ll need the following Railway services:
        *   **Railway App Service:**  Used for running the Deuce Diary application code.
        *   **Railway PostgreSQL Database Service:**  Used for storing the application's data.
        *   **Railway Redis Service (Optional):** If using Redis for caching.

**II. Deployment Steps (Railway CLI):**

1.  **Log in to Railway:**
    *   Open your terminal and run `railway login` and follow the prompts to log in to your Railway account.

2.  **Create the Production Environment:**
    *   Navigate to the directory containing your Deuce Diary codebase.
    *   Run `railway init deuce-diary-production`.  This will guide you through creating the new environment.  Answer the prompts, accepting the default settings for the App Service (e.g., language, framework) and configuring the PostgreSQL database.

3.  **Deploy the Application:**
    *   Within the Railway CLI, navigate to your Deuce Diary project directory.
    *   Run `railway deploy`. This will:
        *   Fetch the latest code from your Git repository.
        *   Install dependencies.
        *   Migrate the database.
        *   Restart the App Service.

4. **Database Configuration (Railway UI):**
   * Navigate to your `deuce-diary-production` environment in the Railway UI.
   * Select the PostgreSQL database service.
   *  Verify the database connection details are correct.  If you've manually created the database, ensure it's correctly connected.

5.  **Redis Configuration (Optional):**
    * If your application uses Redis, follow the Railway UI instructions to configure and start the Redis service.


**III. Post-Deployment Verification:**

1.  **Access the Application:**
    *   Railway will provide a public URL for your Deuce Diary production environment.  This URL
