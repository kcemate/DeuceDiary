# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-04T08:47:00.465468

## OWASP Top 10 Security Checklist - Comprehensive

This checklist covers the core vulnerabilities identified by the OWASP Top 10, designed to help you assess and improve the security posture of your application. It's broken down by category and includes specific checks and considerations.

**I. Injection (Critical)**

* **SQL Injection:**
    * [ ] Input Validation: Are all user inputs validated and sanitized *before* being used in SQL queries?
    * [ ] Parameterized Queries/Stored Procedures: Are parameterized queries or stored procedures used instead of string concatenation?
    * [ ] Least Privilege:  Do database users have only the minimum necessary permissions?
    * [ ] Escaping:  If parameterized queries aren’t feasible, is data appropriately escaped? (Don’t rely solely on escaping - parameterized queries are preferred).
    * [ ] Database Configuration: Are database configurations hardened to minimize vulnerabilities (e.g., disabling unnecessary features)?
* **NoSQL Injection:**
    * [ ] Input Validation: Similar to SQL Injection, are all user inputs validated?
    * [ ] Parameterized Queries/Object-Relational Mappers (ORMs):  Are parameterized queries or ORMs used?
    * [ ]  Data Type Enforcement: Are appropriate data types enforced at the database level to prevent unexpected injection?

**II. Broken Authentication (Critical)**

* [ ] Multi-Factor Authentication (MFA): Is MFA implemented for all users, especially privileged accounts?
* [ ] Weak Passwords: Is password strength enforced (minimum length, complexity)?
* [ ] Password Storage: Are passwords hashed with a strong, salted algorithm (e.g., Argon2, bcrypt)?
* [ ] Session Management: Are session IDs generated randomly and securely? Are sessions invalidated on logout? Is session fixation prevention implemented?
* [ ] Rate Limiting: Is there rate limiting on login attempts to prevent brute-force attacks?
* [ ] Account Lockout:  Is account lockout implemented after multiple failed login attempts?
* [ ]  Federated Identity Management: If using federated identity, are proper security controls in place for integration?


**III. Sensitive Data Exposure (Critical)**

* [ ] Data Classification: Is data classified based on sensitivity (e.g., public, confidential, restricted)?
* [ ] Encryption in Transit: Is all sensitive data encrypted in transit (HTTPS)?
* [ ] Encryption at Rest: Is sensitive data encrypted at rest? (Database, files, backups)
* [ ] Token Storage: Are API keys, database credentials, and other secrets properly stored and managed? Avoid hardcoding in the application. Utilize a secrets management solution (e.g., HashiCorp Vault, AWS Secrets Manager).
* [ ] Data Masking/Redaction: Is sensitive data masked or redacted in logs, reports, and development environments?
* [ ] PCI Compliance: If processing credit card data, is the application fully PCI compliant?



**IV. Broken Access Control (Critical)**

* [ ] Authentication vs. Authorization: Is there a clear separation between verifying a user’s identity (authentication) and determining what they are authorized to access (authorization)?
* [ ] Role-Based Access Control (RBAC): Is RBAC implemented to grant access based on roles and permissions?
* [ ] Access Control Lists (ACLs): Are ACLs properly configured to restrict access to resources?
* [ ] Authorization Checks: Are authorization checks performed on *every* request to ensure users only access resources they are authorized to access?
* [ ] Cross-Site Scripting (XSS) Prevention: Is XSS prevented through proper input validation and output encoding?  (This is closely related to broken access control and often exploited to bypass authorization.)

**V. Security Misconfiguration (High)**

* [ ] Default Configurations: Are all default configurations changed?
