# Write a production deployment runbook for Deuce Diary on Rai
Agent: jordan
Generated: 2026-03-03T13:01:11.253649

Okay, here's a production deployment runbook for Deuce Diary on Railway, designed to be comprehensive and adaptable. It focuses on a blue/green deployment strategy for minimal downtime and rollback capability.

**Document Version:** 1.0
**Date:** October 26, 2023
**System:** Deuce Diary (Railway)
**Objective:** Deploy a new version of Deuce Diary to the production environment with minimal downtime and a clear rollback plan.

---

**1. Pre-Deployment Checks & Prerequisites**

* **Railway Account Access:**  You must have the necessary Railway account credentials (API token, project access).
* **Railway CLI:** Ensure the Railway CLI is installed and configured correctly.
* **Version Control:** Verify the latest code is committed to the main branch (usually `main` or `master`) in your Git repository.
* **Database Backup:** **Critical!** Perform a full backup of the Deuce Diary database using the Railway CLI or a third-party backup solution before starting any deployment steps. This is your safety net.  Verify the backup is successful and stored securely.
* **Testing:**  Thoroughly test the new code in a staging/pre-production environment that mirrors the production environment as closely as possible. This includes:
    * **Smoke Tests:** Basic functionality to ensure the application is running.
    * **Functional Tests:**  Key user workflows and features.
    * **Performance Tests:**  Load testing to ensure the application can handle anticipated traffic.
    * **Security Tests:**  Scan for vulnerabilities.
* **Railway Project Setup:**  Ensure your Railway project is configured correctly:
    * **Railway.toml:** Verify this file contains the correct environment variables, database connection details, and any other necessary settings.
    * **Service Dependencies:** All required services (e.g., database, Redis, etc.) are properly configured and accessible.
* **Team Communication:**  Alert the relevant teams (DevOps, Operations, Product) that the deployment is about to begin.

**2. Blue/Green Deployment - Stages**

This runbook uses a Blue/Green deployment strategy to minimize downtime.

* **Blue Environment (Live):**  This is the currently running production environment.
* **Green Environment (New Version):**  A duplicate of the Blue environment with the new Deuce Diary code deployed.

**3. Deployment Steps**

**Phase 1:  Green Environment Deployment (60-90 minutes)**

1. **Push New Code (5-10 mins):** Push the new code to the main branch of your Git repository.
2. **Railway Build & Deploy (15-30 mins):**
   *  Using the Railway CLI, deploy the new version of Deuce Diary to the green environment:
     ```bash
     railway up --repo <your_repo_url> --branch main --env <your_env_name>
     ```
     * **Important:**  This command automatically handles the build and deployment process within Railway.  Monitor the output closely for errors.
3. **Database Migration (10-20 mins):**  Railway handles this automatically with the `--migrate` flag.  However, verify the migrations are running successfully.  Check the Railway logs for any migration errors.
4. **Service Configuration:**  Verify that all services (database, Redis, etc.) are running and correctly configured within the green environment.

**Phase 2:  Switchover (15-30 mins)**

1. **Traffic Routing (5-10 mins):**  Using Railway's traffic routing features, gradually shift traffic from the Blue environment to the Green environment.
    * **Recommended Approach:** Use a percentage-based traffic routing (e.g., start with 10%,
