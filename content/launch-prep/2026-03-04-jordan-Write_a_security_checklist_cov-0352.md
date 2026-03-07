# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-04T03:52:26.342826

Okay, here's a security checklist covering the OWASP Top 10, designed to be a starting point. It's broken down by category and includes considerations for both developers and operations teams. **This is a high-level checklist and should be adapted and expanded based on your specific application, technology stack, and risk tolerance.**

**I. Injection (A1 – 10% of vulnerabilities)**

* **☐ Input Validation:**
    *   Are all user inputs rigorously validated on both the client-side and, crucially, the server-side?
    *   Use a whitelist approach – only allow known good characters and formats.
    *   Implement validation routines for data types, lengths, and formats.
* **☐ Parameterized Queries/Prepared Statements:**
    *   Are all database queries using parameterized queries or prepared statements to prevent SQL injection? (Absolutely critical!)
    *   Avoid using string concatenation for building SQL queries.
* **☐ Escaping Output:**
    *   Is output properly escaped before being displayed to the user or used in other contexts (e.g., JavaScript, XML)?  This prevents cross-site scripting (XSS) vulnerabilities, which are often a result of injection vulnerabilities.



**II. Broken Authentication (A2 – 13% of vulnerabilities)**

* **☐ Strong Password Policies:**
    *   Enforce strong password policies (minimum length, complexity, regular changes).
    *   Use a password strength meter to provide user feedback.
* **☐ Multi-Factor Authentication (MFA):**
    *   Implement MFA wherever possible, especially for sensitive accounts.
* **☐ Session Management:**
    *   Use secure session IDs (long, random, unpredictable).
    *   Implement session timeouts.
    *   Invalidate sessions on logout.
    *   Securely store session data.
* **☐ Rate Limiting:**
    *   Implement rate limiting to prevent brute-force attacks on login pages.
* **☐ Account Lockout:**
    *   Enforce account lockout after a certain number of failed login attempts.


**III. Sensitive Data Exposure (A3 – 13% of vulnerabilities)**

* **☐ Data Classification:**
    *   Identify and classify sensitive data (PII, HIPAA, etc.).
* **☐ Encryption in Transit:**
    *   Use HTTPS (TLS/SSL) for all sensitive data transmission.  Verify the certificate!
* **☐ Encryption at Rest:**
    *   Encrypt sensitive data stored in databases, files, and backups.
* **☐ Access Controls:**
    *   Implement strict access controls based on the principle of least privilege.  Restrict access to sensitive data based on the need-to-know basis.
* **☐ Data Masking/Tokenization:**
    *   Consider using data masking or tokenization for non-production environments.



**IV. Broken Access Control (A4 – 13% of vulnerabilities)**

* **☐ Authorization Checks:**
    *   Are authorization checks performed consistently across all application logic?  Don’t rely solely on client-side checks.
* **☐ Role-Based Access Control (RBAC):**
    *   Implement RBAC to manage user permissions effectively.
* **☐ Session Scoping:**
    *   Ensure session scope is properly enforced to prevent unauthorized access.
* **☐ Cross-Site Scripting (XSS) prevention:** (Often a root cause) - Thoroughly validate and escape all user input.
* **☐ API Access Controls:**  If your application exposes APIs, ensure robust access control mechanisms are in place.



**V. Security Misconfiguration (A5 – 17% of vulnerabilities)**

* **☐ Default Configurations:**
    *   Change default passwords and configurations immediately.
    *   Remove or disable
