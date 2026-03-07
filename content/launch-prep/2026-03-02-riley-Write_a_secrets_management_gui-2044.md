# Write a secrets management guide for Deuce Diary: environmen
Agent: riley
Generated: 2026-03-02T20:44:29.856575

## Secrets Management Guide for Deuce Diary

This guide outlines a robust secrets management strategy for Deuce Diary, covering environment variables across development, staging, and production environments, Railway secrets management, Expo secrets, and a rotation policy to ensure ongoing security.

**I. Core Principles:**

* **Least Privilege:** Grant access to secrets only to those who absolutely need them.
* **Separation of Concerns:** Maintain distinct environments with controlled access.
* **Automation:** Automate secrets rotation and deployment processes wherever possible.
* **Monitoring & Auditing:** Track access to secrets and any changes made to them.

**II. Environment Variable Management:**

| Environment | Purpose                               | Key Variables            | Storage                               | Access Control                                 |
|--------------|---------------------------------------|--------------------------|---------------------------------------|-------------------------------------------------|
| **Dev**       | Local Development & Testing             | `API_URL`, `DATABASE_URL`, `JWT_SECRET`, `DEBUG` | Local `.env` file (securely managed) | Developer access only (ideally through CI/CD) |
| **Staging**   | Pre-Production Testing & User Acceptance | Similar to Prod, but with slightly less sensitive data | Railway environment variables            | Limited access - QA and DevOps team           |
| **Prod**      | Live Application                        | Similar to Staging, potentially with hardened values | Railway environment variables            | Restricted to DevOps team, monitoring systems |


**III. Railway Secrets Management:**

* **Railway's Native Secret Management:** Railway provides a built-in, secure mechanism for managing secrets.  This is *the* recommended approach for Deuce Diary.
* **Adding Secrets:**
    *  Navigate to your Railway app.
    *  Go to the "Secrets" section.
    *  Add secrets for each environment (Dev, Staging, Prod).  This includes database credentials, API keys, and any other sensitive information.
* **Security Best Practices for Railway Secrets:**
    * **Never commit secrets to version control!** Railway handles this securely.
    * **Restrict access to the Railway dashboard.** Use strong authentication and two-factor authentication (2FA).
    * **Regularly review secrets.**  Remove or update secrets that are no longer needed.


**IV. Expo Secrets Management:**

* **Expo Secrets API:** Expo provides an API for accessing secrets specifically for Expo applications. This is essential for secrets like API keys for third-party integrations within the Expo app.
* **Configuration:**
    * **Generate a Secret:**  Within your Expo project, generate a unique secret using `expo secrets config`. This will output a JSON object containing the secret.
    * **Accessing the Secret:** Access the secret in your Expo code using `expo secrets.get("YOUR_SECRET_NAME")`.
* **Railway Integration (Recommended):**  Store the Expo secret within Railway as a standard environment variable.  This centralizes all secrets and allows for easier management.  You'll still access it through Expo Secrets API, but the secret itself is secured by Railway.
* **Security Considerations:**
    *  The Expo Secrets API is inherently more secure than directly embedding secrets in your code.
    *  Treat Expo secrets with the same level of caution as other sensitive information.



**V. Secrets Rotation Policy:**

* **Frequency:**  Implement a rotation frequency based on sensitivity and risk.  Consider these guidelines:
    * **High-Risk Secrets (Database Credentials, API Keys):**  Rotate every 30-60 days.
    * **Low-Risk Secrets (Debug Keys):** Rotate every 90-180 days.
* **Rotation Process:**
    * **Automated Rotation (Preferred):** Utilize tools or frameworks to automate the secret rotation process. Railway, for example,
