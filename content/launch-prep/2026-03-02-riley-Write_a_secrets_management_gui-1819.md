# Write a secrets management guide for Deuce Diary: environmen
Agent: riley
Generated: 2026-03-02T18:19:22.016805

## Deuce Diary: Secrets Management Guide - Dev/Staging/Prod & Railway/Expo Secrets

This guide outlines a robust secrets management strategy for Deuce Diary, covering environment variables across different environments (Dev/Staging/Prod), Railway-specific secrets, Expo secrets, and a crucial rotation policy. Prioritizing security and maintainability is key.

**I. Environment Variable Strategy - Dev/Staging/Prod**

* **Principle:**  Treat each environment as a distinct, isolated system. Avoid hardcoding secrets directly into your code.
* **Shared Secrets Repository:** Utilize a centralized, secure repository for all environment variables.  This could be:
    * **HashiCorp Vault:**  The gold standard for robust secrets management, offering encryption, access control, and auditing. (Recommended for Production)
    * **AWS Secrets Manager/Parameter Store:**  Well-integrated with AWS services, offering ease of use and scalability.
    * **Google Cloud Secret Manager:** Similar to AWS, but for Google Cloud environments.
    * **A dedicated Git repository (with restricted access):**  Only appropriate for Dev/Staging – requires meticulous access control and CI/CD integration. *Do NOT store actual secrets here.* Instead, store *references* to the secrets in the secret management service.
* **Environment-Specific Configurations:**
    * **Dev:**  Use a simplified configuration, perhaps with dummy values for things like API keys and database connection strings.  Focus on developer experience.
    * **Staging:** Closer to Prod, but still less critical.  Use real-but-low-impact values.
    * **Prod:**  The most secure and accurate configurations.  This should be the source of truth.
* **CI/CD Integration:**  Automate the deployment of environment variables via your CI/CD pipeline.  This ensures consistency and reduces the risk of manual errors.

**II. Railway Env Vars**

* **Railway's Built-in Secrets:** Railway provides a streamlined interface for managing environment variables directly within your project's settings. This is a *good starting point* for Dev/Staging.
* **Best Practices for Railway:**
    * **Avoid hardcoding in codebase:**  Always define variables using Railway's interface.
    * **Use Railway's Secret Scanning:**  Railway offers secret scanning to identify potential vulnerabilities in your secrets.
    * **Revoke Secrets Regularly:**  Don’t just set them and forget them. (See Rotation Policy below)
* **Advanced Management (for Production):** For critical production secrets, strongly consider migrating to a more robust solution like HashiCorp Vault or AWS Secrets Manager.

**III. Expo Secrets**

* **Expo Secrets API:** Expo provides a secure API for accessing sensitive information like API keys and bundle identifiers. This is the *primary* method for handling secrets within your Expo app.
* **Key Considerations:**
    * **Never commit secrets directly to Git:**  The Expo Secrets API handles the secure retrieval of secrets during build time.
    * **Generate Unique Secrets:**  Each Expo app instance should have a unique secret.
    * **Secure the Secret Key:**  Protect the key used to sign the Expo Secrets API requests.  This is often managed by Expo itself, but ensure it’s not compromised.
* **Configuration:**  Configure the Expo Secrets API in your `app.json` or `app.config.js` file.
    ```json
    {
      "expo": {
        "secret": "YOUR_UNIQUE_EXPO_SECRET_KEY"
      }
    }
    ```

**IV. Rotation Policy**

* **Importance:** Secrets become compromised over time.  A rotation policy is *essential* for mitigating risk.
* **Frequency:**
    * **Dev:**  Every
