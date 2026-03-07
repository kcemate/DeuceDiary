# Write a production deployment runbook for Deuce Diary on Rai
Agent: jordan
Generated: 2026-03-04T01:51:00.062658

## Deuce Diary Production Deployment Runbook - Railway

**Version:** 1.0
**Date:** October 26, 2023
**Target Environment:** Production Railway Instance
**Purpose:** This runbook outlines the steps required to deploy a new version of Deuce Diary to the production Railway environment.

**Prerequisites:**

* **Railway Account & Subscription:** Active Railway account with sufficient resources allocated to the Deuce Diary Railway instance.
* **Railway CLI Installed & Configured:** Railway CLI must be installed and authenticated.
* **Deuce Diary Code:** Latest version of the Deuce Diary code pushed to your Git repository (e.g., GitHub).
* **Production Database Access:** Credentials for the production PostgreSQL database.
* **Monitoring Setup:** Confirmation that monitoring tools (e.g., Railway Metrics, Prometheus, Grafana) are properly configured and accessible.
* **Team Communication:** Designated team members briefed on the deployment process and potential rollback scenarios.


**Step 1: Pull Latest Code**

1. **Verify Branch:** Ensure you're working on the correct production branch (e.g., `main`, `production`).
2. **Pull Code:**
   ```bash
   git pull origin main
   ```
3. **Push Changes (if necessary):** If you've made changes locally, push them:
   ```bash
   git push origin main
   ```

**Step 2:  Prepare Deployment Artifacts**

1. **Build (if applicable):** If your Deuce Diary app requires a build step (e.g., asset compilation, bundling), perform it now. Document the specific build commands here.
   ```bash
   # Example build command (adapt to your specific setup)
   npm run build
   ```

2. **Create Railway Package:**  Use the Railway CLI to create a deployment package. This packages the necessary files for Railway to deploy.
   ```bash
   railway package create --name deuce-diary-prod --repo <your_repo_name>
   ```
   * Replace `<your_repo_name>` with the name of your Git repository.

**Step 3: Deploy to Railway**

1. **Deploy the Package:** Deploy the package to your Railway instance.
   ```bash
   railway deploy --name deuce-diary-prod
   ```
   * This command will:
     * Pull the latest code from your Git repository.
     * Execute any defined build steps.
     * Deploy the application to the Railway instance.

2. **Monitor Deployment Progress:** Railway CLI will display the deployment progress. Monitor the logs for any errors.
   ```bash
   railway logs --name deuce-diary-prod
   ```


**Step 4: Database Migrations & Data Updates (Critical!)**

* **Important:** This step requires careful execution to avoid data corruption.
* **Verify Database Connection:** Confirm the Railway instance has correct connection details for your PostgreSQL database.
* **Run Migrations:** Using the Railway CLI or your database client (e.g., pgAdmin), run the appropriate database migrations.
   ```bash
   railway migrate --name deuce-diary-prod
   ```
   *  **Alternative (using pgAdmin):** Connect to the database in pgAdmin and execute the migration scripts.  Ensure to use the correct database connection information.


**Step 5:  Environment Variable Configuration**

1. **Update Environment Variables:**  Ensure all necessary environment variables are correctly configured in the Railway dashboard for your Deuce Diary instance.  These likely include:
   * `DATABASE_URL`
   * `API_KEYS` (if applicable)
   * `SECRET_KEY`
   * Any other custom variables your app needs.
2.
