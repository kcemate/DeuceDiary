# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-07T15:51:43.276250

## OWASP Top 10 Security Checklist - A Comprehensive Guide

This checklist covers the core vulnerabilities identified in the OWASP Top 10, aiming to provide a solid starting point for security assessments. It’s not exhaustive and should be tailored to your specific application and environment.

**Note:** This checklist is designed for a broad overview. Each item requires deeper investigation and testing based on your specific technology stack and threat model.

**I. Injection (33%)** - Vulnerability: Uncontrolled data used in database queries, command executions, or XML/JSON parsing.

* **[ ]  Input Validation & Sanitization:**
    * [ ]  Implement robust input validation at *all* points of entry for user-supplied data.
    * [ ]  Use whitelisting (allowing only known good characters/formats) instead of blacklisting (blocking known bad characters).
    * [ ]  Sanitize all user input to remove or escape potentially harmful characters.
    * [ ]  Validate data types and formats (e.g., numeric, date, email) to ensure they match expectations.
* **[ ]  Parameterization/Prepared Statements:**  Utilize parameterized queries or prepared statements for database interactions.  This prevents user input from being interpreted as code.
* **[ ]  Command Injection Protection:**
    * [ ]  Avoid directly executing user-supplied data as system commands.
    * [ ]  If command execution is necessary, thoroughly sanitize and escape input.
    * [ ]  Use safe alternative APIs or libraries where possible.
* **[ ]  XML/JSON Parsing:**  Properly escape and validate XML/JSON input to prevent parsing vulnerabilities.



**II. Broken Authentication (29%)** - Vulnerability: Weak or missing authentication mechanisms.

* **[ ]  Strong Password Policies:**
    * [ ]  Enforce strong password complexity requirements (length, mixed case, numbers, symbols).
    * [ ]  Implement password rotation policies.
    * [ ]  Avoid storing passwords in plain text; use strong hashing algorithms (bcrypt, Argon2).
* **[ ]  Multi-Factor Authentication (MFA):** Implement MFA for all user accounts, especially privileged accounts.
* **[ ]  Session Management:**
    * [ ]  Use secure session identifiers (random, long).
    * [ ]  Implement session timeouts and idle timeouts.
    * [ ]  Securely store session data (e.g., cookies, tokens).
    * [ ]  Protect against session fixation and hijacking attacks.
* **[ ]  Authentication Mechanisms:**  Ensure proper usage of protocols like OAuth 2.0, SAML, or OpenID Connect.
* **[ ]  Account Lockout:** Implement account lockout mechanisms after failed login attempts.


**III. Sensitive Data Exposure (14%)** - Vulnerability: Sensitive data (PII, credentials, etc.) being exposed in transit or at rest.

* **[ ]  Data Classification & Handling:** Classify data based on sensitivity and implement appropriate controls.
* **[ ]  Encryption in Transit (TLS/SSL):** Ensure all communication between clients and servers uses TLS/SSL with strong ciphers. Verify certificate validity.
* **[ ]  Encryption at Rest:** Encrypt sensitive data stored in databases, file systems, and backups.
* **[ ]  Secure Storage of Credentials:**  Never store passwords or API keys directly in code. Utilize secure configuration management tools and secrets management solutions (e.g., HashiCorp Vault, AWS Secrets Manager).
* **[ ]  Data Masking & Redaction:** Implement data masking or redaction techniques for non-production environments.



**IV. XML External Entities (XXE) (13%)** - Vulnerability:  Exploiting XML parsers to access local
