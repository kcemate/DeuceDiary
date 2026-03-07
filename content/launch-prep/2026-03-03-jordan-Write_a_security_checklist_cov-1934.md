# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-03T19:34:12.946574

Okay, here's a comprehensive security checklist covering the OWASP Top 10 vulnerabilities, categorized for clarity and including recommended checks and controls. This checklist is designed to be a starting point and should be tailored to your specific application and environment.

**Important Disclaimer:** This checklist is a guide and doesn't guarantee security.  It requires ongoing monitoring, vulnerability scanning, penetration testing, and a culture of security awareness.

---

**OWASP Top 10 Security Checklist**

**1. Injection (SQL, Command, etc.)**

* **Description:** Attackers inject malicious code (SQL, Command) into an application to manipulate the database or server.
* **Checks:**
    * **Input Validation:**  Strictly validate all user input (including hidden fields, URLs, cookies).  Use whitelisting (allow only known good characters/patterns) rather than blacklisting (block known bad characters).
    * **Parameterized Queries/Prepared Statements:** *Always* use parameterized queries or prepared statements to prevent SQL injection.
    * **Stored Procedures:** Utilize stored procedures (with parameterized input) whenever possible.
    * **Escaping/Encoding:** If parameterized queries aren’t feasible, rigorously escape/encode all data before use.  Understand the specific escaping rules for your database.
    * **Least Privilege:** Ensure database users have only the necessary permissions.
* **Controls:**
    * Implement input validation libraries.
    * Utilize a database ORM with built-in protection.
    * Regularly review and update database permissions.


**2. Broken Authentication**

* **Description:** Weak or missing authentication mechanisms lead to unauthorized access.
* **Checks:**
    * **Strong Passwords:** Enforce strong password policies (minimum length, complexity).
    * **Multi-Factor Authentication (MFA):** Implement MFA for all users, especially administrators.
    * **Rate Limiting:**  Limit login attempts to prevent brute-force attacks.
    * **Session Management:** Securely manage user sessions (using strong, random tokens, HTTPOnly and Secure cookies, session expiration).
    * **Account Lockout:** Implement account lockout after multiple failed login attempts.
    * **Password Reset Functionality:**  Secure password reset flows – consider OTPs or challenges.
* **Controls:**
    * Use a robust authentication library.
    * Integrate with MFA providers.
    * Implement a rate limiting service.


**3. Sensitive Data Exposure**

* **Description:**  Unprotected storage, transmission, or display of sensitive information (PII, credentials, etc.).
* **Checks:**
    * **Data Classification:** Identify and classify all sensitive data.
    * **Encryption at Rest:** Encrypt sensitive data stored in databases, files, and backups.
    * **Encryption in Transit:** Use HTTPS (TLS/SSL) for all communication.
    * **Data Masking/Tokenization:** Mask or tokenize sensitive data when displayed or used in non-production environments.
    * **Access Control:** Implement granular access controls to limit data exposure.
    * **Secure File Storage:** Use secure storage solutions for sensitive files.
* **Controls:**
    * Use strong encryption algorithms.
    * Configure TLS/SSL properly.
    * Implement a data loss prevention (DLP) strategy.


**4. Broken Access Control**

* **Description:** Improper authorization mechanisms allow users to access resources they shouldn’t.
* **Checks:**
    * **Role-Based Access Control (RBAC):** Implement RBAC to control access based on user roles.
    * **Least Privilege:** Users should only have access to the resources they need.
    * **Check Authorization:** Always verify authorization before granting access to any resource.  Don’t rely solely on client-side controls.
    * **Session Enforcement:** Ensure
