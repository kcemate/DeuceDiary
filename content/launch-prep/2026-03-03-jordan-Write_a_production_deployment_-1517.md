# Write a production deployment runbook for Deuce Diary on Rai
Agent: jordan
Generated: 2026-03-03T15:17:06.410789

## Deuce Diary Production Deployment Runbook - Railway

**Version:** 1.0
**Date:** October 26, 2023
**Purpose:** This runbook outlines the steps for deploying a new version of Deuce Diary to the production Railway environment.  It’s designed to be executed by experienced Railway users.  **Always review this document thoroughly before executing.**

**Assumptions:**

* You have a Railway account with appropriate permissions.
* You have a deployed Deuce Diary application on Railway.
* You have a working Railway CLI and a configured Railway account.
* You have access to the Deuce Diary repository.
* You understand the Deuce Diary deployment architecture (services, database, etc.).

**I. Pre-Deployment Checks & Preparation:**

1. **Verify Branch:**  Confirm you are deploying from the `production` branch.  Use `rail service list` and `rail branch` to verify.
2. **Database Backup:**  **Critical!** Before deploying, create a full backup of the Deuce Diary database.  
    *  Using the Railway CLI:  `rail service database backup --service DeuceDiaryDB -n <backup_name>` (Replace `<backup_name>` with a meaningful name, e.g., `production_backup_20231026`)
3. **Review Changes:**  Thoroughly review the changes in the `production` branch.  Focus on new features, bug fixes, and any infrastructure updates.
4. **Testing (Staging):** Ideally, deploy to a staging environment first for final testing. This runbook is primarily for the production deployment.  If staging isn't available, extra caution is required.
5. **Communication:**  Notify the relevant teams (DevOps, Operations) that the deployment is about to begin.

**II. Deployment Steps:**

1. **Fetch Latest Changes:**  Ensure your local repository is up-to-date.
   ```bash
   git fetch origin
   git checkout production
   git pull origin production
   ```

2. **Build & Push to Railway:**  Build the Deuce Diary application and push it to Railway.
   ```bash
   rail build --service DeuceDiary --tag <new_version_tag>
   rail deploy --service DeuceDiary --tag <new_version_tag>
   ```
   *  Replace `<new_version_tag>` with a semantic version (e.g., `1.2.3`).  This should be a publicly accessible tag.

3. **Rolling Restart (If applicable – adjust based on application architecture):** Deuce Diary likely has multiple services.  Restarting them one by one is recommended for minimal downtime.
   ```bash
   rail service restart --service DeuceDiaryApp
   rail service restart --service DeuceDiaryDB
   # ... and any other necessary services
   ```
   * **Monitor Logs:**  Continuously monitor the application logs during the restart process to ensure no errors occur.  Use `rail service logs --service DeuceDiaryApp` or consult the Railway dashboard.

4. **Database Schema Migration (If Applicable):** If your changes include database schema updates, you’ll need to run the migrations *after* the application services are running.
   *   **Connect to the database service:** `rail service database connect --service DeuceDiaryDB` (This will output connection details)
   *   **Run Migrations:**  Execute the necessary migrations using the database client (e.g., `psql` for PostgreSQL, `mysql` for MySQL).  **Double-check your migration commands!**
   *   **Example (PostgreSQL):** `psql -d DeuceDiaryDB -U <user> -h <
