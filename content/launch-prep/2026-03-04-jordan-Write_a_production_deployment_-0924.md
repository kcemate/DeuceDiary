# Write a production deployment runbook for Deuce Diary on Rai
Agent: jordan
Generated: 2026-03-04T09:24:12.800682

## Deuce Diary Production Deployment Runbook - Railway

**Date:** October 26, 2023
**Version:** 1.0
**Prepared By:** Bard (Generated based on Railway documentation and best practices)
**Purpose:** To provide a detailed, step-by-step guide for deploying the Deuce Diary application to the production environment on Railway.

**I. Prerequisites:**

* **Railway Account:**  You must have an active Railway account with billing enabled.
* **Railway CLI:**  Install and configure the Railway CLI on your local machine: [https://railway.app/cli](https://railway.app/cli)
* **SSH Access:**  You need SSH access to your Railway service instance. This is usually available through the Railway dashboard.
* **Application Code:**  Ensure the latest version of the Deuce Diary application code is committed to your repository (e.g., GitHub, GitLab, Bitbucket).
* **Railway Team:**  A Railway Team is required to manage the deployment.

**II. Deployment Steps:**

**Phase 1: Infrastructure Setup**

1. **Create a New Railway Team:**
   * Log in to Railway.
   * Navigate to the "Teams" section.
   * Click "New Team."
   * Choose a Team Name (e.g., "DeuceDiary-Production").
   * Set the Team Region (e.g., "Europe West").
   * Click "Create Team."

2. **Create a New Service:**
   * Within your newly created team, click “Create Service.”
   * **Service Name:** "deuce-diary-production" (or a similar descriptive name).
   * **Service Type:** Choose "Node.js" or "Python" based on the Deuce Diary application's technology stack.
   * **Container Image:**  This will depend on how the app is packaged. You’ll likely be using a Dockerfile.  Assuming a Dockerfile exists, the Railway CLI will automatically pull and build the image if you select "Use Dockerfile." If not, you'll need to upload a pre-built Docker image to a registry like Docker Hub or GitHub Container Registry.
   * **Environment Variables:**  **Crucially, configure the necessary environment variables. These are likely to include:**
      * `DATABASE_URL`:  The URL for your PostgreSQL database (hosted on Railway).
      * `JWT_SECRET`:  A securely generated secret key for JSON Web Token (JWT) authentication.
      * `CLOUD_FUNCTIONS_API_KEY`:  API key for Cloud Functions. (if used).
      * `... other environment variables specific to Deuce Diary ...`
   * **Ports:**  Expose the necessary ports for your application (e.g., 3000 for a Node.js application, 5000 for a Python application).  Railway will automatically route traffic to these ports.
   * **Build and Deployment:** Click "Deploy". Railway will automatically pull the container image and deploy it to the service instance.  Monitor the deployment progress in the Railway dashboard.


**Phase 2: Database Setup & Initialization**

3. **Create a Database on Railway:**
   * In the Railway dashboard, navigate to your deployed service instance ("deuce-diary-production").
   * Click the "Database" tab.
   * Click "Create Database."
   * **Database Name:**  "deuce_diary_db" (or a similar suitable name).
   * **Database Engine:** PostgreSQL.
   * Railway will create a PostgreSQL instance and configure it for your application.

4. **Initialize the Database:**
   * **Option 1 (Automated):** Railway often provides a script to automatically initialize the database.
