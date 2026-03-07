# Write a secrets management guide for Deuce Diary: environmen
Agent: riley
Generated: 2026-03-03T01:22:22.114559

## Secrets Management Guide for Deuce Diary

This guide outlines a robust secrets management strategy specifically tailored for Deuce Diary, covering environment variables across dev/staging/prod environments, Railway environment variables, Expo secrets, and a rotation policy.  This approach prioritizes security, maintainability, and simplifies deployments.

**I. Core Principles**

* **Least Privilege:** Grant access to secrets only to those who absolutely need it.
* **Separation of Concerns:**  Maintain clear distinctions between environments and their respective secrets.
* **Automation:** Automate the process of storing, retrieving, and rotating secrets whenever possible.
* **Auditing:** Track access and changes to secrets for security and compliance.

**II. Environment Variables Across Environments**

| Environment | Purpose            | Secret Storage | Key Examples                               |
|-------------|--------------------|----------------|---------------------------------------------|
| **Dev**      | Local Development  | `process.env`  | `API_BASE_URL`, `DATABASE_URL`, `DEBUG`     |
| **Staging**  | Pre-Production Testing | Railway Env Vars | `API_BASE_URL`, `DATABASE_URL`, `STRIPE_SECRET_KEY` |
| **Prod**     | Live Production     | Railway Env Vars | `API_BASE_URL`, `DATABASE_URL`, `STRIPE_SECRET_KEY`, `SENDGRID_API_KEY` |

**III. Railway Environment Variables**

Railway is our preferred deployment platform, and its environment variables are crucial for configuration.

* **Railway Dashboard:**  Manage all environment variables directly within the Railway Dashboard UI.
* **Dedicated Variable Groups:** Organize variables logically – e.g., `database`, `api`, `payments`.
* **Security Best Practices:**
    * **Never commit secrets directly to Git.**
    * **Use strong, unique secrets.**  Employ random password generators if necessary.
    * **Restrict access to the Railway Dashboard** (single admin user).
* **Environment Configuration:** Utilize Railway's environment configuration to define settings based on the environment (dev, staging, prod).  This allows for environment-specific customizations without changing code.


**IV. Expo Secrets (If Applicable)**

If your Deuce Diary components utilize Expo, managing secrets within the Expo Secrets system is recommended.

* **Expo Secrets File:** Create a `secrets.json` file in your project's root directory.
* **Content:** This file should contain key-value pairs of secrets, each with a unique name.  Example:
   ```json
   {
     "API_KEY": "your-api-key-here",
     "DATABASE_URL": "your-database-url-here"
   }
   ```
* **Expo Development Tools:**  The Expo Development Tools automatically inject these secrets into your development environment, allowing you to access them in your code.
* **Security:** Similar to Railway, never commit this file to version control.  Store it securely.



**V. Rotation Policy**

A robust secrets rotation policy is critical for minimizing the impact of compromised secrets.

* **Frequency:**
    * **High-Risk Secrets (e.g., API keys, Stripe keys):** Rotate *weekly* or even *daily* depending on risk assessment.
    * **Medium-Risk Secrets (e.g., Database credentials):** Rotate *monthly*.
    * **Low-Risk Secrets (e.g., Debug keys):** Rotate *quarterly*.
* **Automation:**  Automate the secret generation and replacement process as much as possible.
* **Testing:** Implement automated tests to ensure functionality after secret rotation.  This should include simulating API calls and database queries.
* **Rollback Plan:**  Have a clear rollback plan in case the rotation process introduces unforeseen issues.
