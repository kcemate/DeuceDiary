# Write a secrets management guide for Deuce Diary: environmen
Agent: riley
Generated: 2026-03-02T20:08:06.563119

## Secrets Management Guide for Deuce Diary - A Comprehensive Approach

This guide outlines a robust secrets management strategy for Deuce Diary, addressing environment variables across Dev, Staging, and Production environments, Railway integration, Expo secrets, and a rotation policy.  This aims to minimize security risks and streamline deployments.

**I. Core Principles:**

* **Least Privilege:** Grant only the necessary access to secrets.
* **Separation of Concerns:**  Keep secrets separate from code and configuration.
* **Automation:** Automate secrets injection and rotation whenever possible.
* **Monitoring & Auditing:** Track access and changes to secrets.

**II. Environment Variables Across Environments (Dev/Staging/Prod)**

* **Centralized Repository:** Utilize a centralized Git repository (e.g., GitHub, GitLab) for all environment variable configuration files.
* **Environment-Specific Files:**  Create separate files for each environment:
    * `dev.env` – Development environment
    * `staging.env` – Staging environment
    * `prod.env` – Production environment
* **Format:** Use a simple format like JSON or YAML for clarity and ease of parsing. Example (JSON):
   ```json
   {
     "API_URL": "http://dev-api.example.com",
     "DATABASE_URL": "postgresql://user:password@localhost:5432/deuce_diary_dev",
     "NODE_ENV": "development"
   }
   ```
* **Variable Naming Conventions:**  Use consistent naming conventions (e.g., `API_URL`, `DATABASE_URL`) for easy identification and management.
* **Deployment Integration:**  Automate the process of injecting these variables into each environment during deployment.  This should be part of your CI/CD pipeline.


**III. Railway Environment Variables**

* **Railway’s Secret Management:** Railway provides built-in secret management. This is the *preferred* method for managing secrets in Railway deployments.
* **Adding Secrets:**  Within the Railway dashboard for your Deuce Diary app, navigate to the "Secrets" section.  Add each sensitive variable directly through the interface.
* **Key Naming:**  Maintain the same variable names as defined in your `dev.env`, `staging.env`, and `prod.env` files.
* **Accessing Secrets:** Railway automatically injects these secrets into your app's environment during runtime. **Do not hardcode secrets directly into your codebase!**
* **Railway CLI:**  The `railway up` command automatically handles secret injection, simplifying the deployment process.

**IV. Expo Secrets (for Expo Go & Mobile App)**

* **Expo Secrets File:**  Create an `expo` folder at the root of your project.  Inside this folder, create a file named `secrets.js` (or similar).
* **Variable Definition:**  Define your secrets here using JavaScript objects.  For example:
    ```javascript
    module.exports = {
      API_URL: "https://prod-api.example.com",
      FIREBASE_API_KEY: "YOUR_FIREBASE_API_KEY",
      // ... other secrets
    };
    ```
* **Expo Secrets Plugin:** Install the Expo Secrets plugin: `npx expo install expo-secrets`
* **Automatic Injection:** The Expo Secrets plugin automatically injects these secrets into your Expo Go app and your mobile app builds. **Do not expose these secrets in your code!**
* **Security Considerations:**  
    * Keep this file secure. Version control it along with your code.
    * Consider using environment variables within your Expo app to avoid committing secrets to Git. (See below)

**V. Rotation Policy & Best Practices**

* **Regular Rotation
