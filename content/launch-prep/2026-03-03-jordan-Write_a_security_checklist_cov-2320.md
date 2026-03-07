# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-03T23:20:39.916895

## OWASP Top 10 Security Checklist - A Comprehensive Guide

This checklist is designed to help you assess your application's security posture against the OWASP Top 10 vulnerabilities. It’s a starting point, and you should tailor it to your specific application and environment.

**Frequency:** This checklist should be run regularly (e.g., quarterly, during deployments, and after significant changes).

**Sections:**

* **I. Injection:** (A1, A2)
* **II. Broken Authentication:** (A3, A9)
* **III. Sensitive Data Exposure:** (A4, A6)
* **IV. XML External Entities:** (A5)
* **V. Broken Access Control:** (A7)
* **VI. Security Misconfiguration:** (A8)
* **VII. Vulnerable and Outdated Components:** (A10)
* **VIII. Identification and Authentication Errors:** (B1)
* **IX. Rate Limiting:** (B2)
* **X. Insufficient Logging & Monitoring:** (B3)


---

**I. Injection (A1, A2):**

* **[ ] Input Validation:**  Are all user inputs rigorously validated, both on the client-side and, crucially, on the server-side? (Use whitelisting over blacklisting)
    * **Specific Checks:**  Sanitize SQL, Command, LDAP, and XPath inputs.
* **[ ] Parameterized Queries/Prepared Statements:** Are SQL queries using parameterized queries or prepared statements to prevent SQL injection? (Crucial for database security)
* **[ ] Escaping Output:**  Is output properly escaped to prevent Cross-Site Scripting (XSS)? (Focus on context-specific escaping - HTML, JavaScript, URL)
* **[ ] Web Application Firewall (WAF):**  Is a WAF in place to mitigate injection attacks? (Configure properly – not a replacement for secure coding)


**II. Broken Authentication (A3, A9):**

* **[ ] Strong Password Policies:** Are strong password policies enforced (minimum length, complexity, rotation)?
* **[ ] Multi-Factor Authentication (MFA):** Is MFA implemented where appropriate, particularly for sensitive accounts?
* **[ ] Secure Password Storage:**  Are passwords stored using strong hashing algorithms (e.g., bcrypt, Argon2) with salting?
* **[ ] Session Management:**  Are session IDs generated randomly, securely transmitted, and invalidated upon logout?  Is session timeout properly configured?
* **[ ] Brute-Force Protection:**  Are mechanisms in place to prevent brute-force attacks on login forms (e.g., rate limiting, CAPTCHAs)?
* **[ ] Password Reset Mechanisms:**  Are password reset mechanisms secure and resistant to abuse (e.g., verification emails, one-time passwords)?



**III. Sensitive Data Exposure (A4, A6):**

* **[ ] Data Classification:**  Is sensitive data properly classified and handled according to its sensitivity level?
* **[ ] Encryption at Rest:** Is sensitive data encrypted at rest in databases and storage systems?  (Use strong encryption algorithms)
* **[ ] Encryption in Transit:**  Is all sensitive data transmitted over HTTPS (TLS/SSL)? Are strong cipher suites enforced?
* **[ ] Data Masking/Tokenization:**  Are masking or tokenization techniques used for sensitive data in non-production environments?
* **[ ] Secure File Storage:** Are sensitive files stored securely (permissions, encryption) and access controlled?


**IV. XML External Entities (A5):**

* **[ ] Disable External Entities:**  Is the use of XML External Entities (XXE) disabled at the parser level in your application? (This is a major vulnerability)
