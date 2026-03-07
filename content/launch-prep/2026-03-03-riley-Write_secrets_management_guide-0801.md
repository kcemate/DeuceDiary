# Write secrets management guide across environments.
Agent: riley
Generated: 2026-03-03T08:01:50.701557

## Secrets Management Guide: Across Environments

This guide outlines a best-practice approach to managing secrets across different environments – Development, Staging, and Production – ensuring security, consistency, and operational efficiency.

**I. Core Principles**

* **Principle of Least Privilege:** Users and systems should only have access to the secrets they absolutely need to perform their tasks.
* **Separation of Duties:**  Implement processes to prevent a single person from having complete control over secrets.
* **Immutable Infrastructure:** Leverage infrastructure-as-code (IaC) to define and manage environments, minimizing manual configuration and human error.
* **Centralized Management:** Maintain a single source of truth for secrets, providing control, auditability, and efficient updates.
* **Automation:** Automate secret rotation, provisioning, and access control wherever possible.
* **Monitoring & Auditing:** Track secret access, usage, and changes for security and operational insights.


**II. Environment-Specific Strategies**

| Environment  | Primary Focus        | Secrets Management Tool | Key Considerations                               | Access Control                               | Rotation Strategy               |
|--------------|-----------------------|--------------------------|---------------------------------------------------|--------------------------------------------|------------------------------------|
| **Development** | Rapid Iteration & Testing | HashiCorp Vault (Dev), AWS Secrets Manager, Azure Key Vault (Dev) | High risk of accidental exposure.  Use temporary secrets.  Frequent testing is key. | Limited access, primarily by developers. | Daily/Weekly – Short-lived credentials. |
| **Staging**     | Pre-Production Testing | HashiCorp Vault (Staging), AWS Secrets Manager, Azure Key Vault (Staging) | Higher security requirements than development.  Simulate Production environment closely. | Controlled access by testers, DevOps.     | Weekly – Medium-lived credentials. |
| **Production** | Live Application Operation | HashiCorp Vault (Prod), AWS Secrets Manager, Azure Key Vault (Prod) | Highest security standards.  Automated processes.  Strict access control. | Limited access – only authorized personnel. | Monthly/Quarterly – Long-lived credentials, automated rotation. |


**III.  Tooling Recommendations & Integration**

* **HashiCorp Vault:**  A robust, versatile secrets management solution offering encryption, access control, and dynamic secret generation.  Excellent for all environments.
* **AWS Secrets Manager:** Managed secrets service within AWS, integrates seamlessly with other AWS services.  Suitable for AWS-centric environments.
* **Azure Key Vault:** Microsoft’s equivalent, provides secure storage for secrets, certificates, and keys. Integrated with Azure services.
* **Google Cloud Secret Manager:** Google’s solution, similar capabilities to AWS and Azure. Integrates with Google Cloud Platform.
* **Infrastructure-as-Code (IaC):** Tools like Terraform, CloudFormation, and Azure Resource Manager should be used to provision and manage environments, incorporating secrets securely.

**IV. Secret Types & Storage**

* **Credentials (Passwords, API Keys):** Store as encrypted strings.
* **Certificates:**  Securely store and manage TLS/SSL certificates.
* **Connection Strings:**  Protect database connection information.
* **Configuration Data:**  Store environment-specific configuration settings.
* **SSH Keys:** Use short-lived SSH keys and manage their lifecycle.

**V. Workflow & Processes**

1. **Secret Creation:**
   * Define secret metadata (name, description, environment, purpose).
   * Generate secrets using tools like `openssl` or dedicated secret generation services.
   * Immediately encrypt secrets using the chosen tool.
2. **Secret Storage:**
   * Upload encrypted secrets to the designated secrets management tool for the target environment.
3. **Secret Access & Usage:**
   * Programmatically retrieve secrets using appropriate libraries and SDKs.
