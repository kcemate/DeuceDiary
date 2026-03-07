# Write secrets management guide across environments.
Agent: riley
Generated: 2026-03-05T17:08:14.304188

## Secrets Management Guide Across Environments

This guide outlines a robust approach to managing secrets across different environments – Development, Staging, and Production – focusing on security, automation, and best practices.

**I. Core Principles:**

* **Least Privilege:** Grant access to secrets only to those who absolutely need them and for the minimum duration necessary.
* **Automation:** Automate secret retrieval and provisioning wherever possible to reduce manual errors and improve consistency.
* **Immutable Infrastructure:** Deploy applications with pre-configured secrets rather than embedding them in code.
* **Regular Auditing:** Continuously monitor access and usage of secrets for suspicious activity.
* **Defense in Depth:** Implement multiple layers of security controls, including encryption, access controls, and monitoring.

**II. Environment Specific Strategies:**

**A. Development Environment:**

* **Purpose:** Testing, rapid prototyping, and individual developer experimentation.
* **Secrets Management Solution:**
    * **HashiCorp Vault (Recommended):**  Offers a centralized, secure vault for storing and managing secrets, with granular access control and auditing.
    * **AWS Secrets Manager/Parameter Store:** Simple and cost-effective for smaller projects within the AWS ecosystem.
    * **Azure Key Vault:** Similar to AWS and Google services, providing a managed key vault for Azure environments.
    * **Simple Configuration (for small, non-sensitive secrets):**  Store sensitive data in environment variables within the development environment. **(Discouraged for anything beyond API keys and passwords)**
* **Secret Types:**
    * API Keys
    * Database Passwords
    * Development-specific credentials
* **Access Control:** Individual developer access with strong authentication (MFA).
* **Rotation:**  Regular, but less frequent (e.g., quarterly) rotation of keys, especially for development.
* **Automation:** Developers should be trained on how to retrieve secrets from the chosen solution.

**B. Staging Environment:**

* **Purpose:**  Pre-production testing, integration testing, and user acceptance testing (UAT).  Mirrors Production closely.
* **Secrets Management Solution:**
    * **HashiCorp Vault:** Ideal for staging due to robust access control, audit logging, and integration capabilities.
    * **AWS Secrets Manager/Parameter Store:** Suitable if the staging environment is also within AWS.
    * **Azure Key Vault:** Similar to AWS, best for Azure staging environments.
* **Secret Types:**
    * Production-like API Keys
    * Database Passwords
    * Staging-specific credentials
* **Access Control:** Limited to dedicated testing and QA teams.
* **Rotation:** Frequent rotation of secrets (e.g., weekly or bi-weekly) to minimize exposure during testing.
* **Automation:**  Automated scripts to deploy applications and provision secrets in staging.
* **Testing:** Thoroughly test integrations and deployments using real-world staging secrets.

**C. Production Environment:**

* **Purpose:** Live application operation and serving users.
* **Secrets Management Solution:**
    * **HashiCorp Vault (Strongly Recommended):** Provides the highest level of security, control, and automation for production secrets.
    * **AWS Secrets Manager/Parameter Store:**  Provides a managed service within AWS for managing secrets at scale.
    * **Azure Key Vault:** Best for Azure production deployments.
* **Secret Types:**
    * Production API Keys
    * Database Passwords
    * System Credentials
* **Access Control:** Strict access control based on the principle of least privilege.  Utilize IAM roles and policies for granular control.
* **Rotation:** Automated, frequent rotation of secrets (e.g., daily or weekly) leveraging Vault's features or cloud provider services.
* **Monitoring & Alerting:**  Continuous monitoring of secret access and changes, with alerts for
