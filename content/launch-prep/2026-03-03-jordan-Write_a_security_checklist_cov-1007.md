# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-03T10:07:55.718679

## OWASP Top 10 Security Checklist - Comprehensive Review

This checklist covers the OWASP Top 10 vulnerabilities and provides a framework for assessing your application's security posture. It’s designed to be used as a starting point and should be tailored to your specific application and environment.

**I. Injection (A - 15% of vulnerabilities)**

* **SQL Injection:**
    * [ ]  Input validation & sanitization implemented consistently across all input points (forms, APIs, database configuration).
    * [ ]  Parameterized queries or prepared statements used for all database interactions.
    * [ ]  Least privilege principle applied to database user accounts - restricting access to necessary tables and operations.
    * [ ]  Regular database security audits and penetration testing.
* **NoSQL Injection:** (Increasingly relevant for NoSQL databases)
    * [ ]  Input validation & sanitization for all NoSQL query parameters.
    * [ ]  Using parameterized queries or escaping mechanisms specific to your NoSQL database.
    * [ ]  Understanding NoSQL injection vulnerabilities beyond SQL injection - considering aggregation queries, array indexes, etc.

**II. Broken Authentication (B - 13% of vulnerabilities)**

* **Weak Passwords:**
    * [ ]  Enforced password complexity requirements (length, special characters, upper/lowercase).
    * [ ]  Password hashing using strong algorithms (e.g., bcrypt, Argon2) with a unique salt per user.
    * [ ]  Password policies actively enforced and communicated to users.
* **Session Management:**
    * [ ]  Secure session identifiers (random, long, unpredictable).
    * [ ]  Session timeouts implemented and configurable.
    * [ ]  HTTPOnly and Secure flags set on session cookies.
    * [ ]  Regular session invalidation (logout) functionality.
* **Multi-Factor Authentication (MFA):**
    * [ ]  MFA strongly encouraged or required for sensitive accounts.
    * [ ]  Appropriate MFA methods implemented (e.g., TOTP, SMS, hardware tokens).



**III. Sensitive Data Exposure (C - 12% of vulnerabilities)**

* **Data in Transit:**
    * [ ]  HTTPS enforced for all communication between client and server.
    * [ ]  TLS 1.2 or higher configuration.
    * [ ]  Certificate validation enabled.
* **Data at Rest:**
    * [ ]  Encryption of sensitive data at rest (databases, file storage, backups).
    * [ ]  Key management practices in place for securing encryption keys.
    * [ ]  Data masking or anonymization for non-production environments.
* **Information Leakage:**
    * [ ]  Review error messages to avoid revealing sensitive information (stack traces, database schemas, internal paths).
    * [ ]  Implement proper logging and monitoring to prevent accidental exposure.


**IV. XML External Entities (XXE) (D - 8% of vulnerabilities)**

* [ ]  Disable or properly configure XML parsers to prevent XXE attacks.
* [ ]  Input validation to prevent malicious XML being processed.
* [ ]  Use a secure XML parser with built-in XXE protection.
* [ ]  Regularly update XML parser libraries.

**V. Broken Access Control (E - 7% of vulnerabilities)**

* **Insufficient Authentication:**
    * [ ]  Proper authentication mechanisms in place (usernames/passwords, OAuth, SAML).
    * [ ]  Verification of user roles and permissions before granting access.
* **Broken Authorization:**
    * [ ]  Implementing granular access control policies based on roles and privileges.
    * [ ]  Preventing users from accessing resources they are not authorized to see or modify.
