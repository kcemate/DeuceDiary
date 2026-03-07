# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-04T00:28:23.195941

Okay, here’s a comprehensive security checklist covering the OWASP Top 10 vulnerabilities, categorized for clarity and with actionable steps. This checklist is designed to be used as a starting point and should be adapted to your specific application and environment.

**Important Disclaimer:** This checklist is a guide, not a definitive solution.  Regular penetration testing, vulnerability scanning, and code reviews are crucial for a robust security posture.

---

**I. Application Security - OWASP Top 10 Checklist**

**1. Injection (SQL, Command, XSS, LDAP)**

* **Risk Level:** High
* **Description:** Exploits vulnerabilities when user-supplied data is not properly sanitized, allowing attackers to inject malicious code.
* **Checklist Items:**
    * [ ] **Input Validation:** Implement strict input validation on *all* user-supplied data (parameters, cookies, headers, form data) at the database, command, and presentation layers. Use whitelisting (allow only known good characters) instead of blacklisting.
    * [ ] **Parameterized Queries/Prepared Statements:**  Always use parameterized queries or prepared statements for database interactions to prevent SQL injection.
    * [ ] **Output Encoding:**  Encode output correctly for all user-facing content to prevent Cross-Site Scripting (XSS).  Use context-aware encoding.
    * [ ] **Command Injection Prevention:**  Avoid using `eval()` or functions that directly execute user-provided input as commands. Utilize safer alternatives.
    * [ ] **Escaping/Canonicalization:** For LDAP, properly escape or canonicalize user input to prevent injection.
    * [ ] **Regularly Update Libraries:** Ensure all libraries and frameworks used are up to date and patched against known vulnerabilities.

**2. Broken Authentication**

* **Risk Level:** High
* **Description:** Weaknesses in authentication and session management allow attackers to compromise user accounts.
* **Checklist Items:**
    * [ ] **Strong Password Policies:** Enforce strong password policies (length, complexity, rotation).
    * [ ] **Multi-Factor Authentication (MFA):** Implement MFA wherever possible, especially for privileged accounts.
    * [ ] **Secure Session Management:** Use strong, unpredictable session IDs; HTTPOnly and Secure flags for cookies; session timeouts.
    * [ ] **Rate Limiting:** Implement rate limiting to prevent brute-force attacks.
    * [ ] **Password Storage:** Store passwords using a strong, salted and hashed algorithm (e.g., bcrypt, Argon2). *Never* store passwords in plain text.
    * [ ] **Account Lockout:** Implement account lockout mechanisms after failed login attempts.

**3. Sensitive Data Exposure**

* **Risk Level:** High
* **Description:** Unprotected exposure of sensitive information (PII, API keys, credentials) leads to data breaches.
* **Checklist Items:**
    * [ ] **Data Classification:** Identify and classify sensitive data based on its criticality.
    * [ ] **Encryption:** Encrypt sensitive data at rest and in transit (using TLS/SSL).
    * [ ] **Tokenization/Masking:**  Use tokenization or masking for sensitive data when it's not actively needed.
    * [ ] **Access Control:** Implement strict access controls based on the principle of least privilege.
    * [ ] **Regular Audits:**  Conduct regular audits of data access and usage.
    * [ ] **Secure Configuration:** Secure the configuration of databases and servers to prevent default credentials and expose sensitive data.


**4. Broken Access Control**

* **Risk Level:** High
* **Description:** Issues with access control mechanisms allow attackers to access unauthorized resources or functionality.
* **Checklist Items:**
    * [ ] **Role-Based Access Control (RBAC):** Implement RBAC to manage
