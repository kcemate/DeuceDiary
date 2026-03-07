# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-03T07:52:53.322757

## OWASP Top 10 Security Checklist - Comprehensive

This checklist is designed to help you assess your application's security posture against the OWASP Top 10 vulnerabilities. It's a starting point and should be tailored to your specific application and environment. **Regularly review and update this checklist.**

**I. Injection (A1 – High Priority)**

* **[ ] Input Validation:**
    *  All user inputs are validated on both the client and server-side.
    *  Input validation utilizes whitelisting (allowing known good inputs) instead of blacklisting (blocking known bad inputs).
    *  Input validation is tailored to the expected data type and format.
* **[ ] Parameterized Queries:**
    *  Stored procedures and parameterized queries are used instead of string concatenation to build queries.
    *  Database connection pooling is properly configured to prevent vulnerabilities.
* **[ ] Escaping/Encoding:**
    *  All outputs are properly escaped/encoded to prevent injection attacks.
* **[ ]  Stored Procedures:**  (Where appropriate)  Employ stored procedures for data access to reduce exposure.


**II. Broken Authentication (A2 – High Priority)**

* **[ ] Strong Password Policies:**
    *  Enforce minimum password length and complexity requirements.
    *  Password policies are regularly reviewed and updated.
* **[ ] Multi-Factor Authentication (MFA):**
    *  Implement MFA where appropriate, especially for sensitive accounts.
* **[ ] Secure Session Management:**
    *  Session IDs are generated cryptographically.
    *  Session timeouts are configured to prevent session hijacking.
    *  Session management cookies are marked as HTTP-only and Secure.
* **[ ]  Account Lockout:**  Implement account lockout mechanisms after failed login attempts.
* **[ ]  Password Reset Functionality:** Secure password reset process, often involving email verification and strong temporary passwords.



**III. Sensitive Data Exposure (A3 – High Priority)**

* **[ ] Data Classification:** Identify and classify sensitive data (e.g., PII, financial information).
* **[ ] Data Encryption at Rest:** Sensitive data is encrypted at rest using strong encryption algorithms.
* **[ ] Data Encryption in Transit:**  All communication involving sensitive data is encrypted using TLS/SSL.
* **[ ]  Secure Storage:** Sensitive data is stored securely, with access controls in place.
* **[ ]  Tokenization/Masking:**  Consider using tokenization or data masking techniques where possible.
* **[ ]  Regular Security Audits:** Conduct regular audits to identify and address vulnerabilities related to sensitive data.



**IV. Broken Access Control (A4 – High Priority)**

* **[ ] Principle of Least Privilege:** Users and applications are granted only the minimum necessary access rights.
* **[ ] Role-Based Access Control (RBAC):**  Implement RBAC to manage access based on roles and responsibilities.
* **[ ] Input Validation for Access Control:** Validate all inputs used to control access.
* **[ ] Cross-Site Scripting (XSS) Prevention:** Implement measures to prevent XSS attacks, which can bypass access control.
* **[ ]  API Security:** Secure APIs with appropriate authentication and authorization mechanisms.



**V. Injection (A5 – High Priority) - *Repeat from Section I, just in case you missed something***



**VI. Insecure Deserialization (A6 – Medium Priority)**

* **[ ] Avoid Deserialization:**  Where possible, avoid deserializing untrusted data.
* **[ ]  Safe Deserialization Libraries:**  If deserialization is necessary, use well-established and secure libraries that handle data validation and sanitization.
* **[ ]  Input Validation:** Validate the data being deserialized
