# Write a secrets management guide for Deuce Diary: environmen
Agent: riley
Generated: 2026-03-02T17:24:47.149359

## Deuce Diary: Secrets Management Guide - Dev/Staging/Prod & Railway/Expo

This guide outlines a comprehensive approach to managing secrets within the Deuce Diary project, ensuring security and maintainability across all environments – Development, Staging, and Production – and utilizing Railway and Expo secrets effectively.

**I. Core Principles:**

* **Principle of Least Privilege:**  Only grant access to secrets needed for specific services and users.
* **Separation of Concerns:**  Keep secrets separate from code and configuration.
* **Automation:**  Automate secret rotation, deployment, and verification wherever possible.
* **Auditability:**  Track all secret access and changes.
* **Regular Review:**  Periodically review secrets to ensure they're still needed and haven't been compromised.

**II. Environment Variables Across Environments (Dev/Staging/Prod)**

| Environment   | Variables                  | Purpose                               | Management Method        | Security Considerations                               |
|---------------|----------------------------|---------------------------------------|---------------------------|----------------------------------------------------|
| **Development**| `API_KEY_DEV`, `DATABASE_URL_DEV`, `AUTH_TOKEN_DEV` |  Dummy/Mock data for development |  Hardcoded (for simple setups), Local Config Files | **High Risk:** Never commit sensitive data to source control.  Use mocked/dummy values. |
| **Staging**   | `API_KEY_STG`, `DATABASE_URL_STG`, `AUTH_TOKEN_STG` |  Production-like environment     |  Railway Environment Variables |  More secure than Dev, but still subject to potential breaches. |
| **Production**| `API_KEY_PROD`, `DATABASE_URL_PROD`, `AUTH_TOKEN_PROD` |  Live application data             |  Railway Environment Variables,  Vault (Consideration) | **Highest Risk:** Implement robust security measures.  Regularly rotate secrets. |


**III. Railway Environment Variables**

* **Railway as a Central Hub:** Railway provides a secure and centralized location for managing environment variables across all environments.
* **Access:**  Access Railway through the Railway dashboard.
* **Security:**
    * **IAM Roles:** Leverage Railway's IAM roles for granular access control to your environments.
    * **Secrets Engine:** Railway's Secrets Engine is designed for securely storing and accessing secrets. Avoid using environment variables directly in your application code.
* **Best Practices:**
    * **Naming Conventions:** Employ consistent naming conventions for variables (e.g., `API_KEY_PROD`, `DATABASE_URL_STG`).
    * **Masking Sensitive Data:**  Railway's Secrets Engine allows you to mask sensitive data within your variables (e.g., masking a password).
    * **Regular Audits:**  Review your environment variables regularly to ensure they're still needed and have appropriate access controls.



**IV. Expo Secrets**

* **Expo Secrets for Development:**  Expo Secrets are primarily intended for managing sensitive data during development within the Expo ecosystem.
* **Configuration:**
    * **`app.json`:**  Define secrets directly in your `app.json` file:
       ```json
       {
         "expo": {
           "secret": {
             "apiKey": "YOUR_API_KEY",
             "databaseURL": "YOUR_DATABASE_URL",
             "authToken": "YOUR_AUTH_TOKEN"
           }
         }
       }
       ```
    * **Environment Variables:**  Expo Secrets can also be overwritten using environment variables. If a variable is defined in both `app.json` and an environment variable, the environment variable will take precedence.
* **Limitations:**  Expo Secrets are **not** suitable for production environments.
