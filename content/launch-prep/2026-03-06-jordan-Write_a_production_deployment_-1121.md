# Write a production deployment runbook for Deuce Diary on Rai
Agent: jordan
Generated: 2026-03-06T11:21:59.518550

## Deuce Diary Production Deployment Runbook - Railway

**Version:** 1.0
**Date:** October 26, 2023
**Purpose:** This runbook outlines the steps required to deploy a new version of Deuce Diary to the production Railway environment.

**Prerequisites:**

*   **Railway Account:** You must have an active Railway account with appropriate permissions.
*   **Railway CLI:** Install and configure the Railway CLI.
*   **Git Repository:** The Deuce Diary code must be hosted in a Git repository (e.g., GitHub, GitLab, Bitbucket).
*   **Railway Project:**  A Railway project must be created to host Deuce Diary. This runbook assumes the project already exists.
*   **Docker Image:** A Docker image of Deuce Diary should be built and pushed to Railway's Container Registry.
*   **Environment Variables:**  Ensure the correct environment variables are configured in the Railway project settings (detailed below).

**1. Preparation & Verification**

*   **Pull Latest Code:**
    *   Open your terminal and navigate to the Deuce Diary repository.
    *   Pull the latest changes from the production branch (e.g., `main` or `master`).
    *   `git pull origin main`
*   **Build Docker Image:**
    *   Verify the Dockerfile is correctly configured.
    *   Build the Docker image locally (or using the Railway CLI):
        *   `docker build -t deuce-diary:latest .`
*   **Push Docker Image to Railway Container Registry:**
    *   Tag the Docker image with the Railway project name and tag:
        *   `docker tag deuce-diary:latest <railway.toml.registry>:<railway_project_name>:latest`
        *   Replace `<railway_toml.registry>` with the appropriate registry URL for your Railway project (e.g., `registry.railway.io`).
        *   Replace `<railway_project_name>` with the name of your Railway project.
    *   Push the image to Railway's Container Registry:
        *   `docker push <railway_toml.registry>:<railway_project_name>:latest`
*   **Verify Image in Railway:**
    *   Log into the Railway dashboard.
    *   Navigate to your Deuce Diary project.
    *   Confirm that the newly pushed Docker image is listed under “Containers”.


**2. Deployment Steps**

*   **Update Container Settings:**
    *   In the Railway dashboard, select your Deuce Diary project.
    *   Click on the “Containers” tab.
    *   Select the Deuce Diary container.
    *   Click "Edit".
    *   **Image:** Verify the image tag is correct (should automatically be updated with the new pushed image).
    *   **Environment Variables:** Confirm the following environment variables are set correctly.  **Important: These are examples, adjust to your specific configuration.**
        *   `DATABASE_URL`:  Connection string to your production database (e.g., PostgreSQL).
        *   `SECRET_KEY`:  Secure secret key for Deuce Diary (VERY IMPORTANT - generate a strong, random key).
        *   `REDIS_URL`: Connection string to your production Redis instance (if used).
        *   `STRIPE_SECRET_KEY`: Stripe secret key (if integrated with Stripe).
        *   `CLERK_PUBLISHABLE_KEY`: Clerk publishable key (if using Clerk).
        *   `RAILWAY_PROJECT_ID`:  Automatically populated, ensures the container is running in the correct project.
        *   Any other environment variables specific to your Deuce Diary
