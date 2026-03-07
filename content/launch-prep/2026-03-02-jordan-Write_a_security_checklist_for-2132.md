# Write a security checklist for an Express + React app launch
Agent: jordan
Generated: 2026-03-02T21:32:47.370676

Okay, here's a comprehensive security checklist for launching an Express + React application to production, incorporating the OWASP Top 10, CSP, rate limiting, input sanitization, and authentication hardening. This is a starting point – you'll need to adapt it to your specific application and threat model.

**I. General Security Practices & Initial Setup**

* **Secure Development Environment:**
    *  Use a consistent development environment (Docker, VMs) to maintain security standards.
    *  Regularly update development tools and dependencies.
    *  Implement code review processes – mandatory for all code changes.
* **Static Code Analysis:**  Integrate tools like ESLint, SonarQube, or Semgrep to identify potential vulnerabilities early.
* **Dependency Management:**
    *  Use a package manager (npm, yarn) properly.
    *  Regularly update all dependencies to the latest secure versions.  Use tools like `npm audit` or `yarn audit`.
    *  Minimize the number of dependencies.  Each adds a potential attack surface.
* **Secrets Management:**  **DO NOT HARDCODE** API keys, database passwords, or other sensitive information into your codebase.
    *  Use environment variables.
    *  Leverage a secrets management solution (HashiCorp Vault, AWS Secrets Manager, Azure Key Vault).
* **Logging & Monitoring:** Implement robust logging at all levels (application, web server, database) to facilitate debugging and security investigations.  Set up monitoring for unusual activity.
* **Regular Backups:**  Establish a reliable backup strategy for your database and application files.

**II. OWASP Top 10 Mitigation**

1. **Injection:**
   * **SQL Injection:** Use parameterized queries or an ORM (like Sequelize or TypeORM) to prevent SQL injection vulnerabilities.
   * **NoSQL Injection:** Employ proper input validation and sanitization for NoSQL databases.
   * **Command Injection:** Avoid constructing shell commands directly from user input. Use safe alternatives.
2. **Broken Authentication:**
   * **Multi-Factor Authentication (MFA):** Implement MFA to add an extra layer of security.
   * **Strong Password Policies:** Enforce strong password requirements.
   * **Session Management:** Use secure session management techniques (HTTPOnly, Secure flags).
   * **Account Lockout:** Implement account lockout after multiple failed login attempts.
3. **Sensitive Data Exposure:**
    * **Data Masking:** Mask or redact sensitive data in logs, error messages, and development environments.
    * **Encryption in Transit:** Use HTTPS (TLS) for all communication.
    * **Encryption at Rest:** Encrypt sensitive data stored in the database and file system.
4. **XML External Entities (XXE):**  If you’re using XML, strictly validate and sanitize XML input to prevent XXE attacks.  Disable external entity resolution in your server.
5. **Broken Access Control:**
   * **Principle of Least Privilege:** Grant users only the necessary permissions.
   * **Role-Based Access Control (RBAC):** Implement RBAC to manage user permissions effectively.
   * **Validate User Input:**  Thoroughly validate all user input to prevent unauthorized access.
6. **Security Misconfiguration:**
   * **Secure Defaults:**  Configure your web server, database, and application framework with secure defaults.
   * **Remove Unnecessary Features:** Disable or remove unused features and services.
   * **Regularly Patch:**  Keep all software components up to date with the latest security patches.
7. **Vulnerable and Outdated Components:**
   * **Dependency Scanning:** Regularly scan your dependencies for vulnerabilities (as mentioned above).
   * **Update Regularly:**  Apply security patches promptly.
8. **Insufficient Logging & Monitoring:**
