# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-04T08:24:24.990137

## OWASP Top 10 Security Checklist - Comprehensive

This checklist covers the key aspects of mitigating risks associated with the OWASP Top 10 vulnerabilities. It’s designed to be a starting point and should be tailored to your specific application, environment, and risk tolerance.

**I. Injection (A1 – 20% of vulnerabilities)**

* **[ ] Input Validation Everywhere:** Implement strict input validation on *all* user-supplied data, including URL parameters, form fields, API requests, and file uploads.
* **[ ] Use Parameterized Queries/Prepared Statements:**  Never concatenate user input directly into SQL queries. Employ parameterized queries or prepared statements to separate data from commands.
* **[ ] Escape Output:** Properly escape data before displaying it to prevent Cross-Site Scripting (XSS).
* **[ ] Regular Expression Validation:** Use regular expressions judiciously and understand their limitations.  Incorrectly written regex can create vulnerabilities.
* **[ ] Stored Procedures:** Utilize stored procedures to minimize direct database access.
* **[ ] Limit User Privileges:** Grant database users only the minimum privileges necessary for their tasks.


**II. Broken Authentication (A2 – 17% of vulnerabilities)**

* **[ ] Strong Password Policies:** Enforce strong password policies (length, complexity, entropy) and require regular password updates.
* **[ ] Multi-Factor Authentication (MFA):** Implement MFA wherever possible for all user accounts, especially privileged accounts.
* **[ ] Secure Session Management:**
    *  Use secure session identifiers (UUIDs recommended).
    *  Implement session timeout settings.
    *  Invalidate sessions upon logout.
    *  Protect session cookies with HTTPOnly and Secure flags.
* **[ ] Account Lockout Policies:** Implement account lockout after multiple failed login attempts.
* **[ ] Monitor Login Attempts:** Log and monitor all login attempts (successful and failed) to detect brute-force attacks.


**III. Sensitive Data Exposure (A3 – 13% of vulnerabilities)**

* **[ ] Data Classification:** Identify and classify all sensitive data (PII, financial data, etc.).
* **[ ] Encryption at Rest:** Encrypt sensitive data stored in databases, file systems, and backups.
* **[ ] Encryption in Transit:** Use TLS/SSL for all communication between clients and servers.
* **[ ] Secure Storage of Secrets:**  Don’t store credentials or API keys directly in code or configuration files. Utilize a dedicated secret management solution (e.g., HashiCorp Vault, AWS Secrets Manager).
* **[ ]  Data Masking/Tokenization:** Implement data masking or tokenization for non-production environments.


**IV. XML External Entities (XEE) (A4 – 8% of vulnerabilities)**

* **[ ] Disable XEE:** Disable the processing of external entities in XML parsers. (This is crucial for legacy systems).
* **[ ] Input Validation:** Validate XML input to ensure it adheres to a trusted schema.



**V. Broken Access Control (A5 – 8% of vulnerabilities)**

* **[ ] Implement Least Privilege:** Grant users only the minimum permissions necessary to perform their tasks.
* **[ ] Role-Based Access Control (RBAC):** Utilize RBAC to manage user permissions based on their roles.
* **[ ] Authorization Checks:** Implement strict authorization checks on *every* access request to ensure users are allowed to access the requested resource.
* **[ ] Prevent Horizontal Privilege Escalation:** Ensure users cannot access resources belonging to other users or groups.
* **[ ] Prevent Vertical Privilege Escalation:**  Prevent users from gaining access to administrative functions without proper authorization.


**VI. Security Misconfiguration (A6 – 7% of vulnerabilities)**

* **[ ] Default Configurations:** Change
