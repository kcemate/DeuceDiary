# Write a production deployment runbook for Deuce Diary on Rai
Agent: jordan
Generated: 2026-03-03T09:59:45.704447

## Deuce Diary Production Deployment Runbook - Railway

**Version:** 1.0
**Date:** October 26, 2023
**Purpose:** This runbook details the steps required to deploy a new version of Deuce Diary to the Production Railway environment.  It's intended for experienced DevOps engineers.  Follow carefully and ensure you have backups before proceeding.

**Prerequisites:**

* **Railway Account:**  You need an active Railway account with appropriate permissions to manage the Deuce Diary service.
* **Railway CLI:**  The Railway CLI must be installed and configured on your machine. ( `railway up --help` for configuration)
* **Deuce Diary Code:**  You must have the latest production code, including any necessary assets (images, CSS, etc.), in a Git repository.
* **Production Database Access:** Credentials for the production PostgreSQL database (hostname, database name, username, password). *Securely store these!*
* **Understanding of Deuce Diary Architecture:** Familiarity with the application's structure, dependencies, and deployment process is crucial.
* **Rollback Plan:**  You MUST have a plan for quickly reverting to the previous version if issues arise. (See Rollback section)


**I.  Preparation & Verification (15-30 mins)**

1. **Verify Code Integrity:**
   *  Ensure the latest production branch is checked out. `git checkout production`
   *  Run tests locally.  `pytest` (adjust command based on your testing setup).
   *  Lint the code.  `flake8` or `pylint`
2. **Update Railway Service Configuration (Production):**
   *  Log into the Railway dashboard.
   *  Navigate to the Deuce Diary service in the Production environment.
   *  **Important:** Review and update the `railway.yml` configuration file. Pay special attention to:
      *  **Environment Variables:** Confirm all necessary environment variables are set correctly, including database credentials, API keys, and any other production-specific configurations.
      *  **Port Mapping:**  Ensure the application is listening on the correct port (typically 8080 or whatever is defined in your `railway.yml`).
      *  **Resource Limits:**  Verify that the resource limits (CPU, memory) assigned to the service are sufficient for production traffic.
3. **Database Schema Changes:**  *Only proceed if database migrations are automated!*
    *  Ensure the latest database migrations are applied *locally* against a development or staging database.  This is critical to avoid schema inconsistencies.



**II. Deployment Process (30-60 mins)**

1. **Prepare Deployment Artifacts:**
   *  Build the Deuce Diary application. This might involve:
      *  Running `python manage.py collectstatic` (if static files need to be bundled)
      *  Running `python manage.py migrate` (if database migrations are not automated, this step is essential)
   *  Create a compressed archive of the built application. (e.g., `deuce_diary-production.zip`)
2. **Deploy to Railway:**
   *  In the Railway dashboard, select the Deuce Diary service in the Production environment.
   *  Click "Deploy".
   *  Choose "Upload" and select the `deuce_diary-production.zip` file.
   *  Railway will automatically handle the deployment process:
      *  It will extract the archive.
      *  It will restart the service.
      *  It will set environment variables based on your `railway.yml` configuration.
3. **Monitor Deployment:**
   *  Use the Railway dashboard to monitor the deployment status.  Pay attention to logs
