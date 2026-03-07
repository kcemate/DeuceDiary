# Write a production deployment runbook for Deuce Diary on Rai
Agent: jordan
Generated: 2026-03-03T11:30:20.520989

## Deuce Diary Production Deployment Runbook - Railway

**Version:** 1.0
**Date:** October 26, 2023
**Objective:**  Deploy the latest production version of Deuce Diary to the Railway production environment.

**Prerequisites:**

*   Access to Railway Dashboard with production project access.
*   SSH access to the Railway production servers (details below).
*   This runbook.
*   A clean build of the Deuce Diary code.  (Ensure this is the production-ready build - tagged with `production` or similar.)


**1. Environment Details:**

*   **Railway Project Name:** `deuce-diary-production`
*   **Railway Region:**  (Typically `us-central1`, confirm with Railway Dashboard)
*   **Production Servers:**
    *   **Web Server:** `deuce-diary-web-1` (Instance Type: `web-dyno`) - SSH Key: `[Your SSH Key ID]`
    *   **Database Server:** `deuce-diary-db-1` (Instance Type: `postgres-dyno`) - SSH Key: `[Your SSH Key ID]`


**2. Deployment Steps:**

**Step 1: Database Backup (Critical - before any changes)**

*   **Purpose:**  Create a backup of the existing database in case of issues.
*   **Command:**
    ```bash
    ssh deuce-diary-db-1 "pg_dump -U deuce_user -d deuce_diary -f deuce_diary_backup_$(date +%Y%m%d_%H%M%S).sql"
    ```
    *   **Explanation:**
        *   `pg_dump`:  PostgreSQL database backup utility.
        *   `-U deuce_user`:  Database user (replace with your actual user).
        *   `-d deuce_diary`:  Database name.
        *   `-f deuce_diary_backup_...`:  Output file name (timestamped for uniqueness).
*   **Verification:** Check for the successful creation of the backup file `deuce_diary_backup_...`.  Keep this file safe for potential restoration.


**Step 2: Deploy Code to Web Server**

*   **Method:**  Git Deployment via Railway (Recommended)
*   **Steps within Railway Dashboard:**
    1.  Navigate to the `deuce-diary-production` Railway project.
    2.  Go to the "Deploy" tab.
    3.  Select your Git repository.
    4.  Specify the branch: `production` (or the tag for your production build).
    5.  Configure Deployment Settings:
        *   **Environment Variables:** (Ensure these are correct!)
            *   `DATABASE_URL`:  PostgreSQL connection string (e.g., `postgres://deuce_user:password@deuce-diary-db-1:5432/deuce_diary`)
            *   `RAILWAY_API_KEY`: Your Railway API key.
        *   **Build Command:** (This will vary depending on your Deuce Diary build process)
            *   Example: `yarn build` or `npm run build` (adjust to your project's build script)
        *   **Post-Build Command:** (Example) `yarn start` or `npm start`
    6.  Click "Deploy".

**Step 3:  Verify Web Server Deployment**

*   **SSH to Web Server:**
    ```bash
    ssh deuce-diary-web-1
    ```
*   **Check Logs:** Review the application logs for any errors:
    *
