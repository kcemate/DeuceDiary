# Write a secrets management guide for Deuce Diary: environmen
Agent: riley
Generated: 2026-03-02T21:21:14.892128

## Deuce Diary: Secrets Management Guide - Dev, Staging, Prod, Railway & Expo Secrets

This guide outlines a robust secrets management strategy for Deuce Diary, considering different environments (dev, staging, prod), Railway integration, Expo secrets, and a rotating policy.  Security is paramount, and this approach balances convenience with best practices.

**I. Core Principles:**

* **Least Privilege:**  Only individuals who *need* access to a specific secret should have it.
* **Separation of Concerns:**  Maintain clear distinctions between development, staging, and production environments.
* **Automation:**  Automate the process of secret deployment and rotation to minimize manual errors.
* **Auditing & Logging:**  Track access and changes to secrets for security and compliance.


**II. Environment Variables - Dev, Staging, Prod**

| Environment | Source of Variables | Purpose |  Security Considerations |
|---|---|---|---|
| **Development (Dev)** |  `process.env` (Expo Development Server) | Local development, rapid iteration, debugging |  **Highest Risk:** Store development secrets in cleartext, primarily for local experimentation. Use with caution. |
| **Staging** | Railway Environment Variables (Recommended) |  Testing environment, mimicking production |  **Medium Risk:** Railway provides secure storage and access controls. Leverage Railway’s secrets management capabilities. |
| **Production** | Railway Environment Variables (Recommended) |  Live environment, serving users |  **Lowest Risk:** Railway’s secure environment is the primary source of truth.  Strict access control is essential. |


**III. Railway Environment Variables**

* **Railway Secrets:**  Railway’s built-in secrets management system is the preferred method.
    * **Adding Secrets:** Use the Railway CLI (`railway up --env <env> --secrets <secret_name>=<value>`) or the Railway UI to add secrets.
    * **Accessing Secrets:**  Access secrets within your application via the `process.env` object in Expo development (using the Railway CLI to configure environment variables) or your application's runtime environment.
    * **Access Control:** Railway’s IAM (Identity and Access Management) allows you to restrict access to secrets based on roles and teams.
    * **Best Practices:**  
        * Regularly review secrets and remove those no longer needed.
        *  Use descriptive secret names.
        *  Utilize Railway’s role-based access control.

**IV. Expo Secrets (Specific to Expo)**

* **Expo Secrets Config:**  Expo provides a `secrets.config.js` file to manage local secrets in your Expo project.
   * **Example:**
     ```javascript
     export default {
       API_KEY: "your-api-key",
       DATABASE_URL: "your-database-url",
       // ... other secrets
     };
     ```
* **Deployment:**  Expo Secrets are *not* automatically deployed to Railway or other environments.  You *must* manually sync them.
    * **Manual Sync (Recommended for Dev/Staging):**  After updating `secrets.config.js`, run `expo expo-cli run:ios` or `expo expo-cli run:android`  This can sometimes trigger updates to environment variables during the build process.
    * **Automated Sync (Railway):**  Utilize Railway’s CLI to sync secrets from your `secrets.config.js` file to your Railway environment.  This is crucial for consistency.


**V. Rotation Policy**

* **Frequency:**  Implement a rotation policy based on your risk assessment and the sensitivity of the secrets.
    * **Frequent (Daily/Hourly):**  Highly sensitive secrets like API keys, database credentials, and tokens.
    * **Moderate (
