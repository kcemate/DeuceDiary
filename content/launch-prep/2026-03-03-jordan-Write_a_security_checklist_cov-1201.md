# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-03T12:01:20.019218

## OWASP Top 10 Security Checklist

This checklist covers the OWASP Top 10 vulnerabilities and provides a starting point for assessing the security of your web applications. It’s designed to be adaptable to your specific application and environment. **This is not exhaustive and should be supplemented with your organization’s specific security policies and procedures.**

**I. Injection (30%)**

* **SQL Injection:**
    * [ ] Input Validation:  Are all user inputs properly validated and sanitized before being used in SQL queries? (Whitelist approach preferred)
    * [ ] Parameterized Queries/Prepared Statements: Are you consistently using parameterized queries or prepared statements to prevent the interpretation of user input as SQL code?
    * [ ] Stored Procedures: Are stored procedures used to handle sensitive data and are they properly secured?
    * [ ] Least Privilege: Does the database user account used by the application have only the necessary privileges?
* **Cross-Site Scripting (XSS):**
    * [ ] Input Validation:  Are all user inputs properly validated and sanitized before being displayed on the page? (Context-aware encoding is crucial!)
    * [ ] Output Encoding:  Are you consistently using output encoding (e.g., HTML entity encoding, JavaScript encoding) to prevent malicious scripts from being executed?
    * [ ] Content Security Policy (CSP): Is a CSP header configured and properly enforced to control the sources from which the browser can load resources?


**II. Broken Authentication (24%)**

* [ ] Strong Password Policies:  Are strong password policies enforced (length, complexity, expiration)?
* [ ] Multi-Factor Authentication (MFA): Is MFA enabled for all users, especially those with privileged access?
* [ ] Secure Session Management:
    * [ ] Secure Session IDs: Are session IDs generated securely and stored securely (e.g., using a secure cookie attribute `HttpOnly` and `Secure`)?
    * [ ] Session Timeout: Are appropriate session timeouts configured?
    * [ ] Session Invalidation:  Is session invalidation handled securely (e.g., on logout, account change)?
* [ ] Credential Stuffing Protection:  Are you implementing measures to protect against credential stuffing attacks (e.g., rate limiting, CAPTCHAs)?


**III. Sensitive Data Exposure (14%)**

* [ ] Data Classification:  Is sensitive data identified and classified based on its sensitivity level?
* [ ] Encryption in Transit:  Is all sensitive data transmitted over the network encrypted using HTTPS/TLS?
* [ ] Encryption at Rest: Is sensitive data stored encrypted at rest (e.g., database encryption, file system encryption)?
* [ ] Data Masking/Tokenization:  Are sensitive data masked or tokenized when displayed to non-privileged users or stored in non-production environments?
* [ ] Regular Security Audits:  Are regular security audits performed to identify and remediate data exposure risks?



**IV. Broken Access Control (13%)**

* [ ] Principle of Least Privilege:  Are users and applications granted only the minimum necessary permissions to perform their tasks?
* [ ] Role-Based Access Control (RBAC): Is RBAC implemented to manage access control based on user roles?
* [ ] Authorization Checks: Are authorization checks performed consistently for all requests to ensure users have the appropriate permissions? (Consider Server-Side Authorization)
* [ ] Cross-Site Scripting & XSS Mitigation (As part of Access Control - prevents bypassing authentication)


**V. Security Misconfiguration (12%)**

* [ ] Default Configurations:  Are default configurations changed immediately to remove default accounts and sensitive information?
* [ ] Patch Management:  Is a robust patch management process in place to ensure all software and systems are up-to-date with security patches
