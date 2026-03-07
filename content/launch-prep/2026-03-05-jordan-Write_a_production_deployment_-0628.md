# Write a production deployment runbook for Deuce Diary on Rai
Agent: jordan
Generated: 2026-03-05T06:28:40.233008

## Deuce Diary Production Deployment Runbook - Railway

**Version:** 1.0
**Date:** October 26, 2023
**Prepared By:** [Your Name/Team Name]

**Objective:** This runbook outlines the steps required to deploy a new production version of Deuce Diary to Railway. This process is intended for experienced developers and should be followed meticulously.

**Prerequisites:**

*   **Railway Account:** Access to a Railway account with sufficient credits.
*   **Railway CLI:** Installed and configured with your Railway account. (`railway up`)
*   **GitHub Repository:** Deuce Diary source code hosted on a private GitHub repository.
*   **Railway Project:** An existing Railway project named "deuce-diary" configured with the necessary services (PostgreSQL, Redis, Frontend, etc.).
*   **SSH Access:**  SSH access to the Railway cluster.
*   **Understanding of Deuce Diary Architecture:**  Familiarity with the application’s components and dependencies.


**I. Preparation & Build:**

1.  **Pull Latest Code:**
    *   `git pull origin main` (or the relevant production branch) - Ensure you have the latest code.
2.  **Set Production Environment Variables:**
    *   Create or update a `.env.production` file in the root of your Deuce Diary repository with the correct production values.  Crucially, include:
        *   `DATABASE_URL`:  Your PostgreSQL connection string.
        *   `REDIS_URL`: Your Redis connection string.
        *   `JWT_SECRET`:  A strong, randomly generated secret key.
        *   `CLERK_API_KEY`: Your Clerk API key.
        *   Any other environment variables specific to the production environment (e.g., S3 bucket URLs).
3.  **Build Frontend (if applicable):**
    *   Run the frontend build command (e.g., `npm run build` or `yarn build`).  This will generate the static assets.
4.  **Test Locally (Highly Recommended):**
    *   Deploy a test version of the application to your local development environment using the Railway CLI to verify the changes before proceeding to production.


**II. Deployment to Railway:**

1.  **Navigate to the Railway Project Directory:**
    *   `cd deuce-diary`
2.  **Deploy the Frontend (Static Assets):**
    *   `railway deploy --repo <YOUR_GITHUB_REPOSITORY_URL> --branch main --build-command "npm run build" --tag v1.0.0`
    *   (Replace `<YOUR_GITHUB_REPOSITORY_URL>` with the URL of your GitHub repository.  Replace `v1.0.0` with the desired tag/version.)
3.  **Deploy the Backend:** (Assumes the backend is already running locally – adjust if it’s a containerized backend)
    *   `railway deploy --repo <YOUR_GITHUB_REPOSITORY_URL> --branch main --tag v1.0.0`
4. **Sync Railway Services:**
    *   `railway sync` - This command will automatically update all services connected to the Railway cluster. This is vital for syncing the database and other critical configurations.
5.  **Monitor Deployment:**
    *   Use the Railway dashboard to monitor the deployment progress.  Pay attention to any errors or warnings.

**III. Post-Deployment Steps:**

1.  **Verify Application Functionality:**
    *   Access the Deuce Diary application through the Railway URL provided in the dashboard.
    *   Thoroughly test all key features and workflows.
2.  **Database Migrations:** (If database changes were made)
