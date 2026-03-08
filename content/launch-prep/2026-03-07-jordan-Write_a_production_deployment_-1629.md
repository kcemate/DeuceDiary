# Write a production deployment runbook for Deuce Diary on Rai
Agent: jordan
Generated: 2026-03-07T16:29:29.053907

## Deuce Diary Production Deployment Runbook - Railway

**Version:** 1.0
**Date:** October 26, 2023
**Purpose:** This runbook outlines the steps required to deploy a production release of Deuce Diary to Railway.

**Assumptions:**

* You have a Railway account and have added your project to Railway.
* You have the necessary credentials (API token, database connection details) configured within your Railway project.
* You have SSH access to your Railway production instance.
* You have a working local development environment.

**I. Pre-Deployment Checklist:**

* [ ] **Latest Code:** Ensure you're deploying the latest commit from the `production` branch.  Verify this with `git rev-parse origin/production`.
* [ ] **Database Backup:**  Create a full database backup (e.g., using `pg_dump` if using PostgreSQL). Store this backup in a secure location like Google Drive or a secure vault.
* [ ] **Configuration Review:** Review the production configuration file (`config/production.yml`) for any necessary changes.  Specifically, verify database connection details, API keys, and any environment-specific settings.
* [ ] **Testing:**  Confirm that the latest local build passes all automated tests.
* [ ] **Railway Deployment Pipeline:**  Ensure your Railway deployment pipeline is configured correctly (e.g., using Railway's build and deploy pipeline or a CI/CD system like GitHub Actions).
* [ ] **Rollback Plan:**  Have a clear rollback plan in case of issues during deployment. This includes steps to revert to the previous version and restore the database.

**II. Deployment Steps:**

**Step 1: Pull Latest Code**

1.  **SSH into Railway:** Use SSH to connect to your Railway production instance. (e.g., `ssh user@your-railway-app.up.railway.app`)
2.  **Navigate to Project Directory:** `cd /home/your-user/deuce-diary` (Replace `your-user` with your Railway user)
3.  **Pull Latest Code:**  `git fetch origin`
4.  **Checkout Production Branch:** `git checkout production`
5.  **Ensure you're on the correct branch:** `git rev-parse --verify origin/production`

**Step 2: Install Dependencies**

1.  **Install Dependencies:** `bundle install`  (If using Ruby) or `npm install` (If using Node.js) – This will install all required gems/packages.

**Step 3: Database Migrations**

1.  **Run Migrations:** `rails db:migrate`  (If using Ruby). This will apply any pending database migrations.  Confirm the migrations completed successfully.

**Step 4: Configure Environment Variables**

1.  **Set Environment Variables:**  Configure the necessary environment variables within your Railway application. This is typically done through the Railway UI or using `export` commands in your terminal.
    *  `DATABASE_URL`:  Your database connection string (e.g., `postgresql://user:password@host:port/database`)
    *  `SECRET_KEY_BASE`:  Your secret key for session management. Generate a new one if needed.
    *  `RAILS_ENV`: Set to `production`
    *  Any other required API keys or configuration settings.

**Step 5:  Restart Application**

1.  **Restart the Application:**  The specific command depends on your application’s runtime.
   * **Ruby/Rails:** `rails server -t` (This will trigger a hot reload)
   * **Node.js:** `pm2 restart your-app-name` (If using PM2
