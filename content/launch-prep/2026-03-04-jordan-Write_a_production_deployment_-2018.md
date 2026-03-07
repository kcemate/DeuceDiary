# Write a production deployment runbook for Deuce Diary on Rai
Agent: jordan
Generated: 2026-03-04T20:18:00.074080

## Deuce Diary Production Deployment Runbook - Railway

**Version:** 1.0
**Date:** October 26, 2023
**Environment:** Production
**Service:** Deuce Diary

**Goal:** Deploy a new version of Deuce Diary to the production Railway environment, ensuring minimal downtime and a smooth user experience.

**Prerequisites:**

*   Railway Account & Project Created: Ensure you have a Railway account and the `deuce-diary` project created.
*   Railway CLI Installed & Authenticated: You need the Railway CLI installed and logged in to your Railway account.
*   SSH Access to Railway Instances:  You need SSH access to the Railway instances hosting your Deuce Diary service. (Managed through Railway)
*   Code Changes Committed & Pushed to Repository:  The latest changes must be pushed to the Deuce Diary repository.
*   Deployment Branch: This runbook assumes deployments are from the `main` branch. Adjust if using a different branch.

**I. Pre-Deployment Checks:**

1.  **Verify Code Changes:**
    *   Confirm that the latest code changes have been pushed to the `main` branch of the repository.
    *   Review the changes in a Pull Request (PR) if possible.
2.  **Railway Service Status:**
    *   `railway up`:  Ensure the Railway CLI is functioning correctly and connected to your account.
    *   `railway services`: Verify the `deuce-diary` service is running on Railway.  Look for healthy status (green).
3.  **Database Check (if applicable - e.g., PostgreSQL):**
    *   Confirm the database connection details are correct in the deployment manifest.
    *   (If using a managed database service like Railway PostgreSQL)  Check the database instance status within the Railway UI.

**II. Deployment Steps:**

1.  **Update Deployment Manifest:**
    *   Create or update the deployment manifest file (`deployment.yaml` or similar) with the following key information:
        *   **Image Tag:** Specify the desired image tag for the new deployment.  *Important: Use a tag that corresponds to the version deployed to staging.*  (e.g., `latest`, `v1.2.3`)
        *   **Environment Variables:**  Verify all environment variables are correctly defined and configured.  These include:
            *   `DATABASE_URL` (Connection string to the database)
            *   `API_KEYS` (Any required API keys – keep these secure!)
            *   `SECRET_KEY` (Your application's secret key)
            *   `NODE_ENV` (Set to `production`)
            *   Other application-specific settings
        *   **Ports:** Ensure the correct ports are exposed (typically 3000 or configured in your service settings).
        *   **Scaling Settings:**  Adjust the scaling settings as needed (e.g., number of replicas, CPU, memory).
    *   **Example `deployment.yaml`:**
       ```yaml
       image: your-docker-hub-username/deuce-diary:latest
       replicas: 1  # Adjust as needed
       ports:
         - port: 3000
           name: http
       environment:
         DATABASE_URL: postgres://user:password@database-service:5432/deuce_diary
         API_KEYS: "your_api_key_here"
         SECRET_KEY: "your_secret_key_here"
         NODE_ENV: production
       ```

2.  **Deploy to Railway:**
    *   `railway deploy --file deployment.yaml`
    *   The CLI will:
