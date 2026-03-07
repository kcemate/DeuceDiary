# Write a secrets management guide for Deuce Diary: environmen
Agent: riley
Generated: 2026-03-02T23:12:30.762886

## Secrets Management Guide for Deuce Diary

This guide outlines a robust secrets management strategy specifically tailored for Deuce Diary, addressing environment variables across development, staging, and production environments, Railway integration, Expo secrets, and a rotation policy. It aims to balance security, ease of management, and the development workflow.

**I. Core Principles:**

* **Least Privilege:** Grant access to secrets only to those who absolutely need them.
* **Separation of Concerns:** Keep secrets isolated and separate from codebase.
* **Automation:** Automate the process of updating secrets whenever possible.
* **Monitoring & Auditing:** Track access to secrets and any changes made.

**II. Environment Variables Across Environments:**

| Environment | Variables (Examples)             | Management Method       | Purpose                                    |
|-------------|------------------------------------|--------------------------|--------------------------------------------|
| **Dev**     | `API_KEY_DEV`, `DATABASE_URL_DEV`     | Local `.env` files      | Development, testing, initial experimentation |
| **Staging** | `API_KEY_STG`, `DATABASE_URL_STG`     | Railway Environment Vars| Staging environment mirroring production   |
| **Prod**    | `API_KEY_PROD`, `DATABASE_URL_PROD`     | Railway Environment Vars| Production environment                       |

**Key Considerations:**

* **Variable Naming Convention:** Use a consistent naming convention (e.g., `[ENV]_[VARIABLE_NAME]`) for easy identification.
* **Sensitive Data Handling in Dev:** Avoid committing sensitive information directly to Git repositories. Utilize a `.gitignore` file to exclude the `.env` file.



**III. Railway Environment Variables:**

* **Railway CLI:** Utilize the Railway CLI for managing environment variables. This is the primary method for configuring your Deuce Diary app on Railway.
* **Railway Secrets:**  Railway's built-in secrets management system is the recommended approach.  Store sensitive information directly in Railway’s secret store.  **Do not** hardcode secrets into your code.
* **Access Control:** Railway allows granular access control to your secrets. Ensure only authorized team members can modify them.
* **Environment Variable Groups:** Group related environment variables together for easier management and organization.
* **Railway Configuration Files (YAML):**  Manage environment variables within your Railway project’s configuration files (e.g., `railway.yml`).



**IV. Expo Secrets:**

* **Expo Secrets Plugin:** Utilize the Expo Secrets plugin for managing sensitive data within your Expo project. This is especially crucial during development and testing.
* **`expo-constants`:** Leverage `expo-constants` to access the secret in your application. 
  ```javascript
  import Constants from 'expo-constants';

  const mySecret = Constants.expoConfig.secrets.API_KEY_DEV;
  ```
* **`secrets.get("API_KEY_DEV")`**:  For accessing secrets directly.
* **Commit to Git:** The Expo Secrets plugin automatically commits secrets to your Git repository, ensuring they're available in all environments.  **Careful:** Only include secrets that *absolutely* need to be accessible to development builds (e.g., API keys for development servers).

**V. Rotation Policy:**

* **Frequency:** Implement a rotation policy based on your security requirements and the sensitivity of the secrets.
    * **High Risk Secrets (API Keys, Database Credentials):**  Rotate every 30-60 days.
    * **Medium Risk Secrets (Internal Service URLs):** Rotate every 90-180 days.
* **Automation:** Automate the rotation process as much as possible. Railway allows for automated environment variable updates.  Consider scripts for API key generation.
* **Manual
