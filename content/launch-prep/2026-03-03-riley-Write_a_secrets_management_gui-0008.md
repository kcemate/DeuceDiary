# Write a secrets management guide for Deuce Diary: environmen
Agent: riley
Generated: 2026-03-03T00:08:11.753541

## Deuce Diary: A Secrets Management Guide

This guide outlines best practices for managing secrets across the various environments you'll encounter when developing and deploying your Deuce Diary app, specifically focusing on Dev, Staging, Production, Railway environment variables, Expo secrets, and a rotation policy.

**I. Understanding Your Secrets Landscape**

Deuce Diary, as a mobile app, relies on a variety of secrets to function correctly. These include:

* **API Keys:**  For accessing third-party services (e.g., Google Maps, database connections).
* **Database Credentials:**  Username, password, and connection strings for your backend database.
* **Authentication Keys:** For user authentication and authorization.
* **Firebase Configuration:** API keys and project IDs for Firebase services.
* **Serverless Function Secrets:**  Secrets used by your serverless functions (e.g., AWS Lambda, Netlify Functions).
* **Expo Secrets:** Unique identifiers and configuration specific to each device/user.


**II. Environment Variable Management**

This is the foundation for consistent secrets across all environments.

* **Dev Environment:**
    * **Local Development:** Use a `.env` file (with libraries like `dotenv`) to manage secrets locally.  **DO NOT** commit this file to your repository.
    * **Example `.env.example`:**
        ```
        API_KEY=dev-api-key
        DATABASE_URL=localhost:5432
        FIREBASE_API_KEY=dev-firebase-api-key
        ```
* **Staging Environment:**
    * **Railway Environment Variables:** Railway offers a straightforward way to set environment variables.  Create a Railway environment and add all the secrets here, ensuring appropriate security permissions.
    * **Centralized Configuration:** Treat the staging environment as a close-to-production replica.  Use similar variable names to the production environment.
* **Production Environment:**
    * **Railway Environment Variables (Preferred):**  Railway's environment variable system is ideal for production.  Configure securely and rotate periodically.
    * **Cloud Provider Secrets Manager (Recommended for Complex Systems):** For more sophisticated applications, consider using a cloud provider's secrets manager (e.g., AWS Secrets Manager, Azure Key Vault, Google Cloud Secret Manager) to store and manage your secrets.  These offer features like auditing, versioning, and rotation.



**III. Railway Environment Variables Specifics**

* **Security:**  Railway's interface provides granular permission control.  Restrict access to environment variables based on roles and teams.
* **Variable Types:**  Railway supports various data types for environment variables (string, number, boolean, array, object).
* **Secrets Injection:** Railway allows you to inject secrets directly into your running service's environment by using a dedicated section in the service’s configuration. This is typically for sensitive data.

**IV. Expo Secrets**

Expo secrets are critical for identifying and distinguishing your application across different devices and users.

* **What they are:**  Unique, randomly generated strings that are stored within the Expo SDK.
* **Use Cases:**
    * **User Identification:**  Associate users with their specific device to track usage and personalize experiences.
    * **Device Identification:**  Identify a device for analytics or device-specific configuration.
    * **Platform-Specific Configurations:**  Enable different behaviors or settings based on the device platform (e.g., iOS vs. Android).
* **Generation:** Generate these secrets directly within the Expo SDK using the `expo-constants` library:
    ```javascript
    import * as Constants from 'expo-constants';

    const uniqueSecret = Constants.expoConfig.secrets.uniqueId;
    console.log(uniqueSecret);
    ```
* **Secure Storage:** *Never* hardcode
