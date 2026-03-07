# Write a secrets management guide for Deuce Diary: environmen
Agent: riley
Generated: 2026-03-03T01:40:55.873845

## Deuce Diary: Secrets Management Guide - Dev, Staging, Production & Railway

This guide outlines a robust secrets management strategy for Deuce Diary, covering environment variables across different environments (Dev, Staging, Production), integration with Railway, handling Expo secrets, and a rotation policy to maintain security.

**I. Core Principles**

* **Least Privilege:** Only grant the necessary access to secrets.  No one should have access to everything.
* **Separation of Concerns:**  Keep secrets separate from code and configuration.
* **Automation:** Automate the process of retrieving and updating secrets.
* **Auditability:** Track who accesses and changes secrets.

**II. Environment Variables Across Environments**

| Environment | Primary Secrets Management | Key Variables to Manage | Examples |
|---|---|---|---|
| **Dev (Local Development)** | **Environment Variables & Local Files** -  Simple `.env` files or directly setting variables in your IDE. | `API_URL`, `DATABASE_URL`, `DEBUG`, `JWT_SECRET`, `CLIENT_ID` | `API_URL = "http://localhost:3000"` |
| **Staging (Testing/QA)** | **Railway Environment Variables** - Utilizes Railway's built-in secret storage for centralized management. | Same as Dev, plus staging-specific configurations. |  Stored securely on Railway |
| **Production (Live)** | **Railway Environment Variables & Vault (Recommended)** -  Railway's built-in secrets storage coupled with a dedicated Vault solution for more sensitive information. | Same as Staging, plus production-specific configurations, API Keys, etc. | Stored securely on Railway & Vault (if applicable) |



**III. Railway Environment Variables - Detailed**

* **How to Manage:** Railway provides a convenient interface to set and manage environment variables for your app.
    * **Web UI:** Easily add, edit, and delete variables through the Railway dashboard.
    * **CLI:** Use `railway up --env-vars <variable1>=<value1> <variable2>=<value2> ...` during deployment.
    * **`railway.toml`:**  Define environment variables within a `railway.toml` file in your project root. Railway will automatically load these.
* **Best Practices:**
    * **Name Conventions:** Use clear, consistent naming conventions (e.g., `DATABASE_URL`, `STRIPE_SECRET_KEY`).
    * **Sensitive Variables:**  Never commit sensitive variables directly to your codebase. Railway's secret storage is designed for this.
    * **Verification:**  Immediately after deployment, verify that the variables are correctly set and accessible within your application.
    * **Dynamic Variables:** Utilize Railway's dynamic variables for values that change frequently (e.g., random tokens for API keys).


**IV. Expo Secrets - Managing Client-Side Secrets**

* **Problem:** Expo apps often need to access secrets like API keys or authentication tokens. Directly embedding these in the Expo SDK is strongly discouraged.
* **Solution: Expo Application Secrets**
    * **Creation:**  Use the `expo install expo-application-secrets` command to install the package.
    * **Configuration:** Create a `app.json` file in your project root (or if using Expo CLI, it's handled automatically) and define the secrets there.
    * **Accessing Secrets:**
        * **Expo SDK:** Use `expo-application-secrets` to access secrets within your Expo SDK code.
        * **Example:**
            ```javascript
            import * as ApplicationSecrets from 'expo-application-secrets';
            const API_KEY = ApplicationSecrets.get('myApiKey');
            ```
* **Security:**  These secrets are stored securely on your Railway environment, preventing
