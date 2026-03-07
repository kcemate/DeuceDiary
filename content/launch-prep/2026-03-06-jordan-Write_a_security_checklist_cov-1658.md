# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-06T16:58:44.189141

## Security Checklist - Covering OWASP Top 10

This checklist aims to help you assess your web application's security posture based on the OWASP Top 10 vulnerabilities. It's a starting point and should be tailored to your specific application and environment.

**Note:** This is a high-level checklist. Each item requires further investigation and detailed testing.

**I. Injection (20%)**

* **[ ] SQL Injection:**
    * **Input Validation:** Are all user inputs validated against expected types, lengths, and patterns?
    * **Parameterized Queries/Prepared Statements:** Are you using parameterized queries or prepared statements to prevent malicious SQL code from being executed?
    * **Stored Procedures:** Are you utilizing stored procedures for database interaction?
    * **Least Privilege:** Do database users have only the necessary permissions?
* **[ ] NoSQL Injection:** (Especially important for NoSQL databases like MongoDB, Cassandra)
    * **Input Validation:** Similar to SQL Injection – strict input validation is crucial.
    * **Data Sanitization:**  Sanitize user input to remove potentially malicious NoSQL commands.
    * **Query Parameterization:** Utilize parameterized queries or equivalent mechanisms for NoSQL databases.


**II. Broken Authentication (23%)**

* **[ ] Weak Passwords:**
    * **Password Policies:** Are strong password policies enforced (minimum length, complexity, history)?
    * **Password Storage:** Are passwords stored using a strong hashing algorithm (e.g., bcrypt, Argon2) with salts?  **Never store passwords in plaintext!**
* **[ ] Credential Stuffing:**
    * **Rate Limiting:** Are login attempts rate-limited to prevent brute-force attacks?
    * **Account Lockout:**  Is there a mechanism for temporarily locking accounts after failed login attempts?
* **[ ] Multi-Factor Authentication (MFA):**  Is MFA implemented for sensitive accounts?
* **[ ] Session Management:**
    * **Secure Session IDs:** Are session IDs generated securely and unpredictably?
    * **Session Timeout:** Are session timeouts configured to automatically log users out after inactivity?
    * **Session Fixation Protection:**  Are you mitigating session fixation attacks?


**III. Sensitive Data Exposure (15%)**

* **[ ] Data in Transit:**
    * **HTTPS:** Is your application using HTTPS (SSL/TLS) to encrypt all communication between the client and server? (Verify certificate validity and configuration)
* **[ ] Data at Rest:**
    * **Encryption:**  Is sensitive data encrypted at rest (e.g., database, backups)?
    * **Data Masking/Redaction:**  Are sensitive data fields masked or redacted in logs, reports, and user interfaces?
* **[ ]  Unprotected APIs:** Are APIs accessing sensitive data secured with proper authentication and authorization?


**IV. Broken Access Control (13%)**

* **[ ] Missing Function-Level Access Control:** Are all functionalities protected by access control checks?
* **[ ] Insecure Direct Object References (IDOR):**  Are users able to access resources by directly manipulating IDs (e.g., accessing another user's profile)?
* **[ ] Privilege Escalation:** Can a user with limited privileges gain elevated access?
* **[ ] Authorization Checks:**  Are authorization checks consistently implemented and enforced across the entire application?


**V. Security Misconfiguration (16%)**

* **[ ] Default Credentials:** Are default credentials removed from all systems and applications?
* **[ ] Unnecessary Services:** Are all unnecessary services and ports disabled?
* **[ ] Directory Listing:**  Is directory listing disabled to prevent attackers from discovering sensitive files?
* **[ ] Error Handling:**  Are error messages informative but not revealing of internal system details?
