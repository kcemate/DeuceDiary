# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-03T13:54:37.164736

## OWASP Top 10 Security Checklist - A Comprehensive Guide

This checklist covers the core vulnerabilities identified in the OWASP Top 10 (as of October 2023). It’s designed to be used as a starting point for assessing your web applications and helps prioritize remediation efforts.

**Note:** This is a detailed checklist. Tailor it to your specific application, environment, and risk tolerance. Regularly update this checklist as the threat landscape evolves.

**I. Injection (32% of Attacks)**

* **SQL Injection:**
    * [ ] Input validation on all user-supplied data (parameters, forms, cookies, etc.) – Use parameterized queries or prepared statements.
    * [ ] Avoid dynamic SQL construction – Use ORM tools or stored procedures.
    * [ ] Escaping of all user input –  Be aware of escaping limitations and ensure it's done correctly for the specific database system.
    * [ ] Regular security audits and penetration testing for SQL injection vulnerabilities.
* **Command Injection:**
    * [ ] Avoid executing system commands directly based on user input.
    * [ ] If command execution is unavoidable, implement rigorous input validation and sanitization, utilizing whitelisting and blacklisting.
    * [ ] Use safer alternatives to system commands where possible.
* **LDAP Injection:**
    * [ ]  Validate and sanitize all user inputs before constructing LDAP queries.
    * [ ]  Use parameterized queries to prevent malicious LDAP strings.
* **NoSQL Injection:**
    * [ ] Validate all user-supplied data before incorporating it into NoSQL queries.
    * [ ]  Employ parameterized queries or specific NoSQL operators for data retrieval.


**II. Broken Authentication (29% of Attacks)**

* [ ] **Strong Password Policies:**
    * [ ] Enforce strong password policies (minimum length, complexity, rotation).
    * [ ]  Implement multi-factor authentication (MFA) wherever possible.
* [ ] **Secure Session Management:**
    * [ ] Generate cryptographically secure session identifiers.
    * [ ]  Set appropriate session timeout values.
    * [ ]  Regenerate session identifiers after login and important actions.
    * [ ]  Properly invalidate sessions upon logout.
* [ ] **Authentication Mechanisms:**
    * [ ] Use established and secure authentication protocols (e.g., OAuth 2.0, OpenID Connect).
    * [ ]  Implement robust password hashing algorithms (e.g., Argon2, bcrypt).
    * [ ]  Consider using a centralized identity provider (e.g., Active Directory, Azure AD).
* [ ] **Account Lockout:**
    * [ ] Implement account lockout mechanisms to prevent brute-force attacks.



**III. Sensitive Data Exposure (23% of Attacks)**

* [ ] **Data Classification:**
    * [ ] Identify and categorize all sensitive data (PII, PCI, etc.).
    * [ ] Implement appropriate security controls based on data classification.
* [ ] **Data Encryption:**
    * [ ] Encrypt sensitive data at rest (database, file system).
    * [ ] Encrypt sensitive data in transit (HTTPS, TLS).
* [ ] **Secure Storage:**
    * [ ] Use secure storage mechanisms for sensitive data (e.g., key management systems, HSMs).
    * [ ]  Regularly review and update access controls.
* [ ] **Logging & Monitoring:**  Detailed logging of access to sensitive data.  Monitor logs for suspicious activity.



**IV. Broken Access Control (13% of Attacks)**

* [ ] **Principle of Least Privilege:** Users and applications should only have the minimum necessary access rights.
* [ ] **Role-Based Access Control (RBAC):**  Implement RBAC
