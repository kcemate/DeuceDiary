# Write secrets management guide across environments.
Agent: riley
Generated: 2026-03-04T11:34:59.074197

## Secrets Management Guide: Across Environments

This guide outlines best practices for managing secrets across different environments – Development, Staging, and Production – focusing on security, automation, and auditability.

**I. Core Principles:**

* **Least Privilege:** Grant access to secrets only to those who absolutely need it, and for the shortest possible duration.
* **Separation of Concerns:** Maintain distinct secrets management strategies for each environment, reflecting their risk profiles and operational requirements.
* **Automation:** Leverage automation tools to reduce manual errors, improve consistency, and streamline deployments.
* **Auditing & Monitoring:**  Track all secret access, modifications, and usage to ensure accountability and detect potential breaches.
* **Immutable Infrastructure:** Whenever possible, design systems with immutable infrastructure, minimizing the need to directly manage secrets on servers.

**II. Environment-Specific Strategies:**

**A. Development Environment:**

* **Purpose:**  Used by developers for experimentation, local development, and unit testing.  Risk level is relatively low.
* **Tools:**
    * **Password Managers:** (e.g., LastPass, 1Password) - Suitable for storing simple credentials like API keys and database passwords.
    * **Environment Variables:** Within the application code itself (for smaller applications and simpler setups).
    * **HashiCorp Vault (Lightweight):** Can be used for simple secret storage and rotation in a development setting.
* **Secret Types:** API keys, database credentials (for local development databases), testing secrets.
* **Rotation:** Manual, frequent rotation (e.g., weekly) driven by developers.
* **Access Control:** Developers with individual access.
* **Audit:** Primarily focused on developer activity and secret usage.


**B. Staging Environment:**

* **Purpose:**  Mirrors the production environment for testing, integration, and user acceptance testing (UAT). Risk level is medium.
* **Tools:**
    * **HashiCorp Vault:**  The recommended choice for storing and managing secrets in staging.
    * **Infrastructure as Code (IaC) Secrets:**  Storing secrets directly within IaC templates (e.g., Terraform, CloudFormation) – requires careful access control.
* **Secret Types:** API keys, database credentials (for staging databases), certificates, configuration secrets.
* **Rotation:** Scheduled rotation (e.g., bi-weekly or monthly) managed by DevOps teams.
* **Access Control:** Limited to DevOps, QA, and UAT team members.
* **Audit:**  Detailed audit trails, including access attempts, modifications, and usage patterns. Integration with monitoring tools.


**C. Production Environment:**

* **Purpose:**  Live, operational environment serving end-users. Highest risk level.
* **Tools:**
    * **HashiCorp Vault (Production Grade):** Essential for securely storing and managing all production secrets.
    * **Secrets Injection at Runtime (with Vault):** Using Vault’s mechanisms to inject secrets directly into running applications without hardcoding them.
    * **Kubernetes Secrets (with Vault):**  Vault can be used to manage Kubernetes secrets for enhanced security.
* **Secret Types:** All secrets – API keys, database credentials, certificates, configuration secrets, TLS certificates, service account credentials.
* **Rotation:** Automated, frequent rotation (e.g., daily or hourly) based on risk assessment and regulatory requirements.
* **Access Control:**  Strict access control, often involving multiple roles and approval processes.
* **Audit:**  Real-time monitoring and logging, including access attempts, modifications, and usage patterns.  Integration with security information and event management (SIEM) systems.

**III.  General Best Practices (Across All Environments):**

* **Centralized Management:**  Utilize a central secrets management system (e.g., HashiCorp Vault
