# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-03T23:43:13.918453

## OWASP Top 10 Security Checklist

This checklist covers the core vulnerabilities identified in the OWASP Top 10, designed to help you assess and improve the security posture of your web application.  It's a starting point – tailor it to your specific application and environment.

**Note:** This checklist focuses on *assessment* and *identification*.  It doesn't detail remediation steps (that’s a separate process).

**I. Injection (A1)**

* **[ ] Input Validation:** Are all user inputs rigorously validated at both the client-side and server-side?
    * **Specific Checks:**  Are we using allowlists (positive validation) rather than blocklists (negative validation)?
* **[ ] Parameterized Queries:** Are all database queries using parameterized queries or prepared statements? (This prevents SQL injection).
* **[ ] Output Encoding:**  Is all output properly encoded to prevent injection vulnerabilities in contexts like HTML, JavaScript, or CSS?
* **[ ] Error Handling:**  Do error messages reveal sensitive information like database schema or internal code? (Appropriate error handling hides this information).
* **[ ] Escaping:**  Is escaping used correctly when constructing dynamic content, particularly when combining user input with template strings?


**II. Broken Authentication (A2)**

* **[ ] Strong Passwords:** Is password complexity enforced (minimum length, character types)?
* **[ ] Multi-Factor Authentication (MFA):**  Is MFA implemented for sensitive operations? (Even basic MFA is better than none).
* **[ ] Session Management:** Are sessions secured properly?
    * **[ ] Session IDs:** Are session IDs generated randomly and securely?
    * **[ ] Session Expiration:** Are sessions expiring after a defined period of inactivity?
    * **[ ] Session Fixation Protection:** Are we mitigating session fixation attacks?
* **[ ] Account Lockout:** Is there a mechanism for locking out accounts after repeated failed login attempts?
* **[ ] Password Reset:** Is the password reset process secure and well-controlled? (Avoid exposing sensitive information during reset).
* **[ ] API Authentication:** Are APIs secured with strong authentication mechanisms (e.g., OAuth 2.0, JWT)?



**III. Sensitive Data Exposure (A3)**

* **[ ] Data Classification:** Have we identified and classified sensitive data within the application? (PII, PCI, HIPAA, etc.)
* **[ ] Data Encryption:** Is sensitive data encrypted both in transit (TLS/SSL) and at rest (database, file storage)?
* **[ ] Data Masking/Tokenization:** Are techniques like data masking or tokenization used to protect sensitive data in non-production environments?
* **[ ] Access Control:** Are appropriate access controls implemented to limit access to sensitive data based on the principle of least privilege?
* **[ ] Logging & Monitoring:** Are sensitive data accesses logged and monitored for anomalies?



**IV. Broken Access Control (A4)**

* **[ ] Role-Based Access Control (RBAC):**  Is RBAC implemented to control access to resources based on user roles?
* **[ ] Authorization Checks:** Are authorization checks performed *before* each request to ensure users have the necessary permissions? (Not just at the front-end).
* **[ ] Cross-Site Scripting (XSS) Bypass:** Are we preventing XSS attacks from being used to bypass authorization checks?
* **[ ] Privilege Escalation:** Are there any potential vulnerabilities for users to elevate their privileges? (e.g., insecure file permissions, default credentials)
* **[ ] Cross-Site Request Forgery (CSRF) Protection:**  Is CSRF protection implemented to prevent attackers from forging requests on behalf of authenticated users?



**V. Insecure Deserialization (A5)**
