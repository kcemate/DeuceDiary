# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-03T06:22:59.106790

## OWASP Top 10 Security Checklist

This checklist covers the key areas of the OWASP Top 10 vulnerabilities. It's designed to be a starting point and should be adapted to your specific application and environment.  **This is not a comprehensive security audit; it's a checklist to guide your testing and security efforts.**

**I. Injection (A - 14% of vulnerabilities)**

* **[ ] Input Validation:**  Are *all* user inputs (forms, URL parameters, cookies, headers) validated before being processed?
    * **[ ] White listing:** Are allowed characters/patterns explicitly defined? (Preferred over blacklisting)
    * **[ ] Data Type Validation:** Are data types enforced (e.g., integer, email, date)?
    * **[ ] Length Restrictions:** Are input lengths limited to prevent buffer overflows and other issues?
* **[ ] Parameterized Queries (Prepared Statements):** Are database queries constructed using parameterized queries to prevent SQL injection? (Critical for all database interactions)
* **[ ] Output Encoding:** Is output properly encoded to prevent Cross-Site Scripting (XSS) when displaying user-supplied data?


**II. Broken Authentication (B - 14% of vulnerabilities)**

* **[ ] Strong Password Policies:** Are strong password policies enforced (minimum length, complexity, rotation)?
* **[ ] Multi-Factor Authentication (MFA):** Is MFA implemented for all critical accounts and systems?
* **[ ] Secure Session Management:** Are session IDs generated securely and managed correctly (HTTPOnly, Secure flags)?
* **[ ] Rate Limiting:** Is rate limiting implemented to prevent brute-force attacks on login attempts?
* **[ ] Account Lockout:** Is there an account lockout mechanism after multiple failed login attempts?
* **[ ] Password Reset Mechanisms:** Are password reset mechanisms secure and resistant to abuse?


**III. Sensitive Data Exposure (C - 13% of vulnerabilities)**

* **[ ] Data Classification:** Have you classified the sensitivity of data in your application?
* **[ ] Encryption at Rest:** Is sensitive data encrypted at rest (databases, file storage)?
* **[ ] Encryption in Transit:** Is all data transmitted over the network encrypted using HTTPS/TLS? (Ensure valid certificate)
* **[ ] Secure Storage of Credentials:** Are passwords and API keys stored securely (hashed and salted) and never committed to version control?
* **[ ] Data Masking/Tokenization:** Are sensitive data masked or tokenized where appropriate (e.g., in logs, development environments)?


**IV. XML External Entities (XXE) (D - 12% of vulnerabilities)**

* **[ ] Disable XXE Processing:** Has the application been configured to disable processing of external entities in XML parsers? (This is the most effective mitigation)
* **[ ] Input Validation:** If disabling XXE is not possible, are XML inputs rigorously validated?


**V. Broken Access Control (E - 10% of vulnerabilities)**

* **[ ] Role-Based Access Control (RBAC):** Is RBAC implemented to control access to resources based on user roles?
* **[ ] Authorization Checks:** Are authorization checks performed *before* each access attempt, not just on initial login? (Principle of Least Privilege)
* **[ ] Cross-Site Scripting (XSS) Prevention:** (See also Injection - XSS is a type of Broken Access Control)
* **[ ] API Authorization:**  Are API endpoints properly authenticated and authorized using appropriate methods (e.g., JWT, OAuth)?


**VI. Insecure Deserialization (F - 8% of vulnerabilities)**

* **[ ] Avoid Deserialization:**  Minimize the use of deserialization, particularly with untrusted data.
* **[ ]
