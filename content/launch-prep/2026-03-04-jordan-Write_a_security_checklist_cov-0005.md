# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-04T00:05:46.579844

## OWASP Top 10 Security Checklist

This checklist focuses on mitigating risks associated with the OWASP Top 10 vulnerabilities. It's designed to be a starting point and should be tailored to your specific application, infrastructure, and risk tolerance.

**I. Injection (A1 – 8% of Vulnerabilities)**

* **[ ] Input Validation:** Implement robust input validation on *all* user-supplied data (GET, POST, cookies, headers, etc.). This includes:
    * **Whitelist Validation:**  Prefer defining allowed characters, patterns, and lengths.
    * **Blacklist Validation:** (Less effective) Filter out known malicious characters or patterns.
    * **Server-Side Validation:**  *Crucially*, validate data on the server-side as client-side validation can be easily bypassed.
* **[ ] Parameterized Queries/Prepared Statements:**  Always use parameterized queries or prepared statements when interacting with databases to prevent SQL Injection.
* **[ ] Command Injection Prevention:** Carefully sanitize and validate all user input used in system commands. Utilize alternative methods whenever possible (e.g., using library functions instead of shell commands).
* **[ ] XML External Entity (XXE) Prevention:** Disable external entity resolution in XML parsers or use a secure alternative.

**II. Broken Authentication (A2 – 7% of Vulnerabilities)**

* **[ ] Strong Password Policies:** Enforce strong password policies:
    * Minimum length
    * Character complexity (uppercase, lowercase, numbers, symbols)
    * Password reuse prevention
* **[ ] Multi-Factor Authentication (MFA):**  Implement MFA for all users, especially privileged accounts.
* **[ ] Secure Session Management:**
    * Generate strong, random session IDs.
    * Properly expire sessions after inactivity.
    * Protect session IDs from exposure (e.g., don't store them in URLs).
* **[ ] Rate Limiting:**  Implement rate limiting to prevent brute-force attacks on login endpoints.
* **[ ] Account Lockout:** Lock out accounts after failed login attempts.
* **[ ] OAuth/OpenID Connect Implementation:**  Follow best practices when using OAuth/OpenID Connect, including validating responses and protecting access tokens.


**III. Sensitive Data Exposure (A3 – 6% of Vulnerabilities)**

* **[ ] Data Classification:** Identify and classify sensitive data (e.g., PII, financial data, health information).
* **[ ] Encryption at Rest:** Encrypt sensitive data stored in databases, file systems, and backups.
* **[ ] Encryption in Transit:** Use HTTPS/TLS for all data transmission, ensuring proper certificate validation.
* **[ ] Data Masking/Tokenization:**  Mask or tokenize sensitive data when it's not needed in its raw form.
* **[ ] Secure Logging & Monitoring:**  Log all access to sensitive data for auditing and incident response.
* **[ ] Regular Data Audits:** Regularly audit data access and usage to identify potential vulnerabilities.

**IV. Broken Access Control (A4 – 6% of Vulnerabilities)**

* **[ ] Principle of Least Privilege:**  Grant users only the minimum level of access required to perform their tasks.
* **[ ] Role-Based Access Control (RBAC):** Implement RBAC to manage access based on user roles.
* **[ ] Authorization Checks:**  Always perform authorization checks *before* granting access to resources.
* **[ ] Segmented Access:** Divide applications into segments with appropriate access controls for each segment.
* **[ ] XSS Protection:** Implement measures to prevent Cross-Site Scripting (see XSS in the next category).


**V. Cross-Site Scripting (XSS) (A5 – 8% of Vulnerabilities)**

* **[ ]
