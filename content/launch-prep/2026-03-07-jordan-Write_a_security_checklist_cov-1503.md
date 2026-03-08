# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-07T15:03:25.645989

## OWASP Top 10 Security Checklist - Comprehensive

This checklist covers the key aspects of mitigating risks associated with the OWASP Top 10 vulnerabilities. It's designed to be a starting point and should be tailored to your specific application and environment.  It's organized by vulnerability category for clarity.

**Note:** This is a high-level checklist. Each item requires deeper investigation and detailed procedures.

**I. Injection (A1, A2)**

* **SQL Injection:**
    * [ ] **Input Validation:** Are all user inputs rigorously validated against expected data types, lengths, and formats?  Use whitelisting (allowing only known good characters) rather than blacklisting (attempting to block known bad characters).
    * [ ] **Parameterized Queries/Prepared Statements:** Are parameterized queries or prepared statements consistently used for all database interactions?  This is the strongest defense.
    * [ ] **Least Privilege:**  Database users have minimal necessary permissions.
    * [ ] **Stored Procedure Usage:**  Consider using stored procedures for complex database logic to reduce direct user interaction with SQL.
    * [ ] **Regular Security Audits:**  Conduct regular SQL injection penetration tests.
* **NoSQL Injection:**
    * [ ] **Input Validation:** Similar to SQL Injection, rigorous validation of all NoSQL input.
    * [ ] **Parameterization:**  Employ parameterization techniques supported by the NoSQL database.
    * [ ] **Understand Data Models:**  Thoroughly understand your NoSQL data model and how input interacts with it.
    * [ ] **Regular Security Audits:**  Conduct regular NoSQL injection penetration tests.


**II. Authentication (A2, A3, A4)**

* **Broken Authentication:**
    * [ ] **Strong Password Policies:** Enforce strong password complexity rules (length, character types, etc.).
    * [ ] **Multi-Factor Authentication (MFA):** Implement MFA wherever possible, especially for privileged accounts.
    * [ ] **Account Lockout:** Implement account lockout mechanisms after multiple failed login attempts.
    * [ ] **Session Management:** Securely manage user sessions (HTTPS only, appropriate session timeout, secure session ID generation).
    * [ ] **Rate Limiting:** Limit login attempts to prevent brute-force attacks.
    * [ ] **Password Reset Mechanisms:** Secure password reset workflows – prevent account takeover.
* **Credential Stuffing:**
    * [ ] **Hashing with Salt:** Store passwords using strong hashing algorithms (e.g., bcrypt, Argon2) *with* a unique, randomly generated salt for each password.
    * [ ] **Monitor for Leaked Credentials:**  Monitor for compromised credentials and implement immediate account disabling.
    * [ ] **Rate Limiting:**  Limit the number of password reset requests from a single IP address.
* **Security Misconfiguration:**
    * [ ] **Default Credentials:** Change all default credentials immediately.
    * [ ] **Unnecessary Services:** Disable and remove any unnecessary services or ports.
    * [ ] **Error Handling:**  Don't expose sensitive information in error messages.


**III. Sensitive Data Exposure (A5)**

* **Data in Transit:**
    * [ ] **HTTPS:** Enforce HTTPS for all sensitive data transmission. Use TLS 1.2 or higher.
    * [ ] **Certificate Validation:**  Properly validate SSL/TLS certificates.
    * [ ] **HSTS:** Implement HTTP Strict Transport Security (HSTS) to prevent downgrade attacks.
* **Data at Rest:**
    * [ ] **Encryption:**  Encrypt sensitive data at rest (database, storage, backups). Utilize strong encryption algorithms.
    * [ ] **Access Control:** Implement strict access control policies to limit data access to authorized personnel only.
    * [ ]
