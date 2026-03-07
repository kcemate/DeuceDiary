# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-06T20:07:57.811750

## OWASP Top 10 Security Checklist

This checklist covers the key vulnerabilities identified in the OWASP Top 10, categorized by application component. It’s designed to be a starting point and should be adapted to your specific application and environment.  **Remember, security is an ongoing process, not a one-time fix.**

**I. Injection (32% of Vulnerabilities)**

* **SQL Injection:**
    * [ ] Input validation for all user-supplied data entering SQL queries (parameterized queries are preferred).
    * [ ] Stored procedures are properly sanitized and validated.
    * [ ] Database user accounts have the principle of least privilege – only granting necessary permissions.
    * [ ] Regularly audit database access logs for suspicious activity.
* **NoSQL Injection:**
    * [ ]  Validate all inputs into NoSQL queries (e.g., MongoDB, Cassandra).
    * [ ] Utilize parameterized queries or prepared statements specific to your NoSQL database.
    * [ ] Implement data type checking to prevent unexpected data types in queries.


**II. Broken Authentication (29% of Vulnerabilities)**

* **Weak Passwords:**
    * [ ] Enforce strong password policies (minimum length, complexity, regular changes).
    * [ ] Implement Multi-Factor Authentication (MFA) wherever possible.
    * [ ] Store passwords securely using hashing algorithms with strong salts (e.g., bcrypt, Argon2).
* **Session Management:**
    * [ ]  Use secure cookies (HTTPOnly, Secure attributes).
    * [ ]  Regenerate session IDs after login and critical actions.
    * [ ]  Set appropriate session timeout values.
    * [ ]  Protect session data from unauthorized access.
* **Insecure Authentication Exchange:**
    * [ ]  Use HTTPS for all authentication traffic.
    * [ ]  Validate the source of authentication tokens (e.g., using signatures).

**III. Sensitive Data Exposure (16% of Vulnerabilities)**

* **Data in Transit:**
    * [ ]  All sensitive data must be transmitted over HTTPS.
    * [ ]  Implement TLS 1.2 or higher.
* **Data at Rest:**
    * [ ]  Encrypt sensitive data stored in databases, files, and backups.
    * [ ]  Use strong encryption algorithms (AES-256 or equivalent).
    * [ ]  Implement access controls to restrict access to sensitive data.
* **Data Leakage (Logs, Debugging):**
    * [ ]  Disable verbose logging in production environments.
    * [ ]  Review logging configurations to ensure no sensitive data is being logged.
    * [ ]  Secure debug and development environments – limit access and prevent logging of credentials.


**IV. Broken Access Control (13% of Vulnerabilities)**

* **Missing Function Level Access Control:**
    * [ ]  Implement access control checks for all user actions and data access.
    * [ ]  Use role-based access control (RBAC) or attribute-based access control (ABAC).
* **Insecure Direct Object Reference (IDOR):**
    * [ ]  Don’t expose internal object references directly in URLs or API requests.
    * [ ]  Use indirect references (opaque identifiers) instead.
* **Privilege Escalation:**
    * [ ]  Enforce the principle of least privilege.
    * [ ]  Carefully review and restrict administrative capabilities.


**V. Security Misconfiguration (13% of Vulnerabilities)**

* **Default Credentials:**
    * [ ]  Change all default usernames and passwords immediately.
    * [ ]  Implement a process for managing and rotating default credentials.
* **Unnecessary Features Enabled:**
    * [ ]
