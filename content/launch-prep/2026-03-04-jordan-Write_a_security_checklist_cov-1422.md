# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-04T14:22:55.406232

## OWASP Top 10 Security Checklist - Comprehensive

This checklist covers the key aspects of mitigating risks associated with the OWASP Top 10 vulnerabilities. It’s designed to be used as a starting point and should be tailored to your specific application and environment.

**I. Injection (A1 - 8.5% of Vulnerabilities)**

* **SQL Injection:**
    * [ ] Are all user inputs validated and sanitized against expected formats and character sets? (Use parameterized queries/prepared statements.)
    * [ ] Is database access restricted to only authorized applications and users?
    * [ ] Are stored procedures used instead of dynamic SQL where possible?
    * [ ] Are database logging and monitoring implemented to detect suspicious activity?
* **Command Injection:**
    * [ ] Are all user inputs escaped or sanitized before being used in system commands?
    * [ ] Avoid using user input directly in shell commands.  Use libraries designed for command execution instead.
    * [ ] Limit the privileges of the process executing commands.
    * [ ] Use input validation and whitelisting to restrict allowed commands and arguments.


**II. Broken Authentication (A2 - 7.5% of Vulnerabilities)**

* **Credential Management:**
    * [ ] Use strong, unique passwords for all user accounts.
    * [ ] Enforce password complexity requirements (length, mixed case, numbers, symbols).
    * [ ] Implement Multi-Factor Authentication (MFA) for sensitive accounts.
    * [ ] Securely store passwords using hashing algorithms with salts (e.g., bcrypt, Argon2).  *Never* store passwords in plaintext.
    * [ ] Regularly review and revoke access for former employees.
* **Session Management:**
    * [ ] Use secure session identifiers (long, random strings).
    * [ ] Implement secure session timeouts.
    * [ ] Regenerate session IDs after authentication or privilege changes.
    * [ ] Use HttpOnly and Secure flags for session cookies.
* **Authentication Protocols:**
    * [ ] Use secure authentication protocols (e.g., OAuth 2.0, SAML) instead of custom, vulnerable protocols.


**III. Sensitive Data Exposure (A3 - 6.8% of Vulnerabilities)**

* **Data Classification:**
    * [ ] Identify and classify sensitive data (e.g., PII, financial data, health records).
    * [ ] Determine appropriate security controls for each data classification level.
* **Data in Transit:**
    * [ ] Enforce HTTPS for all communication channels. (Check for valid SSL/TLS certificates)
    * [ ] Implement Transport Layer Security (TLS) configuration best practices.
* **Data at Rest:**
    * [ ] Encrypt sensitive data at rest (database, files, backups).
    * [ ] Implement access controls to restrict data access based on the principle of least privilege.
    * [ ] Regularly review and audit data access logs.
* **Data Masking/Tokenization:**
    * [ ] Consider using data masking or tokenization to protect sensitive data in non-production environments.



**IV. XML External Entities (XXE) (A4 - 5.9% of Vulnerabilities)**

* [ ] Disable external entity processing in XML parsers and applications.
* [ ] Properly sanitize XML input to prevent malicious content injection.
* [ ] Use a robust XML parser with built-in protection against XXE attacks.
* [ ] Regularly update your XML parser libraries.


**V. Broken Access Control (A5 - 5.8% of Vulnerabilities)**

* **Authorization Mechanisms:**
    * [ ] Implement robust authorization mechanisms to control access to resources based on user roles and permissions.
    * [ ] Utilize established access control models (e.g
