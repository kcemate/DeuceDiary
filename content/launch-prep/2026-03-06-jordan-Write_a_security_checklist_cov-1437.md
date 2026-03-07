# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-06T14:37:59.244175

## OWASP Top 10 Security Checklist - Comprehensive

This checklist covers the 10 critical vulnerabilities identified by the OWASP (Open Web Application Security Project) Top 10. It’s designed to be used for both penetration testing and regular security assessments.  It's a starting point – tailor it to your specific application and environment.

**I. Injection (A1, A2, A3)**

* **SQL Injection:**
    * [ ] Input Validation: Is all user input validated against expected data types and formats? (Whitelist approach preferred)
    * [ ] Parameterized Queries/Prepared Statements: Are all database queries using parameterized queries or prepared statements? (No direct string concatenation)
    * [ ] Stored Procedures: Are stored procedures used to minimize direct interaction with the database?
    * [ ] Least Privilege: Does the database user account used by the application have only the necessary permissions?
    * [ ] Escaping: (As a last resort)  Is escaping properly implemented for all user input? (Generally, parameterized queries are superior).
* **NoSQL Injection:**
    * [ ] Input Validation:  Is all user input validated against the expected NoSQL data type (string, number, boolean, etc.)?
    * [ ] Parameterized Queries/Prepared Statements: Are appropriate parameterized queries or prepared statements used for each NoSQL database operation?
    * [ ] Understanding NoSQL Data Structures:  Are developers aware of the specific injection vectors for the chosen NoSQL database (e.g., document, key-value, graph)?


**II. Broken Authentication (A2, A3)**

* [ ] Strong Password Policies: Are strong password policies enforced (length, complexity, expiration)?
* [ ] Multi-Factor Authentication (MFA): Is MFA implemented for sensitive accounts?
* [ ] Session Management:
    * [ ] Secure Session IDs: Are session IDs generated randomly and securely?
    * [ ] Session Timeout: Are sessions automatically timed out after inactivity?
    * [ ] Session Fixation Protection: Are session IDs validated against the original value?
    * [ ] Insecure Session Storage: Are session IDs stored securely (e.g., HTTPOnly, Secure flags)?
* [ ] Account Lockout: Is there a mechanism to lock accounts after failed login attempts?
* [ ] Password Reset:  Is the password reset process secure and resistant to brute-force attacks?
* [ ] API Authentication: Are APIs utilizing robust authentication mechanisms (e.g., OAuth 2.0, JWT)?



**III. Sensitive Data Exposure (A4, A5)**

* [ ] Data Classification: Is data classified based on sensitivity levels?
* [ ] Encryption at Rest: Is sensitive data encrypted when stored?
* [ ] Encryption in Transit: Is sensitive data encrypted when transmitted (HTTPS/TLS)?  (Ensure using strong ciphers and certificate management)
* [ ] Masking/Redaction: Is sensitive data masked or redacted in logs, UI, and non-production environments?
* [ ] Data Loss Prevention (DLP): Are DLP solutions in place to prevent sensitive data from leaving the organization?
* [ ] PCI Compliance (if applicable): Are all PCI DSS requirements being met?


**IV. XML External Entities (XXE) (A6)**

* [ ] Disable External Entity Processing: Is external entity processing disabled in XML parsers?
* [ ] Input Validation: Validate XML input to avoid malicious entity references.
* [ ] Limit External Entity Usage:  Restrict the use of external entities to trusted sources only.
* [ ] Secure Configuration: Ensure XML parser configurations are secure and don’t enable vulnerable features.


**V. Broken Access Control (A7, A8)**

* [ ] Principle of Least Privilege:  Are users and applications granted only the necessary
