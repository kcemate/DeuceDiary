# Write a production deployment runbook for Deuce Diary on Rai
Agent: jordan
Generated: 2026-03-03T20:11:21.667247

## Deuce Diary Production Deployment Runbook - Railway

**Version:** 1.0
**Date:** October 26, 2023
**Purpose:**  This runbook outlines the steps to deploy a new version of Deuce Diary to the production environment on Railway.
**Assumptions:**
* You have a Railway account and have configured the Railway CLI.
* You have access to the Deuce Diary repository.
* You've configured Railway SSH keys for access to the servers.
* You understand the Deuce Diary architecture and dependencies.


**I. Pre-Deployment Checks:**

1. **Code Review & Testing:**
   *  **Confirmation:** Verify the latest code has been thoroughly reviewed and all tests (unit, integration, e2e) have passed.
   *  **Staging Environment:**  Deploy to the staging environment first to confirm the new version functions correctly in a similar production-like environment.  Document any findings.

2. **Railway Configuration:**
   * **Railway CLI:** Ensure the Railway CLI is up-to-date: `railway upgrade`
   * **Environment Variables:** Confirm the correct environment variables are set in the Railway Environment settings:
       *  `DATABASE_URL`: Your PostgreSQL connection string.
       *  `REDIS_URL`:  Your Redis connection string.
       *  `RAILWAY_API_KEY`: Your Railway API key.
       *  (Any other environment variables specific to Deuce Diary’s configuration).
   * **Service Limits:** Verify Railway service limits (CPU, Memory, Network) are sufficient for the application's current and projected load.  Consider scaling services if needed.


**II. Deployment Steps:**

1. **Pull Latest Code:**
   *  Connect to the Railway SSH terminal: `railway ssh`
   *  Pull the latest code from the Deuce Diary repository: `git pull origin main` (or the relevant branch)

2. **Build & Deploy (PostgreSQL & Redis):**
   * **Build PostgreSQL:**
     *  Navigate to the PostgreSQL container directory: `cd postgres`
     *  Build the Docker image (if needed): `docker build -t postgres:latest .`
     *  Push the image to Railway: `railway build postgres`
   * **Build Redis:**
     *  Navigate to the Redis container directory: `cd redis`
     *  Build the Docker image (if needed): `docker build -t redis:latest .`
     *  Push the image to Railway: `railway build redis`

3. **Build & Deploy (Deuce Diary App):**
   *  Navigate to the Deuce Diary application directory (likely `app`).
   *  Build the Docker image: `railway build app`
   *  Push the image to Railway: `railway build app`

4. **Rolling Restart:**
   *  Railway should automatically initiate a rolling restart of the Deuce Diary application service.  Monitor the logs in the Railway console for any errors.
   * **Manual Restart (If Necessary):**  If the rolling restart fails, you can manually restart the service using:  `railway restart app`

5. **Verify Deployment:**
   *  **Check Logs:**  Review the application logs in the Railway console to ensure the application is running correctly.
   *  **Accessibility:**  Access the Deuce Diary website via the Railway-provided URL.
   *  **Functionality Testing:**  Perform basic functionality testing (e.g., creating a new diary entry, viewing existing entries).
   * **Database Connection:**  Verify the application can successfully connect to the PostgreSQL database.

**III. Post-Deployment Actions:**

1. **Monitor Application Health:**
   *
