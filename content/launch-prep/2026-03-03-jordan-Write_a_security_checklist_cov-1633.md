# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-03T16:33:08.306016

Okay, here's a comprehensive security checklist covering the OWASP Top 10 vulnerabilities, designed to be used as a starting point for assessing your applications and systems.  It’s broken down by vulnerability category and includes recommended checks, tools, and considerations.

**Important Disclaimer:** This is a general checklist. The specific checks required will vary dramatically based on your application's architecture, technology stack, and business context.  It's *not* a substitute for professional security audits and penetration testing.

---

**I. Injection (A - Highest Risk)**

* **Description:** Attackers insert malicious code (SQL, Command, XSS) into input fields to compromise the system.
* **Checks:**
    * **Input Validation:** Implement strict input validation at *all* entry points (client-side and server-side). Use whitelisting (allowing only known good characters/formats) rather than blacklisting (blocking known bad ones).
    * **Parameterized Queries/Prepared Statements:**  *Always* use parameterized queries or prepared statements when interacting with databases. This prevents user input from being interpreted as code.
    * **Stored Procedures:** Employ stored procedures with parameterization for database interactions.
    * **Command Injection Prevention:**  Avoid executing system commands based on user input. If unavoidable, use robust escaping and parameterization.
    * **Encoding Output:** Properly encode output (HTML escaping, URL encoding, etc.) to prevent XSS.
* **Tools:** Static code analysis tools (e.g., SonarQube, Veracode), SQL Injection Scanners,  Manual Code Review
* **Considerations:**  Different injection types require different defenses.  Focus on the most likely vectors for your application.

**II. Broken Authentication (B - Highest Risk)**

* **Description:** Weak or poorly implemented authentication mechanisms allow attackers to impersonate users.
* **Checks:**
    * **Strong Password Policies:** Enforce strong password complexity requirements (length, character types).
    * **Multi-Factor Authentication (MFA):** Implement MFA wherever possible – especially for privileged accounts.
    * **Session Management:** Use secure session IDs, timeouts, and invalidate sessions upon logout.
    * **Rate Limiting:** Limit login attempts to prevent brute-force attacks.
    * **Secure Cookie Handling:** Set secure and HttpOnly flags on cookies.
    * **Password Reset Mechanisms:**  Implement a secure and robust password reset process (including email verification).
* **Tools:** Vulnerability Scanners (e.g., OWASP ZAP, Burp Suite), Security Audits
* **Considerations:**  Authentication isn't just about passwords. Consider federation, single sign-on (SSO), and appropriate authorization controls.

**III. Sensitive Data Exposure (C - High Risk)**

* **Description:** Unprotected sensitive data (credentials, personal information, API keys) is exposed to unauthorized access.
* **Checks:**
    * **Data Classification:** Identify and classify sensitive data.
    * **Encryption:** Encrypt sensitive data at rest and in transit (TLS/SSL).  Use strong encryption algorithms.
    * **Tokenization/Masking:**  Use tokenization or masking for sensitive data in non-production environments.
    * **Secure Storage:** Store credentials and API keys securely (e.g., HashiCorp Vault, AWS Secrets Manager).  Never hardcode them.
    * **Access Control:** Implement strict access control policies based on the principle of least privilege.
* **Tools:** Static Code Analysis, Configuration Management Tools, Data Loss Prevention (DLP) tools
* **Considerations:**  This extends beyond data storage. Consider how data is transmitted, processed, and displayed.

**IV. Broken Access Control (D - High Risk)**

* **Description:** Flaws in access control mechanisms allow users to
