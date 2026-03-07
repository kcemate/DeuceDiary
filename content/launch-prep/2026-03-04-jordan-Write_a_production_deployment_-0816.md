# Write a production deployment runbook for Deuce Diary on Rai
Agent: jordan
Generated: 2026-03-04T08:16:14.722072

## Deuce Diary - Railway Production Deployment Runbook

**Version:** 1.0
**Date:** October 26, 2023
**Purpose:** This runbook outlines the steps required to deploy a new version of Deuce Diary to the production Railway environment.  It's intended for experienced DevOps personnel and should be followed closely.

**Prerequisites:**

*   Railway Account & Access: Ensure you have appropriate access to your Railway account and project.
*   Railway CLI: The Railway command-line interface (CLI) must be installed and configured.
*   Git & SSH:  You need access to a Git repository (GitHub, GitLab, etc.) containing the Deuce Diary code.
*   Environment Variables:  Confirm all necessary environment variables are correctly set for the production Railway environment.  These are defined in the Deuce Diary configuration.

**I. Preparation & Verification**

1.  **Code Pull:**
    *   Ensure you're working with the correct production branch (e.g., `main` or `production`).
    *   Run: `git pull origin main` (or the relevant branch)
2.  **Local Verification (Highly Recommended):**
    *   Deploy the current branch locally to a staging Railway environment to confirm everything is working as expected.  This significantly reduces the risk of errors in production.
3.  **Environment Variable Check:**
    *   Double-check all environment variables used by Deuce Diary in your Railway environment settings.  Pay particular attention to:
        *   `DATABASE_URL`
        *   `REDIS_URL`
        *   `SECRET_KEY`
        *   `ALLOWED_HOSTS`
        *   Any custom environment variables defined in your Deuce Diary settings.
4.  **Railway Health Check:**
    *   Log in to the Railway CLI: `railway up`
    *   Run `railway health` to verify the health of all components in your deployment.  Address any issues reported before proceeding.


**II. Deployment Process**

1.  **Create a New Railway Service:**
    *   Run the following command, replacing `<service_name>` with a descriptive name (e.g., `deuce-diary-production`).  This creates a new service to house your Deuce Diary application.
    *   `railway up --service <service_name> --repo <repository_url> --branch main --env <env_file>`
    *   **Explanation of Flags:**
        *   `--service <service_name>`:  The name of the new Railway service.
        *   `--repo <repository_url>`: The URL to your Git repository.
        *   `--branch main`:  The branch to deploy.  Adjust if deploying from a different branch.
        *   `--env <env_file>`:  The path to a file containing your environment variables (recommended for organization).  Create this file if you don’t have one.  Example: `--env production_env.yaml`

2.  **Railway CLI Setup (If Required):**
   *  Railway automatically sets up most required infrastructure.  However, if you encounter issues:
   *   `railway setup --service <service_name>`: This command will guide you through setting up the necessary infrastructure components (databases, Redis, etc.).  Follow the prompts carefully.

3.  **Monitor Deployment:**
    *   The Railway CLI will display the deployment progress. Monitor the logs for any errors.  You can view logs for your service using: `railway logs <service_name>`.
    *   It can take 5-15 minutes for the deployment to complete, depending on the size of your application and
