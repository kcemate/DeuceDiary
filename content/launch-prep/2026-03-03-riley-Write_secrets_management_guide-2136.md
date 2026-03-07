# Write secrets management guide across environments.
Agent: riley
Generated: 2026-03-03T21:36:25.980210

## Secrets Management Guide Across Environments

This guide outlines a best-practice approach to managing secrets across different environments (Development, Staging, Production), focusing on security, automation, and maintainability.

**I. Core Principles:**

* **Least Privilege:** Grant access to secrets only to those who absolutely need them.
* **Automation:** Automate the delivery and rotation of secrets to minimize manual errors and inconsistencies.
* **Centralized Management:** Implement a single source of truth for secrets, reducing duplication and improving visibility.
* **Auditing & Logging:** Track all access to secrets for accountability and security investigations.
* **Immutable Infrastructure:** Treat secrets as code and leverage infrastructure-as-code practices for consistent deployments.

**II. Environment Breakdown & Specific Strategies:**

| Environment | Key Characteristics | Secrets Management Approach | Tools & Technologies |
|---|---|---|---|
| **Development (Dev)** | Rapid prototyping, experimentation, frequent changes. High tolerance for error. | **Lightweight & Manual:** Focused on developer convenience.  Use for testing and local development. | * **Password Managers:** LastPass, 1Password, Bitwarden (for individual developer secrets) * **Environment Variables:** (for temporary configuration) * **Simple Key Vaults:** HashiCorp Vault (basic usage) * **Note:** Secrets should *never* be hardcoded in code or committed to version control. |
| **Staging (QA/Testing)** | Closely mimics production, used for final testing and user acceptance.  Requires stricter security controls. | **Moderate Automation & Centralization:**  A step up from Dev, enabling more realistic testing. | * **HashiCorp Vault:**  Preferred for managing secrets and credentials. Utilize features like Policy-as-Code and dynamic secrets. * **Infrastructure as Code (IaC):** Terraform, Ansible for provisioning staging environments with securely provisioned secrets. * **CI/CD Integration:**  Automate secret delivery to staging during deployments. |
| **Production (Live)** | Critical infrastructure, requires highest level of security and reliability. | **Highly Automated & Secure:**  Strict controls, continuous monitoring, and robust rotation mechanisms are crucial. | * **HashiCorp Vault:**  Core platform - utilizing features like: * **Dynamic Secrets:**  Generating temporary credentials on demand. * **Secret Rotation:** Automated rotation policies to minimize exposure. * **Role-Based Access Control (RBAC):** Fine-grained permissions for access. * **Key Management Service (KMS):**  Amazon KMS, Azure Key Vault, Google Cloud KMS for managing key encryption. * **CI/CD Integration:**  Automated secret delivery and validation at every stage. * **Monitoring & Alerting:**  Detect suspicious access or configuration changes. |

**III. Detailed Processes & Considerations:**

1. **Secret Creation & Storage:**
   * **Generate Strong Secrets:** Use cryptographically secure random number generators for generating passwords, tokens, and encryption keys.
   * **Centralized Storage:** Store secrets in a dedicated secrets management solution like HashiCorp Vault, AWS Secrets Manager, Azure Key Vault, or Google Cloud Secret Manager.  Avoid storing secrets directly in source code repositories.
   * **Encryption at Rest & Transit:** Encrypt secrets both while stored and during transfer between systems.

2. **Secret Rotation:**
   * **Implement Automated Rotation:** Regularly rotate sensitive credentials like database passwords, API keys, and SSH keys.
   * **Dynamic Secrets:**  Utilize dynamic secrets features in Vault or similar tools to automatically generate temporary credentials.
   * **Rotation Frequency:** Define rotation policies based on risk assessment. Critical secrets should rotate more frequently than less critical ones.

3. **Access Control & Authentication:**
   * **RBAC:** Implement Role-Based Access Control (RBAC) to restrict access to secrets based on user roles and responsibilities.
   * **Multi
