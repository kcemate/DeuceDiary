# Write a secrets management guide for Deuce Diary: environmen
Agent: riley
Generated: 2026-03-02T17:42:55.443556

## Secrets Management Guide for Deuce Diary - Environment Variables Across Environments

This guide outlines a robust secrets management strategy for Deuce Diary, encompassing environment variables across development, staging, and production environments, integrating Railway, utilizing Expo secrets, and implementing a rotation policy.  

**I. Core Principles:**

* **Least Privilege:**  Grant only the necessary access to secrets.
* **Separation of Concerns:**  Maintain distinct environments with appropriate levels of security.
* **Automation:** Automate secret management tasks to minimize manual errors and improve consistency.
* **Auditability:** Track changes to secrets for security and compliance purposes.

**II. Environment Variable Management Across Environments:**

| Environment | Source of Variables | Tooling Recommended |  Use Cases |
|---|---|---|---|
| **Development** | Local Development Environment (e.g., VS Code, Expo CLI) | Expo CLI, Environment variables in `.env` file | Local development, testing, experimentation |
| **Staging** | Railway Environment Variables (Highly Recommended) | Railway CLI, Railway Console | Testing deployment pipelines, simulating production conditions |
| **Production** | Railway Environment Variables (Highly Recommended) | Railway CLI, Railway Console, CI/CD Pipeline | Live application deployment, access to sensitive production keys |


**III. Railway Environment Variables:**

* **Why Railway?** Railway simplifies deploying and managing applications, and its integrated environment variable management is crucial for Deuce Diary.
* **Setting Variables:**
    * **Railway Console:**  The primary interface. Navigate to your app's settings, select “Environment Variables,” and add your variables.
    * **Railway CLI:** `railway up --env-vars API_KEY=your_api_key DATABASE_URL=your_database_url` (Use with caution - sensitive data should be managed through the console.)
* **Types of Variables:**  Railway supports string, boolean, number, and array types.
* **Secure Storage:** Railway automatically encrypts and stores sensitive environment variables.
* **Secrets Management (Railway Secrets):** Leverage Railway's built-in Secrets management capabilities for true security. (See Section IV)

**IV. Expo Secrets (For Expo-Based Components):**

* **What are Expo Secrets?** Expo Secrets provides a secure way to manage sensitive information within your Expo projects (e.g., API keys, database credentials).
* **Configuration:**
    * **`expo secrets init`:**  Initializes the secrets configuration within your project.
    * **`expo secrets list`:** Lists all accessible secrets.
    * **`expo secrets set`:** Sets the value of a specific secret.
    * **`expo secrets get`:** Retrieves the value of a specific secret.
* **Usage:**  Access secrets within your Expo project using `expo-secrets`.  (Refer to Expo Secrets documentation for integration details: [https://docs.expo.dev/expo-secrets/](https://docs.expo.dev/expo-secrets/))
* **Note:** Expo Secrets primarily intended for local development and staging environments, as Railway Secrets are preferred for production.

**V. Rotation Policy:**

* **Importance:** Regularly rotating secrets significantly reduces the impact of a potential compromise.
* **Recommendations:**
    * **Frequency:**
        * **High-Risk Secrets (API Keys, Database Credentials):**  Rotate every 30-90 days.
        * **Medium-Risk Secrets (Staging Keys):** Rotate every 60-120 days.
        * **Low-Risk Secrets (e.g., static configuration):** Rotate every 6 months - 1 year.
    * **Automation:** Implement a CI/CD pipeline to automatically generate and deploy new secrets based on a rotation schedule.
    * **Version Control (Strategically):**
