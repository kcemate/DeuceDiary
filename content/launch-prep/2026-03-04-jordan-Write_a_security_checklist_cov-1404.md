# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-04T14:04:34.790586

## OWASP Top 10 Security Checklist - A Comprehensive Guide

This checklist is designed to help you systematically assess your web application for vulnerabilities based on the OWASP Top 10. It’s a starting point and should be adapted to your specific application and environment.

**I. Injection (33%)**

* **SQL Injection:**
    * [ ] Are all user inputs validated and sanitized before being used in SQL queries?
    * [ ] Are parameterized queries or prepared statements consistently used to prevent dynamic SQL construction?
    * [ ] Are database user accounts limited to the minimum necessary privileges?
    * [ ] Are stored procedures used to encapsulate database logic and prevent direct user interaction with SQL?
* **NoSQL Injection:**
    * [ ] Are all user inputs validated and sanitized before being used in NoSQL queries (e.g., MongoDB)?
    * [ ] Are parameterized queries or prepared statements consistently used for NoSQL operations?
    * [ ] Are appropriate access control measures implemented for NoSQL databases?
* **Command Injection:**
    * [ ] Are all user inputs carefully scrutinized before being used to execute system commands?
    * [ ] Is the use of system commands strictly limited to essential functions and controlled?
    * [ ] Are appropriate input validation and sanitization techniques employed to prevent command injection attacks?


**II. Authentication (25%)**

* **Broken Authentication:**
    * [ ] Are strong password policies enforced (length, complexity, rotation)?
    * [ ] Is multi-factor authentication (MFA) implemented, especially for privileged accounts?
    * [ ] Is account lockout implemented after multiple failed login attempts?
    * [ ] Is session management secure (e.g., secure cookies, proper session expiration)?
    * [ ] Is credential storage done securely (e.g., hashing with strong salts)?
    * [ ] Are session IDs generated securely and regularly rotated?
* **Credential Stuffing/Brute Force:**
    * [ ] Are rate limiting mechanisms in place to prevent brute-force attacks?
    * [ ] Is account lockout implemented after repeated failed login attempts?
    * [ ] Are CAPTCHAs or similar challenges used to prevent automated attacks?


**III. Sensitive Data Exposure (20%)**

* **Data at Rest:**
    * [ ] Is sensitive data (PII, financial information) encrypted both in transit and at rest?
    * [ ] Are access controls implemented to restrict access to sensitive data based on the principle of least privilege?
    * [ ] Are backups of sensitive data secured and protected against unauthorized access?
* **Data in Transit:**
    * [ ] Is all communication between the client and server encrypted using TLS/SSL with strong ciphers?
    * [ ] Are HTTPS enforced for all web traffic?
    * [ ] Are vulnerable TLS/SSL protocols disabled?


**IV. Broken Access Control (14%)**

* **Insecure Direct Object References (IDOR):**
    * [ ]  Are all object references (IDs, filenames, etc.) validated before being used to access resources?
    * [ ]  Is access control implemented to ensure users can only access resources they are authorized to access?
* **Missing Function Level Access Control:**
    * [ ] Are function-level access controls implemented to restrict access to specific functions based on user roles?
    * [ ] Is input validation performed to ensure users are only able to perform actions they are permitted to perform?
* **Privilege Escalation:**
    * [ ] Are there safeguards in place to prevent users from escalating their privileges?
    * [ ] Are administrative interfaces protected with strong authentication and authorization controls?


**V. XML External Entities (XXE) (6%)**

* [ ] Are all XML inputs validated to prevent
