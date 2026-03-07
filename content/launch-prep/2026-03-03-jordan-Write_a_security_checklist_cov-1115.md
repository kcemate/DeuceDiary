# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-03T11:15:50.126813

## Security Checklist Covering OWASP Top 10 (2021 Edition)

This checklist is designed to help you assess your application’s security posture against the OWASP Top 10 vulnerabilities. It’s a starting point and should be adapted to your specific application, technology stack, and risk tolerance.

**I. Injection (A1)** -  [https://owasp.org/www-community/top-10/A1_Injection](https://owasp.org/www-community/top-10/A1_Injection)

* **☐  Input Validation:** Implement robust input validation at *every* entry point (forms, APIs, command-line arguments, etc.).
    * **☐** Use whitelisting instead of blacklisting.  Define what's *allowed*, not what's *not allowed*.
    * **☐** Server-side validation is *required* - client-side validation is easily bypassed.
    * **☐**  Sanitize input for the specific context where it's used. (e.g., HTML escaping for display, SQL escaping for queries).
* **☐  Parameterized Queries/Prepared Statements:**  Use parameterized queries or prepared statements for all database interactions to prevent SQL injection.
* **☐  Appropriate Error Handling:**  Avoid displaying raw error messages that reveal database structures or internal system details.


**II. Broken Authentication (A2)** - [https://owasp.org/www-community/top-10/A2_Broken_Authentication](https://owasp.org/www-community/top-10/A2_Broken_Authentication)

* **☐  Strong Password Policies:** Enforce strong password requirements (length, complexity, history).
* **☐  Multi-Factor Authentication (MFA):** Implement MFA wherever possible.
* **☐  Secure Password Storage:**  Use a strong hashing algorithm (e.g., bcrypt, Argon2) with a unique salt for each password. *Never* store passwords in plain text.
* **☐  Session Management:** Implement secure session management (HTTPOnly, Secure flags, session timeouts, regeneration).
* **☐  Account Lockout:** Implement account lockout policies after multiple failed login attempts.
* **☐  Authentication API Security:** Secure APIs used for authentication, including proper rate limiting and input validation.



**III. Sensitive Data Exposure (A3)** - [https://owasp.org/www-community/top-10/A3_Sensitive_Data_Exposure](https://owasp.org/www-community/top-10/A3_Sensitive_Data_Exposure)

* **☐  Data Classification:** Identify and classify all sensitive data (PII, financial data, health records, etc.).
* **☐  Data Encryption:** Encrypt sensitive data both in transit (TLS/SSL) and at rest (database encryption, file encryption).
* **☐  Access Control:** Implement strict access control measures to limit access to sensitive data based on the principle of least privilege.
* **☐  Data Masking/Tokenization:**  Consider using data masking or tokenization for non-production environments or when sharing data with third parties.
* **☐  Regular Audits:** Regularly review access logs and audit trails to identify potential breaches.



**IV. Broken Access Control (A4)** - [https://owasp.org/www-community/top-10/A4_Broken_Access_Control](https://owasp.org/www-community/top-10/A4_Broken_Access_Control)

* **☐  Consistent Access Control Enforcement:** Enforce access control consistently across all application components and APIs.
* **☐  Authorization Mechanisms:** Implement robust authorization mechanisms (RBAC, ABAC) to
