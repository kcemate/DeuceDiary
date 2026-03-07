# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-03T16:55:43.217309

Okay, here's a comprehensive security checklist covering the OWASP Top 10 vulnerabilities, designed to be adaptable to various applications and environments. It's broken down by vulnerability category with actionable steps. **This is a starting point – you'll need to tailor it to your specific application, technology stack, and risk tolerance.**

**Disclaimer:**  This checklist is for informational purposes only and does not constitute professional security advice.  It’s crucial to conduct thorough risk assessments and engage with security professionals for a robust security posture.

---

**OWASP Top 10 Security Checklist**

**1. Injection (A1)** -  (SQL Injection, Command Injection, etc.)

* **☐ Risk Assessment:** Conduct a risk assessment to identify potential injection points within your application.
* **☐ Parameterized Queries/Prepared Statements:**  *Always* use parameterized queries or prepared statements for all database interactions. *Never* concatenate user input directly into SQL queries.
* **☐ Input Validation & Sanitization:** Implement strict input validation and sanitization on *all* user-supplied data, including:
    *   Whitelist expected input types (e.g., integers, emails, dates).
    *   Use a library or framework designed for input validation and sanitization.
    *   Sanitize based on the vulnerability -  e.g., HTML escaping for display, escaping special characters for shell commands.
* **☐ Principle of Least Privilege:** Database users should have only the minimum privileges necessary for their tasks.
* **☐ Regularly Audit Queries:** Review database queries to identify and remediate potential vulnerabilities.


**2. Broken Authentication (A2)** - (Weak Passwords, Session Management, Multi-Factor Authentication)

* **☐ Strong Password Policies:** Enforce strong password complexity requirements (length, character types).  Consider using a password manager integration.
* **☐ Multi-Factor Authentication (MFA):**  Implement MFA wherever possible, especially for administrative accounts and sensitive data.
* **☐ Secure Session Management:**
    *   Use secure session IDs (long, random, unpredictable).
    *   Set appropriate session timeouts.
    *   Regenerate session IDs after login and privilege changes.
    *   Protect session cookies (HttpOnly, Secure).
* **☐ Secure Logout:** Implement a robust logout mechanism that invalidates all session data.
* **☐ Account Lockout:** Implement account lockout policies after multiple failed login attempts.
* **☐ Consider Passwordless Authentication:** Evaluate options like WebAuthn for stronger and more secure authentication.



**3. Sensitive Data Exposure (A3)** - (Storing/Transmitting Secrets, Insecure Data Storage)

* **☐ Data Classification:**  Identify and classify data based on sensitivity (e.g., PII, financial data, health information).
* **☐ Encryption at Rest:** Encrypt sensitive data at rest using strong encryption algorithms. Utilize a Key Management System (KMS).
* **☐ Encryption in Transit:**  *Always* use HTTPS (TLS/SSL) for all communication channels.  Enforce HSTS (HTTP Strict Transport Security).
* **☐ Secure Secrets Management:**
    *   Never store secrets (passwords, API keys, certificates) in code or configuration files.
    *   Use a dedicated secrets management solution (e.g., HashiCorp Vault, AWS Secrets Manager, Azure Key Vault).
* **☐ Minimize Data Collection:** Only collect the minimum amount of data necessary for the application’s functionality.
* **☐ Secure Data Storage:**  Use secure data storage practices, including access controls and regular backups.



**4. XML External Entities (XXE) (A4)** - (Exploiting XML Parsing Vulnerabilities)

* **☐ Disable External Entity Resolution:** Configure XML parsers to *strictly* disable external entity resolution.  This is the most
