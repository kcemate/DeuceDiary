# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-04T10:17:56.323901

## OWASP Top 10 Security Checklist

This checklist focuses on mitigating the risks associated with the OWASP Top 10 vulnerabilities. It’s designed to be a starting point and should be tailored to your specific application, technology stack, and risk tolerance.

**Note:** This is a comprehensive checklist. Not all items will be relevant to every application. Prioritize based on your risk assessment and the level of sensitivity of your data.

**I. Injection (36.6% of Web App Vulnerabilities)**

* [ ] **Input Validation:**
    * [ ] Implement strict input validation on *all* user input (forms, URLs, API requests, database queries, etc.) at the application level, database level, and network level where possible.
    * [ ] Use a whitelist approach – define what is *allowed*, not what is *forbidden*.
    * [ ] Employ parameterized queries or prepared statements for all database interactions.
    * [ ] Escaping should be used as a last resort, never as a primary defense.
* [ ] **Stored Injection:**
    * [ ] Properly sanitize and validate user-generated content (UGC) stored in databases.
    * [ ] Implement Content Security Policy (CSP) to restrict the sources of scripts and other resources.
* [ ] **SQL Injection:** (A specific form of Stored Injection)
    * [ ] Confirm all database connections utilize appropriate authentication and authorization.
    * [ ] Regularly audit database user permissions.


**II. Broken Authentication (16.2% of Web App Vulnerabilities)**

* [ ] **Strong Password Policies:**
    * [ ] Enforce strong password policies: minimum length, complexity requirements, and regular password changes.
    * [ ] Consider multi-factor authentication (MFA) for all users, especially administrators.
* [ ] **Session Management:**
    * [ ] Use secure session management practices:
        * [ ] Generate strong, random session IDs.
        * [ ] Securely store session data.
        * [ ] Implement session timeout mechanisms.
        * [ ] Regenerate session IDs after authentication.
        * [ ] Consider using secure cookies (HttpOnly, Secure).
* [ ] **Authentication Logic:**
    * [ ] Avoid storing passwords in plain text. Use strong hashing algorithms (e.g., bcrypt, Argon2).
    * [ ] Implement proper user account lockout mechanisms after multiple failed login attempts.
    * [ ] Regularly review and update authentication protocols.


**III. Sensitive Data Exposure (13.3% of Web App Vulnerabilities)**

* [ ] **Data Classification:** Identify and classify sensitive data (PII, PHI, financial data, etc.).
* [ ] **Encryption:**
    * [ ] Encrypt sensitive data at rest and in transit.
    * [ ] Use strong encryption algorithms and key management practices.
* [ ] **Token Management:** Securely generate, store, and manage tokens (API keys, OAuth tokens) – rotate regularly.
* [ ] **Logging & Monitoring:**  Log access to sensitive data and monitor for suspicious activity.
* [ ] **Data Masking/Redaction:** Use data masking or redaction techniques for non-production environments.



**IV. XML External Entities (XXE) (8.5% of Web App Vulnerabilities)**

* [ ] **Disable External Entity Processing:**  Disable the processing of external entities in XML parsers.
* [ ] **Input Validation:**  Validate XML input thoroughly – restrict the permitted character sets and potential URL schemes.
* [ ] **Use Safe XML Libraries:**  Utilize XML libraries with built-in protection against XXE vulnerabilities.


**V. Broken Access Control (8.4% of Web App Vulnerabilities)**

* [ ] **Principle of Least Privilege:**  Grant users
