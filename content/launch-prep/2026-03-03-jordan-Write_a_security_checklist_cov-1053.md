# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-03T10:53:08.905060

## OWASP Top 10 Security Checklist

This checklist covers the OWASP Top 10 vulnerabilities and provides a starting point for assessing the security of your application. It's designed to be used in conjunction with your organization's specific risk assessment and security policies. **This is not exhaustive and should be tailored to your specific application and environment.**

**I. Injection (All Versions)**

* **[ ] Input Validation:** Are all user inputs validated rigorously at *every* stage of the application, including database queries, command-line executions, and external API calls?
* **[ ] Parameterized Queries (Prepared Statements):** Are parameterized queries or prepared statements used to prevent SQL injection? (Verify proper escaping and data type handling).
* **[ ] Output Encoding:** Is all output properly encoded to prevent Cross-Site Scripting (XSS) or Command Injection?
* **[ ] Command Injection Prevention:**  Are system commands and shell executions carefully restricted? Are user inputs avoided entirely, or are they validated and sanitized before use?
* **[ ] Configuration Errors:** Are default configurations audited and changed? Are secrets and credentials stored securely and not exposed in configuration files?


**II. Broken Authentication (1st Priority)**

* **[ ] Strong Password Policies:** Are strong password policies enforced (length, complexity, regular changes)?
* **[ ] Multi-Factor Authentication (MFA):** Is MFA implemented for all users, especially those with elevated privileges?
* **[ ] Secure Session Management:** Are session identifiers generated securely (random and long)? Are sessions invalidated on logout, inactivity, or other suspicious events?
* **[ ] Rate Limiting:** Are requests to authentication endpoints rate-limited to prevent brute-force attacks?
* **[ ] Account Lockout:** Is account lockout implemented after multiple failed login attempts?
* **[ ] Password Reset Mechanisms:** Are password reset mechanisms secure and resistant to abuse (e.g., avoiding predictable reset codes)?
* **[ ] OAuth/OpenID Connect Implementation:**  Are OAuth and OpenID Connect implemented correctly and securely with proper authorization flows?


**III. Sensitive Data Exposure (1st Priority)**

* **[ ] Data Classification:** Is data classified based on sensitivity (e.g., public, internal, confidential)?
* **[ ] Encryption at Rest:** Is sensitive data encrypted when stored (databases, files, backups)? Utilize strong encryption algorithms.
* **[ ] Encryption in Transit:** Is all sensitive data transmitted over HTTPS with TLS 1.2 or higher? Verify certificate validity and proper configuration.
* **[ ] Data Masking/Tokenization:**  Is sensitive data masked or tokenized where appropriate (e.g., for non-production environments)?
* **[ ] Log Management:** Are logs monitored for sensitive data leaks or anomalies?
* **[ ] Information Disclosure:** Are there any unintentional disclosures of sensitive information in error messages, debugging outputs, or documentation?


**IV. XML External Entities (XXE) (High Priority)**

* **[ ] XML Parsing Restrictions:** Are XML parsers configured to disallow external entities or limit their use?
* **[ ] Input Validation:**  Are XML inputs validated to prevent the inclusion of malicious external entities?
* **[ ] Disable External Entity Resolution:**  Ensure external entity resolution is disabled during parsing.


**V. Broken Access Control (1st Priority)**

* **[ ] Principle of Least Privilege:** Are users and applications granted only the minimum necessary privileges to perform their tasks?
* **[ ] Role-Based Access Control (RBAC):** Is RBAC implemented to manage access permissions based on roles?
* **[ ] Authorization Checks:** Are authorization checks performed consistently and accurately before granting access to resources?
* **[ ] Cross-Site Scripting (XSS) Protection:** (Also relevant here)  Are XSS vulnerabilities addressed (as
