# Write a secrets management guide for Deuce Diary: environmen
Agent: riley
Generated: 2026-03-02T18:37:31.920413

## Deuce Diary: Secrets Management Guide - Dev, Staging, Prod & Railway

This guide outlines a robust secrets management strategy for Deuce Diary, covering environment variables across development, staging, and production environments, utilizing Railway's environment variables, Expo secrets, and implementing a rotation policy.

**I. Core Principles:**

* **Security First:** Treat all secrets as highly sensitive. Minimize their exposure and implement the principle of least privilege.
* **Automation:** Automate secret retrieval and management wherever possible to reduce manual errors and security risks.
* **Version Control Caution:** **Never** commit secrets directly to version control (Git).
* **Centralized Management:** Employ a centralized system for managing secrets to maintain consistency and control.

**II. Environment Variables - Dev, Staging, & Prod:**

* **Organization:** Use a clear naming convention for environment variables. Examples:
    * `API_KEY_DEV`, `API_KEY_STAGING`, `API_KEY_PROD`
    * `DATABASE_URL_DEV`, `DATABASE_URL_STAGING`, `DATABASE_URL_PROD`
* **Separate Configurations:** Maintain distinct configuration files for each environment. This avoids accidental exposure of sensitive data in the wrong environment.
* **Gitignore:**  Crucially, add relevant configurations to your `.gitignore` file to prevent accidental tracking of environment variables.
* **Dev Environment:**
    * **Local Development:** Utilize local environment variables for development. Tools like `dotenv` are recommended for managing local configurations. *Never* hardcode secrets directly into your application code.
* **Staging Environment:**
    * **Deployment Pipeline:**  Environment variables are typically provided through the deployment pipeline (e.g., CI/CD).
    * **Secret Management Tool Integration (Recommended):** Explore integrating a dedicated secrets management tool (like HashiCorp Vault or AWS Secrets Manager) for Staging for increased security.
* **Production Environment:**
    * **Railway Environment Variables (Primary):** Railway provides a seamless way to manage environment variables. This is the recommended approach for Production.
    * **Robust Monitoring:** Implement comprehensive monitoring to detect potential issues related to secret leaks or misconfigurations.

**III. Railway Environment Variables:**

* **Railway CLI:** Use the Railway CLI to set environment variables.
    * `railway up --env <env_name> --var KEY=VALUE` (e.g., `railway up --env prod --var DATABASE_URL=...`)
* **Railway Dashboard:** You can also set variables directly through the Railway dashboard UI.
* **Encrypted Storage:** Railway encrypts environment variables at rest, adding an extra layer of security.
* **Access Control:** Railway's access control features allow you to restrict who can modify environment variables.
* **Auditing:**  Railway provides audit logs to track changes to environment variables, essential for accountability and troubleshooting.

**IV. Expo Secrets (For Expo SDK Projects):**

* **Expo Secrets File:**  Create a `.secrets.json` file within your Expo project.
    * **Example `.secrets.json`:**
    ```json
    {
      "API_KEY": "YOUR_API_KEY",
      "DATABASE_URL": "YOUR_DATABASE_URL"
    }
  ```
* **Accessing Secrets in Expo SDK:** Use the `expo-secrets` library to securely access these secrets in your Expo SDK code.
    * **Installation:** `npx expo install expo-secrets`
    * **Usage:**
    ```javascript
    import * as Secrets from 'expo-secrets';

    async function loadSecrets() {
      try {
        await Secrets.init(['API_KEY', 'DATABASE_URL']); // Specify the secrets used
        const apiKey = Secrets.API_
