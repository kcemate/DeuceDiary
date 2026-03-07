# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-03T21:27:23.774496

## OWASP Top 10 Security Checklist - Comprehensive

This checklist covers the OWASP Top 10 vulnerabilities and provides a framework for assessing and mitigating risks in your application. It’s designed to be a starting point and should be adapted based on your specific application, environment, and threat model.

**Note:** This is a high-level checklist. Each section requires more detailed investigation and potentially tooling for a thorough assessment.

**I. Injection (A1, A2, A6)**

* **SQL Injection (A1):**
    * [ ] Are all user inputs sanitized and validated against expected data types and formats *before* being used in SQL queries?
    * [ ] Are parameterized queries or prepared statements used consistently to prevent the interpretation of input as SQL code?
    * [ ] Are database users granted only the minimum necessary privileges? (Least Privilege Principle)
    * [ ] Are database connections secured with proper credentials and connection limits?
* **NoSQL Injection (A2):**
    * [ ]  Similar to SQL Injection - are all user inputs validated and sanitized before being used in NoSQL queries?
    * [ ]  Are appropriate escaping mechanisms used for each NoSQL database type? (e.g., MongoDB escaping)
    * [ ]  Is the data model designed to minimize the risk of injection vulnerabilities?
* **OS Command Injection (A6):**
    * [ ] Are shell commands constructed dynamically from user input?  (Ideally, avoid entirely!)
    * [ ] If dynamic command construction is necessary, are all user inputs carefully escaped and validated to prevent command execution?
    * [ ]  Are alternative, safer methods explored (e.g., using a library to execute commands)?


**II. Authentication (A2, A3, A7)**

* **Broken Authentication (A2):**
    * [ ] Are strong passwords enforced, including length, complexity, and enforced rotation policies?
    * [ ] Is multi-factor authentication (MFA) implemented for sensitive accounts?
    * [ ] Are session management practices secure (e.g., using secure cookies, short session timeouts, and regular session invalidation)?
    * [ ] Are weak or default credentials avoided?
* **Cryptographic Failures (A3):**
    * [ ] Are strong, modern encryption algorithms used for sensitive data (e.g., JWTs, API keys)?
    * [ ] Are cryptographic keys securely generated, stored, and rotated?  (Hardware Security Modules - HSMs are recommended for critical keys)
    * [ ] Is appropriate hashing algorithms used for passwords (e.g., Argon2, bcrypt)?
    * [ ] Are data transmitted over HTTPS with valid TLS certificates?
* **Broken Access Control (A7):**
    * [ ] Are access controls implemented consistently across the application and API endpoints?
    * [ ] Are authorization checks performed on *every* request to ensure users only access resources they are permitted to view/modify?
    * [ ] Are role-based access control (RBAC) or attribute-based access control (ABAC) mechanisms implemented?
    * [ ] Is proper cross-site scripting (XSS) protection implemented to prevent attackers from manipulating user sessions?



**III. Sensitive Data Exposure (A5)**

* [ ] Is sensitive data (PII, API keys, passwords) properly encrypted both in transit and at rest?
* [ ] Are appropriate data masking and tokenization techniques used to protect sensitive data in non-production environments?
* [ ] Are logging practices secure, avoiding the logging of sensitive data?
* [ ] Are secure storage mechanisms used for storing sensitive data (e.g., AWS KMS, Azure Key Vault)?



**IV. Interaction Failure (A4)**

* [ ] Are error messages generic and do
