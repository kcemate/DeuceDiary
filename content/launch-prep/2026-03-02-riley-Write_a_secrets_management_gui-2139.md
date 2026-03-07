# Write a secrets management guide for Deuce Diary: environmen
Agent: riley
Generated: 2026-03-02T21:39:47.684657

## Secrets Management Guide for Deuce Diary

This guide outlines best practices for managing secrets within the Deuce Diary project, covering environment variables across dev/staging/prod, Railway environment variables, Expo secrets, and a rotation policy. Securely managing secrets is crucial for the security and stability of our application.

**I. Environment Variables - The Foundation**

* **Purpose:** Environment variables store configuration data needed by our application, like API keys, database passwords, and URLs.
* **Categorization:** We'll use a structured approach:
    * **Dev:** Used for local development. Generally less sensitive.
    * **Staging:**  Mirrors production closely, used for testing and QA.
    * **Prod:** Live production environment. Highest security standards.
* **Storage Locations:**
    * **`.env` Files (Dev & Staging):**  Simple and straightforward for local development.  **Important:** Never commit `.env` files to Git.
    * **Railway Variables:** For Staging and Production, Railway provides a robust and secure centralized location for storing environment variables.
    * **Expo Secrets:** For Expo secrets, leverage the Expo Secrets functionality (detailed below).

**II. Setting Up Environment Variables**

1. **Variable Naming:**
   * Use descriptive, lowercase names with underscores (e.g., `DATABASE_URL`, `API_KEY`).
   * Avoid spaces or special characters.
2. **Variable Values:**
   * **Sensitive Data:** Always store sensitive information (passwords, API keys) as secrets.
   * **Never Hardcode:** **Never** hardcode sensitive values directly into your codebase.
3. **Environment Variable Management Tools:**
   * **Railway Variables:** Our preferred method for staging and production.
   * **`.env` files:**  For local development, manage with a `.gitignore` file to prevent accidental commits.


**III. Railway Environment Variables - Production & Staging**

* **Railway Configuration:** Railway handles the storage and retrieval of environment variables.
* **Setting Values:**
    * **Railway Dashboard:**  Add new variables via the Railway dashboard for each environment.
    * **Railway CLI:** You can also manage variables using the Railway command-line interface.
* **Secrets Management:** Railway automatically encrypts and protects these variables, preventing them from being exposed in logs or source code.
* **Permissions:**  Ensure only authorized personnel have access to manage Railway variables.
* **Railway Secrets UI:** Use the Railway Secrets UI to review and manage all your secrets.

**IV. Expo Secrets - Local Development & Expo SDK**

* **Purpose:** Expo Secrets provide a secure way to manage secrets specifically for Expo development, particularly when working with Expo SDK.
* **How it Works:**
    * **`expo secrets` CLI:**  The `expo secrets` command-line interface allows you to access and configure secrets.
    * **`expo-secrets` Library:** Use the `expo-secrets` React Native library to securely access secrets within your app.
* **Configuration:**
    * **`expo secrets` Configuration File:** Create a `secrets.json` file in the root of your project to define your secrets.
    * **`expo secrets` CLI Commands:** Use commands like `expo secrets init` and `expo secrets set` to initialize and set secrets.
* **Security Considerations:**  While Expo Secrets offer an improved security layer, they are *not* a replacement for proper Railway environment variable management for production environments.


**V. Rotation Policy - Keeping Secrets Secure**

* **Why Rotate?** Secrets can become compromised if exposed or stolen. Regular rotation reduces the potential impact of a breach.
* **Rotation Frequency:**
    * **API Keys & Credentials:** Rotate every 30-60 days (minimum).
