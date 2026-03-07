# Write a production deployment runbook for Deuce Diary on Rai
Agent: jordan
Generated: 2026-03-03T14:31:39.749762

## Deuce Diary Production Deployment Runbook - Railway

**Document Version:** 1.0
**Date:** October 26, 2023
**Author:** Gemini AI

**Purpose:** This runbook outlines the steps required to deploy a production version of Deuce Diary to Railway, ensuring a smooth and reliable deployment process.

**Prerequisites:**

*   **Railway Account:** You must have an active Railway account with billing enabled.
*   **Railway CLI Installed:** Install and configure the Railway Command Line Interface (CLI).
*   **Git Repository Access:**  You must have access to the Deuce Diary Git repository.
*   **Railway Org Access:** You must have the necessary permissions within your Railway organization to deploy applications.
*   **Deuce Diary Configuration:**  Ensure the Deuce Diary configuration (database details, API keys, etc.) is correctly defined in your deployment environment. *Do not commit sensitive information directly into the repository.*  Use environment variables.

**I. Preparation & Setup (Before Deployment):**

1.  **Update Code:** Ensure the latest version of the Deuce Diary code is committed to the `main` branch of your Git repository.
2.  **Review Changes:**  Carefully review the changes included in the latest commit, paying attention to any breaking changes or new features.
3.  **Update Configuration:**
    *   **Environment Variables:** Verify all required environment variables are correctly defined in the Railway configuration (either directly in the app settings or through a separate configuration file). Pay particular attention to:
        *   `DATABASE_URL`
        *   `SECRET_KEY`
        *   `API_KEY` (if applicable)
        *   Any other environment variables specific to Deuce Diary's configuration.
    *   **Railway Configuration Files:** If you’re using custom configuration files, ensure they are up-to-date and compatible with the new code.
4.  **Database Considerations:**
    *   **Database Migrations:**  Run any necessary database migrations before deploying. Consider using a managed database service within Railway (e.g., PostgreSQL) and ensuring migrations are applied correctly.
    *   **Backup:** Take a backup of your existing production database before deploying the new version.

**II. Deployment Steps:**

1.  **Navigate to Railway:** Open your terminal and navigate to the directory where you installed the Railway CLI.
2.  **Login to Railway:**
    ```bash
    railway up login
    ```
    Enter your Railway credentials when prompted.
3.  **Create a New Railway App:**
    ```bash
    railway new deuce-diary --template rails
    cd deuce-diary
    ```
    This creates a basic Rails application within a Railway environment.  You can customize the template if needed.
4.  **Configure the App:**
    *   **Connect to Railway:**
        ```bash
        railway link
        ```
        This links the local application to your Railway environment.
    *   **Add Dependencies:** Install any required gems (if any) for Deuce Diary:
        ```bash
        bundle install
        ```
    *   **Database Setup:**
        *   Railway automatically provisions a PostgreSQL database.  Make sure this is correctly configured within the app settings.
        *   Verify the database URL is set correctly in your environment variables.
    *   **Environment Variables:**  Set all the required environment variables as detailed in the Prerequisites section.  You can do this through the Railway App Settings or by using a Config File.  Recommended: Use the Config File.
5. **Build & Run:**
    ```bash
    railway up build
    railway up run
    ```
    This builds the application and starts the server
