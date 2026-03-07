# Write a production deployment runbook for Deuce Diary on Rai
Agent: jordan
Generated: 2026-03-03T20:56:31.908907

## Deuce Diary Production Deployment Runbook - Railway

**Date:** October 26, 2023
**Version:** 1.0
**Purpose:** This document outlines the steps required to deploy the production version of Deuce Diary to Railway.

**I. Prerequisites:**

* **Railway Account:** You must have an active Railway account with access to your project and billing.
* **Railway CLI:**  Ensure the Railway CLI is installed and configured on your machine: [https://railway.app/cli](https://railway.app/cli)
* **Railway Project:**  The Deuce Diary Railway project must be properly configured, including the deployment configuration (Docker images, environment variables, etc.). (This document assumes this is already done – refer to your project's configuration for specifics.)
* **SSH Access:** You need SSH access to your Railway deployment for troubleshooting.
* **Understanding of Deuce Diary:** Basic understanding of the Deuce Diary application and its dependencies is required.

**II. Deployment Steps:**

**Phase 1: Preparation (Client-Side - Runs locally)**

1. **Verify Build:** Ensure the latest production build of Deuce Diary has been successfully built and is available in the designated location (usually a `build` directory).
2. **Railway CLI Login:** Log into your Railway CLI using `railway login`.
3. **Confirm Deployment Configuration:** Double-check your Railway project's configuration files (e.g., `railway.toml`, `.env`) to ensure they are correct and reflect the production environment.
4. **(Optional) Staging Deployment:** If deploying to staging first, follow the steps for staging deployment (described separately).  This step is generally omitted for production.

**Phase 2: Deployment (Railway CLI - Runs on your machine)**

1. **Navigate to Railway Project Directory:**  `cd <your-railway-project-directory>`
2. **Deploy:** Execute the following Railway CLI command to deploy the build:
   ```bash
   railway deploy --path <path-to-build-directory>
   ```
   * Replace `<path-to-build-directory>` with the actual path to your Deuce Diary build folder.
   * **Example:** `railway deploy --path ./build`
3. **Monitor Deployment:** The Railway CLI will display the deployment progress. Pay attention to any errors or warnings.
4. **Verify Deployment:** Once the deployment is complete, verify the application is running correctly.  You can typically do this by:
   * Navigating to the deployed application in your web browser: `https://<your-app-name>.on.railway.app`
   * Checking the Railway dashboard for the application's status.

**Phase 3: Post-Deployment Checks (Client-Side - SSH Access)**

1. **SSH to Deployment:** Connect to your Railway deployment via SSH:
   ```bash
   railway ssh <your-app-name>
   ```
2. **Check Application Logs:** Examine the application logs for any errors or issues. The logs are typically located in `/var/log/<your-app-name>/` or accessible through the Railway dashboard.
3. **Verify Database Connection:**  Confirm the application is connecting to the database correctly.
4. **Verify Services:** Ensure all necessary services (e.g., Redis, message queues) are running and accessible.
5. **Check Health Checks:** Utilize Railway's health checks to confirm the application is running healthily.
6. **(Optional) Configure DNS:** If necessary, update the DNS records for your Deuce Diary application to point to the correct Railway domain.

**III. Rollback Procedure:**

1. **Identify the Issue:** Determine the root cause of the deployment failure or
