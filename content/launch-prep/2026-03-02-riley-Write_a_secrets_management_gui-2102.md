# Write a secrets management guide for Deuce Diary: environmen
Agent: riley
Generated: 2026-03-02T21:02:44.123180

## Deuce Diary: Secrets Management Guide - Dev, Staging, Prod & Beyond

This guide outlines best practices for managing secrets within your Deuce Diary project, covering environment variables, Railway integration, Expo secrets, and a rotating policy to ensure security and maintainability.

**I. Core Principles: The Why Behind Secrets Management**

* **Security First:**  Secrets (API keys, database passwords, authentication tokens) are critical to your application's functionality and security. Exposure can lead to severe breaches.
* **Environment-Specific Configuration:** Secrets *should not* be hardcoded into your codebase. They need to be tailored to each environment (Dev, Staging, Production).
* **Version Control Avoidance:**  Never commit secrets to your repository!
* **Least Privilege:** Grant only the necessary access for each service to function.

**II. Environment Variables - The Foundation**

* **Concept:** Environment variables are key-value pairs that provide configuration information to your application at runtime.
* **Dev/Staging:**
    * **Source:**  Use a simple tool like `dotenv` (for local development) or configuration management tools (like Ansible) for consistency in staging.
    * **Storage:** Store these in a dedicated secrets management solution (explained in detail below) – this is crucial.
    * **Naming Convention:** Use clear, descriptive names (e.g., `DEUCE_DIARY_DATABASE_URL`, `DEUCE_DIARY_API_KEY`). Prefix with `DEUCE_DIARY_` for easier identification.
* **Production:**
    * **Railway Variables:** Railway’s built-in environment variable feature is your primary mechanism for Production.  This is the most robust and recommended approach.
    * **Secure Storage:** Always use Railway's secrets store or a dedicated secret management solution.


**III. Railway Environment Variables - Your Production Hub**

* **Railway’s Secrets Store:** Railway's default secrets store is the BEST place to manage Production secrets.
* **Adding Variables:**
    * **Railway Dashboard:**  Navigate to your app's Railway dashboard, then go to "Environment Variables".
    * **Define Variables:** Add your environment variables here, setting the appropriate values for your Production deployment.
    * **Security:** Railway automatically encrypts your secrets at rest and in transit.
* **Railway CLI:** You can also manage variables via the Railway CLI.
* **Best Practices:**
    * **Label Variables:** Use labels (e.g., `environment: production`) to quickly filter variables based on your deployment environment.
    * **Regular Review:**  Periodically review your Railway variables to ensure they're still valid.



**IV. Expo Secrets - Local Development & Specific Expo Features**

* **Purpose:** Expo secrets are specifically designed for managing secrets related to Expo-managed apps (e.g., Firebase, App Center).
* **Access:** Accessed through the Expo CLI.
* **Usage:**
    * `expo secrets list` - Lists available secrets.
    * `expo secrets get <secret-name>` - Retrieves the value of a specific secret.
    *  **Don't commit these secrets to your repository!** Use them exclusively during development.
* **Common Secrets:**
    * `FIREBASE_API_KEY`, `FIREBASE_MESSAGING_SENDER_ID`, `FIREBASE_PROJECT_ID`, etc.
    *  Secrets relevant to App Center or other services integrated via Expo.


**V. Secrets Rotation Policy – Critical for Long-Term Security**

* **Why Rotate?** Secrets become compromised over time, and rotating them reduces the impact of a potential breach.
* **Recommended Frequency:**
    * **Production:** Quarterly or whenever a significant change occurs (e.g., new service integration, infrastructure
