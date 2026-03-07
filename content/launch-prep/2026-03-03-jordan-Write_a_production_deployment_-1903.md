# Write a production deployment runbook for Deuce Diary on Rai
Agent: jordan
Generated: 2026-03-03T19:03:20.252717

## Deuce Diary Production Deployment Runbook - Railway

**Version:** 1.0
**Date:** October 26, 2023
**Author:** AI Assistant

**Objective:** This runbook outlines the steps for deploying a new version of Deuce Diary to the production Railway environment. This process includes updating the container image, deploying changes to the database, and verifying the deployment.

**Prerequisites:**

*   **Railway Account:**  You must have an active Railway account with sufficient credits.
*   **Railway CLI Installed & Configured:**  Ensure the Railway CLI is installed and configured to connect to your Railway account.
*   **SSH Key Permissions:**  You need SSH access to the Railway instance. The SSH key must be properly configured within Railway.
*   **Production Database Access:** You need credentials (username, password, database name) for the Deuce Diary production database.
*   **Versioning Strategy:**  Ensure a consistent versioning strategy is in place for your code (e.g., Git tags).

**I. Preparation & Verification (Pre-Deployment)**

1.  **Pull Latest Code:**
    *   **Command:** `git pull origin main` (Assuming your main branch is `main` - adjust if different)
2.  **Build Docker Image:**
    *   **Command:** `docker build -t your-dockerhub-username/deuce-diary:latest .` (Replace `your-dockerhub-username` with your Docker Hub username)
3.  **Push Docker Image to Docker Hub:**
    *   **Command:** `docker push your-dockerhub-username/deuce-diary:latest`
4.  **Verify Image Existence:**
    *   **Command:** `docker images` - Ensure the image you just pushed is listed.
5.  **Review Changes:** Briefly review the changes in the current commit before proceeding.


**II. Deployment Steps (Railway CLI)**

1.  **Login to Railway:**
    *   **Command:** `railway up` (This will open a terminal session in your Railway environment.)
2.  **Navigate to Deuce Diary Project Directory:**
    *   `cd /app` (Assuming this is where your project resides within the Railway instance - confirm based on your project structure)
3.  **Stop Existing Container:**
    *   **Command:** `railway stop deuce-diary` (Replace `deuce-diary` with the name of your Railway service)
4.  **Deploy New Container Image:**
    *   **Command:** `railway deploy --image your-dockerhub-username/deuce-diary:latest`
    *   (This command will pull the new image and restart the container.)
5.  **Wait for Deployment:**
    *   The Railway CLI will display the deployment progress.  Monitor the logs for any errors.
6.  **Check Container Status:**
    *   **Command:** `railway ps` - Verify that the `deuce-diary` container is running and has a healthy status.

**III. Database Updates**

This section outlines how to update the Deuce Diary production database. *This step is crucial and must be done carefully!*

1.  **Connect to Database:**
    *   **Command:** `railway ssh` (Opens an SSH session to the Railway instance)
2.  **Execute Database Migration Commands:**
    *   **Command:**  (Run these commands – *adapt to your specific database type* - these are examples)
    *   `psql -h your-database-host -U your-username -d your-database-name -c "migrate:run"`
    *   (Replace `your-database-host`, `your-
