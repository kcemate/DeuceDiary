# Write a security checklist for an Express + React app launch
Agent: jordan
Generated: 2026-03-02T23:24:01.324296

Okay, here's a comprehensive security checklist for launching an Express + React app to production, incorporating the OWASP Top 10, CSP headers, rate limiting, input sanitization, and authentication hardening. This is a starting point; you'll need to adapt it to your specific application and environment.

**I.  General Security Practices & Environment Setup**

*   **Secure Development Environment:**
    *   Use a managed CI/CD pipeline (e.g., GitHub Actions, GitLab CI, Jenkins) with automated security scans.
    *   Code reviews are mandatory for all changes.
    *   Regular security training for the development team.
*   **Infrastructure as Code (IaC):** Automate infrastructure provisioning to ensure consistency and reduce manual configuration errors.  Terraform, CloudFormation, etc.
*   **Principle of Least Privilege:**  Grant only the necessary permissions to users and services.
*   **Monitoring & Logging:**  Implement robust monitoring and logging across all layers (client, server, database) to detect and respond to security incidents.  Centralized logging is crucial.
*   **Vulnerability Scanning:** Integrate automated vulnerability scanning into your CI/CD pipeline (e.g., Snyk, OWASP ZAP).
*   **Static Code Analysis:** Use tools like ESLint, SonarQube to identify potential vulnerabilities and coding issues.
*   **Secrets Management:** *Never* hardcode API keys, database passwords, or other sensitive information directly into the codebase. Use a secrets management system (e.g., HashiCorp Vault, AWS Secrets Manager, Azure Key Vault, Google Cloud Secret Manager) and manage these securely.
*   **Regular Security Audits:** Conduct periodic security audits, both internal and potentially by a third-party.


**II. OWASP Top 10 Mitigation**

| **OWASP Top 10 Threat** | **Mitigation Steps**                                                                                                                                                                                                                                               |
| :------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **A1: Injection**         | *   **Input Validation & Sanitization:** Rigorous validation on *all* user input, using whitelisting instead of blacklisting. Escape data before rendering it in the UI or using it in queries.  Parameterized queries for database interactions.  Use libraries designed to prevent injection attacks. |
| **A2: Broken Authentication** | *   **Multi-Factor Authentication (MFA):**  Implement MFA for all users, especially administrative accounts. *   **Strong Password Policies:** Enforce strong password requirements (length, complexity). *   **Rate Limiting:** Protect login endpoints. *   **Session Management:** Secure session tokens (HTTP-only, secure cookies). *   **Account Lockout:** Implement account lockout after failed login attempts.    |
| **A3: Sensitive Data Exposure**| *   **Data Encryption:** Encrypt sensitive data at rest (database) and in transit (HTTPS). *   **Data Masking/Tokenization:** Mask or tokenize sensitive data where appropriate. *   **Secure Storage:**  Ensure secure storage for sensitive data.   *   **Data Minimization:** Only collect and store the data that is absolutely necessary. |
| **A4: XML External Entities (XXE)** | *   **Disable External Entity Processing:** Configure XML parsers to disable external entity processing. (Relatively less common in modern apps but important to consider if using XML)                                                                                             |
| **A5: Broken Access Control**| *   **Role-Based Access Control (RBAC):** Implement RBAC to control user access to resources. *   **Authorization Checks:** Validate user permissions *before* granting access to any resource. *   **Avoid Implicit Trust:** Never trust the client-side to determine
