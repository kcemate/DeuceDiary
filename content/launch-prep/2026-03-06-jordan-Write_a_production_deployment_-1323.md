# Write a production deployment runbook for Deuce Diary on Rai
Agent: jordan
Generated: 2026-03-06T13:23:23.554995

## Deuce Diary Production Deployment Runbook - Railway

**Date:** October 26, 2023
**Version:** 1.0
**Prepared By:** [Your Name/Team Name]

**Purpose:** This runbook outlines the steps required to deploy a production version of Deuce Diary to Railway. It’s designed for repeatability and consistency across deployments.

**Prerequisites:**

*   **Railway Account:** Active Railway account with billing enabled.
*   **Railway CLI:** Installed and configured with your Railway account.
*   **Git Repository:** Deuce Diary source code resides in a Git repository (e.g., GitHub, GitLab).
*   **Railway Team:** A Railway team is created and named consistently (e.g., "deuce-diary-prod").
*   **Environment Variables:**  The required environment variables are set up (see Section 4).
*   **Staging Environment:** A staging environment is deployed and verified before proceeding to production.

**I. Deployment Steps:**

1.  **Pull Latest Code:**
    *   Navigate to the Deuce Diary Git repository.
    *   Pull the latest code from the production branch (e.g., `main`, `master`).
    *   `git pull origin <production_branch>`

2.  **Build & Push Docker Image:**
    *   Run the build command defined in the `Dockerfile`.  This usually involves compiling the application and building the Docker image.
    *   `docker build -t <your_dockerhub_username>/deuce-diary:production .`
    *   **Important:**  Tag the image with a production-specific tag (e.g., `production`).
    *   Push the Docker image to Docker Hub (or your chosen registry).  Ensure you're logged in.
    *   `docker push <your_dockerhub_username>/deuce-diary:production`

3.  **Deploy to Railway:**
    *   Open the Railway CLI.
    *   Select your Railway team: `railway team <your_team_name>`
    *   Deploy the application: `railway up --build <your_dockerhub_username>/deuce-diary:production`
        *   Railway will automatically build the Docker image and deploy it to the Railway servers.
    *   **Monitoring:** Railway will show the deployment progress and health checks.

4.  **Verify Deployment:**
    *   **Railway Dashboard:**  Monitor the application’s status on the Railway Dashboard. Ensure it’s running and healthy.
    *   **External Access:**  Access the application through its deployed URL (provided by Railway).
    *   **Logs:**  Check the application logs in the Railway Dashboard for any errors or warnings.
    *   **Database Check:**  Verify that the database connection is established and functioning correctly.

5. **Set Environment Variables (Railway Dashboard):**
   *   Navigate to your Railway app's settings.
   *   Under "Environment Variables," add/update the following variables:
       *   `DATABASE_URL`: Your database connection string (e.g., PostgreSQL connection string).
       *   `API_KEY`: Your API key (if applicable).
       *   `SECRET_KEY`:  Your application secret key - **CRITICAL for security.**
       *   `DEBUG`: `False`  (Production deployments should not have debugging enabled).
       *   `OTHER_REQUIRED_VARIABLES`: Add any other environment variables your application needs.

**II. Rollback Procedure:**

1.  **Stop the Application:**  Use the Railway Dashboard to stop the running application.
2.  **Rollback to Previous Image:**  In the Railway CLI, use the `railway rollback
