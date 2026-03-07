# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-06T13:31:57.167248

## OWASP Top 10 Security Checklist

This checklist is designed to help you assess your web application's security posture against the OWASP Top 10 vulnerabilities. It’s a starting point – tailor it to your specific application and technology stack.

**Note:** This is a high-level checklist. Each vulnerability requires deeper investigation and testing.

**1. Injection (SQL, Command, LDAP)**

* **[ ] Input Validation:**  Are all user inputs rigorously validated on the server-side *before* being used in any database queries, system commands, or LDAP searches? Use parameterized queries/prepared statements whenever possible.
* **[ ] Escaping:**  If parameterized queries aren't feasible (legacy code), is escaping correctly implemented for all user input, and is it consistently applied?
* **[ ] Least Privilege:** Do database users and system accounts have only the minimum necessary permissions?
* **[ ] Database Auditing:** Are database access logs enabled and regularly reviewed for suspicious activity?
* **[ ] Content Security Policy (CSP):**  (Related – mitigates some XSS injection effects) – Is CSP configured to restrict the sources of scripts and other resources?


**2. Broken Authentication**

* **[ ] Strong Passwords:** Is a strong password policy enforced (length, complexity, rotation)?  Are password hashes stored securely using a robust hashing algorithm (e.g., Argon2, bcrypt)?
* **[ ] Multi-Factor Authentication (MFA):** Is MFA implemented for all users, especially those with privileged access?
* **[ ] Session Management:** Are session IDs securely generated (random and long), protected from theft (using HTTPS), and invalidated upon logout or inactivity?
* **[ ] Account Lockout:** Is there a mechanism to lock accounts after repeated failed login attempts?
* **[ ] Password Reset:** Is the password reset functionality secure, preventing unauthorized account recovery?
* **[ ] API Authentication:**  Are APIs using robust authentication mechanisms like OAuth 2.0 or JWT?



**3. Sensitive Data Exposure**

* **[ ] Data Classification:** Have you identified and classified sensitive data (PII, financial data, etc.)?
* **[ ] Encryption at Rest:** Is sensitive data encrypted at rest in databases, storage, and backups?
* **[ ] Encryption in Transit:** Is all communication between the client and server (and between servers) secured with HTTPS (TLS)? Are strong cipher suites enforced?
* **[ ] Data Masking/Tokenization:**  Are sensitive data elements masked or tokenized in non-production environments?
* **[ ] Secure Storage:**  Are sensitive data keys and configuration information stored securely (e.g., using a secrets management solution)?



**4. XML External Entities (XXE)**

* **[ ] XML Parsing:** Is your application using a safe XML parser that disables the processing of external entities?  (e.g., using DOMParser instead of SAXParser).
* **[ ] Input Validation:** Are XML input payloads rigorously validated and sanitized?
* **[ ] Disable External Entity Resolution:**  Verify that XML parsers are configured to *not* resolve external entities.


**5. Broken Access Control**

* **[ ] Authorization Checks:** Are proper authorization checks implemented to ensure users can only access resources they are authorized to access?
* **[ ] Role-Based Access Control (RBAC):** Is RBAC used to manage user permissions effectively?
* **[ ] Input Validation:**  Are all user inputs validated to prevent unauthorized access to data or functionality?
* **[ ] Cross-Site Scripting (XSS) – (Critical overlap with this vulnerability as well)** Ensure that XSS vulnerabilities don't allow users to modify access control rules.
* **[ ] API Access Control:**  Are API endpoints secured with appropriate authentication and authorization
