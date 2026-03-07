# Write a production deployment runbook for Deuce Diary on Rai
Agent: jordan
Generated: 2026-03-04T01:28:22.723783

## Deuce Diary Production Deployment Runbook - Railway

**Version:** 1.0
**Date:** October 26, 2023
**Purpose:** This document outlines the steps required to deploy a new version of Deuce Diary to the production environment on Railway.  It's designed for experienced users familiar with Railway deployment and DevOps best practices.

**Assumptions:**

*   You have a Railway account and project set up for Deuce Diary.
*   You have access to the Railway CLI and have configured it correctly.
*   You have a stable, tested build artifact (Docker image) ready for deployment.
*   You understand Railway's pricing structure.


**I. Pre-Deployment Checks:**

1.  **Code Review & QA:** Ensure the latest code has been thoroughly reviewed and passed QA tests.
2.  **Build Artifact Verification:** Confirm the Docker image exists in your registry (e.g., Docker Hub) and has a valid tag reflecting the production version.
3.  **Railway Project Health:**  Verify the Railway project's overall health in the Railway UI.  Check services are running, logs are free of errors, and the application is responding correctly.
4.  **Database Backup:** **Critical!**  Create a full backup of your database (PostgreSQL) before starting the deployment.  The Railway CLI provides options for automated backups.
5.  **Rollback Plan:**  Document the steps to revert to the previous production version in case of issues.  This should include instructions on reverting Railway service versions.

**II. Deployment Steps (Using Railway CLI):**

1.  **Switch to Production Branch:**
    ```bash
    railway service switch --name deuce-diary --branch production
    ```
    This command switches the currently deployed service to the `production` branch.

2.  **Deploy the New Version:**
    ```bash
    railway deploy --name deuce-diary --image <YOUR_DOCKER_IMAGE_NAME>
    ```
    *   Replace `<YOUR_DOCKER_IMAGE_NAME>` with the full name of your Docker image, including the tag (e.g., `deuce-diary:latest`).
    *   This command pulls the latest image and deploys it to the production environment.  Railway will handle service scaling and health checks.

3.  **Monitor Deployment:**
    *   Use the Railway UI to monitor the deployment process.  You'll see logs and status updates.
    *   Keep an eye on the health check endpoint (likely `/health`) to ensure the service is responding correctly.

4.  **Database Migration (If Applicable):**
    *   If your application uses database migrations, trigger them **after** the service has been deployed and is running. This is typically handled by the application itself during startup.
    *   Verify the migrations ran successfully using the database client.

5.  **Post-Deployment Verification:**
    *   **Access the Application:**  Verify the Deuce Diary application is accessible via the production URL provided by Railway.
    *   **Functional Testing:** Conduct basic functional testing to ensure key features are working as expected.  Focus on critical functionalities like user logins, core diary functions, and search.
    *   **Performance Monitoring:**  Start monitoring key performance indicators (KPIs) such as response times, error rates, and resource utilization. Railway provides built-in monitoring tools.
    *   **Check Logs:**  Examine the application's logs (accessible through Railway's UI or via the Docker logs command) for any errors or warnings.



**III. Rollback Procedure (In Case of Issues):**

1.  **Identify the Issue:** Clearly diagnose the problem.
2.  **Switch Back to
