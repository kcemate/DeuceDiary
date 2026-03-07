# Write a secrets management guide for Deuce Diary: environmen
Agent: riley
Generated: 2026-03-02T22:35:19.603967

## Deuce Diary: Secrets Management Guide - Dev, Staging, Prod, Railway & Expo

This guide outlines a robust secrets management strategy for your Deuce Diary project, covering environment variables and incorporating best practices for Dev, Staging, Production, Railway integration, Expo secrets, and a rotation policy.

**I. Core Principles**

* **Principle of Least Privilege:** Only grant necessary access to secrets.
* **Separation of Concerns:** Keep secrets separate from code.
* **Automation:** Automate secrets management whenever possible.
* **Monitoring & Auditing:** Track secret usage and access.

**II. Environment Variables - Across Environments**

| Environment | Variables | Storage | Management |
|---|---|---|---|
| **Dev** | `API_KEY_DEV`, `DATABASE_URL_DEV`, `SENDGRID_API_KEY_DEV`, `DEBUG_MODE` |  Local `.env` files or a Dev-specific environment variable service. |  Manual entry. Good for quick experimentation. |
| **Staging** | `API_KEY_STG`, `DATABASE_URL_STG`, `SENDGRID_API_KEY_STG` |  Similar to Dev – `.env` or a dedicated Staging service. |  Manual entry or, ideally, synced with Dev. |
| **Prod** | `API_KEY_PROD`, `DATABASE_URL_PROD`, `SENDGRID_API_KEY_PROD` | **Railway Environment Variables** – the *primary* method for Prod. | See Section IV – Railway Integration. |

**III. Railway Environment Variables**

Railway is highly recommended for Prod and increasingly useful for Staging. 

* **Using Railway’s Built-in Feature:** Railway automatically handles secret management for you when you set environment variables within the Railway dashboard.
* **Storing Sensitive Data:**  All keys (API Keys, Database URLs, etc.) should be stored here.
* **Security Best Practices:**
    * **Never commit secrets to your codebase.**
    * **Regularly review and update variables.**
    * **Consider Railway’s Secret Management for Enhanced Security (for higher-risk secrets).** This offers more granular control and audit trails.


**IV. Expo Secrets (For Expo Go & Web)**

Expo secrets are *critical* for apps using Expo Go and web builds.  Never hardcode sensitive data in your Expo project.

* **Expo Secrets Plugin:** Utilize the official [Expo Secrets Plugin](https://github.com/expo/expo-secrets) for secure storage.  This plugin encrypts secrets locally on the device.
* **Configuration:**
    * Install the plugin: `npx expo install expo-secrets`
    * Generate a secrets file: `npx expo secrets install`  (This creates a `.secrets` file in your project).
    * **Secure the `.secrets` file:** This file *must* be kept secure!  Never commit it to version control.
* **Accessing Secrets:** Use `expo-secrets` API to access secrets in your components.
    ```javascript
    import * as Secrets from 'expo-secrets';

    async function loadSecrets() {
      try {
        await Secrets.init(); // Initializes the secrets module
        const apiKey = Secrets.getString('API_KEY');
        console.log('API Key:', apiKey);
      } catch (e) {
        console.log(e);
      }
    }
    ```
* **Expo Web Build:**  Expo Secrets will automatically handle the web build when you use the Expo SDK.

**V. Secret Rotation Policy**

A robust rotation policy is vital for minimizing the impact of compromised secrets.

* **Frequency:**
    * **Short-lived Secrets (API Keys, Send
