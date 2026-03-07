# Write a secrets management guide for Deuce Diary: environmen
Agent: riley
Generated: 2026-03-02T18:55:40.488835

## Deuce Diary: Secrets Management Guide

This guide outlines a robust secrets management strategy for your Deuce Diary project, covering environment variables across different environments (dev, staging, prod), Railway environment variables, Expo secrets, and a rotation policy for security best practices.

**I. Core Principles:**

* **Minimize Hardcoding:** Never hardcode secrets directly into your codebase (JavaScript, Expo code, Railway configurations).
* **Principle of Least Privilege:**  Grant access to secrets only to the individuals and systems that absolutely need them.
* **Version Control:** Treat secrets like code - track changes and manage versions.
* **Regular Audits:**  Periodically review your secrets management practices and access permissions.


**II. Environment Variables Across Environments:**

* **Dev:**  Environment variables should be defined locally in your development environment. This allows for quick iteration and testing without needing to deploy to staging.
    * **Tools:**  `.env` files (using `dotenv` package), VS Code Environment Variables.
    * **Content:**  API keys for testing, debug flags, database connection strings (using a local database like MongoDB Atlas or SQLite).
* **Staging:** Environment variables should be stored in a dedicated environment variable system like Railway or a configuration management system.
    * **Tools:** Railway, AWS Systems Manager Parameter Store, or similar.
    * **Content:**  Production-like configuration settings, API keys for testing, database connection strings (using a staging database).
* **Prod:** Secrets should *never* be directly configured in the production Railway environment. Instead, they should be securely managed.
    * **Railway Secrets:** Railway’s built-in secrets management system is ideal.
    * **Content:**  Production API keys, database connection strings, authentication credentials, and any other sensitive data.


**III. Railway Environment Variables:**

* **Setting Up:**  Railway uses a secrets store to manage your environment variables. You can configure these within the Railway dashboard.
* **Accessing:** Railway automatically injects these secrets into your application's environment.
* **Security:** Railway handles encryption and access control for your secrets.
* **Best Practices:**
    * **Create separate Railway secrets for each environment:** This prevents accidental deployment of staging secrets to production.
    * **Use Railway's Secrets UI:** Utilize the web interface to view, edit, and manage your secrets.
    * **Regularly Review:** Audit your Railway secrets periodically to ensure accuracy and remove any unnecessary secrets.

**IV. Expo Secrets:**

* **What are Expo Secrets?** Expo Secrets allows you to securely store sensitive data directly within the Expo project, accessible to your JavaScript code.
* **Using them:**
    * **Generate:** `expo secrets init`
    * **Access:**  Access secrets using the `expo-constants` package or directly through the `expo.secrets` object.
* **Example:**
    ```javascript
    import Constants from 'expo-constants';

    const API_KEY = Constants.expoSecrets.apiKey;
    ```
* **Security Considerations:**
    * **Expo Secrets should *supplement* other secrets management practices, not replace them entirely.**  For critical secrets like production database credentials, use Railway Secrets instead.
    * **Limit access:**  Don’t expose the `expo.secrets` object unnecessarily in your application.


**V. Rotation Policy:**

* **Importance:** Regularly rotating secrets drastically reduces the impact of a potential compromise.
* **Frequency:**
    * **API Keys:** Rotate monthly or quarterly.
    * **Database Credentials:** Rotate more frequently – every 2-4 weeks, especially for production.
    * **Authentication Tokens:** Short-lived tokens with automatic refresh are highly recommended.
* **Implementation:**
    * **Automated Rotation:** Explore tools and services
