# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-03T14:39:55.109587

## OWASP Top 10 Security Checklist - Comprehensive

This checklist covers the OWASP Top 10 vulnerabilities and provides a structured approach to assessing your application's security posture. It's designed to be a starting point and should be tailored to your specific application and context.

**Important Note:** This checklist is a starting point. Thorough testing, code reviews, and security training are crucial for a truly robust security posture.

**I. Injection (A) - 10% of vulnerabilities**

* **[ ] Input Validation:**
    * [ ] Implement strict input validation on all user-supplied data.
    * [ ] Use whitelisting (allowing only known good inputs) instead of blacklisting (blocking known bad inputs).
    * [ ] Sanitize data appropriately for the target system (e.g., SQL, NoSQL).
* **[ ] Parameterized Queries (Prepared Statements):**  Use parameterized queries or prepared statements for all database interactions.
* **[ ] Context-Aware Output Encoding:** Properly encode data before displaying it to prevent Cross-Site Scripting (XSS) attacks when injection vulnerabilities exist.
* **[ ] Regularly Review & Update:** Regularly review and update validation rules as new attack vectors emerge.

**II. Broken Authentication (B) - 14% of vulnerabilities**

* **[ ] Strong Password Policies:**
    * [ ] Enforce minimum password length (12+ characters recommended).
    * [ ] Require a mix of uppercase, lowercase, numbers, and symbols.
    * [ ] Prevent password reuse.
* **[ ] Multi-Factor Authentication (MFA):** Implement MFA wherever possible, especially for sensitive accounts.
* **[ ] Secure Session Management:**
    * [ ] Use strong session IDs.
    * [ ] Implement session timeouts.
    * [ ] Regularly regenerate session IDs.
    * [ ] Protect session cookies with the `HttpOnly` and `Secure` flags.
* **[ ] Rate Limiting:** Implement rate limiting to prevent brute-force attacks.
* **[ ] Account Lockout Policies:** Implement account lockout policies after multiple failed login attempts.


**III. Sensitive Data Exposure (C) - 13% of vulnerabilities**

* **[ ] Data Classification & Minimization:**
    * [ ] Classify data based on sensitivity.
    * [ ] Only collect and store necessary data.
* **[ ] Encryption in Transit:**
    * [ ] Use HTTPS for all data transmitted between the client and server.
    * [ ] Verify TLS certificate validity.
* **[ ] Encryption at Rest:**
    * [ ] Encrypt sensitive data stored in databases, files, or backups.
* **[ ] Secure Storage:** Securely store credentials, API keys, and other sensitive information – consider using a secrets management solution.
* **[ ] Regular Audits:** Regularly audit data access controls and encryption configurations.


**IV. XML External Entities (XXE) (D) - 8% of vulnerabilities**

* **[ ] Disable External Entity Processing:**  Disable external entity processing in XML parsers. This prevents attackers from potentially reading local files or remote servers.
* **[ ] Input Validation & Sanitization:**  Validate and sanitize XML input carefully, especially if it comes from untrusted sources.
* **[ ] Use a Secure XML Parser:**  Utilize a well-maintained and secure XML parser.



**V. Broken Access Control (E) - 13% of vulnerabilities**

* **[ ] Principle of Least Privilege:**  Grant users and applications only the minimum necessary access rights.
* **[ ] Role-Based Access Control (RBAC):** Implement RBAC to simplify access control management.
* **[ ] Verify Authorization:**  Always verify authorization before granting access to resources. Don't rely
