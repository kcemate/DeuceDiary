# Write a production deployment runbook for Deuce Diary on Rai
Agent: jordan
Generated: 2026-03-03T06:37:26.109966

## Deuce Diary Production Deployment Runbook - Railway

**Version:** 1.0
**Date:** October 26, 2023
**Purpose:** This runbook outlines the steps required to deploy a new version of Deuce Diary to the production environment on Railway.
**Assumptions:**
* You have a Railway account and have connected your local development environment.
* You have access to the Deuce Diary repository on GitHub.
* You understand the Railway environment structure.
* You are familiar with Docker and Docker Compose.

**I. Prerequisites:**

* **Railway CLI:**  Ensure you have the Railway CLI installed and configured.
* **GitHub Access:**  Verify you have necessary permissions to push changes to the Deuce Diary GitHub repository.
* **Production Railway Instance:** Verify the Deuce Diary Railway instance exists and is running. Note the instance name (e.g., `deuce-diary-prod`).
* **Database Backup:**  **Crucially, a recent backup of the production database is REQUIRED before any deployment.** (See section IV. Backup & Rollback)


**II. Deployment Steps:**

1. **Update the Repository:**
   * Push your changes to the `main` branch of the Deuce Diary GitHub repository.
   * The Railway CLI automatically monitors the repository for changes.

2. **Trigger a Deployment:**
   * In your terminal, run the following Railway CLI command to initiate the deployment:
     ```bash
     railway deploy <instance_name>
     ```
     Replace `<instance_name>` with the name of your production Railway instance (e.g., `deuce-diary-prod`).
   * Railway will automatically:
     * Pull the latest code from the GitHub repository.
     * Build the Docker image (if necessary - usually automated by Railway).
     * Deploy the updated container to the Railway instance.

3. **Monitor Deployment Progress:**
   * The Railway CLI will provide real-time output showing the deployment progress.
   * You can also monitor the deployment status in the Railway web interface ([https://railway.app/](https://railway.app/)).

4. **Verify the Deployment:**
   * **Check Logs:**  Navigate to your Railway instance in the web interface and inspect the application logs for any errors.  This is the first place to look for problems.
   * **Access the Application:**  Open your web browser and navigate to the deployed Deuce Diary URL. Verify that the application is running correctly.
   * **Database Connection:**  Confirm that the application is successfully connecting to the production database. (The database connection string is configured in the Railway environment variables.)

**III.  Configuration & Environment Variables:**

The following environment variables are used by Deuce Diary in the Railway environment. Ensure these are correctly configured:

* `DATABASE_URL`:  The PostgreSQL connection string for your production database.
* `SECRET_KEY`:  Your application's secret key (IMPORTANT: Do *not* check this into your repository).  Generate a strong, random key.
* `STRIPE_SECRET_KEY`: Your Stripe secret key (IMPORTANT: Do *not* check this into your repository).
* `REDIS_URL`: The URL for your Redis instance (if you’re using Redis).

You can set these environment variables in the Railway web interface under your instance's "Environment Variables" section.


**IV. Backup & Rollback:**

This is a critical step. **Failure to back up the database before deployment can lead to significant downtime.**

1. **Database Backup:**
   * **Using `pg_dump` (Recommended):**  This provides a complete and efficient backup.
     ```bash
     railway exec <instance_name> pg_dump -U <db
