# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-06T14:16:23.978752

## OWASP Top 10 Security Checklist - A Comprehensive Guide

This checklist is designed to help you assess your application’s security posture based on the OWASP Top 10 vulnerabilities. It’s a starting point, and you'll need to adapt it to your specific application and environment.

**Important Note:** This checklist is not a substitute for professional security audits and penetration testing.  It’s designed to provide a focused review and identify potential risks.

**I. Injection (35.1% of Vulnerabilities)**

* **[ ] Input Validation:** Implement rigorous input validation on *all* user-supplied data (including forms, APIs, URL parameters, cookies, etc.).  Use whitelisting (only allow known good inputs) instead of blacklisting (attempting to block bad inputs).
* **[ ] Parameterized Queries (Prepared Statements):**  Use parameterized queries or prepared statements in your database interactions to prevent SQL injection.  Never construct SQL queries by concatenating strings.
* **[ ] OS Command Injection Prevention:**  Avoid executing OS commands directly based on user input. If necessary, use safe command execution libraries with proper input sanitization.
* **[ ] XML External Entity (XXE) Injection Prevention:**  Disable or restrict the processing of external XML entities to prevent XXE attacks.
* **[ ] LDAP Injection Prevention:** Sanitize user input when constructing LDAP queries to avoid LDAP injection attacks.


**II. Broken Authentication (23.3% of Vulnerabilities)**

* **[ ] Strong Password Policies:** Enforce strong password complexity requirements (length, characters, etc.).
* **[ ] Multi-Factor Authentication (MFA):** Implement MFA wherever possible, especially for sensitive accounts.
* **[ ] Account Lockout Policies:**  Implement account lockout policies after multiple failed login attempts.
* **[ ] Session Management:**
    * **[ ] Secure Session IDs:** Use long, random, and unpredictable session IDs.
    * **[ ] Session Timeout:**  Implement appropriate session timeout values.
    * **[ ] Session Fixation Protection:** Prevent session fixation attacks by regenerating session IDs after login.
    * **[ ] Secure Session Storage:** Store session data securely (e.g., in encrypted cookies).
* **[ ] API Authentication:** Use strong authentication mechanisms (e.g., OAuth 2.0, JWT) for API access.


**III. Sensitive Data Exposure (17.5% of Vulnerabilities)**

* **[ ] Data Classification:** Identify and classify sensitive data (PII, financial data, etc.).
* **[ ] Encryption at Rest:** Encrypt sensitive data at rest (database, file storage, backups).
* **[ ] Encryption in Transit:** Use TLS/SSL for all communication channels, including web traffic and API communication.
* **[ ] Token Protection:**  Properly manage and protect API keys, tokens, and credentials. Avoid hardcoding them in code.  Use secrets management tools.
* **[ ] Logging and Monitoring:** Implement comprehensive logging and monitoring to detect and respond to data breaches.


**IV. Broken Access Control (13.3% of Vulnerabilities)**

* **[ ] Least Privilege:**  Grant users and applications only the minimum level of access necessary to perform their tasks.
* **[ ] Role-Based Access Control (RBAC):**  Use RBAC to manage user permissions effectively.
* **[ ] Authorization Checks:** Implement rigorous authorization checks on *every* request, including those from authenticated users.
* **[ ] Cross-Site Scripting (XSS) and CSRF Protection:** (These are often intertwined with Access Control)
    * **[ ] Content Security Policy (CSP):** Implement CSP to control the resources that the browser is allowed to load.
    * **[ ] Cross-Site Request Forgery (CSR
