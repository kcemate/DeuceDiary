# Write a secrets management guide for Deuce Diary: environmen
Agent: riley
Generated: 2026-03-02T22:16:47.023734

## Deuce Diary: Secrets Management Guide

This guide outlines a robust secrets management strategy for Deuce Diary, covering environment variables across different environments (dev/staging/prod), Railway environment variables, Expo secrets, and a rotation policy to ensure security.

**I. Core Principles:**

* **Principle of Least Privilege:**  Only grant access to secrets needed for specific services and environments.
* **Avoid Hardcoding:** Never hardcode secrets directly into your codebase or configuration files.
* **Centralized Management:** Implement a central system for managing and rotating secrets.
* **Auditing & Monitoring:** Track access to secrets and monitor for suspicious activity.

**II. Environment Variables Across Environments:**

We’ll use a layered approach to manage environment variables, reflecting the increasing criticality of each environment:

* **Dev Environment:**
    * **Tools:**  `dotenv` (for local development),  potentially a basic key-value store like HashiCorp Vault (for experimentation).
    * **Variables:**  Simulated or dummy values for API keys, database credentials, etc. -  Focus on testing configurations, not actual secrets.
    * **Management:**  Maintain a `config/dev.js` or similar file.
* **Staging Environment:**
    * **Tools:**  HashiCorp Vault (recommended) or AWS Secrets Manager.
    * **Variables:**  Realistic, but *test* values for services.  Keys should be clearly identified as "Staging" to prevent accidental use in Production.
    * **Management:** Managed through Vault or Secrets Manager, with appropriate IAM roles.
* **Production Environment:**
    * **Tools:** HashiCorp Vault (essential) - Provides centralized control, encryption at rest and in transit, and granular access control.
    * **Variables:**  *Real* API keys, database credentials, certificates, etc.  Strict access control based on service requirements.
    * **Management:**  Vault is the primary management tool, with automation for deployment and updates.


**III. Railway Environment Variables:**

Railway simplifies deploying Expo apps, but managing secrets within the platform is crucial.

* **Railway Secrets:**  Railway provides a built-in secret management system.
* **Storage:** Store sensitive data like API keys, database connection strings, and third-party service tokens directly in Railway Secrets.
* **Access:**  Railway automatically injects these secrets into your services during deployment.
* **Best Practices:**
    * **Naming Convention:** Use a consistent naming convention (e.g., `MY_APP_API_KEY`).
    * **Avoid Sensitive Information:** Only store truly sensitive secrets here – avoid configuration files or other large data.
    * **Review Regularly:** Periodically review stored secrets to ensure they are still needed and are the correct values.

**IV. Expo Secrets:**

Expo’s managed workflow introduces a specific way to handle secrets.

* **`expo-constants`:** The `expo-constants` library provides access to environment variables set in the Expo Application settings.
* **Expo Application Settings:**  Within your Expo project, navigate to `Project Settings` -> `General` -> `Environment Variables`. This is the preferred way to manage secrets that Expo’s managed workflow needs to access.
* **Avoid direct code access:** Don’t attempt to directly access these secrets through your code.  Let `expo-constants` handle retrieval.
* **Limitations:**  Expo Secrets are primarily intended for variables needed by the Expo runtime itself.  Complex secrets or those requiring fine-grained access should be managed through Vault.

**V. Rotation Policy:**

Implementing a robust rotation policy is critical to mitigating the risk of compromised secrets.

* **Frequency:**
    * **API Keys & Credentials:** Rotate every 30-60 days – especially after any changes to service configurations.
