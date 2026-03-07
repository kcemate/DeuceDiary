# Write a production deployment runbook for Deuce Diary on Rai
Agent: jordan
Generated: 2026-03-04T12:25:48.683551

## Deuce Diary Production Deployment Runbook - Railway

**Version:** 1.0
**Date:** October 26, 2023
**Purpose:** This document outlines the steps required to deploy a new production version of Deuce Diary to Railway. It’s designed for experienced users and assumes familiarity with Railway, Git, and the Deuce Diary codebase.

**Prerequisites:**

* **Railway Account:** You must have an active Railway account with sufficient credits.
* **Railway CLI Installed:**  Install the Railway CLI: [https://railway.app/cli](https://railway.app/cli)
* **Deuce Diary Repo:** You should have cloned the Deuce Diary repository to your local machine.
* **Production Branch:**  You should be deploying from the `production` branch.
* **Service Configuration (Railway YAML):** Ensure you have a properly configured `railway.yml` file defining your services (Flask app, Redis, PostgreSQL, etc.). This document assumes a standard configuration.  See the "Configuration Notes" section for important details.
* **SSH Key Permissions:**  Verify that the deployed services have the correct SSH key permissions to access your Railway instance.

**I. Pre-Deployment Checks & Preparation:**

1. **Update Code:**  Ensure you have the latest changes from the `production` branch.  Run `git pull origin production` locally.
2. **Run Local Tests:** Thoroughly test the new code locally. This includes:
   * Running all unit tests: `python manage.py test`
   * Running integration tests: `python manage.py test --integration`
   * Manually test the application - verify key features are working as expected.
3. **Staging Deployment (Highly Recommended):** Before deploying to production, deploy to a staging Railway instance to catch any unexpected issues.  This significantly reduces the risk. (This step is assumed to be completed before proceeding.)

**II. Deployment Steps:**

1. **Verify Railway Instance Status:**
   * Open your Railway instance in your browser: [https://app.railway.app/your-instance-name](https://app.railway.app/your-instance-name)
   * Ensure all services are running and healthy.
2. **Pull the Latest Code:**
   * Use the Railway CLI to pull the latest changes from the `production` branch:
     ```bash
     railway pull <your-railway-instance-name> production
     ```
   * This command will automatically handle pulling the code from your Git repository.
3. **Restart Services:**  Railway automatically detects code changes and restarts the services.  However, it's good practice to explicitly restart them:
   ```bash
   railway restart <your-railway-instance-name>
   ```
4. **Monitor Deployment Logs:**  Check the deployment logs within your Railway instance to ensure a successful deployment.  Look for any errors or warnings.  (Accessible via the Railway UI - Logs tab for each service).
5. **Verify Application Status:**
   * Access the Deuce Diary application via the URL provided by Railway for your instance.
   * Perform a manual check to confirm the application is running and functioning correctly.

**III. Post-Deployment Actions:**

1. **Database Migrations:**  Run database migrations after deployment to ensure your database schema is up-to-date.  This needs to be triggered within your Flask app during startup.  Add the following to your app startup script:
   ```python
   # Example: Adding migrations to your app.py
   from flask import Flask
   from flask_migrate import Migrate
   import os

   app = Flask(__name__)
   # ... your app setup ...

   migrate = Migrate(app
