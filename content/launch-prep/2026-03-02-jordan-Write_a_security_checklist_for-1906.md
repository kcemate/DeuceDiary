# Write a security checklist for an Express + React app launch
Agent: jordan
Generated: 2026-03-02T19:06:57.384025

Okay, here's a comprehensive security checklist for launching your Express + React app to production, covering the OWASP Top 10, CSP, Rate Limiting, Input Sanitization, and Auth Hardening. This is a starting point – you'll need to tailor it to your specific app's architecture and dependencies.

**I. General Security Practices**

* **Secure Development Lifecycle (SDLC):** Integrate security into *every* stage of development – planning, design, coding, testing, and deployment.
* **Regular Security Audits & Penetration Testing:** Engage a reputable security firm to conduct regular audits and penetration tests.
* **Dependency Management:**  Maintain a strict inventory of all dependencies (Node.js, React, libraries) and regularly update them with the latest security patches. Use a tool like `npm audit` or `yarn audit`.
* **Secrets Management:** *Never* hardcode secrets (API keys, database passwords, etc.) in your code. Use environment variables, a secrets management service (e.g., AWS Secrets Manager, HashiCorp Vault), or a dedicated configuration management system.
* **Logging & Monitoring:** Implement robust logging and monitoring to track errors, suspicious activity, and performance. Set up alerts for critical events.
* **Version Control:**  Use a version control system (Git) to track code changes and facilitate rollback in case of vulnerabilities.

**II. OWASP Top 10 Considerations**

1. **Injection:**
   * **SQL Injection:**  Use parameterized queries or an ORM (like Sequelize or Prisma) to prevent SQL injection vulnerabilities.
   * **NoSQL Injection:** (If using NoSQL databases) – Validate and sanitize all user inputs used in queries.
   * **Command Injection:**  Avoid using `exec()` or similar commands with user-supplied input. If necessary, carefully sanitize and validate.

2. **Broken Authentication:**
   * **Strong Password Policies:** Enforce strong password requirements (minimum length, complexity, etc.).
   * **Multi-Factor Authentication (MFA):** Implement MFA for all users, especially administrators.
   * **Session Management:** Use secure session management practices (HTTPOnly, Secure cookies, Session timeouts).
   * **Rate Limiting:** (See Rate Limiting section below)
   * **Regular Security Audits:**  Specifically, look for flaws in authentication and session handling.

3. **Sensitive Data Exposure:**
   * **Encryption:**  Encrypt sensitive data at rest (databases) and in transit (HTTPS).
   * **Data Masking/Tokenization:**  Mask or tokenize sensitive data in non-production environments.
   * **Secure Storage:**  Store sensitive data securely, following best practices for your database and storage solutions.

4. **XML External Entities (XXE):** (If using XML parsing) - Disable external entity resolution.

5. **Broken Access Control:**
   * **Authorization Checks:** Implement thorough authorization checks to ensure users can only access the resources they are permitted to access.
   * **Role-Based Access Control (RBAC):**  Use RBAC to manage user permissions.
   * **API Access Controls:**  Validate API requests against the correct permissions.

6. **Security Misconfiguration:**
   * **Secure Server Configuration:**  Configure your web server (Nginx, Apache) and database server securely.
   * **Default Credentials:**  Change all default credentials.
   * **Unnecessary Services:** Disable or remove any unnecessary services.

7. **Vulnerable and Outdated Components:**
   * **Dependency Management:**  (See Section I) - Regularly update all dependencies.
   * **Vulnerability Scanning:** Use tools to scan your dependencies for known vulnerabilities.

8. **Insecure Deserialization:**  Avoid deserializing untrusted data.  If deserialization is
