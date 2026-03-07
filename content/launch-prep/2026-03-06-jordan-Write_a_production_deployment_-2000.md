# Write a production deployment runbook for Deuce Diary on Rai
Agent: jordan
Generated: 2026-03-06T20:00:19.101865

## Deuce Diary Production Deployment Runbook - Railway

**Date:** October 26, 2023
**Version:** 1.0
**Goal:** Deploy a new version of the Deuce Diary application to the production Railway environment.

**1. Prerequisites:**

* **Railway Account:**  You must have an active Railway account and be logged in.
* **Railway CLI:** The Railway CLI must be installed and configured on your machine. (`railway up`)
* **Deuce Diary Repository:**  You have cloned the Deuce Diary repository to your local machine.
* **Railway Application URL:**  You know the current production URL of the Deuce Diary application on Railway.
* **Team Access:** You have the necessary team access permissions within your Railway team to deploy applications.
* **Understanding of Railway Concepts:** Familiarity with Railway's deployment model, including Services, Apps, and Environment variables.

**2. Deployment Steps:**

**Phase 1: Preparation & Verification**

1. **Pull Latest Changes:**
   ```bash
   git pull origin main
   ```
   (Replace `main` with the relevant branch name)

2. **Verify Local Development:**
   * Run the development server locally to confirm the latest code works as expected.
   * Ensure you have the correct environment variables set up locally (e.g., DATABASE_URL, SECRET_KEY).

3. **Checkout Production Branch:** (Recommended for controlled deployment)
   ```bash
   git checkout production
   ```
   (This ensures you're deploying a specific, tested branch.)

4. **Database Backup (Highly Recommended):**
   * **Option 1 (Railway's built-in):**  Railway automatically backs up your database. Verify this in the Railway UI.
   * **Option 2 (Manual - PostgreSQL):**  Use `pg_dump` to create a backup:
     ```bash
     pg_dump -U your_db_user your_db_name > backup.sql
     ```
     (Replace `your_db_user` and `your_db_name` with your actual database credentials.)


**Phase 2: Deployment to Railway**

1. **Deploy the App:**
   ```bash
   railway deploy --repo .
   ```
   This command will:
      *  Create a new App in Railway (if one doesn't already exist)
      *  Build the application (if necessary – Deuce Diary likely already has a `Dockerfile`)
      *  Push the code to the Railway environment.
      *  Start the application.

2. **Railway UI Verification:**
   * Navigate to your Deuce Diary App in the Railway UI.
   * **Logs:**  Monitor the application logs in the UI for any errors or warnings.
   * **Health Checks:** Ensure the health checks pass.  This confirms the application is running and responding correctly.
   * **Service Connections:**  Verify that all necessary services (e.g., database) are properly connected and running.

**Phase 3: Post-Deployment & Testing**

1. **Check Deployment Status:** The Railway UI provides a detailed deployment status.  Wait for the deployment to complete successfully.

2. **Access the Application:**  Use the production URL provided by Railway to access the Deuce Diary application.

3. **Smoke Tests:** Perform basic smoke tests to ensure functionality:
   * **Login:** Attempt to log in with a test user account.
   * **Create Diary Entry:**  Create a new diary entry.
   * **View Diary Entries:**  View existing diary entries.
   * **Basic Navigation:**  Verify that navigation links are functioning correctly.

4. **Extended Testing (Critical):**  Conduct thorough testing,
