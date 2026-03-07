# Write a security checklist for an Express + React app launch
Agent: jordan
Generated: 2026-03-02T23:05:29.488079

## Production Launch Security Checklist: Express + React App

This checklist outlines key security considerations for launching your Express + React application to production. It covers the OWASP Top 10, CSP headers, rate limiting, input sanitization, and auth hardening.

**I. General Security Practices**

* **Secure Development Lifecycle (SDLC):** Implement a secure SDLC incorporating security reviews, threat modeling, and ongoing vulnerability assessments.
* **Code Reviews:** Mandatory peer code reviews with a focus on security vulnerabilities.
* **Static Code Analysis (SAST):** Integrate SAST tools into your CI/CD pipeline to automatically scan your code for common vulnerabilities. (e.g., ESLint, SonarQube)
* **Dynamic Application Security Testing (DAST):** Perform DAST scans against a staging environment to simulate real-world attacks. (e.g., OWASP ZAP, Burp Suite)
* **Dependency Management:** Regularly update dependencies to patch security vulnerabilities. Use a dependency management tool (e.g., npm, yarn) and monitor for security advisories.
* **Infrastructure Security:** Secure your servers, databases, and network infrastructure (firewalls, intrusion detection/prevention systems).
* **Logging & Monitoring:** Comprehensive logging of all events with centralized monitoring for suspicious activity.  Set up alerts for critical events.
* **Regular Backups:** Implement a robust backup and recovery strategy.

**II. OWASP Top 10 - Specific Considerations**

1. **Injection (SQL, XSS, Command Injection):**
   * **React:** Implement thorough input sanitization for all user input, especially data displayed in the UI.  Use a library like `DOMPurify` to prevent XSS.
   * **Express:** Parameterize database queries using prepared statements or ORMs (e.g., Sequelize, Mongoose) to prevent SQL injection.  Properly escape user input before using it in any command-line or shell commands.
   * **Testing:**  Penetration testing specifically targeting injection vulnerabilities.

2. **Broken Authentication:**
   * **Multi-Factor Authentication (MFA):** Strongly consider implementing MFA for enhanced security.
   * **Password Policies:** Enforce strong password policies (minimum length, complexity, regular rotation – though discouraged for user-facing passwords, consider using password hashing with a strong salt and storage).
   * **Session Management:**  Secure session management with secure cookies (HTTPOnly, Secure flag) and appropriate session timeout.
   * **Rate Limiting:** Implement rate limiting on login attempts.
   * **Account Recovery:** Secure account recovery processes (e.g., email verification, security questions).

3. **Sensitive Data Exposure:**
   * **Data Masking/Redaction:** Mask or redact sensitive data in logs and development environments.
   * **Encryption:** Encrypt sensitive data at rest (database) and in transit (HTTPS).
   * **Token Management:**  Properly manage API tokens and secrets (never commit to source control). Utilize a secrets management solution (e.g., HashiCorp Vault, AWS Secrets Manager).
   * **Regular Audits:**  Review data access controls and permissions regularly.

4. **XML External Entities (XXE):** (Less common in React, but relevant in API responses).
   * **Server-Side Validation:**  Validate XML input on the server side to prevent XXE attacks.
   * **Disable External Entity Resolution:**  Configure your web server to disable external entity resolution.

5. **Security Misconfiguration:**
   * **Default Configurations:** Change default configurations (usernames, passwords, ports) immediately.
   * **Error Handling:** Configure error handling to avoid revealing sensitive information in error messages.  Implement proper logging.
   * **Container Security:** Secure your containerized environment (if using Docker).
