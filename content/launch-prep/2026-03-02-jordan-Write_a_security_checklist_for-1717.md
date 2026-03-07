# Write a security checklist for an Express + React app launch
Agent: jordan
Generated: 2026-03-02T17:17:58.674955

Okay, here's a comprehensive security checklist for launching an Express + React app to production, covering the OWASP Top 10, CSP, rate limiting, input sanitization, and authentication hardening. This checklist is designed to be a starting point and should be adapted based on your specific application's architecture and risk profile.

**I. General Security Practices & Infrastructure**

*   **Secure Development Environment:**
    *   Use secure coding practices (e.g., avoid hardcoding credentials).
    *   Regularly review and update development tools.
    *   Implement a clear and enforced development workflow.
*   **Infrastructure Security:**
    *   **HTTPS:**  Enforce HTTPS for all traffic (SSL/TLS certificate properly configured and validated).  Use Let's Encrypt for free certificates.
    *   **Firewall:** Configure firewalls to restrict access to ports and services.
    *   **Regular Patching:**  Maintain up-to-date operating systems, web servers (Nginx, Apache), databases, and all libraries.
    *   **Monitoring & Logging:** Implement robust logging and monitoring for security events, errors, and performance.  Centralized logging is highly recommended.
    *   **Security Information and Event Management (SIEM):** Integrate logging with a SIEM system for correlation and alerting.
*   **Code Scanning:**
     * **SAST (Static Application Security Testing):** Utilize tools to scan your code for vulnerabilities during development.
     * **DAST (Dynamic Application Security Testing):** Run tests against your running application to identify vulnerabilities.
     * **Container Image Scanning:** Scan your Docker images for vulnerabilities before deployment.


**II. OWASP Top 10 Considerations**

1.  **Injection:**
    *   **SQL Injection:** Use parameterized queries or an ORM to prevent malicious SQL code execution.  Never concatenate user input directly into SQL queries.
    *   **NoSQL Injection:** Same principles as SQL injection; adapt to your NoSQL database (MongoDB, etc.).
    *   **Command Injection:**  Sanitize user input when constructing shell commands. Avoid using user input directly in `exec()` or similar functions.

2.  **Broken Authentication:**
    *   **Multi-Factor Authentication (MFA):** Strongly recommended.
    *   **Password Policies:** Enforce strong password requirements (length, complexity).
    *   **Rate Limiting:** (See Section V)
    *   **Session Management:** Secure session handling (short session timeouts, invalidation on logout, proper cookie attributes).  Use HTTPOnly and Secure flags for cookies.
    *   **JWT Validation:** Thoroughly validate JWTs on the server-side – don’t rely solely on client-side validation.

3.  **Sensitive Data Exposure:**
    *   **Data Masking/Tokenization:** Mask or tokenize sensitive data in transit and at rest.
    *   **Encryption at Rest:**  Encrypt databases and any storage containing sensitive data.
    *   **Secure Key Management:**  Properly manage API keys, database credentials, and other secrets (never hardcoded). Utilize a secrets manager (HashiCorp Vault, AWS Secrets Manager, Azure Key Vault).

4.  **XML External Entities (XXE):**
    *   If using XML parsing, ensure you're using a robust parser that correctly handles external entities and disables external entity resolution.  Disable external entity resolution.

5.  **Broken Access Control:**
    *   **Authorization:** Implement robust authorization mechanisms to control access to resources based on user roles and permissions.  Use principles of least privilege.
    *   **Cross-Site Scripting (XSS) Prevention:** (See Section VI)
    *   **CSRF Protection:** (See Section VI)

6.
