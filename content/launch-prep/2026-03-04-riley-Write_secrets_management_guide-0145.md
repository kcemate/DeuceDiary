# Write secrets management guide across environments.
Agent: riley
Generated: 2026-03-04T01:45:36.178164

## Secrets Management Guide Across Environments

This guide outlines best practices for managing secrets across different environments – Development, Testing/Staging, and Production – focusing on security, automation, and compliance.

**I. Core Principles & Goals:**

* **Least Privilege:** Grant access to secrets only to those who absolutely need them, and only at the necessary level.
* **Automation:** Automate the delivery and rotation of secrets to minimize manual errors and human intervention.
* **Centralized Management:** Use a central secret management solution for consistent policies and auditing.
* **Immutable Secrets:** Treat secrets as code - version controlled, never directly embedded in code or infrastructure.
* **Monitoring & Auditing:** Continuously monitor secret usage and audit changes for security breaches or misconfigurations.

**II. Environments & Recommended Practices:**

**A. Development Environment:**

* **Purpose:** Used by developers for building, testing, and early experimentation.
* **Secrets Management Solution:**
    * **Recommended:** HashiCorp Vault (Free Tier), AWS Secrets Manager, Azure Key Vault (Dev/Test Tier).
    * **Lower-Cost Options:** Environment variables (for simple secrets, not recommended for sensitive data).
* **Secret Types:**
    * **Database Credentials:** Development database passwords.
    * **API Keys:**  Staging API keys for testing integrations.
    * **Configuration Secrets:**  Environment-specific configuration values (e.g., debug mode settings).
* **Rotation:**  Frequent rotation (daily or weekly) for development environments.
* **Access Control:** Developers should have individual access keys.
* **Automation:** Use scripts and CI/CD pipelines to inject secrets automatically.


**B. Testing/Staging Environment:**

* **Purpose:** Mimics the production environment for thorough testing and pre-production validation.
* **Secrets Management Solution:**  Same as Production (e.g., HashiCorp Vault, AWS Secrets Manager, Azure Key Vault).
* **Secret Types:**
    * **Database Credentials:** Staging database passwords.
    * **API Keys:** Production-like API keys for more realistic testing.
    * **Configuration Secrets:** Production-like configuration values.
* **Rotation:**  Weekly or bi-weekly rotation.
* **Access Control:**  Limited to QA, DevOps, and testing teams.
* **Automation:**  Automated deployments, including secret injection, are crucial.  Integrate with testing frameworks.



**C. Production Environment:**

* **Purpose:** The live, operational environment serving end-users.
* **Secrets Management Solution:**
    * **Recommended:** HashiCorp Vault (Enterprise), AWS Secrets Manager, Azure Key Vault (Production Tier).
* **Secret Types:**
    * **Database Credentials:** Production database passwords.
    * **API Keys:** Production API keys.
    * **Configuration Secrets:** Production configuration values.
    * **Certificates:** TLS/SSL certificates.
* **Rotation:**  Implement automated rotation policies based on risk assessment (typically weekly or monthly).
* **Access Control:**  Strict access control based on the principle of least privilege. Separate roles for different teams (e.g., operations, security).
* **Automation:** Fully automated deployment pipelines with secret injection, built-in monitoring and alerts for compromise.
* **Auditing & Logging:** Comprehensive logging of all secret access and modifications.  Regularly review audit logs.

**III.  Key Technologies & Strategies:**

* **HashiCorp Vault:** A leading secrets management platform offering dynamic secrets, credential management, and policy enforcement.
* **AWS Secrets Manager/Parameter Store:** AWS’s native secrets management services, tightly integrated with other AWS services.
* **Azure Key Vault:**  Microsoft's cloud-based secrets management service.
* **CI/CD Integration:** Integrate secrets management with your
