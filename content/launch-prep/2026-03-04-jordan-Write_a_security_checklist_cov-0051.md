# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-04T00:51:06.503070

Okay, here's a comprehensive security checklist covering the OWASP Top 10 vulnerabilities, broken down by category and with actionable steps. This checklist is designed to be adaptable to different applications and levels of technical expertise.  It’s a starting point – you’ll need to tailor it to your specific project and environment.

**Important Notes Before You Start:**

* **Risk Assessment:**  This checklist is most effective when used in conjunction with a thorough risk assessment. Prioritize vulnerabilities based on their potential impact and likelihood.
* **Automation:** Where possible, automate testing and scanning to ensure consistent coverage.
* **Regular Updates:**  Security threats evolve constantly. Regularly review and update this checklist and your security practices.
* **Team Involvement:** Security is a shared responsibility. Involve developers, operations, and security teams in the process.

---

**I. Injection (Top Risk - Critical)**

* **Description:** Exploits vulnerabilities where user-supplied data is improperly processed and executed as code, leading to unauthorized access, data modification, or system compromise.
* **Checklist Items:**
    * [ ] **Input Validation:**  Implement strict input validation on *all* user-supplied data (forms, URL parameters, API requests, etc.). Use whitelisting (allowing only known good inputs) instead of blacklisting (blocking known bad inputs).
    * [ ] **Output Encoding:** Properly encode output data before displaying it to prevent cross-site scripting (XSS).
    * [ ] **Parameterized Queries/Prepared Statements:**  Use parameterized queries or prepared statements for all database interactions to prevent SQL injection.
    * [ ] **Command Injection Prevention:** If your application executes system commands, use a safe method like libraries with proper escaping or avoid command execution altogether.
    * [ ] **Review Code:**  Conduct static code analysis to identify potential injection vulnerabilities.

**II. Broken Authentication (Critical)**

* **Description:**  Weaknesses in authentication mechanisms allow attackers to impersonate users, gain unauthorized access, or compromise accounts.
* **Checklist Items:**
    * [ ] **Strong Password Policies:** Enforce strong password requirements (length, complexity, rotation).
    * [ ] **Multi-Factor Authentication (MFA):** Implement MFA for all users, especially those with privileged access.
    * [ ] **Session Management:**  Securely manage user sessions (random session identifiers, expiration times, HTTPOnly/Secure flags).
    * [ ] **Authentication Protocol:**  Use secure authentication protocols like OAuth 2.0 or OpenID Connect instead of custom or insecure ones.
    * [ ] **Brute-Force Protection:** Implement rate limiting and CAPTCHAs to prevent brute-force attacks.
    * [ ] **Account Lockout:** Implement account lockout policies after multiple failed login attempts.


**III. Sensitive Data Exposure (High)**

* **Description:**  Failure to protect sensitive data (PII, credentials, API keys) in transit and at rest, leading to data breaches.
* **Checklist Items:**
    * [ ] **Data Classification:**  Identify and classify all sensitive data.
    * [ ] **Encryption at Rest:** Encrypt sensitive data stored in databases, filesystems, and backups. Use strong encryption algorithms.
    * [ ] **Encryption in Transit:** Use HTTPS for all communication between clients and servers. Enforce TLS 1.2 or higher.
    * [ ] **Tokenization/Masking:**  Consider tokenization or masking sensitive data when it's not actively being used.
    * [ ] **Access Control:** Implement granular access controls to restrict access to sensitive data based on the principle of least privilege.


**IV. Broken Access Control (High)**

* **Description:**  Vulnerabilities that allow users to access resources or perform actions they shouldn't be authorized to do.
