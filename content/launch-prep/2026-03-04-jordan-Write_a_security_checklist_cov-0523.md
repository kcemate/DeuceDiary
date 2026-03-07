# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-04T05:23:05.514417

## OWASP Top 10 Security Checklist - Comprehensive

This checklist is designed to help you assess and improve the security posture of your application based on the OWASP Top 10 vulnerabilities. It’s a starting point – tailor it to your specific application, technology stack, and risk tolerance.

**Note:** This checklist is categorized by vulnerability severity (High, Medium, Low).

**I. Injection (High & Medium)**

* **SQL Injection:**
    * [ ] Input Validation: Are all user inputs validated against expected data types and formats?
    * [ ] Parameterized Queries/Stored Procedures: Are queries constructed using parameterized queries or stored procedures instead of string concatenation?
    * [ ] Escaping Output: Are output values properly escaped to prevent malicious code execution?
    * [ ] Database Permissions: Are database user accounts restricted to the minimum necessary privileges?
    * [ ] Use of ORM: Is an Object-Relational Mapper (ORM) used to abstract database interactions and reduce manual query writing?
* **NoSQL Injection:**
    * [ ] Input Validation:  Are all user inputs validated against expected data types and formats, considering the specific NoSQL database?
    * [ ] Parameterized Queries/Prepared Statements: Are queries constructed using parameterized queries or prepared statements, appropriate for the NoSQL database?
    * [ ] Escaping Output: Are output values properly escaped to prevent malicious code execution, considering the specific NoSQL database?


**II. Broken Authentication (High & Medium)**

* **Weak Password Policies:**
    * [ ] Password Complexity: Are password policies enforced for minimum length, character types (uppercase, lowercase, numbers, symbols)?
    * [ ] Password Storage: Are passwords stored securely using strong hashing algorithms (e.g., bcrypt, Argon2) with salts?  *Never* store passwords in plain text.
    * [ ] Account Lockout: Is there an account lockout mechanism after multiple failed login attempts?
* **Session Management:**
    * [ ] Secure Session IDs: Are session IDs randomly generated and securely transmitted?
    * [ ] Session Timeout: Are session timeouts configured to limit the window of opportunity for attackers?
    * [ ] Session Fixation Protection:  Are mechanisms in place to prevent session fixation attacks (e.g., regenerating session IDs after login)?
    * [ ] Insecure Session Storage: Are sessions stored securely on the server (avoid storing sensitive information in cookies).
* **Multi-Factor Authentication (MFA):**
    * [ ] Implement MFA: Is MFA enabled for all user accounts, especially those with elevated privileges?



**III. Sensitive Data Exposure (High & Medium)**

* **Insecure Storage:**
    * [ ] Data Classification: Have you classified your data based on sensitivity?
    * [ ] Encryption at Rest: Is sensitive data encrypted at rest using strong encryption algorithms (e.g., AES)?
    * [ ] Encryption in Transit: Is sensitive data encrypted in transit using TLS/SSL?  Verify certificate validity.
* **Insecure Transmission:**
    * [ ] TLS/SSL Configuration:  Is TLS/SSL properly configured with strong ciphers and protocols?
    * [ ] Avoid using HTTP:  Ensure all communication is over HTTPS.
* **Data Leakage via Logs:**
    * [ ] Log Masking: Are sensitive data elements masked or redacted in logs?
    * [ ] Log Access Control: Are logs accessible only to authorized personnel?


**IV. XML External Entities (XXE) (Medium & Low)**

* [ ] Disable External Entity Processing:  Is external entity processing disabled in XML parsers?
* [ ] Input Validation:  Validate XML input thoroughly to prevent malicious entities.
* [ ] Use a secure XML parser: Utilize a parser that explicitly disables external entity processing.


**V. Broken
