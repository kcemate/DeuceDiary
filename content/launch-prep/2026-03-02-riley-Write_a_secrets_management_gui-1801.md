# Write a secrets management guide for Deuce Diary: environmen
Agent: riley
Generated: 2026-03-02T18:01:09.725751

## Deuce Diary: A Secrets Management Guide for Dev/Staging/Prod

This guide outlines a robust secrets management strategy for your Deuce Diary application, covering environment variables across different environments, Railway secrets management, Expo secrets, and a rotation policy.  Prioritizing security and maintainability, this approach balances simplicity with scalability.

**I. Core Principles**

* **Least Privilege:**  Grant only the necessary access to secrets for each environment and service.
* **Separation of Concerns:**  Manage different types of secrets in distinct locations.
* **Automation:** Automate the delivery and rotation of secrets to minimize manual intervention.
* **Auditing:** Track changes to secrets and access attempts for security monitoring.

**II. Environment Variable Management**

| Environment | Location         | Secrets Managed                               | Tools/Methods          |
|-------------|------------------|-----------------------------------------------|--------------------------|
| **Dev**      | Local Development | API Keys, Database URLs, Debug Flags, Authentication Tokens | `dotenv`, `.env` files |
| **Staging**  | Railway Dev Env  | Same as Dev, plus potentially testing database credentials | Railway UI, CLI          |
| **Prod**     | Railway Prod Env | Same as Staging, plus Production Database Credentials | Railway UI, CLI, CI/CD  |

**Key Considerations:**

* **Never commit secrets directly to your code repository.** Utilize environment variables instead.
* **Separate Development and Production Database URLs:** Crucial for preventing accidental data corruption in staging.
* **Debug Flags:** Employ environment variables for easy toggling of debugging features.


**III. Railway Secrets Management**

Railway provides a centralized and secure location for managing secrets.

* **What to Store:**  All secrets relevant to your Railway deployment, including:
    * API Keys (e.g., Spotify, Google Maps)
    * Database Passwords
    * Service Account Keys
    * CMS Secrets (if using CMS integrations)
* **How to Manage:**
    * **Railway UI:** The simplest way to add, update, and delete secrets.
    * **Railway CLI:** Allows for programmatic management of secrets – useful for CI/CD integration.
    * **Environment Variables:**  Railway automatically injects these secrets into your service environments.
* **Best Practices:**
    * **Regularly Review:** Periodically review all secrets in Railway to ensure they are still necessary.
    * **Use Descriptive Names:** Name your secrets clearly to avoid confusion.
    * **Secure Access:**  Only authorized personnel should have access to manage Railway secrets.


**IV. Expo Secrets Management (For Expo Go & Web Apps)**

For Deuce Diary using Expo, managing secrets presents unique challenges.

* **What to Store:**
    * **Firebase API Keys:**  Essential for authentication, analytics, and other Firebase integrations.
    * **Backend API Keys:** (If your backend API uses keys).
    * **Push Notification Keys:** (If using push notifications).
* **How to Manage:**
    * **Expo Application (`.expo/app.config.js`):**  This is the recommended approach. You can define secrets directly in your Expo application configuration file.  These secrets are automatically managed by Expo.
    * **Railway Secrets (For Remote Services):** If you are using a backend service on Railway for your Expo app, use Railway secrets as detailed above.
* **Important Note:** Expo’s native mobile apps should *not* be storing sensitive information directly in their code.  This approach is primarily for your backend services.



**V. Secrets Rotation Policy**

Regular rotation of secrets dramatically reduces the impact of compromised credentials.

* **Frequency:**
    * **High-Risk Secrets (Database Passwords, API Keys):** Rotate every 30-90 days.
