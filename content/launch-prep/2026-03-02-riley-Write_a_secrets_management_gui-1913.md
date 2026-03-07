# Write a secrets management guide for Deuce Diary: environmen
Agent: riley
Generated: 2026-03-02T19:13:48.799131

## Secrets Management Guide for Deuce Diary

This guide outlines a robust secrets management strategy for Deuce Diary, specifically addressing environment variables across development, staging, and production environments, Railway secrets integration, Expo secrets handling, and a rotation policy.  It emphasizes security and maintainability.

**I. Core Principles:**

* **Least Privilege:**  Only grant access to secrets needed for specific services.
* **Automation:** Automate secret injection and rotation wherever possible.
* **Centralized Management:** Utilize a single, trusted source for all secrets.
* **Auditing:**  Track changes to secrets and access attempts.

**II. Environment Variable Management:**

**A. Environment Groups - Dev, Staging, Prod:**

* **Concept:**  Establish distinct environment groups representing each deployment stage.  Each group will have a defined set of environment variables.
* **Tools:** Use a version control system (like Git) to manage YAML files defining these environment groups.
* **Structure (Example YAML):**

```yaml
# dev.env.yaml
DEV_API_KEY: "dev-api-key-123"
DEV_DATABASE_URL: "dev-db-url"
DEV_DEBUG_MODE: true

# staging.env.yaml
STAGING_API_KEY: "staging-api-key-456"
STAGING_DATABASE_URL: "staging-db-url"
STAGING_DEBUG_MODE: false

# prod.env.yaml
PROD_API_KEY: "prod-api-key-789"
PROD_DATABASE_URL: "prod-db-url"
PROD_DEBUG_MODE: false
```

* **Deployment:** Scripts (e.g., using CI/CD tools like GitHub Actions or CircleCI) should retrieve the correct `.env` file based on the deployment environment and inject the variables into the application.
* **Dynamic Injection:** Implement a system to dynamically inject these variables during runtime, rather than hardcoding them in the application.

**B. Railway Environment Variables:**

* **Railway's Approach:** Railway allows you to define environment variables directly within the Railway dashboard for your app.
* **Best Practices:**
    * **Treat Railway vars as 'Ephemeral':** Railway vars are often cleared on deployments. Rely on your defined environment groups primarily.
    * **Store Sensitive Data securely:** Use Railway's secrets features to securely store things like API keys, database passwords, etc.
    * **Automation with Railway CLI:** Leverage the Railway CLI to set and manage environment variables.

**III. Expo Secrets Management:**

* **Expo Secrets File:**  Within your Expo project, create a `.expo/secrets.json` file.  This file is automatically managed by Expo.
* **Content:** This file should contain sensitive information like API keys, client secrets, and other credentials.
* **Security:**
    * **Don’t commit `.expo/secrets.json` to version control!** Expo handles this securely.  Explicitly instruct developers to never push this file.
    * **Expo Managed Workflow:** This strategy is designed specifically for the Expo Managed Workflow, where Expo handles the app's build and installation.

**IV. Secret Rotation Policy:**

* **Importance:** Rotating secrets is crucial for security.  Regular rotation reduces the impact of a compromised key.
* **Frequency:**
    * **High-Risk Secrets (API Keys, Database Passwords):** Rotate every 90 days or on a monthly basis.
    * **Low-Risk Secrets (Debug Flags):** Rotate less frequently, or not at all.
* **Implementation:**
    * **Automated Rotation (Ideal):** Utilize services like AWS Secrets Manager, Google Cloud Secret Manager, or HashiCorp Vault for automated secret
