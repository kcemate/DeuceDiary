# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-03T18:03:36.936376

## OWASP Top 10 Security Checklist - Comprehensive

This checklist covers the major vulnerabilities outlined in the OWASP Top 10 (as of October 2023). It's designed to be a starting point and should be tailored to your specific application and environment.

**I. Injection (A - 10%)**

* **[ ] Input Validation:** Are all user inputs validated at every point of entry? (Client-side validation is *not* sufficient.)
    * **[ ] Blacklists:** Are blacklists used to reject known malicious input? (While helpful, blacklists are often bypassed.)
    * **[ ] Whitelists:** Are whitelists used to define acceptable input formats and values? (Preferred approach.)
    * **[ ] Input Sanitization:**  Is input sanitized to remove potentially harmful characters *before* processing?
* **[ ] Parameterized Queries:** Are SQL queries constructed using parameterized queries or prepared statements? (This prevents SQL injection.)
* **[ ] Command Injection:**  Are user-supplied values properly escaped when used in system commands?
* **[ ] NoSQL Injection:**  Are user inputs carefully validated and escaped when interacting with NoSQL databases?
* **[ ] LDAP Injection:**  Are user inputs validated against LDAP queries?


**II. Broken Authentication (B - 14%)**

* **[ ] Strong Passwords:**  Do you enforce strong password policies (minimum length, complexity, etc.)?
* **[ ] Multi-Factor Authentication (MFA):** Is MFA implemented for all users, particularly administrators?
* **[ ] Password Storage:** Are passwords stored securely using strong hashing algorithms (e.g., bcrypt, Argon2) with salting? *Never* store passwords in plain text.
* **[ ] Session Management:**
    * **[ ] Secure Session IDs:**  Are session IDs randomly generated and securely stored?
    * **[ ] Session Timeout:**  Is there a reasonable session timeout implemented?
    * **[ ] Session Hijacking Prevention:**  Are techniques like HTTPOnly and Secure flags set on cookies?
* **[ ] Account Lockout:**  Is there an account lockout mechanism in place to prevent brute-force attacks?
* **[ ]  Password Reset Mechanisms:** Are password reset mechanisms secure and resistant to abuse? (Consider using time-based OTPs.)



**III. Sensitive Data Exposure (C - 8%)**

* **[ ] Data Classification:**  Is sensitive data identified and classified based on its risk level?
* **[ ] Encryption at Rest:** Is sensitive data encrypted when stored? (Database, file systems, backups)
* **[ ] Encryption in Transit:** Is all sensitive data transmitted over HTTPS (TLS/SSL)? (Ensure proper certificate management).
* **[ ] Data Masking/Tokenization:**  Are sensitive data masked or tokenized when displayed or used in non-production environments?
* **[ ] Secure Storage of Secrets:**  Are API keys, database passwords, and other secrets stored securely using a secrets management system (e.g., HashiCorp Vault, AWS Secrets Manager)? *Never* hardcode secrets.
* **[ ] Data Loss Prevention (DLP) Controls:** Are DLP controls in place to prevent unauthorized data leakage?



**IV. Broken Access Control (D - 6%)**

* **[ ] Principle of Least Privilege:** Are users and applications granted only the minimum necessary permissions to perform their tasks?
* **[ ] Role-Based Access Control (RBAC):** Is RBAC implemented to manage access control based on roles?
* **[ ] Authorization Checks:** Are all access requests validated to ensure the user has the required permissions *before* granting access? (Validate at *every* layer).
* **[ ]  Cross-Site Scripting (XSS
