# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-03T15:02:39.051317

## Security Checklist - Covering OWASP Top 10

This checklist provides a comprehensive framework for assessing your application's security posture, aligning with the OWASP Top 10 vulnerabilities. It's designed to be adaptable to your specific application and environment.

**Note:** This is a starting point. You’ll need to tailor it to your specific application, technology stack, and business requirements.  Assigning risk levels (High, Medium, Low) to each item will help prioritize remediation efforts.

**I. Injection (High Priority)**

* **SQL Injection:**
    * [ ] Input Validation: Implement strict input validation on all user-supplied data entering the database.
    * [ ] Parameterized Queries/Prepared Statements: Use parameterized queries or prepared statements to prevent direct manipulation of SQL queries.
    * [ ] Stored Procedures: Utilize stored procedures where appropriate, minimizing direct SQL usage.
    * [ ] Database User Permissions:  Employ the principle of least privilege – database users should only have access to the data they absolutely need.
    * [ ] Escaping Output:  Properly escape output when displaying user-generated data to prevent potential vulnerabilities in other layers.
* **NoSQL Injection:** (Relevant for NoSQL databases)
    * [ ] Input Validation: Implement strict input validation, understanding the specific NoSQL data types.
    * [ ] Parameterized Queries/Prepared Statements: Utilize parameterized queries or prepared statements specific to the NoSQL database.
    * [ ] Data Type Restrictions: Enforce strict data type restrictions on input fields.



**II. Broken Authentication (High Priority)**

* [ ] Strong Password Policies: Enforce strong password policies – minimum length, complexity, and expiration.
* [ ] Multi-Factor Authentication (MFA): Implement MFA for all user accounts, especially privileged accounts.
* [ ] Secure Session Management:
    * [ ] Session ID Generation: Use strong, unpredictable session ID generation.
    * [ ] Session Timeout: Implement appropriate session timeout settings.
    * [ ] Session Invalidation: Properly invalidate sessions on logout and other sensitive events.
* [ ] Account Lockout Policies: Implement account lockout policies to prevent brute-force attacks.
* [ ] Brute-Force Protection: Employ rate limiting and CAPTCHAs to mitigate brute-force attempts.
* [ ]  Secure Authentication Protocols: Use modern authentication protocols like OAuth 2.0 and OpenID Connect where possible.


**III. Sensitive Data Exposure (High Priority)**

* [ ] Data Classification: Classify data based on sensitivity level (Public, Internal, Confidential).
* [ ] Encryption at Rest: Encrypt sensitive data stored in databases, file systems, and backups.
* [ ] Encryption in Transit: Use HTTPS (TLS/SSL) for all communication channels transmitting sensitive data.
* [ ] Data Masking/Tokenization: Consider data masking or tokenization for non-production environments.
* [ ]  Secure Storage:  Ensure data is stored securely, with appropriate access controls.
* [ ]  Data Retention Policies: Establish and enforce data retention policies.



**IV. Broken Access Control (High Priority)**

* [ ] Principle of Least Privilege:  Users should only have access to the resources they need to perform their tasks.
* [ ] Role-Based Access Control (RBAC): Implement RBAC to manage access permissions effectively.
* [ ] Authorization Checks: Implement thorough authorization checks before granting access to any resource or functionality.
* [ ]  Cross-Site Scripting (XSS) Mitigation: (See XSS below – often a component of this vulnerability)
* [ ]  Avoid exposing internal system paths and file structures.


**V. Security Misconfiguration (High Priority)**

* [ ] Default Credentials: Change all default credentials for applications, databases, and servers.
* [ ]  Unnecessary
