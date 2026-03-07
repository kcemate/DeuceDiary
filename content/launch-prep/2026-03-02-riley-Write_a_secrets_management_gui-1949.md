# Write a secrets management guide for Deuce Diary: environmen
Agent: riley
Generated: 2026-03-02T19:49:58.997521

## Deuce Diary: Secrets Management Guide - Dev/Staging/Prod & Railway/Expo Integration

This guide outlines a robust secrets management strategy for your Deuce Diary app, focusing on environment variables and integrating them across development, staging, and production environments. It specifically addresses Railway and Expo secrets and incorporates a rotation policy for enhanced security.

**I. Core Principles:**

* **Separation of Concerns:** Keep secrets isolated to their respective environments.
* **Least Privilege:**  Only grant necessary access to secrets.
* **Centralized Management:**  Establish a single source of truth for secrets.
* **Automation:** Automate the provisioning and rotation of secrets where possible.
* **Monitoring & Auditing:**  Track access and changes to secrets.


**II. Environment Variable Management - Dev/Staging/Prod**

1. **Dev Environment:**
   * **Tools:**  VS Code Dev Containers, Local Docker Compose, or similar.
   * **Variables:**  Basic configuration – API keys (dummy ones!), database URLs (local SQLite), debug mode enabled.
   * **Storage:**  Hardcoded within the project, or locally stored configuration files.
   * **Best Practice:** Keep these variables minimal and easily configurable.

2. **Staging Environment:**
   * **Tools:** Similar to Dev, but might utilize a more realistic database (e.g., PostgreSQL).
   * **Variables:**  Keys for actual API services, staging database URLs, analytics tracking IDs.
   * **Storage:**  Configuration files within the staging environment's container or locally stored.
   * **Best Practice:**  Staging should closely resemble production in terms of services used.

3. **Production Environment:**
   * **Tools:** Railway, Expo CLI, serverless functions (e.g., AWS Lambda, Cloud Functions).
   * **Variables:** Final keys for all services, production database URLs, analytics tracking IDs, API endpoints.
   * **Storage:** **Railway Environment Variables** (explained in Section III) - This is the primary method.


**III. Railway Environment Variables**

Railway is an excellent choice for managing production secrets.

1. **Setting Variables:**
   * **Railway Dashboard:**  Navigate to your project’s settings.
   * **Environment Variables Tab:** Add new environment variables with their corresponding values.
   * **Categorization:** Use descriptive names for your variables (e.g., `DATABASE_URL`, `API_KEY`).
   * **Encryption (Optional):** Consider using Railway's built-in encryption for sensitive keys.  This adds an extra layer of security.

2. **Permissions:**
   * Ensure your Railway account has the necessary permissions to access the services your app uses (e.g., access to your database provider).

3. **Security Best Practices for Railway:**
    * **Don't Commit Secrets to Git:** Never, ever commit your secrets to your version control system. Railway handles this securely.
    * **Regularly Review:** Periodically review your variables to ensure they are still accurate and haven’t been compromised.


**IV. Expo Secrets (For Expo Go & Expo Native)**

When developing with Expo Go or Expo Native, managing secrets is crucial.

1. **Expo Secrets File:**  Create a `.secrets.json` file in the root of your Expo project.  This file stores your sensitive information.

2. **Contents of `.secrets.json`:**
   ```json
   {
     "API_KEY": "YOUR_API_KEY",
     "DATABASE_URL": "YOUR_DATABASE_URL",
     "ANALYTICS_ID": "YOUR_ANALYTICS_ID"
   }
   ```

3. **Environment Variable Injection:** Expo automatically reads this `.secrets.json` file and inject
