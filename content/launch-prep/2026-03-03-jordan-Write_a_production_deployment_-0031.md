# Write a production deployment runbook for Deuce Diary (Expre
Agent: jordan
Generated: 2026-03-03T00:31:20.258172

## Deuce Diary - Production Deployment Runbook (Express + Railway)

**Date:** October 26, 2023
**Version:** 1.0
**Purpose:**  Provides a step-by-step guide for deploying new versions of Deuce Diary to production on Railway.
**Responsible Team:**  DevOps Team

**I. Pre-Deploy Checks (MUST be completed before starting deployment)**

1. **Code Changes Approved:** Ensure all code changes are approved by the development team and all relevant stakeholders.
2. **Pull Request Review & Merge:** Confirm the latest version of the code has been merged into the main branch (typically `main` or `master`).  Verify the merge commit has been tagged with a unique version number (e.g., `v1.2.3`). This tag is crucial for Railway’s deployment.
3. **Automated Tests Passed:**  All unit, integration, and end-to-end tests in the CI/CD pipeline must pass.  Review the CI/CD logs for any failed tests. Address any failures before proceeding.
4. **Railway Project Setup:**
    * **Railway Account Access:** Ensure the DevOps team has necessary access to the Railway account.
    * **Railway Project Created:** Verify a Railway project named `deuce-diary` exists and is configured correctly.  Confirm the project contains the necessary services (Node.js runtime, database (PostgreSQL), and any other dependencies).
    * **Environment Variables Configured:**  Ensure the correct environment variables are set within the Railway project settings.  Common variables include:
        * `NODE_ENV`: `production`
        * `DATABASE_URL`: Your PostgreSQL connection string
        * `JWT_SECRET`:  A securely generated secret key
        * `PORT`:  Typically `3000`
        * `RAILWAY_API_KEY`: (Required for Railway)
5. **Monitoring & Alerting:**  Verify that monitoring and alerting are properly configured for the Deuce Diary application within Railway. This includes:
    * **Logs:**  Logs are streamed to Railway’s logging system.
    * **Metrics:** Key metrics (response time, error rate, etc.) are monitored using Railway’s dashboards or integrated with external monitoring tools (e.g., Prometheus, Grafana).
    * **Alerts:**  Alerts are configured to notify the team of critical issues.


**II. Deployment Command (Using Railway CLI)**

1. **Login to Railway:** Open your terminal and log in to the Railway CLI using:
   ```bash
   railway up login
   ```
2. **Select Project:**  Navigate to the `deuce-diary` project:
   ```bash
   railway up project <your_project_name>
   ```
3. **Deploy the Code:** Deploy the latest version tagged in your Git repository.  This command uses the tag as the deployment version.
   ```bash
   railway up project <your_project_name> --tag v1.2.3
   ```
   * **Note:**  Replace `<your_project_name>` with the actual name of your Railway project.
   * **Explanation:** This command triggers Railway's deployment pipeline, which handles:
     * Pulling the code from the Git repository.
     * Building the application (if necessary).
     * Running migrations to update the database schema.
     * Restarting the Node.js service.

4. **Monitor Deployment:**  The Railway CLI will display the deployment progress in the terminal.  Check the Railway dashboard ([https://railway.app/](https://railway.app/)) for real-time updates.


**III. Post-Deploy Verification**

1. **Application Health:** Check the
