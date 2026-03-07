# Write a security checklist for an Express + React app launch
Agent: jordan
Generated: 2026-03-02T22:28:19.267038

## Security Checklist: Express + React Production Launch

This checklist covers key security considerations for launching your Express + React application to production, aligning with the OWASP Top 10 and incorporating best practices.

**I. General Security & Configuration (Apply to both Backend & Frontend)**

* **Secure Development Environment:**
    * [ ] **Secure Coding Practices:** Implement secure coding standards and training for your development team.
    * [ ] **Regular Code Reviews:** Mandatory peer code reviews focusing on security vulnerabilities.
    * [ ] **Static Analysis:** Utilize static analysis tools (e.g., ESLint with security plugins, SonarQube) to identify potential issues during development.
    * [ ] **Dependency Management:**
        * [ ] Regularly update all dependencies to the latest patched versions.
        * [ ] Use a dependency management tool (npm, yarn) effectively.
        * [ ] Scan dependencies for vulnerabilities using tools like Snyk or OWASP Dependency-Check.
* **Infrastructure Security:**
    * [ ] **Secure Server Configuration:** Use a secure server environment (e.g., AWS EC2, Google Compute Engine, DigitalOcean) with appropriate firewall rules.
    * [ ] **Regular Security Audits:** Conduct periodic security audits of the infrastructure and code.
    * [ ] **Logging & Monitoring:**  Implement robust logging and monitoring for all application components.  Set up alerts for suspicious activity.
    * [ ] **Secrets Management:** Use a dedicated secrets management solution (e.g., HashiCorp Vault, AWS Secrets Manager) to store sensitive information (API keys, database credentials). *Never* hardcode secrets in your codebase.


**II. OWASP Top 10 & Mitigation Strategies**

| OWASP Top 10 Category | Potential Risk                               | Mitigation Strategies                                                              |
|-----------------------|---------------------------------------------|------------------------------------------------------------------------------------|
| **A1: Injection**      | SQL Injection, Command Injection, XSS         | Input Sanitization, Parameterized Queries, Output Encoding, Use a secure ORM.        |
| **A2: Broken Authentication** | Weak Passwords, Session Management Issues    | Multi-Factor Authentication (MFA), Strong Password Policies, Secure Session Management,  JWT Best Practices. |
| **A3: Sensitive Data Exposure** | Exposed Sensitive Information (PII, API Keys) | Encryption at Rest & in Transit, Access Control, Data Masking, Tokenization, Limit Data Retention |
| **A4: XML External Entities (XXE)** | Malicious XML Input                          | Input Validation, Disable External Entities Processing, Use a secure XML parser. |
| **A5: Broken Access Control** | Unauthorized Access to Resources          | Robust Access Control Mechanisms, Least Privilege Principle,  Role-Based Access Control (RBAC). |
| **A6: Security Misconfiguration** | Default Credentials, Unnecessary Services | Hardened Configurations, Disable Unused Features, Regular Security Scans.      |
| **A7: Vulnerable and Outdated Components** | Use of Known Vulnerable Software            | Regular Patching, Software Composition Analysis (SCA), Dependency Management.   |
| **A8: Identification and Authentication Issues** | Incorrect Authentication Schemes     | Implement Secure Authentication Protocols,  Proper User ID Management.        |
| **A9: Software and Data Integrity Issues** | Tampered Code or Data                         | Code Signing, Data Integrity Checks (checksums), Version Control.                      |
| **A10: Security Logging and Monitoring Issues** | Lack of Logging & Monitoring               | Centralized Logging, Real-Time Monitoring, Incident Response Plan.                 |



**III. React Frontend Specific Considerations**

* **XSS Prevention:**
    * [ ] Use a React library like `dangerously-include-html` with extreme caution, and prefer
