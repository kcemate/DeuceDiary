# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-04T12:11:16.778553

## OWASP Top 10 Security Checklist - A Comprehensive Guide

This checklist is designed to help you assess your application's security posture against the OWASP Top 10 vulnerabilities. It’s a starting point; you'll need to tailor it to your specific application and environment.

**Key:**
* **High:** Immediate action required. High risk of serious impact.
* **Medium:** Address within a reasonable timeframe. Moderate risk.
* **Low:** Monitor and investigate. Lower risk, but still requires attention.

**I. Injection (High)**

* **SQL Injection:**
    * [ ] Input validation implemented consistently across all interfaces?
    * [ ] Parameterized queries or ORM used? (No string concatenation for building queries)
    * [ ] Database user permissions restricted to the minimum required?
    * [ ] Regularly review queries for potential vulnerabilities.
* **Command Injection:**
    * [ ] Avoid directly executing user-supplied data as shell commands.
    * [ ] If execution is unavoidable, implement strict input validation and sanitization.
    * [ ] Utilize secure alternatives to command execution whenever possible.
* **LDAP Injection:**
    * [ ] Input validation for all LDAP queries.
    * [ ] Use parameterized queries or escape special characters properly.
* **OS Command Injection:**
    * [ ]  Same principles apply as Command Injection - avoid direct execution of user input.



**II. Broken Authentication (High)**

* **Weak Passwords:**
    * [ ] Password complexity requirements enforced (length, special characters, etc.)?
    * [ ] Multi-factor authentication (MFA) implemented? (Highly Recommended)
* **Session Management:**
    * [ ] Secure session IDs generated and managed? (Random, long, unpredictable)
    * [ ] Session timeout implemented? (Reasonable duration based on risk)
    * [ ] Session fixation protection implemented?
    * [ ] Proper session invalidation upon logout?
* **Credential Storage:**
    * [ ] Passwords hashed using strong, salted hashing algorithms (e.g., bcrypt, Argon2)?
    * [ ]  Secrets (API keys, database passwords) stored securely (e.g., HashiCorp Vault, AWS Secrets Manager)?  Never hardcoded.


**III. Sensitive Data Exposure (High)**

* **Storage:**
    * [ ] Sensitive data (PII, financial information, etc.) encrypted at rest? (AES-256 or higher)
    * [ ] Access controls to sensitive data strictly enforced (least privilege principle)?
* **Transmission:**
    * [ ] All data transmitted over HTTPS? (Valid, trusted certificates)
    * [ ]  Data masking/tokenization used where appropriate?
* **Logging:**
    * [ ] Sensitive data redacted from logs?
    * [ ] Log data stored securely with limited access?



**IV. XML External Entities (XXE) (Medium)**

* [ ] Disable or restrict external entity resolution in XML parsers.
* [ ] Validate XML input thoroughly to prevent malicious data.
* [ ]  Use a robust XML processing library that mitigates XXE vulnerabilities.

**V. Broken Access Control (High)**

* **Authorization Flaws:**
    * [ ]  Proper authorization mechanisms implemented to restrict access to resources based on roles/permissions?
    * [ ]  Insufficient role-based access control (RBAC)?
* **Cross-Site Scripting (XSS) & Cross-Site Request Forgery (CSRF) – *See below for detailed checks*
* **Insecure Direct Object References (IDOR):**
    * [ ]  Verify that users can only access resources they are authorized to access.
    * [ ] Don’t use predictable IDs or names in URLs or API
