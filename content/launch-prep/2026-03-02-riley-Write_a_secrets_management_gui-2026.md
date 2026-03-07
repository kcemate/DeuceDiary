# Write a secrets management guide for Deuce Diary: environmen
Agent: riley
Generated: 2026-03-02T20:26:20.577536

## Deuce Diary: Secrets Management Guide

This guide outlines a robust secrets management strategy for your Deuce Diary project, covering environment variables across development, staging, and production environments, Railway environment variables, Expo secrets, and a rotating policy. Prioritizing security and maintainability is key.

**I. Environment Variable Strategy - Dev/Staging/Prod**

* **Principle:** Utilize a layered approach with varying levels of sensitivity for each environment.
* **Dev (Local Development):**
    * **Method:**  Local environment variables via `.env` file.
    * **Content:**  Typically include API keys, database URLs, and other credentials specific to development.
    * **Security:**  Never commit the `.env` file to version control. Utilize `.gitignore`.
* **Staging:**
    * **Method:** A configuration file (e.g., `config.js`, `config.ts`) and environment variables.
    * **Content:** Similar to Dev, but with slightly more realistic (but still non-production) data.  This includes test database credentials and API keys.
    * **Security:**  Securely store and manage the configuration file.  Consider a secrets vault (like HashiCorp Vault) for higher security.
* **Prod (Production):**
    * **Method:** Primarily Railway environment variables (detailed below). 
    * **Content:** Production-specific configurations, database credentials, API keys.
    * **Security:** Strict access control, auditing, and integration with your CI/CD pipeline.


**II. Railway Environment Variables**

Railway offers a simple and effective way to manage environment variables for your Deuce Diary app.

* **Configuration:**
    * **Railway Dashboard:**  Access your project's settings within the Railway dashboard.
    * **Environment Variables:**  Add environment variables directly in the dashboard.  Railway provides a secure environment for storing them.
* **Types of Variables:**
    * **Standard Variables:**  Basic environment variables (e.g., `DATABASE_URL`, `API_KEY`).
    * **Secret Variables:**  Used for sensitive information like database passwords, API keys. These are stored securely and should be used exclusively for production.
* **Best Practices:**
    * **Don't hardcode secrets:** Never hardcode sensitive data directly into your code.
    * **Least Privilege:** Only grant Railway the necessary permissions to access your application and data.
    * **Regular Review:** Periodically review your environment variables to ensure they're still necessary and secure.


**III. Expo Secrets (For Expo Go/Mobile)**

When using Deuce Diary with Expo Go or a mobile app, you'll need to manage secrets differently.

* **Expo Secrets File:**  Create a file named `secrets.json` in your project's root directory.
* **Content:** This file will contain your sensitive values.
* **Example `secrets.json`:**
```json
{
  "API_KEY": "YOUR_API_KEY_HERE",
  "DATABASE_URL": "YOUR_DATABASE_URL_HERE"
}
```
* **Security:**
    * **Never Commit:**  Absolutely do *not* commit the `secrets.json` file to your repository.
    * **Expo CLI:** The Expo CLI automatically recognizes and handles this file.
    * **Expo Go Security:** When building for Expo Go, ensure your device has appropriate security settings enabled.

**IV. Secrets Rotation Policy**

* **Importance:** Rotating secrets regularly reduces the impact of a potential breach.
* **Frequency:**
    * **API Keys & Database Passwords:** Rotate at least every 90 days.  Consider shorter intervals for critical keys.
    * **Other Secrets:** Rotate more frequently (e.g.,
