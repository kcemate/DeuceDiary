# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-05T10:30:18.563451

## OWASP Top 10 Security Checklist

This checklist covers the key areas of the OWASP Top 10 vulnerabilities, designed to help you assess and improve the security posture of your web applications. It's divided into categories for easier management and should be adapted to your specific application and environment.

**I. Injection (SQL, XSS, Command Injection, LDAP)**

* **[ ] Vulnerability Identification:**
    * **SQL Injection:** Utilize automated scanners (e.g., OWASP ZAP, Burp Suite) and manual code review to identify potential SQL injection points in database interactions.
    * **Cross-Site Scripting (XSS):**  Test all user input that’s output to a web page (including error messages) for potential XSS vulnerabilities.
    * **Command Injection:** Review code that executes external commands for user-supplied input that could be manipulated to execute malicious commands.
    * **LDAP Injection:** Analyze all LDAP queries for vulnerabilities related to user-supplied input.
* **[ ] Mitigation Strategies:**
    * **Parameterized Queries/Prepared Statements:** Always use parameterized queries or prepared statements to sanitize user input before sending it to the database.
    * **Input Validation & Sanitization:** Rigorously validate and sanitize all user input at the application level, ensuring data conforms to expected formats and ranges.
    * **Output Encoding:** Encode data before displaying it in the browser to prevent XSS attacks.
    * **Least Privilege:**  Grant database users only the necessary privileges.
    * **Web Application Firewalls (WAFs):** Implement WAFs to filter malicious requests.

**II. Broken Authentication**

* **[ ] Weak Password Policies:**  Enforce strong password policies (minimum length, complexity, expiration).
* **[ ] Multi-Factor Authentication (MFA):** Implement MFA for all users, particularly those with privileged access.
* **[ ] Session Management:**
    * **Secure Session IDs:** Use strong, unpredictable session IDs.
    * **Session Expiration:**  Implement appropriate session expiration times.
    * **Session Regeneration:** Regenerate session IDs after successful login to prevent session fixation attacks.
    * **HttpOnly Flag:** Set the `HttpOnly` flag on session cookies to prevent JavaScript access.
* **[ ] Rate Limiting:**  Implement rate limiting to protect against brute-force attacks.
* **[ ] Account Lockout:** Implement account lockout mechanisms after repeated failed login attempts.


**III. Sensitive Data Exposure**

* **[ ] Data Classification:** Identify and categorize sensitive data (PII, financial information, etc.).
* **[ ] Encryption at Rest:** Encrypt sensitive data stored in databases, file systems, and backups.
* **[ ] Encryption in Transit:**  Enforce HTTPS for all communication.  Verify TLS configuration (strong ciphers, certificate validation).
* **[ ] Data Masking/Redaction:**  Mask or redact sensitive data in non-production environments.
* **[ ] Access Controls:** Implement strict access controls to limit data access to authorized personnel.  Regularly review access permissions.

**IV. Broken Access Control**

* **[ ] Role-Based Access Control (RBAC):**  Implement RBAC to define user roles and permissions.
* **[ ] Authorization Checks:** Ensure thorough authorization checks are performed before granting access to resources.
* **[ ] Cross-Site Scripting (XSS) Vulnerabilities:** (This overlaps with Injection) XSS can be leveraged to bypass access controls.
* **[ ] State Management Issues:**  Securely manage session state to prevent unauthorized access or modification.
* **[ ] Default Access Control:** Review and remove all default access controls.



**V. Security Misconfiguration**

* **[ ] Default Credentials:** Change all default credentials for applications, databases
